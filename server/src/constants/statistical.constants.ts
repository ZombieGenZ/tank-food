export interface DailyStats {
  date: string
  ordersCount: number
  productsCount: number
  newCustomers: number
  revenue: number
}

export interface OverviewResponse {
  totalOrders: number
  totalProducts: number
  totalNewCustomers: number
  totalRevenue: number
  dailyBreakdown: DailyStats[]
}
