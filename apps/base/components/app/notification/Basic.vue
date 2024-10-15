<template>
  <ClientOnly>
    <Teleport to="#main_wrapper">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed left-2.5 z-[9999] w-[calc(100%-20px)] bg-black px-6 py-4 text-white md:left-auto md:ml-2.5 md:w-[355px] md:max-w-pc"
          style="transition: opacity 0.3s ease"
          :style="setBottom()"
          @click="close"
        >
          <p class="subhead-2-b whitespace-pre-line">{{ message }}</p>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
// 기본 notification toast 입니다.
// teleport를 통해 #main_wrapper에 notification을 위치시킵니다.
// bottomFixedButton, bottomNavigation보다 무조건 8px 위에 띄울 수 있도록 setBottom함수를 통해 bottom값을 설정했습니다.
const app = appStore()

const isOpen = computed(() => {
  return app.getDialogDTO.isOpen
})
const message = computed(() => {
  return app.getDialogDTO.message
})

const close = () => {
  app.closeDialogDTO()
}

const setBottom = () => {
  const specifyButton = document.getElementById('bottomFixedButton')
  const regularButton = document.getElementById('bottomNavigation')

  if (specifyButton) {
    // 특수한 목적의 바텀 버튼이 있으면 무조건 해당 버튼을 기준으로 + 8px
    return {
      bottom: `${specifyButton.getBoundingClientRect().height + 8}px`
    }
  }
  if (regularButton) {
    // 특수한 목적의 바텀 버튼이 없고, 기본 바텀 네비게이션은 있으므로, 기본 바텀 네비게이션 기준으로 + 8px
    return {
      bottom: `${regularButton.getBoundingClientRect().height + 8}px`
    }
  }
  // 아무것도 없음. bottom에서 100px
  return {
    bottom: '100px'
  }
}
</script>

<style>
.modal-leave-to {
  opacity: 0;
}
</style>
