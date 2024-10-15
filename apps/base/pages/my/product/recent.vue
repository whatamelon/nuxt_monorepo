<template>
  <div class="w-full bg-white pb-32">
    <!-- header -->

    <div class="mx-auto flex w-fit justify-center space-x-4 py-4">
      <p class="headline-b my-auto text-rgray-300 md:cursor-pointer" @click="goToFavor">찜리스트</p>
      <p class="headline-b my-auto text-black md:cursor-pointer">최근 본 상품</p>
    </div>

    <!-- list -->
    <div class="mt-10 px-5">
      <div v-if="getRecentProductList?.length === 0">
        <div class="mx-auto w-fit">
          <div class="mt-10 inline-flex h-20 w-20 items-center justify-center bg-rgray-200 py-4">
            <div class="inline-flex flex-col items-center justify-center gap-2">
              <div class="h-8 w-2 bg-white"></div>
              <div class="h-2 w-2 bg-white"></div>
            </div>
          </div>
        </div>

        <p class="headline-b py-20 text-center text-black">최근 본 상품이 없어요</p>

        <button class="subhead-3-b btn-h52-r0-fill-wfull" @click="goToProducList">상품 보러 가기</button>
      </div>
      <template v-else>
        <ClientOnly>
          <div class="grid grid-cols-2 gap-x-1 gap-y-6">
            <component :is="appStore().getGlobalProductComponent.type" v-for="pr in getRecentProductList" :key="pr" :product="pr" :types="'recent'"></component>
          </div>
        </ClientOnly>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useThrottleFn, useScroll } from '@vueuse/core'
// 최근본 상품 페이지
import { storeToRefs } from 'pinia'

const router = useRouter()
const piniaProductStore = productStore()
const { getRecentProductList } = storeToRefs(piniaProductStore)
const continueShopping = useContinueShopping()
continueShopping.value = '/my/product/recent'

let bottomNavi
let scrollDirectionHandler
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

/** 찜 목록으로 이동 */
const goToFavor = () => {
  router.replace('/my/product/favor')
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
