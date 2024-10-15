<template>
  <div v-if="list.length === 0"></div>
  <div v-else class="px-5 py-10">
    <div class="pb-8">
      <h1 class="display-1-b text-black">{{ data.contents.title }}</h1>
      <p class="body-1-r mt-2 text-rgray-400">{{ data.contents.body }}</p>
    </div>

    <div v-if="list.length > 0" class="grid grid-cols-2 gap-x-1 gap-y-6">
      <component :is="appStore().getGlobalProductComponent.type" v-for="pr in list" :key="pr" :product="pr" :types="'md'" :evt-no="route.params.id"></component>
    </div>

    <div v-else>
      <p class="body-1-r mt-10 text-rgray-600">기획전 상품이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
// 기획전 상품리스트 페이지
// 무한스크롤
import { useThrottleFn, useScroll } from '@vueuse/core'
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

defineOptions({
  name: 'Alive'
})

const route = useRoute()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()
const continueShopping = useContinueShopping()
continueShopping.value = `/event/pl/${route.params.id}`

const page = ref(1)
const loading = ref(false)
const list = ref([])
const data = ref()

let bottomNavi
let scrollDirectionHandler
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

const fetchData = async () => {
  await useFetch(`/v20/components/${route.params.id}`, {
    method: 'GET',
    baseURL: config.public.baseURL,
    params: {
      page,
      limit: 30
    },
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    },
    onResponse({ response }) {
      if (response._data.data) {
        if (page.value === 1) {
          list.value = response._data.data.data.content
        } else {
          list.value = list.value.concat(response._data.data.data.content)
        }
        loading.value = false
        data.value = response._data.data
        userStore().setGlobalUserInfo(response._data.userSession)
      }
    },
    deep: true,
    immediate: true
  }).then((result) => {
    if (result.error.value != null) {
      useRetryError(result.error.value.statusCode, result.execute)
    }
  })
}

onBeforeMount(() => {
  window.scrollTo(0, 0)
  fetchData()
})

/**
 * 무한스크롤 이벤트
 */
const scrollHandler = () => {
  if (window.innerHeight + window.scrollY + 1200 >= document.body.offsetHeight) {
    // 맨 아래.
    if (!loading.value) {
      if (data.value?.data.count.totalCount > list.value.length) {
        loading.value = true
        page.value++
      }
    }
  }
}
const toTopScrollHandler = () => {
  showChannelButton()
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
      hideChannelButton()
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

  window.addEventListener('scroll', scrollHandler)
})

onActivated(() => {
  // keep alive 속성에 의해 다른 화면 전환시, 이전 화면의 header가 남아있음.
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
})

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>
