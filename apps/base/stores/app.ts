import { acceptHMRUpdate, defineStore } from 'pinia'
import { getBrandHeadAPI, getThirdpartyAPI } from '~/composables/apiFactories/app'
// 어플리케이션 전반적인 정보에 대한 store
// session storage에 저장됨.

type AppState = {
  DOMAIN: DomainType
  THIRDPARTY_KEYS: ThirdpartyKeysType
  HEAD_OBJECT: HeadObjectType
  LAYOUT_OBJECT: LayoutObjectType
  SELL_TYPE: SellType | ''
  GLOBAL_PRODUCT_COMPONENT: GlobalProductComponentType
  DIALOG_DTO: Omit<DialogDTOType, 'timeout'>
  HEADER_TYPE: HeaderType
  IS_MANUAL_CLOSE: boolean
}

export const appStore = defineStore('app', {
  state: (): AppState => {
    return {
      DOMAIN: '',
      THIRDPARTY_KEYS: {
        facebook: '',
        naver: '',
        amplitude: ''
      },
      HEAD_OBJECT: {
        id: '',
        name: '',
        hostName: '',
        brandMetadata: {
          primaryColor: '',
          siteName: '',
          og_image: '',
          brandName: '',
          description: '',
          url: '',
          apiBrandName: '',
          title: '',
          favicon: '',
          keywords: '',
          logo_image: '',
          isNotice: true,
          useEscrow: true,
          brandStoreUrl: '',
          noticeUrl: '',
          faqUrl: '',
          personalUrl: '',
          ruleUrl: '',
          footerBody: '',
          globalCssLink: ''
        }
      },
      LAYOUT_OBJECT: {
        logoImage: '',
        bgColor: '',
        titleTxt: '',
        titleColor: '',
        bodyTxt: '',
        bodyColor: '',
        cardList: [
          {
            bgColor: '',
            imgLink: '',
            titleTxt: '',
            titleColor: '',
            bodyTxt: '',
            bodyColor: '',
            buttonTxt: '',
            buttonTxtColor: '',
            buttonBgColor: '',
            actType: '',
            actData: ''
          }
        ],
        rightSideImage: ''
      },
      SELL_TYPE: '', // code, massive, orderlist,
      GLOBAL_PRODUCT_COMPONENT: {
        componentId: 0,
        name: '',
        type: ''
      },
      DIALOG_DTO: {
        isOpen: false,
        message: ''
      },
      HEADER_TYPE: {
        back: false,
        logo: false,
        title: '',
        home: false,
        search: false,
        cart: false,
        close: false,
        backRoute: ''
      },
      IS_MANUAL_CLOSE: false // header 닫기버튼 수동 조작
    }
  },
  getters: {
    getDomain: (state) => state.DOMAIN,
    getThirdpartyKeys: (state) => state.THIRDPARTY_KEYS,
    getHeadObject: (state) => state.HEAD_OBJECT,
    getLayoutObject: (state) => state.LAYOUT_OBJECT,
    getSellType: (state) => state.SELL_TYPE,
    getGlobalProductComponent: (state) => state.GLOBAL_PRODUCT_COMPONENT,
    getDialogDTO: (state) => state.DIALOG_DTO,
    getHeaderType: (state) => state.HEADER_TYPE,
    getIsManualClose: (state) => state.IS_MANUAL_CLOSE
  },
  actions: {
    setDomain(value: DomainType) {
      this.DOMAIN = value
    },
    setSellType(value: SellType) {
      this.SELL_TYPE = value
    },
    setThirdPartyKeysData(value: ThirdpartyKeysType) {
      this.THIRDPARTY_KEYS = value
    },
    setBrandHeadsData(value: HeadObjectType) {
      this.HEAD_OBJECT = value
    },
    setBrandLayoutData(value: LayoutObjectType) {
      this.LAYOUT_OBJECT = value
    },
    setDialogDTO(payload: Omit<DialogDTOType, 'isOpen'>) {
      this.DIALOG_DTO = {
        isOpen: true,
        message: payload.message
      }
      setTimeout(() => {
        this.DIALOG_DTO = {
          isOpen: false,
          message: ''
        }
      }, payload.timeout * 1000)
    },
    closeDialogDTO() {
      this.DIALOG_DTO = {
        isOpen: false,
        message: ''
      }
    },

    setGlobalProductComponentFactor(payload: DomainType) {
      if (payload === 'orm') {
        this.GLOBAL_PRODUCT_COMPONENT = {
          componentId: 3,
          name: 'ProductItem',
          type: 'LazyFeatProductRectItem'
        }
      } else {
        this.GLOBAL_PRODUCT_COMPONENT = {
          componentId: 4,
          name: 'ProductItem',
          type: 'LazyFeatProductSquareItem'
        }
      }
      return true
    },
    // async setGlobalProductComponent(compId: number, hostName) {
    //   const config = useRuntimeConfig()
    //   const componentObj = await useAsyncData('global_component', () =>
    //     $fetch(`${config.public.baseURL}/v20/components/${compId}`, {
    //       headers: {
    //         'Brand-Domain': hostName
    //       }
    //     })
    //   )

    //   if (!componentObj.error.value) {
    //     this.setGlobalProductComponentFactor({
    //       key: 'name',
    //       value: 'ProductItem'
    //     })
    //     if (hostName === 'orm') {
    //       this.setGlobalProductComponentFactor({
    //         key: 'componentId',
    //         value: 3
    //       })
    //       this.setGlobalProductComponentFactor({
    //         key: 'type',
    //         value: 'FeatProductRectItem'
    //       })
    //     } else {
    //       this.setGlobalProductComponentFactor({
    //         key: 'componentId',
    //         value: 4
    //       })
    //       this.setGlobalProductComponentFactor({
    //         key: 'type',
    //         value: 'FeatProductSquareItem'
    //       })
    //     }

    // 이게 진짜 로직임. 위에는 잠시 로직확인 위해서 가라로 써놓은 코드!
    // setGlobalProductComponentFactor({
    //     'key': 'type',
    //     'value': componentObj.data.value.data.template.type
    // });
    //   }
    // },
    async setThirdpartyKeys() {
      const { data, error } = await getThirdpartyAPI()

      if (error.value != null) {
        if (error.value.statusCode !== 200) {
          return error.value.data // data, message, statusCode
        }
      } else {
        if (data.value.statusCode === 200) {
          this.THIRDPARTY_KEYS = data.value.data.keys
          return true
        }
        return false
      }
    },
    async setBrandHeads() {
      const { data, error } = await getBrandHeadAPI()

      if (error.value != null) {
        if (error.value.statusCode !== 200) {
          return error.value.data // data, message, statusCode
        }
      } else {
        if (data.value.statusCode === 200) {
          this.HEAD_OBJECT = data.value.data.headContent
          this.LAYOUT_OBJECT = data.value.data.layoutContent

          return true
        }
        return false
      }
    },
    setHeaderType(value: HeaderType) {
      this.HEADER_TYPE = value
    },
    setHeaderTypeTitle(value: string) {
      this.HEADER_TYPE.title = value
    },
    setIsManualClose(value: boolean) {
      this.IS_MANUAL_CLOSE = value
    }
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(appStore, import.meta.hot))
}
