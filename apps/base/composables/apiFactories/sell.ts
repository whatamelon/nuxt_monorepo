// 판매 관련 API

import type { AsyncData } from '#app'
import { useApi } from '~/composables/api'

// TODO: response 관련 페이지 코드 개선이 필요함.
export const getResalePageAPI = async () => {
  const { data, pending, error, execute } = await useApi(`/v20/pages/resale`, 'GET', {})
  return { data, pending, error, execute }
}

// TODO: response 관련 페이지 코드 개선이 필요함.
export const getResaleApplyPageAPI = async (): Promise<AsyncData<ApiResponse<ResaleApplyResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/pages/resaleApply`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<ResaleApplyResponse>, ApiError>
}

// retry!
export const getSncodeItemAPI = async (snCode: string): Promise<AsyncData<ApiResponse<BrandItemResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/brands/items?snCode=${snCode}`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<BrandItemResponse>, ApiError>
}

/** 소량 매입 상품 상태 저장 */
export const setSmallItemAPI = async (DTO: SmallItemRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/actions/smalls`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

/** 대량 매입 상품 상태 저장 */
export const setBigItemAPI = async (bigItem: BigItemRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/actions/bigs`, 'POST', bigItem)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

/** 신청중인 매입 상품 목록 조회 */
export const getItemActionsListAPI = async (): Promise<AsyncData<ApiResponse<SellItemActionResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/actions`, 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<SellItemActionResponse>, ApiError>
}

// retry!
export const setSenderAddressAPI = async (DTO: SenderAddressRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/addresses/senders`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// TODO: response로 data는 받아오는데 사용하는 곳이 없는 듯?
// retry!
export const applyResaleSmallAPI = async (DTO: ResaleSmallRequest) => {
  const { data, pending, error, execute } = await useApi(`/v20/items/smalls`, 'POST', DTO)
  return { data, pending, error, execute }
}

// retry!
export const applyResaleBigAPI = async (DTO: ResaleBigRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/bigs`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const cancelIpAPI = async (ipuId: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/${ipuId}/cancel`, 'PATCH', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const registerPickBigIpAPI = async (DTO: ResaleBigPickupRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/bigs/pickup`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const getSellDeliveryInfoAPI = async (ipId: number): Promise<AsyncData<ApiResponse<ItemPackageDeliveryResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/${ipId}/delivery`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<ItemPackageDeliveryResponse>, ApiError>
}

// retry!
export const writeSellReviewAPI = async (reviewDTO: PostReviewSellRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/reviews/sell`, 'POST', reviewDTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const getResaleItemAPI = async (ipIds: ResalesListRequest): Promise<AsyncData<ApiResponse<ResaleListResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items`, 'GET', ipIds)
  return { data, pending, error, execute } as AsyncData<ApiResponse<ResaleListResponse>, ApiError>
}

// retry!
export const getResaleDetailAPI = async (ipId: number): Promise<AsyncData<ApiResponse<ResaleDetailResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/items/${ipId}`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<ResaleDetailResponse>, ApiError>
}

// retry!
export const getResaleOrderlistAPI = async (): Promise<AsyncData<ApiResponse<BrandOrderedListResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/brands/ordered`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<BrandOrderedListResponse>, ApiError>
}
