<template>
  <div class="overflow-y-scroll bg-white px-5 pb-52 pt-10 no-scroll">
    <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">{{ data.contents.tag }}</p>
    <h2 class="display-1-b my-4 whitespace-pre-line" :style="setTextColor(data.contents.titleColor)">{{ data.contents.title }}</h2>

    <div class="mt-10 bg-rgray-50 px-6 py-10">
      <!-- user info -->
      <p class="subhead-3-b text-black">{{ data.contents.userInfoTitle }}</p>
      <hr class="mb-6 mt-4 border-rgray-400" />

      <div class="space-y-6">
        <div class="flex space-x-4">
          <p class="body-1-r w-20 text-black">고객명</p>
          <p class="subhead-2-b w-[calc(100%-80px)] text-black">{{ data.data.userInfo.name }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="body-1-r w-20 text-black">전화번호</p>
          <p class="subhead-2-b w-[calc(100%-80px)] text-black">{{ formatPhone(data.data.userInfo.telNo) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="body-1-r w-20 text-black">수거 주소</p>
          <p class="subhead-2-b w-[calc(100%-80px)] text-black">({{ data.data.address.addrCode }}) {{ data.data.address.addr0 }} {{ data.data.address.addr1 }}</p>
        </div>
      </div>

      <!-- itemList or count -->
      <div class="mt-16 flex justify-between">
        <p v-if="piniaAppStore.getSellType == 'massive'" class="subhead-3-b my-auto text-black">판매수량</p>
        <p v-else class="subhead-3-b my-auto text-black">{{ data.contents.itemInfoTitle }}</p>
        <div v-if="piniaAppStore.getSellType == 'massive'" class="headline-b flex">
          <p class="mr-1 text-black">{{ data.contents.itemInfoSubtitleMassive.split('_')[0] }}</p>
          <p class="text-caribbean-green-600">{{ data.data.massiveCount }}</p>
          <p class="text-black">{{ data.contents.itemInfoSubtitleMassive.split('_')[1] }}</p>
        </div>
      </div>
      <hr class="mb-6 mt-4 border-rgray-400" />

      <div v-if="piniaAppStore.getSellType == 'sncode'" class="space-y-6">
        <div v-for="(item, index) in itemListResalable" :key="index" class="flex w-full justify-between space-x-4">
          <p class="body-1-r line-clamp-1 text-black">{{ item.itemName }}</p>
          <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.credit) }}P</p>
        </div>
        <div class="flex justify-between">
          <p v-if="appStore().getDomain === 'orm'" class="subhead-3-b my-auto text-black">
            {{ data.contents.finalExpectedPointTitle.split('_')[0] }} <span class="text-green-600">{{ itemListResalable.length }}</span> {{ data.contents.finalExpectedPointTitle.split('_')[1] }}
          </p>
          <p v-else class="subhead-3-b my-auto text-black">{{ data.contents.finalExpectedPointTitle }}</p>
          <p class="headline-b text-caribbean-green-600">{{ formatWonNoBlank(allPointFinal) }} P</p>
        </div>
      </div>
    </div>

    <div id="bottomFixedButton" class="fixed bottom-0 left-0 flex w-full space-x-1 bg-white px-5 pt-2 ios-safe-area md:left-auto md:-ml-5 md:max-w-pc" style="z-index: 998">
      <button class="btn-h56-r28-line-wfull" @click="goToPrevious">이전</button>
      <button class="btn-h56-r28-fill-wfull" @click="onCheckBrandAuth">판매 신청 완료</button>
    </div>

    <AppSpinnerDim :is-open="isOpenDimSpinner"></AppSpinnerDim>
  </div>
  <PartMyBrandAuthDialog :dialog-open="isOpenBrandAuth" @success-dialog="goToNext" @close-dialog="onCloseBrandAuthDialog" />
</template>

<script setup>
// 판매신청하기 페이지 내의 4단계인 판매신청서 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 소량 판매신청은, 신청한 상품리스트를 띄워줍니다.
// 대량 판매신청은, 신청한 상품갯수를 띄워줍니다.
import * as amplitude from '@amplitude/analytics-browser'
import { applyResaleSmallAPI, applyResaleBigAPI } from '~/composables/apiFactories/sell'
import { certifyUserBrandAuthAPI, getUserInfoAPI } from '~/composables/apiFactories/user'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  sncodeList: {
    type: Array,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  isOpenBrandAuth: {
    type: Boolean,
    required: true
  }
})

const piniaAppStore = appStore()
const emit = defineEmits(['goToPrev', 'goToNext', 'setPreDate', 'openBrandAuth'])

const isOpenDimSpinner = ref(false)

/** itemList중 판매가능제품만 return */
const itemListResalable = computed(() => {
  // 새로 추가한 건의 경우 isResalable이 없어서 undefined가 나옴. 이런 경우를 위해 조건문 !== false로 처리
  return props.sncodeList.filter((item) => item.isResalable !== false)
})

/** 판매가능 제품들의 포인트 합 return */
const allPointFinal = computed(() => {
  return itemListResalable.value.reduce((prev, cur) => prev + parseInt(cur.credit, 10), 0)
})

const goToPrevious = () => {
  emit('goToPrev', props.step)
}

const setTextColor = (color) => {
  return {
    color
  }
}

const handleOpenBrandAuth = (value) => {
  emit('openBrandAuth', value)
}

/** 브랜드몰 인증 */
const brandAuthHandler = async () => {
  const cubaObj = await certifyUserBrandAuthAPI()
  if (cubaObj.error.value != null) {
    useRetryError(cubaObj.error.value.data.statusCode, cubaObj.execute)
  } else if (cubaObj.data.value.statusCode === 200) {
    if (cubaObj.data.value.data.status === 'GOOD') {
      appStore().setDialogDTO({
        message: '인증에 성공했습니다!\n판매 신청하고 보상 포인트를 받아보세요!',
        timeout: 4
      })
      onCloseBrandAuthDialog()
      return
    }
    if (cubaObj.data.value.data.status === 'HOLD') {
      appStore().setDialogDTO({
        message: '휴면 회원입니다.\n브랜드몰에서 휴면 해지 후, 다시 시도해 주세요.',
        timeout: 4
      })
    }
    if (cubaObj.data.value.data.status === 'MANY') {
      appStore().setDialogDTO({
        message: '브랜드몰 계정이 여러개입니다. 고객센터에 문의해주세요.',
        timeout: 4
      })
    }
    if (cubaObj.data.value.data.status === 'NONE') {
      appStore().setDialogDTO({
        message: '인증에 실패했습니다.\n브랜드몰 회원가입 후, 다시 시도해 주세요.',
        timeout: 4
      })
    }
    // 브랜드몰 인증 dialog 오픈.
    handleOpenBrandAuth(true)
  } else {
    appStore().setDialogDTO({
      message: '브랜드몰 회원인증에 실패했습니다.',
      timeout: 4
    })
    // 브랜드몰 인증 dialog 오픈.
    handleOpenBrandAuth(true)
  }
}

/** close 브랜드 인증 dialog */
const onCloseBrandAuthDialog = () => {
  handleOpenBrandAuth(false)
}

/** 브랜드 인증 되어있는지 확인 */
const onCheckBrandAuth = async () => {
  const userInfoObj = await getUserInfoAPI()
  if (userInfoObj.error.value !== null || userInfoObj.data.value === null) {
    if (userInfoObj.error.value.data) {
      useRetryError(userInfoObj.error.value.data.statusCode, userInfoObj.execute)
    }
  }

  if (!userInfoObj.data.value.data.buidAuthFlag) {
    brandAuthHandler()
  } else {
    goToNext()
  }
}

/** 브랜드 인증 되었으면 판매 신청 완료. */
const goToNext = async () => {
  onCloseBrandAuthDialog()
  amplitude.track('getPoint_click')
  if (piniaAppStore.getSellType === 'massive') {
    // 대형
    isOpenDimSpinner.value = true
    const abObj = await applyResaleBigAPI({
      count: props.data.data.massiveCount
    })
    if (abObj.error.value != null) {
      appStore().setDialogDTO({
        message: '판매 신청에 실패했습니다. 재시도 시 동일한 문제가 발생한다면 고객센터로 연락주시기 바랍니다.',
        timeout: 3
      })
      useRetryError(abObj.error.value.data.statusCode, abObj.execute)
    } else if (abObj.data.value.statusCode === 200) {
      amplitude.track('completeTrade_pv', { count: props.data.data.massiveCount })
      emit('goToNext', props.step)
    } else {
      appStore().setDialogDTO({
        message: '판매 신청에 실패했습니다. 재시도 시 동일한 문제가 발생한다면 고객센터로 연락주시기 바랍니다.',
        timeout: 3
      })
    }
    isOpenDimSpinner.value = false
  } else {
    // 소형

    amplitude.track('completeTrade_pv', {
      proIDFin: itemListResalable.value.map((e) => {
        return e.snCode
      })
    })
    isOpenDimSpinner.value = true
    const asObj = await applyResaleSmallAPI({
      snCodes: itemListResalable.value.map((e) => {
        return e.snCode
      })
    })
    if (asObj.error.value != null) {
      appStore().setDialogDTO({
        message: '판매 신청에 실패했습니다.\n재시도 시 동일한 문제가 발생한다면 고객센터로 연락주시기 바랍니다.',
        timeout: 3
      })
      useRetryError(asObj.error.value.data.statusCode, asObj.execute)
    } else if (asObj.data.value.statusCode === 200) {
      userStore().setSellActionTotalPoints(0)
      emit('setPreDate', asObj.data.value.data.preDate)
      emit('goToNext', props.step)
    } else {
      appStore().setDialogDTO({
        message: '판매 신청에 실패했습니다. \n재시도 시 동일한 문제가 발생한다면 고객센터로 연락주시기 바랍니다.',
        timeout: 3
      })
    }
    isOpenDimSpinner.value = false
  }
}

onMounted(() => {
  if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfreceiptCheck_pv')
  else amplitude.track('blreceiptCheck_pv')
})
</script>
