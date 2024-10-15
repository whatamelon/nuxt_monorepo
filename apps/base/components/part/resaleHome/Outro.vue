<template>
  <div class="aspect-h-3 aspect-w-2 w-full bg-cover px-10" :style="setBgImage(data.contents.bgImgUrl)">
    <div
      class="px-10"
      :class="{
        'mt-44': data.contents.position == 'middle',
        'mt-15': data.contents.position == 'top'
      }"
    >
      <h2 class="display-2-b whitespace-pre-line text-white">{{ data.contents.title }}</h2>
    </div>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 아웃트로 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
defineProps({
  data: {
    type: Object,
    required: true
  }
})

const setBgImage = (imgUrl) => {
  return {
    backgroundImage: `url(${imgUrl})`,
    backgroundPosition: '50% 50%'
  }
}
</script>
