/** 제품 리스트에서 각각의 정보 type 입니다. */
type ProductListInfo = {
  prodId: number
  srcSpec: string
  heartFlag: boolean
  brandSubName: string
  name: string
  imgLink: string
  priceOrg: number
  priceLow: number
  priceLowRate: number
  discountName: string
  isAddDiscount: boolean
  badgeType: string
  duDate: string
  prodCnt: number
  sizes: string
  colors: string
  status: string
}
/** 컴포넌트 페이지 - 구매하기 리스트 response */
type ProductListResponse = PaginationResponse<ProductListInfo[]>

// TODO: cat2List -> clothesList 변경해야함.
/** 구매하기 - 필터 데이터 type */
type ProductListContent = {
  usedFilter: Array<GlobalCode & { selectMode: string }>
  cat: { list: Array<GlobalCode & { cat2List: GlobalCode[] }> }
  brand: { list: Array<GlobalCode & { nameKr: string; isNew: boolean }> }
  grade: { list: Array<GlobalCode> }
  season: { list: Array<GlobalCode> }
  type: {
    selectMode: string
    list: Array<GlobalCode>
  }
  price: {
    selectMode: string
    list: Array<GlobalCode>
  }
}

/** 제품 필터 옵션 type 입니다. */
type ProductOption = {
  page: number
  limit: number
  categoryGender: string
  categoryClothes: string
  categoryDnu: string
  orderBy: string
  brand: GlobalCode[]
  grade: GlobalCode[]
  season: GlobalCode[]
  type: GlobalCode[]
  price: GlobalCode[]
}
/** 구매하기 - 제품목록 조회를 위한 request. 필터 + 페이징 */
type ProductListRequest = {
  page: number
  limit: number
  cat1: string
  cat2: string
  cat3: string
  orderBy: string
  subBrandIdList: string
  grades: string
  season: string
  srcSpecs: string
  minPrice: string
  maxPrice: string
}

/** 제품 문의 조회 request */
type ProductQnaRequest = {
  prodId: number
  params: PaginationRequest
}

/** 제품 문의 등록 request */
type AddProductQnaRequest = {
  prodId: number
  params: {
    quClass: string
    msg: string
  }
}

/** 제품 하나의 옵션 정보 type */
type ProductOptions = {
  optId: number
  status: string
  priceSet: number
  priceSetRate: number
  badgeType: string
  duDate: string
  grade: string
  size: string
  option: string
  color: string
}

/** 제품 하나의 상세 정보 */
type ProductDetailInfo = {
  brandId: string
  subBrandId: string
  snCode: string
  priceStd: number
  priceStdRate: number
  imgs: string[]
  season: string
  detailDesc: string
  detailClean: string
  detailInfo: string
  detailSize: string
  optList: ProductOptions[]
  isSoldOut: boolean
} & Omit<ProductListInfo, 'imgLink' | 'prodCnt' | 'sizes' | 'colors'>

/** 제품 QnA 데이터 type */
type ProductQna = {
  pqnaId: number
  prodId: number
  prodName: string
  userId: number
  userName: string
  quClass: string
  msg: string
  quDate: string
  anFlag: boolean
  anMsg: string
  anDate: string
}
/** 제품 QnA 페이지 response */
type PageProductQnaResponse = PaginationResponse<ProductQna[]>

/** 제품 장바구니 데이터 type */
type ProductCartInfo = {
  prodId: number
  optId: number
  subBrandName: string
  priceLowRate: number
  priceSet: number
  priceOrg: number
  status: string
  srcSpec: string
  optCode: string
  name: string
  imgLink: string
  badgeType: string
  grade: string
  size: string
  option: string
  color: string
  duDate: string
  isSoldOut: boolean
}
/** 제품 장바구니 목록 response type */
type ProductCartResponse = ProductCartInfo[]
