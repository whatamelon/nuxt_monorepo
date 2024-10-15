<template>
  <!-- 라디오 버튼 아이콘입니다. -->
  <svg v-if="checked == false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="clicked()">
    <circle cx="12" cy="12" r="10" stroke="#E7E7E7" stroke-width="2" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="clicked()">
    <circle cx="12" cy="12" r="11" fill="black" />
    <path d="M6 12.125L9.875 16L18 8" stroke="white" stroke-width="2" />
  </svg>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['clickCheck'])

function clicked() {
  emit('clickCheck', props.id)
}
</script>
