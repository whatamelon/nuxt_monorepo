<template>
  <div v-if="detailBrandIntro.title != ''">
    <div class="mt-1 w-full p-10" :style="{ backgroundColor: detailBrandIntro.backgroundColor }">
      <h3 class="display-1-b whitespace-pre-line text-black" :style="textColor(detailBrandIntro.titleColor)">{{ detailBrandIntro.title }}</h3>
      <p class="subhead-2-b mt-4 whitespace-pre-line text-black" :style="textColor(detailBrandIntro.bodyColor)">{{ detailBrandIntro.body }}</p>
      <p v-if="detailBrandIntro.isCaption == true" class="body-1-r mt-4 text-black opacity-80" :style="textColor(detailBrandIntro.captionColor)">{{ detailBrandIntro.caption }}</p>
    </div>
    <div class="relative">
      <img :src="detailBrandIntro.backgroundImgLink" class="w-full" />
      <div class="absolute bottom-5 right-5 flex h-20 w-20 rounded-full" :style="{ backgroundColor: detailBrandIntro.logoBgColor }">
        <img :src="detailBrandIntro.logoLink" class="m-auto w-15" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 상품 상세 정보의 브랜드 설명에 대한 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 해당 컴포넌트에 대한 추가,삭제,수정사항은 전부 DB로 해결가능합니다.
defineProps({
  detailBrandIntro: {
    type: Object,
    required: true,
    default() {
      return {
        title: '',
        body: '',
        isCaption: false,
        caption: '',
        backgroundColor: '',
        backgroundImgLink: '',
        logoLink: '',
        logoBgColor: ''
      }
    }
  }
})

const textColor = (colorCode) => {
  return {
    color: colorCode
  }
}
</script>
