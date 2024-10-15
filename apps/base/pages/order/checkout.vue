<template>
  <div class="space-y-8 bg-white px-5 pt-10">
    <ClientOnly>
      <PartOrderCheckoutShipList
        :selected-address="originAddress"
        :address-list="addressObj.data.value.data"
        :own-msg="ownMsg"
        :error-obj="errorObj"
        @change-ship-msg="chgShipMsg"
        @onChange="updateShipMsg"
      ></PartOrderCheckoutShipList>
    </ClientOnly>

    <PartOrderCheckoutOptionList></PartOrderCheckoutOptionList>
    <PartOrderCheckoutPoint :user-point="userPoint" :used-point="usedPoint" @onChange="updateUsedPoint"></PartOrderCheckoutPoint>
  </div>
  <PartOrderCheckoutReceiptToss
    :paied-amount="paiedAmount"
    :prod-amount="prodAmount"
    :used-point="usedPoint"
    :is-checked="isChecked"
    :error-obj="errorObj"
    :customer-key="customerKey"
    @check-agree="checkAgree"
    @request-payment="requestPayment"
  ></PartOrderCheckoutReceiptToss>
</template>

<script setup>
// 주문서 페이지
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import * as amplitude from '@amplitude/analytics-browser'
import { getAddressListAPI, getUserInfoAPI } from '~/composables/apiFactories/user'
import { setSalesPreAPI } from '~/composables/apiFactories/sales'

definePageMeta({
  middleware: [
    async (_, from) => {
      if (from.name !== 'product-id' && from.name !== 'cart' && from.name !== 'address' && from.name !== 'order-result' && from.name !== 'order-fail' && from.name !== 'order-checkout') {
        return navigateTo('/')
      }
    }
  ]
})

const config = useRuntimeConfig()
const piniaUserStore = userStore()
const route = useRoute()
const router = useRouter()
const device = useDevice()
const { getHeadObject } = storeToRefs(appStore())

const originAddress = ref({
  addrId: 0,
  receiverName: '',
  addrCode: '',
  addr0: '',
  addr1: '',
  telNo: '',
  msg: '',
  defaultFlag: false
})
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})
const selectedMsg = ref('')
const ownMsg = ref('')
const msgList = ref(['부재 시 경비실에 맡겨주세요', '부재 시 택배함에 넣어주세요', '부재 시 집 앞에 놔주세요', '배송 전 연락바랍니다', '직접 입력'])
const isChecked = ref(false)
const usedPoint = ref(0)
const prodAmount = ref(0)
const customerKey = nanoid(8)
const orderItemList = ref([])

if (process.client) {
  orderItemList.value = localStorage.getItem('orderItemList') ? JSON.parse(localStorage.getItem('orderItemList')) : []
}

const paiedAmount = computed(() => {
  return prodAmount.value - usedPoint.value
})

const addressObj = await getAddressListAPI()
if (addressObj.error.value != null) {
  useRetryError(addressObj.error.value.data.statusCode, addressObj.execute)
}

const userInfoObj = await getUserInfoAPI()
if (userInfoObj.error.value != null) {
  useRetryError(userInfoObj.error.value.data.statusCode, userInfoObj.execute)
}
const userPoint = ref(userInfoObj.data.value.data.totalPoints)

const setErrorObj = (obj) => {
  errorObj.value = obj

  setTimeout(() => {
    errorObj.value = {
      code: '',
      msg: '',
      time: 0
    }
  }, obj.time)
}

const chgShipMsg = (msg) => {
  originAddress.value.msg = msg
  selectedMsg.value = msg
}

const updateShipMsg = (val) => {
  ownMsg.value = val
}

const updateUsedPoint = (val) => {
  usedPoint.value = val
}

const checkAgree = () => {
  isChecked.value = !isChecked.value
}

/**
 * 결제 process (toss payments)
 * @param {TossPaymentsWidgets} widgets 토스 페이먼츠 결제 위젯
 * @param {PayMethodType} payMethod 결제 방식
 */
const requestPayment = async (widgets, payMethod) => {
  // 0. 배송지 입력 '직접 입력' 인 경우
  const usedRecvAddress = originAddress.value
  const isUsedOwnMsg = originAddress.value.msg === '직접 입력'
  if (isUsedOwnMsg) {
    usedRecvAddress.msg = ownMsg.value
  }
  /** 1. 유효성 검사 시작 */
  /** 배송지 입력 유효성 검사 */
  if (addressObj.data.value.data.length === 0) {
    setErrorObj({
      code: 'no_ship',
      msg: '배송지를 추가해주세요.',
      time: 3000
    })
    const el = document.getElementById('addShipButton')
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  /** 필수사항 동의 유효성 검사 */
  if (!isChecked.value) {
    setErrorObj({
      code: 'not_agree',
      msg: '필수사항에 동의해야 합니다.',
      time: 3000
    })
    const el = document.getElementById('agreeCheckbox')
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  /** 결제 최소 금액 유효성 검사 */
  if (paiedAmount.value < 1000) {
    setErrorObj({
      code: 'over_card_amount',
      msg: '결제 최소 금액은 1,000원 입니다.',
      time: 5000
    })
    const el = document.getElementById('payment-method')
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  /**
   * 결제 최대 금액 유효성 검사 (200만원 이상 카드 결제 불가)
   * @link https://support.toss.im/faq/167?from=8&page=1
   */
  // if (paiedAmount.value > 2000000 && selectedPayment.value === 'card') {
  //   setErrorObj({
  //     code: 'over_card_amount',
  //     msg: '결제 금액이 200만원 이상인 경우 신용카드로 결제가 불가합니다.',
  //     time: 5000
  //   })
  //   const el = document.getElementById('payment-method')
  //   el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //   return
  // }
  /** 배송 메세지 유효성 검사 */
  if (isUsedOwnMsg && ownMsg.value.length === 0) {
    setErrorObj({
      code: 'no_addr_msg',
      msg: '직접 입력인 경우에 배송메시지를 입력해주세요.',
      time: 5000
    })
    const el = document.getElementById('shipMsgInput')
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  /**
   * 2. 결제 사전 정보 저장
   * 예) prod - relay4_{domain code}_{time value}{nanoid}
   * 예) dev - relay4d_{domain code}_{time value}{nanoid}
   * */
  const muid = `relay4${config.public.env === 'development' ? 'd' : ''}_${formatDomainCode()}_${new Date().getTime()}${customerKey}`

  // 2-1. 결제 사전 정보 parameter가공
  const params = {
    optIds: orderItemList.value.map((e) => e.optId),
    brandId: {
      id: getHeadObject.value.id
    },
    userId: userInfoObj.data.value.data.userId,
    merchantUid: muid,
    totalAmount: paiedAmount.value,
    prodAmount: prodAmount.value,
    pointAmount: usedPoint.value,
    deliAmount: 0,
    payAmount: paiedAmount.value,
    recvInfo: usedRecvAddress,
    payMethod
  }

  // 2-2. 결제 사전 정보 등록 api 호출 (/pre)
  const salesPreObj = await setSalesPreAPI(params)
  if (salesPreObj.error.value != null) {
    if (salesPreObj.error.value.statusCode !== 200) {
      if (salesPreObj.error.value.data.data !== null) {
        appStore().setDialogDTO({
          message: salesPreObj.error.value.data.message,
          timeout: 3
        })
        // 결제 정보가 변경되어 이전 화면으로 돌아감.
        router.back()
        return
      }
      appStore().setDialogDTO({
        message: '결제시도에 실패했습니다. 고객센터를 통해 문의해주세요.',
        timeout: 5
      })
    }
    useRetryError(salesPreObj.error.value.data.statusCode, salesPreObj.execute)
    return
  }

  // 2-3. 결제 사전 정보 저장 로직 문제 없으면 amplitude에 통계 집계.
  amplitude.track('pay_click_start', {
    prodid: orderItemList.value.map((e) => e.prodId),
    name: orderItemList.value.map((e) => e.name),
    point: usedPoint.value,
    pricetotal: prodAmount.value,
    pricetotal_final: paiedAmount.value,
    itemtotalnumber: orderItemList.value.length,
    howpay: payMethod
  })

  /** 3. 실제 결제 창 오픈 로직  */

  const dayjs = useDayjs()
  const now = dayjs()

  /** 3-1. 결과창(success, fail)에서의 데이터가 필요해서 session storage에 저장. */
  const orderInformation = {
    paymethod: payMethod,
    prodamount: prodAmount.value,
    totalamount: paiedAmount.value,
    usepoint: usedPoint.value,
    salesid: salesPreObj.data.value.data.salesId,
    merchant_uid: muid,
    paid_at: dayjs(now.$d).format('YYYY.MM.DD HH:mm.ss'),
    due_date: dayjs().add(1, 'hour').format('YYYY.MM.DD HH:mm'),

    name: usedRecvAddress.receiverName,
    telNo: usedRecvAddress.telNo,
    shipMsg: usedRecvAddress.msg,
    address: `(${usedRecvAddress.addrCode}) ${usedRecvAddress.addr0} ${usedRecvAddress.addr1}`
  }
  sessionStorage.setItem('orderInformation', JSON.stringify(orderInformation))

  // 3-2. 구매 할 상품 이름 가공 ex)... 외 n 개
  let orderName = `${getHeadObject.value.brandMetadata.siteName} | ${orderItemList.value[0].name}`
  if (orderItemList.value.length > 1) {
    orderName += ` 외 ${(orderItemList.value.length - 1).toString()}개`
  }

  // 3-3. 결제 창 들어가기 전, 최종 결제 금액 업데이트.
  // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
  // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
  await widgets.setAmount({
    currency: 'KRW',
    value: paiedAmount.value
  })

  // ------ 3-4. 결제창 띄우기 ------
  // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
  try {
    // 모바일에서는 redirect 방식으로 결제창을 띄움.
    // 사용자 취소인 것을 확인하기 위해 sessionStorage에 isOpenWidget 데이터를 넣음.
    // 1. 결제가 취소되거나, 2. 결제 후 success, fail 페이지에 도달하면 -> isOpenWidget 데이터를 삭제함.
    if (device.isMobile) {
      sessionStorage.setItem('isOpenWidget', true)
    }
    await widgets.requestPayment({
      orderId: muid,
      orderName,
      customerName: usedRecvAddress.receiverName,
      successUrl: `${window.location.origin}/order/success`,
      failUrl: `${window.location.origin}/order/fail`
    })
  } catch (error) {
    // api 별 에러
    // @link https://docs.tosspayments.com/reference/error-codes#%EC%BD%94%EC%96%B4-api-%EB%B3%84-%EC%97%90%EB%9F%AC
    // 모바일이 아니거나(redirect 버전이 아니거나), 에러 코드가 USER_CANCEL인 경우에는 custom error message 띄움.
    if (!device.isMobile && error.code === 'USER_CANCEL') {
      appStore().setDialogDTO({
        message: '결제 진행을 취소했습니다.\n남은 재고가 한정적이니 주문을 서둘러주세요!',
        timeout: 4
      })
      // sessionStorage.removeItem('isOpenWidget')
    } else {
      if (error.code === 'USER_CANCEL') {
        appStore().setDialogDTO({
          message: '결제 진행을 취소했습니다.\n남은 재고가 한정적이니 주문을 서둘러주세요!',
          timeout: 4
        })
        sessionStorage.removeItem('isOpenWidget')
        return
      }
      appStore().setDialogDTO({
        message: error.message,
        timeout: 4
      })
    }
  }
}

onMounted(() => {
  if (device.isMobile && sessionStorage.getItem('isOpenWidget')) {
    appStore().setDialogDTO({
      message: '결제 진행을 취소했습니다.\n남은 재고가 한정적이니 주문을 서둘러주세요!',
      timeout: 4
    })
    sessionStorage.removeItem('isOpenWidget')
  }

  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '주문하기',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })

  // 결제 금액 계산
  let amount = 0
  orderItemList.value.forEach((e) => {
    amount += e.priceSet
  })
  prodAmount.value = amount

  // 주소지 데이터
  if (piniaUserStore.getCheckedAddress.addrId !== 0) {
    originAddress.value = piniaUserStore.getCheckedAddress
    selectedMsg.value = originAddress.value.msg

    if (msgList.value.findIndex((e) => e === piniaUserStore.getCheckedAddress.msg) === -1) {
      selectedMsg.value = '직접 입력'
      ownMsg.value = piniaUserStore.getCheckedAddress.msg
    }
  } else if (addressObj.data.value.data.length > 0) {
    const defaultAddrIdx = addressObj.data.value.data.findIndex((e) => e.defaultFlag)

    originAddress.value = addressObj.data.value.data[defaultAddrIdx]
    selectedMsg.value = addressObj.data.value.data[defaultAddrIdx].msg

    if (msgList.value.findIndex((e) => e === addressObj.data.value.data[defaultAddrIdx].msg) === -1) {
      selectedMsg.value = '직접 입력'
      ownMsg.value = addressObj.data.value.data[defaultAddrIdx].msg
    }
  }

  amplitude.track('order_pv', {
    prodid: orderItemList.value.map((e) => e.prodId),
    name: orderItemList.value.map((e) => e.name),
    pricetotal: prodAmount.value,
    pricetotal_final: paiedAmount.value,
    itemtotalnumber: orderItemList.value.length,
    clickedpage: route.query.hp ?? ''
  })
})

onUnmounted(() => {
  window.scrollTo(0, 0)
  appStore().closeDialogDTO()
})
</script>
