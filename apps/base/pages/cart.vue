<template>
  <div class="pb-[120px] pt-10">
    <!-- list -->
    <div v-if="error" class="w-full px-5">
      <IconError></IconError>
      <div class="py-20 text-center">
        <p class="headline-b text-black">장바구니에 담긴 상품이 없어요</p>
        <p class="body-1-r mt-2 text-rgray-600">매일매일 업데이트 되는 신품급 중고제품을 담아보세요</p>
      </div>
      <button class="btn-h52-r0-fill-wfull" @click="goToProductList">상품 보러 가기</button>
    </div>

    <div v-else-if="cartList.data?.length === 0" class="w-full px-5">
      <IconError></IconError>
      <div class="py-20 text-center">
        <p class="headline-b text-black">장바구니에 담긴 상품이 없어요</p>
        <p class="body-1-r mt-2 text-rgray-600">매일매일 업데이트 되는 신품급 중고제품을 담아보세요</p>
      </div>
      <button class="btn-h52-r0-fill-wfull" @click="goToProductList">상품 보러 가기</button>
    </div>

    <template v-else>
      <div class="px-5 pb-10">
        <div class="flex justify-between pb-4">
          <div class="flex space-x-1">
            <IconCheckboxBase id="0" :checked="selectedCartItem.length === notSoldOutItem?.length ? true : false" @click-check="onSelectAllItem"></IconCheckboxBase>
            <p class="subhead-3-b my-auto text-black md:cursor-pointer" @click="onSelectAllItem">전체선택({{ selectedCartItem.length }}/{{ cartList.data?.length }})</p>
          </div>

          <div class="flex space-x-2">
            <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="onDeleteSoldout">품절삭제</p>
            <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="onDeleteSelectItem">선택삭제</p>
          </div>
        </div>

        <hr class="w-full border border-black" />

        <ul class="divide-y divide-rgray-100">
          <li v-for="cartItem in cartList.data" :key="cartItem" class="flex w-full gap-2 py-6">
            <IconCheckboxBase
              :id="cartItem.optId.toString()"
              :checked="selectedCartItem.findIndex((e) => e.optId == cartItem.optId) > -1 ? true : false"
              @click-check="onSelectItem"
            ></IconCheckboxBase>

            <div class="grow space-y-1">
              <div class="flex gap-4" @click="() => goToProduct(cartItem)">
                <div
                  class="grow space-y-1"
                  :class="{
                    'opacity-50 grayscale': cartItem.isSoldOut
                  }"
                >
                  <p class="label-2-r text-rgray-400">{{ cartItem.subBrandName }}</p>
                  <p class="body-1-r line-clamp-3 break-all text-black">{{ cartItem.name }}</p>

                  <p class="caption-2-b text-black">
                    <span v-if="cartItem.grade != ''">{{ formatOptionValue('g=' + cartItem.grade) }} / </span>
                    <span v-if="cartItem.option != ''">{{ formatOptionValue('o=' + cartItem.option) }}</span>
                    <span v-if="cartItem.color != ''">{{ formatOptionValue('c=' + cartItem.color) }} / </span>
                    <span v-if="cartItem.size != ''">{{ formatOptionValue('s=' + cartItem.size) }} </span>
                  </p>

                  <p class="subhead-2-b flex items-center gap-0.5">
                    <span class="text-green-600" :style="cartItem.isAddDiscount && { color: `#${cartItem.badgeColor}` }">{{ cartItem.priceLowRate }}%</span>
                    <span class="text-black">{{ formatWon(cartItem.priceSet) }}원</span>
                    <span class="label-2-r text-rgray-400 line-through">{{ formatWon(cartItem.priceOrg) }}원</span>
                  </p>
                </div>
                <NuxtImg :src="cartItem.imgLink" class="object-contain" :class="{ 'opacity-50 grayscale': cartItem.isSoldOut }" width="60px" height="90px" />
              </div>

              <div class="flex flex-col gap-1">
                <div
                  v-if="cartItem.isAddDiscount"
                  class="flex gap-1"
                  :class="{
                    'opacity-50': cartItem.isSoldOut
                  }"
                >
                  <p class="badge-h18-r0-fill-p4-black" :style="{ backgroundColor: `#${cartItem.badgeColor}` }">{{ cartItem.badgeTitle }}</p>
                  <p class="caption-2-b" :style="{ color: `#${cartItem.badgeColor}` }">
                    {{ formatDaysRemain(cartItem.duDate) }} {{ formatWon(cartItem.priceStd - cartItem.priceSet) }}원 추가 할인 종료
                  </p>
                </div>
                <div v-if="cartItem.isSoldOut" class="badge-h18-r0-fill-p4-black mt-1">품절</div>
              </div>
            </div>

            <button type="button" class="flex h-fit justify-start" @click="() => onDeleteItem(cartItem.optId)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="m-2.5 cursor-pointer">
                <path d="M1.33337 1.33334L14.6667 14.6667" stroke="black" />
                <path d="M14.6667 1.33334L1.33342 14.6667" stroke="black" />
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <div class="space-y-6 p-6">
        <hr class="w-full border-black" />

        <div class="flex justify-between">
          <p class="subhead-3-b text-black">총 결제 금액</p>
          <p class="headline-b text-black">{{ formatWonNoBlank(cartAllPrice) }}원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 상품 금액</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(cartAllPriceOrigin) }}원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 배송비</p>
          <p class="body-1-r text-black">0원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 할인 금액</p>
          <p class="body-1-r text-black">{{ cartAllPriceDiscount }}원</p>
        </div>
      </div>

      <div id="bottomFixedButton" class="fixed bottom-0 w-full bg-white px-5 py-2.5 ios-safe-area md:max-w-pc" style="z-index: 999">
        <button class="btn-h60-r30-fill-wfull" @click="onClickOrder">{{ formatWonNoBlank(cartAllPrice) }}원 주문하기</button>
      </div>
    </template>
  </div>
</template>

<script setup>
// 장바구니 페이지
import * as amplitude from '@amplitude/analytics-browser'
import { deleteCartOptAPI, deleteAllCartOptAPI, getCartListAPI } from '~/composables/apiFactories/product'

definePageMeta({
  keepalive: false,
  middleware: [
    async (to) => {
      const user = userStore()
      const loggedIn = user.getLoginState
      if (Object.keys(to.query).findIndex((qry) => qry === 'isalert') > -1 && loggedIn === false) {
        return navigateTo('/')
      }
    }
  ]
})

const router = useRouter()
const selectedCartItem = ref([])

/** 장바구니에서 품절 item 제거 한 리스트 */
const notSoldOutItem = computed(() => {
  return cartList.value.data?.filter((e) => !e.isSoldOut)
})

/** 장바구니에 담긴 제품 총 결제 금액 */
const cartAllPrice = computed(() => {
  let price = 0
  selectedCartItem.value.forEach((e) => {
    if (!e.isSoldOut) price += e.priceSet
  })
  return price
})

/** 장바구니에 담긴 제품 총 상품 금액 */
const cartAllPriceOrigin = computed(() => {
  let price = 0
  selectedCartItem.value.forEach((e) => {
    if (!e.isSoldOut) price += e.priceOrg
  })
  return price
})

/** 장바구니에 담긴 제품 총 할인 금액 */
const cartAllPriceDiscount = computed(() => {
  if (cartAllPriceOrigin.value === 0) {
    return 0
  }
  return `- ${formatWonNoBlank(cartAllPriceOrigin.value - cartAllPrice.value)}`
})

/** 장바구니 전체 선택 */
const onSelectAllItem = () => {
  if (selectedCartItem.value.length !== notSoldOutItem.value?.length) {
    // 배열의 깊은 복사를 함으로서 완벽한 사본을 만들고, 원본과 사본간의 연결을 끊기 위한 작업
    selectedCartItem.value = []

    cartList.value.data.forEach((e) => {
      if (!e.isSoldOut) selectedCartItem.value.push(e)
    })
  } else {
    selectedCartItem.value = []
  }
}

/**
 * 장바구니 개별 선택
 * @param {string} id
 * */
const onSelectItem = (id) => {
  const findCartObj = cartList.value.data.find((e) => e.optId.toString() === id)

  if (!findCartObj.isSoldOut) {
    const findedIdd = selectedCartItem.value.findIndex((e) => e.optId.toString() === id)
    if (findedIdd > -1) {
      selectedCartItem.value.splice(findedIdd, 1)
    } else {
      selectedCartItem.value.push(findCartObj)
    }
  }
}

/** 구매하기 페이지로 이동 */
const goToProductList = () => {
  router.push('/product_list')
}

/**
 * 제품 상세 페이지로 이동
 * @param {ProductCartInfo} cartItem
 * */
const goToProduct = (cartItem) => {
  amplitude.track('item_click', {
    clickedpage: 'cart',
    prodid: cartItem.prodId,
    name: cartItem.name,
    price: cartItem.priceSet
  })
  router.push(`/product/${cartItem.prodId}?cp=cart`)
}

/**
 * 상품 주문하기.
 */
const onClickOrder = () => {
  if (selectedCartItem.value.length === 0) {
    appStore().setDialogDTO({
      message: '구매하실 상품을 선택해주세요.',
      timeout: 3
    })
    return
  }
  amplitude.track('order_click')

  const orderItemList = [...selectedCartItem.value]

  localStorage.setItem('orderItemList', JSON.stringify(orderItemList))
  userStore().resetCheckedAddress()
  router.push('/order/checkout?hp=cart')
}

/**
 * 장바구니에서 개별 삭제
 * @param {number} optId
 */
const onDeleteItem = async (optId) => {
  const resobj = await deleteCartOptAPI(optId)

  if (resobj.error.value != null) {
    appStore().setDialogDTO({
      message: '상품을 장바구니에서 삭제하지 못했습니다.',
      timeout: 3
    })
    useRetryError(resobj.error.value.data.statusCode, resobj.execute)
  } else if (resobj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '상품을 장바구니에서 삭제했습니다.',
      timeout: 3
    })
    execute()
    selectedCartItem.value = []
  } else {
    appStore().setDialogDTO({
      message: '상품을 장바구니에서 삭제하지 못했습니다.',
      timeout: 3
    })
  }
}

/**
 * 선택된 상품만 장바구니에서 삭제
 */
const onDeleteSelectItem = async () => {
  if (selectedCartItem.value.length > 0) {
    const resobj = await deleteAllCartOptAPI({
      isDeleteSoldOut: false,
      optIds: selectedCartItem.value.map((e) => e.optId).join(',')
    })
    if (resobj.error.value != null) {
      appStore().setDialogDTO({
        message: '선택된 상품을 장바구니에서 삭제하지 못했습니다.',
        timeout: 3
      })
      useRetryError(resobj.error.value.data.statusCode, resobj.execute)
    } else if (resobj.data.value.statusCode === 200) {
      appStore().setDialogDTO({
        message: '선택된 상품을 장바구니에서 삭제했습니다.',
        timeout: 3
      })
      execute()
      selectedCartItem.value = []
    } else {
      appStore().setDialogDTO({
        message: '선택된 상품을 장바구니에서 삭제하지 못했습니다.',
        timeout: 3
      })
    }
  } else {
    appStore().setDialogDTO({
      message: '삭제하실 상품을 선택해주세요.',
      timeout: 3
    })
  }
}

/**
 * 품절 상품 삭제.
 */
const onDeleteSoldout = async () => {
  const resobj = await deleteAllCartOptAPI({
    isDeleteSoldOut: true
  })

  if (resobj.error.value != null) {
    appStore().setDialogDTO({
      message: '품절된 상품을 장바구니에서 삭제하지 못했습니다.',
      timeout: 3
    })
    useRetryError(resobj.error.value.data.statusCode, resobj.execute)
  } else if (resobj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '품절된 상품을 장바구니에서 삭제했습니다.',
      timeout: 3
    })
    execute()
    selectedCartItem.value = []
  } else {
    appStore().setDialogDTO({
      message: '품절된 상품을 장바구니에서 삭제하지 못했습니다.',
      timeout: 3
    })
  }
}

/** data fetch */
const { data: cartList, error, execute } = await getCartListAPI()
if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
}

if (cartList.value) {
  cartList.value.data?.forEach((e) => {
    if (!e.isSoldOut) selectedCartItem.value.push(e)
  })
}

onMounted(() => {
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '장바구니',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
