<template>
  <div id="bottomNavigation" style="z-index: 500" class="fixed bottom-0 flex min-h-16 w-full min-w-[280px] items-center border-t border-rgray-200 bg-white py-2.5 ios-safe-area md:max-w-pc">
    <ClientOnly>
      <template #fallback>
        <div v-for="i in array" :key="i.name" class="my-auto w-1/5 text-center text-rgray-400">
          <img :alt="i.title + ' 아이콘'" class="mx-auto" :src="i.inactiveIcon" />
          <p class="label-2-r mt-0.5">{{ i.title }}</p>
        </div>
      </template>
      <div
        v-for="i in array"
        :key="i.name"
        class="w-1/5 text-center"
        :class="{
          'text-black': i.name === activeRoute,
          'text-rgray-400': i.name != activeRoute
        }"
      >
        <NuxtLink :to="i.route">
          <img :alt="i.title + ' 아이콘'" class="mx-auto" :src="i.name === activeRoute ? i.activeIcon : i.inactiveIcon" />
          <p class="label-2-r mt-0.5">{{ i.title }}</p>
        </NuxtLink>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
// 기본 바텀내비게이션입니다.
// route를 통해서 페이지가 바뀌는것을 보고 activeRoute값을 지정하는 방식입니다.
// 로그인여부에 따라 array 내부 item이 바뀝니다.
const user = userStore()
const route = useRoute()

const activeRoute = ref('home')

const routeMatch = () => {
  // console.log('routename,,,',route.name)
  if (route.name) {
    if (route.name === 'test-product_list') {
      activeRoute.value = 'testprli'
    }
    if (route.name === 'test-sell') {
      activeRoute.value = 'testsell'
    }
    if (route.name === 'test') {
      activeRoute.value = 'testhome'
    }
    if (route.name.includes('my')) {
      if (route.name === 'my-product-favor' || route.name === 'my-product-recent') {
        activeRoute.value = 'favr'
      } else {
        activeRoute.value = 'mypg'
      }
    }
    if (route.name === 'login' || route.name.includes('join')) {
      activeRoute.value = 'logn'
    }
  }
}

const array = computed(() => {
  const menus = [
    {
      title: '쇼핑하기',
      activeIcon: '/icons/bottom_navigation/ic-shopping-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-shopping-24.svg',
      route: '/test/product_list',
      name: 'testprli'
    },
    {
      title: '내옷팔기',
      activeIcon: '/icons/bottom_navigation/ic-point-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-point-24.svg',
      route: '/test/sell',
      name: 'testsell'
    },
    {
      title: '홈',
      activeIcon: '/icons/bottom_navigation/ic-home-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-home-24.svg',
      route: '/test',
      name: 'testhome'
    },
    {
      title: '찜',
      activeIcon: '/icons/bottom_navigation/ic-heart-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-heart-24.svg',
      route: '/my/product/favor',
      name: 'favr'
    }
  ]
  if (user.getLoginState) {
    menus.push({
      title: '마이페이지',
      activeIcon: '/icons/bottom_navigation/ic-user-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-user-24.svg',
      route: '/my',
      name: 'mypg'
    })
    return menus
  }
  menus.push({
    title: '시작하기',
    activeIcon: '/icons/bottom_navigation/ic-user-fill-24.svg',
    inactiveIcon: '/icons/bottom_navigation/ic-user-24.svg',
    route: '/login',
    name: 'logn'
  })
  return menus
})

routeMatch()

watch(
  () => route.name,
  () => {
    routeMatch()
  }
)
</script>
