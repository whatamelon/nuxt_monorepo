<template>
  <section class="w-full py-10">
    <div class="mx-auto w-full">
      <div class="flex w-full space-x-2 px-5">
        <h2 class="display-1-b text-black">{{ data.contents.title }}</h2>
      </div>
      <p class="body-1-r mb-8 mt-2 px-5 text-rgray-400">{{ data.contents.subTitle }}</p>

      <Swiper :slides-per-view="2.5" :slides-offset-before="20" :modules="[SwiperFreeMode]" :free-mode="true">
        <SwiperSlide v-for="(item, index) in data.contents.brandList" :key="index">
          <div v-if="item.brandName != ''" class="h-[180px] w-[136px]">
            <nuxt-link :to="'/event/pl/' + item.eventId" class="w-full cursor-pointer" style="break-inside: avoid" @click.native="() => goToEvent(index)">
              <figure class="w-full">
                <NuxtImg sizes="136px" :src="item.imgLink" class="h-full w-full cursor-pointer rounded-xl object-cover object-center" />
              </figure>
            </nuxt-link>
          </div>
          <div v-else class="h-[180px] w-[40px]"></div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
// 홈 브랜드 리스트 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 기본 브랜드 아이템은 width 136px, height 180px의 크기를 가집니다.
// 양옆으로 슬라이드되는 UX를 가집니다.
import * as amplitude from '@amplitude/analytics-browser'

defineProps({
  data: {
    type: Object,
    required: true
  }
})

const goToEvent = (index) => {
  const ampName = `home_newarrival_img${index}${1}_click`
  amplitude.track(ampName)
}
</script>
