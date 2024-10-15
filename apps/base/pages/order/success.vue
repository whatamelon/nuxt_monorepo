<template>
  <div class="bg-white pb-12">
    <!-- loading progress -->
    <PartOrderResultLoading v-if="loading"></PartOrderResultLoading>

    <template v-else>
      <PartOrderResultSuccess :order-information="orderInformation" :order-product-list="orderProductList"></PartOrderResultSuccess>
      <!-- bottom button -->
      <div id="bottomFixedButton" class="fixed bottom-0 flex w-full space-x-1 bg-white px-5 py-2 ios-safe-area md:max-w-pc" style="z-index: 999">
        <div class="w-1/2">
          <button class="btn-h56-r28-fill-wfull my-auto" @click="goToOrderList">주문 내역 보기</button>
        </div>

        <div class="w-1/2">
          <button class="btn-h56-r28-line-wfull my-auto" @click="goToHome">홈으로</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// 주문완료 페이지
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { approvePaymentAPI } from '~/composables/apiFactories/sales'

definePageMeta({
  middleware: [
    async (_, from) => {
      if (from.name !== 'order-success') {
        return navigateTo('/')
      }
    }
  ]
})
const route = useRoute()
const router = useRouter()
const device = useDevice()

const loading = ref(true)

let orderProductList = []
let orderInformation = {}

if (process.client) {
  orderProductList = JSON.parse(localStorage.getItem('orderItemList'))
  orderInformation = JSON.parse(sessionStorage.getItem('orderInformation'))
}

const goToOrderList = () => {
  router.push('/my/order')
}

const goToHome = () => {
  router.push('/')
}

const onApprovePayment = async () => {
  // amount는 /pre api 에서 받았던 값을 이용한다고 함.
  const requestData = {
    merchantUid: route.query.orderId,
    impUid: route.query.paymentKey
    // amount: route.query.amount,
  }
  const { error } = await approvePaymentAPI(requestData)

  if (error.value !== null) {
    router.replace(`/order/fail?message=${error.value.message}&code=${error.value.code}`)
  } else {
    amplitude.track('completeorder_pv_final', {
      prodid: orderProductList.map((e) => e.prodid),
      name: orderProductList.map((e) => e.name),
      point: orderInformation.usepoint,
      pricetotal: orderInformation.prodamount,
      pricetotal_final: orderInformation.totalamount,
      itemtotalnumber: orderProductList.length,
      howpay: orderInformation.paymethod
    })
  }
}

onMounted(async () => {
  if (device.isMobile && sessionStorage.getItem('isOpenWidget')) {
    sessionStorage.removeItem('isOpenWidget')
  }
  amplitude.track('completeorder_pv_before')

  hideChannelButton()

  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '결제완료',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: '/'
  })

  setTimeout(async () => {
    // debugger
    await onApprovePayment()
      .then(() => {
        amplitude.track('completeorder_pv', {
          prodid: orderProductList.map((e) => e.prodid),
          name: orderProductList.map((e) => e.name),
          point: orderInformation.usepoint,
          pricetotal: orderInformation.prodamount,
          pricetotal_final: orderInformation.totalamount,
          itemtotalnumber: orderProductList.length,
          howpay: orderInformation.paymethod,
          escrow: orderInformation.escrow
        })
      })
      .catch(console.error)
      .finally(() => {
        loading.value = false
        showChannelButton()
      })
  }, 3000)
})
</script>
