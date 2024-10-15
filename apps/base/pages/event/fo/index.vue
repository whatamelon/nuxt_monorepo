<template>
  <div class="px-5 py-10">
    <div v-if="list.length > 0" class="grid grid-cols-2 gap-x-1 gap-y-6">
      <component :is="appStore().getGlobalProductComponent.type" v-for="pr in list" :key="pr" :product="pr"></component>
    </div>
  </div>
</template>

<script setup>
// 기획전 페이지 > 계획을 가지고 있었는데, 일단 당장은 아니라서 홀딩한 페이지
definePageMeta({
  keepalive: true
})

const route = useRoute()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const page = ref(1)
const loading = ref(false)
const list = ref([])

const { data, pending, error } = await useFetch('/v20/products', {
  method: 'GET',
  baseURL: config.public.baseURL,
  params: {
    page,
    limit: 30,
    cat1: route.query.cat == null ? '20' : route.query.cat.slice(0, 2),
    cat2: route.query.cat == null ? '00' : route.query.cat.slice(2, 4),
    cat3: route.query.cat == null ? '00' : route.query.cat.slice(4, 6),
    subBrandIdList: route.query.brand == null ? '' : route.query.brand,
    minPrice: route.query.price == null ? '' : route.query.price.split('r')[0],
    maxPrice: route.query.brand == null ? '' : route.query.price.split('r')[1],
    grades: route.query.grade == null ? '' : route.query.grade,
    orderBy: route.query.order == null ? 'latest' : route.query.order,
    srcSpecs: route.query.type == null ? '' : route.query.type
  },
  async onRequest({ request, options }) {
    loading.value = true

    options.headers = options.headers || {}
    options.headers['Brand-Domain'] = appStore().getDomain
    if (accessToken.value) options.headers.Authorization = `Bearer ${accessToken.value}`
    if (refreshToken.value) options.headers.RefreshToken = `Bearer ${refreshToken.value}`
  },
  onResponse({ request, response, options }) {
    if (page.value === 1) {
      list.value = response._data.data.content
    } else {
      list.value = list.value.concat(response._data.data.content)
    }
    loading.value = false
  },
  watch: [page]
})

if (data.value.statusCode === 200) {
  userStore().setGlobalUserInfo(data.value.userSession)
}

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

onMounted(() => {
  window.addEventListener('scroll', scrollHandler)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>
