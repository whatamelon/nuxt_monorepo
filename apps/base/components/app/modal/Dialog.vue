<template>
  <div v-show="isOpen" style="z-index: 999" class="fixed top-0">
    <div style="z-index: 998" class="fixed top-0 z-40 h-screen w-full bg-black opacity-60 md:max-w-pc" @click="close"></div>

    <div
      style="z-index: 999"
      class="z-50 whitespace-pre-line break-all bg-white md:max-w-pc"
      :class="{
        'absolute h-[100svh] w-screen': isFullScreen,
        'relative left-[22px] mx-auto mt-5 h-[580px] w-[335px] overflow-y-scroll px-5 pb-8 pt-5 no-scroll md:left-[20px] md:mt-20': !isFullScreen
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// 기본 다이얼로그입니다. dim과 바텀시트로 구성되어있습니다.
// 부모에서 해당 컴포넌트를 호출하고, slot에 다이얼로그에 들어갈 내용을 넣습니다.
// isOpen 으로 열고, 닫음을 결정합니다.
// isFullScreen값으로 전체화면, 혹은 비전체화면인지 결정할 수 있습니다.
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  isFullScreen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['updateOpen'])

const close = () => {
  emit('updateOpen', false)
}
</script>
