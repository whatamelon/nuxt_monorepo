<template>
  <div
    id="bottomNavigation"
    style="z-index: 500"
    class="fixed bottom-0 flex min-h-16 w-full min-w-[280px] translate-y-0 transform items-center gap-2 border-t border-rgray-200 bg-white px-5 py-2.5 transition ios-safe-area md:max-w-pc"
  >
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
        <Transition>
          <p
            v-if="user.getShowSellTooltip"
            class="bottom-arrow caption-1-b absolute bottom-[52px] left-[calc(19%)] z-[500] min-w-[87px] rounded bg-caribbean-green-300 px-2 py-1.5 text-[#222] ios-safe-area-margin-bottom"
          >
            판매하고 포인트 받기!
          </p>
        </Transition>
        <Transition>
          <p
            v-if="i.name === 'logn' && user.getShowJoinTooltip"
            class="bottom-arrow caption-1-b absolute bottom-[52px] right-2.5 z-[500] min-w-[87px] rounded bg-caribbean-green-300 px-2 py-1.5 text-[#222] ios-safe-area-margin-bottom"
          >
            가입 즉시 2,000P !
          </p>
        </Transition>
        <NuxtLink :to="i.route" @click.native="() => clickItem(i)">
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
import { showChannelButton, hideChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'

const user = userStore()
const route = useRoute()
const isHomeDialogOpen = useHomeDialogOpen()

const activeRoute = ref('home')

let timer // join 유도 말풍선을 5초 뒤에 사라지게 하기 위한 타이머

const routeMatch = () => {
  // console.log('routename,,,',route.name)
  if (route.name) {
    if (route.name === 'product_list') {
      activeRoute.value = 'prli'
    }
    if (route.name === 'sell') {
      activeRoute.value = 'sell'
    }
    if (route.name === 'index') {
      activeRoute.value = 'home'
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

    if (route.name.includes('event')) {
      activeRoute.value = 'home'
    }
  }
}

const getSellTitle = computed(() => {
  if (appStore().getDomain === 'orm') {
    return '내옷팔기'
  }
  if (appStore().getDomain === 'greenforet') {
    return '리셀하기'
  }
  return '판매하기'
})

const array = computed(() => {
  const menus = [
    {
      title: '쇼핑하기',
      activeIcon: '/icons/bottom_navigation/ic-shopping-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-shopping-24.svg',
      route: '/product_list',
      name: 'prli'
    },
    {
      title: getSellTitle.value,
      activeIcon: '/icons/bottom_navigation/ic-point-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-point-24.svg',
      route: '/sell',
      name: 'sell'
    },
    {
      title: '홈',
      activeIcon: '/icons/bottom_navigation/ic-home-fill-24.svg',
      inactiveIcon: '/icons/bottom_navigation/ic-home-24.svg',
      route: '/',
      name: 'home'
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

const clickItem = (item) => {
  switch (item.name) {
    case 'home':
      amplitude.track('menuhome_click')
      break
    case 'prli':
      amplitude.track('menuBuy_click')
      break
    case 'favr':
      amplitude.track('menuwish_click')
      break
    case 'sell':
      amplitude.track('menusell_click')
      break
    case 'mypg':
      amplitude.track('menuMypage_click')
      break
    case 'logn':
      amplitude.track('login_click')
      break
    default:
  }
}

routeMatch()

/**
 * 회원가입 유도 말풍선 관련
 */
watch(
  () => user.getShowJoinTooltip,
  (to) => {
    clearTimeout(timer)
    if (to && !isHomeDialogOpen.value) {
      hideChannelButton()
      timer = setTimeout(() => {
        user.setShowJoinTooltip(false)
        showChannelButton()
      }, 5000)
    }
  }
)

watch(
  () => user.getShowSellTooltip,
  (to) => {
    if (route.name === 'sell-new') {
      user.setShowSellTooltip(false)
    }
    clearTimeout(timer)
    if (to && !isHomeDialogOpen.value) {
      hideChannelButton()
      timer = setTimeout(() => {
        user.setShowSellTooltip(false)
        showChannelButton()
      }, 5000)
    }
  }
)

watch(
  () => route.name,
  () => {
    const bottomNavi = document.getElementById('bottomNavigation')
    bottomNavi.style.bottom = '0'

    routeMatch()
    // index 페이지에서 비로그인 상태일때 회원가입 유도 말풍선 노출
    if (route.name === 'index') {
      hideChannelButton()
      if (!isHomeDialogOpen.value) {
        user.setShowJoinTooltip(true)
        // 로그인 상태 이면서, 대량 건이 있거나 / 로그인 상태 이면서, 소량 건이 있고, 보상 포인트가 있거나
        if (user.getLoginState && (user.getUserAction.isInSellBig || (user.getUserAction.isInSellSmall && user.getSellActionTotalPoints > 0))) {
          user.setShowSellTooltip(true)
        }
      }
    } else {
      user.setShowSellTooltip(false)
      user.setShowJoinTooltip(false)
      showChannelButton()
      clearTimeout(timer)
    }
  }
)

onBeforeMount(() => {
  if (!user.getLoginState && route.name === 'index') {
    // 새로 진입할때 회원가입 유도 말풍선 노출
    hideChannelButton()
    user.setShowJoinTooltip(true)
  }
  // 로그인 상태 이면서, 대량 건이 있거나 / 로그인 상태 이면서, 소량 건이 있고, 보상 포인트가 있거나
  if (user.getLoginState && (user.getUserAction.isInSellBig || (user.getUserAction.isInSellSmall && user.getSellActionTotalPoints > 0))) {
    user.setShowSellTooltip(true)
  }
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bottom-arrow:after {
  content: '';
  border-top: 12px solid;
  @apply border-t-caribbean-green-300;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-radius: 4px;
  bottom: -8px;
  position: absolute;
  right: 35px;
}
</style>
