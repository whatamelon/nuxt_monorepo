<template>
  <div class="bg-white pb-12">
    <div v-if="error"></div>
    <div v-else class="mt-8 space-y-4 divide-y divide-rgray-100 px-5">
      <ClientOnly>
        <FeatReviewMsgItem v-for="reviewItem in list" :key="reviewItem.reviewId" :review-item="reviewItem"></FeatReviewMsgItem>
      </ClientOnly>
    </div>
    <div v-if="loading" class="my-10 flex justify-center">
      <AppSpinner></AppSpinner>
    </div>
  </div>
</template>

<script setup>
// 구매리뷰리스트페이지
// 무한스크롤
const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')

const page = ref(1)
const loading = ref(false)
const list = ref([])
const data = ref()
const error = ref()

/** 데이터 fetching */
const fetchData = async () => {
  await useFetch(`/v20/reviews/buy`, {
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
    title: '구매 리뷰',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
  window.addEventListener('scroll', scrollHandler)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>
