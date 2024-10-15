<template>
  <div id="catOneTab" class="flex h-14 w-full space-x-4 bg-white px-5 no-scroll md:max-w-pc">
    <div class="mx-auto flex w-fit justify-center space-x-4">
      <p
        v-for="category in getCatList"
        :key="category.code"
        class="headline-b my-auto md:cursor-pointer"
        :class="getProductListOptions.categoryGender == category.code ? 'text-black' : 'text-rgray-300'"
        @click="() => changeCat(category)"
      >
        {{ category.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
// 구매하기 페이지의 카테고리1 필터입니다.
import { storeToRefs } from 'pinia'

const { getCatList, getProductListOptions } = storeToRefs(productStore())

const emit = defineEmits(['updateCat'])

function changeCat(cat) {
  emit('updateCat', cat)
}
</script>
