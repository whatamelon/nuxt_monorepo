<template>
  <div class="bg-white px-5 py-10">
    <div v-if="appStore().getSellType == 'sncode'">
      <svg v-if="data.contents.isImg == false" class="mx-auto mb-10" xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
        <rect width="80" height="80" transform="translate(0.5)" fill="#222222" />
        <path d="M21.5 40L34.5 53L60.5 27" stroke="white" stroke-width="8" />
      </svg>

      <h2 class="display-1-b whitespace-pre-line break-keep" :style="setTextColor(data.contents.titleColor)">
        <template v-if="appStore().getDomain === 'orm'">
          <p>{{ data.contents.title.split('_')[0] }}</p>
          <span>{{ formatKoreanDate(preDate) }}</span>
          <span>{{ data.contents.title.split('_')[1] }}</span>
        </template>
        <template v-else>
          {{ data.contents.title }}
        </template>
      </h2>
      <p class="body-2-r mt-4 whitespace-pre-line break-keep" :style="setTextColor(data.contents.bodyColor)">{{ data.contents.body }}</p>

      <img v-if="data.contents.isImg == true" :src="data.contents.imgUrl" class="my-10 w-full" />

      <div v-if="data.contents.noticeTitle != ''" class="flex space-x-1 py-6 pl-4 pr-6" :style="{ backgroundColor: data.contents.noticeBgColor }">
        <i class="rb-info text-24xl text-black"></i>
        <div class="">
          <p class="subhead-3-b mb-1 break-keep" :style="setTextColor(data.contents.noticeTitleColor)">{{ data.contents.noticeTitle }}</p>
          <div class="break-keep" v-html="data.contents.noticeBodyCode"></div>
        </div>
      </div>
    </div>

    <div v-else>
      <h2 class="display-1-b break-keep" :style="setTextColor(data.contents.massiveInfo.titleColor)">
        <p>{{ data.contents.massiveInfo.title_pre }}</p>
        <!-- <span :style="setTextColor(data.contents.massiveInfo.countColor)">{{ massiveCount }} </span> -->
        <p class="whitespace-pre-line">{{ data.contents.massiveInfo.title_post }}</p>
      </h2>

      <div class="mt-4 break-keep" v-html="data.contents.massiveInfo.body"></div>

      <img :src="data.contents.massiveInfo.imgUrl" class="mt-10 w-full" />
    </div>

    <div id="bottomFixedButton" class="fixed bottom-0 left-0 flex w-full space-x-1 bg-white px-5 pb-2 pt-2 ios-safe-area md:left-auto md:-ml-5 md:max-w-pc" style="z-index: 998">
      <button class="btn-h56-r28-line-wfull" @click="goToList">{{ data.contents.resaleListText }}</button>
      <button class="btn-h56-r28-fill-wfull" @click="goToHome">홈으로</button>
    </div>
  </div>
</template>

<script setup>
// 판매신청하기 페이지 내의 5단계인 완료 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
import * as amplitude from '@amplitude/analytics-browser'

defineProps({
  data: {
    type: Object,
    required: true
  },
  massiveCount: {
    type: Number,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  preDate: {
    type: String,
    required: true
  }
})

const router = useRouter()
const piniaAppStore = appStore()

const setTextColor = (color) => {
  return {
    color
  }
}

const goToList = () => {
  router.replace('/my/sell')
}

const goToHome = () => {
  amplitude.track('goHome_click')
  router.replace('/')
}

onMounted(() => {
  if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfcompleteTrade_pv')
  else amplitude.track('blcompleteTrade_pv')

  // amplitude.track('completeTrade_pv',{
  //     proIDFin:idList,
  //     credit: priceTotal
  // });
  if (piniaAppStore.getDomain === 'orm') fbq('trackCustom', 'completeTrade_pv_fb')
})
</script>
