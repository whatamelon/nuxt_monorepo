<template>
  <NuxtLink :to="link" @click="clickProduct">
    <figure class="relative">
      <div class="aspect-h-1 aspect-w-1">
        <NuxtImg :src="product.imgLink" fit="cover" loading="lazy" class="h-full w-full object-cover" placeholder :alt="product.name + ' 상품 이미지'" />
      </div>
      <div v-if="product.colors != ''" class="absolute bottom-2 left-2 h-4 w-4 border border-[#E0E0E0]" :style="setBgColor(product.colors)"></div>
      <NuxtImg v-if="product.heartFlag" src="/icons/global/ic-heart-fill-32.png" class="absolute bottom-2 right-2 h-8 w-8" @click.stop.prevent="clickHeart" />
      <NuxtImg v-else src="/icons/global/ic-heart-32.png" class="absolute bottom-2 right-2 h-8 w-8" @click.stop.prevent="clickHeart" />
    </figure>
    <div class="px-2">
      <div v-if="appStore().getDomain == 'greenforet'">
        <div class="mt-2 flex items-center justify-between gap-1">
          <p class="label-2-r truncate text-rgray-400">{{ product.brandSubName }}</p>
          <div class="flex shrink-0 space-x-1">
            <ClientOnly>
              <p class="badge-h18-r0-line-p4">재고{{ product.prodCnt }}</p>
            </ClientOnly>
          </div>
        </div>
        <p class="body-1-r mt-1 line-clamp-1 break-all text-black">{{ product.name }}</p>
      </div>
      <div v-else class="mt-2 flex items-center justify-between gap-1">
        <p class="body-1-r my-auto line-clamp-1 break-all text-black">{{ product.name }}</p>
        <p v-if="product.prodCnt === 1 && sizeCalc.length === 1" class="caption-2-b shrink-0 text-black">{{ sizeCalc[0] }}</p>
        <p v-else class="badge-h18-r0-line-p4 shrink-0">재고{{ product.prodCnt }}</p>
      </div>
      <div class="mt-1 flex">
        <p class="subhead-2-b text-green-600">{{ product.priceLowRate }}%</p>
        <p class="subhead-2-b text-black">{{ formatWon(product.priceLow) }}원</p>
      </div>
      <p class="label-2-r mt-1 text-rgray-400 line-through">{{ formatWon(product.priceOrg) }}원</p>
      <p v-if="product.srcSpec == 'si'" class="badge-h18-r0-fill-p4-gray mt-1">수선이력 있음</p>

      <div class="mt-1 flex space-x-0.5">
        <p v-if="product.srcSpec == 'fp'" class="badge-h18-r0-fill-p4-black">스크래치 상품</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import * as amplitude from '@amplitude/analytics-browser'
import { addProductHeartAPI, deleteProductHeartAPI } from '~/composables/apiFactories/product'

// 정사각형 상품 아이템 컴포넌트입니다.
// 상품상세 이동, 상품찜 기능을 가지고 있습니다.
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  types: {
    type: String,
    required: false
  },
  idx: {
    type: [String, Number],
    required: false
  },
  evtNo: {
    type: [String, Number],
    required: false
  }
})

const piniaProductStore = productStore()
const user = userStore()
const route = useRoute()
const router = useRouter()

const link = computed(() => {
  let link = `/product/${props.product.prodId}`
  if (props.types) link = `${link}?cp=${props.types}`
  if (props.idx) link = `${link}&ep=${props.idx}`
  if (props.evtNo) link = `${link}&en=${props.evtNo}`

  return link
})
const sizeCalc = computed(
  () => {
    // if (process.client) {
    if (props.product) {
      return props.product.sizes.split(',')
      //   if (props.product.sizes.split(',').length == 1) {
      //     return props.product.sizes
      //   }
      //   return props.product.sizes.split(',').length
    }
    return []
  }
  // }
)
const loginState = computed(() => user.getLoginState)

const clickHeart = async () => {
  if (!loginState.value) {
    appStore().setDialogDTO({
      message: '로그인 후 이용해주세요.',
      timeout: 1
    })
    const recentRoute = useCookie('RECENT_ROUTE')
    recentRoute.value = route.fullPath
    router.push('/login')
  } else if (!props.product.heartFlag) {
    amplitude.track('addwish_click', { clickedpage: 'list' })

    const addheartObj = await addProductHeartAPI(props.product.prodId)
    if (addheartObj.error.value != null) {
      useRetryError(addheartObj.error.value.data.statusCode, addheartObj.execute)
    } else if (addheartObj.data.value.statusCode === 200) {
      // FIXME: 어디서 사용하는지, 어떤 데이터인지 확인 후 수정
      // eslint-disable-next-line vue/no-mutating-props
      props.product.heartFlag = true
      appStore().setDialogDTO({
        message: '상품을 찜했습니다.',
        timeout: 3
      })
    } else {
      appStore().setDialogDTO({
        message: '찜한 상품에 저장되지 않았습니다.',
        timeout: 3
      })
    }
  } else {
    const deleteheartObj = await deleteProductHeartAPI(props.product.prodId)
    if (deleteheartObj.error.value != null) {
      useRetryError(deleteheartObj.error.value.data.statusCode, deleteheartObj.execute)
    } else if (deleteheartObj.data.value.statusCode === 200) {
      // FIXME: 어디서 사용하는지, 어떤 데이터인지 확인 후 수정
      // eslint-disable-next-line vue/no-mutating-props
      props.product.heartFlag = false
      appStore().setDialogDTO({
        message: '찜을 취소했습니다.',
        timeout: 3
      })
    } else {
      appStore().setDialogDTO({
        message: '취소되지 않았습니다.',
        timeout: 3
      })
    }
  }
}

const clickProduct = () => {
  amplitude.track('item_click')
  amplitude.track('itemdetail_pv', { clickedpage: props.types ?? 'etc' })
  piniaProductStore.setProductToRecentList(props.product)
}

const setBgColor = (color) => {
  if (color.includes(',')) {
    return {
      backgroundColor: `#${color.split(',')[0].split('#')[1]}`
    }
  }
  return {
    backgroundColor: `#${color.split('#')[1]}`
  }
}
</script>
