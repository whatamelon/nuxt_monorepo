<template>
  <!-- 체크박스 아이콘입니다. -->
  <button type="button" class="h-6">
    <svg v-if="checked == false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="clicked">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="#E7E7E7" stroke-width="2" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="clicked">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="black" />
      <path d="M6 12.125L9.875 16L18 8" stroke="white" stroke-width="2" />
    </svg>
  </button>
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

const clicked = () => {
  emit('clickCheck', props.id)
}
</script>
