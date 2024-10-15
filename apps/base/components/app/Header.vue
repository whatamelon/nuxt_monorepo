<template>
  <nav v-if="route.name != 'search'" id="globalHeader" class="fixed top-0 z-50 h-14 w-full min-w-[280px] bg-white md:max-w-pc">
    <div class="relative flex h-full w-full justify-between px-5">
      <ClientOnly>
        <!-- left side -->
        <div class="flex">
          <!-- back -->
          <div v-if="getHeaderType.back" class="flex h-full w-[64px]">
            <i class="rb-arrow-left my-auto cursor-pointer text-24xl text-black" @click="goBack"></i>
          </div>
          <!-- logo -->
          <NuxtImg
            v-if="getHeaderType.logo"
            :src="getHeadObject.brandMetadata.logo_image"
            class="my-auto h-5 cursor-pointer"
            :class="{
              'h-[30px]': getDomain == 'greenforet'
            }"
            @click="goHome"
          />
        </div>

        <!-- middle side -->
        <h1 v-if="getHeaderType.title !== ''" class="subhead-3-b absolute left-1/2 top-1/2 my-auto w-[176px] -translate-x-1/2 -translate-y-1/2 truncate text-center text-black">
          {{ getHeaderType.title }}
        </h1>

        <!-- right side -->
        <div class="flex">
          <div class="flex justify-between space-x-4">
            <!-- home -->
            <i v-if="loginState && getHeaderType.home" class="rb-home-bold my-auto cursor-pointer text-24xl text-black" @click="goHome"></i>
            <!-- search -->
            <i v-if="getHeaderType.search" class="rb-search my-auto cursor-pointer text-24xl text-black" @click="goSearch"></i>
            <!-- cart -->
            <div v-if="loginState && getHeaderType.cart" class="my-auto h-6 w-fit cursor-pointer" @click="goCart">
              <i class="rb-shopping my-auto h-6 text-24xl text-black"></i>
              <p v-if="cartCount > 0" class="caption-2-b absolute right-3 top-2.5 rounded-[10px] bg-black px-1.5 text-white">{{ cartCount }}</p>
            </div>
          </div>
          <!-- close -->
          <i v-if="getHeaderType.close" class="rb-close my-auto cursor-pointer text-24xl text-black" @click="goBack"></i>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import * as amplitude from '@amplitude/analytics-browser'

const { getHeadObject, getHeaderType, getDomain } = storeToRefs(appStore())
const user = userStore()
const route = useRoute()
const router = useRouter()
// const headerShow = ref(false)

const loginState = computed(() => user.getLoginState)
const cartCount = computed(() => user.getCartCnt)

const goHome = () => {
  amplitude.track('menuhome_click')
  // const piniaProductStore = productStore();
  // piniaProductStore.$reset();
  location.href = '/'
}

const goBack = () => {
  if (getHeaderType.value.backRoute !== '') {
    // 판매하기 (sell/new) 단계에서 닫기버튼을 클릭했을때, 수동으로 닫기 이벤트 처리, home으로 이동
    if (getHeaderType.value.backRoute === 'goHome') {
      appStore().setIsManualClose(true)
      router.push('/')
      return
    }
    router.replace(getHeaderType.value.backRoute)
  } else {
    router.go(-1)
  }
}

const goSearch = () => {
  amplitude.track('menusearch_click')
  router.push('/search')
}

const goCart = () => {
  amplitude.track('menucart_click')
  router.push('/cart')
}
</script>
