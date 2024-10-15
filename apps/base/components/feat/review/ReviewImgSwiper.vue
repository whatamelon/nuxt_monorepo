<template>
  <ClientOnly>
    <Teleport to="#main_wrapper">
      <div v-if="isOpen" class="absolute">
        <div class="fixed top-0 z-[999] h-screen w-full bg-[rgba(0,0,0,0.8)] md:max-w-pc">
          <i class="rb-close fixed right-5 top-10 z-[999] cursor-pointer text-32xl text-white md:right-[calc(50%-163px)] md:top-10 xl:right-[calc(50%-350px)]" @click="close" />
          <div class="fixed top-1/2 w-full -translate-y-1/2 md:max-w-pc">
            <Swiper :modules="[SwiperThumbs]" :thumbs="{ swiper: thumbsSwiper }" :slides-per-view="1" @slideChange="slideChange">
              <SwiperSlide v-for="(img, index) in reviewImgs" :key="index" class="my-auto flex">
                <div class="px-5">
                  <img :src="img" class="mx-auto h-full max-h-80" />
                </div>
              </SwiperSlide>
            </Swiper>

            <div class="mx-auto mt-8 flex p-4">
              <Swiper
                v-if="reviewImgs.length > 1"
                :modules="[SwiperThumbs]"
                :watch-slides-progress="true"
                :slides-per-view="reviewImgs.length"
                :space-between="6"
                class="reviewImgThumbSwiper max-h-20 w-full"
                @swiper="setThumbsSwiper"
                @slideChange="slideChange2"
              >
                <SwiperSlide v-for="(img_below, imgIdx) in reviewImgs" :key="imgIdx" class="max-h-20 max-w-20">
                  <img
                    :src="img_below"
                    class="!h-20 !w-20 border object-cover"
                    :class="{
                      'border-white': activeIndex == imgIdx,
                      'border-transparent': activeIndex != imgIdx
                    }"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
// 리뷰 이미지 클릭시, 나타나는 리뷰 이미지 리스트입니다.
// dim 과 이미지 swiper로 구성되어있습니다.
// 선택 이미지 swiper와 thumb swiper가 연결되어있습니다.
// 리뷰 이미지가 1개라면, 하단에 thumb을 띄우지 않습니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  reviewImgs: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['closeReviewImgList'])

const activeIndex = ref(0)
const thumbsSwiper = ref(null)

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}

const slideChange = (e) => {
  activeIndex.value = e.activeIndex
}

const slideChange2 = (e) => {
  activeIndex.value = e.activeIndex
}

const close = () => {
  emit('closeReviewImgList')
  thumbsSwiper.value = null
  activeIndex.value = 0
}

watch(
  () => props.isOpen,
  (current) => {
    if (current) {
      document.body.style.overflowY = 'hidden'
      hideChannelButton()
    } else {
      document.body.style.overflowY = 'auto'
      showChannelButton()
    }
  }
)
</script>

<style>
.reviewImgThumbSwiper > .swiper-wrapper {
  margin: 0px auto;
  display: flex;
  width: fit-content;
}
</style>
