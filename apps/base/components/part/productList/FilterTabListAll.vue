<template>
  <UCarousel
    id="filterTab"
    :items="filteredItemList"
    class="static flex w-full bg-white no-scroll md:max-w-pc"
    :ui="{
      container: 'relative w-full flex overflow-x-auto px-5 snap-x snap-mandatory scroll-smooth',
      item: 'flex flex-none snap-center'
    }"
  >
    <template #default="{ item }">
      <div class="ml-1 h-fit w-fit rounded-full bg-rgray-50 py-2 pl-4 pr-3 text-black md:cursor-pointer">
        <div class="flex shrink-0 gap-0.5">
          <p class="caption-2-b">{{ item.name }}</p>
          <IconClose stroke="black" @click="() => removeFilter(item)" />
        </div>
      </div>
    </template>
  </UCarousel>
</template>

<script setup>
// 구매하기 페이지 - 필터 모달 하단의 필터링된 데이터
// 양옆 슬라이드를 위해 UCarousel 컴포넌트를 사용했습니다.
// 브랜드, 등급, 유형, 가격 선택된 필터를 포함합니다.
// 모든 정보는 DB로 부터 받아옵니다.
defineProps({
  filteredItemList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['removeFilteredItem'])

const removeFilter = (item) => {
  emit('removeFilteredItem', item)
}
</script>
