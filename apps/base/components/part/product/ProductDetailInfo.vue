<template>
  <div class="px-5 py-4">
    <div class="space-y-1">
      <div class="flex flex-wrap gap-1">
        <p v-if="prodDTO.isAddDiscount" class="badge-h18-r0-fill-p4-black" :style="{ backgroundColor: `#${prodDTO.badgeColor}` }">{{ prodDTO.badgeTitle }}</p>
        <p v-if="prodDTO.isAddDiscount" class="caption-2-b" :style="{ color: `#${prodDTO.badgeColor}` }">
          {{ formatDaysRemain(prodDTO.duDate) }} {{ formatWon(prodDTO.priceStd - prodDTO.priceLow) }}원 추가 할인 종료
        </p>
        <p v-if="prodDTO.srcSpec == 'fp' && appStore().getDomain == 'orm'" class="badge-h18-r0-fill-p4-black">리퍼브</p>
      </div>

      <div v-if="prodDTO.brandSubName != '' && appStore().getDomain == 'orm'" class="flex w-full items-center justify-between">
        <p class="subhead-2-b text-rgray-400">{{ prodDTO.brandSubName }}</p>
        <button type="button" @click.stop.prevent="clickHeart">
          <i class="p-1.5 text-24xl" :class="prodDTO.heartFlag ? 'rb-heart-fill' : 'rb-heart'" />
        </button>
      </div>

      <div v-if="appStore().getDomain != 'orm'" class="mt-1 flex space-x-0.5">
        <p v-if="prodDTO.srcSpec == 'fp'" class="badge-h18-r0-fill-p4-black">스크래치 상품</p>
        <p v-if="prodDTO.prodCnt" class="label-2-r bg-rgray-100 px-1 text-rgray-600">재고 {{ prodDTO.prodCnt }}</p>
      </div>

      <h1 class="body-2-r mx-auto text-left text-black">{{ prodDTO.name }}</h1>

      <div class="flex items-center justify-start gap-1">
        <p class="headline-b text-[#01A46D]" :style="prodDTO.isAddDiscount && { color: `#${prodDTO.badgeColor}` }">{{ prodDTO.priceLowRate }}%</p>
        <p class="headline-b text-black">{{ formatWon(prodDTO.priceLow) }}원</p>
        <p class="body-1-r text-rgray-400 line-through">{{ formatWon(prodDTO.priceOrg) }}원</p>
      </div>
    </div>

    <!-- 예상 포인트 -->
    <div v-if="domain == 'orm' && isResaleable == true">
      <div class="mt-4 w-full rounded-lg border border-[#B1E8CE] bg-caribbean-green-100 p-4">
        <div class="flex w-full cursor-pointer justify-between" @click="tooglePointSection">
          <div class="flex">
            <p class="subhead-2-b my-auto text-black">재판매시 보상가 미리 확인</p>
          </div>

          <div class="flex">
            <p v-if="openPointSection == false" class="subhead-3-b my-auto pr-2 text-black">?????? P</p>
            <i class="rb-arrow-down my-auto text-24xl text-black" :class="{ 'rotate-180': openPointSection }"></i>
          </div>
        </div>
        <div v-if="openPointSection == true">
          <div class="my-4 h-[1px] w-full bg-[#B1E9CE]"></div>
          <div>
            <div class="flex justify-between">
              <p class="subhead-2-b my-auto text-black">현재 보상가</p>
              <p v-if="resalePoint != null" class="headline-b text-black">{{ formatWon(resalePoint) }} P</p>
              <p v-else class="headline-b text-black">?????? P</p>
            </div>
            <div class="my-4 h-[1px] w-full bg-[#B1E9CE]"></div>
            <ul class="body-1-r list-outside list-disc pl-4">
              <li>
                해당 상품 구매 후 릴레이마켓에 재판매시, <b v-if="resalePoint != null">{{ formatWon(resalePoint) }} P</b><b v-else>OLO 포인트</b> 를 보상 받으실 수 있습니다.
              </li>
              <li>보상 받은 OLO 포인트는 코오롱몰에서 새 상품 구매 시, <b>현금처럼 즉시 사용</b>할 수 있습니다.</li>
              <li>회사 정책에 따라 재판매가 불가능 해지거나, 유동적으로 보상가가 조정될 수 있습니다.</li>
            </ul>
            <button v-if="resalePoint == null && loggedIn == false" class="caption-2-b btn-h34-r17-fill-p16 mx-auto mt-4 text-white" @click="goToLogin">
              로그인하고 보상가 확인하기 <i class="rb-arrow-right text-tiny text-white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4 mt-10 flex items-center justify-between">
      <p class="subhead-3-b text-black">옵션선택</p>
      <!-- 코오롱 & 럭슈 일 때만 사이즈 선택 팁 보이기 -->
      <button v-if="appStore().getDomain == 'orm' && prodDTO.subBrandId === '12'" type="button" class="btn-h34-r17-fill-p16-gray pr-3" @click="onClickSizeGuide">
        사이즈 선택 팁 <i class="rb-arrow-right text-base" />
      </button>
    </div>

    <div class="space-y-1">
      <div
        v-for="option in prodDTO.optList"
        :key="option.optId"
        class="flex h-18 w-full justify-between border px-4 md:cursor-pointer"
        :class="{
          'border-black': selectedOptions.findIndex((e) => e.optId == option.optId) > -1,
          'border-rgray-100 opacity-60': selectedOptions.findIndex((e) => e.optId == option.optId) == -1
        }"
        @click="() => clickOption(option)"
      >
        <PartProductOption :option="option"></PartProductOption>
      </div>
    </div>

    <div class="mt-6">
      <p class="subhead-3-b text-black">배송</p>
      <p class="body-1-r mt-2 text-black">무료배송, 3회 무료반품</p>
      <p class="body-1-r mt-1 text-rgray-400">오후 3시 이전 결제시, 당일출고</p>
    </div>

    <img v-if="domain == 'orm'" class="mt-2" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/product_detail_resale_point.png" />
  </div>
</template>

<script setup>
import * as amplitude from '@amplitude/analytics-browser'
// 상품페이지의 이미지 아래부분입니다.
// 커머스에 따라서 정보의 구성이 많이 다른 컴포넌트입니다.
// appStore().getDomain 값으로 커머스 값을 구분합니다.
// 여기서 선택한 Option값들은 ProductOptListBottomSheet에 연동됩니다.
const props = defineProps({
  prodDTO: {
    type: Object,
    required: true
  },
  selectedOptions: {
    type: Array,
    required: true
  },
  resalePoint: {
    type: Number,
    required: false,
    default: 100000
  },
  isResaleable: {
    type: Boolean,
    required: false,
    default: false
  }
})

const domain = appStore().getDomain
const router = useRouter()
const route = useRoute()

const user = userStore()
const loggedIn = user.getLoginState

const emit = defineEmits(['clickOption', 'clickHeart'])

const openPointSection = ref(false)

const tooglePointSection = () => {
  if (openPointSection.value === false) {
    amplitude.track('itemdetail_creditPreview', { sn_code: props.prodDTO.snCode })
  }
  openPointSection.value = !openPointSection.value
}

const goToLogin = () => {
  amplitude.track('itemdetail_creditPreview_login')
  const recentRoute = useCookie('RECENT_ROUTE')
  recentRoute.value = route.fullPath
  router.push('/login')
}

const clickOption = (option) => {
  emit('clickOption', option)
}

const onClickSizeGuide = () => {
  amplitude.track('itemdetail_sizetip_anchor')
  const el = document.getElementById('product_detail_size_guide_section').getBoundingClientRect()
  window.scrollTo({
    top: window.pageYOffset + el.top - 70,
    left: 0,
    behavior: 'smooth'
  })
}

const clickHeart = () => {
  emit('clickHeart', 'info')
}
</script>
