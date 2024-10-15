<template>
  <div class="">
    <h2 class="headline-b pb-4 text-black">주문상품</h2>

    <hr class="border border-black" />

    <ul class="divide-y divide-rgray-100">
      <li v-for="(item, index) in orderItemList" :key="index" class="space-y-1 py-6">
        <div class="flex gap-4">
          <div class="grow space-y-1">
            <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
            <p class="body-1-r line-clamp-3 text-black">{{ item.name }}</p>

            <p class="caption-2-b text-black">
              <span v-if="item.grade != ''">{{ formatOptionValue('g=' + item.grade) }} / </span>
              <span v-if="item.option != ''">{{ formatOptionValue('o=' + item.option) }}</span>
              <span v-if="item.color != ''">{{ formatOptionValue('c=' + item.color) }} / </span>
              <span v-if="item.size != ''">{{ formatOptionValue('s=' + item.size) }} </span>
            </p>

            <p class="subhead-2-b flex items-center gap-0.5">
              <span class="text-green-600" :style="item.isAddDiscount && { color: `#${item.badgeColor}` }">{{ item.priceLowRate }}%</span>
              <span class="text-black">{{ formatWon(item.priceSet) }}원</span>
              <span class="label-2-r text-rgray-400 line-through">{{ formatWon(item.priceOrg) }}원</span>
            </p>
          </div>
          <NuxtImg width="60px" height="90px" :src="item.imgLink" class="object-contain" />
        </div>
        <div v-if="item.isAddDiscount" class="flex gap-1">
          <p class="badge-h18-r0-fill-p4-black" :style="{ backgroundColor: `#${item.badgeColor}` }">{{ item.badgeTitle }}</p>
          <p class="caption-2-b" :style="{ color: `#${item.badgeColor}` }">{{ formatDaysRemain(item.duDate) }} {{ formatWon(item.priceStd - item.priceSet) }}원 추가 할인 종료</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// 주문서에서 나타내는 주문상품 리스트 컴포넌트입니다.
// 장바구니, 상품상세 페이지를 통해 localStorage에 해당 정보를 저장하고, localStorage에서 정보를 받아옵니다.
let orderItemList = []
if (process.client) {
  orderItemList = JSON.parse(localStorage.getItem('orderItemList'))
}
</script>
