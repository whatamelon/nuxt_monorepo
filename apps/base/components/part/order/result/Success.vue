<template>
  <div class="bg-white px-5 pb-32 pt-5">
    <!-- vbank -->
    <div v-if="orderInformation.paymethod === 'vbank' || orderInformation.paymethod === 'VIRTUAL_ACCOUNT'" class="mb-8">
      <h3 class="display-1-b text-center text-black">주문이 확인되었습니다.</h3>

      <div class="mt-8 bg-rgray-50 px-5 py-8">
        <p class="subhead-long-3-b text-center text-black">
          <span class="text-orange-600">{{ orderInformation.due_date }}</span
          >까지<br /><span class="text-orange-600">주문내역</span>에서 입금을 완료해주세요!
        </p>
        <p class="body-1-r mt-2 text-center text-black text-opacity-60">
          * 재고가 하나밖에 없는 중고상품의 특성상,<br />가상 계좌 주문 건의 입금 기한을 1시간으로 제한합니다.<br />이점 고객님들의 너른 양해 부탁드립니다.
        </p>
        <button class="btn-h40-r0-fill-p24 mx-auto mt-6" @click="goToOrderList">
          <p>지금 바로 입금하러 가기</p>
          <i class="rb-arrow-right text-base text-white"></i>
        </button>
      </div>
    </div>

    <!-- card, kakaopay -->
    <div v-else class="mb-8">
      <!-- check -->
      <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none" class="mx-auto">
        <rect width="80" height="80" transform="translate(0.5)" fill="#222222" />
        <path d="M21.5 40L34.5 53L60.5 27" stroke="white" stroke-width="8" />
      </svg>

      <h2 class="display-1-b mt-8 text-center text-black">주문이 완료되었습니다.</h2>

      <hr class="mt-8 w-full border-rgray-100" />
    </div>

    <!-- order ship -->
    <div class="flex space-x-2">
      <p class="subhead-2-b w-20 text-rgray-400">배송지 정보</p>
      <div class="space-y-1">
        <p class="subhead-2-b text-black">{{ orderInformation.name }}</p>
        <p class="body-long-1-r text-black">{{ orderInformation.address }}</p>
        <p class="body-long-1-r text-black">{{ orderInformation.telNo }}</p>
        <p class="body-long-1-r text-black">{{ orderInformation.shipMsg }}</p>
      </div>
    </div>

    <hr class="mt-6 w-full border-rgray-100 pb-6" />

    <!-- order no -->
    <div class="mb-12 flex space-x-2">
      <p class="subhead-2-b w-20 text-rgray-400">주문번호</p>
      <p class="subhead-2-b text-black">{{ orderInformation.salesid }}</p>
    </div>

    <!-- order price -->
    <div>
      <div class="mb-4 flex justify-between md:cursor-pointer" @click="toggleOrderPrice">
        <p class="headline-b my-auto text-black">주문금액</p>

        <div class="flex space-x-4">
          <p class="subhead-2-b my-auto text-black">{{ formatWon(orderInformation.totalamount) }}원</p>
          <i
            class="my-auto text-24xl text-black"
            :class="{
              'rb-arrow-up': openOrderPrice == true,
              'rb-arrow-down': openOrderPrice == false
            }"
          ></i>
        </div>
      </div>
      <hr class="mt-4 border border-black" />

      <div v-if="openOrderPrice == true" class="my-6 space-y-6">
        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 상품금액</p>
          <p class="body-1-r text-black">{{ formatWon(orderInformation.prodamount) }}원</p>
        </div>
        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">총 배송비</p>
          <p class="body-1-r text-black">0원</p>
        </div>
        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">포인트 사용</p>
          <p v-if="orderInformation.usepoint > 0" class="body-1-r text-black">- {{ formatWon(orderInformation.usepoint) }}원</p>
          <p v-else class="body-1-r text-black">0원</p>
        </div>
      </div>
    </div>

    <!-- order pay detail only for card and kakao -->
    <div v-if="orderInformation.paymethod != 'vbank'">
      <div class="mb-4 flex justify-between pt-8 md:cursor-pointer" @click="toggleOrderDetail">
        <p class="headline-b my-auto text-black">결제상세</p>

        <i
          class="my-auto text-24xl text-black"
          :class="{
            'rb-arrow-up': openOrderDetail == true,
            'rb-arrow-down': openOrderDetail == false
          }"
        ></i>
      </div>
      <hr class="mt-4 border border-black" />

      <div v-if="openOrderDetail == true" class="my-6 space-y-6">
        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">결제일시</p>
          <p class="body-1-r text-black">{{ orderInformation.paid_at }}</p>
        </div>
        <div class="flex justify-between">
          <p class="subhead-2-b text-rgray-400">결제방법</p>
          <p class="body-1-r text-black">{{ formatPayment(orderInformation.paymethod) }}</p>
        </div>
      </div>
    </div>

    <!-- product list -->
    <div>
      <div class="mb-4 flex justify-between pt-8 md:cursor-pointer" @click="toggleOrderProductList">
        <p class="headline-b my-auto text-black">주문상품</p>

        <div class="flex space-x-4">
          <p class="subhead-2-b my-auto text-black">{{ orderProductList.length }}건</p>
          <i
            class="text-24xl text-black"
            :class="{
              'rb-arrow-up': openOrderProductList == true,
              'rb-arrow-down': openOrderProductList == false
            }"
          ></i>
        </div>
      </div>
      <hr class="mt-4 border border-black" />

      <div v-if="openOrderProductList == true" class="space-y-4 divide-y divide-rgray-100">
        <div v-for="(item, index) in orderProductList" :key="index" class="flex justify-between gap-4 pt-6">
          <div style="width: calc(100% - 80px)" class="mr-4">
            <div class="space-y-1">
              <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
              <p class="body-1-r line-clamp-3 text-black">{{ item.name }}</p>

              <p class="caption-2-b text-black">
                <span v-if="item.grade != ''">{{ formatOptionValue('g=' + item.grade) }} / </span>
                <span v-if="item.option != ''">{{ formatOptionValue('o=' + item.option) }} / </span>
                <span v-if="item.color != ''">{{ formatOptionValue('c=' + item.color) }} / </span>
                <span v-if="item.size != ''">{{ formatOptionValue('s=' + item.size) }} </span>
              </p>

              <p class="subhead-2-b text-black">
                <span>{{ formatWon(item.priceSet) }}원</span>
              </p>
            </div>
          </div>

          <nuxt-img width="60px" height="90px" :src="item.imgLink" fit="cover" loading="lazy" placeholder class="object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 주문완료페이지에서 결제 성공시에 보여주는 컴포넌트입니다.
const router = useRouter()

defineProps({
  orderInformation: {
    type: Object,
    required: true
  },
  orderProductList: {
    type: Array,
    required: true
  }
})

const openOrderPrice = ref(true)
const openOrderDetail = ref(true)
const openOrderProductList = ref(true)

const toggleOrderPrice = () => {
  openOrderPrice.value = !openOrderPrice.value
}

const toggleOrderDetail = () => {
  openOrderDetail.value = !openOrderDetail.value
}

const toggleOrderProductList = () => {
  openOrderProductList.value = !openOrderProductList.value
}

const goToOrderList = () => {
  router.replace('/my/order')
}
</script>
