<template>
  <div>
    <h2 class="headline-b pb-4 text-black">포인트</h2>

    <hr class="border border-black" />

    <div class="mt-6 flex space-x-1">
      <input
        v-model="usedPoint"
        type="number"
        style="width: calc(100% - 100px)"
        class="subhead-2-b border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
        @input="setPoint($event)"
        @mousewheel.prevent=""
        @keyup="checkPointValue($event)"
      />

      <button v-if="usedPoint == 0" style="height: 54px" class="subhead-2-b w-24 rounded-none border border-solid border-black bg-white text-black" @click="useMaxPoint">최대사용</button>
      <button v-else style="height: 54px" class="subhead-2-b w-24 rounded-none border border-solid border-black bg-white text-black" @click="resetPoint">취소</button>
    </div>
    <p class="label-2-r mt-0.5 pl-1 text-black">
      사용가능 <span class="caption-2-b">{{ formatWonNoBlank(usedPoints) }}P</span>
    </p>
  </div>
</template>

<script setup>
// 주문서 포인트 사용 컴포넌트입니다.
// 포인트의 사용은 주문서 페이지로 들어올때, 유저 정보를 받아오고, 이때 받아온 포인트값에 대해서 최대사용 혹은 원하는 만큼 사용할 수 있는 기능을 제공합니다.
// input type이 number값으로 포인트 입력시마다 값을 유저의 포인트값과 비교해서 입력 가능여부를 체크합니다.
const props = defineProps({
  userPoint: {
    type: Number,
    required: true
  },
  usedPoint: {
    type: Number,
    required: true
  }
})

const prodAmount = ref(0)
const allPoint = ref(props.userPoint)
const usedPoint = ref(props.usedPoint)

const usedPoints = computed(() => {
  if (props.userPoint > usedPoint.value) {
    return allPoint.value - usedPoint.value
  }
  return 0
})

const emit = defineEmits(['onChange'])

const resetPoint = () => {
  usedPoint.value = 0
  emit('onChange', 0)
}

const useMaxPoint = () => {
  if (allPoint.value + 1000 > prodAmount.value) {
    usedPoint.value = prodAmount.value - 1000
    emit('onChange', prodAmount.value - 1000)
  } else {
    usedPoint.value = allPoint.value
    emit('onChange', allPoint.value)
  }
}

const setPoint = ($event) => {
  emit('onChange', Number($event.target.value))
}

const checkPointValue = ($event) => {
  if (usedPoint.value > prodAmount.value - 1000) {
    $event.preventDefault()
    usedPoint.value = prodAmount.value - 1000
    emit('onChange', usedPoint.value)
  }
  if (usedPoint.value > allPoint.value) {
    $event.preventDefault()
    usedPoint.value = allPoint.value
    emit('onChange', usedPoint.value)
  }
}

if (process.client) {
  let amount = 0
  JSON.parse(localStorage.getItem('orderItemList')).forEach((e) => {
    amount += e.priceSet
  })

  prodAmount.value = amount
}
</script>
