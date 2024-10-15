<template>
  <!-- 이건 왜 있는지 모르겠습니다,,,ㅋㅋㅋ -->

  <UModal
    v-model="open"
    class="align-center"
    fullscreen
    :ui="{
      padding: 'p-0',
      width: 'sm:[375px]'
    }"
    @close="close"
  >
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-rgray-100 dark:divide-rgray-800',
        body: {
          base: 'grow'
        }
      }"
    >
      <template #header>
        <button @click="close">닫기</button>
      </template>

      <slots />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const open = ref(props.isOpen)

const emit = defineEmits(['updateOpen'])
computed({
  get: () => open,
  set: (newValue) => emit('updateOpen', newValue)
})

function close() {
  emit('updateOpen', false)
}
</script>
