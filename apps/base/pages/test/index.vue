<template>
  <div class="pb-12">
    <div v-if="error">
      <PartHomeSkeleton></PartHomeSkeleton>
    </div>
    <div v-else-if="pending">
      <PartHomeSkeleton></PartHomeSkeleton>
    </div>
    <div v-else-if="data">
      <PartHomeTopBanner :data="homeTopBannerData" />
      <PartHomeQuickBar :data="homeQuickBarData" />
      <PartHomeRecommendProductList v-if="recommendIdx > -1" :data="data.data?.pageComponents[recommendIdx]" />
      <PartHomeBrandList :data="homeBrandListData" />
      <div v-for="(homeComp, homeCompIdx) in data.data?.pageComponents" :key="homeCompIdx">
        <PartHomeEventProductList v-if="homeComp.template.type === 'HomeEventProductList'" :data="homeComp" />
      </div>
      <PartBuyReviewList :data="homeBuyReviewListData" />
    </div>
  </div>
</template>

<script setup>
import * as amplitude from '@amplitude/analytics-browser'
import homeTopBannerData from '../../assets/data/home/homeTopBannerData.json'
import homeQuickBarData from '../../assets/data/home/homeQuickBarData.json'
import homeBrandListData from '../../assets/data/home/homeBrandListData.json'
import homeBuyReviewListData from '../../assets/data/home/homeBuyReviewListData.json'
// 홈 페이지

definePageMeta({
  layout: 'test'
})

const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const recommendIdx = ref(-1)

// const { data, pending, error, execute } = await getHomeDataAPI();

const { data, pending, error } = await useAsyncData('data', () =>
  $fetch(`${config.public.baseURL}/v20/pages/homeTest`, {
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    }
  })
)
if (data.value?.statusCode === 200) {
  userStore().setGlobalUserInfo(data.value.userSession)
  recommendIdx.value = data.value.data.pageComponents.findIndex((item) => item.template.type === 'HomeRecommendProductList')
}

onMounted(async () => {
  appStore().setHeaderType({
    back: false,
    logo: true,
    title: '',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
  amplitude.track('landing_pv')
})

onActivated(() => {
  amplitude.track('landing_pv')

  appStore().setHeaderType({
    back: false,
    logo: true,
    title: '',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})
</script>
