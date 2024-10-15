<template>
  <AppModalPopupDialog :is-open="isOpen">
    <div class="relative p-6 pt-10">
      <button type="button" class="absolute right-4 top-4" @click="onClose"><i class="rb-close text-24xl" /></button>
      <slot></slot>
    </div>
  </AppModalPopupDialog>
</template>
<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  onClose: []
}>()

const onClose = () => {
  emit('onClose')
}
</script>
