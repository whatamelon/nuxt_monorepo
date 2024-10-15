<template>
  <div id="resaleHomeTab" class="sticky top-14 z-[998] mt-6 flex w-full space-x-1 bg-white px-10 pb-2 pt-2 md:max-w-pc">
    <div v-for="tab in tabList" :key="tab.code" @click="() => onUpdateTab(tab)">
      <div
        v-if="tab.code == selectedTab.code"
        class="subhead-2-b w-fit rounded-[18px] border px-3 py-2 text-white md:cursor-pointer"
        :style="setBorderAndBgColor(appStore().getDomain == 'greenforet' ? '#14532D' : data.contents.titleColor)"
      >
        {{ tab.name }}
      </div>
      <div
        v-else
        class="subhead-2-b w-fit rounded-[18px] border border-rgray-100 bg-white px-4 py-2 md:cursor-pointer"
        :style="setTextColor(appStore().getDomain == 'greenforet' ? '#003026' : data.contents.titleColor)"
      >
        {{ tab.name }}
      </div>
    </div>
  </div>
  <div id="resaleIntroSection" class="bg-white px-10 pb-6 pt-6">
    <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">{{ data.contents.tag }}</p>
    <h2 class="display-2-b mt-2 whitespace-pre-line" :style="setTextColor(data.contents.titleColor)">{{ data.contents.title }}</h2>
    <template v-if="appStore().getDomain === 'orm'">
      <ul class="subhead-2-b ml-[14px] mt-4 list-disc" :style="setTextColor(data.contents.bodyColor)">
        <li>{{ data.contents.body.split('@')[0] }}</li>
        <li>{{ data.contents.body.split('@')[1] }}</li>
        <li>{{ data.contents.body.split('@')[2] }}</li>
      </ul>
    </template>
    <template v-else>
      <p class="body-2-r mt-2 whitespace-pre-line" :style="setTextColor(data.contents.bodyColor)">{{ data.contents.body }}</p>
    </template>
  </div>
  <div v-if="data.contents?.sellPreview" class="sellPreviewSwiper mt-2 bg-rgray-50 py-8">
    <h3 class="headline-b mb-6 flex items-center gap-2 px-10" :style="setTextColor(data.contents.titleColor)"><img src="/icons/global/ic-point.svg" />{{ data.contents?.sellPreview.title }}</h3>
    <Swiper
      :slides-per-view="1.13"
      :slides-offset-before="40"
      :space-between="17"
      :modules="[SwiperPagination]"
      :pagination="{
        type: 'bullets',
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active'
      }"
      :style="{ paddingRight: '40px' }"
    >
      <SwiperSlide v-for="(group, index) in setPreviewItemsOrder" :key="index">
        <div class="grid max-w-[294px] grid-cols-2 gap-x-0.5 gap-y-6">
          <div v-for="item in group" :key="item.index" class="w-[146px]">
            <div class="h-30 w-full overflow-hidden bg-white">
              <NuxtImg :src="item.thumbnail" class="object-contain" />
            </div>
            <div class="flex items-center justify-between bg-caribbean-green-300 px-3 py-1.5">
              <span class="subhead-2-b">{{ item.points }}</span>
              <span class="caption-2-b">{{ item.pointsText }}</span>
            </div>
            <div class="mt-2">
              <p class="label-2-r break-keep">
                <strong class="caption-2-b pr-0.5">{{ item.brand }}</strong>
                {{ item.name }}
              </p>
              <p class="label-2-r text-rgray-600">{{ item.year }}년도 출시</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
  <div
    v-if="data.contents.isBrandList === 'true' || data.contents.isBrandList === true"
    class="px-10 pb-10 pt-15"
    :class="appStore().getDomain === 'orm' ? 'mt-0' : 'mt-6'"
    :style="{ backgroundColor: data.contents.brandListBgColor }"
  >
    <div class="mb-6 flex items-center space-x-2">
      <h3 class="display-1-b text-white">판매 가능 브랜드</h3>
      <p class="badge-h22-r11-line-p8 !border-green-200 !text-caribbean-green-200">{{ data.contents.brandList.length }} Brand +</p>
    </div>

    <hr class="w-full border border-white" />
    <div class="mt-10 grid grid-cols-2 content-center items-center justify-between gap-x-10 gap-y-10 last:items-center">
      <div
        v-for="(brand, index) in data.contents.brandList"
        :key="index"
        class="flex shrink-0 items-center justify-center"
        :class="{ 'col-span-2': data.contents.brandList.length % 2 === 1 && index === data.contents.brandList.length - 1 }"
      >
        <NuxtImg :alt="brand.brandName" :src="brand.brandImgUrl" class="h-10" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 인트로 및 스티키 헤더 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
// 스크롤에 맞춰서 자동으로 헤더 탭바의 active상태를 변경합니다.
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

let scrollHandler

const tabList = reactive([
  {
    name: appStore().getDomain === 'greenforet' ? '리셀소개' : '판매소개',
    code: 'resaleIntroSection'
  },
  {
    name: '신청과정',
    code: 'resaleUsageSection'
  },
  {
    name: '판매 가능 조건',
    code: 'resaleNoticeSection'
  }
])

const selectedTab = ref({
  name: appStore().getDomain === 'greenforet' ? '리셀소개' : '판매소개',
  code: 'resaleIntroSection'
})

/**
 * 스크롤에 맞춰서 헤더 탭바의 active상태를 변경합니다.
 */
const onSetScroll = () => {
  const first = document.getElementById('resaleIntroSection')
  const second = document.getElementById('resaleUsageSection')
  const third = document.getElementById('resaleNoticeSection')
  scrollHandler = () => {
    if (first.getBoundingClientRect().top < 110) {
      selectedTab.value = {
        name: appStore().getDomain === 'greenforet' ? '리셀소개' : '판매소개',
        code: 'resaleIntroSection'
      }
    }
    if (second.getBoundingClientRect().top < 110) {
      selectedTab.value = {
        name: '이용방법',
        code: 'resaleUsageSection'
      }
    }
    if (third.getBoundingClientRect().top < 110) {
      selectedTab.value = {
        name: '판매조건안내',
        code: 'resaleNoticeSection'
      }
    }
  }

  window.addEventListener('scroll', scrollHandler)
}

const onUpdateTab = (tab) => {
  const el = document.getElementById(tab.code).getBoundingClientRect()
  window.scrollTo({
    top: window.pageYOffset + el.top - 90,
    left: 0,
    behavior: 'smooth'
  })
}

const setTextColor = (color) => {
  return {
    color
  }
}

const setBorderAndBgColor = (color) => {
  return {
    borderColor: color,
    backgroundColor: color
  }
}

/**
 * 배열을 원하는 크기로 나누는 함수
 */
const chunk = (data = [], size = 1) => {
  const array = []

  for (let i = 0; i < data.length; i += size) {
    array.push(data.slice(i, i + size))
  }

  return array
}

/**
 * 판매 보상포인트 미리보기 - 데이터와 디자인을 맞추기위해 4개의 그룹으로 배열 가공
 */
const setPreviewItemsOrder = computed(() => {
  const chunkArray = chunk(props.data.contents.sellPreview.previewItems, 4)

  return chunkArray
})

onMounted(() => {
  onSetScroll()
})

onActivated(() => {
  onSetScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<style>
.sellPreviewSwiper > .swiper > .swiper-pagination-bullets {
  position: static;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding-left: 40px;
}
.sellPreviewSwiper > .swiper > .swiper-pagination-bullets > .swiper-pagination-bullet {
  background-color: #d1d1d1 !important;
  opacity: 1 !important;
}
.sellPreviewSwiper > .swiper > .swiper-pagination-bullets > .swiper-pagination-bullet-active {
  background-color: #222222 !important;
}
</style>
