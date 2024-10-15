<template>
  <div v-if="isOpen">
    <div class="fixed left-0 top-0 !z-[9999] h-screen w-full bg-black opacity-60 md:absolute"></div>
    <div class="absolute left-1/2 top-1/2 !z-[9999] -translate-x-1/2 -translate-y-1/2">
      <AppSpinner class="mx-auto flex w-fit !border-white"></AppSpinner>
      <p class="body-1-r mt-6 text-white">잠시만 기다려주세요.</p>
    </div>
  </div>
</template>

<script setup>
// 기본 spinner에 dim을 추가했습니다.
// watch함수를 보시면, isOpen값에 맞춰서 채널톡 버튼을 띄우고 닫습니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

watch(
  () => props.isOpen,
  (current) => {
    if (current) hideChannelButton()
    else showChannelButton()
  }
)
</script>
