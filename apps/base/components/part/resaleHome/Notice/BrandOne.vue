<template>
  <div id="resaleNoticeSection" class="p-10" :style="{ backgroundColor: data.contents.bgColor }">
    <p class="caption-2-b text-green-300">{{ data.contents.tag }}</p>
    <h2 class="display-1-b whitespace-pre-line text-white">{{ data.contents.title }}</h2>

    <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.conditionBadgeText }}</div>

    <div class="mt-4 space-y-2">
      <div v-for="(cond, index) in data.contents.conditionList" :key="index" class="flex space-x-1 text-white">
        <i class="rb-check text-24xl"></i>
        <p class="subhead-2-b my-auto">{{ cond }}</p>
      </div>
    </div>

    <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.categoryBadgeText }}</div>

    <p class="body-2-r mt-4 text-white">{{ data.contents.categoryBody }}</p>
    <p class="subhead-3-b mt-2 text-green-300">{{ data.contents.categoryList }}</p>

    <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.rewardBadgeText }}</div>

    <p class="body-2-r mt-4 whitespace-pre-line text-white">{{ data.contents.rewardBody }}</p>
    <p class="body-1-r mt-1 whitespace-pre-line text-white opacity-60">{{ data.contents.rewardCaption }}</p>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 브랜드가 1개인 경우, 사용하는 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
