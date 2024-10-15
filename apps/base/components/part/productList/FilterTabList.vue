<template>
  <UCarousel
    id="filterTab"
    :items="activeCarouselArr"
    class="mx-auto flex h-13 w-full bg-white no-scroll md:max-w-pc"
    :ui="{
      container: 'relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-5',
      item: 'flex flex-none snap-center'
    }"
  >
    <template #default="{ item }">
      <div v-if="item.code == 'order'" class="my-auto flex h-fit w-fit space-x-1 rounded-3xl border border-rgray-100 py-2 pl-4 pr-3 md:cursor-pointer" style="flex: 0 0 auto" @click="openOrderFilter">
        <p class="caption-2-b my-auto text-black">{{ activeOrder.name }}</p>
        <img class="mx-auto" src="/icons/global/ic-arrow-down.svg" />
      </div>

      <div v-else-if="item.code == 'reset'" class="my-auto ml-1 h-8 w-8 rounded-full border border-rgray-100 bg-white p-2" @click="() => resetFilter('all')">
        <IconResetBase />
      </div>

      <div
        v-else
        class="my-auto ml-1 h-fit w-fit rounded-3xl border py-2 pl-4 pr-3 md:cursor-pointer"
        :class="isActive(item) ? 'border-black bg-black text-white' : 'border-rgray-100 bg-white text-black'"
        style="flex: 0 0 auto"
        @click="() => openFilter(item)"
      >
        <div v-if="!isActive(item)" class="flex space-x-1">
          <p class="caption-2-b my-auto">{{ item.name }}</p>
          <img class="mx-auto" src="/icons/global/ic-arrow-down.svg" />
        </div>

        <div v-else class="flex space-x-1">
          <p class="caption-2-b my-auto">{{ activeName(item) }}</p>
          <IconClose @click.stop="() => resetFilter(item.code)" />
        </div>
      </div>
    </template>
  </UCarousel>
</template>

<script setup>
// 구매하기 페이지의 나머지 필터입니다.
// 양옆 슬라이드를 위해 UCarousel 컴포넌트를 사용했습니다.
// 정렬, 초기화, 브랜드, 등급, 유형, 가격 필터를 포함합니다.
// 모든 정보는 DB로 부터 받아옵니다.
import { storeToRefs } from 'pinia'

const { usedFilterList } = defineProps({
  usedFilterList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['openOrderFilter', 'openFilter', 'resetFilter'])

const { getOrderList, getProductListOptions } = storeToRefs(productStore())

const activeCarouselArr = computed(() => {
  const arr = [{ code: 'order' }]
  if (
    getProductListOptions.value.brand.length > 0 ||
    getProductListOptions.value.grade.length > 0 ||
    getProductListOptions.value.season.length > 0 ||
    getProductListOptions.value.type.length > 0 ||
    getProductListOptions.value.price.length > 0
  ) {
    arr.push({ code: 'reset' })
  }
  return [...arr, ...usedFilterList.filter((f) => f.code !== 'cat')]
})

const activeName = (item) => {
  if (item.code === 'brand') {
    let msg = getProductListOptions.value.brand[0].name
    if (getProductListOptions.value.brand.length > 1) msg += ' 외'
    return msg
  }
  if (item.code === 'grade') {
    let msg = getProductListOptions.value.grade[0].name
    if (getProductListOptions.value.grade.length > 1) msg += ' 외'
    return msg
  }
  if (item.code === 'season') {
    let msg = getProductListOptions.value.season[0].name
    if (getProductListOptions.value.season.length > 1) msg += ' 외'
    return msg
  }
  if (item.code === 'type') {
    let msg = getProductListOptions.value.type[0].name
    if (getProductListOptions.value.type.length > 1) msg += ' 외'
    return msg
  }
  if (item.code === 'price') {
    return getProductListOptions.value.price[0].name
  }
}

const isActive = (item) => {
  if (item.code === 'brand') return getProductListOptions.value.brand.length > 0
  if (item.code === 'grade') return getProductListOptions.value.grade.length > 0
  if (item.code === 'season') return getProductListOptions.value.season.length > 0
  if (item.code === 'type') return getProductListOptions.value.type.length > 0
  if (item.code === 'price') return getProductListOptions.value.price.length > 0
}

const activeOrder = computed(() => {
  return getOrderList.value.find((e) => e.code === getProductListOptions.value.orderBy)
})

function openOrderFilter() {
  emit('openOrderFilter', true)
}

function openFilter(value) {
  emit('openFilter', value)
}

function resetFilter(value) {
  emit('resetFilter', value)
}
</script>
