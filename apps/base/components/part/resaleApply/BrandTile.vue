<template>
  <div class="bg-white pb-32 pt-10">
    <div class="px-5">
      <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">판매 가능 조건 확인</p>
      <h2 class="display-1-b mt-4 whitespace-pre-line" :style="setTextColor(data.contents.titleColor)">브랜드별 판매 가능한 제품 조건을 확인해 보세요.</h2>
    </div>

    <div id="sellNewAlphaSwiper" class="sticky top-14 mt-8 overflow-auto whitespace-nowrap bg-white py-2 transition-all no-scroll">
      <Swiper :slides-per-view="9.5" :space-between="4" :modules="[SwiperFreeMode]" :free-mode="true" :style="{ paddingLeft: '20px', paddingRight: '20px' }" @swiper="onSwiper">
        <SwiperSlide v-for="(alphabet, index) in alphabetList" :key="index">
          <button
            class="flex h-8 w-8 rounded-2xl border px-2 py-1 transition-all disabled:text-rgray-100"
            :class="{
              'border-black bg-black text-white': alphabet.code == selectedAlphabet,
              'border-rgray-100 bg-white text-black': alphabet.code != selectedAlphabet
            }"
            :disabled="!alphabet.ref"
            @click="onChangeSelectedAlphabet(alphabet)"
          >
            <div class="subhead-2-b flex w-4 items-center justify-center">
              {{ alphabet.code }}
            </div>
          </button>
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="mt-4 px-5">
      <div class="mb-2 border border-black" />
      <div class="flex flex-col">
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <section v-for="(brand, idx) in data.contents.checkTable" :id="brand.brandCode" :index="idx" class="pt-4">
          <div class="flex flex-row gap-6">
            <div class="flex basis-20 flex-col gap-0.5">
              <p class="caption-2-b">{{ brand.brandEngName }}</p>
              <p class="subhead-2-b text-rgray-600">{{ brand.brandName }}</p>
            </div>

            <div style="width: calc(100% - 80px)">
              <p class="subhead-2-b text-black">판매 가능 제품 종류</p>
              <div class="mt-1 space-y-2 bg-white text-black">
                <p v-if="brand.categoryBadgeText" class="body-1-r break-keep text-black">{{ brand.categoryBadgeText }}</p>
                <p v-if="brand.categoryBodyCode" class="break-keep" v-html="brand.categoryBodyCode"></p>
                <div v-if="brand.categoryList" class="flex flex-wrap gap-1">
                  <span v-for="(category, index) in brand.categoryList.split(',')" :key="index" class="body-1-r bg-rgray-50 px-1.5 py-0.5">{{ category }}</span>
                </div>
                <p v-if="brand.categoryCaptionText" class="body-1-r break-keep text-rgray-400">{{ brand.categoryCaptionText }}</p>
              </div>
              <div :class="brand.isDropdownOpen ? 'block' : 'hidden'">
                <div class="my-4 border-b border-rgray-100" />
                <p class="subhead-2-b text-black">판매 가능 제품 조건</p>
                <ul class="ml-6 mt-1 list-outside list-disc space-y-1">
                  <li v-for="(item, index) in brand.conditionList" :key="index" class="body-1-r break-keep text-black">
                    <div v-if="item == '오염이나 훼손, 구성품 분실이 없는 제품' || item == '오염의 정도나 사용감이 기준에 부합하는 제품 '">
                      <p>{{ item }} <button type="button" class="btn-h24-r0-line-p8 inline-block" @click="() => toggleImpossibleDialog(brand)">자세히 보기</button></p>
                    </div>
                    <p v-else v-html="item"></p>
                  </li>
                </ul>
                <div class="my-4 border-b border-rgray-100" />
                <p class="subhead-2-b text-black">판매 보상</p>
                <p class="body-long-1-r mt-1 break-keep bg-white text-black">{{ brand.rewardText }}</p>
              </div>
            </div>
          </div>
          <button type="button" class="subhead-2-b mt-4 flex w-full justify-center gap-1 border-b border-black pb-4 pt-2" @click="() => toggleDropDown(brand)">
            자세히 보기
            <i class="my-auto text-base" :class="brand.isDropdownOpen ? 'rb-arrow-up' : 'rb-arrow-down'"></i>
          </button>
        </section>
      </div>
    </div>

    <!-- impossible bottom sheet -->
    <AppModalBottomSheet :is-open="isImpossibleBottomSheetOpen" @update-open="toggleImpossibleDialog">
      <div class="max-h-[600px] overflow-y-auto px-5 pb-[64px]">
        <div class="flex space-x-1">
          <i class="rb-info-fill text-32xl text-black"></i>
          <p class="display-1-b text-black">{{ impossibleDialog.title }}</p>
        </div>

        <p class="body-2-r mt-4 text-rgray-600">{{ impossibleDialog.body }}</p>

        <div v-if="impossibleDialog.listType == 'list'" class="mb-6 space-y-4 divide-y divide-rgray-100">
          <div v-for="(item, index) in impossibleDialog.list" :key="index" class="flex space-x-2 pt-4">
            <img :src="item.imgUrl" class="h-22 w-22 object-cover" />
            <div class="p-1" style="width: calc(100% - 96px)">
              <p class="!caption-2-b badge-h18-r0-fill-p4-gray !text-black">{{ item.tag }}</p>
              <p class="subhead-2-b mt-2 break-keep text-black">{{ item.text }}</p>
            </div>
          </div>
        </div>

        <!-- listType: grid -->
        <div v-else class="my-6 space-y-10">
          <div v-for="(item, gridIdx) in impossibleDialog.list" :key="gridIdx" class="space-y-2">
            <p class="subhead-3-b">{{ item.tag }}</p>
            <div class="grid w-full gap-2" :class="item.type" :style="item.type === 'grid-cols-3' && 'grid-template-columns: repeat(3, minmax(0, 1fr))'">
              <div v-for="(listItem, listIdx) in item.listItem" :key="listIdx" class="space-y-2">
                <img :src="listItem.imgUrl" class="w-full" />
                <p class="subhead-2-b text-black">{{ listItem.text }}</p>
              </div>
            </div>
            <p v-if="item.warnText && item.warnText !== ''" class="body-long-2-r bg-rgray-50 px-4 py-2 text-[#222]">{{ item.warnText }}</p>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 w-full bg-white px-5 py-2">
          <button class="btn-h56-r28-fill-wfull" @click="toggleImpossibleDialog">네, 확인했어요!</button>
        </div>
      </div>
    </AppModalBottomSheet>

    <!-- dontworry bottom sheet -->
    <AppModalBottomSheet :is-open="isDontworryBottomSheetOpen" @update-open="toggleDontworryDialog">
      <div class="px-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none" class="mx-auto">
          <rect width="80" height="80" transform="translate(0.5)" fill="#E7E7E7" />
          <path d="M21.5 40L34.5 53L60.5 27" stroke="white" stroke-width="8" />
        </svg>

        <p class="display-1-b mt-6 whitespace-pre-line break-keep text-center text-black">{{ data.contents.dontworryBottomSheet.title }}</p>
        <div class="mt-6 w-full bg-rgray-50 p-4">
          <p class="body-2-r break-keep text-rgray-600">{{ data.contents.dontworryBottomSheet.body }}</p>
        </div>

        <div class="mt-10 w-full bg-white pt-2">
          <button class="btn-h56-r28-fill-wfull" @click="goToNext">네, 확인했어요!</button>
        </div>
      </div>
    </AppModalBottomSheet>

    <div id="bottomFixedButton" class="fixed bottom-0 left-0 w-full bg-white px-5 pt-2 transition-all ios-safe-area md:left-auto md:max-w-pc" style="z-index: 998">
      <button class="btn-h56-r28-fill-wfull" @click="toggleDontworryDialog">{{ data.contents.nextStepButtonText }}</button>
    </div>
  </div>
</template>

<script setup>
// 판매신청하기 페이지 내의 1단계인 브랜드 타일 컴포넌트입니다.
// 24.04.08 기준 OLO에서 사용중입니다.
// 모든 정보는 DB로부터 받아옵니다.
// 2가지 바텀시트 다이얼로그를 사용합니다.
// 1개는 판매 가능 조건에 대한 정보를 설명하는 ImpossibleBottomSheet 이고,
// 다른 1개는 무료반송이 가능함을 설명하는 DontworryBottomSheet 입니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { useThrottleFn, useScroll } from '@vueuse/core'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  step: {
    type: Number,
    required: true
  }
})

const device = useDevice()
const piniaAppStore = appStore()
const piniaUserStore = userStore()
const emit = defineEmits(['goToNext', 'openConfirmModal'])

// 상단 swiper의 alphabet List (= props.data.contents.brandList)
const alphabetList = ref()
const selectedAlphabet = ref(props.data.contents.brandList[0])

const impossibleDialog = ref()
const isImpossibleBottomSheetOpen = ref(false)
const isDontworryBottomSheetOpen = ref(false)

// scroll시 상단 swiper, bottom button 을 숨기기 위해 DOM 접근을 위한 변수
let alphaSwiper
let bottomNavi
// scroll handler
let scrollHandler
let scrollHandlerThrottle
// swiper에서 선택하여 스크롤 할 경우에는 swiper와 bottom button을 숨기지 않기 위한 변수
const isSelectedScrolled = ref(false)
// swiper 내장 method(slideTo)에 접근하기 위해 swiper DOM 받아오는 변수
const swiperRef = ref()
// vueuse 스크롤 감지
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

/** swiper 내장 method(slideTo)에 접근하기 위해 swiper DOM 받아오는 함수 */
const onSwiper = (swiper) => {
  swiperRef.value = swiper
}

/** 상단 swiper의 alphabet 선택 시 해당 브랜드가 있는 곳으로 스크롤하는 함수 */
const onChangeSelectedAlphabet = (brand) => {
  isSelectedScrolled.value = true
  const el = document.getElementById(brand.ref).getBoundingClientRect()
  window.scrollTo({
    top: window.pageYOffset + el.top - 100,
    left: 0,
    behavior: 'smooth'
  })
  setTimeout(() => {
    isSelectedScrolled.value = false
  }, 1000)
}

/** 판매 불가능한 상품 확인 bottom sheet 오픈 */
const toggleImpossibleDialog = (brand) => {
  if (brand) {
    const impossibleDialogIdx = props.data.contents.impossibleDialog.findIndex((e) => e.brandCode.includes(brand.brandCode))
    if (impossibleDialogIdx > -1) impossibleDialog.value = props.data.contents.impossibleDialog[impossibleDialogIdx]
    else impossibleDialog.value = props.data.contents.impossibleDialog[0]
  }
  isImpossibleBottomSheetOpen.value = !isImpossibleBottomSheetOpen.value
  if (device.isMobile) {
    if (isImpossibleBottomSheetOpen.value) {
      hideChannelButton()
    } else {
      showChannelButton()
    }
  }
}

const toggleDontworryDialog = () => {
  if (isDontworryBottomSheetOpen.value) {
    if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfcondBrand_policy')
    else amplitude.track('blcondBrand_policy')
  }
  isDontworryBottomSheetOpen.value = !isDontworryBottomSheetOpen.value
  if (device.isMobile) {
    if (isDontworryBottomSheetOpen.value) {
      hideChannelButton()
    } else {
      showChannelButton()
    }
  }
}

/** 자세히 보기 클릭 */
const toggleDropDown = (brand) => {
  if (!brand.isDropdownOpen) {
    // 자세히 보기 클릭 시 앰플리튜드 수집
    if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfcondBrand_click', { brand: brand.brandName })
    else amplitude.track('blcondBrand_click', { brand: brand.brandName })
  }
  brand.isDropdownOpen = !brand.isDropdownOpen
}

/** 스크롤을 올릴 때 하는 반응 */
const toTopScrollHandler = () => {
  alphaSwiper.style.transform = 'translateY(0)'
  bottomFixedButton.style.transform = 'translateY(0)'
  bottomNavi.style.transform = 'translateY(0)'
}

/**
 * 스크롤 이동에 따라 탭을 보여주거나 사라지게 조작
 */
const onCheckScroll = () => {
  // no throttling
  scrollHandler = () => {
    // 스크롤이 위치한 브랜드에 따라 알파벳 활성화 상태 변경
    props.data.contents.checkTable.forEach((brand) => {
      const el = document.getElementById(brand.brandCode).getBoundingClientRect()
      if (el.top < 104 && el.bottom > 0) {
        selectedAlphabet.value = brand.brandEngName[0].toUpperCase()
      }
    })
    // 활성화 된 알파벳으로 swiper 슬라이딩
    swiperRef.value.slideTo(alphabetList.value.findIndex((alphabetData) => alphabetData.code === selectedAlphabet.value))
  }

  // throttling
  scrollHandlerThrottle = useThrottleFn(() => {
    // safari에서 스크롤이 바운스될때 toBottom으로 되어서 탭이 안보이는 이슈때문에
    // 스크롤이 100 이하일때 탭이 보이도록
    if (y.value <= 300 || toTop.value) {
      toTopScrollHandler()
    }
    if (toBottom.value && y.value > 300 && !isSelectedScrolled.value) {
      alphaSwiper.style.transform = 'translateY(-100%)'
      bottomFixedButton.style.transform = 'translateY(100%)'
      bottomNavi.style.transform = 'translateY(100%)'
    }
  }, 200)

  window.addEventListener('scroll', scrollHandler)
  window.addEventListener('scroll', scrollHandlerThrottle)
}

const goToNext = () => {
  amplitude.track('condNext_click')
  toggleDontworryDialog()
  if (piniaUserStore.getSalesCnt !== 0) {
    emit('openConfirmModal', true)
  } else {
    emit('goToNext', props.step)
  }
}

const setTextColor = (color) => {
  return {
    color
  }
}

onMounted(() => {
  if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfcondCheck_pv')
  else amplitude.track('blcondCheck_pv')

  /**
   * 상단 swiper 알파벳 리스트 데이터 가공
   *
   * alphabetList = [
   *  {
   *    code: 'A',  //알파벳
   *    ref: 'ac'   //해당하는 브랜드코드
   *  },
   *  ...
   * ]
   */
  alphabetList.value = props.data.contents.brandList.map((brand) => {
    const alphabetData = {
      code: brand
    }
    alphabetData.ref = props.data.contents.checkTable.find((item) => {
      if (item.brandEngName[0].toUpperCase() === brand.toUpperCase()) return item
      return null
    })?.brandCode
    return alphabetData
  })

  if (process.client) {
    // DOM 접근
    bottomNavi = document.getElementById('bottomNavigation')
    alphaSwiper = document.getElementById('sellNewAlphaSwiper')
  }
  onCheckScroll()
})

onBeforeUnmount(() => {
  toTopScrollHandler()
  showChannelButton()
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('scroll', scrollHandlerThrottle)
})
</script>
