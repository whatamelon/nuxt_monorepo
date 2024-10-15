<template>
  <div class="bg-white pb-12">
    <!-- loading progress -->
    <PartOrderResultLoading v-if="loading == true"></PartOrderResultLoading>

    <PartOrderResultSuccess v-else-if="isOrderGood == 'success'" :order-information="orderInformation" :order-product-list="orderProductList"></PartOrderResultSuccess>

    <PartOrderResultFail v-else-if="isOrderGood == 'fail'" :error-msg="errorMsg"></PartOrderResultFail>

    <PartOrderResultCancel v-else-if="isOrderGood == 'cancel'"></PartOrderResultCancel>

    <div v-else></div>

    <!-- bottom button -->
    <div v-if="loading == false && isOrderGood == 'success'" id="bottomFixedButton" class="fixed bottom-0 flex w-full space-x-1 bg-white px-5 py-2 ios-safe-area md:max-w-pc" style="z-index: 999">
      <div class="w-1/2">
        <button class="btn-h56-r28-fill-wfull my-auto" @click="goToOrderList">주문 내역 보기</button>
      </div>

      <div class="w-1/2">
        <button class="btn-h56-r28-line-wfull my-auto" @click="goToHome">홈으로</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 주문완료 페이지
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { sendSalesResultAPI } from '~/composables/apiFactories/sales'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMsg = ref('')
const isOrderGood = ref('') // success, fail, cancel

let orderProductList = []
let orderInformation = {}

if (process.client) {
  orderProductList = JSON.parse(localStorage.getItem('orderItemList'))
  orderInformation = JSON.parse(sessionStorage.getItem('orderInformation'))
}

// check order state
const getOrderDatas = async () => {
  switch (route.query.imp_success) {
    case undefined:
      await payUndefinedLogic()
      break
    case 'true':
      isOrderGood.value = 'success'
      await paySuccessLogic()
      break
    case 'false':
      await setErrorLogic()
      break
    default:
      console.error(route.query.imp_success, ' is not find')
  }
}

const setErrorLogic = async () => {
  if (route.query.error_msg) {
    if (route.query.error_msg.indexOf('[결제포기]') !== -1) {
      // 결제 취소
      isOrderGood.value = 'cancel'
      appStore().setHeaderTypeTitle('결제취소')
    } else {
      // 결제 실패
      isOrderGood.value = 'fail'
      if (route.query.error_msg) {
        errorMsg.value = route.query.error_msg
      }
      await payFailLogic()
    }
  } else {
    isOrderGood.value = 'fail'
    await payFailLogic()
  }
}

// pay undefined
const payUndefinedLogic = async () => {
  const obj = {
    salesId: orderInformation.salesid,
    result: 'u',
    merchantUid: orderInformation.merchant_uid
  }
  const salesResultObj = await sendSalesResultAPI(obj)
  if (salesResultObj.error.value != null) {
    useRetryError(salesResultObj.error.value.data.statusCode, salesResultObj.execute)
    isOrderGood.value = 'fail'
    appStore().setHeaderTypeTitle('결제실패')
  } else if (salesResultObj.data.value.statusCode === 200) {
    amplitude.track('completeorder_pv_final', {
      prodid: orderProductList.map((e) => e.prodid),
      name: orderProductList.map((e) => e.name),
      point: orderInformation.usepoint,
      pricetotal: orderInformation.prodamount,
      pricetotal_final: orderInformation.totalamount,
      itemtotalnumber: orderProductList.length,
      howpay: formatAmpPayMethodFilter(orderInformation.paymethod),
      escrow: orderInformation.escrow
    })

    isOrderGood.value = 'success'
    appStore().setHeaderTypeTitle('결제완료')
  } else {
    isOrderGood.value = 'fail'
    appStore().setHeaderTypeTitle('결제실패')
  }
}

// pay success
const paySuccessLogic = async () => {
  const obj = {
    salesId: orderInformation.salesid,
    result: 's',
    merchantUid: orderInformation.merchant_uid
  }
  const salesResultObj = await sendSalesResultAPI(obj)
  if (salesResultObj.error.value != null) {
    appStore().setHeaderTypeTitle('결제완료')
    useRetryError(salesResultObj.error.value.data.statusCode, salesResultObj.execute)
    isOrderGood.value = 'success'
  } else if (salesResultObj.data.value.statusCode === 200) {
    isOrderGood.value = 'success'
    appStore().setHeaderTypeTitle('결제완료')

    amplitude.track('completeorder_pv_final', {
      prodid: orderProductList.map((e) => e.prodid),
      name: orderProductList.map((e) => e.name),
      point: orderInformation.usepoint,
      pricetotal: orderInformation.prodamount,
      pricetotal_final: orderInformation.totalamount,
      itemtotalnumber: orderProductList.length,
      howpay: formatAmpPayMethodFilter(orderInformation.paymethod),
      escrow: orderInformation.escrow
    })
  } else {
    isOrderGood.value = 'success'
    appStore().setHeaderTypeTitle('결제완료')
    await sendDiffAlert()
  }
}

// pay fail
const payFailLogic = async () => {
  const obj = {
    salesId: orderInformation.salesid,
    result: 'f',
    merchantUid: orderInformation.merchant_uid
  }
  const salesResultObj = await sendSalesResultAPI(obj)
  if (salesResultObj.error.value != null) {
    useRetryError(salesResultObj.error.value.data.statusCode, salesResultObj.execute)
    appStore().setHeaderTypeTitle('결제실패')
    isOrderGood.value = 'fail'
  } else if (salesResultObj.data.value.statusCode === 200) {
    isOrderGood.value = 'fail'
    appStore().setHeaderTypeTitle('결제실패')
    await sendDiffAlert()
  } else {
    isOrderGood.value = 'fail'
    appStore().setHeaderTypeTitle('결제실패')
  }
}

const goToOrderList = () => {
  router.replace('/my/order')
}

const goToHome = () => {
  router.replace('/')
}

onMounted(async () => {
  amplitude.track('completeorder_pv_before')

  hideChannelButton()

  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })

  setTimeout(async () => {
    if (route.query.imp_uid !== undefined) {
      await getOrderDatas()

      amplitude.track('completeorder_pv', {
        prodid: orderProductList.map((e) => e.prodid),
        name: orderProductList.map((e) => e.name),
        point: orderInformation.usepoint,
        pricetotal: orderInformation.prodamount,
        pricetotal_final: orderInformation.totalamount,
        itemtotalnumber: orderProductList.length,
        howpay: formatAmpPayMethodFilter(orderInformation.paymethod),
        escrow: orderInformation.escrow
      })
    }
    loading.value = false
    showChannelButton()
  }, 3000)
})
</script>
