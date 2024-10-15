<template>
  <div v-if="nowProgress != 5" class="fixed top-14 flex h-0.5 w-full max-w-full md:max-w-pc">
    <div
      v-for="(_, index) in ipStepRaw.length > 0 && ipStepRaw.length - 1"
      :key="index"
      class="w-1/4"
      :class="{
        'bg-black': index + 1 <= nowProgress,
        'bg-rgray-100': index + 1 > nowProgress
      }"
    ></div>
  </div>
</template>

<script setup>
// 판매신청하기 페이지의 상단에 단계를 나타내는 컴포넌트입니다.
const props = defineProps({
  ipStep: {
    type: Array,
    required: true
  },
  ipStepRaw: {
    type: Array,
    required: true
  },
  activeStep: {
    type: Object,
    required: true
  }
})

const nowProgress = computed(() => {
  const pg = props.ipStepRaw.findIndex((e) => e.step === props.activeStep.step) + 1

  return pg
})
</script>
