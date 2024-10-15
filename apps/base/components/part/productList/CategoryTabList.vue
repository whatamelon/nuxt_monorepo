<template>
  <UCarousel
    id="catTwoTab"
    v-slot="{ item }"
    :items="selectedCat2List"
    class="mx-auto flex h-13 w-full bg-rgray-50 no-scroll md:max-w-pc"
    :ui="{
      container: 'relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-4 px-5',
      item: 'flex flex-none'
    }"
  >
    <p
      class="subhead-2-b my-auto w-fit md:cursor-pointer"
      style="flex: 0 0 auto"
      :class="getProductListOptions.categoryClothes == item.code ? 'text-black' : 'text-rgray-300'"
      @click="() => changeCat(item)"
    >
      {{ item.name }}
    </p>
  </UCarousel>
</template>

<script setup>
// 구매하기 페이지의 카테고리2 필터입니다.
// 양옆 슬라이드를 위해 UCarousel 컴포넌트를 사용했습니다.
import { storeToRefs } from 'pinia'

const { getCatList, getProductListOptions } = storeToRefs(productStore())

const emit = defineEmits(['updateCat'])

const selectedCat2List = computed(() => {
  const findOption = getCatList.value.findIndex((e) => e.code === getProductListOptions.value.categoryGender)

  if (findOption > -1) {
    // TODO: cat2List -> clothesList 변경해야함.
    return getCatList.value[findOption].cat2List
  }
  return []
})

function changeCat(cat) {
  emit('updateCat', cat)
}
</script>
