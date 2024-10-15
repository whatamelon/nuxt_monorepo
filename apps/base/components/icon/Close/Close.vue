<template>
  <!-- 닫기 아이콘입니다. -->

  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="my-auto p-1">
    <path d="M1 1L17 17" :stroke="stroke" stroke-width="2" />
    <path d="M17 1L1 17" :stroke="stroke" stroke-width="2" />
  </svg>
</template>
<script setup>
defineProps({
  stroke: {
    type: String,
    required: false,
    default: 'white'
  }
})
</script>
