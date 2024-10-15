<template>
  <div class="bg-white">
    <div class="px-5 pb-10 pt-4">
      <NuxtLink to="/sell" class="block">
        <img
          src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/my/order/how_about_resale.jpg"
          alt="구매하신 옷, 충분히 입으시고 다시 판매하여 지구 환경 보호에 참여하세요"
        />
      </NuxtLink>
      <div v-if="list.length == 0" class="my-9">
        <p class="body-2-r text-center text-black">주문내역이 없습니다.</p>
        <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
      </div>

      <div v-else class="mb-10 mt-6 space-y-16 first:mt-0">
        <div v-for="order in list" :key="order">
          <PartMyOrderItem
            :order="order"
            @cancel="onOpenCancel"
            @vbank="onOpenVbankInfo"
            @connect-faq="connectFaq"
            @tracking-ship="trackingShipHandler"
            @decide="onOpenDecide"
            @return="onOpenReturn"
            @write-review="onOpenReview"
            @detail="goToOrderDetail"
          ></PartMyOrderItem>
        </div>
      </div>
    </div>

    <PartMyOrderVbankInfoDialog :vbank-info="vbankInfo" :is-vbank-info-dialog-open="isVbankInfoDialogOpen" @toggle-vbank-info-dialog="toggleVbankDialogHandler"></PartMyOrderVbankInfoDialog>

    <PartMyOrderCancelDialog
      v-if="isCancelDialogOpen"
      :cancel-so-items="cancelSoItems"
      :is-cancel-dialog-open="isCancelDialogOpen"
      @toggle-cancel-dialog="toggleCancelDialogHandler"
      @cancel-so-items="onCancelItem"
    ></PartMyOrderCancelDialog>

    <PartMyOrderReturnDialog
      v-if="isReturnDialogOpen"
      :return-so-items="returnSoItems"
      :is-return-dialog-open="isReturnDialogOpen"
      @toggle-return-dialog="toggleReturnDialogHandler"
      @return-so-items="onReturnItem"
    ></PartMyOrderReturnDialog>

    <PartReviewDialog
      :is-review-dialog-open="isReviewDialogOpen"
      :id-for-register="reviewSalesId"
      :sp-list="reviewSpList"
      :text-review-point-pre="textReviewPointPre"
      :image-review-point-pre="imageReviewPointPre"
      :review-type="'buy'"
      @toggle-review-diaglog="toggleReviewDialogHandler"
      @register-review="onRegisterReview"
    ></PartReviewDialog>

    <AppModalConfirmBottomSheet
      :is-open="openConfirm"
      :title="confirmTitle"
      :body="confirmBody"
      :left="leftName"
      :right="rightName"
      @close="() => (openConfirm = false)"
      @click-left="() => (openConfirm = false)"
      @click-right="onConfirmBottomSheet"
    ></AppModalConfirmBottomSheet>

    <AppSpinnerDim :is-open="isOpenDimSpinner"></AppSpinnerDim>
  </div>
</template>

<script setup>
// 마이페이지 > 주문리스트
// 무한스크롤
// 컴포넌트로 부터 올라온 emit에 대한 모든 action이 일어난다.
// action에 대한 response가 200이면, onUpdateOrderItem 함수를 통해 해당 주문건만 update한다.
import { hideChannelButton, showChannelButton, showMessenger } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { getUserInfoAPI } from '~/composables/apiFactories/user'
import { getDeliveryInfoAPI, getVbankInfoAPI, cancelSoIdsAPI, returnSoIdsAPI, cofirmSoIdsAPI, writeBuyReviewAPI, getOrderItemAPI } from '~/composables/apiFactories/sales'

const router = useRouter()
const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const page = ref(1)
const loading = ref(false)
const list = ref([])
const isOpenDimSpinner = ref(false)
const openConfirm = ref(false)
const confirmType = ref('')
const confirmTitle = ref('')
const confirmBody = ref('')
const leftName = ref('')
const rightName = ref('')
const settingSalesId = ref('')
const settingSalesSoIds = ref('')
const reviewSalesId = ref('')
const reviewSpList = ref([])
const textReviewPointPre = ref(0)
const imageReviewPointPre = ref(0)
const isReviewDialogOpen = ref(false)
const isReturnDialogOpen = ref(false)
const returnSalesId = ref('')
const returnSoItems = ref([])
const isCancelDialogOpen = ref(false)
const cancelSalesId = ref('')
const cancelSoItems = ref([])
const isVbankInfoDialogOpen = ref(false)
const vbankInfo = ref({
  bankName: '',
  bankCode: '',
  account: '',
  holder: '',
  vbDate: '',
  price: 0
})
const data = ref()

const fetchData = async () => {
  await useFetch(`/v20/sales`, {
    method: 'GET',
    baseURL: config.public.baseURL,
    params: {
      page,
      limit: 30
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
  })
}

/**
 * 주문내역 업데이트
 * @param {number} salesId
 */
const onUpdateOrderItem = async (salesId) => {
  const updateObj = await getOrderItemAPI({
    salesIds: salesId
  })
  if (updateObj.error.value != null) {
    fetchData()
  } else {
    const idx = list.value.findIndex((e) => e.salesId === salesId)
    list.value[idx] = updateObj.data.value.data.content[0]
  }
}

/** confirm bottom sheet function */
const onConfirmBottomSheet = async () => {
  if (confirmType.value === 'cancel-vbank') await onCancelItemAction()
  if (confirmType.value === 'decide') await onRegisterDecide()
  if (confirmType.value === 'return-bank') router.push('/my/profile')
}

/** 리뷰 dialog 토글 */
const toggleReviewDialogHandler = () => {
  isReviewDialogOpen.value = !isReviewDialogOpen.value
}

/** 반품 dialog 토글 */
const toggleReturnDialogHandler = () => {
  isReturnDialogOpen.value = !isReturnDialogOpen.value
  if (!isReturnDialogOpen.value) {
    returnSalesId.value = ''
    returnSoItems.value = []
  }
}

/** 취소 dialog 토글 */
const toggleCancelDialogHandler = () => {
  isCancelDialogOpen.value = !isCancelDialogOpen.value
  if (!isCancelDialogOpen.value) {
    cancelSalesId.value = ''
    cancelSoItems.value = []
  }
}

/**
 * 리뷰 등록 dialog 오픈
 * @param order
 */
const onOpenReview = (order) => {
  // 리뷰 다이얼로그
  amplitude.track('inputreview_click', { clickedpage: 'buy' })
  reviewSalesId.value = order.salesId
  textReviewPointPre.value = order.textReviewPointPre
  imageReviewPointPre.value = order.imageReviewPointPre
  reviewSpList.value = order.spList.filter((e) => e.status === 90)
  toggleReviewDialogHandler()
}

/**
 * 리뷰 등록
 * @param {PostReviewBuyRequest | FormData<PostReviewBuyRequest>} reviewDTO
 */
const onRegisterReview = async (reviewDTO) => {
  isOpenDimSpinner.value = true
  // reviewDTO > message, starPoint, salesId, imgFiles
  const reviewObj = await writeBuyReviewAPI(reviewDTO)
  if (reviewObj.error.value != null) {
    appStore().setDialogDTO({
      message: '리뷰 작성에 실패했습니다. 잠시 후에 다시 시도해주세요.',
      timeout: 3
    })
    isOpenDimSpinner.value = false
    useRetryError(reviewObj.error.value.data.statusCode, reviewObj.execute)
  } else {
    isOpenDimSpinner.value = false
    if (reviewObj.data.value.statusCode === 200) {
      let addImageInReview = false
      if (reviewDTO.get('imgFiles')) {
        addImageInReview = true
      }

      const reviewPoint = addImageInReview ? formatWon(textReviewPointPre.value + imageReviewPointPre.value) : formatWon(textReviewPointPre.value)
      appStore().setDialogDTO({
        message: `리뷰를 작성하고 ${reviewPoint}P가 적립되었습니다.`,
        timeout: 3
      })
      const reviewSalesIdsss = reviewSalesId.value
      await onUpdateOrderItem(reviewSalesIdsss)
      isReviewDialogOpen.value = false
    } else if (reviewObj.data.value.statusCode === 400) {
      if (reviewObj.data.value.message === 'already_posted') {
        appStore().setDialogDTO({
          message: '해당 주문의 리뷰는 이미 작성되었습니다.',
          timeout: 3
        })
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
}

/**
 * 주문 확정 dialog 오픈
 * @param order
 */
const onOpenDecide = async (order) => {
  // 주문 확정할 상품 다이얼로그 띄우기

  settingSalesId.value = order.salesId
  settingSalesSoIds.value = order.spList
    .filter((e) => e.status === 40)
    .map((e) => {
      return e.soId
    })
  confirmType.value = 'decide'
  confirmTitle.value = '배송완료된 상품에 대해\n구매확정하시겠습니까?'
  confirmBody.value = '구매확정을 하고 리뷰를 쓰면 포인트를 받을 수 있습니다.'
  leftName.value = '아니요'
  rightName.value = '구매확정하기'

  openConfirm.value = true
}

/** 구매 확정 */
const onRegisterDecide = async () => {
  const confirmObj = await cofirmSoIdsAPI({
    salesId: settingSalesId.value,
    soIds: settingSalesSoIds.value
  })
  if (confirmObj.error.value != null) {
    appStore().setDialogDTO({
      message: '구매확정에 실패했습니다. 고객센터로 문의해주세요.',
      timeout: 3
    })
    useRetryError(confirmObj.error.value.data.statusCode, confirmObj.execute)
  } else if (confirmObj.data.value.statusCode === 200) {
    amplitude.track('order_after_complete')
    openConfirm.value = false

    appStore().setDialogDTO({
      message: '구매를 확정했습니다.',
      timeout: 3
    })
    await onUpdateOrderItem(settingSalesId.value)
  } else {
    appStore().setDialogDTO({
      message: '구매확정에 실패했습니다. 고객센터로 문의해주세요.',
      timeout: 3
    })
  }
}

/**
 * 반품 dialog 오픈
 * @param order
 */
const onOpenReturn = async (order) => {
  // 반품할 상품 다이얼로그 띄우기
  returnSalesId.value = order.salesId
  const items = order.spList
    .filter((e) => e.status === '40')
    .map((e) => ({
      ...e,
      retMsg: '',
      retCode: '반품사유',
      active: false
    }))

  returnSoItems.value = JSON.parse(JSON.stringify(items))

  toggleReturnDialogHandler()
}

/**
 * 반품 처리 로직
 * @param items
 */
const onReturnItem = async (items) => {
  if (items.length === 0) {
    appStore().setDialogDTO({
      message: '반품하실 상품을 선택해주세요.',
      timeout: 3
    })
  } else {
    const retObj = await returnSoIdsAPI({
      salesId: returnSalesId.value,
      retList: items
    })
    if (retObj.error.value != null) {
      useRetryError(retObj.error.value.data.statusCode, retObj.execute)
      appStore().setDialogDTO({
        message: '반품에 실패했습니다. 반품과 관련된 정보는 고객센터로 문의해주세요.',
        timeout: 3
      })
      connectFaq()
    } else {
      amplitude.track('order_after_return')
      if (retObj.data.value.statusCode === 200) {
        appStore().setDialogDTO({
          message: '선택하신 상품이 반품 신청 되었습니다.',
          timeout: 5
        })
        await onUpdateOrderItem(returnSalesId.value)
        toggleReturnDialogHandler()
      } else {
        appStore().setDialogDTO({
          message: '반품에 실패했습니다. 반품과 관련된 정보는 고객센터로 문의해주세요.',
          timeout: 3
        })
      }
    }
  }
}

/**
 * 주문 취소 dialog open
 * @param order
 */
const onOpenCancel = async (order) => {
  // > 주문취소 다이얼로그 띄우기 / vbank면 일괄 취소 bottomsheet
  if (order.payMethod === 'vbank' || order.payMethod === 'VIRTUAL_ACCOUNT') {
    const userObj = await getUserInfoAPI()
    if (userObj.error.value != null) {
      useRetryError(userObj.error.value.data.statusCode, userObj.execute)
    } else if (userObj.data.value.statusCode === 200) {
      if (userObj.data.value.data.refInfo.bankName != null) {
        onCalcelVbank(order)
      } else {
        settingSalesId.value = order.salesId
        settingSalesSoIds.value = ''
        confirmType.value = 'return-bank'
        confirmTitle.value = `환불계좌 입력 후에\n주문 취소를 진행해주세요.`
        confirmBody.value = '마이페이지 > 내정보로 이동하여 환불계좌를 입력하시겠습니까?'
        leftName.value = '아니요'
        rightName.value = '이동하기'

        openConfirm.value = true
      }
    }
  } else {
    settingSalesId.value = order.salesId
    cancelSalesId.value = order.salesId
    cancelSoItems.value = order.spList.filter((e) => e.status === '10')
    toggleCancelDialogHandler()
  }
}

/**
 * 가상계좌 취소 dialog 오픈
 * @param order
 */
const onCalcelVbank = (order) => {
  settingSalesId.value = order.salesId
  settingSalesSoIds.value = order.spList.map((e) => {
    return e.soId
  })
  confirmType.value = 'cancel-vbank'
  confirmTitle.value = '가상계좌는 일괄 취소됩니다.\n주문을 취소하시겠습니까?'
  confirmBody.value = ''
  leftName.value = '아니요'
  rightName.value = '취소할게요'

  openConfirm.value = true
}

/**
 * 주문 취소 클릭
 * @param soids
 */
const onCancelItem = async (soids) => {
  if (soids.length === 0) {
    appStore().setDialogDTO({
      message: '주문 취소하실 상품을 선택해주세요.',
      timeout: 3
    })
  } else {
    settingSalesSoIds.value = soids
    await onCancelItemAction()
  }
}

/** 주문 취소 로직 */
const onCancelItemAction = async () => {
  const cancelObj = await cancelSoIdsAPI({
    salesId: settingSalesId.value,
    soIds: settingSalesSoIds.value
  })
  if (cancelObj.error.value != null) {
    useRetryError(cancelObj.error.value.data.statusCode, cancelObj.execute)
    appStore().setDialogDTO({
      message: '주문 취소에 실패했습니다. 주문 취소와 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
    // connectFaq();
  } else if (cancelObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '상품 주문을 취소했습니다.',
      timeout: 3
    })
    amplitude.track('order_after_cancel', {
      soid: settingSalesSoIds.value
    })

    isCancelDialogOpen.value = false
    openConfirm.value = false
    await onUpdateOrderItem(settingSalesId.value)
  } else {
    appStore().setDialogDTO({
      message: '주문 상품 취소에 실패했습니다. 주문 상품 취소와 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
  }
}

/**
 * vbank dialog 토글
 */
const toggleVbankDialogHandler = () => {
  isVbankInfoDialogOpen.value = !isVbankInfoDialogOpen.value
  if (isVbankInfoDialogOpen.value) hideChannelButton()
  else showChannelButton()
}

/**
 * 입금 계좌번호 조회
 * @param order
 */
const onOpenVbankInfo = async (order) => {
  // > 입금계좌번호 띄우기
  const deliveryObj = await getVbankInfoAPI(order.salesId)
  if (deliveryObj.error.value != null) {
    useRetryError(deliveryObj.error.value.data.statusCode, deliveryObj.execute)
    appStore().setDialogDTO({
      message: '현재 입금계좌 조회가 불가합니다. 입금계좌에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
    connectFaq()
  } else if (deliveryObj.data.value.data.bankName == null) {
    appStore().setDialogDTO({
      message: '현재 입금계좌 조회가 불가합니다. 입금계좌에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
    connectFaq()
  } else {
    vbankInfo.value = {
      bankName: deliveryObj.data.value.data.bankName,
      bankCode: deliveryObj.data.value.data.bankCode,
      account: deliveryObj.data.value.data.account,
      holder: deliveryObj.data.value.data.holder,
      vbDate: deliveryObj.data.value.data.vbDate,
      price: deliveryObj.data.value.data.depositAmount
    }

    toggleVbankDialogHandler()
  }
}

/**
 * faq logic
 */
const connectFaq = () => {
  // 채널톡 오픈
  showChannelButton()
  showMessenger()
}

/**
 * ship logic
 * @param {*} order
 */
const trackingShipHandler = async (order) => {
  // tracker window open
  const deliveryObj = await getDeliveryInfoAPI(order.salesId)
  if (deliveryObj.error.value != null) {
    useRetryError(deliveryObj.error.value.data.statusCode, deliveryObj.execute)
    appStore().setDialogDTO({
      message: '현재 배송조회가 불가합니다. 배송조회 및 배송에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
    connectFaq()
  } else if (deliveryObj.data.value.statusCode === 200) {
    const apiKey = deliveryObj.data.value.data.apiKey
    const deliCode = deliveryObj.data.value.data.deliCode
    const invoiceCode = deliveryObj.data.value.data.invoiceCode

    const options = 'top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no'

    window.open(`http://info.sweettracker.co.kr/tracking/4?t_key=${apiKey}&t_code=${deliCode}&t_invoice=${invoiceCode.replaceAll('-', '')}`, 'popup', options)
  } else {
    appStore().setDialogDTO({
      message: '현재 배송조회가 불가합니다. 배송조회 및 배송에 관련된 정보는 고객센터로 문의해주세요.',
      timeout: 3
    })
  }
}

/**
 * 주문 상세 화면으로 이동
 * @param order
 */
const goToOrderDetail = (order) => {
  router.push(`/my/order/${order.salesId}`)
}

/** 홈 화면으로 이동 */
const goToHome = () => {
  router.push('/')
}

onBeforeMount(async () => {
  window.scrollTo(0, 0)
  await fetchData()

  if (list.value.length === 0) hideChannelButton()
  else showChannelButton()
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
    title: '주문 내역',
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
