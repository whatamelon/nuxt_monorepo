<template>
  <form class="bg-white px-5 py-10" @submit.prevent="goToNext">
    <p class="caption-2-b" :style="{ color: data.contents.tagColor }">{{ data.contents.tag }}</p>
    <h2 class="display-1-b mt-4 whitespace-pre-line text-black" :style="{ color: data.contents.titleColor }">{{ data.contents.title }}</h2>

    <div class="mt-10 flex space-x-2">
      <p class="subhead-3-b my-auto text-black">{{ data.contents.preText }}</p>

      <div class="w-20">
        <input
          v-model="massiveCount"
          type="number"
          class="subhead-2-b h-13 w-full border p-4 focus:border-black"
          :class="{
            'border-orange-600': errorObj.code == 'no_code'
          }"
          maxlength="2"
        />
      </div>

      <p class="subhead-3-b my-auto text-black">{{ data.contents.suffixText }}</p>
    </div>

    <p class="body-1-r mt-2 whitespace-pre-line text-rgray-400">{{ data.contents.caption }}</p>

    <p v-if="errorObj.code != ''" class="body-1-r mt-2 whitespace-pre-line text-orange-600">{{ errorObj.msg }}</p>

    <button type="button" class="mt-10 flex w-full items-center justify-between rounded-[22px] bg-rgray-50 px-6 py-[14px] md:cursor-pointer" @click="goToLittle">
      <p class="body-1-r text-black">{{ data.contents.goLittleWord }}</p>

      <div class="flex gap-1">
        <p class="subhead-2-b my-auto text-black">{{ data.contents.goLittleApplyWord }}</p>
        <i class="rb-arrow-right my-auto text-black"></i>
      </div>
    </button>

    <div id="bottomFixedButton" class="fixed bottom-0 left-0 flex w-full gap-1 bg-white px-5 pt-2 ios-safe-area md:left-auto md:-ml-5 md:max-w-pc" style="z-index: 998">
      <button type="button" class="btn-h56-r28-line-wfull" @click="goToPrevious">이전</button>
      <button type="submit" :disabled="massiveCount === 0" class="btn-h56-r28-fill-wfull disabled:bg-gray-200">주소 입력하기</button>
    </div>
  </form>
</template>

<script setup lang="ts">
// 판매신청하기 페이지 내의 2단계인 수량 입력 컴포넌트입니다.
// 24.04.08 기준 OLO에서 사용중입니다.
// 모든 정보는 DB로 부터 받아옵니다.
import * as amplitude from '@amplitude/analytics-browser'

const massiveCount = defineModel<number>({ default: 0 })
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  originMassiveCount: {
    type: Number,
    required: true
  }
})
const emit = defineEmits<{
  goToPrev: [step: number]
  goToNext: [step: number]
  changeSellType: [step: number, type: SellType]
  openItemDialog: []
  changeMassiveCount: []
}>()

const errorObj = ref<ErrorDialog>({
  code: '',
  msg: '',
  time: 0
})

const setErrorObj = (obj: ErrorDialog) => {
  errorObj.value = obj

  setTimeout(() => {
    errorObj.value = {
      code: '',
      msg: '',
      time: 0
    }
  }, obj.time)
}

const goToPrevious = () => {
  // 나가기 전 데이터 sync
  emit('changeMassiveCount')

  setTimeout(() => {
    if (props.originMassiveCount >= 10 && props.originMassiveCount <= 50) {
      emit('openItemDialog')
    } else {
      emit('goToPrev', props.step)
    }
  }, 100)
}

const goToLittle = () => {
  emit('changeSellType', props.step, 'massive')
}

const goToNext = async () => {
  if (massiveCount.value === 0) {
    amplitude.track('blquantityCheck_click', {
      quantity: massiveCount.value,
      total: massiveCount.value
    })
    setErrorObj({
      code: 'no_count',
      msg: '판매하시려는 제품의 총 수량을 입력해주세요.',
      time: 5000
    })
  } else if (massiveCount.value < 10 || massiveCount.value > 50) {
    amplitude.track('blquantityCheck_click', {
      quantity: massiveCount.value,
      total: massiveCount.value
    })
    setErrorObj({
      code: 'not_matched_count',
      msg: '대량 판매는 한 번에 10~50벌까지만 가능합니다. \n10벌 미만은 소량 판매로 신청해 주세요.',
      time: 5000
    })
  } else {
    // 나가기 전 데이터 sync
    emit('changeMassiveCount')
    amplitude.track('blquantityCheck_click', {
      quantity: massiveCount.value
    })
    emit('goToNext', props.step)
  }
}
</script>
