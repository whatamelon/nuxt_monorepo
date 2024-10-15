<template>
  <PartProductSoldout v-if="data.data?.isSoldOut == true"></PartProductSoldout>

  <div v-else class="bg-white pb-[120px]">
    <div id="product_detail_top_section">
      <PartProductImgList :img-list="data.data?.imgs"></PartProductImgList>

      <PartProductDetailInfo
        :prod-d-t-o="data.data"
        :selected-options="selectedOptions"
        :resale-point="resalePoint"
        :is-resaleable="isResaleable"
        @click-option="onSelectOptions"
        @click-heart="onClickHeart"
      ></PartProductDetailInfo>

      <PartProductBottomButton :prod-d-t-o="data.data" :heart-flag="data.data?.heartFlag" @click-heart="onClickHeart" @click-order="onClickOrder"></PartProductBottomButton>
    </div>

    <PartProductOptListBottomSheet
      :is-open="isOpenOptListBottomSheet"
      :prod-d-t-o="data.data"
      :selected-options="selectedOptions"
      :opt-list="data.data?.optList"
      @close="toggleBottomSheetHandler"
      @set-option="onSelectOptions"
    ></PartProductOptListBottomSheet>

    <PartProductTabbar :prod-d-t-o="data.data" :selected-tab="selectedTab" :tab-list="tabList" @select-tab="onClickTab"></PartProductTabbar>

    <ClientOnly>
      <PartProductTabDetail
        v-if="selectedTab.code == 'info'"
        :prod-d-t-o="data.data"
        :clean-list="cleanList"
        :detail-info="detailInfo"
        :detail-type="detailType"
        :detail-grade="detailGrade"
        :detail-brand-intro="brandIntro"
      ></PartProductTabDetail>
    </ClientOnly>

    <PartProductTabSize v-if="selectedTab.code == 'size'" :prod-d-t-o="data.data"></PartProductTabSize>

    <PartProductTabQna v-if="selectedTab.code == 'qna'" :qna-obj="qnaObj" :prod-name="data.data?.name"></PartProductTabQna>

    <!-- 위로 이동 floating button -->
    <div class="fixed bottom-0 w-full md:w-[375px]">
      <button v-show="isShowUpButton" id="product_detail_go_up_button" type="button" class="absolute right-2 h-11 w-11 rounded-full bg-black p-2.5 transition-all" @click="goToTop">
        <i class="rb-arrow-up text-24xl text-white"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
// 상품상세페이지
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { useThrottleFn, useScroll } from '@vueuse/core'
import { addProductHeartAPI, deleteProductHeartAPI, getProductIdAPI, getProductIdPageAPI, getProductIdQnaAPI } from '~/composables/apiFactories/product'
import { getSncodeItemAPI } from '~/composables/apiFactories/sell'

const route = useRoute()
const device = useDevice()
const router = useRouter()
const url = useRequestURL()

let bottomNavi
let bottomButton
let productDetailTabBar
let productDetailGoUpButton // 위로 이동 floating button
let scrollDirectionHandler
let floatingBrandButton // greenforet 전용 브랜드 이동 floating button
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

const cleanList = ref({
  imgs: [],
  texts: []
})
const detailInfo = ref([])
const isOpenOptListBottomSheet = ref(false)
const selectedOptions = ref([])
const isShowUpButton = ref(false)

const { data, error } = await getProductIdAPI(route.params.id)
if (error.value != null) {
  if (error.value.statusCode === 404) {
    if (error.value.message === 'product_not_found') {
      isSoldout.value = true
    }
  }
}

if (data.value.data.isSoldOut === false) {
  useHead({
    title: appStore().getHeadObject.brandMetadata.title,
    meta: [
      {
        hid: 'og:title',
        name: 'og:title',
        property: 'og:title',
        content: appStore().getHeadObject.brandMetadata.title
      },
      {
        hid: 'description',
        name: 'description',
        content: `${data.value.data.name}`
      },
      {
        hid: 'og:description',
        name: 'og:description',
        property: 'og:description',
        content: `${data.value.data.name}`
      },
      {
        hid: 'url',
        name: 'url',
        content: `https://${url.hostname}${route.fullPath}`
      },
      {
        hid: 'og:url',
        name: 'og:url',
        property: 'og:url',
        content: `https://${url.hostname}${route.fullPath}`
      },
      {
        hid: 'keywords',
        name: 'keywords',
        property: 'keywords',
        content: data.value.data.name
          .replace(/[{}[]\/?,;:|\)*~`!^-_+<>@#$%&\\=\('"]/gi, '')
          .split(' ')
          .join(',')
      },
      {
        hid: 'og:keywords',
        name: 'og:keywords',
        property: 'og:keywords',
        content: data.value.data.name
          .replace(/[{}[]\/?,;:|\)*~`!^-_+<>@#$%&\\=\('"]/gi, '')
          .split(' ')
          .join(',')
      },
      {
        hid: 'type',
        name: 'type',
        property: 'type',
        content: 'product'
      },
      {
        hid: 'og:type',
        name: 'og:type',
        property: 'og:type',
        content: 'product'
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: data.value.data.imgThumbLink != null ? data.value.data.imgThumbLink : 'https://orm.the-relay.kr/img/orm_thumb.jpg'
      },
      {
        hid: 'og:id',
        name: 'og:id',
        property: 'og:id',
        content: data.value.data.prodId
      },
      {
        hid: 'og:price:amount',
        name: 'og:price:amount',
        property: 'og:price:amount',
        content: data.value.data.priceOrg === '0' ? `${data.value.data.priceLow}.0` : `${data.value.data.priceOrg}.0`
      },
      {
        hid: 'product:price:amount',
        name: 'product:price:amount',
        property: 'product:price:amount',
        content: data.value.data.priceOrg === '0' ? `${data.value.data.priceLow}.0` : `${data.value.data.priceOrg}.0`
      },
      {
        hid: 'og:price:currency',
        name: 'og:price:currency',
        property: 'og:price:currency',
        content: 'KRW'
      },
      {
        hid: 'product:price:currency',
        name: 'product:price:currency',
        property: 'product:price:currency',
        content: 'KRW'
      },
      {
        hid: 'og:availability',
        name: 'og:availability',
        property: 'og:availability',
        content: 'available for order'
      },
      {
        hid: 'product:availability',
        name: 'product:availability',
        property: 'product:availability',
        content: 'available for order'
      },
      {
        hid: 'product:retailer_item_id',
        name: 'product:retailer_item_id',
        property: 'product:retailer_item_id',
        content: data.value.data.prodId
      },
      {
        hid: 'product:brand',
        name: 'product:brand',
        property: 'product:brand',
        content: data.value.data.brandSubName
      },
      {
        hid: 'product:condition',
        name: 'product:condition',
        property: 'product:condition',
        content: 'used'
      },
      {
        hid: 'product:sale_price:amount',
        name: 'product:sale_price:amount',
        content: `${data.value.data.priceLow}.0`
      },
      {
        hid: 'product:sale_price:currency',
        name: 'product:sale_price:currency',
        content: 'KRW'
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: `https://${appStore().getDomain}.the-relay.kr${route.fullPath}`
      }
    ]
  })
}

const pageObj = await getProductIdPageAPI(route.params.id)

const qnaObj = await getProductIdQnaAPI({
  prodId: route.params.id,
  params: {
    page: 1,
    limit: 50
  }
})

const sncodepointObj = await getSncodeItemAPI(data.value.data?.snCode)
const resalePoint = ref(0)
const isResaleable = ref(false)
if (sncodepointObj.error.value) {
  resalePoint.value = null
  isResaleable.value = true
} else {
  resalePoint.value = sncodepointObj.data.value.data.credit
  isResaleable.value = sncodepointObj.data.value.data.resalable
  // if (sncodepointObj.data.value.data.status === '판매중지') {
  //   isResaleable.value = false
  // } else {
  //   isResaleable.value = true
  // }
}
// if (sncodepointObj.error.value.statusCode === 401) {
//   resalePoint.value = null
// } else if (sncodepointObj.error.value.statusCode === 404) {
//   resalePoint.value = null
// } else if (sncodepointObj.error.value.statusCode === 400) {
//   resalePoint.value = null
// }

// tabbar
const findTabCompIndex = pageObj.data.value.data?.pageComponents.findIndex((element) => element.template.type === 'ProductDetailTabBar')
const selectedTab = ref(pageObj.data.value.data?.pageComponents[findTabCompIndex].contents.list[0])
const tabList = ref(pageObj.data.value.data?.pageComponents[findTabCompIndex].contents.list)

if (data.value.data?.detailClean) {
  JSON.parse(data.value.data?.detailClean).forEach((e) => {
    if (e.indexOf('http') !== -1) {
      cleanList.value.imgs.push(e)
    } else {
      cleanList.value.texts.push(e)
    }
  })
}

if (data.value.data?.detailInfo) {
  detailInfo.value = JSON.parse(data.value.data?.detailInfo)
} else {
  detailInfo.value = []
}

// detail type
const findDetailTypeIndex = ref(pageObj.data.value.data?.pageComponents.findIndex((e) => e.template.alias === 'ProductDetailType'))
const detailType = ref(findDetailTypeIndex.value > -1 ? pageObj.data.value.data?.pageComponents[findDetailTypeIndex.value].contents : null)

// detail grade
const findDetailGradeIndex = ref(pageObj.data.value.data?.pageComponents.findIndex((v) => v.template.alias === 'ProductDetailGrade'))
const detailGrade = ref(findDetailGradeIndex.value > -1 ? pageObj.data.value.data?.pageComponents[findDetailGradeIndex.value].contents : null)

// brand intro
const findBrandIntroIndex = ref(pageObj.data.value.data?.pageComponents.findIndex((x) => x.template.alias === 'BrandIntroduce'))
const brandIntro = ref(findBrandIntroIndex.value > -1 ? pageObj.data.value.data?.pageComponents[findBrandIntroIndex.value].contents : null)

/** toggle bottom sheet(제품 옵션 선택 창) */
const toggleBottomSheetHandler = () => {
  isOpenOptListBottomSheet.value = !isOpenOptListBottomSheet.value
  if (device.isMobile) {
    if (isOpenOptListBottomSheet.value) hideChannelButton()
    else showChannelButton()
  }
}

/**
 * 상세정보, 사이즈, 문의 탭 클릭 이동
 * @param {string} tab
 * */
const onClickTab = (tab) => {
  const topSection = document.getElementById('product_detail_top_section').getBoundingClientRect().height
  window.scrollTo(0, topSection)
  selectedTab.value = tab
}

/**
 * 옵션 선택.
 * @param {ProductOptions} option
 */
const onSelectOptions = (option) => {
  const findedIdx = selectedOptions.value.findIndex((e) => e.optId === option.optId)
  if (findedIdx > -1) {
    selectedOptions.value.splice(findedIdx, 1)
  } else {
    selectedOptions.value.push(option)
  }
}

/** 찜 목록 토글
 * @param {'info'|'button'} position
 */
const onClickHeart = async (position) => {
  if (!data.value.data.heartFlag) {
    const addheartObj = await addProductHeartAPI(data.value.data.prodId)
    if (addheartObj.error.value != null) {
      useRetryError(addheartObj.error.value.data.statusCode, addheartObj.execute)
    } else {
      let clickedpage
      if (position === 'button') clickedpage = 'detail'
      else if (position === 'info') clickedpage = 'detail2'

      amplitude.track('addwish_click', {
        clickedpage,
        event_no: route.query.en ?? '',
        event_posi: route.query.ep ?? '',
        brand: data.value.data.brandSubName,
        prodid: data.value.data.prodId,
        name: data.value.data.name,
        price: data.value.data.priceLow,
        discountpercent: data.value.data.priceLowRate,
        addcount: data.value.data.badgeType === 'na' ? 'no' : 'yes'
      })
      data.value.data.heartFlag = true
    }
  } else {
    const deleteheartObj = await deleteProductHeartAPI(data.value.data.prodId)
    if (deleteheartObj.error.value != null) {
      useRetryError(deleteheartObj.error.value.data.statusCode, deleteheartObj.execute)
    } else {
      data.value.data.heartFlag = false
    }
  }
}

/** 주문하기 버튼 클릭. - open bottom sheet */
const onClickOrder = () => {
  if (!userStore().getLoginState) {
    appStore().setDialogDTO({
      message: '로그인 후 이용해주세요.',
      timeout: 1
    })
    const recentRoute = useCookie('RECENT_ROUTE')
    recentRoute.value = route.fullPath
    router.push('/login')
  } else {
    toggleBottomSheetHandler()
  }
}
const toTopScrollHandler = () => {
  showChannelButton()
  bottomNavi.style.transform = 'translateY(0)'
  bottomButton.style.transform = 'translateY(0)'
  productDetailTabBar.style.top = '55px'
  productDetailTabBar.style.zIndex = '995'
  // 채널톡 버튼 위치가 디바이스 너비에 따라서 다르기 때문에 floating button의 위치도 달라짐.
  if (window.innerWidth < 600) {
    productDetailGoUpButton.style.bottom = '150px'
  } else {
    productDetailGoUpButton.style.bottom = '98px'
    if (device.isMobile && isShowUpButton.value) {
      greenforetFloatingHandler(152)
    }
  }
}
const onCheckScroll = () => {
  scrollDirectionHandler = useThrottleFn(() => {
    // safari에서 스크롤이 바운스될때 toBottom으로 되어서 탭이 안보이는 이슈때문에
    // 스크롤이 100 이하일때 탭이 보이도록
    if (y.value <= 100 || toTop.value) {
      toTopScrollHandler()
      if (device.isMobile) {
        if (isShowUpButton.value) {
          greenforetFloatingHandler(210)
        } else {
          greenforetFloatingHandler(152)
        }
      }
    }
    if (toBottom.value && y.value > 100) {
      hideChannelButton()
      bottomNavi.style.transform = 'translateY(100%)'
      bottomButton.style.transform = 'translateY(100%)'
      productDetailTabBar.style.top = '-1000px'
      productDetailTabBar.style.zIndex = '0'
      productDetailGoUpButton.style.bottom = '40px'
      if (device.isMobile) {
        greenforetFloatingHandler(100)
      }
    }

    // product_detail_tab_bar 이하로 내리면 상단 이동 버튼 보여주기.
    if (window.pageYOffset > 1100) isShowUpButton.value = true
    else isShowUpButton.value = false
  }, 200)

  window.addEventListener('scroll', scrollDirectionHandler)
}

/** greenforet에서만 나오는 floating 버튼 제어 */
const greenforetFloatingHandler = (bottom) => {
  if (appStore().getDomain === 'greenforet') {
    floatingBrandButton.style.bottom = `${bottom}px`
  }
}

const goToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '',
    home: true,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
  amplitude.track('itemdetail_pv', {
    clickedpage: route.query.cp ?? 'etc',
    event_no: route.query.en ?? '',
    event_posi: route.query.ep ?? '',
    brand: data.value.data.brandSubName,
    prodid: data.value.data.prodId,
    name: data.value.data.name,
    price: data.value.data.priceLow,
    discountpercent: data.value.data.priceLowRate,
    addcount: data.value.data.badgeType === 'na' ? 'no' : 'yes'
  })
  if (process.client) {
    bottomNavi = document.getElementById('bottomNavigation')
    bottomButton = document.getElementById('bottomFixedButton')
    productDetailTabBar = document.getElementById('product_detail_tab_bar')
    productDetailGoUpButton = document.getElementById('product_detail_go_up_button')
    // greenforet에서만 나오는 floating 버튼 제어
    if (appStore().getDomain === 'greenforet') {
      floatingBrandButton = document.getElementById('floating_gobrand')
    }
  }
  onCheckScroll()
})

onActivated(() => {
  // keep alive 속성에 의해 다른 화면 전환시, 이전 화면의 header가 남아있음.
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '',
    home: true,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})

onBeforeRouteLeave((to, from, next) => {
  toTopScrollHandler()
  window.removeEventListener('scroll', scrollDirectionHandler)
  if (device.isMobile) {
    greenforetFloatingHandler(152)
  }
  if (to.name === 'product_list') {
    const isLoading = useLoadingProductList()
    isLoading.value = false
  }
  next()
})
</script>
