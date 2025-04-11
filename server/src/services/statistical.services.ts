import databaseService from './database.services'
import { formatDateFull2, formatDateOnlyDayAndMonthAndYear } from '~/utils/date.utils'
import { DeliveryTypeEnum, OrderStatusEnum, PaymentStatusEnum, PaymentTypeEnum } from '~/constants/orders.constants'
import {
  AggregatedStats,
  ComparisonStats,
  DailyStats,
  OverviewResponseWithComparison
} from '~/constants/statistical.constants'
import axios from 'axios'
import ExcelJS from 'exceljs'
import { LANGUAGE } from '~/constants/language.constants'

const CF_API_URL = 'https://api.cloudflare.com/client/v4/graphql'
const CF_EMAIL = process.env.CLOUDFLARE_EMAIL as string
const CF_API_KEY = process.env.CLOUDFLARE_API_KEY as string
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID as string
const START_DATE_STRING = process.env.CLOUDFLARE_START_ANALYTICS_DATE as string

class StatisticalService {
  async overview(time: number): Promise<OverviewResponseWithComparison> {
    const currentDate = new Date()
    const timePeriod = time || 0
    const currentStartDate = new Date(currentDate)
    currentStartDate.setDate(currentDate.getDate() - timePeriod)
    const previousEndDate = new Date(currentStartDate)
    previousEndDate.setDate(previousEndDate.getDate() - 1)
    const previousStartDate = new Date(previousEndDate)
    previousStartDate.setDate(previousEndDate.getDate() - timePeriod)

    const [currentStats, previousStats] = await Promise.all([
      this.getPeriodStats(currentStartDate, currentDate),
      this.getPeriodStats(previousStartDate, previousEndDate)
    ])

    const aggregationResult = await databaseService.order
      .aggregate([
        {
          $match: {
            created_at: {
              $gte: currentStartDate,
              $lte: currentDate
            },
            order_status: OrderStatusEnum.COMPLETED
          }
        },
        {
          $facet: {
            daily: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$created_at'
                    }
                  },
                  ordersCount: { $sum: 1 },
                  productsCount: { $sum: '$total_quantity' },
                  newCustomers: {
                    $sum: { $cond: ['$is_first_transaction', 1, 0] }
                  },
                  revenue: {
                    $sum: {
                      $add: ['$total_price', { $multiply: ['$fee', 0.15] }]
                    }
                  }
                }
              },
              {
                $sort: {
                  _id: 1
                }
              }
            ]
          }
        }
      ])
      .toArray()

    const result = aggregationResult[0]
    const allDays: DailyStats[] = []
    const tempDate = new Date(currentStartDate)
    while (tempDate <= currentDate) {
      allDays.push({
        date: formatDateOnlyDayAndMonthAndYear(new Date(tempDate)),
        ordersCount: 0,
        productsCount: 0,
        newCustomers: 0,
        revenue: 0
      })
      tempDate.setDate(tempDate.getDate() + 1)
    }

    const dailyBreakdownMap = new Map<string, DailyStats>(
      result.daily.map((day: any) => [
        formatDateOnlyDayAndMonthAndYear(new Date(day._id)),
        {
          date: formatDateOnlyDayAndMonthAndYear(new Date(day._id)),
          ordersCount: day.ordersCount,
          productsCount: day.productsCount,
          newCustomers: day.newCustomers,
          revenue: day.revenue
        }
      ])
    )

    const dailyBreakdown: DailyStats[] = allDays.map((day) => dailyBreakdownMap.get(day.date) || day)

    const comparison = {
      totalOrdersChange: this.calculatePercentageChange(currentStats.totalOrders, previousStats.totalOrders),
      totalProductsChange: this.calculatePercentageChange(currentStats.totalProducts, previousStats.totalProducts),
      totalNewCustomersChange: this.calculatePercentageChange(
        currentStats.totalNewCustomers,
        previousStats.totalNewCustomers
      ),
      totalRevenueChange: this.calculatePercentageChange(currentStats.totalRevenue, previousStats.totalRevenue)
    }

    return {
      totalOrders: currentStats.totalOrders,
      totalProducts: currentStats.totalProducts,
      totalNewCustomers: currentStats.totalNewCustomers,
      totalRevenue: currentStats.totalRevenue,
      dailyBreakdown,
      comparison
    }
  }
  private async getPeriodStats(startDate: Date, endDate: Date): Promise<ComparisonStats> {
    const result = await databaseService.order
      .aggregate<AggregatedStats>([
        {
          $match: {
            created_at: {
              $gte: startDate,
              $lte: endDate
            },
            order_status: OrderStatusEnum.COMPLETED
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalProducts: { $sum: '$total_quantity' },
            totalNewCustomers: {
              $sum: { $cond: ['$is_first_transaction', 1, 0] }
            },
            totalRevenue: {
              $sum: {
                $add: ['$total_price', { $multiply: ['$fee', 0.15] }]
              }
            }
          }
        }
      ])
      .toArray()

    return (
      result[0] || {
        totalOrders: 0,
        totalProducts: 0,
        totalNewCustomers: 0,
        totalRevenue: 0
      }
    )
  }
  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current === 0 ? 0 : current > 0 ? 100 : -100
    }
    const change = ((current - previous) / previous) * 100
    const rounded = Math.round(change * 10) / 10
    return Number(rounded.toFixed(1))
  }
  async totalRequests() {
    try {
      const END_DATE = new Date().toISOString().split('T')[0]
      const START_DATE = new Date(START_DATE_STRING).toISOString().split('T')[0]

      const query = {
        query: `
        {
          viewer {
            zones(filter: { zoneTag: "${CF_ZONE_ID}" }) {
              httpRequests1dGroups(limit: 10, filter: { date_geq: "${START_DATE}", date_leq: "${END_DATE}" }) {
                sum {
                  requests
                }
                dimensions {
                  date
                }
              }
            }
          }
        }`
      }

      const response = await axios.post(CF_API_URL, query, {
        headers: {
          'X-Auth-Email': CF_EMAIL,
          'X-Auth-Key': CF_API_KEY,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.errors) {
        return 0
      }

      const analyticsData = response.data.data.viewer.zones[0].httpRequests1dGroups
      return analyticsData.reduce((sum: number, item: any) => sum + item.sum.requests, 0)
    } catch (error: any) {
      return 0
    }
  }
  async exportStatistical(time: number, language: string) {
    const currentDate = new Date()
    const timePeriod = time || 0
    const currentStartDate = new Date(currentDate)
    currentStartDate.setDate(currentDate.getDate() - timePeriod)

    const orders = await databaseService.order
        .aggregate([
            {
                $match: {
                    order_status: OrderStatusEnum.COMPLETED,
                    created_at: {
                        $gte: currentStartDate,
                        $lte: currentDate,
                    }
                }
            },
            {
                $lookup: {
                    from: process.env.DATABASE_PRODUCT_COLLECTION as string,
                    localField: 'product.product_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            {
                $lookup: {
                    from: process.env.DATABASE_CATEGORY_COLLECTION as string,
                    localField: 'product_details.category',
                    foreignField: '_id',
                    as: 'category_details'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'shipper',
                    foreignField: '_id',
                    as: 'shipper_details'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user_details'
                }
            },
            {
                $addFields: {
                    product: {
                        $map: {
                            input: '$product',
                            as: 'p',
                            in: {
                                $mergeObjects: [
                                    '$$p',
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$product_details',
                                                    as: 'pd',
                                                    cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                                                }
                                            },
                                            0
                                        ]
                                    },
                                    {
                                        category: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: '$category_details',
                                                        as: 'cd',
                                                        cond: {
                                                            $eq: [
                                                                {
                                                                    $let: {
                                                                        vars: {
                                                                            productDetail: {
                                                                                $arrayElemAt: [
                                                                                    {
                                                                                        $filter: {
                                                                                            input: '$product_details',
                                                                                            as: 'pd',
                                                                                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                                                                                        }
                                                                                    },
                                                                                    0
                                                                                ]
                                                                            }
                                                                        },
                                                                        in: '$$productDetail.category'
                                                                    }
                                                                },
                                                                '$$cd._id'
                                                            ]
                                                        }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    shipper_info: {
                        $arrayElemAt: ['$shipper_details', 0]
                    },
                    user_info: {
                        $arrayElemAt: ['$user_details', 0]
                    }
                },
            },
            {
                $project: {
                    _id: 1,
                    product: 1,
                    total_quantity: 1,
                    total_price: 1,
                    discount_code: 1,
                    fee: 1,
                    vat: 1,
                    total_bill: 1,
                    delivery_type: 1,
                    shipper: 1,
                    user: 1,
                    shipper_info: 1,
                    user_info: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    delivery_address: 1,
                    receiving_address: 1,
                    delivery_nation: 1,
                    receiving_nation: 1,
                    delivery_longitude: 1,
                    delivery_latitude: 1,
                    receiving_longitude: 1,
                    receiving_latitude: 1,
                    distance: 1,
                    suggested_route: 1,
                    estimated_time: 1,
                    node: 1,
                    is_first_transaction: 1,
                    payment_type: 1,
                    payment_status: 1,
                    order_status: 1,
                    cancellation_reason: 1,
                    moderated_by: 1,
                    canceled_by: 1,
                    created_at: 1,
                    confirmmed_at: 1,
                    delivering_at: 1,
                    delivered_at: 1,
                    completed_at: 1,
                    updated_at: 1,
                    canceled_at: 1
                }
            },
            {
                $sort: { created_at: 1 }
            }
        ])
        .toArray()

    const chart = await this.overview(time)

    const workbook = new ExcelJS.Workbook()

    workbook.creator =
        language === LANGUAGE.VIETNAMESE
            ? `Hệ thống ${process.env.TRADEMARK_NAME}`
            : `${process.env.TRADEMARK_NAME} System`
    workbook.created = currentDate
    workbook.modified = currentDate

    const overviewSheet = workbook.addWorksheet(
      language == LANGUAGE.VIETNAMESE
        ? `Tổng quan - ${process.env.TRADEMARK_NAME}`
        : `Overview - ${process.env.TRADEMARK_NAME}`
    )

    overviewSheet.addRow([
      language === LANGUAGE.VIETNAMESE
          ? `Bản quyền: © ${currentDate.getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.`
          : `Copyright: © ${currentDate.getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.`
    ])
    overviewSheet.mergeCells('A1:B1')

    overviewSheet.addRow([
        language === LANGUAGE.VIETNAMESE ? `Người tạo: ${workbook.creator}` : `Creator: ${workbook.creator}`
    ])
    overviewSheet.mergeCells('A2:B2')

    const overviewCreationTimeRow = overviewSheet.addRow([
        language === LANGUAGE.VIETNAMESE
            ? `Thời gian tạo: ${formatDateFull2(currentDate)}`
            : `Creation Time: ${formatDateFull2(currentDate)}`
    ])
    overviewCreationTimeRow.getCell(1).numFmt = 'dd-mm-yyyy hh:mm:ss'
    overviewSheet.mergeCells('A3:B3')

    overviewSheet.addRow([
        language === LANGUAGE.VIETNAMESE
            ? `Thời gian thống kê: ${time} ngày`
            : `Statistical Time: ${time} days`
    ])
    overviewSheet.mergeCells('A4:B4')

    overviewSheet.addRow([])

    overviewSheet.addRow([
        language === LANGUAGE.VIETNAMESE ? 'Thống kê tổng quan' : 'Overview Statistics'
    ])
    overviewSheet.mergeCells('A6:D6')
    overviewSheet.getCell('A6').font = { bold: true, size: 14 }
    overviewSheet.getCell('A6').alignment = { horizontal: 'center' }

    const statsRow = overviewSheet.addRow(
        language === LANGUAGE.VIETNAMESE
            ? ['Tổng đơn hàng', 'Số khách hàng mới', 'Số sản phẩm đã bán', 'Doanh thu']
            : ['Total Orders', 'New Customers', 'Number of Products Sold', 'Revenue']
    )
    statsRow.font = { bold: true, color: { argb: 'FF0000FF' } }
    statsRow.alignment = { horizontal: 'center' }
    statsRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (colNumber <= 4) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            }
        }
    })

    const valuesRow = overviewSheet.addRow(
        language === LANGUAGE.VIETNAMESE
            ? [
                  `${chart.totalOrders} đơn`,
                  `${chart.totalNewCustomers} khách hàng`,
                  `${chart.totalProducts} sản phẩm`,
                  chart.totalRevenue
              ]
            : [
                  `${chart.totalOrders} orders`,
                  `${chart.totalNewCustomers} customers`,
                  `${chart.totalProducts} products`,
                  chart.totalRevenue
              ]
    )
    valuesRow.font = { bold: true }
    valuesRow.alignment = { horizontal: 'center' }
    overviewSheet.getCell('D8').numFmt = '#,##0 "đ"'

    const changeRow = overviewSheet.addRow([
        `${chart.comparison.totalOrdersChange} ↑`,
        `${chart.comparison.totalNewCustomersChange} ↑`,
        `${chart.comparison.totalProductsChange} ↑`,
        `${chart.comparison.totalRevenueChange} ↑`
    ])
    changeRow.alignment = { horizontal: 'center' }
    changeRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        let changeValue;
        switch (colNumber) {
            case 1:
                changeValue = chart.comparison.totalOrdersChange
                break;
            case 2:
                changeValue = chart.comparison.totalNewCustomersChange
                break;
            case 3:
                changeValue = chart.comparison.totalProductsChange
                break;
            case 4:
                changeValue = chart.comparison.totalRevenueChange
                break;
            default:
                changeValue = 0
        }
        cell.font = {
            color: {
                argb: changeValue > 0 ? 'FF00FF00' : changeValue < 0 ? 'FFFF0000' : 'FFFFA500'
            }
        }
    })

    overviewSheet.getCell('A7').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE0B2' }
    }
    overviewSheet.getCell('A8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE0B2' }
    }
    overviewSheet.getCell('A9').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE0B2' }
    }

    overviewSheet.getCell('B7').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFBBDEFB' }
    }
    overviewSheet.getCell('B8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFBBDEFB' }
    }
    overviewSheet.getCell('B9').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFBBDEFB' }
    }

    overviewSheet.getCell('C7').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB2DFDB' }
    }
    overviewSheet.getCell('C8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB2DFDB' }
    }
    overviewSheet.getCell('C9').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB2DFDB' }
    }

    overviewSheet.getCell('D7').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE1BEE7' }
    }
    overviewSheet.getCell('D8').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE1BEE7' }
    }
    overviewSheet.getCell('D9').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE1BEE7' }
    }

    overviewSheet.getCell('D8').numFmt = '#,##0 VNĐ'

    overviewSheet.addRow([])

    overviewSheet.addRow([
        language === LANGUAGE.VIETNAMESE ? 'Thống kê theo ngày' : 'Statistics by Day'
    ])
    overviewSheet.mergeCells('A11:D11')
    overviewSheet.getCell('A11').font = { bold: true, size: 14 }
    overviewSheet.getCell('A11').alignment = { horizontal: 'center' }

    const dailyHeader = overviewSheet.addRow(
        language === LANGUAGE.VIETNAMESE
            ? ['Ngày', 'Số đơn hàng', 'Số sản phẩm', 'Doanh thu']
            : ['Date', 'Number of Orders', 'Number of Products', 'Revenue']
    )
    dailyHeader.font = { bold: true }
    dailyHeader.alignment = { horizontal: 'center' }
    dailyHeader.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (colNumber <= 4) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            }
        }
    })

    chart.dailyBreakdown.forEach((day: any) => {
        const row = overviewSheet.addRow([day.date, day.ordersCount, day.productsCount, day.revenue])
        row.getCell(1).numFmt = 'dd/mm/yyyy'
        row.getCell(4).numFmt = '#,##0 VNĐ'
    })

    overviewSheet.columns = [
        { width: 30 },
        { width: 30 },
        { width: 30 },
        { width: 40 }
    ]

    const dailyBreakdownStartRow = 12
    const dailyBreakdownEndRow = 12 + chart.dailyBreakdown.length

    const ranges = [
        { startRow: 7, endRow: 9, startCol: 'A', endCol: 'D' },
        { startRow: dailyBreakdownStartRow, endRow: dailyBreakdownEndRow, startCol: 'A', endCol: 'D' }
    ]

    ranges.forEach((range) => {
        for (let row = range.startRow; row <= range.endRow; row++) {
            for (let col = range.startCol.charCodeAt(0); col <= range.endCol.charCodeAt(0); col++) {
                const cell = overviewSheet.getCell(`${String.fromCharCode(col)}${row}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            }
        }
    })

    const orderSheet = workbook.addWorksheet(
      language == LANGUAGE.VIETNAMESE
        ? `Chi tiết đơn hàng - ${process.env.TRADEMARK_NAME}`
        : `Order Details - ${process.env.TRADEMARK_NAME}`
    )

    orderSheet.addRow([
      language === LANGUAGE.VIETNAMESE
          ? `Bản quyền: © ${currentDate.getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.`
          : `Copyright: © ${currentDate.getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.`
    ])
    orderSheet.mergeCells('A1:B1')
    
    orderSheet.addRow([
        language === LANGUAGE.VIETNAMESE ? `Người tạo: ${workbook.creator}` : `Creator: ${workbook.creator}`
    ])
    orderSheet.mergeCells('A2:B2')
    
    const orderCreationTimeRow = orderSheet.addRow([
        language === LANGUAGE.VIETNAMESE
            ? `Thời gian tạo: ${formatDateFull2(currentDate)}`
            : `Creation Time: ${formatDateFull2(currentDate)}`
    ])
    orderCreationTimeRow.getCell(1).numFmt = 'dd-mm-yyyy hh:mm:ss'
    orderSheet.mergeCells('A3:B3')
    
    orderSheet.addRow([
        language === LANGUAGE.VIETNAMESE
            ? `Thời gian thống kê: ${time} ngày`
            : `Statistical Time: ${time} days`
    ])
    orderSheet.mergeCells('A4:B4')
    
    orderSheet.addRow([])

    orderSheet.addRow([
        language === LANGUAGE.VIETNAMESE ? 'Chi tiết đơn hàng' : 'Order Details'
    ])
    orderSheet.mergeCells('A6:AT6')
    orderSheet.getCell('A6').font = { bold: true, size: 14 }
    orderSheet.getCell('A6').alignment = { horizontal: 'center' }

    const orderHeader = orderSheet.addRow(
      language == LANGUAGE.VIETNAMESE
        ? [
          'Mã đơn hàng',
          'Sản phẩm',
          'Số lượng',
          'Giá sản phẩm',
          'Giảm giá',
          'Giá thực tế',
          'Danh mục',
          'Tổng số lượng',
          'Tổng giá',
          'Mã giảm giá',
          'Phí vận chuyển',
          'Thuế (VAT)',
          'Tổng hóa đơn',
          'Loại đơn hàng',
          'Mã người giao hàng',
          'Tên người giao hàng',
          'Địa chỉ email người giao hàng',
          'Số điện thoại người giao hàng',
          'Mã khách hàng',
          'Tên khách hàng',
          'Địa chỉ email khách hàng',
          'Số điện thoại khách hàng',
          'Tên người nhận hàng',
          'Địa chỉ email người nhận',
          'Số điện thoại người nhận',
          'Địa chỉ giao hàng',
          'Địa chỉ nhận hàng',
          'Quốc gia giao hàng',
          'Quốc gia nhận hàng',
          'Kinh độ giao hàng',
          'Vĩ độ giao hàng',
          'Kinh độ nhận hàng',
          'Vĩ độ nhận hàng',
          'Khoảng cách',
          'Tuyến đường đề xuất',
          'Thời gian dự kiến',
          'Ghi chú',
          'Khách hàng mới',
          'Loại thanh toán',
          'Trạng thái thanh toán',
          'Trạng thái đơn hàng',
          'Thời gian tạo',
          'Thời gian xác nhận',
          'Thời gian giao',
          'Thời gian giao xong',
          'Thời gian hoàn thành'
        ]
        : [
          'Order ID',
          'Product',
          'Quantity',
          'Product Price',
          'Discount',
          'Actual Price',
          'Category',
          'Total Quantity',
          'Total Price',
          'Discount Code',
          'Shipping Fee',
          'Tax (VAT)',
          'Total Invoice',
          'Order Type',
          'Deliveryman Code',
          'Deliveryman Name',
          'Deliveryman Email Address',
          'Deliveryman Phone Number',
          'Customer Code',
          'Customer Name',
          'Customer Email Address',
          'Customer Phone Number',
          'Recipient Name',
          'Recipient Email Address',
          'Recipient Phone Number',
          'Delivery Address',
          'Shipping Address',
          'Delivery Country',
          'Shipping Country',
          'Delivery Longitude',
          'Delivery Latitude',
          'Shipping Longitude',
          'Shipping Latitude',
          'Distance',
          'Suggested Route',
          'Estimated Time',
          'Note',
          'New Customer',
          'Payment Type',
          'Payment Status',
          'Order Status',
          'Creation Time',
          'Confirmation Time',
          'Delivery Time',
          'Delivery Completed Time',
          'Completion Time'
        ]
    )
    orderHeader.font = { bold: true }
    orderHeader.alignment = { horizontal: 'center' }
    orderHeader.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (colNumber <= 46) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            }
        }
    })
    
    orders.forEach(order => {
        order.product.forEach((prod: any, index: number) => {
            const row = orderSheet.addRow([
                index === 0 ? order._id.toString() : '',
                language === LANGUAGE.VIETNAMESE
                    ? prod.title_translate_1_language === LANGUAGE.VIETNAMESE
                        ? prod.title_translate_1
                        : prod.title_translate_2
                    : prod.title_translate_1_language === LANGUAGE.ENGLISH
                        ? prod.title_translate_1
                        : prod.title_translate_2,
                prod.quantity || 0,
                prod.price || 0,
                prod.discount || 0,
                (prod.price || 0) - ((prod.price || 0) * (prod.discount || 0) / 100),
                prod.category
                ? prod.category.category_name_translate_1_language === language
                    ? prod.category.category_name_translate_1
                    : prod.category.category_name_translate_2_language === language
                        ? prod.category.category_name_translate_2
                        : prod.category.category_name_translate_1
                : '',
                index === 0 ? order.total_quantity || 0 : '',
                index === 0 ? order.total_price || 0 : '',
                index === 0 ? order.discount_code || '' : '',
                index === 0 ? order.fee || 0 : '',
                index === 0 ? order.vat || 0 : '',
                index === 0 ? order.total_bill || 0 : '',
                index === 0
                    ? order.delivery_type === DeliveryTypeEnum.COUNTER
                        ? language === LANGUAGE.VIETNAMESE
                            ? 'Tại quầy'
                            : 'At counter'
                        : language === LANGUAGE.VIETNAMESE
                            ? 'Giao hàng'
                            : 'Delivery'
                    : '',
                index === 0 ? order.shipper?.toString() || '' : '',
                index === 0 ? order.shipper_info?.display_name || '' : '',
                index === 0 ? order.shipper_info?.email || '' : '',
                index === 0 ? order.shipper_info?.phone || '' : '',
                index === 0 ? order.user?.toString() || '' : '',
                index === 0 ? order.user_info?.display_name || '' : '',
                index === 0 ? order.user_info?.email || '' : '',
                index === 0 ? order.user_info?.phone || '' : '',
                index === 0 ? order.name || '' : '',
                index === 0 ? order.email || '' : '',
                index === 0 ? order.phone || '' : '',
                index === 0 ? order.delivery_address || '' : '',
                index === 0 ? order.receiving_address || '' : '',
                index === 0 ? order.delivery_nation || '' : '',
                index === 0 ? order.receiving_nation || '' : '',
                index === 0 ? order.delivery_longitude || '' : '',
                index === 0 ? order.delivery_latitude || '' : '',
                index === 0 ? order.receiving_longitude || '' : '',
                index === 0 ? order.receiving_latitude || '' : '',
                index === 0 ? order.distance ? `${order.distance} Km` : '' : '',
                index === 0 ? order.suggested_route || '' : '',
                index === 0 ? order.estimated_time || '' : '',
                index === 0 ? order.node || '' : '',
                index === 0
                  ? order.is_first_transaction
                    ? language === LANGUAGE.VIETNAMESE
                      ? 'Đúng'
                      : 'Yes'
                    : language === LANGUAGE.VIETNAMESE
                      ? 'Không'
                      : 'No'
                  : '',
                index === 0
                    ? order.payment_type === PaymentTypeEnum.CASH
                        ? language === LANGUAGE.VIETNAMESE
                            ? 'Tiền mặt'
                            : 'Cash'
                        : language === LANGUAGE.VIETNAMESE
                            ? 'Chuyển khoản'
                            : 'Transfer'
                    : '',
                index === 0
                    ? order.payment_status === PaymentStatusEnum.PENDING
                        ? language === LANGUAGE.VIETNAMESE
                            ? 'Chưa thanh toán'
                            : 'Pending'
                        : order.payment_status === PaymentStatusEnum.PAID
                            ? language === LANGUAGE.VIETNAMESE
                                ? 'Đã thanh toán'
                                : 'Paid'
                            : language === LANGUAGE.VIETNAMESE
                                ? 'Thất bại'
                                : 'Failed'
                    : '',
                index === 0
                    ? order.order_status === OrderStatusEnum.PENDING
                        ? language === LANGUAGE.VIETNAMESE
                            ? 'Chờ xác nhận'
                            : 'Pending'
                        : order.order_status === OrderStatusEnum.CONFIRMED
                            ? language === LANGUAGE.VIETNAMESE
                                ? 'Đã xác nhận'
                                : 'Confirmed'
                            : order.order_status === OrderStatusEnum.DELIVERING
                                ? language === LANGUAGE.VIETNAMESE
                                    ? 'Đang giao hàng'
                                    : 'Delivering'
                                : order.order_status === OrderStatusEnum.DELIVERED
                                    ? language === LANGUAGE.VIETNAMESE
                                        ? 'Đã giao hàng'
                                        : 'Delivered'
                                    : order.order_status === OrderStatusEnum.COMPLETED
                                        ? language === LANGUAGE.VIETNAMESE
                                            ? 'Hoàn thành'
                                            : 'Completed'
                                        : language === LANGUAGE.VIETNAMESE
                                            ? 'Đã hủy'
                                            : 'Canceled'
                    : '',
                index === 0 ? order.created_at || '' : '',
                index === 0 ? order.confirmmed_at || '' : '',
                index === 0 ? order.delivering_at || '' : '',
                index === 0 ? order.delivered_at || '' : '',
                index === 0 ? order.completed_at || '' : ''
            ])
    
            row.getCell(3).numFmt = '#,##0'
            row.getCell(4).numFmt = '#,##0 VNĐ'
            row.getCell(5).numFmt = '#,##0'
            row.getCell(6).numFmt = '#,##0 VNĐ'
            row.getCell(8).numFmt = '#,##0'
            row.getCell(9).numFmt = '#,##0 VNĐ'
            row.getCell(11).numFmt = '#,##0 VNĐ'
            row.getCell(12).numFmt = '#,##0 VNĐ'
            row.getCell(13).numFmt = '#,##0 VNĐ'
    
            row.getCell(42).numFmt = 'dd/mm/yyyy hh:mm:ss'
            row.getCell(43).numFmt = 'dd/mm/yyyy hh:mm:ss'
            row.getCell(44).numFmt = 'dd/mm/yyyy hh:mm:ss'
            row.getCell(45).numFmt = 'dd/mm/yyyy hh:mm:ss'
            row.getCell(46).numFmt = 'dd/mm/yyyy hh:mm:ss'
        })
    })

    orderSheet.columns = [
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 40 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 }
    ]

    const columnToNumber = (col: string): number => {
      let num = 0;
      for (let i = 0; i < col.length; i++) {
          num = num * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1)
      }
      return num
    }

    const numberToColumn = (num: number): string => {
      let col = ''
      while (num > 0) {
          const remainder = (num - 1) % 26
          col = String.fromCharCode(65 + remainder) + col
          num = Math.floor((num - 1) / 26)
      }
      return col
    }

    const orderRanges = [
      {
          startRow: 7,
          endRow: 7 + orders.reduce((acc, order) => acc + order.product.length, 0),
          startCol: 'A',
          endCol: 'AT'
      }
    ]

    orderRanges.forEach((range) => {
      const startColNum = columnToNumber(range.startCol)
      const endColNum = columnToNumber(range.endCol)

      for (let row = range.startRow; row <= range.endRow; row++) {
          for (let colNum = startColNum; colNum <= endColNum; colNum++) {
              const colLetter = numberToColumn(colNum)
              const cell = orderSheet.getCell(`${colLetter}${row}`)
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              }
          }
      }
    })

    return {
        buffer: await workbook.xlsx.writeBuffer(),
        start_date: currentStartDate,
        end_date: currentDate
    }
  }
}

const statisticalService = new StatisticalService()
export default statisticalService
