// 홈화면 관련 API
// TODO: 현재 해당 파일 사용하지 않음. 처리 필요.

import { useApi } from '~/composables/api'

export const getHomeDataAPI = async () => {
  const { data, pending, error, execute } = await useApi('/v20/pages/home', 'GET', {})
  return { data, pending, error, execute }
}

export const getReviewListAPI = async (type, query) => {
  const { data, pending, error, execute } = await useApi(`/v20/reviews/${type}`, 'GET', query)
  return { data, pending, error, execute }
}
