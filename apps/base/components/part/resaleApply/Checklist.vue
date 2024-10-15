<template>
  <div class="bg-white py-10">
    <div class="px-5 pb-15">
      <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">{{ data.contents.tag }}</p>
      <h2 class="display-1-b mt-4 whitespace-pre-line" :style="setTextColor(data.contents.titleColor)">{{ data.contents.title }}</h2>

      <div class="my-6 flex space-x-1 py-4 pl-4 pr-4" :style="{ backgroundColor: data.contents.noticeBgColor }">
        <i class="rb-info text-24xl" :style="setTextColor(data.contents.noticeTextColor)"></i>
        <div>
          <p class="subhead-3-b" :style="setTextColor(data.contents.noticeTextColor)">{{ data.contents.noticeTitle }}</p>
          <p class="body-1-r mt-1" :style="setTextColor(data.contents.noticeTextColor)">{{ data.contents.noticeBody }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <p class="subhead-3-b text-black">제품 기준</p>
        <div v-for="(item, index) in data.contents.standardList" :key="index" class="flex space-x-1 md:cursor-pointer" @click="() => toggleStandard(item)">
          <i
            class="text-24xl"
            :class="{
              'rb-checkbox-active text-black ': selectedStandards.findIndex((e) => e.text == item.text) > -1,
              'rb-checkbox-inactive text-rgray-100': selectedStandards.findIndex((e) => e.text == item.text) == -1
            }"
          ></i>
          <p
            class="subhead-3-b my-auto"
            :class="{
              'text-black ': selectedStandards.findIndex((e) => e.text == item.text) > -1,
              'text-rgray-300': selectedStandards.findIndex((e) => e.text == item.text) == -1
            }"
          >
            {{ item.text }}
          </p>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <p class="subhead-3-b text-black">정책 사항</p>
        <div v-for="(item, index) in data.contents.ruleList" :key="index" class="flex space-x-1 md:cursor-pointer" @click="() => toggleRules(item)">
          <i
            class="text-24xl"
            :class="{
              'rb-checkbox-active text-black ': selectedRules.findIndex((e) => e == item) > -1,
              'rb-checkbox-inactive text-rgray-100': selectedRules.findIndex((e) => e == item) == -1
            }"
          ></i>
          <p
            class="subhead-3-b my-auto"
            :class="{
              'text-black ': selectedRules.findIndex((e) => e == item) > -1,
              'text-rgray-300': selectedRules.findIndex((e) => e == item) == -1
            }"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </div>

    <!-- plz check bottom sheet -->
    <AppModalBottomSheet :is-open="isPlzCheckDialog" @update-open="togglePlzCheckDialog">
      <div class="px-5">
        <div class="flex space-x-1">
          <i class="rb-info text-32xl text-black"></i>
          <p class="display-1-b my-auto text-black">{{ data.contents.impossibleDialog.title }}</p>
        </div>

        <p class="body-2-r mt-4 text-rgray-600">{{ data.contents.impossibleDialog.body }}</p>

        <div class="mb-6 space-y-4 divide-y divide-rgray-100">
          <div v-for="(item, index) in data.contents.impossibleDialog.list" :key="index" class="flex space-x-2 pt-4">
            <img :src="item.imgUrl" class="h-22 w-22 object-cover" />
            <div class="p-1" style="width: calc(100% - 96px)">
              <p class="caption-2-b w-fit bg-rgray-100 px-1 text-black">{{ item.tag }}</p>
              <p class="subhead-2-b mt-2 whitespace-pre-line text-black">{{ item.text }}</p>
            </div>
          </div>
        </div>

        <div class="w-full bg-white py-2">
          <button class="btn-h56-r28-fill-wfull" @click="toggleImpossibleDialog">네, 확인했어요!</button>
        </div>
      </div>
    </AppModalBottomSheet>

    <div id="bottomFixedButton" class="fixed bottom-0 left-0 w-full bg-white px-5 pb-2 pt-2 ios-safe-area md:left-auto md:max-w-pc md:pb-4" style="z-index: 998">
      <button class="btn-h56-r28-fill-wfull" @click="goToNext">{{ data.contents.nextStepButtonText }}</button>
    </div>
  </div>
</template>

<script setup>
// 판매신청하기 페이지 내의 1단계인 브랜드 타일 컴포넌트입니다.
// 24.04.08 기준 NSR,Greenforet에서 사용중입니다.
// 모든 정보는 DB로부터 받아옵니다.
// 판매 가능 조건에 대한 정보를 설명하는 ImpossibleBottomSheet가 있습니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  step: {
    type: Number,
    required: true
  }
})

const selectedStandards = ref([])
const selectedRules = ref([])
const isPlzCheckDialog = ref(false)

const togglePlzCheckDialog = () => {
  isPlzCheckDialog.value = !isPlzCheckDialog.value
}

const toggleImpossibleDialog = () => {
  const findIdx = props.data.contents.standardList.findIndex((e) => e.isDialogPortal === true)

  selectedStandards.value.push(props.data.contents.standardList[findIdx])
  togglePlzCheckDialog()
}

const toggleStandard = (item) => {
  const findIdx = selectedStandards.value.findIndex((e) => e.text === item.text)
  if (findIdx > -1) selectedStandards.value.splice(findIdx, 1)
  else if (item.isDialogPortal === true) {
    // open dialog
    togglePlzCheckDialog()
  } else {
    selectedStandards.value.push(item)
  }
}

const toggleRules = (item) => {
  const findIdx = selectedRules.value.findIndex((e) => e === item)
  if (findIdx > -1) selectedRules.value.splice(findIdx, 1)
  else selectedRules.value.push(item)
}

const setTextColor = (color) => {
  return {
    color
  }
}

const emit = defineEmits(['goToPrev', 'goToNext'])

// function goToPrevious() {
//   emit('goToPrev', props.step)
// }

// FIXME: 빈 if문 수정 필요.
const goToNext = () => {
  if (selectedStandards.value.length !== props.data.contents.standardList.length) {
    // 체크 다 안함!
  } else if (selectedRules.value.length !== props.data.contents.ruleList.length) {
    // 체크 다 안함!
  } else {
    // go to next
    amplitude.track('condNext_click')
    emit('goToNext', props.step)
  }
}

onMounted(() => {
  amplitude.track('condCheck_pv')
})
</script>
