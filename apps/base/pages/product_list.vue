<template>
  <div>
    <div class="sticky top-14 z-40 transition" :class="isShowTab ? '' : '-translate-y-14'">
      <PartProductListCategoryOneList @update-cat="onUpdateCategoryGender"></PartProductListCategoryOneList>
      <PartProductListCategoryTabList @update-cat="onUpdateCategoryClothes"></PartProductListCategoryTabList>
      <PartProductListFilterTabList
        v-show="isShowTab"
        :used-filter-list="getUsedFilters"
        @open-order-filter="onUpdateOrderModalValue"
        @open-filter="onUpdateFilterModalValue"
        @reset-filter="onResetFilterInTab"
      ></PartProductListFilterTabList>
    </div>

    <div v-if="pending && isLoading" class="mt-10 w-full px-5 pb-32">
      <PartProductListSkeleton></PartProductListSkeleton>
    </div>
    <ClientOnly v-else>
      <div id="productList" class="mt-10 px-5 pb-32">
        <div v-if="productList?.data && productList.data.content.length > 0">
          <div class="grid grid-cols-2 gap-x-1 gap-y-6">
            <component :is="appStore().getGlobalProductComponent.type" v-for="(pr, index) in productList.data.content" :key="index" :product="pr" types="list"></component>
          </div>

          <PartProductListPagination :total-page="productList.data.page.totalPage" :page="productList.data.page.page" @update-page="onChangePage"></PartProductListPagination>
        </div>

        <div v-else class="py-20 text-center">
          <p class="headline-b text-black">선택한 조건의 상품이 없어요.</p>
          <p class="body-1-r mt-2 text-rgray-600">다른 필터로 검색해 보세요.</p>
        </div>
      </div>
    </ClientOnly>

    <!-- order -->
    <AppModalBottomSheet :is-open="isOrderFilterOpen" @update-open="onUpdateOrderModalValue">
      <div class="w-full space-y-8 px-5 pb-12 md:max-w-pc">
        <div v-for="order in getOrderList" :key="order.code" class="subhead-2-b mx-auto w-fit cursor-pointer text-center" @click="() => onClickOrderFilter(order.code)">
          <p :class="getProductListOptions.orderBy == order.code ? 'text-black' : 'text-rgray-300'">
            {{ order.name }}
          </p>
        </div>
      </div>
    </AppModalBottomSheet>

    <!-- 필터 -->
    <AppModalBottomSheet :is-open="isFilterOpen" @update-open="onCloseFilter">
      <div class="h-[430px] w-full px-5 md:max-w-pc">
        <!-- header -->
        <div class="flex gap-4">
          <p
            v-for="filterHead in getUsedFilters"
            :key="filterHead.code"
            class="headline-b cursor-pointer pb-1.5"
            :class="filterView.code == filterHead.code ? 'border-b-2 border-black text-black' : 'border-b-2 border-transparent text-rgray-200'"
            @click="() => onChangeFilter(filterHead)"
          >
            {{ filterHead.name }}
          </p>
        </div>
        <PartProductListFilterTabContent :filter-list="filterList" :active-filter-list="onChangeActiveList()" :used-filter="filterView" @click-filter="onClickFilter" />
      </div>

      <div class="fixed bottom-0 w-full bg-white pb-2 pt-2 md:max-w-pc">
        <PartProductListFilterTabListAll v-if="filteredItemListHandler().length > 0" :filtered-item-list="filteredItemListHandler()" class="mb-4" @remove-filtered-item="onRemoveFilteredItem" />
        <div class="flex w-full gap-1 px-5">
          <button class="border border-rgray-100 px-2 pt-1" @click="onResetFilter">
            <i class="rb-reset my-auto text-32xl text-black"></i>
          </button>
          <button class="btn-h52-r0-fill-wfull" @click="onConfirmFilter">필터 적용하기</button>
        </div>
      </div>
    </AppModalBottomSheet>
  </div>
</template>

<script setup>
// 구매하기 페이지
import { storeToRefs } from 'pinia'
// LMS 분기 버전
import { useThrottleFn, useScroll } from '@vueuse/core'
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import filterData from '../../assets/data/product/filterData.json'

defineOptions({
  name: 'Alive'
})
definePageMeta({
  middleware: [
    async (_, from) => {
      const isLoading = useLoadingProductList()

      if (from.name === 'product-id' || from.name === 'search' || from.name === 'cart') {
        if (isLoading.value) {
          isLoading.value = false
        }
      } else if (!isLoading.value) {
        isLoading.value = true
      }
    }
  ]
})

const config = useRuntimeConfig()
const isLoading = useLoadingProductList()
const continueShopping = useContinueShopping()
continueShopping.value = '/product_list'
const piniaProductStore = productStore()
// LMS 분기 버전
if (appStore().getDomain === 'orm') {
  piniaProductStore.setProductListFiltersData(filterData)
} else {
  await piniaProductStore.setProductListFilters()
}
const { getProductListOptions, getProductListOptionsParams, getBrandList, getGradeList, getSeasonList, getTypeList, getPriceList, getUsedFilters, getOrderList } = storeToRefs(piniaProductStore)

const route = useRoute()
const router = useRouter()
const device = useDevice()

const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')

const isOrderFilterOpen = ref(false)
const isFilterOpen = ref(false)
const filterList = ref()

const filterView = ref()
const brandFilterList = ref([])
const gradeFilterList = ref([])
const seasonFilterList = ref([])
const typeFilterList = ref([])
const priceFilter = ref([])
const isShowTab = ref(true)

let bottomNavi
let scrollHandler
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

/**
 * "order by" modal open/close
 * @param {boolean} isOpen
 */
const onUpdateOrderModalValue = (isOpen) => {
  isOrderFilterOpen.value = isOpen
  if (isOrderFilterOpen.value) hideChannelButton()
  else showChannelButton()
}

/**
 * select "order by" modal data
 * @param {string} code order type
 */
const onClickOrderFilter = (code) => {
  amplitude.track('array', {
    type: formatAmpOrderNameFilter(code)
  })
  piniaProductStore.setOrder(code)
  onUpdateOrderModalValue(false)
  window.scrollTo(0, 0)
  execute()
}

/**
 * reset filtered data
 * @param {'all' | 'brand' | 'grade' | 'season' | 'type' | 'price'} filterType filter type
 */
const onResetFilterInTab = (filterType) => {
  router.replace({ query: {} })

  if (filterType === 'all') {
    brandFilterList.value = []
    gradeFilterList.value = []
    seasonFilterList.value = []
    typeFilterList.value = []
    priceFilter.value = []
    piniaProductStore.setProductOptions({
      ...getProductListOptions.value,
      page: 1,
      brand: [],
      grade: [],
      season: [],
      type: [],
      price: []
    })
  }
  if (filterType === 'brand') brandFilterList.value = []
  if (filterType === 'grade') gradeFilterList.value = []
  if (filterType === 'season') seasonFilterList.value = []
  if (filterType === 'type') typeFilterList.value = []
  if (filterType === 'price') priceFilter.value = []

  piniaProductStore.setProductOptions({
    ...getProductListOptions.value,
    page: 1,
    [filterType]: []
  })
  execute()
}

/**
 * pagination 페이지 전환 이벤트
 * @param {number} page
 */
const onChangePage = (page) => {
  piniaProductStore.setProductOptions({
    ...getProductListOptions.value,
    page
  })
  window.scrollTo(0, 0)
  execute()
}

/**
 * "filter" modal open/close
 * @param {'brand' | 'grade' | 'season' | 'type' | 'price'} filterType filter type : brand, grade, season, type, price
 */
const onUpdateFilterModalValue = (filterType) => {
  filterView.value = filterType
  isFilterOpen.value = true
  onChangeFilter(filterType)
  if (device.isMobile) hideChannelButton()
}

/**
 * "filter" modal close
 */
const onCloseFilter = () => {
  isFilterOpen.value = false
  // 필터 저장 없이 나가면 이전 데이터로 초기화.
  brandFilterList.value = getProductListOptions.value.brand
  gradeFilterList.value = getProductListOptions.value.grade
  seasonFilterList.value = getProductListOptions.value.season
  typeFilterList.value = getProductListOptions.value.type
  priceFilter.value = getProductListOptions.value.price
  if (device.isMobile) showChannelButton()
}

/**
 * change filter type in "filter" modal. 기준이 되는 filterList 변경
 * @param {'brand' | 'grade' | 'season' | 'type' | 'price'} filterType filter type : brand, grade, season, type, price
 */
const onChangeFilter = (filterType) => {
  filterView.value = filterType
  if (filterType.code === 'brand') filterList.value = getBrandList.value
  if (filterType.code === 'grade') filterList.value = getGradeList.value
  if (filterType.code === 'season') filterList.value = getSeasonList.value
  if (filterType.code === 'type') filterList.value = getTypeList.value
  if (filterType.code === 'price') filterList.value = getPriceList.value
}

/**
 * filter active list for "filter" modal. 활성화된 filterlist 변경
 */
const onChangeActiveList = () => {
  if (filterView.value.code === 'brand') return brandFilterList.value
  if (filterView.value.code === 'grade') return gradeFilterList.value
  if (filterView.value.code === 'season') return seasonFilterList.value
  if (filterView.value.code === 'type') return typeFilterList.value
  if (filterView.value.code === 'price') return priceFilter.value
}

/**
 * select filter data in "filter" modal
 * @param {Array<GlobalCode>} activeList
 */
const onClickFilter = (activeList) => {
  if (filterView.value.code === 'brand') brandFilterList.value = activeList
  if (filterView.value.code === 'grade') gradeFilterList.value = activeList
  if (filterView.value.code === 'season') seasonFilterList.value = activeList
  if (filterView.value.code === 'type') typeFilterList.value = activeList
  if (filterView.value.code === 'price') priceFilter.value = activeList
}

/**
 * 필터 바텀시트 하단 - 필터 칩 리스트
 * @returns {Array<GlobalCode & { filterType: string }>}
 */
const filteredItemListHandler = () => {
  const brandFiltered = brandFilterList.value.map((item) => ({ ...item, filterType: 'brand' }))
  const gradeFiltered = gradeFilterList.value.map((item) => ({ ...item, filterType: 'grade' }))
  const seasonFiltered = seasonFilterList.value.map((item) => ({ ...item, filterType: 'season' }))
  const typeFiltered = typeFilterList.value.map((item) => ({ ...item, filterType: 'type' }))
  const priceFiltered = priceFilter.value.map((item) => ({ ...item, filterType: 'price' }))
  return [...brandFiltered, ...gradeFiltered, ...seasonFiltered, ...typeFiltered, ...priceFiltered]
}

/**
 * 필터 바텀시트 하단 - 필터 칩 - 클릭 시, 필터 삭제 이벤트
 * @param {Array<GlobalCode & { filterType: string }>} item
 */
const onRemoveFilteredItem = (item) => {
  let filteredList
  if (item.filterType === 'brand') filteredList = brandFilterList
  if (item.filterType === 'grade') filteredList = gradeFilterList
  if (item.filterType === 'season') filteredList = seasonFilterList
  if (item.filterType === 'type') filteredList = typeFilterList
  if (item.filterType === 'price') filteredList = priceFilter
  filteredList.value = filteredList.value.filter((filtered) => filtered.code !== item.code)
}

/**
 * 성별 카테고리 변경
 * - 10 : 남성
 * - 20 : 여성
 * - 30 : 아동
 * @param {'10' | '20' | '30'} cat
 */
const onUpdateCategoryGender = (cat) => {
  amplitude.track('filter', {
    gender: cat === '20' ? 'female' : 'male'
  })

  piniaProductStore.changeCategoryDomain(cat)
  piniaProductStore.resetOptions('gender')
  window.scrollTo(0, 0)

  onResetFilter()
  execute()
}

/**
 * 탭 카테고리 변경 (상의, 하의 등 옷 타입)
 * @param {string} cat
 */
const onUpdateCategoryClothes = (cat) => {
  amplitude.track('filter', {
    gender: formatAmpGenderNameFilter(getProductListOptions.value.categoryClothes),
    category: formatAmpCatNameFilter(cat.code)
  })

  piniaProductStore.changeCategoryGender(cat)
  piniaProductStore.resetOptions('clothes')
  window.scrollTo(0, 0)

  onResetFilter()
  execute()
}

/**
 * reset filter list
 */
const onResetFilter = () => {
  router.replace({ query: {} })
  brandFilterList.value = []
  gradeFilterList.value = []
  seasonFilterList.value = []
  typeFilterList.value = []
  priceFilter.value = []
}

/**
 * confirm filtered data
 */
const onConfirmFilter = () => {
  if (isLoading.value) {
    isLoading.value = false
  }
  amplitude.track('filter', {
    brand: brandFilterList.value.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
    grade: gradeFilterList.value.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
    season: seasonFilterList.value.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
    type: typeFilterList.value.reduce((acc, cur, idx) => (idx === 0 ? `${cur.code}` : `${acc},${cur.code}`), '') ?? '',
    price: priceFilter.value.length > 0 ? formatAmpPriceNameFilter(priceFilter.value[0].code.split('r')[0], priceFilter.value[0].code.split('r')[1]) : ''
  })

  piniaProductStore.setProductOptions({
    ...getProductListOptions.value,
    page: 1,
    brand: brandFilterList.value,
    grade: gradeFilterList.value,
    season: seasonFilterList.value,
    type: typeFilterList.value,
    price: priceFilter.value
  })
  isFilterOpen.value = false

  if (device.isMobile) showChannelButton()
  window.scrollTo(0, 0)
  execute()
}

/**
 * query에 filter data가 있는지 확인하고, 필터를 세팅해준다.
 * @param {boolean} isFirst 처음 마운트 될 때 호출되었는지 여부
 */
const onSetQueryFilter = (isFirst) => {
  if (route.query.brand) {
    const queryList = route.query.brand.split(',')

    queryList?.forEach((queryItem) => {
      brandFilterList.value.push(getBrandList.value.find((item) => queryItem === item.code))
    })
  }
  if (route.query.grade) {
    const queryList = route.query.grade.split(',')

    queryList?.forEach((queryItem) => {
      gradeFilterList.value.push(getGradeList.value.find((item) => queryItem === item.code))
    })
  }
  if (route.query.season) {
    const queryList = route.query.season.split(',')
    queryList?.forEach((queryItem) => {
      seasonFilterList.value.push(getSeasonList.value.find((item) => queryItem === item.code))
    })
  }
  if (route.query.type) {
    const queryString = route.query.type

    // 중고 품목은 코드에 구분자인 쉼표가 있기 때문에 각각 체크함.
    if (queryString.includes('sh,sr')) {
      typeFilterList.value.push(getTypeList.value.find((item) => item.code === 'sh,sr'))
    }
    if (queryString.includes('fp')) {
      typeFilterList.value.push(getTypeList.value.find((item) => item.code === 'fp'))
    }
  }
  if (route.query.price) {
    const queryList = route.query.price.split(',')

    queryList?.forEach((queryItem) => {
      priceFilter.value.push(getPriceList.value.find((item) => queryItem === item.code))
    })
  }

  // cat
  const catList = catListHandler()

  // 구매하기 필터 option
  const option = {
    ...getProductListOptions.value,
    brand: brandFilterList.value,
    grade: gradeFilterList.value,
    season: seasonFilterList.value,
    type: typeFilterList.value,
    price: priceFilter.value,
    categoryGender: catList[0],
    categoryClothes: catList[1],
    categoryDnu: catList[2]
  }
  if (isFirst) {
    option.orderBy = 'latest'
  }
  if (route.query.order != null) {
    option.orderBy = route.query.order
  }

  // 최종 한번만 option setting
  piniaProductStore.setProductOptions(option)
}

/**
 * 카테고리 필터 우선순위 List 세팅 (성별 카테고리, 옷타입 카테고리, ?? 카테고리)
 * @returns {[string, string, string]}
 */
const catListHandler = () => {
  const brandCat1 = formatCategoryDomainCode()
  const brandCat2 = '00'
  const brandCat3 = '00'

  const filterCat1 = getProductListOptions.value.categoryGender
  const filterCat2 = getProductListOptions.value.categoryClothes
  const filterCat3 = getProductListOptions.value.categoryDnu

  if (route.query.cat) {
    const routeCat1 = route.query.cat.slice(0, 2)
    const routeCat2 = route.query.cat.slice(2, 4)
    const routeCat3 = route.query.cat.slice(4, 6)

    // 1번 우선순위가 라우트로 들어온 CAT
    if (routeCat1 !== brandCat1 || routeCat2 !== brandCat2 || routeCat3 !== brandCat3) return [routeCat1, routeCat2, routeCat3]
    return [brandCat1, brandCat2, brandCat3]
  }
  // 2번 우선순위는 이미 필터에 적용되어있는 CAT
  if (filterCat1 !== brandCat1 || filterCat2 !== brandCat2 || filterCat3 !== brandCat3) return [filterCat1, filterCat2, filterCat3]
  // 3번은 그냥 기본
  return [brandCat1, brandCat2, brandCat3]
}

const toTopScrollHandler = () => {
  isShowTab.value = true
  showChannelButton()
  bottomNavi.style.transform = 'translateY(0)'
}
/**
 * 스크롤 이동에 따라 탭을 보여주거나 사라지게 조작
 */
const onCheckScroll = () => {
  scrollHandler = useThrottleFn(() => {
    // safari에서 스크롤이 바운스될때 toBottom으로 되어서 탭이 안보이는 이슈때문에
    // 스크롤이 100 이하일때 탭이 보이도록
    if (y.value <= 100 || toTop.value) {
      toTopScrollHandler()
    }
    if (toBottom.value && y.value > 100) {
      isShowTab.value = false
      hideChannelButton()
      bottomNavi.style.transform = 'translateY(100%)'
    }
  }, 200)

  window.addEventListener('scroll', scrollHandler)
}

onSetQueryFilter(true)

// TODO: useAsyncData fetch 로직 분리 필요.
const {
  data: productList,
  pending,
  execute
} = await useAsyncData('productList', () =>
  $fetch(`${config.public.baseURL}/v20/products`, {
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    },
    params: getProductListOptionsParams.value
  })
)

if (productList.value?.statusCode === 200) {
  userStore().setGlobalUserInfo(productList.value.userSession)
}

onMounted(() => {
  amplitude.track('itemlist_pv')
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
  if (process.client) {
    bottomNavi = document.getElementById('bottomNavigation')
  }
  onCheckScroll()
})

onActivated(() => {
  onSetQueryFilter()
  execute()

  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })

  onCheckScroll()
})

onDeactivated(() => {
  window.removeEventListener('scroll', scrollHandler)
})

onBeforeRouteLeave((to, from, next) => {
  toTopScrollHandler()
  window.removeEventListener('scroll', scrollHandler)
  isShowTab.value = true
  if (to.name !== 'product-id' && to.name !== 'cart' && to.name !== 'search') {
    setTimeout(() => {
      piniaProductStore.resetOptions('domain')
      onResetFilter()
    }, 1000)
  } else {
    const isLoading = useLoadingProductList()
    isLoading.value = false
  }
  next()
})
</script>
