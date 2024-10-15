/* ---------------------------------- */
/*               api 공통               */
/* ---------------------------------- */
/**
 * api 공통 응답 타입
 */
type ApiResponse<T> = {
  data: T
  message?: string
  statusCode: number
  info?: string
}
/**
 * api 공통 에러 타입
 */
type ApiError = {
  data: Omit<ApiResponse<null>, 'info'>
  serviceCode?: string
  statusCode: number
  message: string
}

/** 공통 pagination response type */
type PaginationResponse<T> = {
  content: T
  count: {
    listCount: number
    totalCount: number
  }
  page: {
    first: boolean
    last: boolean
    limit: number
    page: number
    totalPage: number
  }
}
