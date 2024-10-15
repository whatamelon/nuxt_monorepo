<template>
  <AppModalDialog :is-open="isCancelDialogOpen" :is-full-screen="true" @update-open="close">
    <div class="relative h-screen overflow-y-auto pb-20">
      <div class="flex w-full justify-between px-5 py-4">
        <div class="w-6"></div>
        <p class="subhead-3-b text-black">주문 취소</p>
        <i class="rb-close text-24xl text-black" @click="close"></i>
      </div>

      <div class="mt-10 px-5">
        <p class="subhead-3-b text-black">취소하실 상품을 선택해주세요.</p>
        <hr class="mt-4 w-full border-black" />
      </div>

      <div class="mt-4 space-y-4 divide-y divide-rgray-100 px-5">
        <div v-for="item in cancelSoItems" :key="item.soId" class="flex items-start space-x-2 pt-4">
          <button type="button">
            <i
              class="text-24xl"
              :class="checkedCancelSoIds.findIndex((e) => e == item.soId) == -1 ? 'rb-checkbox-inactive text-rgray-100' : 'rb-checkbox-active text-black'"
              @click="setCancelSoIds(item.soId)"
            ></i>
          </button>
          <div class="space-y-1" style="width: calc(100% - 104px)">
            <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
            <p class="body-1-r line-clamp-2 text-black">{{ item.name }}</p>

            <div class="caption-2-b space-x-2 text-black">
              <span v-for="(opt, index) in item.optCode.split(':')" :key="index">{{ formatOptionKey(opt.split('=')[0]) }} : {{ formatOptionValue(opt) }}</span>
            </div>

            <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.priceSet) }}원</p>
          </div>
          <NuxtImg width="60px" height="90px" :src="item.imgLink" class="object-contain" />
        </div>
      </div>

      <div id="bottomFixedButton" class="fixed bottom-0 w-full px-5 py-2 md:max-w-pc">
        <button class="btn-h56-r28-fill-wfull" :class="checkedCancelSoIds.length === 0 ? 'bg-rgray-200' : 'bg-black'" @click="cancelSoItem">주문 취소하기</button>
      </div>
    </div>
  </AppModalDialog>
</template>

<script setup>
// 주문 취소 다이얼로그입니다.
// 주문상품을 페이지로 받아오고, 주문상품 선택 후에 취소합니다.
// 받아오는 주문상품의 조건은 주문상품 상태가 10,11 인 경우입니다.
defineProps({
  cancelSoItems: {
    type: Array,
    required: true
  },
  isCancelDialogOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleCancelDialog', 'cancelSoItems'])

const checkedCancelSoIds = ref([])

const setCancelSoIds = (soId) => {
  const findIdx = checkedCancelSoIds.value.findIndex((e) => e === soId)
  if (findIdx > -1) {
    checkedCancelSoIds.value.splice(findIdx, 1)
  } else {
    checkedCancelSoIds.value.push(soId)
  }
}

const close = () => {
  emit('toggleCancelDialog')
}

const cancelSoItem = () => {
  emit(
    'cancelSoItems',
    checkedCancelSoIds.value.map((e) => {
      return e
    })
  )
}
</script>
