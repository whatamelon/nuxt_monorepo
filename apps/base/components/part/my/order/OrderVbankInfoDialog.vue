<template>
  <AppModalDialog :is-open="isVbankInfoDialogOpen" :is-full-screen="false" @update-open="close">
    <div class="relative h-full w-full">
      <div class="flex w-full justify-end">
        <i class="rb-close text-24xl text-black" @click="close"></i>
      </div>

      <h3 class="display-1-b mt-4 text-black">입금 계좌 안내</h3>

      <div class="mb-6 mt-10 space-y-6">
        <div class="flex space-x-4">
          <p class="subhead-2-b w-20 text-rgray-400">은행명</p>
          <p class="body-1-r text-black">{{ bankMap.get(vbankInfo.bankCode) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-20 text-rgray-400">예금주</p>
          <p class="body-1-r text-black">{{ vbankInfo.holder }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b my-auto w-20 text-rgray-400">계좌번호</p>
          <div class="flex space-x-1">
            <p class="body-1-r my-auto text-black">{{ vbankInfo.account }}</p>
            <button class="btn-h24-r0-line-p8-gray" @click="() => copyVbankAccount(vbankInfo.account)">복사하기</button>
          </div>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-20 text-rgray-400">입금기한</p>
          <p class="body-1-r text-black">{{ formatDateFullForUTC(vbankInfo.vbDate) }}</p>
        </div>
        <div class="flex space-x-4">
          <p class="subhead-2-b w-20 text-rgray-400">입금금액</p>
          <p class="body-1-r text-black">{{ formatWonNoBlank(vbankInfo.price) }}원</p>
        </div>
      </div>

      <button class="btn-h56-r28-fill-wfull absolute bottom-0" @click="close">확인</button>
    </div>
  </AppModalDialog>
</template>

<script setup>
import { bankMap } from '~/utils/bankData'

// 입금 가상계좌 다이얼로그입니다.
// 페이지로부터 가상계좌 정보를 받아옵니다.
defineProps({
  vbankInfo: {
    type: Object,
    required: true
  },
  isVbankInfoDialogOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleVbankInfoDialog'])

const close = () => {
  emit('toggleVbankInfoDialog')
}

const copyVbankAccount = (account) => {
  const t = document.createElement('textarea')
  document.body.appendChild(t)
  t.value = account
  t.select()
  document.execCommand('copy')
  document.body.removeChild(t)
  appStore().setDialogDTO({
    message: '계좌번호가 복사되었습니다.',
    timeout: 3
  })
}
</script>
