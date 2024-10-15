export {}
declare global {
  interface Window {
    IMP: any
  }
}

type RequestPayAdditionalParams = {
  digital?: boolean
  vbank_due?: string
  m_redirect_url?: string
  app_scheme?: string
  biz_num?: string
}

type Display = {
  card_quota?: number[]
}

type RequestPayParams = RequestPayAdditionalParams & {
  pg?: string
  pay_method: string
  escrow?: boolean
  merchant_uid: string
  name?: string
  amount: number
  custom_data?: any
  tax_free?: number
  currency?: string
  language?: string
  buyer_name?: string
  buyer_tel: string
  buyer_email?: string
  buyer_addr?: string
  buyer_postcode?: string
  notice_url?: string | string[]
  display?: Display
}

type RequestPayAdditionalResponse = {
  apply_num?: string
  vbank_num?: string
  vbank_name?: string
  vbank_holder?: string | null
  vbank_date?: number
}

type RequestPayResponse = RequestPayAdditionalResponse & {
  success: boolean
  error_code: string
  error_msg: string
  imp_uid: string | null
  merchant_uid: string
  pay_method?: string
  paid_amount?: number
  status?: string
  name?: string
  pg_provider?: string
  pg_tid?: string
  buyer_name?: string
  buyer_email?: string
  buyer_tel?: string
  buyer_addr?: string
  buyer_postcode?: string
  custom_data?: any
  paid_at?: number
  receipt_url?: string
}
