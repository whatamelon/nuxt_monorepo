/** 수거지 주소 등록 request */
type SenderAddressRequest = Pick<AddressInfo, 'addrCode' | 'addr0' | 'addr1'>
/** 소량 매입 상품 수거 신청 request */
type ResaleSmallRequest = { snCodes: string[] }
/** 대량 매입 신청 request */
type ResaleBigRequest = { count: number }
/** 대량 매입 상품 수거 신청 request */
type ResaleBigPickupRequest = { ipId: number }
/** 판매 리뷰 등록 request */
type PostReviewSellRequest = {
  userId: number
  userName: string
  starPoint: number
  message: string
  ipId: number
}
/** 매입 상품 패키지 조회 request */
type ResalesListRequest = {
  itemPackageIds: number[]
} & PaginationRequest
/** 매입 상품 정보 조회 response */
type BrandItemResponse = {
  credit: number
  imgLinkTh: string
  itemId: number
  itemName: string
  snCode: string
  status: string
  subBrandName: string
  isResalable?: boolean
}
/** 매입 단계별 컴포넌트 불러오는 response */
type ResaleApplyResponse = {
  contents: {}
  pageComponents: PageComponents<null>[]
  pageId: number
}

/** 매입 상품 단일 아이템 정보 */
type ResaleItemInfo = {
  itemId: number
  status: string
  isFinished: boolean
  snCode: string
  subBrandName: string
  itemName: string
  credit: number
  addCredit: number
  checkFinish: boolean
  failFlag: boolean
  failMsg: string
  imgLinkTh: string
}
/** 매입 상품 패키지 배송 조회 response */
type ItemPackageDeliveryResponse = {
  apiKey: string
  deliCode: string
  invoiceCode: string
}
/** 매입 상품 패키지 정보 */
type ItemPackageInfo = {
  ipuId: number
  status: string
  sellDate: string
  reviewable: boolean
  reviewPointPre: number
  msgSendFlag: boolean
  msgSendDate: string
  itemCnt: number
  itemList: ResaleItemInfo[]
}
/** 매입 내역 response */
type ResaleListResponse = PaginationResponse<ItemPackageInfo>

/** 매입 패키지 상세 response */
type ResaleDetailResponse = {
  ipuId: number
  status: string
  senderName: string
  telNo: string
  senderAddr: SenderAddressRequest
  creditDate: string
  reqCredit: number
  resCredit: number
  resendStatus: string
  resendCompleteDate: string
  msgSendFlag: boolean
  msgSendDate: string
  itemList: ResaleItemInfo[]
  itemCount: number
}

/** 브랜드 몰에서 주문한 상품 목록 조회. - greenforet용 */
type BrandOrderedListResponse = {
  totCnt: number
  orderList: [
    {
      orderNum: string
      orderDate: string
      otemList: [
        {
          snCode: string
          subBrandName: string
          itemName: string
          credit: number
          imgLinkTh: string
          optValue: string
        }
      ]
    }
  ]
  orderDates: string[]
}

/** 소량 매입 상품 상태 저장 request */
type SmallItemRequest = {
  snCodes: string[]
  actionType: string
}

type BigItemRequest = {
  quantity: number
}

type SmallItemList = BrandItemResponse & {
  isResalable: boolean
}

/** 판매하기 진입 시 저장된 item 가져오는 api response */
type SellItemActionResponse = {
  smalls: SmallItemList[]
  big: BigItemRequest
  totalPoints: number
}

/** sncode type */
type SnCodeType = {
  snCode: string
  itemName: string
  subBrandName: string
  credit: number
  imgLinkTh: string
}

/** 판매 신청 단계에서 사용하는 ipStep type */
type IpStep = {
  component: string
  data: {
    data?: {
      userInfo?: {
        name: string
        telNo: string
      }
      address?: SenderAddressRequest
      itemList?: SmallItemList[]
      massiveCount?: number
    }
    contents: {
      brandList: string[]
      checkTable: {
        brandCode: string
        brandName: string
        categoryBadgeText: string
        categoryBodyCode: string
        categoryCaptionText: string
        categoryList: string
        conditionList: string[]
        rewardText: string
      }[]
      contentsId: number
      dontworryBottomSheet: {
        body: string
        title: string
      }
      impossibleDialog: {
        body: string
        title: string
        brandCode: string
        list: {
          imgUrl: string
          tag: string
          text: string
        }[]
        listType: string
      }[]
      nextStepButtonText: string
      tag: string
      tagColor: string
      title: string
      titleColor: string
    }
  }
  step: number
}
