<template>
  <div v-if="isOpen">
    <div class="fixed top-0 !z-[998] h-screen w-full bg-black opacity-60 md:max-w-pc" @click="close"></div>
    <div class="fixed bottom-0 !z-[999] w-full bg-white px-5 pb-4 pt-10 ios-safe-area md:max-w-pc" style="animation: fadeInUp 200ms">
      <div class="w-full">
        <p v-if="title !== ''" class="display-1-b whitespace-pre text-center text-black">{{ title }}</p>
        <p v-if="body !== ''" class="body-1-r mt-4 whitespace-pre text-center text-black">{{ body }}</p>

        <div class="!z-[998] flex w-full space-x-1 bg-white pt-10">
          <button class="btn-h56-r28-line-wfull" @click="clickLeft">{{ left }}</button>
          <button class="btn-h56-r28-fill-wfull" @click="clickRight">{{ right }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// confirm 바텀시트입니다. dim과 바텀시트, 2가지 버튼으로 구성되어있습니다.
// 부모에서 해당 컴포넌트를 호출하고, slot에 바텀시트에 들어갈 내용을 넣습니다.
// isOpen 으로 열고, 닫음을 결정합니다.
// 기본 바텀시트와 다른점은, title body left right값을 결정하는 방식으로 slot없이 props값만으로 내용을 띄울 수 있습니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  left: {
    type: String,
    required: true
  },
  right: {
    type: String,
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

const emit = defineEmits(['close', 'clickLeft', 'clickRight'])

const close = () => {
  emit('close')
}

const clickLeft = () => {
  emit('clickLeft')
}

const clickRight = () => {
  emit('clickRight')
}
</script>

<style>
@keyframes fadeInUp {
  0% {
    /* opacity: 0; */
    transform: translate3d(0, 100%, 0);
  }
  100% {
    /* opacity: 1; */
    transform: translateZ(0);
  }
}
</style>
