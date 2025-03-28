export interface SendContactRequestsBody {
  language?: string
  name: string
  email: string
  phone: string
  title: string
  content: string
}

export interface ResponseContactRequestsBody {
  language?: string
  contact_id: string
  user_id: string
  reply_content: string
  timestamp: Date
}
