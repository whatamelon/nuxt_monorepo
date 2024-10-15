<template>
  <div>
    <PartResaleHomeIntro :data="resaleHomeIntroData" />
    <PartResaleHomeProgram :data="resaleHomeProgramData" />
    <PartResaleHomeReward :data="resaleHomeRewardData" />
    <PartResaleHomeReviewlist :data="resaleHomeReviewlistData" />
    <PartResaleHomeUsage :data="resaleHomeUsageData" />
    <PartResaleHomeNoticeBrandLittle :data="brandLittleData" />
    <PartResaleHomeChecklist :data="resaleHomeChecklistData" />
    <PartResaleHomeOutro :data="resaleHomeOutroData" />
    <PartResaleHomeButton :data="resaleHomeButtonData" />
  </div>
</template>

<script setup>
// 판매랜딩페이지
import * as amplitude from '@amplitude/analytics-browser'
import resaleHomeIntroData from '../../../assets/data/sell/resaleHomeIntroData.json'
import resaleHomeProgramData from '../../../assets/data/sell/resaleHomeProgramData.json'
import resaleHomeRewardData from '../../../assets/data/sell/resaleHomeRewardData.json'
import resaleHomeReviewlistData from '../../../assets/data/sell/resaleHomeReviewlistData.json'
import resaleHomeUsageData from '../../../assets/data/sell/resaleHomeUsageData.json'
import brandLittleData from '../../../assets/data/sell/brandLittleData.json'
import resaleHomeChecklistData from '../../../assets/data/sell/resaleHomeChecklistData.json'
import resaleHomeOutroData from '../../../assets/data/sell/resaleHomeOutroData.json'
import resaleHomeButtonData from '../../../assets/data/sell/resaleHomeButtonData.json'

definePageMeta({
  layout: 'test'
})

onMounted(() => {
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
})
onActivated(() => {
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
</script>
