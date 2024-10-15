<template>
  <div v-if="imgList.length > 1">
    <Swiper
      id="productDetail"
      :modules="[SwiperPagination, SwiperEffectCreative, SwiperZoom]"
      :slides-per-view="1"
      :loop="true"
      :pagination="{
        type: `progressbar`,
        progressbarFillClass: 'swiper-pagination-progressbar-fill h-0.5 block rounded-none m-0'
      }"
      :effect="'creative'"
      :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1]
        },
        next: {
          translate: ['100%', 0, 0]
        }
      }"
      :zoom="true"
    >
      <SwiperSlide v-for="(img, index) in imgList" :key="index">
        <div
          class="swiper-zoom-container"
          :class="{
            'aspect-h-4 aspect-w-3 bg-white': appStore().getDomain == 'orm',
            'aspect-h-1 aspect-w-1': appStore().getDomain == 'nsr' || appStore().getDomain == 'greenforet'
          }"
        >
          <nuxt-img
            :src="img"
            fit="contain"
            loading="lazy"
            sizes="w-full"
            placeholder
            class="object-contain"
            :class="{
              'mx-auto max-w-[calc(100%-40px)]': appStore().getDomain == 'orm'
            }"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <div v-else>
    <div
      :class="{
        'aspect-h-3 aspect-w-2': appStore().getDomain == 'orm',
        'aspect-h-1 aspect-w-1': appStore().getDomain == 'nsr' || appStore().getDomain == 'greenforet'
      }"
    >
      <nuxt-img :src="imgList[0]" fit="cover" loading="lazy" sizes="w-full" placeholder />
    </div>
  </div>
</template>

<script setup>
// 상품 상세 최상단 이미지리스트에 대한 컴포넌트입니다.
// swiper로 구성이 되어있습니다.
// 상품 이미지가 1장인 경우에는 swiper를 사용하지 않습니다.
defineProps({
  imgList: {
    type: Array,
    required: true
  }
})

onMounted(() => {
  const elements = document.getElementsByClassName('swiper-pagination-bullet')
  Array.from(elements).forEach((element) => {
    element.style.flex = '1 0 0'
    element.style.margin = '0'
  })

  const elements2 = document.getElementsByClassName('swiper-pagination')
  Array.from(elements2).forEach((element) => {
    element.style.bottom = '0px'
  })
})
</script>

<style>
.swiper {
  overflow-y: visible;
}

.swiper-pagination {
  display: flex;
  top: auto !important;
}

.swiper-horizontal > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-horizontal {
  height: 2px !important;
}

#productDetail > .swiper-pagination-progressbar {
  bottom: 16px !important;
  max-width: 160px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.swiper-pagination-progressbar {
  background: rgba(34, 34, 34, 0.05);
}

.swiper-pagination-progressbar-fill {
  background: rgba(34, 34, 34, 1) !important;
}
</style>
