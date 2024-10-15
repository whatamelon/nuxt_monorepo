/* eslint-disable no-unused-vars */

/** 로그인 시 받아오는 jwt 토큰입니다. */
type LoginToken = {
  accessToken: string
  refreshToken: string
}
/** 사용자 세션 확인 type 입니다.
 * response 200일 때 마다 받아옵니다.
 * @type 사용자 토큰 여부 장바구니 count  */
type UserSession = {
  cartCount: number | null
  salesCount: number | null
  tokenValid: boolean
}

type UserAction = {
  isInSellBig: boolean
  isInSellSmall: boolean
}

// 인증
/** 로그인 request type 입니다. */
type SigninRequest = {
  relayId: string
  relayPassword: string
}
/** 회원가입 request type 입니다. */
type SignupRequest = {
  marketingFlag: boolean
  impUid: string
} & SigninRequest
/** 로그인 response type 입니다. */
type SigninResponse = {
  isAuthVerified: boolean
  isBrandVerified: boolean
  lastAccessDate: Date
  userAction: UserAction
} & LoginToken

// 임시 비밀번호
/** 임시 비밀번호 발급 request type 입니다. */
type TempPasswordRequest = {
  relayId: string
  snsType: string
  impUid: string
}
/** 임시 비밀번호 발급 response type 입니다. */
type TempPasswordResponse = {
  userCnt: number
  userIds: Array<number>
  temporaryPassword: string
}

// 비밀번호 변경
/** 비밀번호 변경 request type 입니다. */
type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}

// 이메일 찾기
/** 이메일 찾기 request type 입니다. */
type ForgotEmailRequest = Omit<TempPasswordRequest, 'relayId'>

// 주소지
/** 주소지 정보 */
type AddressInfo = {
  addrId: number
  receiverName: string
  addrCode: string
  addr0: string
  addr1: string
  telNo: string
  msg: string
  defaultFlag: boolean
}
/** 주소지 추가 request type 입니다. */
type AddressRequest = Omit<AddressInfo, 'addrId'>
/** 주소지 업데이트 request type 입니다. */
type UpdateAddressRequest = {
  id: number
  body: AddressRequest
}

// 유저 정보 업데이트
/** 유저 업데이트 request type 입니다. */
type UserdataRequest = {
  bankName: string
  account: string
  holder: string
  marketingFlag: boolean
}

// 본인인증
/** 본인인증 request type 입니다. */
type VerificationRequest = {
  impUid: string
  userId: number
}
/** 본인인증 response type 입니다. */
type VerificationResponse = {
  userCnt: number
  users: [
    {
      userId: number
      relayId: string
      snsType: string
      userStatus: string
      createdAt: string
    }
  ]
}

/** 마이페이지 진입 시, 개인정보 조회 response 입니다. */
type UserProfileResponse = {
  userId: number
  snsType: string
  relayId: string
  maFlag: boolean
  authFlag: boolean
  buidAuthFlag: boolean
  name: string
  mobileNo: string
  refInfo: Omit<SalesResultResponse, 'depositAmount'>
  totalPoints: number
  freeretsCount: number
  sender: SenderAddressRequest
  receiver: AddressInfo
}

/** 사용자 브랜드몰 인증 response 입니다. */
type UserBrandVerificationResponse = {
  buid: string
  status: string
}

/** 작성 가능한 리뷰 response 입니다. */
type ReviewableResponse = {
  reviewables: [
    {
      createdDate: string
      reviewType: string
    }
  ]
}

type UserReviewInfo = {
  id: number
  reviewType: string
  starPoint: number
  msg: string
  imgs: string
  reviewDate: string
}

type UserReviewResponse = PaginationResponse<UserReviewInfo>
