<template>
  <div class="w-full bg-white pb-32">
    <!-- header -->
    <div class="mx-auto flex w-fit justify-center space-x-4 py-4">
      <p class="headline-b my-auto text-black md:cursor-pointer">찜리스트</p>
      <p class="headline-b my-auto text-rgray-300 md:cursor-pointer" @click="goToRecent">최근 본 상품</p>
    </div>
    <!-- list -->
    <div class="mt-10 px-5">
      <div v-if="data?.data?.content?.length > 0" class="grid grid-cols-2 gap-x-1 gap-y-6">
        <component :is="appStore().getGlobalProductComponent.type" v-for="pr in data.data.content" :key="pr" :product="pr" :types="'wish'"></component>
      </div>

      <div v-else>
        <div class="mx-auto w-fit">
          <div class="mt-10 inline-flex h-20 w-20 items-center justify-center bg-rgray-200 py-4">
            <div class="inline-flex flex-col items-center justify-center gap-2">
              <div class="h-8 w-2 bg-white"></div>
              <div class="h-2 w-2 bg-white"></div>
            </div>
          </div>
        </div>
        <p class="headline-b py-20 text-center text-black">찜한 상품이 없어요</p>

        <button class="subhead-3-b btn-h52-r0-fill-wfull" @click="goToProducList">상품 보러 가기</button>
      </div>

      <PartProductListPagination v-if="data?.data?.content?.length > 0" :total-page="data.data.page.totalPage" :page="data.data.page.page" @update-page="onChangePage"></PartProductListPagination>
    </div>
  </div>
</template>

<script setup>
import { useThrottleFn, useScroll } from '@vueuse/core'
// 찜리스트페이지
const router = useRouter()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()
const continueShopping = useContinueShopping()
continueShopping.value = '/my/product/favor'

let bottomNavi
let scrollDirectionHandler
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

const page = ref(1)

const { data, error, execute } = await useFetch('/v20/products/hearts', {
  method: 'GET',
  baseURL: config.public.baseURL,
  params: {
    page,
    limit: 30
  },
  watch: [page],
  async onRequest({ options }) {
    options.headers = options.headers || {}
    options.headers['Brand-Domain'] = appStore().getDomain

    if (accessToken.value) options.headers.Authorization = `Bearer ${accessToken.value}`
    if (refreshToken.value) options.headers.RefreshToken = `Bearer ${refreshToken.value}`
  },
  deep: true,
  immediate: true
})

if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
} else if (data.value.statusCode === 200) {
  userStore().setGlobalUserInfo(data.value.userSession)
}

/**
 * 페이지 이동
 * @param {number} pg 페이지 번호
 */
const onChangePage = (pg) => {
  page.value = pg
  window.scrollTo(0, 0)
}

/** 최근 본 상품으로 이동 */
const goToRecent = () => {
  router.replace('/my/product/recent')
}

/** 구매하기로 이동 */
const goToProducList = () => {
  router.replace('/product_list')
}
const toTopScrollHandler = () => {
  bottomNavi.style.transform = 'translateY(0)'
}
const onCheckScroll = () => {
  scrollDirectionHandler = useThrottleFn(() => {
    // safari에서 스크롤이 바운스될때 toBottom으로 되어서 탭이 안보이는 이슈때문에
    // 스크롤이 100 이하일때 탭이 보이도록
    if (y.value <= 100 || toTop.value) {
      toTopScrollHandler()
    }
    if (toBottom.value && y.value > 100) {
      bottomNavi.style.transform = 'translateY(100%)'
    }
  }, 200)

  window.addEventListener('scroll', scrollDirectionHandler)
}

onMounted(() => {
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

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollDirectionHandler)
})
</script>
