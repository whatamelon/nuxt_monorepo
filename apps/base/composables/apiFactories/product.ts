// 상품 관련 API

import type { AsyncData } from '#app'
import { useApi } from '~/composables/api'

// TODO: vue 파일 내부에서 그대로 사용하고 있어 해당 메소드는 사용하는 곳이 없음. 무한스크롤 페이징 처리 함수 개발 필요.
export const getProductListAPI = async (params: ProductListRequest) => {
  const { data, pending, error, execute } = await useApi('/v20/products', 'GET', params)
  return { data, pending, error, execute }
}

export const getProductIdAPI = async (prodId: number): Promise<AsyncData<ApiResponse<ProductDetailInfo>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/${prodId}`, 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<ProductDetailInfo>, ApiError>
}

export const getProductIdPageAPI = async (prodId: string): Promise<AsyncData<ApiResponse<PageContentResponse<ProductListResponse>>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/pages/product/${prodId}`, 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<PageContentResponse<ProductListResponse>>, ApiError>
}

export const getProductIdQnaAPI = async (obj: ProductQnaRequest): Promise<AsyncData<ApiResponse<PageProductQnaResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/${obj.prodId}/qnas`, 'GET', obj.params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<PageProductQnaResponse>, ApiError>
}

// retry!
export const addProductIdQnaAPI = async (obj: AddProductQnaRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/${obj.prodId}/qnas`, 'POST', obj.params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const getCartListAPI = async (): Promise<AsyncData<ApiResponse<ProductCartResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/carts`, 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<ProductCartResponse>, ApiError>
}

// retry!
export const addCartOptAPI = async (optId: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/carts/${optId}`, 'POST')
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const deleteCartOptAPI = async (optId: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/carts/${optId}`, 'DELETE')
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const deleteAllCartOptAPI = async (params: { isDeleteSoldOut: boolean; optIds: number[] }): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/products/carts', 'DELETE', params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const addProductHeartAPI = async (prodId: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/hearts/${prodId}`, 'POST', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const deleteProductHeartAPI = async (prodId: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/products/hearts/${prodId}`, 'DELETE', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}
