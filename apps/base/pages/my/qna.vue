<template>
  <div v-if="!data"></div>
  <div v-else class="bg-white px-5">
    <div class="space-y-12 py-10">
      <div v-if="list.length == 0" class="my-20">
        <p class="body-2-r text-center text-black">작성한 문의가 없습니다.</p>
        <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
      </div>

      <div v-for="item in list" :key="item" class="space-y-2">
        <div class="mb-4 space-y-4">
          <div class="flex justify-between">
            <p class="subhead-3-b line-clamp-2 w-[230px] whitespace-pre-line text-black">{{ item.prodName }}</p>
            <button class="btn-h32-r0-line-p16-gray" @click="() => goToProd(item.prodId)">상품보기</button>
          </div>
          <hr class="border border-black" />
        </div>
        <div class="flex justify-between">
          <p class="body-1-r my-auto text-black">Q</p>
          <p v-if="item.anFlag == false" class="badge-h22-r0-fill-p8-gray">미답변</p>
          <p v-else class="badge-h22-r0-fill-p8-black">답변 완료</p>
        </div>

        <p class="body-1-r text-black">{{ item.msg }}</p>

        <div class="flex w-full justify-end">
          <div class="flex space-x-2">
            <p class="label-2-r text-rgray-400">{{ formatDate(item.quDate) }}</p>
            <p class="label-2-r text-black">{{ item.userName }}</p>
          </div>
        </div>

        <div v-if="item.anFlag == true" class="bg-rgray-50 p-4">
          <p class="subhead-2-b text-black">A</p>
          <p class="body-1-r mt-1 text-black">{{ item.anMsg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 마이페이지 > 문의하기 페이지
const router = useRouter()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const page = ref(1)
const loading = ref(false)
const list = ref([])
const data = ref()

const fetchData = async () => {
  await useFetch(`/v20/users/myQnas`, {
    method: 'GET',
    baseURL: config.public.baseURL,
    params: {
      page,
      limit: 10
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

const goToProd = (prodId) => {
  router.push(`/product/${prodId}`)
}

const goToHome = () => {
  router.push('/')
}

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
    title: '문의 내역',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
  window.addEventListener('scroll', scrollHandler)
})

onBeforeMount(() => {
  fetchData()
})

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>
