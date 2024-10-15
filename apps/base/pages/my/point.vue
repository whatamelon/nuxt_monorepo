<template>
  <div v-if="!data"></div>
  <div v-else class="bg-white px-5 pb-10">
    <div class="py-10">
      <p class="display-2-b text-black">{{ list.length > 0 ? formatWonNoBlank(list[0]['pointTotal']) : 0 }} P</p>
    </div>

    <div v-if="list.length == 0" class="my-10">
      <p class="body-2-r text-center text-black">무료반품권 내역이 없습니다.</p>
      <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
    </div>

    <div class="space-y-4 divide-y divide-rgray-100">
      <div v-for="item in list" :key="item" class="flex justify-between space-x-6 pt-4">
        <div class="">
          <p class="label-2-r text-rgray-400">{{ formatDateReplace(item.crDate) }}</p>
          <p v-if="item.validFlag == true" class="body-1-r mt-1 line-clamp-2 text-black">{{ item.pointMessage }}</p>

          <div v-else>
            <p class="body-1-r mt-1 text-rgray-400 line-through decoration-rgray-400">{{ item.pointMessage }}</p>
            <p class="body-1-r mt-1 text-black">사용기한 만료</p>
          </div>
        </div>
        <div class="inline-block w-20 self-end">
          <p
            class="subhead-3-b float-right flex"
            :class="{
              'text-rgray-400': item.pointValue.toString().indexOf('-') > -1,
              'text-orange-600': item.validFlag == 'f',
              'text-black': item.pointValue.toString().indexOf('-') == -1
            }"
          >
            {{ formatWonNoBlank(item.pointValue) }} P
          </p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="my-10 flex justify-center">
      <AppSpinner></AppSpinner>
    </div>
  </div>
</template>

<script setup>
// 마이페이지 > 포인트리스트
// 무한스크롤
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()
const router = useRouter()

const page = ref(1)
const loading = ref(false)
const list = ref([])
const data = ref()

const fetchData = async () => {
  await useFetch(`/v20/users/points`, {
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
          list.value = response._data.data.content
        } else {
          list.value = list.value.concat(response._data.data.content)
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

const goToHome = () => {
  router.push('/')
}

onBeforeMount(() => {
  fetchData()
})

/**
 * 무한스크롤 이벤트
 */
const scrollHandler = () => {
  if (window.innerHeight + window.scrollY + 1200 >= document.body.offsetHeight) {
    // 맨 아래.

    if (!loading.value) {
      if (data.value?.count.totalCount > list.value.length) {
        loading.value = true
        page.value++
      }
    }
  }
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '포인트 내역',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })

  hideChannelButton()
  window.addEventListener('scroll', scrollHandler)
})

onBeforeRouteLeave(() => {
  showChannelButton()
  window.removeEventListener('scroll', scrollHandler)
})
</script>
