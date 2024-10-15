<template>
  <!-- 이건 예전에 사용하던 홈컴포넌트라서 있기는 한데, 현재 사용하지는 않습니다. -->

  <div class="space-y-2">
    <PartHomeMidBanner v-for="(content, index) in data" :key="index" :data="content" :position="index"></PartHomeMidBanner>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>
