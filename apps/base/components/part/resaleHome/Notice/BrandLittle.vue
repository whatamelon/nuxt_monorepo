<template>
  <div id="resaleNoticeSection" class="p-10" :style="{ backgroundColor: data.contents.bgColor }">
    <p class="caption-2-b text-green-300">{{ data.contents.tag }}</p>
    <h2 class="display-1-b mt-2 whitespace-pre-line text-white">{{ data.contents.title }}</h2>

    <div class="badge-h22-r11-line-p8-green mt-10">{{ data.contents.conditionBadgeText }}</div>

    <div class="mt-4 space-y-2">
      <div v-for="(cond, index) in data.contents.conditionList" :key="index" class="flex space-x-1 text-white">
        <i class="rb-check text-24xl"></i>
        <p class="subhead-2-b my-auto">{{ cond }}</p>
      </div>
    </div>

    <div class="mt-10 space-y-5">
      <div v-for="(brand, index) in copy.brandList" :key="index">
        <hr :class="!brand.isOpen ? 'border-white border-opacity-20' : 'border-white border-opacity-100'" />
        <div class="mt-5 flex justify-between md:cursor-pointer" @click="() => setIsOpen(brand)">
          <NuxtImg :src="brand.logoImg" class="h-10" />

          <div class="flex space-x-2">
            <p class="subhead-3-b my-auto text-white">{{ brand.brandName }}</p>
            <i class="my-auto text-24xl text-white" :class="!brand.isOpen ? 'rb-arrow-down' : 'rb-arrow-up'"></i>
          </div>
        </div>

        <div v-if="brand.isOpen" class="mt-12 px-2">
          <div class="badge-h22-r11-line-p8-green mt-10">{{ brand.categoryBadgeText }}</div>

          <div class="mt-4 break-keep" v-html="brand.categoryBodyCode"></div>
          <p v-if="brand.categoryList != ''" class="subhead-3-b mt-2 break-keep text-green-300">{{ brand.categoryList }}</p>

          <div class="badge-h22-r11-line-p8-green mt-10">{{ brand.rewardBadgeText }}</div>

          <p class="body-2-r mt-4 break-keep text-white">{{ brand.rewardBody }}</p>
          <p class="body-1-r mt-1 break-keep text-white opacity-60">{{ brand.rewardCaption }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 적당한 갯수의 브랜드를 표현할 때, 사용하는 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const copy = reactive(props.data.contents)

function setIsOpen(brand) {
  copy.brandList.forEach((e) => {
    if (e.brandName === brand.brandName) {
      e.isOpen = !e.isOpen
    } else {
      e.isOpen = false
    }
  })
}
</script>
