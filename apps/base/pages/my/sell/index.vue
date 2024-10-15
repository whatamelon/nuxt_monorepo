<template>
  <div class="bg-white">
    <div class="px-5 py-10">
      <div v-if="list.length == 0" class="my-9">
        <p class="body-2-r text-center text-black">판매내역이 없습니다.</p>
        <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
      </div>

      <div v-else class="my-10 space-y-16 first:mt-0">
        <div v-for="ipu in list" :key="ipu">
          <PartMyResaleItem
            :ipu="ipu"
            @cancel="onOpenCancel"
            @tracking-ship="trackingShipHandler"
            @pick="onOpenPick"
            @write-review="onOpenReview(ipu)"
            @detail="goToDetail"
            @fail-msg="onOpenFailMsgDialog"
          ></PartMyResaleItem>
        </div>
      </div>
    </div>

    <PartReviewDialog
      :is-review-dialog-open="isReviewDialogOpen"
      :id-for-register="reviewIpuId"
      :sp-list="[]"
      :text-review-point-pre="textReviewPointPre"
      :image-review-point-pre="0"
      :review-type="'sell'"
      @toggle-review-diaglog="toggleReviewDialogHandler"
      @register-review="onRegisterReview"
    ></PartReviewDialog>

    <PartMyResaleFailMsgDialog :ipu-fail-msg="ipuFailMsg" :is-ipu-fail-msg-dialog-open="isIpuFailMsgDialogOpen" @toggle-ipu-fail-msg-dialog="toggleIpuFailMsgDialogHandler"></PartMyResaleFailMsgDialog>

    <AppModalConfirmBottomSheet
      :is-open="openConfirm"
      :title="confirmTitle"
      :body="''"
      :left="leftName"
      :right="rightName"
      @close="onCloseConfirm"
      @click-left="onCloseConfirm"
      @click-right="onClickRightConfirm"
    ></AppModalConfirmBottomSheet>
  </div>
</template>

<script setup>
// 마이페이지 > 판매리스트
// 무한스크롤
// 컴포넌트로 부터 올라온 emit에 대한 모든 action이 일어난다.
// action에 대한 response가 200이면, onUpdateResaleItem 함수를 통해 해당 판매건만 update한다.
import * as amplitude from '@amplitude/analytics-browser'
import { cancelIpAPI, registerPickBigIpAPI, writeSellReviewAPI, getSellDeliveryInfoAPI, getResaleItemAPI } from '~/composables/apiFactories/sell'

const router = useRouter()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const page = ref(1)
const loading = ref(false)
const list = ref([])
const openConfirm = ref(false)
const confirmType = ref('')
const confirmTitle = ref('')
const confirmBody = ref('')
const leftName = ref('')
const rightName = ref('')
const settingIpuId = ref('')
const reviewIpuId = ref('')
const textReviewPointPre = ref(0)
const isReviewDialogOpen = ref(false)
const isIpuFailMsgDialogOpen = ref(false)
const ipuFailMsg = ref('')
const data = ref()
const execute = ref()

const fetchData = async () => {
  await useFetch(`/v20/items`, {
    method: 'GET',
    baseURL: config.public.baseURL,
    params: {
      page,
      limit: 10
    },
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    },
    onResponse({ response }) {
      if (response._data.data) {
        if (page.value === 1) {
          list.value = response._data.data.content
        } else {
          list.value = list.value.concat(response._data.data.content)
        }
        loading.value = false
        data.value = response._data.data
        userStore().setGlobalUserInfo(response._data.userSession)
      }
    },
    deep: true,
    immediate: true
  }).then((result) => {
    if (result.error.value != null) {
      useRetryError(result.error.value.statusCode, result.execute)
    }
    if (result.status.value === 'success') {
      execute.value = result.execute
    }
  })
}

/**
 * 아이템 판매 상태 업데이트. 하나만 업데이트 해서 갈아끼우는 방식으로.
 * @param {number} ipId
 */
const onUpdateResaleItem = async (ipId) => {
  const updateObj = await getResaleItemAPI({
    itemPackageIds: ipId
  })
  if (updateObj.error.value != null) {
    execute.value()
  } else {
    const idx = list.value.findIndex((e) => e.ipuId === ipId)
    list.value[idx] = updateObj.data.value.data.content[0]
  }
}

/** confirm bottom sheet  */
const onClickRightConfirm = async () => {
  if (confirmType.value === 'pick') await onRegisterPickBig()
  if (confirmType.value === 'cancel') await onRegisterCancel()
}

const onCloseConfirm = () => {
  openConfirm.value = false
}

/** review dialog 토글 */
const toggleReviewDialogHandler = () => {
  isReviewDialogOpen.value = !isReviewDialogOpen.value
  if (isReviewDialogOpen.value === false) {
    reviewIpuId.value = ''
  }
}

/**
 * 리뷰 dialog 오픈
 * @param ipu
 */
const onOpenReview = (ipu) => {
  // 리뷰 다이얼로그
  amplitude.track('inputreview_click', { type: 'sell' })
  reviewIpuId.value = ipu.ipuId
  textReviewPointPre.value = ipu.reviewPointPre
  toggleReviewDialogHandler()
}

/**
 * 리뷰 등록
 * @param reviewDTO
 */
const onRegisterReview = async (reviewDTO) => {
  // reviewDTO > message, starPoint, salesId
  const reviewObj = await writeSellReviewAPI(reviewDTO)
  if (reviewObj.error.value != null) {
    useRetryError(reviewObj.error.value.data.statusCode, reviewObj.execute)
  } else if (reviewObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: `리뷰를 작성하고 ${formatWon(textReviewPointPre.value)}P가 적립되었습니다.`,
      timeout: 3
    })
    await onUpdateResaleItem(reviewDTO.ipId)
    isReviewDialogOpen.value = false
  } else if (reviewObj.data.value.statusCode === 400) {
    if (reviewObj.data.value.message === 'already_posted') {
      appStore().setDialogDTO({
        message: '해당 주문의 리뷰는 이미 작성되었습니다.',
        timeout: 3
      })
      isReviewDialogOpen.value = false
    } else {
      appStore().setDialogDTO({
        message: '리뷰 작성에 실패했습니다. 잠시 후에 다시 시도해주세요.',
        timeout: 3
      })
    }
  } else {
    appStore().setDialogDTO({
      message: '리뷰 작성에 실패했습니다. 잠시 후에 다시 시도해주세요.',
      timeout: 3
    })
  }
}

/**
 * 수거 dialog 오픈
 * @param {*} ipu
 */
const onOpenPick = async (ipu) => {
  amplitude.track('bltrade_after_collect')

  settingIpuId.value = ipu.ipuId
  confirmType.value = 'pick'
  confirmTitle.value = '수거 신청하시겠습니까?'
  confirmBody.value = '까먹고 동봉하지 않은 제품은 없는지 확인해보세요!'
  leftName.value = '아니요'
  rightName.value = '수거 신청할게요'

  openConfirm.value = true
}

/** 수거 신청 등록 */
const onRegisterPickBig = async () => {
  const bigPickObj = await registerPickBigIpAPI({
    ipId: settingIpuId.value
  })
  if (bigPickObj.error.value != null) {
    appStore().setDialogDTO({
      message: '수거 신청에 실패했습니다.',
      timeout: 3
    })
    useRetryError(bigPickObj.error.value.data.statusCode, bigPickObj.execute)
  } else {
    await onUpdateResaleItem(settingIpuId.value)
    appStore().setDialogDTO({
      message: '수거 신청했습니다.',
      timeout: 3
    })
    openConfirm.value = false
  }
}

/**
 * 수거 배송 조회
 * @param {*} ipu
 */
const trackingShipHandler = async (ipu) => {
  // tracker window open
  const deliveryObj = await getSellDeliveryInfoAPI(ipu.ipuId)
  if (deliveryObj.error.value != null) {
    useRetryError(deliveryObj.error.value.data.statusCode, deliveryObj.execute)
    appStore().setDialogDTO({
      message: '현재 수거조회가 불가합니다. 수거조회 및 수거에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
    connectFaq()
  } else if (deliveryObj.data.value.data.apiKey) {
    const apiKey = deliveryObj.data.value.data.apiKey
    const deliCode = deliveryObj.data.value.data.deliCode
    const invoiceCode = deliveryObj.data.value.data.invoiceCode

    const options = 'top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no'

    window.open(`http://info.sweettracker.co.kr/tracking/4?t_key=${apiKey}&t_code=${deliCode}&t_invoice=${invoiceCode.replaceAll('-', '')}`, 'popup', options)
  } else if (deliveryObj.data.value.data.length > 0) {
    const apiKey = deliveryObj.data.value.data[0].apiKey
    const deliCode = deliveryObj.data.value.data[0].deliCode
    const invoiceCode = deliveryObj.data.value.data[0].invoiceCode

    const options = 'top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no'

    window.open(`http://info.sweettracker.co.kr/tracking/4?t_key=${apiKey}&t_code=${deliCode}&t_invoice=${invoiceCode.replaceAll('-', '')}`, 'popup', options)
  } else {
    appStore().setDialogDTO({
      message: '현재 수거조회가 불가합니다. 수거조회 및 수거에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
  }
}

/**
 * 취소 dialog 오픈
 * @param {*} ipu
 */
const onOpenCancel = async (ipu) => {
  if (ipu.itemCnt > 0 && ipu.itemList.length === 0) amplitude.track('bltrade_after_cancel')
  else amplitude.track('hftrade_after_cancel')

  settingIpuId.value = ipu.ipuId
  confirmType.value = 'cancel'
  confirmTitle.value = '신청을 취소하시겠습니까?'
  confirmBody.value = ''
  leftName.value = '아니요'
  rightName.value = '취소할게요'

  openConfirm.value = true
}

/**
 * 판매 취소 로직
 */
const onRegisterCancel = async () => {
  const cancelObj = await cancelIpAPI(settingIpuId.value)
  if (cancelObj.error.value != null) {
    appStore().setDialogDTO({
      message: '신청을 취소하지 못했습니다.',
      timeout: 3
    })
    useRetryError(cancelObj.error.value.data.statusCode, cancelObj.execute)
  } else {
    await onUpdateResaleItem(settingIpuId.value)
    appStore().setDialogDTO({
      message: '신청을 취소했습니다.',
      timeout: 3
    })
    openConfirm.value = false
  }
}

/** 판매 상세 페이지로 이동 */
const goToDetail = (ipu) => {
  router.push(`/my/sell/${ipu.ipuId}`)
}

/**
 * 판매 실패 사유 메세지 dialog 토글
 */
const toggleIpuFailMsgDialogHandler = () => {
  amplitude.track('ReasonsForRejection_click')
  isIpuFailMsgDialogOpen.value = !isIpuFailMsgDialogOpen.value
}

/**
 * 판매 실패 사유 메세지 dialog 오픈
 * @param item
 */
const onOpenFailMsgDialog = (item) => {
  ipuFailMsg.value = item.failMsg
  toggleIpuFailMsgDialogHandler()
}

/** 홈 화면 이동 */
const goToHome = () => {
  router.push('/')
}

onBeforeMount(() => {
  window.scrollTo(0, 0)
  fetchData()
})

/**
 * 무한스크롤 이벤트
 */
const scrollHandler = () => {
  if (window.innerHeight + window.scrollY + 1200 >= document.body.offsetHeight) {
    // 맨 아래.
    if (!loading.value) {
      if (data.value?.count.totalCount > list.value.length) {
        loading.value = true
        page.value++
      }
    }
  }
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '판매 내역',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })

  window.addEventListener('scroll', scrollHandler)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>
