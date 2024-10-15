<template>
  <div>
    <div v-if="innerStep == 'loading'" class="my-10 px-5">
      <AppSpinner class="mx-auto w-fit"></AppSpinner>

      <p class="display-1-b mt-15 text-black">{{ contentsObj.contents.loadingTitle }}</p>
      <p class="body-2-r mt-4 text-rgray-600">{{ contentsObj.contents.loadingBody }}</p>
    </div>

    <div v-else-if="innerStep == 'noOrders'" class="my-10 px-5">
      <IconError class="mx-auto w-fit"></IconError>

      <p class="display-1-b mt-10 text-black">{{ contentsObj.contents.failTitle }}</p>
      <p class="body-2-r mt-4 text-rgray-600">{{ contentsObj.contents.failBody }}</p>

      <button class="mt-15 flex w-fit space-x-1 rounded-2xl border border-rgray-100 bg-white py-1 pl-2 pr-4 text-black" @click="toggleBrandDialog">
        <i class="rb-question-fill my-auto text-base text-black"></i>
        <p class="body-1-r">{{ contentsObj.contents.failCheckBrandButtonText }}</p>
      </button>
    </div>

    <div v-else-if="innerStep == 'orderList'" class="my-10 px-5">
      <p class="caption-2-b text-rgray-400">{{ contentsObj.contents.tag }}</p>
      <h2 class="display-1-b mt-4 whitespace-pre-line text-black">{{ contentsObj.contents.title }}</h2>
      <p class="body-2-r mt-4 whitespace-pre-line text-rgray-600">{{ contentsObj.contents.body }}</p>

      <button class="mt-6 flex h-8 space-x-1 rounded-2xl border border-rgray-100 px-4" @click="toggleBrandDialog">
        <i class="rb-question-fill my-auto text-base text-black"></i>
        <p class="body-1-r my-auto text-black">{{ contentsObj.contents.dontknowTagText }}</p>
      </button>

      <!-- yearList -->
      <div class="mt-16 flex w-full space-x-1 overflow-x-scroll no-scroll">
        <div
          v-for="(yearItem, yearIdx) in orderDates"
          :key="yearIdx"
          class="subhead-2-b h-fit w-fit cursor-pointer rounded-[18px] px-4 py-2"
          :class="{
            'bg-black text-white': selectedYear == yearItem,
            'border border-rgray-100 bg-white text-black': selectedYear != yearItem
          }"
          @click="() => setSelectedYear(yearItem)"
        >
          {{ yearItem }}
        </div>
      </div>

      <!-- order item list -->
      <div class="mt-10 w-full space-y-10 pb-20">
        <div v-for="(orderItem, index) in orderList" :key="index">
          <p class="subhead-3-b text-black">{{ formatDateReplace(orderItem.orderDate) }} 주문 내역</p>
          <hr class="mt-4 border-black" />

          <div class="divide-y divide-gray-100">
            <div v-for="(otem, otemIdx) in orderItem.otemList" :key="otemIdx" class="mt-4 cursor-pointer pt-4 first:mt-0" @click="() => selectOrderItem(otem)">
              <div class="flex w-full space-x-2">
                <i
                  class="text-24xl"
                  :class="{
                    'rb-checkbox-inactive text-rgray-100': itemList.findIndex((e) => e.snCode == otem.snCode) == -1,
                    'rb-checkbox-active text-black': itemList.findIndex((e) => e.snCode == otem.snCode) > -1
                  }"
                ></i>

                <div class="space-y-1">
                  <p class="label-2-r text-rgray-400">{{ otem.subBrandName }}</p>
                  <p class="body-1-r text-black">{{ otem.itemName }}</p>
                  <p class="caption-2-b text-black">{{ otem.optValue }}</p>
                  <span class="flex space-x-1">
                    <p class="subhead-2-b text-green-600">{{ contentsObj.contents.pointWord }}</p>
                    <p class="subhead-2-b text-black">{{ formatWonNoBlank(otem.credit) }} P</p>
                  </span>
                </div>

                <div>
                  <img :src="otem.imgLinkTh" class="h-auto w-[80px]" alt="." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- point -->
      <div v-if="itemList.length > 0" class="pb-20">
        <hr class="border border-black" />

        <div class="flex w-full justify-between py-4">
          <div class="flex">
            <p class="subhead-3-b my-auto text-black">
              총 <span>{{ itemList.length }}</span
              >개 {{ contentsObj.contents.allPointWord }}
            </p>
          </div>

          <p class="headline-b text-green-600">{{ formatWonNoBlank(totalItemPointPlus) }} P</p>
        </div>
      </div>

      <!-- buttons -->
      <div id="bottomFixedButton" class="fixed bottom-0 left-0 flex w-full space-x-1 bg-white px-5 pb-2 pt-2 ios-safe-area md:left-auto md:-ml-5 md:max-w-pc md:pb-4" style="z-index: 998">
        <button class="btn-h56-r28-line-wfull" @click="goToPrevious">이전</button>
        <button class="btn-h56-r28-fill-wfull" @click="goToNext">다음</button>
      </div>
    </div>

    <AppModalBottomSheet :is-open="isBrandListDialog" @update-open="toggleBrandDialog">
      <div class="relative">
        <p class="display-1-b mt-10 px-5 text-black">{{ contentsObj.contents.possibleBrandDialogTitle }}</p>
        <p class="body-2-r mt-4 px-5 text-rgray-600">{{ contentsObj.contents.possibleBrandDialogBody }}</p>

        <div class="mt-2 h-[344px] space-y-4 overflow-y-scroll px-5">
          <p v-for="(brand, index) in contentsObj.contents.possibleBrandDialogList" :key="index" class="body-2-r text-black">{{ brand }}</p>
        </div>

        <div class="relative bottom-0 w-full bg-white px-5 pt-5">
          <button class="btn-h56-r28-fill-wfull" @click="toggleBrandDialog">닫기</button>
        </div>
      </div>
    </AppModalBottomSheet>
  </div>
</template>

<script setup>
// 판매신청하기 페이지 내의 2단계인 브랜드 커머스 주문리스트 컴포넌트입니다.
// 24.04.08 기준 Greenforet에서 사용중입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 사용자가 브랜드 커머스에서 주문한 상품을 가져와서 판매신청할 상품을 선택하는 UX입니다.
import * as amplitude from '@amplitude/analytics-browser'
import { getResaleOrderlistAPI } from '~/composables/apiFactories/sell'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  sncodeList: {
    type: Array,
    required: false
  },
  step: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['goToPrev', 'goToNext', 'putSncodeList'])

const contentsObj = ref(props.data)
const itemList = ref([])
const orderDates = ref([])
const orderList = ref([])
const rawOrderList = ref([])
const selectedYear = ref('')
const innerStep = ref('loading') // loading, noOrders, orderList
const isBrandListDialog = ref(false)
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

const totalItemPointPlus = computed(() => {
  let point = 0
  itemList.value.forEach((e) => {
    point += e.credit
  })
  return point
})

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

const setSelectedYear = (year) => {
  selectedYear.value = year
  if (year === '전체') {
    orderList.value = rawOrderList.value
  } else {
    orderList.value = rawOrderList.value.filter((e) => {
      return e.orderDate.slice(0, 4) === year
    })
    // itemList.value = orderList.value.filter(e => e.orderDate.slice(0,4) == year);
  }
}

const selectOrderItem = (item) => {
  const findIndex = itemList.value.findIndex((e) => e.snCode === item.snCode)
  if (findIndex > -1) {
    itemList.value.splice(findIndex, 1)
  } else {
    itemList.value.push(item)
  }
}

const getOrderList = async () => {
  const orderListObj = await getResaleOrderlistAPI()
  if (orderListObj.pending === true) {
    innerStep.value = 'loading'
  } else if (orderListObj.error.value != null) {
    innerStep.value = 'noOrders'
    amplitude.track('proIDCheck_click', { result: 'bad_none' })
    useRetryError(orderListObj.error.value.data.statusCode, orderListObj.execute)
  } else if (orderListObj.data.value.statusCode === 200) {
    if (orderListObj.data.value.data.totCnt === 0) {
      innerStep.value = 'noOrders'
    } else {
      rawOrderList.value = orderListObj.data.value.data.orderList
      orderList.value = orderListObj.data.value.data.orderList
      orderListObj.data.value.data.orderDates.unshift('전체')
      orderDates.value = orderListObj.data.value.data.orderDates
      selectedYear.value = orderDates.value[0]
      innerStep.value = 'orderList'
    }
  } else {
    innerStep.value = 'noOrders'
  }
}

const toggleBrandDialog = () => {
  isBrandListDialog.value = !isBrandListDialog.value
}

const goToPrevious = () => {
  emit('goToPrev', props.step)
}

const goToNext = () => {
  amplitude.track('proIDNext_click')
  if (itemList.value.length === 0) {
    setErrorObj({
      code: 'no_item',
      msg: '판매하실 상품을 추가해주세요.',
      time: 5000
    })
  } else {
    amplitude.track('proIDCheck_click', {
      result: 'good',
      proID: itemList.value.map((e) => {
        return e.snCode
      })
    })
    emit('putSncodeList', itemList.value)
    emit('goToNext', props.step)
  }
}

onMounted(async () => {
  await getOrderList()
})
</script>
