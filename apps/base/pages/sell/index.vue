<template>
  <div>
    <template v-if="config.public.tempLms === 'true' && appStore().getDomain === 'orm'">
      <!-- LMS 분기버전 -->
      <PartResaleHomeIntro :data="resaleHomeIntroData" />
      <PartResaleHomeProgram :data="resaleHomeProgramData" />
      <PartResaleHomeReward :data="resaleHomeRewardData" />
      <PartResaleHomeReviewlist :data="resaleHomeReviewlistData" />
      <PartResaleHomeUsage :data="resaleHomeUsageData" />
      <PartResaleHomeNoticeBrandLittle :data="brandLittleData" />
      <PartResaleHomeChecklist :data="resaleHomeChecklistData" />
      <PartResaleHomeOutro :data="resaleHomeOutroData" />
      <PartResaleHomeButton :data="resaleHomeButtonData" />
    </template>
    <template v-else>
      <div v-if="data" class="relative">
        <component :is="'Part' + formatCompname(sellComp['template'])" v-for="sellComp in data.data.pageComponents" :key="sellComp" :data="sellComp"></component>
      </div>
    </template>
  </div>
</template>

<script setup>
// LMS 분기 버전
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { useThrottleFn, useScroll } from '@vueuse/core'
import resaleHomeIntroData from '../../../assets/data/sell/resaleHomeIntroData.json'
import resaleHomeProgramData from '../../../assets/data/sell/resaleHomeProgramData.json'
import resaleHomeRewardData from '../../../assets/data/sell/resaleHomeRewardData.json'
import resaleHomeReviewlistData from '../../../assets/data/sell/resaleHomeReviewlistData.json'
import resaleHomeUsageData from '../../../assets/data/sell/resaleHomeUsageData.json'
import brandLittleData from '../../../assets/data/sell/brandLittleData.json'
import resaleHomeChecklistData from '../../../assets/data/sell/resaleHomeChecklistData.json'
import resaleHomeOutroData from '../../../assets/data/sell/resaleHomeOutroData.json'
import resaleHomeButtonData from '../../../assets/data/sell/resaleHomeButtonData.json'

// 판매랜딩페이지
import { getResalePageAPI } from '~/composables/apiFactories/sell'

const config = useRuntimeConfig()

let scrollDirectionHandler
let bottomNavi
let buttomButton
const { directions, y } = useScroll(document)
const { top: toTop, bottom: toBottom } = toRefs(directions)

// LMS 분기 버전
const data = ref()

if (config.public.tempLms === 'false' || (config.public.tempLms === 'true' && appStore().getDomain !== 'orm')) {
  const { data: resalePage, error, execute } = await getResalePageAPI()
  if (error.value != null) {
    useRetryError(error.value.data.statusCode, execute)
  } else {
    data.value = resalePage.value
  }
}

// 기존 버전
// const { data, error, execute } = await getResalePageAPI()
// if (error.value != null) {
//   useRetryError(error.value.data.statusCode, execute)
// }

const toTopScrollHandler = () => {
  showChannelButton()
  bottomNavi.style.transform = 'translateY(0)'
  if (buttomButton.classList.contains('translate-y-[60px]')) {
    buttomButton.classList.remove('translate-y-[60px]')
  }

  if (!buttomButton.classList.contains('translate-y-0')) {
    buttomButton.classList.add('translate-y-0')
  }
}

const onCheckScroll = () => {
  scrollDirectionHandler = useThrottleFn(() => {
    // safari에서 스크롤이 바운스될때 toBottom으로 되어서 탭이 안보이는 이슈때문에
    // 스크롤이 100 이하일때 탭이 보이도록
    if (y.value <= 100 || toTop.value) {
      toTopScrollHandler()
    }
    if (toBottom.value && y.value > 100) {
      hideChannelButton()
      bottomNavi.style.transform = 'translateY(100%)'
      if (buttomButton.classList.contains('translate-y-0')) {
        buttomButton.classList.remove('translate-y-0')
      }

      if (!buttomButton.classList.contains('translate-y-[60px]')) {
        buttomButton.classList.add('translate-y-[60px]')
      }
    }
  }, 200)

  window.addEventListener('scroll', scrollDirectionHandler)
}

onMounted(() => {
  showChannelButton()
  amplitude.track('sell_pv')

  appStore().setHeaderType({
    back: true,
    logo: false,
    title: appStore().getDomain === 'greenforet' ? '리셀하기' : '판매하기',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })

  if (process.client) {
    bottomNavi = document.getElementById('bottomNavigation')
    buttomButton = document.getElementById('resaleBottomButton')
  }
  onCheckScroll()
})

onActivated(() => {
  showChannelButton()
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: appStore().getDomain === 'greenforet' ? '리셀하기' : '판매하기',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})

onBeforeRouteLeave(() => {
  toTopScrollHandler()
  window.removeEventListener('scroll', scrollDirectionHandler)
})
</script>
