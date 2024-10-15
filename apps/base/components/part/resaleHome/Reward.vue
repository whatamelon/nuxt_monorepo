<template>
  <div class="p-10" :style="{ backgroundColor: data.contents.bgColor }">
    <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">{{ data.contents.tag }}</p>
    <h2 class="display-1-b mt-1 break-keep" :style="setTextColor(data.contents.titleColor)">{{ data.contents.title }}</h2>
    <img :src="data.contents.imgUrl" class="mt-6 w-full" />
    <h2 class="body-long-2-r mt-6 break-keep" :style="setTextColor(data.contents.bodyColor)">{{ data.contents.body }}</h2>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 판매보상 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
defineProps({
  data: {
    type: Object,
    required: true
  }
})

const setTextColor = (color) => {
  return {
    color
  }
}
</script>
