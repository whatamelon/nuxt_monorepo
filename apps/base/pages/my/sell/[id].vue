<template>
  <div class="pb-32">
    <div class="w-full bg-black p-5">
      <div class="flex justify-between">
        <div class="flex space-x-2">
          <p class="body-2-r text-white">판매번호</p>
          <p class="subhead-3-b text-white">{{ data.data.ipuId }}</p>
        </div>

        <p class="body-1-r my-auto text-rgray-200">{{ formatDateReplace(data.data.sellDate) }}</p>
      </div>
    </div>

    <div class="mt-10 px-5">
      <div class="flex justify-between">
        <p class="headline-b text-black">신청 제품 정보</p>
        <p v-if="data.data.itemList.length > 0" class="subhead-2-b text-black">{{ data.data.itemList.length }}벌</p>
        <p v-else class="subhead-2-b text-black">{{ data.data.itemCount }}벌</p>
      </div>
      <hr class="mb-4 mt-4 w-full border border-black" />

      <div class="-mt-4 mb-4 space-y-4 divide-y divide-rgray-100">
        <div v-for="item in data.data.itemList" :key="item" class="pt-4">
          <p
            class="caption-2-b w-fit px-2 py-0.5"
            :class="{
              'bg-rgray-100 text-rgray-600': badgeColor(item.status) == 'hold',
              'bg-black text-white': badgeColor(item.status) == 'action',
              'bg-orange-100 text-orange-600': badgeColor(item.status) == 'cancel'
            }"
          >
            {{ formatItemStatus(item.status) }}
          </p>

          <div class="mt-2 flex space-x-2">
            <div class="space-y-1" style="width: calc(100% - 72px)">
              <p class="caption-2-b line-clamp-1 text-black">{{ item.snCode }}</p>
              <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
              <p class="body-1-r line-clamp-2 text-black">{{ item.itemName }}</p>

              <p class="subhead-2-b text-black"><span class="body-1-r">보상 포인트</span> {{ formatWonNoBlank(item.credit) }}원</p>
            </div>
            <div class="">
              <img :src="item.imgLinkTh" class="h-auto w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16 px-5">
      <p class="headline-b text-black">수거지 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6">
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">수령인</p>
          <p class="body-1-r w-[calc(100%-100px)] text-black">{{ data.data.senderName }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">주소</p>
          <p class="body-1-r w-[calc(100%-100px)] text-black">({{ data.data.senderAddr.addrCode }}) {{ data.data.senderAddr.addr0 }} {{ data.data.senderAddr.addr1 }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">휴대전화번호</p>
          <p class="body-1-r w-[calc(100%-100px)] text-black">{{ formatPhone(data.data.telNo) }}</p>
        </div>
      </div>
    </div>

    <div v-if="data.data.reqCredit != 0 && data.data.resCredit != 0" class="mt-16 px-5">
      <p class="headline-b text-black">포인트 정보</p>
      <hr class="mt-4 w-full border border-black" />

      <div class="mt-6 space-y-6">
        <div v-if="data.data.reqCredit != 0" class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">총 보상 예정<br />포인트</p>
          <p class="body-1-r w-[calc(100%-100px)] text-black">{{ formatWonNoBlank(data.data.reqCredit) }}원</p>
        </div>
        <div v-if="data.data.resCredit != 0" class="flex space-x-4">
          <p class="subhead-2-b w-24 text-rgray-400">총 보상 포인트</p>
          <p class="body-1-r w-[calc(100%-100px)] text-black">{{ formatWonNoBlank(data.data.resCredit) }}원</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 마이페이지 > 판매리스트 > 판매 상세
import { getResaleDetailAPI } from '~/composables/apiFactories/sell'

const route = useRoute()

const { data, error, execute } = await getResaleDetailAPI(route.params.id)

if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
  appStore().setDialogDTO({
    message: '현재 판매상세 조회가 불가합니다. 판매에 관련된 정보는 고객센터로 문의해주세요.',
    timeout: 3
  })
}

const badgeColor = (status) => {
  switch (status) {
    case 'b3':
      return 'hold'
    case 'b4':
      return 'hold'
    case 'p0':
      return 'hold'
    case 'p1':
      return 'hold'
    case 'd0':
      return 'hold'
    case 'b0':
      return 'hold'
    case 'c0':
      return 'hold'
    case 'f0':
      return 'cancel'
    case 'f1':
      return 'cancel'
    case 'c1':
      return 'cancel'
    case 'c2':
      return 'cancel'
    case 'c9':
      return 'cancel'
    default:
      return 'action'
  }
}

onMounted(() => {
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '판매 상세',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
