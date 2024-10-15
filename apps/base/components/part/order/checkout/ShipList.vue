<template>
  <div class="">
    <h2 id="addShipButton" class="headline-b pb-4 text-black">배송지 정보</h2>

    <hr class="border border-black" />

    <div v-if="addressList.length == 0">
      <button
        class="subhead-2-b btn-h56-r0-line-wfull mt-6"
        :class="{
          'border-orange-600 text-orange-600': errorObj.code == 'no_ship',
          'border-rgray-200 text-black': errorObj.code != 'no_ship'
        }"
        @click="changeAddressInDialog"
      >
        배송지 추가하기
      </button>
      <p v-if="errorObj.code == 'no_ship'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
    </div>

    <div v-else id="shipMsgInput" class="mt-6 space-y-2">
      <div class="flex justify-between">
        <div class="flex items-center space-x-2">
          <p class="subhead-2-b my-auto text-black">{{ selectedAddress.receiverName }}</p>
          <p v-if="selectedAddress.defaultFlag" class="badge-h18-r0-fill-p4-black">기본주소지</p>
        </div>

        <button class="btn-h32-r0-line-p16-gray" @click="changeAddressInDialog">변경</button>
      </div>
      <p class="body-1-r text-black">({{ selectedAddress.addrCode }}) {{ selectedAddress.addr0 }} {{ selectedAddress.addr1 }}</p>
      <p class="body-1-r text-black">{{ formatPhone(selectedAddress.telNo) }}</p>

      <div>
        <div class="flex h-13 w-full justify-between border border-solid px-4" :class="dropdownActive ? 'border-black' : 'border-rgray-100'" @click="open">
          <p v-if="!selectedMsg" class="body-1-r my-auto text-rgray-400">배송요청사항을 입력해주세요.</p>
          <p v-else-if="msgList.find((value) => value === selectedMsg)" class="body-1-r my-auto text-black">{{ selectedMsg }}</p>
          <p v-else class="body-1-r my-auto text-black">직접 입력</p>
          <i class="rb-arrow-down my-auto text-24xl" :class="{ 'rotate-180': dropdownActive }"></i>
        </div>
        <div v-if="dropdownActive" class="static space-y-4 border-x border-b border-black px-4 pb-4">
          <p v-for="(msg, index) in msgList" :key="index" class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => changeShipMsg(msg)">{{ msg }}</p>
          <p class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => changeShipMsg('직접 입력')">직접 입력</p>
        </div>

        <input
          v-if="selectedMsg && !msgList.find((value) => value === selectedMsg)"
          :value="props.ownMsg"
          class="subhead-2-b mt-2 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600 text-orange-600': errorObj.code == 'no_addr_msg'
          }"
          placeholder="직접 입력 (최대 30자)"
          maxlength="30"
          @input="chgMsg($event)"
        />
        <p v-if="errorObj.code == 'no_addr_msg'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 주문서 페이지내의 배송지 정보 컴포넌트입니다.
// 기본적으로 주문서 페이지에 들어오면, 회원 배송지리스트를 받아오고, 그 중에 기본 배송지로 설정된 배송지가 있다면, 해당 배송지를 selectedAddress값으로 매핑합니다.
// 기본배송지가 없다면, 배송지 추가하기 UI를 보여줍니다.
// 해당 컴포넌트에서 배송지 문구를 변경할 수 있습니다.
// 배송지 문구를 변경한다면, 값은 부모페이지와 매핑되어서 emit을 통해 부모페이지에서 변경되는 구조입니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  addressList: {
    type: Object,
    required: true
  },
  selectedAddress: {
    type: Object,
    required: true
  },
  ownMsg: {
    type: String,
    required: true
  },
  errorObj: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['changeShipMsg', 'changeOwnMsg', 'openAddrDialog', 'onChange'])

const dropdownActive = ref(false)
const selectedMsg = ref(props.selectedAddress.msg)
const msgList = ref(['부재 시 경비실에 맡겨주세요', '부재 시 택배함에 넣어주세요', '부재 시 집 앞에 놔주세요', '배송 전 연락바랍니다'])

const chgMsg = ($event) => {
  emit('onChange', $event.target.value)
}

const open = () => {
  dropdownActive.value = !dropdownActive.value
}

const changeShipMsg = (msg) => {
  selectedMsg.value = msg
  dropdownActive.value = false
  emit('changeShipMsg', msg)
}

const changeAddressInDialog = () => {
  amplitude.track('orderpostinput_click')
  const router = useRouter()
  router.push('/address')
}
</script>
