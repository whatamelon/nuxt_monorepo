<template>
  <div class="mt-10 px-5">
    <div v-if="cleanList.imgs.length != 0" class="w-full py-6">
      <div class="flex w-full justify-between border-b border-black pb-4" @click="openWash = !openWash">
        <h5 class="subhead-3-b text-black">세탁 및 상품 주의사항</h5>
        <i :class="openWash ? 'rb-arrow-up' : 'rb-arrow-down'" class="my-auto text-24xl"></i>
      </div>
      <div v-if="openWash">
        <div class="my-6 flex space-x-2">
          <img v-for="(cleanImgs, cleanImgIdx) in cleanList.imgs" :key="'cleanImg_' + cleanImgIdx" class="h-8 w-8 object-contain" :src="cleanImgs" />
        </div>
        <ul class="flex list-disc flex-col gap-y-1 pl-4 md:pl-8">
          <li v-for="(cleanTexts, cleanTextIdx) in cleanList.texts" :key="'cleanImg_' + cleanTextIdx" class="label-2-r text-black">{{ cleanTexts }}</li>
        </ul>
      </div>
    </div>

    <div v-if="detailInfo.length != 0" class="w-full py-6">
      <div class="flex w-full justify-between border-b border-black pb-4" @click="openNotice = !openNotice">
        <h5 class="subhead-3-b text-black">상품정보제공공시</h5>
        <i :class="openNotice ? 'rb-arrow-up' : 'rb-arrow-down'" class="my-auto text-24xl"></i>
      </div>
      <div v-if="openNotice" class="mt-6 w-full divide-y divide-rgray-100 border-y border-rgray-100">
        <div v-for="(info, infoIdx) in detailInfo" :key="'info_' + infoIdx" class="flex w-full">
          <p class="label-2-r w-1/3 bg-rgray-50 py-2 pl-2 text-black">{{ info.key }}</p>
          <p class="label-2-r w-2/3 bg-white py-2 pl-2 text-black">{{ info.value }}</p>
        </div>
      </div>
    </div>

    <div class="w-full py-6">
      <div class="flex w-full justify-between border-b border-black pb-4" @click="openShip = !openShip">
        <h5 class="subhead-3-b text-black">배송 및 반품 안내</h5>
        <i :class="openShip ? 'rb-arrow-up' : 'rb-arrow-down'" class="my-auto text-24xl"></i>
      </div>

      <div v-if="openShip" class="mt-6 w-full divide-y divide-rgray-100 border-y border-rgray-100">
        <div v-for="(comp, compIdx) in companyInfo" :key="'info_' + compIdx">
          <div v-if="comp.key == '반품비'" class="flex w-full">
            <p class="label-2-r w-1/3 bg-rgray-50 py-2 pl-2 text-black">{{ comp.key }}</p>
            <p class="label-2-r w-2/3 bg-white py-2 pl-2 text-black">(무료반품권 사용시) 무료<br />(상품불량시) 무료<br />(고객변심시) 6,000원</p>
          </div>
          <div v-else class="flex w-full">
            <p class="label-2-r w-1/3 bg-rgray-50 py-2 pl-2 text-black">{{ comp.key }}</p>
            <p class="label-2-r w-2/3 bg-white py-2 pl-2 text-black">{{ comp.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 상품상세페이지에서 세탁, 정보, 배송 에 대한 부분을 띄워주는 컴포넌트입니다.
// 기본적으로 snCode에 있는 정보를 받아옵니다.
// 정보의 유무에 따라 페이지단에서 판단하고 정보를 재가공하여 컴포넌트로 보내줍니다.
defineProps({
  cleanList: {
    type: Object,
    required: true
  },
  detailInfo: {
    type: Array,
    required: true
  }
})

const openWash = ref(true)
const openNotice = ref(true)
const openShip = ref(true)
const companyInfo = ref([
  {
    key: '판매자',
    value: '(주)마들렌메모리'
  },
  {
    key: '고객센터',
    value: '02-522-1352'
  },
  {
    key: '상품 출고지',
    value: '경기 성남시 위례서일로 30 위례헤리움 B107'
  },
  {
    key: '택배사',
    value: 'CJ 대한통운'
  },
  {
    key: '반품주소',
    value: '경기 성남시 위례서일로 30 위례헤리움 B107'
  },
  {
    key: '반품비',
    value: `(무료반품권 사용시) 무료\n(상품불량시) 무료\n(고객변심시) 6,000원`
  }
])
</script>
