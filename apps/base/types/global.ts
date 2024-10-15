/**
 * 공통 페이지네이션 입니다.
 */
type Pagination = {
  page: number
  size: number
  sort?: string[]
}
type PaginationRequest = {
  page: number
  limit: number
}

/**
 * useApi에서 사용하는 restful api method type 입니다.
 */
type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/** 공통으로 사용하는 코드 type 입니다. */
type GlobalCode = {
  name: string
  code: string
}

/** 컴포넌트 페이지 page componenet type */
type PageComponents<T> = {
  componentId: number
  template: {
    id: number
    type: string
    alias: string
    url: string
    version: string
  }
  contents: Record<string, unknown>
  data: T
  createdAt: string
  lastModifiedAt: string
  contentsLastModifiedAt: string
  contentsCount: number
}

/** errorObj 다이얼로그 타입 */
type ErrorDialog = {
  code: string
  msg: string
  time: number
}
