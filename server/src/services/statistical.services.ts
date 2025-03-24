import { StatisticalOverviewRequestsBody } from '~/models/requests/statistical.requests'
import databaseService from './database.services'
import { formatDateOnlyDayAndMonthAndYear } from '~/utils/date.utils'
import { OrderStatusEnum } from '~/constants/orders.constants'
import {
  AggregatedStats,
  ComparisonStats,
  DailyStats,
  OverviewResponseWithComparison
} from '~/constants/statistical.constants'

class StatisticalService {
  async overview(payload: StatisticalOverviewRequestsBody): Promise<OverviewResponseWithComparison> {
    const currentDate = new Date()
    const timePeriod = payload.time || 0
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
}

const statisticalService = new StatisticalService()
export default statisticalService
