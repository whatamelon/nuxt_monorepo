<template>
  <div class="flex space-x-2 bg-rgray-50">
    <div v-if="option.grade != '' && appStore().getDomain == 'orm'" class="flex h-full">
      <img v-if="option.grade == 'AP'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_AP.png" class="my-auto h-5 w-5" />
      <img v-if="option.grade == 'A'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_A.png" class="my-auto h-5 w-5" />
      <img v-if="option.grade == 'BP'" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/grade/small_BP.png" class="my-auto h-5 w-5" />
    </div>

    <p v-if="option.option != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.option }}</p>
    <p v-if="option.color != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.color.split('#')[0] }} /</p>
    <p v-if="option.size != ''" class="subhead-2-b my-auto h-fit text-black">{{ option.size }}</p>
  </div>

  <div class="flex space-x-4">
    <div class="flex space-x-1 bg-rgray-50">
      <p class="subhead-2-b my-auto text-[#01A46D]" :style="isAddDiscount && { color: `#${option.badgeColor}` }">{{ option.priceSetRate }}%</p>
      <p class="subhead-2-b my-auto text-black">{{ formatWon(option.priceSet) }}원</p>
    </div>

    <button class="my-auto flex h-5 w-5 rounded-full bg-rgray-200 md:cursor-pointer" @click="remove">
      <i class="rb-close m-auto text-sm text-black"></i>
    </button>
  </div>
</template>

<script setup>
// 상품상세페이지, 주문하기를 누르면 나오는 바텀시트에서 Product 하위 Option값에 대한 정보를 띄워주는 컴포넌트입니다.
// 선택을 하고, 선택취소를 할 수 있습니다.
const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  isAddDiscount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove'])

const remove = () => {
  emit('remove', props.option)
}
</script>
