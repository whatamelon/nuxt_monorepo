<template>
  <div class="bg-white pb-12">
    <!-- loading progress -->
    <PartOrderResultLoading v-if="loading"></PartOrderResultLoading>
    <PartOrderResultFail v-else :error-msg="errorMsg"></PartOrderResultFail>
  </div>
</template>

<script setup>
// 주문완료 페이지
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { failPaymentAPI } from '~/composables/apiFactories/sales'

definePageMeta({
  middleware: [
    async (_, from) => {
      if (from.name !== 'order-success' && from.name !== 'order-fail') {
        return navigateTo('/')
      }
    }
  ]
})
const route = useRoute()
const device = useDevice()

const loading = ref(true)
const errorMsg = ref('')

let orderProductList = []
let orderInformation = {}

if (process.client) {
  orderProductList = JSON.parse(localStorage.getItem('orderItemList'))
  orderInformation = JSON.parse(sessionStorage.getItem('orderInformation'))
}

// pay fail
const onFailPayment = async () => {
  const obj = {
    salesId: orderInformation.salesid,
    reason: route.query.message
  }
  const salesResultObj = await failPaymentAPI(obj)

  if (salesResultObj.error.value != null) {
    useRetryError(salesResultObj.error.value.data.statusCode, salesResultObj.execute)
  }
}

onMounted(async () => {
  amplitude.track('completeorder_pv_before')
  hideChannelButton()

  if (device.isMobile && sessionStorage.getItem('isOpenWidget')) {
    sessionStorage.removeItem('isOpenWidget')
  }

  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '결제실패',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: '/'
  })
  setTimeout(async () => {
    errorMsg.value = route.query.message
    await onFailPayment()
      .then(() => {
        amplitude.track('completeorder_pv', {
          prodid: orderProductList.map((e) => e.prodid),
          name: orderProductList.map((e) => e.name),
          point: orderInformation.usepoint,
          pricetotal: orderInformation.prodamount,
          pricetotal_final: orderInformation.totalamount,
          itemtotalnumber: orderProductList.length,
          howpay: orderInformation.paymethod
        })
      })
      .catch(console.error)
      .finally(() => {
        loading.value = false
        showChannelButton()
      })
  }, 1000)
})
</script>
