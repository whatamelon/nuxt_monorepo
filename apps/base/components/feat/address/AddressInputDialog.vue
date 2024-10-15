<template>
  <div v-if="isOpen" style="z-index: 999" class="fixed top-0 h-screen w-full overflow-auto bg-white no-scroll md:max-w-pc">
    <div class="relative flex h-14 w-full justify-between px-5">
      <i class="rb-arrow-left my-auto text-24xl text-black" @click="close"></i>
      <h1 class="subhead-3-b absolute left-1/2 top-1/2 my-auto -translate-x-1/2 -translate-y-1/2 truncate text-center">
        {{ addressObj.addrId != 0 ? '배송지 수정' : '배송지 추가' }}
      </h1>
      <div class="w-[18px]"></div>
    </div>

    <div class="mt-10 h-full w-full space-y-8 px-5">
      <div class="space-y-3">
        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r my-auto w-16 text-black">수령인<span class="text-orange-600"> *</span></p>

          <div style="width: calc(100% - 76px)">
            <input
              v-model="addressObj.receiverName"
              type="text"
              class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              :class="{
                'border-orange-600': errorObj.code == 'no_receiverName'
              }"
              placeholder="이름을 입력해주세요."
            />
            <p v-if="errorObj.code == 'no_receiverName'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
          </div>
        </div>

        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r my-auto w-16 text-black">연락처<span class="text-orange-600"> *</span></p>

          <div style="width: calc(100% - 76px)">
            <input
              v-model="addressObj.telNo"
              type="text"
              class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              :class="{
                'border-orange-600': errorObj.code == 'no_telNo'
              }"
              placeholder="휴대폰 번호를 입력해주세요 (-없이)"
            />
            <p v-if="errorObj.code == 'no_telNo'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
          </div>
        </div>

        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r my-auto w-16 text-black">우편번호<span class="text-orange-600"> *</span></p>

          <div class="flex space-x-1" style="width: calc(100% - 76px)">
            <div class="w-full">
              <input
                v-model="addressObj.addrCode"
                type="text"
                disabled
                class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
                :class="{
                  'border-orange-600': errorObj.code == 'no_addrCode'
                }"
                @click="searchPostcode"
              />
              <p v-if="errorObj.code == 'no_addrCode'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
            </div>

            <button class="btn-h48-r0-fill-wfull-gray shrink-0" @click="searchPostcode">우편번호 찾기</button>
          </div>
        </div>

        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r my-auto w-16 text-black">주소지<span class="text-orange-600"> *</span></p>

          <input
            id="addr1"
            v-model="addressObj.addr0"
            type="text"
            style="width: calc(100% - 76px)"
            disabled
            class="subhead-2-b h-12 border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
            @click="searchPostcode"
          />
        </div>
        <div id="postcodeEmbed"></div>
        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r my-auto w-16 text-black">상세주소<span class="text-orange-600"> *</span></p>

          <div style="width: calc(100% - 76px)">
            <input
              id="addr1"
              v-model="addressObj.addr1"
              type="text"
              class="subhead-2-b h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              :class="{
                'border-orange-600': errorObj.code == 'no_addr1'
              }"
              placeholder="상세주소 입력"
            />
            <p v-if="errorObj.code == 'no_addr1'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
          </div>
        </div>

        <div class="flex w-full justify-between space-x-2">
          <p class="body-1-r h-12 w-16 py-1 text-black" style="word-break: keep-all">배송 요청사항</p>

          <div style="width: calc(100% - 76px)">
            <div class="flex h-12 w-full justify-between border border-solid px-4 md:cursor-pointer" :class="dropdownActive ? 'border-black' : 'border-rgray-100'" @click="openDropdown">
              <p v-if="!selectedMsg" class="body-1-r my-auto text-rgray-400">배송요청사항을 입력해주세요.</p>
              <p v-else-if="msgList.find((value) => value === selectedMsg)" class="body-1-r my-auto text-black">{{ selectedMsg }}</p>
              <p v-else class="body-1-r my-auto text-black">직접 입력</p>
              <i class="rb-arrow-down my-auto text-24xl" :class="{ 'rotate-180': dropdownActive }"></i>
            </div>
            <div v-if="dropdownActive" class="static space-y-4 border-x border-b border-black px-4 pb-4">
              <p v-for="(msgs, index) in msgList" :key="index" class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => changeMsg(msgs)">{{ msgs }}</p>
              <p class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => changeMsg('직접 입력')">직접 입력</p>
            </div>

            <input
              v-if="selectedMsg && !msgList.find((value) => value === selectedMsg)"
              v-model="ownMsg"
              type="text"
              class="subhead-2-b mt-2 h-12 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              placeholder="직접 입력 (최대 30자)"
              maxlength="30"
            />
          </div>
        </div>
      </div>
      <div class="mt-8 flex w-fit space-x-1" @click="changeDefaultflag">
        <i class="text-24xl" :class="addressObj.defaultFlag ? 'rb-checkbox-active' : 'rb-checkbox-inactive'"></i>
        <p class="subhead-2-b my-auto text-black">기본 배송지로 설정</p>
      </div>

      <button class="btn-h60-r30-fill-wfull" @click="addAddress">저장하기</button>
    </div>
  </div>
</template>

<script setup>
// 배송지 추가, 수정 다이얼로그
// 전체화면으로 구성됨.
// originAddress값을 통해 주소 수정인지 추가인지 결정합니다.
import { addAddressAPI, updateAddressAPI } from '~/composables/apiFactories/user'

useHead({
  script: [
    {
      src: 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    }
  ]
})

const props = defineProps({
  originAddress: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['closeDialog'])

watch(
  () => props.originAddress,
  (to) => {
    addressObj.value = { ...to }
    /**
     * ## 배송 메세지 경우의 수 (현재 코드로 관리되지 않음)
     *    => FIXME: 추후 공통코드로 관리가 되면 좋은데, 백엔드의 협력이 필요할 것으로 예상됨.
     *
     * 1. 입력하지 않은 경우,
     *    - 배송요청사항을 입력해주세요 -> placeholder 보임
     *    - selectedMsg.value = ''
     *    - ownMsg.value = ''
     * 2. 정해진 데이터(msgList)를 등록한 경우,
     *    - selectedMsg에 입력 된 메세지 보임
     *    - selectedMsg.value = msgList.value 리스트 데이터 중 하나
     *    - ownMsg.value = ''
     * 3. 직접 입력한 경우,
     *    - ownMsg에 입력 된 메세지 보임
     *    - selectedMsg.value = 커스텀 메세지
     *    - ownMsg.value = 커스텀 메세지
     *
     * ## 결론
     *
     * 1. 기본적으로 props로 받아온 메세지를 selectedMsg.value에 대입
     * 2. 만약, 메세지가 빈 값(selectedMsg.value)이 아니고(&&),
     *    정해진 데이터가 아닌 경우(!msgList.value.find((value) => value === selectedMsg.value))
     *    => 직접 입력한 경우임!! props로 받아온 메세지를 ownMsg.value에 대입
     */
    selectedMsg.value = addressObj.value.msg
    if (selectedMsg.value && !msgList.value.find((value) => value === selectedMsg.value)) {
      ownMsg.value = addressObj.value.msg
    }
  }
)

const addressObj = ref()
const dropdownActive = ref(false)
const selectedMsg = ref('')
const ownMsg = ref('')
const msgList = ref(['부재 시 경비실에 맡겨주세요', '부재 시 택배함에 넣어주세요', '부재 시 집 앞에 놔주세요', '배송 전 연락바랍니다'])

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

const changeMsg = (msg) => {
  selectedMsg.value = msg
  dropdownActive.value = false
}

const openDropdown = () => {
  dropdownActive.value = !dropdownActive.value
}

const changeDefaultflag = () => {
  addressObj.value.defaultFlag = !addressObj.value.defaultFlag
}

const searchPostcode = () => {
  const elementWrap = document.getElementById('postcodeEmbed')
  if (elementWrap.style.display === 'block') {
    elementWrap.style = ''
    return
  }
  elementWrap.style.display = 'block'

  new daum.Postcode({
    oncomplete: (data) => {
      addressObj.value.addrCode = data.zonecode
      addressObj.value.addr0 = data.address
      addressObj.value.addr1 = ''

      elementWrap.style = ''
    },
    onresize: (size) => {
      elementWrap.style.height = `${size.height}px`
    },
    width: '100%',
    height: '100%'
  }).embed(elementWrap)
}

const addAddress = async () => {
  const telRegex = /[0-9]{9,11}/
  if (addressObj.value.receiverName === '') {
    setErrorObj({
      code: 'no_receiverName',
      msg: '필수입력 정보입니다.',
      time: 3000
    })
  } else if (addressObj.value.telNo === '') {
    setErrorObj({
      code: 'no_telNo',
      msg: '필수입력 정보입니다.',
      time: 3000
    })
  } else if (!telRegex.test(addressObj.value.telNo)) {
    setErrorObj({
      code: 'no_telNo',
      msg: '올바르지 않은 형태의 연락처입니다.',
      time: 3000
    })
  } else if (addressObj.value.addrCode === '') {
    setErrorObj({
      code: 'no_addrCode',
      msg: '필수입력 정보입니다.',
      time: 3000
    })
  } else if (addressObj.value.addr1 === '') {
    setErrorObj({
      code: 'no_addr1',
      msg: '필수입력 정보입니다.',
      time: 3000
    })
  } else {
    const obj = addressObj.value
    if (selectedMsg.value && !msgList.value.find((value) => value === selectedMsg.value)) obj.msg = ownMsg.value
    else obj.msg = selectedMsg.value

    if (addressObj.value.addrId !== 0 && addressObj.value.addrId !== undefined) {
      const updateAddrObj = await updateAddressAPI({
        id: addressObj.value.addrId,
        body: obj
      })
      if (updateAddrObj.error.value != null) {
        useRetryError(updateAddrObj.error.value.data.statusCode, updateAddrObj.execute)
      }
    } else {
      delete obj.addrId
      const addAddrObj = await addAddressAPI(obj)
      if (addAddrObj.error.value != null) {
        useRetryError(addAddrObj.error.value.data.statusCode, addAddrObj.execute)
      }
    }
    close()
  }
}

const close = () => {
  dropdownActive.value = false
  selectedMsg.value = ''
  ownMsg.value = ''
  emit('closeDialog', false)
}
</script>
