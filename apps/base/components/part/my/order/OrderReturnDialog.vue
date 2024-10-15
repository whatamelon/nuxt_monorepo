<template>
  <AppModalDialog :is-open="isReturnDialogOpen" :is-full-screen="true" @update-open="close">
    <div class="relative h-screen overflow-y-scroll pb-32">
      <div class="flex w-full justify-between px-5 py-4">
        <div class="w-6"></div>
        <p class="subhead-3-b text-black">반품요청</p>
        <i class="rb-close text-24xl text-black" @click="close"></i>
      </div>

      <div class="mt-10 px-5">
        <p class="subhead-3-b text-black">반품하실 상품을 선택해주세요.</p>
        <hr class="mt-4 w-full border-black" />
      </div>

      <div class="mt-4 space-y-4 divide-y divide-rgray-100 px-5">
        <div v-for="(item, index) in returnSoItems" :key="index">
          <div class="flex space-x-2 pt-4 md:cursor-pointer" @click="() => setReturnSoIds(item)">
            <i
              class="text-24xl"
              :class="{
                'rb-checkbox-inactive text-rgray-100': checkedReturnSoIds.findIndex((e) => e.soId == item.soId) == -1,
                'rb-checkbox-active text-black': checkedReturnSoIds.findIndex((e) => e.soId == item.soId) > -1
              }"
            ></i>
            <div class="space-y-1" style="width: calc(100% - 104px)">
              <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
              <p class="body-1-r line-clamp-2 text-black">{{ item.name }}</p>

              <div class="space-x-2">
                <span v-for="(opt, optIdx) in item.optCode.split(':')" :key="optIdx" class="caption-2-b text-black">{{ formatOptionKey(opt.split('=')[0]) }} : {{ formatOptionValue(opt) }}</span>
              </div>

              <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.priceSet) }}원</p>
            </div>
            <img :src="item.imgLink" class="w-16" />
          </div>

          <div v-if="checkedReturnSoIds.findIndex((e) => e.soId == item.soId) > -1" class="mt-4">
            <div>
              <div
                class="flex h-12 w-full justify-between border border-solid px-4 md:cursor-pointer"
                :class="{
                  'border-black': item.active == true,
                  'border-rgray-100': item.active == false
                }"
                @click="() => open(item)"
              >
                <p class="body-1-r my-auto text-black">{{ item.retCode }}</p>
                <i
                  class="rb-arrow-down my-auto text-24xl text-black"
                  :class="{
                    'rotate-180': item.active == true
                  }"
                ></i>
              </div>
              <div v-if="item.active == true" class="static space-y-4 border-x border-b border-black px-4 pb-4">
                <p v-for="(msgs, msgIdx) in msgList" :key="msgIdx" class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => changeMsg(item, msgs)">{{ msgs }}</p>
              </div>

              <textarea
                v-model="item.retMsg"
                rows="3"
                maxlength="500"
                placeholder="상세사유를 작성해주세요. (100자 이내)"
                class="body-1-r mt-2 w-full resize-none border bg-white p-4 text-black placeholder:text-tiny placeholder:font-normal placeholder:leading-20 placeholder:text-rgray-400 focus:border-black"
                :class="{
                  'border-orange-600': errorObj.code == 'no_msg'
                }"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed bottom-0 w-full px-5 py-2 md:max-w-pc">
        <button
          class="btn-h56-r28-fill-wfull"
          :class="{
            'bg-rgray-200': checkedReturnSoIds.length == 0,
            'bg-black': checkedReturnSoIds.length > 0
          }"
          @click="openPolybagBottomSheet"
        >
          반품요청하기
        </button>
      </div>
    </div>

    <AppModalBottomSheet :is-open="isOpenPolybagBottonSheet" @update-open="isOpenPolybagBottonSheet = false">
      <div class="pb-20">
        <h3 class="display-1-b px-5 text-black">반품하시는 상품을<br />봉투/폴리백에 넣어 주세요</h3>
        <div class="px-5">
          <div class="mt-6 flex space-x-1 bg-rgray-50 py-6 pl-4 pr-6 text-black">
            <i class="rb-info text-24xl text-black"></i>
            <p class="body-long-1-r text-black">상품이 훼손되면 환불 진행이 어려울 수 있어요. <br />이를 방지하기 위해 반드시 상품을 폴리백 혹은 <br />봉투에 넣은 상태로 박스에 포장해 주세요.</p>
          </div>
        </div>

        <div id="bottomFixedButton" class="fixed bottom-0 w-full px-5 py-2 md:max-w-pc">
          <button class="btn-h56-r28-fill-wfull" @click="returnSoItem">네, 확인했어요</button>
        </div>
      </div>
    </AppModalBottomSheet>
  </AppModalDialog>
</template>

<script setup>
// 반품 다이얼로그입니다.
// 주문상품을 페이지로 받아오고, 주문상품 선택 후에, 사유를 기재하고 반품신청합니다.
// 받아오는 주문상품의 조건은 주문상품 상태가 40인 경우입니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

defineProps({
  returnSoItems: {
    type: Array,
    required: true
  },
  isReturnDialogOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleReturnDialog', 'returnSoItems'])

const isOpenPolybagBottonSheet = ref(false)
const msgList = ref(['단순변심', '색상/사이즈가 기대와 다름', '상품 상태가 기대와 다름', '기타'])
const checkedReturnSoIds = ref([])
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

// function setErrorObj(obj) {
//   errorObj.value = obj

//   setTimeout(() => {
//     errorObj.value = {
//       code: '',
//       msg: '',
//       time: 0
//     }
//   }, obj.time)
// }

const openPolybagBottomSheet = () => {
  if (checkedReturnSoIds.value.length === 0) {
    appStore().setDialogDTO({
      message: '상품을 선택해주세요.',
      timeout: 3
    })
  } else if (checkedReturnSoIds.value.findIndex((e) => e.retCode === '반품사유') > -1) {
    appStore().setDialogDTO({
      message: '반품사유를 선택해주세요.',
      timeout: 3
    })
  } else if (checkedReturnSoIds.value.findIndex((e) => e.retMsg.length === 0) > -1) {
    appStore().setDialogDTO({
      message: '상세사유를 작성해주세요.',
      timeout: 3
    })
  } else if (checkedReturnSoIds.value.findIndex((e) => e.retMsg.length > 100) > -1) {
    appStore().setDialogDTO({
      message: '상세 사유는 최대 100자까지 작성할 수 있습니다.',
      timeout: 3
    })
  } else {
    isOpenPolybagBottonSheet.value = true
    hideChannelButton()
  }
}

const open = (item) => {
  item.active = !item.active
}

const changeMsg = (item, msg) => {
  item.retCode = msg
  item.active = false
}

const setReturnSoIds = (item) => {
  const findIdx = checkedReturnSoIds.value.findIndex((e) => e.soId === item.soId)

  if (findIdx > -1) {
    checkedReturnSoIds.value.splice(findIdx, 1)
  } else {
    checkedReturnSoIds.value.push(item)
  }
}

const close = () => {
  emit('toggleReturnDialog')
}

const returnSoItem = () => {
  emit(
    'returnSoItems',
    checkedReturnSoIds.value.map((e) => {
      return {
        soId: e.soId,
        retCode: (() => {
          if (e.retCode === '단순변심') return 1
          if (e.retCode === '색상/사이즈가 기대와 다름') return 2
          if (e.retCode === '상품 상태가 기대와 다름') return 3
          return 0
        })(),
        retMsg: e.retMsg
      }
    })
  )
  isOpenPolybagBottonSheet.value = false
  showChannelButton()
}
</script>
