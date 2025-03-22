import { StatisticalOverviewRequestsBody } from '~/models/requests/statistical.requests'
import databaseService from './database.services'
import { OverviewResponse, DailyStats } from '~/constants/statistical.constants'
import { formatDateOnlyDayAndMonthAndYear } from '~/utils/date.utils'
import { OrderStatusEnum } from '~/constants/orders.constants'

class StatisticalService {
  async overview(payload: StatisticalOverviewRequestsBody): Promise<OverviewResponse> {
    const currentDate = new Date()
    const startDate = new Date(currentDate)
    startDate.setDate(currentDate.getDate() - (payload.time || 0))

    const aggregationResult = await databaseService.order
      .aggregate([
        {
          $match: {
            created_at: {
              $gte: startDate,
              $lte: currentDate
            },
            order_status: OrderStatusEnum.COMPLETED
          }
        },
        {
          $facet: {
            totals: [
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
            ],
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
    const totals = result.totals[0] || {
      totalOrders: 0,
      totalProducts: 0,
      totalNewCustomers: 0,
      totalRevenue: 0
    }

    const allDays: DailyStats[] = []
    const tempDate = new Date(startDate)
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
    return {
      totalOrders: totals.totalOrders,
      totalProducts: totals.totalProducts,
      totalNewCustomers: totals.totalNewCustomers,
      totalRevenue: totals.totalRevenue,
      dailyBreakdown
    }
  }
}

const statisticalService = new StatisticalService()
export default statisticalService
