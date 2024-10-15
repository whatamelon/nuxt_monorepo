// 주문 관련 API

import type { AsyncData } from '#app'
import { useApi } from '~/composables/api'

// TODO: request be와 다름 확인 필요.
// retry!
export const setSalesPreAPI = async (preDTO: SalesPreRequest): Promise<AsyncData<ApiResponse<{ salesId: number }>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/sales/pre', 'POST', preDTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<{ salesId: number }>, ApiError>
}

// TODO: response data 사용하는 곳이 없어보임. 확인 필요.
// retry!
export const sendSalesResultAPI = async (preDTO: SalesResultRequest): Promise<AsyncData<ApiResponse<SalesResultResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/sales/results', 'POST', preDTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<SalesResultResponse>, ApiError>
}

// retry!
export const getOrderItemAPI = async (salesIds: SalesListRequest): Promise<AsyncData<ApiResponse<SalesListResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/sales`, 'GET', salesIds)
  return { data, pending, error, execute } as AsyncData<ApiResponse<SalesListResponse>, ApiError>
}

// retry!
export const getOrderDetailAPI = async (salesId: number) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${salesId}`, 'GET', {})
  return { data, pending, error, execute }
}

// retry!
export const getDeliveryInfoAPI = async (salesId: number) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${salesId}/deliveries`, 'GET', {})
  return { data, pending, error, execute }
}

// retry!
export const getVbankInfoAPI = async (salesId: number) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${salesId}/vbank`, 'GET', {})
  return { data, pending, error, execute }
}

// retry!
export const cancelSoIdsAPI = async (cancelDTO: SalesProductRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${cancelDTO.salesId}/cancel`, 'POST', {
    soIds: cancelDTO.soIds
  })
  return { data, pending, error, execute }
}

// retry!
export const returnSoIdsAPI = async (returnDTO: SalesProductReturnRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${returnDTO.salesId}/returns`, 'POST', {
    retList: returnDTO.retList
  })
  return { data, pending, error, execute }
}

// retry!
export const cofirmSoIdsAPI = async (confirmDTO: SalesProductRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${confirmDTO.salesId}/confirm`, 'POST', {
    soIds: confirmDTO.soIds
  })
  return { data, pending, error, execute }
}

// retry!
export const failPaymentAPI = async (failDTO: FailPaymentRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/${failDTO.salesId}/fail`, 'POST', {
    reason: failDTO.reason
  })
  return { data, pending, error, execute }
}

// retry!
export const writeBuyReviewAPI = async (reviewDTO: PostReviewBuyRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/reviews/buy`, 'POST', reviewDTO)
  return { data, pending, error, execute }
}

// retry!
export const approvePaymentAPI = async (paidDTO: ApprovePaymentRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/sales/paid`, 'POST', paidDTO)
  return { data, pending, error, execute }
}
