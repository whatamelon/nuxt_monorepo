// 프로덕트 전반적인 브랜드 메타 데이터 및 레이아웃 데이터, 페이지 데이터에 대한 API

import type { AsyncData } from '#app'
import { useApi } from '~/composables/api'
// retry 없음

export const getThirdpartyAPI = async (): Promise<AsyncData<ApiResponse<ThirdpartyKeysResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/thirdparty/keys', 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<ThirdpartyKeysResponse>, ApiError>
}

export const getBrandHeadAPI = async (): Promise<AsyncData<ApiResponse<BrandHeadResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/brands/check`, 'GET', {}, String(Math.random()))
  return { data, pending, error, execute } as AsyncData<ApiResponse<BrandHeadResponse>, ApiError>
}

// 페이지 조회
export async function getPageContentAPI<T>(pageName: PageType): Promise<AsyncData<ApiResponse<PageContentResponse<T>>, ApiError>> {
  const { data, pending, error, execute } = await useApi(`/v20/pages/${pageName}`, 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<PageContentResponse<T>>, ApiError>
}

// TODO: vue 파일 내부에서 그대로 사용하고 있어 해당 메소드는 사용하는 곳이 없음. 무한스크롤 페이징 처리 함수 개발 필요.
export const getComponentTemplateAPI = async (compId: string) => {
  const { data, pending, error, execute } = await useApi(`/v20/components/${compId}`, 'GET')
  return { data, pending, error, execute }
}
