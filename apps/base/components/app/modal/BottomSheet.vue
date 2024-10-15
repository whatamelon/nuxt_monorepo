<template>
  <div v-if="isOpen">
    <div style="z-index: 998" class="fixed top-0 z-40 h-screen w-full bg-black opacity-60 md:max-w-pc" @click="close"></div>
    <div style="z-index: 999" class="fixed bottom-0 z-50 w-full bg-white pb-2 pt-10 ios-safe-area md:max-w-pc">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// 기본 바텀시트입니다. dim과 바텀시트로 구성되어있습니다.
// 부모에서 해당 컴포넌트를 호출하고, slot에 바텀시트에 들어갈 내용을 넣습니다.
// isOpen 으로 열고, 닫음을 결정합니다.
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['updateOpen'])

function close() {
  emit('updateOpen', false)
}
</script>
