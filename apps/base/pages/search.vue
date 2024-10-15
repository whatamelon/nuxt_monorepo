<template>
  <div class="-mt-14">
    <!-- input header -->
    <div class="fixed top-0 flex w-full space-x-4 bg-white px-5 py-4 md:max-w-pc" style="z-index: 999">
      <i class="rb-arrow-left my-auto text-24xl text-black md:cursor-pointer" @click="goBack"></i>

      <div style="width: calc(100% - 40px)" class="relative">
        <i class="rb-search absolute right-0 py-3 pr-4 text-24xl text-black" @click="() => onSearch(keyword)"></i>
        <input
          id="searchTextField"
          ref="searchTextFieldRef"
          v-model="keyword"
          type="text"
          class="subhead-2-b h-12 w-full rounded-3xl bg-rgray-50 py-3 pl-6 pr-10 text-black placeholder:text-tiny placeholder:font-normal placeholder:leading-20 placeholder:text-rgray-400"
          placeholder="검색어를 입력해주세요."
          @keypress.enter="() => onSearch(keyword)"
          @focus="onFocusToTextfield"
        />
      </div>
    </div>

    <!-- recent -->
    <div v-if="step == 'recent'" class="px-5 pb-24 pt-[104px]">
      <div class="flex justify-between">
        <p class="headline-b text-black">최근 검색어</p>
        <p v-if="recentKeywordList.length != 0" class="subhead-2-b my-auto text-rgray-400 md:cursor-pointer" @click="onClearKeywordList">모두 삭제</p>
      </div>

      <p v-if="recentKeywordList.length == 0" class="body-2-r mt-6 text-rgray-400">최근 검색어가 없습니다.</p>

      <div v-else class="mt-6 space-y-6">
        <div v-for="item in recentKeywordList" :key="item" class="flex justify-between space-x-6">
          <p class="body-2-r my-auto w-fit text-black md:cursor-pointer" @click="() => onSearch(item)">{{ item }}</p>

          <i class="rb-close text-lg text-black" @click="() => onRemoveKeyword(item)"></i>
        </div>
      </div>
    </div>

    <!-- search -->
    <div v-else class="px-5 pb-24 pt-[104px]">
      <div v-if="searchList.data.content.length > 0">
        <div class="grid grid-cols-2 gap-x-1 gap-y-6">
          <component :is="appStore().getGlobalProductComponent.type" v-for="pr in searchList.data.content" :key="pr" :product="pr" :types="'search'"></component>
        </div>

        <PartProductListPagination :total-page="searchList.data.page.totalPage" :page="searchList.data.page.page" @update-page="onChangePage"></PartProductListPagination>
      </div>

      <div v-else class="py-20 text-center">
        <p class="headline-b text-black">검색된 상품이 없어요.</p>
        <p class="body-1-r mt-2 text-rgray-600">다른 검색어를 입력해 보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 검색페이지
// UI의 상태를 가지고 있다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'

defineOptions({
  name: 'Alive'
})

const step = useState(() => 'recent')
const piniaProductStore = productStore()
const router = useRouter()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const searchTextFieldRef = ref(null)

const keyword = ref('')
const page = ref(1)

const recentKeywordList = computed(() => piniaProductStore.getRecentKeywordList)

const goBack = () => {
  router.back()
}

/** 최근 검색어 전체 삭제 */
const onClearKeywordList = () => piniaProductStore.resetRecentKeywordList()

/** 최근 검색어 특정 키워드 삭제 */
const onRemoveKeyword = (item) => piniaProductStore.removeKeyword(item)

/**
 * 검색 input이 focus 되면 최근 검색어를 보여주도록 전환.
 */
const onFocusToTextfield = () => {
  step.value = 'recent'
  window.scrollTo(0, 0)
}

/**
 * 상품 검색
 * - 일반적으로는 검색창에 결과 보여준다.
 * - 특정 검색 시(api status 302), 백엔드에서 보내주는 데이터로 url path와 query param 지정하여 보낸다.
 * @param {string} item
 */
const onSearch = async (item) => {
  if (item.trim().length !== 0) {
    keyword.value = item
    page.value = 1

    amplitude.track('keyword_input', { searchkeyword: keyword.value })

    await execute()
    piniaProductStore.setRecentKeywordList(keyword.value)
    if (searchList.value.statusCode === 302) {
      return navigateTo({
        path: `/${formatConvertCamelToSnake(searchList.value.data.page)}`,
        query: { brand: searchList.value.data.params[0].split('=')[1], cat: `${searchList.value.data.params[1].split('=')[1]}0000` }
      })
    }
    step.value = 'search'
    window.scrollTo(0, 0)
    document.getElementById('searchTextField').blur()
  }
}

// TODO: useAsyncData fetch 로직 분리 필요.
const { data: searchList, execute } = await useAsyncData('search', () =>
  $fetch(`${config.public.baseURL}/v20/products/search`, {
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    },
    params: {
      keyword: keyword.value,
      page: page.value,
      limit: 30
    }
  })
)

if (searchList.value?.statusCode === 200) {
  userStore().setGlobalUserInfo(searchList.value.userSession)
}

/**
 * 페이지 이동 함수.
 * 페이지가 이동하면 fetch execute 실행하고 스크롤 최상단 이동.
 * @param {number} selectPage
 */
const onChangePage = (selectPage) => {
  page.value = selectPage
  execute()
  window.scrollTo(0, 0)
}

onMounted(() => {
  setTimeout(() => {
    searchTextFieldRef.value.focus()
  }, 300)

  step.value = 'recent'
  keyword.value = ''
  // keyword.value = ''s
  hideChannelButton()
  window.addEventListener('scroll', () => {})
})

onActivated(() => {
  setTimeout(() => {
    searchTextFieldRef.value.focus()
  }, 300)
  execute()
  window.addEventListener('scroll', () => {})
})

onDeactivated(() => {
  window.removeEventListener('scroll', () => {})
})

onBeforeRouteLeave((to, from, next) => {
  window.removeEventListener('scroll', () => {})
  if (to.name !== 'product-id') {
    showChannelButton()
    next()
    step.value = 'recent'
    keyword.value = ''
    // keyword.value = ''
  } else {
    showChannelButton()
    next()
  }
})
</script>
