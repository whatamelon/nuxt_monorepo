<template>
  <div class="flex cursor-pointer justify-between" @click="() => getOrderDetail(order)">
    <div class="flex w-fit space-x-1 md:cursor-pointer">
      <p class="subhead-3-b text-black">주문번호 {{ order.salesId }}</p>
      <i class="rb-arrow-right my-auto text-base text-black"></i>
    </div>
    <p class="body-1-r text-rgray-400">{{ formatDateReplace(order.payDate) }}</p>
  </div>

  <hr class="my-4 w-full border border-black" />

  <div class="mb-4 cursor-pointer space-y-4 divide-y divide-rgray-100" @click="() => getOrderDetail(order)">
    <div v-for="(item, index) in order.spList" :key="index" class="-mt-4 pt-4">
      <p
        :class="{
          'badge-h22-r0-fill-p8-gray': badgeColor(item.status) == 'hold',
          'badge-h22-r0-fill-p8-black': badgeColor(item.status) == 'action',
          'badge-h22-r0-fill-p8-black !bg-orange-100 !text-orange-600': badgeColor(item.status) == 'cancel'
        }"
      >
        {{ formatSalesStatus(item.status) }}
      </p>

      <div class="mt-2 flex gap-4">
        <div class="space-y-1" style="width: calc(100% - 72px)">
          <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
          <p class="body-1-r line-clamp-1 text-black">{{ item.name }}</p>

          <div class="caption-2-b space-x-1 text-black">
            <span v-for="(opt, optIdx) in item.optCode.split(':')" :key="optIdx">{{ formatOptionValue(opt) }} {{ optIdx == item.optCode.split(':').length - 1 ? '' : '/' }} </span>
          </div>

          <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.priceSet) }}원</p>
        </div>

        <NuxtImg width="60px" height="90px" :src="item.imgLink" class="object-contain" />
      </div>
    </div>
  </div>

  <div v-if="order.status == '10'" class="w-full">
    <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('cancel', order)">주문 취소</button>
  </div>

  <div v-if="order.status == '11'" class="flex w-full space-x-1">
    <div class="w-1/3">
      <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('cancel', order)">주문 취소</button>
    </div>
    <div class="w-1/3">
      <button class="btn-h52-r0-line-wfull-gray px-4" @click="() => clickOrderBtn('vbank', order)">입금 계좌번호</button>
    </div>
    <div class="w-1/3">
      <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('connect-faq', order)">고객센터</button>
    </div>
  </div>

  <div v-if="order.status == '30'" class="w-full">
    <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('tracking-ship', order)">배송현황</button>
  </div>

  <div v-if="order.status == '40' && btnChecker(order) == 'decideandreturn'" class="flex w-full space-x-1">
    <div class="w-1/2">
      <button class="btn-h52-r0-fill-wfull" @click="() => clickOrderBtn('decide', order)">구매확정</button>
    </div>
    <div class="w-1/2">
      <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('return', order)">반품요청</button>
    </div>
  </div>

  <div v-if="order.status == '40' && btnChecker(order) == 'decide'" class="w-full">
    <button class="btn-h52-r0-fill-wfull" @click="() => clickOrderBtn('decide', order)">구매확정</button>
  </div>

  <div v-if="order.status == '40' && btnChecker(order) == 'returnandcancel'" class="w-full">
    <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('connect-faq', order)">고객센터</button>
  </div>

  <div v-if="order.status == '40' && btnChecker(order) == 'review' && (order.hasNoReview == true || order.reviewFlag == true)" class="flex w-full space-x-1">
    <button class="body-1-r btn-h52-r0-fill-wfull" @click="() => clickOrderBtn('write-review', order)">
      리뷰 작성 시 <span class="subhead-2-b">+ {{ formatWonNoBlank(order.textReviewPointPre + order.imageReviewPointPre) }}P</span>
    </button>
  </div>

  <div v-if="(order.status == '90' || order.status == '60') && (order.hasNoReview == true || order.reviewFlag == true)" class="w-full">
    <button class="body-1-r btn-h52-r0-fill-wfull" @click="() => clickOrderBtn('write-review', order)">
      리뷰 작성 시 <span class="subhead-2-b">+ {{ formatWonNoBlank(order.textReviewPointPre + order.imageReviewPointPre) }}P</span>
    </button>
  </div>

  <div v-if="order.status == '50'" class="w-full">
    <button class="btn-h52-r0-line-wfull-gray" @click="() => clickOrderBtn('connect-faq', order)">고객센터</button>
  </div>
</template>

<script setup>
// 주문 아이템입니다.
// 주문 상태에 따라 하단에 나타내는 버튼의 종류가 달라집니다.
// 버튼에서 emit을 통해 페이지로 동작과 해당 주문 객체를 보내고, 페이지에서 변경을 수행합니다.
defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel', 'vbank', 'connectFaq', 'trackingShip', 'decide', 'return', 'writeReview', 'detail'])

const badgeColor = (status) => {
  switch (status) {
    case '11':
      return 'action'
    case '40':
      return 'action'
    case '80':
      return 'cancel'
    case '81':
      return 'cancel'
    default:
      return 'hold'
  }
}

const btnChecker = (order) => {
  const review = order.spList.map((e) => e.status).findIndex((e) => e === '90')
  if (review !== -1) return 'review'

  const returncancel = order.spList.map((e) => e.status).findIndex((e) => e === '58' || e === '59')
  if (returncancel !== -1) {
    const isAlive = order.spList.map((e) => e.status).findIndex((e) => parseInt(e, 10) < 40)
    if (isAlive !== -1) {
      return 'decideandreturn'
    }
    return 'decide'
  }

  const decideandreturn = order.spList.map((e) => e.status).findIndex((e) => e === '40')
  if (decideandreturn !== -1) return 'decideandreturn'
  if (decideandreturn === -1) return 'returnandcancel'
}

const clickOrderBtn = async (action, order) => {
  // cancel
  if (action === 'cancel') {
    emit('cancel', order)
  }

  // vbank
  if (action === 'vbank') {
    emit('vbank', order)
  }

  // connect-faq
  if (action === 'connect-faq') {
    emit('connectFaq', order)
  }

  // tracking-ship
  if (action === 'tracking-ship') {
    emit('trackingShip', order)
  }

  // decide
  if (action === 'decide') {
    emit('decide', order)
  }

  // return
  if (action === 'return') {
    emit('return', order)
  }

  // write-review
  if (action === 'write-review') {
    emit('writeReview', order)
  }
}

const getOrderDetail = (order) => {
  emit('detail', order)
}

// function goToProd(prodId) {
//     router.push('/product/' + prodId);
// }
</script>
