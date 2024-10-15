<template>
  <div class="flex space-x-2">
    <div v-if="option.grade != '' && appStore().getDomain == 'orm'" class="flex h-full">
      <img v-if="option.grade == 'AP'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_AP.png" class="my-auto h-5 w-5" />
      <img v-if="option.grade == 'A'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_A.png" class="my-auto h-5 w-5" />
      <img v-if="option.grade == 'BP'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_BP.png" class="my-auto h-5 w-5" />
    </div>

    <p v-if="option.option != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.option }}</p>
    <p v-if="option.color != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.color.split('#')[0] }} /</p>
    <p v-if="option.size != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.size }}</p>
  </div>
  <div class="flex flex-col items-end justify-center">
    <div class="flex space-x-1">
      <p class="subhead-2-b my-auto text-[#01A46D]" :style="option.isAddDiscount && { color: `#${option.badgeColor}` }">{{ option.priceSetRate }}%</p>
      <p class="subhead-2-b my-auto text-black">{{ formatWon(option.priceSet) }}원</p>
    </div>
    <p v-if="isShowDiscountComment && option.isAddDiscount" class="caption-2-b" :style="{ color: `#${option.badgeColor}` }">
      {{ formatDaysRemain(option.duDate) }} {{ formatWon(option.priceStd - option.priceSet) }}원 추가 할인 종료
    </p>
  </div>
</template>

<script setup>
// 상품상세페이지에서 Product 하위 Option값에 대한 정보를 띄워주는 컴포넌트입니다.
// 해당 컴포넌트에서는 UI 정보만 존재합니다.
defineProps({
  option: {
    type: Object,
    required: true
  },
  isShowDiscountComment: {
    type: Boolean,
    default: false
  }
})
</script>
