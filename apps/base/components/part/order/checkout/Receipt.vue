<template>
  <div>
    <h2 class="headline-b pb-4 text-black">결제방식</h2>

    <hr class="border border-black" />

    <div id="paymentBox" class="mt-6">
      <button
        class="flex h-13 w-full justify-center space-x-1 rounded-none border"
        :class="{
          'border-orange-600 bg-black text-white': selectedPayment == 'card' && errorObj.code == 'over_card_amount',
          'border-black bg-black text-white': selectedPayment == 'card',
          'border-rgray-100 bg-white text-black': selectedPayment != 'card'
        }"
        @click="clickPayment('card')"
      >
        <p class="body-1-r my-auto">신용/체크카드</p>
        <i v-if="selectedPayment == 'card'" class="rb-check my-auto text-24xl"></i>
      </button>
      <div class="mt-1 flex space-x-1">
        <button
          class="flex h-13 w-1/2 justify-center space-x-1 rounded-none border"
          :class="{
            'border-black bg-black text-white': selectedPayment == 'kakaopay',
            'border-rgray-100 bg-white text-black': selectedPayment != 'kakaopay'
          }"
          @click="clickPayment('kakaopay')"
        >
          <p class="body-1-r my-auto">카카오페이</p>
          <i v-if="selectedPayment == 'kakaopay'" class="rb-check my-auto text-24xl"></i>
        </button>
        <button
          class="flex h-13 w-1/2 justify-center space-x-1 rounded-none border"
          :class="{
            'border-black bg-black text-white': selectedPayment == 'vbank',
            'border-rgray-100 bg-white text-black': selectedPayment != 'vbank'
          }"
          @click="clickPayment('vbank')"
        >
          <p class="body-1-r my-auto">가상계좌이체</p>
          <i v-if="selectedPayment == 'vbank'" class="rb-check my-auto text-24xl"></i>
        </button>
      </div>
    </div>

    <p v-if="errorObj.code == 'over_card_amount'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>

    <div
      v-if="selectedPayment == 'vbank'"
      class="mt-4 flex w-full space-x-1 md:cursor-pointer"
      :class="{
        'text-rgray-400': isEscrowChecked == false,
        'text-black': isEscrowChecked == true
      }"
      @click="checkEscrow"
    >
      <i
        class="text-24xl"
        :class="{
          'rb-checkbox-inactive text-rgray-100': isEscrowChecked == false,
          'rb-checkbox-active': isEscrowChecked == true
        }"
      ></i>
      <div>
        <p class="subhead-2-b">에스크로 (결제대금예치)신청 (선택사항)</p>
        <p class="body-1-r">에스크로 진행 시 부분 취소/반품이 어려우며, 반품 소요 시간이 더 걸리는 점 양해 부탁드립니다. (일반적으로 영업일 기준 5~10일 소요)</p>
      </div>
    </div>

    <div class="mt-14 space-y-6">
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

    <div id="agreeCheckbox" class="mt-8 flex w-full space-x-1 md:cursor-pointer" @click="checkAgree">
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
</template>

<script setup>
// 주문 방식, 금액에 대한 컴포넌트입니다.
// 가상계좌이체인 경우는 에스크로를 사용할 수 있고, 이에 대한 다이얼로그 동작이 있습니다.
// 기본적인 에러 사항을 toast, alert가 아닌 inline으로 처리합니다.
import * as amplitude from '@amplitude/analytics-browser'

defineProps({
  selectedPayment: {
    type: String,
    required: true
  },
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
  isEscrowChecked: {
    type: Boolean,
    required: true
  },
  errorObj: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['clickPayment', 'checkAgree', 'clickEscrowCheck'])

const clickPayment = (payment) => {
  amplitude.track('pay_click', { howpay: formatAmpPayMethodFilter(payment) })

  emit('clickPayment', payment)
}

const checkAgree = () => {
  emit('checkAgree')
}

const checkEscrow = () => {
  emit('clickEscrowCheck')
}
</script>
