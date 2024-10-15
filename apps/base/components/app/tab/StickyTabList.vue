<template>
  <div :id="props.defineId" class="flex w-full justify-evenly">
    <div v-for="tab in props.tabList" :key="tab.id" :class="[`w-1/${props.tabList.length}`]">
      <div
        class="h-14 w-full border-solid text-center"
        style="border-bottom-width: 3px"
        :class="{
          'border-black text-black': tab.id === selectedTab.id,
          'border-rgray-100 text-rgray-300 md:cursor-pointer': tab.id !== selectedTab.id
        }"
        @click="() => updateTab(tab)"
      >
        <p class="subhead-3-b py-4">{{ tab.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// sticky하게 붙이는 탭리스트입니다.
// 글로벌하게 활용할 목적으로 만들었지만, 막상 만들고 보니 활용도가 높지는 않습니다.
// selectedTab 값으로 선택할 tab을 지정할 수 있습니다.

// props
// tabList > 탭 리스트
// id > 상단에 sticky하게 붙기위해 생성하는 stickyId

const props = defineProps({
  tabList: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: Object,
    required: true
  },
  defineId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['updateTab'])

const updateTab = (tab) => {
  emit('updateTab', tab)
}
</script>
