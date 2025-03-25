export interface GetAccountRequestsBody {
  language?: string
}

export interface BanAccountRequestsBody {
  language?: string
  user_id: string
  reason: string
  time: string
}

export interface UnBanAccountRequestsBody {
  language?: string
  user_id: string
}
