<template>
  <AppModalBottomSheet :is-open="isOpen" @update-open="close()">
    <div class="max-h-[550px] min-h-[300px] w-full">
      <div class="px-5">
        <div class="flex h-12 w-full justify-between border border-solid px-4 md:cursor-pointer" :class="dropdownActive ? 'border-black' : 'border-rgray-100'" @click="toggleDropdown()">
          <p class="body-1-r my-auto" :class="dropdownActive ? 'text-black' : 'text-rgray-400'">옵션선택</p>
          <i class="rb-arrow-down my-auto text-24xl" :class="dropdownActive ? 'rotate-180 text-black' : 'text-rgray-400'"></i>
        </div>

        <div v-if="dropdownActive" class="static divide-y divide-rgray-100 border-x border-b border-black">
          <div
            v-for="(option, index) in optList.filter((e) => selectedOptions.findIndex((v) => v.optId == e.optId) == -1)"
            :key="index"
            class="flex h-18 w-full justify-between px-4 md:cursor-pointer"
            @click="selectOption(option)"
          >
            <PartProductOption is-show-discount-comment :option="option"></PartProductOption>
          </div>
        </div>

        <div v-else class="">
          <div class="mt-4 max-h-[250px] space-y-2 overflow-y-scroll no-scroll">
            <div v-for="(option, index) in selectedOptions" :key="index" class="bg-rgray-50">
              <div class="flex h-18 w-full justify-between px-4">
                <PartProductOptionSelectedOption :option="option" :is-add-discount="prodDTO.isAddDiscount" @remove="removeOption"></PartProductOptionSelectedOption>
              </div>
            </div>
          </div>

          <div class="w-full bg-white">
            <div class="mb-6 mt-10 space-y-4">
              <div class="flex justify-between">
                <p class="body-1-r text-black">상품금액</p>
                <p class="subhead-2-b text-black">{{ formatWonNoBlank(totalPrice) }}원</p>
              </div>
              <div class="flex justify-between">
                <p class="body-1-r text-black">배송비</p>
                <p class="subhead-2-b text-black">0원</p>
              </div>

              <hr class="border border-black" />

              <div class="flex justify-between">
                <p class="subhead-3-b my-auto text-black">결제 예상 금액</p>
                <p class="headline-b text-black">{{ formatWonNoBlank(totalPrice) }}원</p>
              </div>
            </div>

            <div class="flex w-full space-x-1 bg-white pt-2 ios-safe-area" style="z-index: 998">
              <button class="btn-h56-r28-line-wfull" @click="cart">장바구니</button>
              <button class="btn-h56-r28-fill-wfull" @click="order">주문하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppModalBottomSheet :is-open="isCartBottomSheetOpen" @update-open="closeCartBottomSheet()">
      <div class="w-full px-5">
        <p class="display-1-b text-center text-black">장바구니에 상품을<br />담았어요!</p>

        <div class="flex w-full space-x-1 bg-white pt-10 ios-safe-area" style="z-index: 998">
          <button class="btn-h56-r28-line-wfull" @click="goBack">쇼핑 계속하기</button>
          <button class="btn-h56-r28-fill-wfull" @click="goToCart">장바구니 바로가기</button>
        </div>
      </div>
    </AppModalBottomSheet>
  </AppModalBottomSheet>
</template>

<script setup>
// 상품상세페이지에서 주문하기 버튼을 눌렀을때 나오는 바텀시트입니다.
// 옵션리스트와 선택된 옵션 및 금액을 보여주는 부분으로 나뉘어 있습니다.
// 옵션을 선택하면, 선택된 옵션들의 합산금액과 함께 결제금액이 보여집니다.
import * as amplitude from '@amplitude/analytics-browser'
import { addCartOptAPI } from '~/composables/apiFactories/product'

const props = defineProps({
  prodDTO: {
    type: Object,
    required: true
  },
  optList: {
    type: Array,
    required: true
  },
  selectedOptions: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'setOption'])

const isCartBottomSheetOpen = ref(false)
const dropdownActive = ref(false)

const totalPrice = computed(() => {
  return props.selectedOptions.map((p) => p.priceSet).reduce((partialSum, acc) => partialSum + acc, 0)
})

const removeOption = (opt) => {
  emit('setOption', opt)
}

const selectOption = (opt) => {
  emit('setOption', opt)
  toggleDropdown()
}

const close = () => {
  dropdownActive.value = false
  emit('close')
}

const closeCartBottomSheet = () => {
  isCartBottomSheetOpen.value = false
  close()
}

const toggleDropdown = () => {
  if (dropdownActive.value === false) {
    if (props.optList.length !== props.selectedOptions.length) {
      dropdownActive.value = !dropdownActive.value
    }
  } else {
    dropdownActive.value = !dropdownActive.value
  }
}

const cart = async () => {
  if (props.selectedOptions.length === 0) {
    appStore().setDialogDTO({
      message: '옵션을 선택해주세요.',
      timeout: 3
    })
  } else {
    const successAddCartArr = []
    for (let i = 0; i < props.selectedOptions.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const addCartOptObj = await addCartOptAPI(props.selectedOptions[i].optId)
      if (addCartOptObj.error.value != null) {
        if (addCartOptObj.error.value.data.statusCode === 400) {
          if (addCartOptObj.error.value.data.message === 'cart_count_limit_exceeded') {
            appStore().setDialogDTO({
              message: '장바구니에 상품을 더 이상 담을 수 없습니다. 장바구니에 최대 20개의 상품을 담을 수 있습니다.',
              timeout: 3
            })
          } else if (addCartOptObj.error.value.data.message === 'same_opt') {
            appStore().setDialogDTO({
              message: '이미 장바구니에 있는 상품입니다.',
              timeout: 3
            })
          } else {
            appStore().setDialogDTO({
              message: '장바구니에 상품을 담지 못했습니다.',
              timeout: 3
            })
          }
        } else {
          useRetryError(addCartOptObj.error.value.data.statusCode, addCartOptObj.execute)
        }
      } else if (addCartOptObj.data.value.statusCode === 200) {
        successAddCartArr.push(props.selectedOptions[i])
      } else if (addCartOptObj.data.value.statusCode === 400) {
        if (addCartOptObj.data.value.message === 'cart_count_limit_exceeded') {
          appStore().setDialogDTO({
            message: '장바구니에 상품을 더 이상 담을 수 없습니다. 장바구니에 최대 20개의 상품을 담을 수 있습니다.',
            timeout: 3
          })
        } else if (addCartOptObj.data.value.message === 'same_opt') {
          appStore().setDialogDTO({
            message: '이미 장바구니에 있는 상품입니다.',
            timeout: 3
          })
        } else {
          appStore().setDialogDTO({
            message: '장바구니에 상품을 담지 못했습니다.',
            timeout: 3
          })
        }
      } else {
        appStore().setDialogDTO({
          message: '장바구니에 상품을 담지 못했습니다.',
          timeout: 3
        })
      }
    }

    setTimeout(() => {
      if (successAddCartArr.length > 0) {
        isCartBottomSheetOpen.value = true

        const priceTotal = successAddCartArr.reduce((prev, cur) => prev + parseInt(cur.priceSet, 10), 0)

        amplitude.track('addcart_click', {
          pricetotal: priceTotal,
          itemtotalnumber: successAddCartArr.length,
          name: props.prodDTO.name,
          brand: props.prodDTO.brandSubName,
          prodid: props.prodDTO.prodId
        })
      }
    }, 500)
  }
}

const goBack = () => {
  const continueShopping = useContinueShopping()
  router.push(continueShopping.value)
  closeCartBottomSheet()
}

const goToCart = () => {
  router.push('/cart')
  closeCartBottomSheet()
}

const order = () => {
  if (props.selectedOptions.length === 0) {
    appStore().setDialogDTO({
      message: '구매하실 상품을 선택해주세요.',
      timeout: 3
    })
  } else {
    const orderItemList = []
    props.selectedOptions.forEach((e) => {
      orderItemList.push({
        ...e,
        imgLink: props.prodDTO.imgs[0],
        subBrandName: props.prodDTO.brandSubName,
        name: props.prodDTO.name,
        priceOrg: props.prodDTO.priceOrg,
        priceLowRate: e.priceSetRate
      })
    })

    amplitude.track('order_click', { clickedpage: 'detail' })
    localStorage.setItem('orderItemList', JSON.stringify(orderItemList))

    const router = useRouter()
    userStore().resetCheckedAddress()
    router.push('/order/checkout?hp=detail')
  }
}

onUpdated(() => {
  if (props.selectedOptions.length === 0) {
    dropdownActive.value = true
  } else {
    dropdownActive.value = false
  }
})

onMounted(() => {
  if (props.selectedOptions.length === 0) {
    dropdownActive.value = true
  } else {
    dropdownActive.value = false
  }
})

onActivated(() => {
  if (props.selectedOptions.length === 0) {
    dropdownActive.value = true
  } else {
    dropdownActive.value = false
  }
})
</script>
