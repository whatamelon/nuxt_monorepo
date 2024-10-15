<template>
  <div class="pb-12">
    <div v-if="error">
      <PartHomeSkeleton></PartHomeSkeleton>
    </div>
    <div v-else-if="pending">
      <PartHomeSkeleton></PartHomeSkeleton>
    </div>
    <div v-else>
      <template v-if="config.public.tempLms === 'true' && appStore().getDomain === 'orm'">
        <!-- LMS 분기 버전 -->
        <LazyPartHomeDialog :data="homeDialogData" />
        <LazyPartHomeTopBanner :data="homeTopBannerData" />
        <LazyPartHomeQuickBar :data="homeQuickBarData" />
        <LazyPartHomeRecommendProductList v-if="recommendIdx > -1" :data="data.data?.pageComponents[recommendIdx]" />
        <LazyPartHomeBrandList :data="homeBrandListData" />
        <div v-for="(homeComp, homeCompIdx) in data.data?.pageComponents" :key="homeCompIdx">
          <LazyPartHomeEventProductList v-if="homeComp.template.type === 'HomeEventProductList'" :data="homeComp" />
        </div>
        <LazyPartBuyReviewList :data="homeBuyReviewListData" />
      </template>
      <template v-else>
        <component
          :is="'LazyPart' + homeComp['template']['type']"
          v-for="(homeComp, homeCompIdx) in data.data.pageComponents"
          :key="homeCompIdx"
          :data="homeComp"
          :position="homeCompIdx"
          :before-home-comp-type="homeCompIdx == 0 ? '' : data.data.pageComponents[homeCompIdx - 1]['template']['type']"
          :next-home-comp-type="homeCompIdx == data.data.pageComponents.length - 1 ? '' : data.data.pageComponents[homeCompIdx + 1]['template']['type']"
        ></component>
      </template>
    </div>
  </div>
</template>

<script setup>
// LMS 분기 버전
import * as amplitude from '@amplitude/analytics-browser'
import homeDialogData from '../../assets/data/home/homeDialogData.json'
import homeTopBannerData from '../../assets/data/home/homeTopBannerData.json'
import homeQuickBarData from '../../assets/data/home/homeQuickBarData.json'
import homeBrandListData from '../../assets/data/home/homeBrandListData.json'
import homeBuyReviewListData from '../../assets/data/home/homeBuyReviewListData.json'
// 홈 페이지

const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const continueShopping = useContinueShopping()
continueShopping.value = '/'

// LMS 분기 버전
const recommendIdx = ref(-1)

// const { data, pending, error, execute } = await getHomeDataAPI();

const { data, pending, error } = await useAsyncData('data', () =>
  $fetch(`${config.public.baseURL}/v20/pages/home`, {
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    }
  })
)
if (data.value?.statusCode === 200) {
  userStore().setGlobalUserInfo(data.value.userSession)
  // LMS 분기 버전
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
