<template>
  <div class="wrapper pb-28">
    <h2 class="headline-b mt-14 px-5 pb-4 text-black">결제방식</h2>

    <hr class="mx-5 border border-black" />
    <div class="box_section">
      <!-- 결제 UI -->
      <div id="payment-method"></div>

      <div class="space-y-6 px-5">
        <hr class="border-black opacity-10" />

        <div class="flex justify-between">
          <p class="subhead-3-b text-black">총 결제 금액</p>
          <p class="subhead-3-b text-black">{{ formatWon(paiedAmount) }}원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 상품금액</p>
          <p class="subhead-2-b text-rgray-400">{{ formatWon(prodAmount) }}원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 배송비</p>
          <p class="subhead-2-b text-rgray-400">0원</p>
        </div>

        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">포인트 사용</p>
          <p class="subhead-2-b text-rgray-400"><span v-if="usedPoint != 0">-</span>{{ formatWonNoBlank(usedPoint) }}원</p>
        </div>

        <hr class="mb-6 border-black opacity-10" />
      </div>

      <!-- 이용약관 UI -->
      <div id="agreeCheckbox" class="mt-8 flex w-full space-x-1 px-5 md:cursor-pointer" @click="checkAgree">
        <i
          class="text-24xl"
          :class="{
            'rb-checkbox-inactive': !isChecked,
            'text-orange-600': !isChecked && errorObj.code == 'not_agree',
            'text-rgray-100': !isChecked && errorObj.code == '',
            'rb-checkbox-active text-black': isChecked
          }"
        ></i>
        <div>
          <p class="subhead-2-b text-black">주문할 상품의 상품명, 상품금액, 배송정보를 확인하였으며, 구매에 동의합니다. (전자상거래법 제 8조 제2항)</p>
          <p v-if="errorObj.code == 'not_agree'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
        </div>
      </div>
    </div>
  </div>
  <div id="bottomFixedButton" class="fixed bottom-0 w-full border-t border-rgray-100 bg-white px-5 py-4 ios-safe-area md:max-w-pc" style="z-index: 998">
    <button class="btn-h60-r30-fill-wfull" @click="requestPayment">{{ formatWonNoBlank(paiedAmount) }}원 결제하기</button>
  </div>
</template>

<script setup>
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  paiedAmount: {
    type: Number,
    required: true
  },
  prodAmount: {
    type: Number,
    required: true
  },
  usedPoint: {
    type: Number,
    required: true
  },
  isChecked: {
    type: Boolean,
    required: true
  },
  customerKey: {
    type: String,
    required: true
  },
  errorObj: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['checkAgree', 'requestPayment'])

const config = useRuntimeConfig()

const tossPayments = ref(null) // 토스 페이먼츠
const widgets = ref(null) // 결제 위젯
const paymentMethodWidget = ref(null) // 결제 UI

const checkAgree = () => {
  emit('checkAgree')
}

const requestPayment = async () => {
  try {
    if (widgets.value && paymentMethodWidget.value) {
      // 결제 방식
      const payMethod = await paymentMethodWidget.value.getSelectedPaymentMethod()

      // 결제하기 클릭 amplitude 통계 집계. 결제 방식을 param으로 넘깁니다.
      amplitude.track('pay_click', { howpay: payMethod.code })
      emit('requestPayment', widgets.value, payMethod.code)
    }
  } catch (error) {
    // api 별 에러
    // @link https://docs.tosspayments.com/reference/error-codes#%EC%BD%94%EC%96%B4-api-%EB%B3%84-%EC%97%90%EB%9F%AC
    appStore().setDialogDTO({
      message: error.message,
      timeout: 3
    })
  }
}

onMounted(() => {
  nextTick(async () => {
    // ------  결제위젯 초기화 ------
    tossPayments.value = await loadTossPayments(config.public.tossClientKey)
    widgets.value = tossPayments.value.widgets({
      customerKey: props.customerKey
    })
    // ------ 주문의 결제 금액 설정 ------
    await widgets.value.setAmount({
      currency: 'KRW',
      value: props.paiedAmount
    })
    // ------  결제 UI 렌더링 ------
    paymentMethodWidget.value = await widgets.value.renderPaymentMethods({
      selector: '#payment-method',
      variantKey: 'DEFAULT'
    })
  })
})
</script>
