<template>
  <div>
    <div class="flex justify-between">
      <div class="flex w-fit space-x-1 md:cursor-pointer" @click="() => getIpDetail(ipu)">
        <p class="subhead-3-b text-black">판매번호 {{ ipu.ipuId }}</p>
        <i class="rb-arrow-right my-auto text-base text-black"></i>
      </div>
      <p class="body-1-r text-rgray-400">{{ formatDateReplace(ipu.sellDate) }}</p>
    </div>

    <hr class="my-4 w-full border border-black" />

    <div v-if="ipu.itemList.length > 0" class="-mt-4 mb-4 space-y-4 divide-y divide-rgray-100">
      <div v-for="(item, index) in ipu.itemList" :key="index" class="pt-4">
        <p
          :class="{
            'badge-h22-r0-fill-p8-gray': badgeColor(item.status) == 'hold',
            'badge-h22-r0-fill-p8-black': badgeColor(item.status) == 'action',
            'badge-h22-r0-fill-p8-black !bg-orange-100 !text-orange-600': badgeColor(item.status) == 'cancel'
          }"
        >
          {{ formatItemStatus(item.status) }}
        </p>

        <div class="mt-2 flex space-x-2">
          <div class="w-[calc(100%-72px)] space-y-1">
            <p class="caption-2-b line-clamp-1 text-black">{{ item.snCode }}</p>
            <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
            <p class="body-1-r line-clamp-1 text-black">{{ item.itemName }}</p>
            <p class="subhead-2-b text-black"><span class="body-1-r mr-1">보상 포인트</span>{{ formatWonNoBlank(item.credit) }} P</p>
          </div>
          <div class="">
            <img :src="item.imgLinkTh" class="h-auto w-16" />
          </div>
        </div>
        <button v-if="item.failFlag == true && item.failMsg != ''" class="btn-h32-r0-line-p16-gray mt-2" @click="() => failMsg(item)">실패 사유 보기</button>
      </div>
    </div>

    <div v-else class="mb-4 flex space-x-4">
      <p
        :class="{
          'badge-h22-r0-fill-p8-gray': badgeColor(ipu.status) == 'hold',
          'badge-h22-r0-fill-p8-black': badgeColor(ipu.status) == 'action',
          'badge-h22-r0-fill-p8-black !bg-orange-100 !text-orange-600': badgeColor(ipu.status) == 'cancel'
        }"
      >
        {{ formatItemStatus(ipu.status) }}
      </p>
      <p class="body-2-r text-black">
        총 <span class="subhead-3-b">{{ ipu.itemCnt }}</span
        >벌
      </p>
    </div>

    <div v-if="btnChecker(ipu) == 'cancel'" class="w-full">
      <button class="btn-h52-r0-line-wfull-gray200" @click="() => clickIpBtn('cancel', ipu)">판매 취소</button>
    </div>

    <div v-if="btnChecker(ipu) == 'delivery'" class="w-full">
      <button class="btn-h52-r0-line-wfull-gray200" @click="() => clickIpBtn('delivery', ipu)">수거현황</button>
    </div>

    <div v-if="btnChecker(ipu) == 'delivery_and_cancel'" class="flex w-full space-x-1">
      <div class="w-1/2">
        <button class="btn-h52-r0-line-wfull-gray200" @click="() => clickIpBtn('delivery', ipu)">수거현황</button>
      </div>
      <div class="w-1/2">
        <button class="btn-h52-r0-line-wfull-gray200" @click="() => clickIpBtn('cancel', ipu)">판매 취소</button>
      </div>
    </div>

    <div v-if="btnChecker(ipu) == 'pick_and_cancel'" class="flex w-full space-x-1">
      <div class="w-1/2">
        <button class="btn-h52-r0-fill-wfull" @click="() => clickIpBtn('pick', ipu)">수거 신청</button>
      </div>
      <div class="w-1/2">
        <button class="btn-h52-r0-line-wfull-gray200" @click="() => clickIpBtn('cancel', ipu)">판매 취소</button>
      </div>
    </div>

    <div v-if="btnChecker(ipu) == 'review'" class="w-full">
      <button class="body-1-r btn-h52-r0-fill-wfull" @click="() => clickIpBtn('review', ipu)">
        리뷰 작성 시 <span class="subhead-2-b">+ {{ formatWonNoBlank(ipu.reviewPointPre) }}P</span>
      </button>
    </div>
  </div>
</template>

<script setup>
// 판매 아이템입니다.
// 판매상태와 reviewable, reviewFlag값에 따라 하단에 나타내는 버튼의 종류가 달라집니다.
// 버튼에서 emit을 통해 페이지로 동작과 해당 판매 객체를 보내고, 페이지에서 변경을 수행합니다.
defineProps({
  ipu: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel', 'pick', 'trackingShip', 'writeReview', 'failMsg', 'detail'])

const badgeColor = (status) => {
  switch (status) {
    case 'b3':
      return 'hold'
    case 'b4':
      return 'hold'
    case 'p0':
      return 'hold'
    case 'p1':
      return 'hold'
    case 'd0':
      return 'hold'
    case 'b0':
      return 'hold'
    case 'c0':
      return 'hold'
    case 'f0':
      return 'cancel'
    case 'f1':
      return 'cancel'
    case 'c1':
      return 'cancel'
    case 'c2':
      return 'cancel'
    case 'c9':
      return 'cancel'
    default:
      return 'action'
  }
}

const btnChecker = (ipu) => {
  if (ipu.reviewable === true || ipu.reviewFlag === true) {
    return 'review'
  }

  // cancel and delivery
  if (ipu.itemList.findIndex((e) => e.status === 'b0' || e.status === 'p0') > -1 && ipu.itemList.findIndex((e) => e.status === 'b1' || e.status === 'd0') > -1) {
    return 'delivery_and_cancel'
  }

  // pick_and_cancel
  if (ipu.status === 'b2') {
    return 'pick_and_cancel'
  }

  // delivery
  if (ipu.status === 'd0') {
    return 'delivery'
  }

  // cancel
  if (ipu.status === 'b0' || ipu.status === 'p0') {
    return 'cancel'
  }
}

const clickIpBtn = (type, ipu) => {
  if (type === 'cancel') {
    emit('cancel', ipu)
  }

  if (type === 'delivery') {
    emit('trackingShip', ipu)
  }

  if (type === 'pick') {
    emit('pick', ipu)
  }

  if (type === 'review') {
    emit('writeReview', ipu)
  }
}

const getIpDetail = (ipu) => {
  emit('detail', ipu)
}

const failMsg = (item) => {
  emit('failMsg', item)
}
</script>
