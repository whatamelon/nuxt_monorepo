<template>
  <div id="product_detail_tab_bar" class="flex w-full justify-center bg-white md:max-w-pc">
    <div
      v-for="(tab, tabIdx) in tabList"
      :key="tabIdx"
      class="flex h-14 justify-center md:cursor-pointer"
      style="flex: 1 0 0; border-bottom: 2px solid; border-bottom: 2px solid #e7e7e7"
      :class="[
        {
          'border-solid !border-black text-black': tab.code == selectedTab.code,
          'text-rgray-300': tab.code != selectedTab.code
        }
      ]"
      @click="() => clickTab(tab)"
    >
      <p
        class="subhead-3-b my-auto text-center"
        :class="{
          'pl-5': tabIdx == 0,
          'pr-5': tabIdx == tabList.length - 1
        }"
      >
        {{ tab.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
// 마이페이지 > 리뷰내역에서 사용하는 탭바 컴포넌트입니다.
defineProps({
  tabList: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['selectTab'])

const clickTab = (tab) => {
  emit('selectTab', tab)
}
</script>
