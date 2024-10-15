// 회원 관련 API
import type { AsyncData } from 'nuxt/app'
import { useApi } from '~/composables/api'

export const signupAPI = async (SignReqDTOv4: SignupRequest): Promise<AsyncData<ApiResponse<SigninResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/signup', 'POST', SignReqDTOv4)
  return { data, pending, error, execute } as AsyncData<ApiResponse<SigninResponse>, ApiError>
}

export const loginAPI = async (SignReqDTOv4: SigninRequest): Promise<AsyncData<ApiResponse<SigninResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/signin', 'POST', SignReqDTOv4)
  return { data, pending, error, execute } as AsyncData<ApiResponse<SigninResponse>, ApiError>
}

// retry!
export const logoutAPI = async (): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/signout', 'POST', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const deleteUserAPI = async (): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/users/my', 'DELETE', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const findEmailAPI = async (params: ForgotEmailRequest): Promise<AsyncData<ApiResponse<VerificationResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/forgot', 'POST', params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<VerificationResponse>, ApiError>
}

// retry!
export const tempPasswordAPI = async (params: TempPasswordRequest): Promise<AsyncData<ApiResponse<TempPasswordResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/repassword', 'POST', params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<TempPasswordResponse>, ApiError>
}

// retry!
export const repasswordAPI = async (params: ChangePasswordRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/password', 'PATCH', params)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const getAddressListAPI = async (): Promise<AsyncData<ApiResponse<AddressInfo>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/users/addresses', 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<AddressInfo>, ApiError>
}

// retry!
export const getMyProfilePageAPI = async () => {
  const { data, pending, error, execute } = await useApi(`/v20/pages/myprofile`, 'GET', {})
  return { data, pending, error, execute }
}

// retry!
export const getUserInfoAPI = async (): Promise<AsyncData<ApiResponse<UserProfileResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/users/my', 'GET')
  return { data, pending, error, execute } as AsyncData<ApiResponse<UserProfileResponse>, ApiError>
}

// retry!
export const addAddressAPI = async (addrObj: AddressRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/users/addresses', 'POST', addrObj)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const updateAddressAPI = async (DTO: UpdateAddressRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/addresses/${DTO.id}`, 'PATCH', DTO.body)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const deleteAddressAPI = async (id: number): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/addresses/${id}`, 'DELETE', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

export const getBrandAuthPageAPI = async (): Promise<AsyncData<ApiResponse<PageContentResponse<null>>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/pages/brandAuth`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<PageContentResponse<null>>, ApiError>
}

// retry!
export const certifyUserBrandAuthAPI = async (): Promise<AsyncData<ApiResponse<UserBrandVerificationResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/brands`, 'POST', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<UserBrandVerificationResponse>, ApiError>
}

// retry!
export const updateUserInfoAPI = async (DTO: UserdataRequest): Promise<AsyncData<ApiResponse<null>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/my`, 'PATCH', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<null>, ApiError>
}

// retry!
export const certifyUserAuthAPI = async (DTO: VerificationRequest): Promise<AsyncData<ApiResponse<VerificationResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/auth/verification`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<VerificationResponse>, ApiError>
}

// retry!
export const certifyUserMyPageAuthAPI = async (DTO: { impUid: string }): Promise<AsyncData<ApiResponse<VerificationResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/verification`, 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<VerificationResponse>, ApiError>
}

// retry!
export const getAllWritableReviewAPI = async (): Promise<AsyncData<ApiResponse<ReviewableResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/myreviews/reviewable`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<ReviewableResponse>, ApiError>
}

// retry!
export const getAllWrittenReviewAPI = async (): Promise<AsyncData<ApiResponse<UserReviewResponse>, ApiError>> => {
  const { data, pending, error, execute } = await useApi(`/v20/users/myreviews`, 'GET', {})
  return { data, pending, error, execute } as AsyncData<ApiResponse<UserReviewResponse>, ApiError>
}

// auth-join
export const checkDuplicatedEmailAPI = async (DTO: { relayId: string }): Promise<AsyncData<ApiResponse<{ isRelayIdExists: boolean }>, ApiError>> => {
  const { data, pending, error, execute } = await useApi('/v20/auth/check', 'POST', DTO)
  return { data, pending, error, execute } as AsyncData<ApiResponse<{ isRelayIdExists: boolean }>, ApiError>
}
