<template>
  <AppModalDialog :is-open="isIpuFailMsgDialogOpen" :is-full-screen="true" @update-open="close">
    <div class="h-screen overflow-y-scroll px-5 pb-20">
      <div class="flex w-full justify-between py-4">
        <div class="w-6"></div>
        <p class="subhead-3-b text-black">불가 사유</p>
        <i class="rb-close text-24xl text-black" @click="close"></i>
      </div>

      <p class="display-1-b mt-10 text-black">{{ title }}</p>

      <p class="body-2-r mt-4 whitespace-pre-line break-keep text-rgray-600">{{ ipuFailMsg }}</p>

      <div v-if="isShowBox == true" class="mt-10 bg-rgray-50 py-6 pl-4 pr-6">
        <div class="flex space-x-1">
          <i class="rb-info text-24xl text-black"></i>
          <div class="">
            <p class="subhead-3-b mb-1 mt-0.5 text-black">무료 반송 진행중</p>
            <p class="body-long-1-r text-black">판매 신청 주소로 영업일 기준 1~3일 내에 반송 제품이 도착할 예정입니다.</p>
          </div>
        </div>
      </div>

      <button class="btn-h56-r28-fill-wfull mt-10" @click="close">확인</button>
    </div>
  </AppModalDialog>
</template>

<script setup>
// 판매 실패시에 불가 사유를 띄우는 다이얼로그입니다.
// 매입불가, 미입고시에 해당 사유를 매니저앱에서 작성하고, 작성된 사유를 띄워줍니다.
// 미입고시에는 isShowBox값을 통해, 무료 반송 진행중임을 고객에게 인지시킵니다.
const props = defineProps({
  ipuFailMsg: {
    type: String,
    required: true
  },
  isIpuFailMsgDialogOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleIpuFailMsgDialog'])

const title = computed(() => {
  if (props.ipuFailMsg) {
    if (props.ipuFailMsg.includes('동봉되지') === true) {
      return '해당 제품은 수거 박스에 없었어요 🥲'
    }
    return '해당 제품은 판매가 어려워요 🥲'
  }
  return '해당 제품은 판매가 어려워요 🥲'
})

const isShowBox = computed(() => {
  if (props.ipuFailMsg) {
    if (props.ipuFailMsg.includes('동봉되지') === true) {
      return false
    }
    return true
  }
  return false
})

const close = () => {
  emit('toggleIpuFailMsgDialog')
}
</script>
