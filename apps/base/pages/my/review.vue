<template>
  <div class="bg-white pb-20">
    <PartMyReviewTabbar :selected-tab="selectedTab" :tab-list="tabList" @select-tab="onClickTab"></PartMyReviewTabbar>

    <div v-if="selectedTab.code == 'before'" class="px-5">
      <div v-if="data.data.reviewables.length == 0" class="my-20">
        <p class="body-2-r text-center text-black">작성 가능한 리뷰가 없습니다.</p>
        <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
      </div>

      <div v-else class="my-10 space-y-16">
        <div v-for="reviewItem in data.data.reviewables" :key="reviewItem">
          <PartMyResaleItem v-if="reviewItem.reviewType == 's'" :ipu="reviewItem" @write-review="onOpenSellDialog" @detail="goToDetail" @fail-msg="onOpenFailMsgDialog"></PartMyResaleItem>

          <PartMyOrderItem v-if="reviewItem.reviewType == 'b'" :order="reviewItem" @write-review="onOpenBuyDialog" @detail="goToOrderDetail"></PartMyOrderItem>
        </div>
      </div>
    </div>

    <div v-else class="px-5">
      <div v-if="writtenObj.data.value.data.content.length == 0" class="my-20">
        <p class="body-2-r text-center text-black">작성한 리뷰가 없습니다.</p>
        <button class="btn-h56-r28-line-wfull mt-10" @click="goToHome">홈으로</button>
      </div>

      <div v-else class="mt-8 space-y-4 divide-y divide-rgray-100">
        <FeatReviewMsgItem v-for="reviewItem in writtenObj.data.value.data.content" :key="reviewItem.reviewId" :review-item="reviewItem"></FeatReviewMsgItem>
      </div>
    </div>

    <PartReviewDialog
      :is-review-dialog-open="isSellReviewDialogOpen"
      :id-for-register="idForRegister"
      :sp-list="[]"
      :text-review-point-pre="textReviewPointPre"
      :image-review-point-pre="0"
      :review-type="'sell'"
      @toggle-review-diaglog="toggleSellDialogHandler"
      @register-review="onRegisterSellReview"
    ></PartReviewDialog>

    <PartMyResaleFailMsgDialog :ipu-fail-msg="ipuFailMsg" :is-ipu-fail-msg-dialog-open="isIpuFailMsgDialogOpen" @toggle-ipu-fail-msg-dialog="toggleIpuFailMsgDialogHandler"></PartMyResaleFailMsgDialog>

    <PartReviewDialog
      :is-review-dialog-open="isReviewDialogOpen"
      :id-for-register="idForRegister"
      :sp-list="reviewSpList"
      :text-review-point-pre="textReviewPointPre"
      :image-review-point-pre="imageReviewPointPre"
      :review-type="'buy'"
      @toggle-review-diaglog="toggleBuyDialogHandler"
      @register-review="onRegisterBuyReview"
    ></PartReviewDialog>

    <AppSpinnerDim :is-open="isOpenDimSpinner"></AppSpinnerDim>
  </div>
</template>

<script setup>
// 마이페이지 > 리뷰리스트 페이지
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import { writeBuyReviewAPI } from '~/composables/apiFactories/sales'
import { writeSellReviewAPI } from '~/composables/apiFactories/sell'
import { getAllWritableReviewAPI, getAllWrittenReviewAPI } from '~/composables/apiFactories/user'

const router = useRouter()

const selectedTab = ref({
  name: '리뷰 작성',
  code: 'before'
})
const tabList = ref([
  {
    name: '리뷰 작성',
    code: 'before'
  },
  {
    name: '리뷰 내역',
    code: 'after'
  }
])
const isOpenDimSpinner = ref(false)
const idForRegister = ref('')
const reviewSpList = ref([])
const textReviewPointPre = ref(0)
const imageReviewPointPre = ref(0)
const isReviewDialogOpen = ref(false)
const isSellReviewDialogOpen = ref(false)
const isIpuFailMsgDialogOpen = ref(false)
const ipuFailMsg = ref('')

const { data, error, execute } = await getAllWritableReviewAPI()
if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
}

const writtenObj = await getAllWrittenReviewAPI()
if (writtenObj.error.value != null) {
  useRetryError(writtenObj.error.value.data.statusCode, writtenObj.execute)
}

/**
 * 리뷰 작성 / 리뷰 내역 탭 전환
 * @param {GlobalCode} tab
 */
const onClickTab = (tab) => {
  window.scrollTo(0, 0)
  selectedTab.value = tab
}

/** 판매 리뷰 dialog 토글 */
const toggleSellDialogHandler = () => {
  isSellReviewDialogOpen.value = !isSellReviewDialogOpen.value
  if (!isSellReviewDialogOpen.value) {
    idForRegister.value = ''
  }
  if (isSellReviewDialogOpen.value) hideChannelButton()
  else showChannelButton()
}

/** 구매 리뷰 dialog 토글 */
const toggleBuyDialogHandler = () => {
  isReviewDialogOpen.value = !isReviewDialogOpen.value
  if (!isReviewDialogOpen.value) {
    idForRegister.value = ''
  }
}

/**
 * 판매 리뷰 dialog 오픈
 * @param ipu
 */
const onOpenSellDialog = (ipu) => {
  // 리뷰 다이얼로그
  idForRegister.value = ipu.ipuId
  textReviewPointPre.value = ipu.reviewPointPre
  toggleSellDialogHandler()
}

/**
 * 구매 리뷰 dialog 오픈
 * @param order
 */
const onOpenBuyDialog = async (order) => {
  // 리뷰 다이얼로그
  idForRegister.value = order.salesId
  textReviewPointPre.value = order.textReviewPointPre
  imageReviewPointPre.value = order.imageReviewPointPre
  reviewSpList.value = order.spList.filter((e) => e.status === 90)
  toggleBuyDialogHandler()
}

/**
 * 판매 리뷰 작성
 * @param {PostReviewBuyRequest} reviewDTO
 */
const onRegisterSellReview = async (reviewDTO) => {
  // reviewDTO > message, starPoint, salesId
  const reviewObj = await writeSellReviewAPI(reviewDTO)
  if (reviewObj.error.value != null) {
    useRetryError(reviewObj.error.value.data.statusCode, reviewObj.execute)
  } else if (reviewObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: `리뷰를 작성하고 ${formatWon(textReviewPointPre.value)}P가 적립되었습니다.`,
      timeout: 3
    })
    writtenObj.execute()
    execute()
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

/**
 * 구매 리뷰 작성
 * @param {FormData<PostReviewBuyRequest>} reviewDTO
 */
const onRegisterBuyReview = async (reviewDTO) => {
  isOpenDimSpinner.value = true
  // reviewDTO > message, starPoint, salesId, imgFiles
  const reviewObj = await writeBuyReviewAPI(reviewDTO)
  if (reviewObj.error.value != null) {
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
      writtenObj.execute()
      execute()
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
 * IPU detail logic
 * @param ipu
 */
const goToDetail = (ipu) => {
  router.push(`/my/sell/${ipu.ipuId}`)
}

/**
 * 판매 실패 사유 메세지 dialog 토글
 */
const toggleIpuFailMsgDialogHandler = () => {
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

/**
 * ORDER detail logic
 * @param {*} order
 */
const goToOrderDetail = (order) => {
  router.push(`/my/order/${order.salesId}`)
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '리뷰 내역',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})
</script>
