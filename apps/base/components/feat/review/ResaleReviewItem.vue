<template>
  <div class="grid w-full pt-4">
    <div class="mb-1.5 flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <div class="badge-h22-r0-fill-p8-white">판매</div>
        <div class="flex">
          <i v-for="(_, index) in Array(reviewItem.starPoint)" :key="index" class="rb-star text-base text-white"></i>
        </div>
        <p class="body-1-r text-white text-opacity-40">{{ reviewItem.userName }}</p>
      </div>
      <p class="body-1-r text-white text-opacity-40">{{ formatDate(reviewItem.reviewDate) }}</p>
    </div>
    <p class="body-1-r line-clamp-3 break-words break-keep text-white">{{ reviewItem.msg }}</p>
  </div>
</template>

<script setup>
// 판매 리뷰 아이템입니다.
defineProps({
  reviewItem: {
    type: Object,
    required: true
  }
})
</script>
