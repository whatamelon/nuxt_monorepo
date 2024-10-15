<template>
  <div id="bottomFixedButton" class="fixed bottom-0 flex w-full gap-4 bg-white px-5 py-2 transition ios-safe-area md:max-w-pc" style="z-index: 999">
    <div class="my-2 flex gap-2">
      <button type="button" class="flex items-center" @click.stop.prevent="clickHeart">
        <i class="p-1.5 text-28xl" :class="heartFlag ? 'rb-heart-fill' : 'rb-heart'" />
      </button>
      <button v-if="appStore().getDomain === 'orm'" type="button" class="flex w-6 items-center justify-center" @click="handleShareModal">
        <NuxtImg width="24px" height="24px" src="/icons/global/ic-share.svg" />
      </button>
    </div>
    <div class="flex" style="width: calc(100% - 60px)">
      <button class="btn-h56-r28-fill-wfull my-auto" @click="clickOrder">주문하기</button>
    </div>
  </div>
  <AppModalBasicDialog :is-open="isOpenShareModal" @on-close="handleShareModal">
    <div class="flex flex-col gap-6">
      <h3 class="display-1-b">공유하기</h3>
      <div class="flex flex-col items-center gap-4 bg-rgray-50 px-5 py-6">
        <NuxtImg width="80px" :src="prodDTO.imgs[0]" />
        <div>
          <p class="body-1-r text-rgray-600">{{ prodDTO.brandSubName }}</p>
          <p class="subhead-3-b">{{ prodDTO.name }}</p>
        </div>
      </div>
      <div>
        <button id="kakaotalk-sharing-btn" type="button" class="flex w-full items-center justify-between border-b border-rgray-50 py-4" @click="onShareProductKakao">
          <p class="flex items-center gap-2"><NuxtImg width="32px" height="32px" src="/icons/global/ic-kakao.svg" /><span class="subhead-2-b">카카오톡 공유</span></p>
          <i class="rb-arrow-right p-1 text-base" />
        </button>
        <button id="link-sharing-btn" type="button" class="flex w-full items-center justify-between py-4" @click="onShareProductLink">
          <p class="flex items-center gap-2"><NuxtImg width="32px" height="32px" src="/icons/global/ic-link.svg" /><span class="subhead-2-b">링크 공유</span></p>
          <i class="rb-arrow-right p-1 text-base" />
        </button>
      </div>
    </div>
  </AppModalBasicDialog>
</template>

<script setup>
// 상품상세페이지에서 하단에 고정된 찜, 주문하기 버튼이 있는 컴포넌트입니다.
// 모든 동작은 부모페이지로 갑니다.
import * as amplitude from '@amplitude/analytics-browser'
import { showChannelButton, hideChannelButton } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  heartFlag: {
    type: Boolean,
    required: true
  },
  prodDTO: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['clickHeart', 'clickOrder'])

const clickHeart = () => {
  emit('clickHeart', 'button')
}

const clickOrder = () => {
  emit('clickOrder')
}

const isOpenShareModal = ref(false)

/**
 * 공유모달 핸들러
 * - open : 채널톡 버튼 숨김 및 amplitude 지표 수집
 * - close : 채널톡 버튼 살림
 */
const handleShareModal = () => {
  if (!isOpenShareModal.value) {
    amplitude.track('itemdetail_share')
    hideChannelButton()
  } else {
    showChannelButton()
  }

  isOpenShareModal.value = !isOpenShareModal.value
}

/** 카카오톡 공유 버튼 클릭 이벤트 */
const onShareProductKakao = () => {
  amplitude.track('itemdetail_share', {
    sharetype: 'kakao'
  })
}

/** 링크 공유 버튼 클릭 이벤트 */
const onShareProductLink = () => {
  amplitude.track('itemdetail_share', {
    sharetype: 'url'
  })
  document.execCommand('copy')
  appStore().setDialogDTO({
    message: '링크가 복사됐어요. 필요한 곳에 붙여넣기 하세요!',
    timeout: 3
  })
}

/**
 * 현재 페이지 url을 복사
 * @param event
 */
const copyCurrentUrl = (event) => {
  event.clipboardData.setData('text/plain', window.location.href)
  event.preventDefault()
}

onMounted(() => {
  document.addEventListener('copy', copyCurrentUrl)

  // 카카오 공유하기 API (내부에서 클릭 이벤트를 등록한다고 합니다.)
  // https://devtalk.kakao.com/t/topic/115643
  Kakao.Share.createCustomButton({
    container: '#kakaotalk-sharing-btn',
    templateId: 112802,
    templateArgs: {
      product_name: props.prodDTO.name,
      regular_price: props.prodDTO.priceOrg,
      discount_rate: props.prodDTO.priceLowRate,
      discount_price: props.prodDTO.priceLow,
      product_image: props.prodDTO.imgThumbLink ?? props.prodDTO.imgs[0],
      product_id: props.prodDTO.prodId
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('copy', copyCurrentUrl)
})
</script>
