/** 결제 시작 request */
type SalesPreRequest = {
  optIds: number[]
  brandId: {
    id: number
  }
  userId: number
  merchantUid: string
  totalAmount: number
  prodAmount: number
  pointAmount: number
  deliAmount: number
  payAmount: number
  recvInfo: AddressRequest
  payMethod: string
  escrowFlag: boolean
}

/** 결제 결과 request
 * - u : undefined
 * - s : success
 * - f : fail
 */
type SalesResultRequest = {
  salesId: number
  result: 'u' | 's' | 'f'
  merchantUid: string
}
/** 결제 결과 response */
type SalesResultResponse = {
  bankName: string
  account: string
  holder: string
  vbDate: string
  depositAmount: number
}

/** 주문내역 조회 - 결제 제품 정보 response */
type SalesProductResponse = {
  soId: number
  prodId: number
  optId: number
  subBrandName: string
  status: string
  name: string
  optCode: string
  imgLink: string
  priceSet: number
  badgeType: string
}

/** 구매내역 상품 조회 response type */
type SalesProductListResponse = SalesProductResponse & {
  snCode: string
  payDate: string
}

/** 주문내역 조회 - 결제 정보 response */
type SalesResponse = {
  salesId: number
  status: string
  payDate: string
  payMethod: string
  hasNoReview: boolean
  textReviewPointPre: number
  imageReviewPointPre: number
  spList: SalesProductResponse[]
}

/** 주문내역 조회 request */
type SalesListRequest = {
  salesIds: number[]
} & PaginationRequest

/** 주문내역 조회 response */
type SalesListResponse = PaginationResponse<SalesResponse>

/** 주문 취소/구매확정 request */
type SalesProductRequest = {
  salesId: number
  soIds: number[]
}
/** 주문 반품 신청 request */
type SalesProductReturnRequest = {
  salesId: number
  retList: [
    {
      soId: number
      retCode: string
      retMsg: string
    }
  ]
}

/** 구매 리뷰 등록 request */
type PostReviewBuyRequest = {
  starPoint: number
  message: string
  salesId: number
  imgFiles: File[]
}

/** 토스 결제 방법 타입 */
type PayMethodType =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'TRANSFER'
  | 'TOSSPAY'
  | 'NAVERPAY'
  | 'SAMSUNGPAY'
  | 'APPLEPAY'
  | 'LPAY'
  | 'KAKAOPAY'
  | 'PINPAY'
  | 'PAYCO'
  | 'SSG'
  | 'MOBILE_PHONE'
  | 'TRANSFER'
  | 'CULTURE_GIFT_CERTIFICATE'
  | 'BOOK_GIFT_CERTIFICATE'
  | 'GAME_GIFT_CERTIFICATE'

/** 주문 성공 request */
type ApprovePaymentRequest = {
  merchantUid: string
}
/** 주문 실패 request */
type FailPaymentRequest = {
  salesId: number
  reason: string
}
