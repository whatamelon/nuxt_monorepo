<template>
  <div id="resaleNoticeSection" class="py-10" :style="{ backgroundColor: data.contents.bgColor }">
    <div class="px-10">
      <p class="caption-2-b text-green-300">{{ data.contents.tag }}</p>
      <h2 class="display-1-b whitespace-pre-line text-white">{{ data.contents.title }}</h2>

      <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.conditionBadgeText }}</div>

      <div class="mt-4 space-y-2">
        <div v-for="(cond, index) in data.contents.conditionList" :key="index" class="flex space-x-1 text-white">
          <i class="rb-check text-24xl"></i>
          <p class="subhead-2-b my-auto">{{ cond }}</p>
        </div>
      </div>

      <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.brandBadgeText }}</div>
      <button class="mt-4 flex h-12 space-x-1 rounded-4xl bg-white pl-10 pr-8 text-black" @click="openBrandsBottomSheet">
        <p class="subhead-3-b my-auto">{{ data.contents.brandButtonText }}</p>
        <i class="rb-arrow-right my-auto text-base"></i>
      </button>

      <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.categoryBadgeText }}</div>
      <p class="body-2-r mt-4 text-white">{{ data.contents.categoryBody }}</p>

      <div class="subhead-2-b mt-10 w-fit rounded-xl border border-green-300 px-2 py-0.5 text-green-300">{{ data.contents.rewardBadgeText }}</div>
      <p class="body-2-r mt-4 whitespace-pre-line text-white">{{ data.contents.rewardBody }}</p>
      <p class="body-1-r mt-1 whitespace-pre-line text-white opacity-60">{{ data.contents.rewardCaption }}</p>
    </div>

    <AppModalBottomSheet :is-open="isBottomSheetOpen" @update-open="closeSheet">
      <div class="h-[560px] w-full md:max-w-pc">
        <div class="mb-6 px-5">
          <p class="headline-b text-black">{{ data.contents.brandBadgeText }}</p>
        </div>

        <div class="h-[450px] w-full space-y-4 overflow-y-scroll px-5">
          <p v-for="(brand, index) in data.contents.brandList" :key="index" class="body-2-r text-black">{{ brand }}</p>
        </div>

        <div id="bottomFixedButton" class="fixed bottom-12 w-full px-5 md:max-w-pc">
          <button class="subhead-3-b btn-h52-r0-fill-wfull" @click="closeSheet">닫기</button>
        </div>
      </div>
    </AppModalBottomSheet>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 많은 갯수의 브랜드를 표현할 때, 사용하는 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
defineProps({
  data: {
    type: Object,
    required: true
  }
})

const isBottomSheetOpen = ref(false)

const closeSheet = () => {
  isBottomSheetOpen.value = false
}

const openBrandsBottomSheet = () => {
  isBottomSheetOpen.value = true
}
</script>
