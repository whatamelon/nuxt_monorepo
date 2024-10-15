import { acceptHMRUpdate, defineStore } from 'pinia'
import { getPageContentAPI } from '~/composables/apiFactories/app'
import { formatCategoryDomainCode } from '~/utils/formatDomain'
// 상품에 대한 store
// cookie에 저장됨.

// TODO: cat2List -> clothesList 변경해야함.
type ProductType = {
  ORDER_LIST: Array<GlobalCode>
  CAT_LIST: Array<GlobalCode & { cat2List: Array<GlobalCode> }>
  BRAND_LIST: Array<GlobalCode & { nameKr: string; isNew: boolean }>
  GRADE_LIST: Array<GlobalCode>
  SEASON_LIST: Array<GlobalCode>
  TYPE_LIST: Array<GlobalCode>
  PRICE_LIST: Array<GlobalCode>
  USED_FILTERS: Array<GlobalCode & { selectMode: string }>
  PRODUCT_LIST_OPTIONS: ProductOption
  RECENT_PRODUCT_LIST: Array<ProductListInfo>
  RECENT_KEYWORD_LIST: Array<ProductListInfo>
}

export const productStore = defineStore('product', {
  state: (): ProductType => {
    return {
      ORDER_LIST: [
        {
          name: '최신순',
          code: 'latest'
        },
        {
          name: '높은 가격순',
          code: 'highestPrice'
        },
        {
          name: '낮은 가격순',
          code: 'lowestPrice'
        }
      ],
      CAT_LIST: [],
      BRAND_LIST: [],
      GRADE_LIST: [],
      SEASON_LIST: [],
      TYPE_LIST: [],
      PRICE_LIST: [],
      USED_FILTERS: [],
      PRODUCT_LIST_OPTIONS: {
        page: 1,
        limit: 30,
        categoryGender: formatCategoryDomainCode(),
        categoryClothes: '00',
        categoryDnu: '00',
        orderBy: 'latest',
        brand: [], // subBrandIdList
        grade: [], // grades
        season: [],
        type: [], // srcSpecs
        price: [] // minPrice, maxPrice
      },

      RECENT_PRODUCT_LIST: [],
      RECENT_KEYWORD_LIST: []
    }
  },
  getters: {
    getOrderList: (state) => state.ORDER_LIST,
    getCatList: (state) => state.CAT_LIST,
    getBrandList: (state) => state.BRAND_LIST,
    getGradeList: (state) => state.GRADE_LIST,
    getSeasonList: (state) => state.SEASON_LIST,
    getTypeList: (state) => state.TYPE_LIST,
    getPriceList: (state) => state.PRICE_LIST,
    getUsedFilters: (state) => state.USED_FILTERS,
    getProductListOptions: (state) => state.PRODUCT_LIST_OPTIONS,
    getProductListOptionsParams: (state) => {
      const params = {
        page: state.PRODUCT_LIST_OPTIONS.page,
        limit: state.PRODUCT_LIST_OPTIONS.limit,
        cat1: state.PRODUCT_LIST_OPTIONS.categoryGender,
        cat2: state.PRODUCT_LIST_OPTIONS.categoryClothes,
        cat3: state.PRODUCT_LIST_OPTIONS.categoryDnu,
        orderBy: state.PRODUCT_LIST_OPTIONS.orderBy,
        subBrandIdList: state.PRODUCT_LIST_OPTIONS.brand.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
        grades: state.PRODUCT_LIST_OPTIONS.grade.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
        season: state.PRODUCT_LIST_OPTIONS.season.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
        srcSpecs: state.PRODUCT_LIST_OPTIONS.type.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
        minPrice: state.PRODUCT_LIST_OPTIONS.price.length > 0 ? state.PRODUCT_LIST_OPTIONS.price[0].code?.split('r')[0] : undefined,
        maxPrice: state.PRODUCT_LIST_OPTIONS.price.length > 0 ? state.PRODUCT_LIST_OPTIONS.price[0].code?.split('r')[1] : undefined
      }
      return params
    },
    getRecentProductList: (state) => state.RECENT_PRODUCT_LIST,
    getRecentKeywordList: (state) => state.RECENT_KEYWORD_LIST
  },
  actions: {
    setProductOptions(data: ProductOption) {
      this.PRODUCT_LIST_OPTIONS = data
    },
    setOrder(data: string) {
      this.PRODUCT_LIST_OPTIONS = {
        ...this.PRODUCT_LIST_OPTIONS,
        page: 1,
        orderBy: data
      }
    },
    async setProductListFiltersData(contents: ProductListContent) {
      this.USED_FILTERS = contents.usedFilter.filter((e) => e.code !== 'cat')
      this.CAT_LIST = contents.cat.list
      this.BRAND_LIST = contents.brand.list
      this.GRADE_LIST = contents.grade.list
      this.SEASON_LIST = contents.season.list
      this.TYPE_LIST = contents.type.list
      this.PRICE_LIST = contents.price.list
    },
    async setProductListFilters() {
      const { data, error } = await getPageContentAPI<PageComponents<ProductListInfo>>('productList')
      // ProductListContent
      if (!error.value) {
        const contents = data.value.data.contents as ProductListContent
        this.USED_FILTERS = contents.usedFilter.filter((e) => e.code !== 'cat')
        this.CAT_LIST = contents.cat.list
        this.BRAND_LIST = contents.brand.list
        this.GRADE_LIST = contents.grade.list
        this.SEASON_LIST = contents.season.list
        this.TYPE_LIST = contents.type.list
        this.PRICE_LIST = contents.price.list
      }
    },
    setProductListFiltersFactory(payload: ProductListContent) {
      this.USED_FILTERS = payload.usedFilter.filter((e) => e.code !== 'cat')
      this.CAT_LIST = payload.cat.list
      this.BRAND_LIST = payload.brand.list
      this.GRADE_LIST = payload.grade.list
      this.SEASON_LIST = payload.season.list
      this.TYPE_LIST = payload.type.list
      this.PRICE_LIST = payload.price.list
    },
    resetOptions(mode: 'domain' | 'gender' | 'clothes') {
      if (mode === 'domain') {
        this.PRODUCT_LIST_OPTIONS.categoryGender = formatCategoryDomainCode()
        this.PRODUCT_LIST_OPTIONS.categoryClothes = '00'
        this.PRODUCT_LIST_OPTIONS.orderBy = 'latest'
      }
      if (mode === 'gender') {
        this.PRODUCT_LIST_OPTIONS.categoryClothes = '00'
        this.PRODUCT_LIST_OPTIONS.orderBy = 'latest'
      }
      if (mode === 'clothes') {
        this.PRODUCT_LIST_OPTIONS.orderBy = 'latest'
      }
      this.PRODUCT_LIST_OPTIONS.page = 1
      this.PRODUCT_LIST_OPTIONS.limit = 30
      this.PRODUCT_LIST_OPTIONS.categoryDnu = '00'
      this.PRODUCT_LIST_OPTIONS.brand = []
      this.PRODUCT_LIST_OPTIONS.grade = []
      this.PRODUCT_LIST_OPTIONS.season = []
      this.PRODUCT_LIST_OPTIONS.type = []
      this.PRODUCT_LIST_OPTIONS.price = []
    },
    changeCategoryDomain(cat: GlobalCode) {
      this.PRODUCT_LIST_OPTIONS.categoryGender = cat.code
    },
    changeCategoryGender(cat: GlobalCode) {
      this.PRODUCT_LIST_OPTIONS.categoryClothes = cat.code
    },
    setProductToRecentList(product: ProductListInfo) {
      if (this.RECENT_PRODUCT_LIST.length > 0) {
        const idx = this.RECENT_PRODUCT_LIST.findIndex((e) => e.prodId === product.prodId)
        if (idx === -1) {
          // 처음 들어옴 > 배열 맨 앞으로.
          this.RECENT_PRODUCT_LIST.unshift(product)

          // 배열 길이가 30이상이면 맨뒤에거 삭제
          if (this.RECENT_PRODUCT_LIST.length > 30) {
            this.RECENT_PRODUCT_LIST.splice(this.RECENT_PRODUCT_LIST.length - 1, 1)
          }
        } else if (idx === 0) {
          // 맨 앞에 있는거 또 본거임. 따로 할 거 없음.
        } else {
          // 일단 어딘가에 위치한 애니까, 배열 30개면, 그 어딘가 있는 애 삭제
          this.RECENT_PRODUCT_LIST.splice(idx, 1)
          // 그리고 추가
          this.RECENT_PRODUCT_LIST.unshift(product)
        }
      } else {
        // 이건 아무것도 없을때, 추가
        this.RECENT_PRODUCT_LIST.push(product)
      }
    },

    resetRecentList() {
      this.RECENT_PRODUCT_LIST = []
    },

    setRecentKeywordList(item: ProductListInfo) {
      if (this.RECENT_KEYWORD_LIST.length > 0) {
        const idx = this.RECENT_KEYWORD_LIST.findIndex((e) => e === item)
        if (idx === -1) {
          // 처음 들어옴 > 배열 맨 앞으로.
          this.RECENT_KEYWORD_LIST.unshift(item)

          // 배열 길이가 10이상이면 맨뒤에거 삭제
          if (this.RECENT_KEYWORD_LIST.length > 10) {
            this.RECENT_KEYWORD_LIST.splice(this.RECENT_PRODUCT_LIST.length - 1, 1)
          }
        } else if (idx === 0) {
          // 맨 앞에 있는거 또 본거임. 따로 할 거 없음.
        } else {
          // 일단 어딘가에 위치한 애니까, 배열 30개면, 그 어딘가 있는 애 삭제
          this.RECENT_KEYWORD_LIST.splice(idx, 1)
          // 그리고 추가
          this.RECENT_KEYWORD_LIST.unshift(item)
        }
      } else {
        // 이건 아무것도 없을때, 추가
        this.RECENT_KEYWORD_LIST.push(item)
      }
    },

    removeKeyword(item: ProductListInfo) {
      const idx = this.RECENT_KEYWORD_LIST.findIndex((e) => e === item)
      this.RECENT_KEYWORD_LIST.splice(idx, 1)
    },

    resetRecentKeywordList() {
      this.RECENT_KEYWORD_LIST = []
    }
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(productStore, import.meta.hot))
}
