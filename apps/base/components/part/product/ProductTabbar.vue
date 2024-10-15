<template>
  <div id="product_detail_tab_bar" class="sticky left-0 top-[55px] z-[995] flex w-full justify-center bg-white md:max-w-pc">
    <div
      v-for="(tab, tabIdx) in tabList"
      :key="tabIdx"
      class="flex h-14 justify-center md:cursor-pointer"
      style="flex: 1 0 0; border-bottom: 2px solid; border-bottom: 2px solid #e7e7e7"
      :class="{
        'border-solid !border-black text-black': tab.code == selectedTab.code,
        'text-rgray-300': tab.code != selectedTab.code
      }"
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
// 상품상세페이지에서 스티키 탭바 컴포넌트입니다.
// 탭바의 정보는 DB로 부터 받아옵니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  prodDTO: {
    type: Object,
    required: true
  },
  tabList: {
    type: Array,
    required: true
  },
  selectedTab: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const emit = defineEmits(['selectTab'])

const clickTab = (tab) => {
  amplitude.track('tap', {
    type: tab.code,
    clickedpage: route.query.cp ?? 'etc',
    event_no: route.query.evt_no ?? '',
    event_posi: route.query.event_posi ?? '',
    brand: props.prodDTO.brandSubName,
    name: props.prodDTO.name,
    price: props.prodDTO.priceLow,
    discountpercent: props.prodDTO.priceLowRate,
    addcount: props.prodDTO.badgeType === 'na' ? 'no' : 'yes'
  })
  emit('selectTab', tab)
}
</script>
