<template>
  <form class="bg-white px-5 py-10" @submit.prevent="goToNext">
    <p class="caption-2-b" :style="{ color: data.contents.tagColor }">{{ data.contents.tag }}</p>
    <h2 class="display-1-b my-4 whitespace-pre-line" :style="{ color: data.contents.titleColor }">{{ data.contents.title }}</h2>

    <p class="body-2-r" :style="{ color: data.contents.captionColor }">{{ data.contents.caption }}</p>

    <div class="mt-10 flex w-full justify-between space-x-2">
      <p class="body-1-r my-auto w-16 flex-shrink-0 text-black">수거지<span class="text-orange-600"> *</span></p>

      <div class="flex space-x-1" @click="searchPostcode">
        <div>
          <input
            v-model="addrCode"
            type="text"
            :disabled="true"
            class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
            :class="{
              'border-orange-600': errorObj.code == 'no_addrCode'
            }"
          />
          <p v-if="errorObj.code == 'no_addrCode'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
        </div>

        <button type="button" class="btn-h48-r0-fill-wfull-gray shrink-0">주소 찾기</button>
      </div>
    </div>

    <div class="mt-3 flex justify-end" @click="searchPostcode">
      <input
        id="addr1"
        v-model="addr0"
        type="text"
        style="width: calc(100% - 72px)"
        :disabled="true"
        class="subhead-2-b h-12 border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
      />
    </div>
    <div id="postcodeEmbed2"></div>

    <div
      :class="{
        'pl-0.5': noMeaningRefForAddr == true,
        'p;-0': noMeaningRefForAddr == false
      }"
    ></div>

    <div class="mt-3 flex w-full justify-between space-x-2">
      <p class="body-1-r my-auto w-16 text-black">상세 주소<span class="text-orange-600"> *</span></p>

      <div style="width: calc(100% - 72px)">
        <input
          id="addr2"
          v-model="addr1"
          type="text"
          class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600': errorObj.code == 'no_addr1'
          }"
          placeholder="상세주소 입력"
          @change="changeAddress"
        />
        <p v-if="errorObj.code == 'no_addr1'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
      </div>
    </div>
    <div id="bottomFixedButton" class="fixed bottom-0 left-0 flex w-full space-x-1 bg-white px-5 pt-2 ios-safe-area md:left-auto md:-ml-5 md:max-w-pc" style="z-index: 998">
      <button type="button" class="btn-h56-r28-line-wfull" @click="goToPrevious">이전</button>
      <button type="submit" :disabled="isInputEmpty" class="btn-h56-r28-fill-wfull disabled:bg-gray-200">최종 확인하기</button>
    </div>
  </form>
</template>

<script setup>
// 판매신청하기 페이지 내의 3단계인 주소지 입력 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 다음 주소 API를 사용하고 있습니다.
// 해당 부분은 인라인으로 제공하고 있는데, 이는 인스타그램 인앱브라우저에서 탭열기를 통해 주소를 가져올때, 이슈가 있었던 히스토리가 있습니다.
import * as amplitude from '@amplitude/analytics-browser'
import { setSenderAddressAPI } from '~/composables/apiFactories/sell'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  addrDTO: {
    type: Object,
    required: true
  },
  step: {
    type: Number,
    required: true
  }
})

const piniaAppStore = appStore()
const emit = defineEmits(['goToPrev', 'goToNext', 'putAddress'])

const addrCode = ref(props.addrDTO.addrCode)
const addr0 = ref(props.addrDTO.addr0)
const addr1 = ref(props.addrDTO.addr1)
const noMeaningRefForAddr = ref(false)
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
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

watch(
  () => addr0,
  (current) => {
    if (current) {
      document.getElementById('addr2').focus()
    }
  }
)
const isInputEmpty = computed(() => {
  if (!addrCode.value || !addr0.value || !addr1.value) {
    return true
  }
  return false
})

const open2 = () => {
  noMeaningRefForAddr.value = !noMeaningRefForAddr.value
  document.getElementById('addr2').focus()
}

const searchPostcode = () => {
  const elementWrap = document.getElementById('postcodeEmbed2')
  if (elementWrap.style.display === '' || elementWrap.style.display === 'none') {
    elementWrap.style.display = 'block'
    new daum.Postcode({
      oncomplete: (data) => {
        addrCode.value = data.zonecode
        addr0.value = data.address
        addr1.value = ''
        open2()
        // setTimeout(() => {
        //   document.getElementById('addr1').focus()
        // }, 200)
        elementWrap.style.display = 'none'
      },
      onresize: (size) => {
        elementWrap.style.height = `${size.height}px`
      },
      width: '100%',
      height: '100%'
    }).embed(elementWrap)
  } else if (elementWrap.style.display === 'block') {
    elementWrap.style.display = 'none'
  }
}

/**
 * 주소 저장
 * - 주소 입력 창을 벗어나면 무조건 저장해야 함.
 */
const saveAddress = async () => {
  const senderObj = await setSenderAddressAPI({
    addrCode: addrCode.value,
    addr0: addr0.value,
    addr1: addr1.value
  })
  return senderObj
}

const goToPrevious = async () => {
  // "이전" 버튼 -> 이전으로 이동. 주소 저장
  // 주소 데이터가 있을 때만 저장.
  if (!isInputEmpty.value) {
    const senderObj = await saveAddress()
    if (senderObj.error.value != null) {
      useRetryError(senderObj.error.value.statusCode, senderObj.execute)
    } else {
      emit('goToPrev', props.step)
    }
  } else {
    emit('goToPrev', props.step)
  }
}

const goToNext = async () => {
  if (!addrCode.value || !addr0.value || !addr1.value) {
    setErrorObj({
      code: 'no_address',
      msg: '수거 주소지를 작성해주세요.',
      time: 3000
    })
  } else {
    if (piniaAppStore.getSellType === 'sncode') amplitude.track('hfpostNext_click')
    else amplitude.track('blpostNext_click')

    // "최종 확인하기" 버튼 -> 다음으로 이동. 주소 저장
    const senderObj = await saveAddress()
    if (senderObj.error.value != null) {
      useRetryError(senderObj.error.value.statusCode, senderObj.execute)
    } else {
      changeAddress()
      emit('goToNext', props.step)
    }
  }
}

/**
 * 상세주소까지 입력 완료하면 데이터 동기화.
 * => 주소 입력 창에서 X로 닫기, 혹은 브라우저 뒤로가기를 한 경우에도
 *    저장할 수 있도록 데이터 싱크 맞춰주기 위한 용도.
 */
const changeAddress = () => {
  emit('putAddress', {
    addrCode: addrCode.value,
    addr0: addr0.value,
    addr1: addr1.value
  })
}
</script>
