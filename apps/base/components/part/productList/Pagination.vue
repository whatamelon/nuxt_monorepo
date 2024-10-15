<template>
  <div class="mx-auto mt-12 flex w-fit space-x-1">
    <div class="flex h-10 w-10 flex-col justify-center border border-rgray-100 md:cursor-pointer" @click="goPrev">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="mx-auto">
        <path
          d="M11 2L5 8L11 14"
          stroke="#D1D1D1"
          stroke-width="1.5"
          :class="{
            'stroke-rgray-200': pageArray[0] == 1,
            'stroke-black': pageArray[0] != 1
          }"
        />
      </svg>
    </div>

    <div
      v-for="(pages, index) in pageArray"
      :key="index"
      class="body-1-r flex h-10 w-10 flex-col justify-center border md:cursor-pointer"
      :class="{
        'border-black bg-black text-white': page == pages,
        ' border-rgray-100 bg-white text-black': page != pages
      }"
      @click="() => updatePage(pages)"
    >
      <p class="body-2-r text-center">{{ pages }}</p>
    </div>

    <div class="flex h-10 w-10 flex-col justify-center border border-rgray-100 md:cursor-pointer" @click="goNext">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="mx-auto">
        <path
          d="M5 14L11 8L5 2"
          stroke="black"
          stroke-width="1.5"
          :class="{
            'stroke-rgray-200': pageArray[pageArray.length - 1] == totalPage,
            'stroke-black': pageArray[pageArray.length - 1] != totalPage
          }"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
// 구매하기 페이지의 페이지네이션 컴포넌트입니다.
// 최대 5개씩 보여줍니다.
// 각 페이지의 UX에 맞게, 이전, 이후 버튼이 활성,비활성화 됩니다.
const props = defineProps({
  totalPage: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['updatePage'])

const pageArray = computed(() => {
  let list = []
  const startCalc = Math.floor((props.page - 1) / 5) * 5 + 1
  let rangeStart = 0
  let rangeFinish = 0

  if (startCalc < 1) rangeStart = 1
  else rangeStart = startCalc

  if (rangeStart + 4 < props.totalPage) rangeFinish = rangeStart + 4
  else rangeFinish = props.totalPage

  list = Array.from(Array(rangeFinish + 1).keys()).slice(rangeStart, rangeFinish + 1)

  return list
})

const updatePage = (page) => {
  emit('updatePage', page)
}

const goPrev = () => {
  if (pageArray.value[0] !== 1) {
    emit('updatePage', pageArray.value[0] - 1)
  }
}

const goNext = () => {
  if (pageArray.value[pageArray.value.length - 1] !== props.totalPage) {
    emit('updatePage', pageArray.value[pageArray.value.length - 1] + 1)
  }
}
</script>
