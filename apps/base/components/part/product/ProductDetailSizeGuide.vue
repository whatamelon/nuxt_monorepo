<template>
  <div id="product_detail_size_guide_section" class="mx-5 mt-10 rounded-2xl border border-rgray-100 bg-rgray-50">
    <div class="mx-6 mb-6 mt-5 flex gap-2 border-b border-black pb-4">
      <span class="badge-h22-r0-fill-p8-black">Tip</span>
      <p class="subhead-3-b">럭키슈에뜨 사이즈 선택</p>
    </div>
    <div class="mx-5 mb-5 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="subhead-2-b">평소 내 사이즈 선택하세요!</p>
        <ul class="flex gap-1">
          <li v-for="sizeData in sizeList" :key="sizeData.size">
            <button
              type="button"
              class="border border-black"
              :class="selectedSize.size === sizeData.size ? 'btn-h32-r16-fill-p16' : 'btn-h32-r16-line-p16 bg-white'"
              @click="() => onSelectSize(sizeData)"
            >
              {{ sizeData.size }}
            </button>
          </li>
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <p class="subhead-2-b">다른 고객님들이 선택한 사이즈는?</p>
        <div v-for="sizeListData in selectedSize.sizeList" :key="sizeListData.name" class="flex gap-2">
          <span class="subhead-2-b">{{ sizeListData.name }}</span>
          <div class="flex grow items-center">
            <div class="h-2 w-full overflow-hidden rounded-full bg-white">
              <div class="h-full rounded-full bg-black transition-all" :style="{ width: sizeListData.value + '%' }" />
            </div>
          </div>
          <div class="relative ml-1">
            <div class="left-arrow caption-2-b w-10 rounded bg-black px-1 py-0.5 text-center text-white">{{ sizeListData.value }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as amplitude from '@amplitude/analytics-browser'

// 해당 컴포넌트에서만 사용하는 타입이어서 컴포넌트 내부에서 임의 정의하였음.
// 다른 방법으로 변경해야 한다면 충분히 변경 할 수 있는 부분입니다.
type SizeData = {
  size: string
  sizeList: {
    name: string
    value: number
  }[]
}

const sizeList: SizeData[] = [
  {
    size: 'XS',
    sizeList: [
      {
        name: '36',
        value: 97
      },
      {
        name: '38',
        value: 3
      }
    ]
  },
  {
    size: 'S',
    sizeList: [
      {
        name: '36',
        value: 92
      },
      {
        name: '38',
        value: 8
      }
    ]
  },
  {
    size: 'M',
    sizeList: [
      {
        name: '36',
        value: 94
      },
      {
        name: '38',
        value: 6
      }
    ]
  },
  {
    size: 'L',
    sizeList: [
      {
        name: '36',
        value: 16
      },
      {
        name: '38',
        value: 84
      }
    ]
  },
  {
    size: 'XL',
    sizeList: [
      {
        name: '36',
        value: 0
      },
      {
        name: '38',
        value: 100
      }
    ]
  }
]
// 선택된 사이즈
const selectedSize = ref<SizeData>(sizeList.find((item) => item.size === 'M')!)

/** 선택된 사이즈 변경 */
const onSelectSize = (data: SizeData) => {
  amplitude.track('itemdetail_sizetip', { size: data.size })
  selectedSize.value = data
}
</script>

<style lang="css" scoped>
.left-arrow:after {
  content: '';
  border-right: 6px solid black;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-radius: 2px;
  position: absolute;
  left: -4px;
  top: 7px;
}
</style>
