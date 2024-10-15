<template>
  <AppModalPopupDialog :is-open="isShow" @update-open="updateOpen">
    <div class="flex flex-col gap-6 px-6 py-8">
      <img v-if="iconImg" :src="iconImg" alt="icon" class="mx-auto h-20 w-20" />
      <div class="flex flex-col gap-4 text-center">
        <p class="display-1-b">
          <slot name="title"></slot>
        </p>
        <p class="body-2-r text-rgray-600">
          <slot name="content"></slot>
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <button class="btn-h56-r28-fill-wfull" @click="confirm">
          <slot name="confirm-text"></slot>
        </button>
        <button class="subhead-3-b text-rgray-600" @click="cancel">
          <slot name="cancel-text"></slot>
        </button>
      </div>
    </div>
  </AppModalPopupDialog>
</template>
<script setup lang="ts">
interface Props {
  iconImg?: string
}
defineProps<Props>()

const isShow = ref(false)
const resolvePromise = ref<((value: boolean) => void) | null>(null)

const updateOpen = (bool: boolean) => {
  isShow.value = bool
}
const show = () => {
  updateOpen(true)
  return new Promise((resolve: any) => {
    resolvePromise.value = resolve
  })
}

const confirm = () => {
  updateOpen(false)
  if (resolvePromise.value !== null) {
    resolvePromise.value(true)
  }
}

const cancel = () => {
  updateOpen(false)
  if (resolvePromise.value !== null) {
    resolvePromise.value(false)
  }
}

defineExpose({
  show,
  confirm,
  cancel
})
</script>
