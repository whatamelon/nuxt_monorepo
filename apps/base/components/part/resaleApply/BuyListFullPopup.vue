<template>
  <AppModalDialog :is-open="openBuyList" is-full-screen>
    <div class="relative flex w-full items-center justify-center border-b border-b-rgray-100 px-5 py-4">
      <h1 class="subhead-3-b my-auto truncate text-center text-black">판매 상품 선택</h1>
      <i class="rb-close absolute right-5 my-auto cursor-pointer text-24xl text-black" @click="closeDialog"></i>
    </div>
    <div id="infiniteScroll" class="h-full overflow-y-auto pb-[134px]">
      <div v-for="item in list" :key="item.optId" class="px-5">
        <div class="flex items-center justify-between gap-5 border-b border-b-rgray-100 py-3">
          <div class="flex gap-3">
            <div class="relative mr-3 h-24 w-16 flex-shrink-0 cursor-pointer" @click="() => openImageHandler(item)">
              <NuxtImg :src="item.imgLink" :alt="item.name" class="h-full w-full object-contain" />
              <img src="/icons/sell/ic-expansion.svg" alt="돋보기 아이콘" class="absolute bottom-1 right-1" />
            </div>
            <div>
              <strong class="badge-h18-r0-fill-p4-gray-bold">{{ item.snCode }}</strong>
              <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
              <p class="label-2-r line-clamp-2">{{ item.name }}</p>
              <strong class="caption-2-b">{{ formatOptionValue(item.optCode.split(':')[0]) }} / {{ formatOptionValue(item.optCode.split(':')[1]) }}</strong>
              <p class="label-2-r text-rgray-400">{{ formatDateFullForUTC(item.payDate) }}</p>
            </div>
          </div>
          <button class="flex-shrink-0" :class="itemList.findIndex((el) => el.optId === item.optId) > -1 ? 'btn-h32-r16-fill-p16 pl-2' : 'btn-h32-r16-line-p16-gray'" @click="toggleItemHandler(item)">
            <img v-show="itemList.findIndex((el) => el.optId === item.optId) > -1" src="/icons/global/ic-check-bold.svg" alt="체크박스" />
            선택
          </button>
        </div>
      </div>
      <div v-if="loading" class="my-10 flex justify-center">
        <AppSpinner />
      </div>
    </div>
    <div class="fixed bottom-0 w-full bg-white px-5 py-2 ios-safe-area md:max-w-pc">
      <Transition>
        <p
          v-if="openBuyList && itemList.length === 0"
          class="bottom-arrow label-2-r absolute bottom-[52px] left-1/2 z-[500] -translate-x-1/2 whitespace-nowrap rounded bg-caribbean-green-300 px-2 py-1.5 ios-safe-area-margin-bottom"
        >
          <strong class="caption-2-b">한 번에 최대 10개</strong>의 상품을 선택할 수 있어요!
        </p>
      </Transition>
      <button class="btn-h56-r28-fill-wfull bg-black disabled:bg-rgray-200" :disabled="itemList.length === 0" @click="checkTypecodeListHandler">보상 포인트 확인하기 ({{ itemList.length }}/10)</button>
    </div>
    <FeatReviewImgSwiper :review-imgs="openedImage" :is-open="isOpenImage" @close-review-img-list="isOpenImage = false" />
  </AppModalDialog>
</template>
<script setup lang="ts">
import * as amplitude from '@amplitude/analytics-browser'

interface Props {
  openBuyList: boolean
}

const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')

const page = ref(1)
const loading = ref(false)
const data = ref()
const list: Ref<SalesProductListResponse[]> = ref([])

const props = defineProps<Props>()

const emit = defineEmits<{
  checkTypecodeList: [value: SalesProductListResponse[]]
  toggleBuyListDialog: [value: boolean]
}>()

const isOpenImage = ref(false)
const openedImage: Ref<string[]> = ref([])
const itemList: Ref<SalesProductListResponse[]> = ref([])

/** 다이얼로그가 닫힐 때 리스트 초기화 */
watch(
  () => props.openBuyList,
  (value) => {
    if (!value) {
      reset()
    } else {
      initSet()
    }
  }
)

/** 팝업이 닫힐때나 컴포넌트 unmount 시 호출 */
const reset = () => {
  const body = document.querySelector('body')
  const infiniteScroll = document.getElementById('infiniteScroll')
  body!.style.height = '100%'
  body!.style.overflow = 'auto'
  if (infiniteScroll) {
    infiniteScroll.removeEventListener('scroll', scrollHandler)
    infiniteScroll.scrollTop = 0
  }
  itemList.value = []
}

/** 팝업이 열릴때 호출 */
const initSet = () => {
  const body = document.querySelector('body')
  body!.style.height = '100dvh'
  body!.style.overflow = 'hidden'
}

/** 데이터 fetching */
const fetchData = async () => {
  await useFetch('/v20/sales/products', {
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
      useRetryError(result.error.value.statusCode as number, result.execute)
    }
  })
}

/** 다이얼로그 닫는 emit 이벤트 호출 */
const closeDialog = () => {
  emit('toggleBuyListDialog', false)
}

/** 보상 포인트 확인하기 클릭하면 sell/new로 emit 이벤트 호출 */
const checkTypecodeListHandler = () => {
  amplitude.track('hforderIDSelect_itemlist')
  emit('checkTypecodeList', itemList.value)
}

/** 이미지를 클릭할때 해당 이미지를 변수에 할당하고, 이미지 스와이퍼 컴포넌트를 여는 함수 */
const openImageHandler = (item: SalesProductListResponse) => {
  openedImage.value = [item.imgLink]
  isOpenImage.value = true
}

/** 리스트에서 item을 선택, 해제 할때 배열에 추가, 삭제하는 핸들러함수 */
const toggleItemHandler = (item: SalesProductListResponse) => {
  if (itemList.value.length > 0) {
    const idArray = itemList.value.map((item) => item.optId)
    if (idArray.includes(item.optId)) {
      itemList.value = itemList.value.filter((el: any) => el.optId !== item.optId)
      return
    }
  }
  itemList.value = [...itemList.value, item]

  if (itemList.value.length > 10) {
    appStore().setDialogDTO({
      message: '한 번에 최대 10개의 상품을 선택할 수 있어요!',
      timeout: 3
    })
    itemList.value = itemList.value.slice(0, 10)
  }
}

/**
 * 무한스크롤 이벤트
 */
const scrollHandler = () => {
  const infiniteScroll = document.getElementById('infiniteScroll')

  if (infiniteScroll!.scrollHeight - window.innerHeight - 300 <= infiniteScroll!.scrollTop) {
    // 맨 아래.
    if (!loading.value) {
      if (data.value?.count.totalCount > list.value.length) {
        loading.value = true
        page.value++
      }
    }
  }
}

onBeforeMount(() => {
  fetchData()
})

onMounted(() => {
  // scroll할 dom 할당
  const infiniteScroll = document.getElementById('infiniteScroll')
  if (infiniteScroll) {
    infiniteScroll.addEventListener('scroll', scrollHandler)
  }
})

onUnmounted(() => {
  reset()
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
  left: 50%;
  transform: translateX(-50%);
}
</style>
