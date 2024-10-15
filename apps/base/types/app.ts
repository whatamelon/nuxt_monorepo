/** domain type */
type DomainType = 'orm' | 'nsr' | 'greenforet' | ''
/** page component 호출 type */
type PageType = 'repassword' | 'brandauth' | 'resale' | 'userHeart' | 'login' | 'presales' | 'productList' | 'userCart' | 'home'
/** 판매 타입 - 소량/대량 */
type SellType = 'sncode' | 'massive'
/** 써드파티키 type */
type ThirdpartyKeysType = {
  facebook: string
  naver: string
  amplitude: string
}
/** 써드파티키 response type */
type ThirdpartyKeysResponse = {
  brandId: string
  keys: ThirdpartyKeysType
}
/** head metadata type */
type HeadObjectType = {
  id: string
  name: string
  hostName: string
  brandMetadata: {
    primaryColor: string
    siteName: string
    og_image: string
    brandName: string
    description: string
    url: string
    apiBrandName: string
    title: string
    favicon: string
    keywords: string
    logo_image: string
    isNotice: boolean
    useEscrow: boolean
    brandStoreUrl: string
    noticeUrl: string
    faqUrl: string
    personalUrl: string
    ruleUrl: string
    footerBody: string
    globalCssLink: string
  }
}
/** layout type */
type LayoutObjectType = {
  logoImage: string
  bgColor: string
  titleTxt: string
  titleColor: string
  bodyTxt: string
  bodyColor: string
  rightSideImage: string
  cardList: [
    {
      bgColor: string
      imgLink: string
      titleTxt: string
      titleColor: string
      bodyTxt: string
      bodyColor: string
      buttonTxt: string
      buttonTxtColor: string
      buttonBgColor: string
      actType: string
      actData: string
    }
  ]
}
/** brand head metadata response type */
type BrandHeadResponse = {
  headContent: HeadObjectType
  layoutContent: LayoutObjectType
}
/** product card component type - square(nsr, greenforet) / rectangle(olo) */
type GlobalProductComponentType = {
  componentId: number
  name: string
  type: string
}
/** dialog type */
type DialogDTOType = {
  isOpen: boolean
  message: string
  timeout: number
}
/** header component type */
type HeaderType = {
  back: boolean
  logo: boolean
  title: string
  home: boolean
  search: boolean
  cart: boolean
  close: boolean
  backRoute: string
}
/** 컴포넌트 페이지 response */
type PageContentResponse<T> = {
  pageId: number
  contents: Record<string, unknown>
  pageContents: PageComponents<T>
}
