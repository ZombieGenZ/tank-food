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

export interface AggregatedStats extends Document {
  totalOrders: number
  totalProducts: number
  totalNewCustomers: number
  totalRevenue: number
}

export interface ComparisonStats {
  totalOrders: number
  totalProducts: number
  totalNewCustomers: number
  totalRevenue: number
}

export interface OverviewResponseWithComparison extends OverviewResponse {
  comparison: {
    totalOrdersChange: number
    totalProductsChange: number
    totalNewCustomersChange: number
    totalRevenueChange: number
  }
}
