// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
