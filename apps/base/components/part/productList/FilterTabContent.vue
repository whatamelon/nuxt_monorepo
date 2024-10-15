<template>
  <ul class="flex h-full w-full flex-col gap-3 overflow-y-scroll pt-8 no-scroll" :class="activeFilterList.length > 0 ? 'pb-40' : 'pb-[108px]'">
    <li v-for="(filter, index) in filterList" :key="filter.code" class="flex flex-col gap-3">
      <div class="flex cursor-pointer justify-between" @click="() => clickFilter(filter)">
        <div class="flex items-center gap-1" :class="activeFilterList.includes(filter) ? 'text-black' : 'text-rgray-300'">
          <span v-if="filter.isNew" class="badge-h18-r9-line-p8">NEW</span>
          <span class="subhead-2-b">{{ filter.name }}</span>
          <span v-if="filter.nameKr" class="body-1-r">{{ filter.nameKr }}</span>
        </div>
        <IconCheckboxBase v-if="usedFilter.selectMode === 'multi'" :id="filter.code" :checked="activeFilterList.includes(filter)"></IconCheckboxBase>
        <IconRadioButtonBase v-else-if="usedFilter.selectMode === 'single'" :id="filter.code" :checked="activeFilterList.includes(filter)"></IconRadioButtonBase>
      </div>
      <UDivider v-if="Number(index) !== filterList.length - 1" />
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  filterList: {
    type: Array,
    required: true
  },
  activeFilterList: {
    type: Array,
    required: true
  },
  usedFilter: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['clickFilter'])

const clickFilter = (filter) => {
  let newActiveFilterList = [...props.activeFilterList]

  if (props.usedFilter.selectMode === 'multi') {
    const findIdx = newActiveFilterList.findIndex((e) => e.code === filter.code)
    if (findIdx > -1) newActiveFilterList.splice(findIdx, 1)
    else newActiveFilterList.push(filter)
  } else if (props.usedFilter.selectMode === 'single') {
    if (newActiveFilterList.includes(filter)) newActiveFilterList = []
    else newActiveFilterList = Array(filter)
  }
  emit('clickFilter', newActiveFilterList)
}
</script>
