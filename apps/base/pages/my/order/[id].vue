<template>
  <div class="pb-32">
    <div class="w-full bg-black p-5">
      <div class="flex justify-between">
        <div class="flex space-x-2">
          <p class="body-2-r text-white">주문번호</p>
          <p class="subhead-3-b text-white">{{ data.data.salesId }}</p>
        </div>

        <p class="body-1-r my-auto text-rgray-200">{{ formatDateFullForUTC(data.data.payDate) }}</p>
      </div>
    </div>

    <div class="mt-10 px-5">
      <p class="headline-b text-black">주문상품정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="space-y-4 divide-y divide-rgray-100 first:mt-0">
        <div v-for="item in data.data.spList" :key="item" class="pt-4">
          <p
            class="caption-2-b w-fit px-2 py-0.5"
            :class="{
              'bg-rgray-100 text-rgray-600': badgeColor(item.status) == 'hold',
              'bg-black text-white': badgeColor(item.status) == 'action',
              'bg-orange-100 text-orange-600': badgeColor(item.status) == 'cancel'
            }"
          >
            {{ formatSalesStatus(item.status) }}
          </p>

          <div class="flex gap-4 pt-2">
            <div class="space-y-1" style="width: calc(100% - 72px)">
              <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
              <p class="body-1-r line-clamp-2 text-black">{{ item.name }}</p>

              <div class="caption-2-b space-x-1 text-black">
                <span v-for="(opt, optIdx) in item.optCode.split(':')" :key="opt">{{ formatOptionValue(opt) }} {{ optIdx == item.optCode.split(':').length - 1 ? '' : '/' }} </span>
              </div>

              <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.priceSet) }}원</p>
            </div>
            <NuxtImg width="60px" height="90px" :src="item.imgLink" class="object-contain" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16 px-5">
      <p class="headline-b text-black">배송지 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6">
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">수령인</p>
          <p class="body-1-r w-[calc(100%-96px)] text-black">{{ data.data.receiveAddress.receiverName }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">주소</p>
          <p class="body-1-r w-[calc(100%-96px)] text-black">({{ data.data.receiveAddress.addrCode }}) {{ data.data.receiveAddress.addr0 }} {{ data.data.receiveAddress.addr1 }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">휴대전화번호</p>
          <p class="body-1-r w-[calc(100%-96px)] text-black">{{ formatPhone(data.data.receiveAddress.telNo) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">배송메시지</p>
          <p class="body-1-r w-[calc(100%-96px)] text-black">{{ data.data.receiveAddress.msg }}</p>
        </div>
      </div>
    </div>

    <div class="mt-16 px-5">
      <p class="headline-b text-black">결제 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6">
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">주문번호</p>
          <p class="body-1-r text-black">{{ data.data.salesId }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">결제일시</p>
          <p class="body-1-r text-black">{{ formatDateFullForUTC(data.data.payDate) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">결제방법</p>
          <p class="body-1-r text-black">{{ formatPayment(data.data.payMethod) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">상품금액</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.totalAmount) }}원</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">배송비</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.deliAmount) }}원</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">포인트사용</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.pointAmount) }}원</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">결제금액</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.payAmount) }}원</p>
        </div>
      </div>
    </div>

    <div v-if="data.data.returnPayments.length > 0" class="mt-16 px-5">
      <p class="headline-b text-black">반품(취소) 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6 divide-y divide-rgray-100">
        <div v-for="returnProd in data.data.returnPayments" :key="returnProd" class="space-y-4 pt-4 first:pt-0">
          <div class="flex space-x-4">
            <p class="subhead-2-b w-24 text-rgray-400">상품명</p>
            <div class="w-[calc(100%-96px)] space-y-1">
              <p v-for="prodName in returnProd.prodNames" :key="prodName" class="body-1-r text-black">{{ prodName }}</p>
            </div>
          </div>

          <div class="flex space-x-4">
            <p class="subhead-2-b w-24 text-rgray-400">반품요청 일시</p>
            <p class="body-1-r text-black">{{ formatDateFullForUTC(returnProd.returnDate) }}</p>
          </div>
          <div class="flex space-x-4">
            <p class="subhead-2-b w-24 text-rgray-400">환불방법</p>
            <p class="body-1-r text-black">{{ formatPayMethod(returnProd.returnMethod) }}</p>
          </div>
          <div class="flex space-x-4">
            <p class="subhead-2-b w-24 text-rgray-400">환불금액</p>
            <p class="body-1-r text-black">{{ formatWonNoBlank(returnProd.returnAmount) }}원</p>
          </div>
          <div class="flex space-x-4">
            <p class="subhead-2-b w-24 text-rgray-400">환불포인트</p>
            <p class="body-1-r text-black">{{ formatWonNoBlank(returnProd.returnPoint) }}원</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16 px-5">
      <p class="headline-b text-black">최종 결제 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6">
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">최종 결제금액</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.fnPayAmount) }}원</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">최종 포인트사용</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.fnPointAmount) }}원</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">최종 배송비</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(data.data.fnDeliAmount) }}원</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 마이페이지 > 주문리스트 > 주문 상세
import { showChannelButton } from '@channel.io/channel-web-sdk-loader'
import { getOrderDetailAPI } from '~/composables/apiFactories/sales'

const route = useRoute()

const { data, error, execute } = await getOrderDetailAPI(route.params.id)

if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
  appStore().setDialogDTO({
    message: '현재 주문상세 조회가 불가합니다. 주문에 관련된 정보는 고객센터로 문의해주세요.',
    timeout: 3
  })
}

const badgeColor = (status) => {
  switch (status) {
    case '11':
      return 'action'
    case '40':
      return 'action'
    case '80':
      return 'cancel'
    case '81':
      return 'cancel'
    default:
      return 'hold'
  }
}

onMounted(() => {
  showChannelButton()
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '주문 상세',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
