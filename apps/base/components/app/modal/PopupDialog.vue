<template>
  <div v-show="isOpen" style="z-index: 9999" class="fixed top-0 h-full w-full md:max-w-pc">
    <div class="absolute h-full w-full bg-[rgba(0,0,0,.6)]" @click.self="close">
      <div class="absolute left-1/2 top-1/2 min-w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white text-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
// 팝업 다이얼로그입니다. dim과 중앙 정렬된 confirm창으로 구성되어있습니다.
// 부모에서 해당 컴포넌트를 호출하고, slot에 다이얼로그에 들어갈 내용을 넣습니다.
// isOpen 으로 열고, 닫음을 결정합니다.
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['updateOpen'])

const close = () => {
  emit('updateOpen', false)
}
</script>
