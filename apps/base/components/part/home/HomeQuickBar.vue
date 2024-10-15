<template>
  <div v-if="data.contents.list.length <= 8" class="grid w-full grid-cols-4 gap-x-4 gap-y-6 px-5 py-8 no-scroll">
    <NuxtLink v-for="(item, index) in data.contents.list" :key="item.img" :to="item.url" class="mx-auto w-[72px] cursor-pointer" style="break-inside: avoid" @click.native="() => clickEvent(index)">
      <NuxtImg :src="item.img" class="h-[72px] w-full" :alt="item.mobileText + ' 퀵바'" />
      <!-- 해당 텍스트는 룰에 없는 텍스트라서 style로 대체 -->
      <p class="mt-1.5 block w-full whitespace-pre text-center text-sm text-rgray-900" style="font-weight: 400; line-height: 15px; letter-spacing: -0.3px">{{ item.mobileText }}</p>
    </NuxtLink>
  </div>
  <div v-else class="py-8">
    <Swiper
      :slides-per-view="4.8"
      :grid="{ rows: 2, fill: 'row' }"
      :slides-offset-before="20"
      :space-between="12"
      :scrollbar="{ dragSize: 22 }"
      :modules="[SwiperGrid, SwiperScrollbar, SwiperFreeMode]"
      :style="{ paddingRight: '20px' }"
      free-mode
    >
      <SwiperSlide v-for="(item, index) in data.contents.list" :key="index" class="w-16">
        <NuxtLink :to="item.url" style="break-inside: avoid" class="flex flex-col items-center justify-center" @click.native="() => clickEvent(index)">
          <DotLottieVue v-if="item.img.endsWith('.lottie')" style="height: 60px; width: 60px" autoplay loop :src="item.img" :alt="item.mobileText + ' 퀵바'" />
          <NuxtImg v-else :src="item.img" width="60px" height="60px" :alt="item.mobileText + ' 퀵바'" />
          <!-- 해당 텍스트는 룰에 없는 텍스트라서 style로 대체 -->
          <p class="mt-1.5 block w-full whitespace-pre text-center text-sm text-rgray-900" style="font-weight: 400; line-height: 15px; letter-spacing: -0.3px">{{ item.mobileText }}</p>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
// 홈 퀵바 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 최대 8개를 리스팅합니다.
import * as amplitude from '@amplitude/analytics-browser'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

defineProps({
  data: {
    type: Object,
    required: true
  }
})

const clickEvent = (index) => {
  const ampName = `home_quickbar_click_${index}${1}`
  amplitude.track(ampName)
}
</script>
<style lang="css">
:root {
  --swiper-scrollbar-sides-offset: 44%;
  --swiper-scrollbar-bottom: -18px;
  --swiper-scrollbar-size: 4px;
  --swiper-scrollbar-border-radius: 2px;
}
</style>
