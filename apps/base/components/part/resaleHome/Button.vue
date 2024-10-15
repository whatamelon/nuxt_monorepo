<template>
  <button
    id="resaleBottomButton"
    :style="{ backgroundColor: data.contents.bgColor, color: data.contents.buttonTextColor }"
    style="bottom: calc(env(safe-area-inset-bottom) + 84px)"
    class="subhead-3-b fixed bottom-[84px] left-1/2 z-[997] h-14 -translate-x-1/2 rounded-3.5xl px-15 text-white transition xl:left-[calc(50%+85px)] xl:-translate-x-0"
    @click="goToResale"
  >
    <p class="w-20">{{ data.contents.buttonText }}</p>
  </button>

  <AppModalBottomSheet :is-open="isMultipleOpen" @update-open="toggleOpenDialogHandler">
    <div class="w-full space-y-6 divide-y divide-rgray-100 px-5 pb-6 md:max-w-pc">
      <div v-for="(item, index) in data.contents.resaleList" :key="index" class="flex justify-between pt-6 md:cursor-pointer" @click="() => onSelectResaleType(item)">
        <div class="flex space-x-2">
          <div class="relative h-12 w-12 rounded-full bg-black p-2">
            <div v-html="item.icon"></div>
            <div
              v-if="index == 0 && user.getLoginState == true && user.getUserAction.isInSellSmall == true && user.getSellActionTotalPoints > 0"
              class="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-white"
            >
              <div class="absolute right-[2px] top-[2px] h-2 w-2 rounded-full bg-orange-500"></div>
            </div>
            <div v-if="index == 1 && user.getLoginState == true && user.getUserAction.isInSellBig == true" class="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-white">
              <div class="absolute right-[2px] top-[2px] h-2 w-2 rounded-full bg-orange-500"></div>
            </div>
          </div>

          <div>
            <div class="flex space-x-2">
              <p class="subhead-3-b text-black">{{ item.title }}</p>
              <p class="caption-2-b rounded-[11px] border border-rgray-200 bg-white px-2 py-0.5 text-black">{{ item.badgeText }}</p>
              <p
                v-if="index == 0 && user.getLoginState == true && user.getUserAction.isInSellSmall == true && user.getSellActionTotalPoints > 0"
                class="caption-2-b rounded bg-caribbean-green-300 px-1.5 py-0.5 text-black"
              >
                {{ formatWon(user.getSellActionTotalPoints) }}P 보상 예정!
              </p>
              <p v-if="index == 1 && user.getLoginState == true && user.getUserAction.isInSellBig == true" class="caption-2-b rounded bg-caribbean-green-300 px-1.5 py-0.5 text-black">
                거의 다 끝나가요!
              </p>
            </div>
            <p class="body-1-r mt-2 text-rgray-600">{{ item.body }}</p>
          </div>
        </div>

        <i class="rb-arrow-right my-auto text-base text-black"></i>
      </div>
    </div>

    <div class="w-full bg-white px-5 py-2">
      <button class="btn-h56-r28-fill-wfull bg-rgray-50 text-black" @click="toggleOpenDialogHandler">이전</button>
    </div>
  </AppModalBottomSheet>
</template>

<script setup>
// 판매랜딩페이지에서 판매신청하기 버튼 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
// isMultiple 값을 기준으로 바텀시트를 띄울지 결정합니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const user = userStore()
const router = useRouter()
const piniaAppStore = appStore()

const isMultipleOpen = ref(false)

/** 소량/대량 나뉜 경우 => 판매 신청 dialog 토글 */
const toggleOpenDialogHandler = () => {
  isMultipleOpen.value = !isMultipleOpen.value
  if (isMultipleOpen.value) {
    hideChannelButton()
  } else {
    amplitude.track('startTrade_click', { located: 'floating' })
    showChannelButton()
  }
}

/** 소량/대량 나뉜 경우 => 판매 신청 페이지로 이동 */
const onSelectResaleType = (item) => {
  if (item.title === '소량 판매') {
    amplitude.track('choicehfTrade_click', { located: '소량 판매' })
    piniaAppStore.setSellType('sncode')
  } else {
    amplitude.track('choiceblTrade_click', { located: '대량 판매' })
    piniaAppStore.setSellType('massive')
  }
  router.push('/sell/new')
}

/**
 * - 판매 하나밖에 없는 경우 => 판매 신청 페이지로 이동
 * - 소량/대량 나뉘는 경우 => 판매 신청 dialog 열기
 */
const goToResale = () => {
  amplitude.track('startTrade_click', { located: 'floating' })
  if (props.data.contents.isMultiple) {
    toggleOpenDialogHandler()
  } else {
    piniaAppStore.setSellType('sncode')
    router.push('/sell/new')
  }
}
</script>
