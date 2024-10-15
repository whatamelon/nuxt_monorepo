<template>
  <div v-show="footerType" class="z-40 w-full bg-rgray-50 px-5 pb-20 pt-10 md:max-w-pc">
    <ClientOnly>
      <NuxtImg :src="getHeadObject.brandMetadata.logo_image" class="my-auto h-5" />
      <p class="body-long-1-r mt-4 text-black">{{ getHeadObject.brandMetadata.footerBody }}</p>
    </ClientOnly>

    <hr class="mb-4 mt-6 border-rgray-100" />

    <div class="flex space-x-4">
      <p class="subhead-3-b text-black">고객센터</p>
      <p class="subhead-3-b text-black">02-522-1352</p>
    </div>

    <div class="mt-4 flex space-x-4">
      <p class="subhead-3-b text-black">상담시간</p>
      <div class="space-y-1">
        <p class="body-1-r text-black">평일 10:00 ~ 17:00</p>
        <p class="body-1-r text-[rgba(34,34,34,0.6)]">점심시간 12:00 ~ 13:00 *토, 일, 공휴일 휴무</p>
      </div>
    </div>

    <hr class="my-4 border-rgray-100" />

    <ClientOnly>
      <template #fallback>
        <NuxtLink class="subhead-long-3-b text-black md:cursor-pointer">공지사항</NuxtLink>
        <hr class="my-4 border-rgray-100" />
        <NuxtLink class="subhead-long-3-b text-black md:cursor-pointer">FAQ</NuxtLink>
        <hr class="my-4 border-rgray-100" />
        <NuxtLink class="subhead-long-3-b text-black md:cursor-pointer">개인정보처리방침</NuxtLink>
        <hr class="my-4 border-rgray-100" />
        <NuxtLink class="subhead-long-3-b text-black md:cursor-pointer">이용약관</NuxtLink>
      </template>

      <NuxtLink v-if="getHeadObject.brandMetadata.isNotice" :to="getHeadObject.brandMetadata.noticeUrl" :external="true" target="_blank" class="subhead-long-3-b text-black md:cursor-pointer"
        >공지사항</NuxtLink
      >

      <NuxtLink v-else :to="getHeadObject.brandMetadata.brandStoreUrl" :external="true" target="_blank" class="subhead-long-3-b text-black md:cursor-pointer"
        >{{ getHeadObject.brandMetadata.brandName }} 공식몰 바로가기</NuxtLink
      >

      <hr class="my-4 border-rgray-100" />

      <NuxtLink :to="getHeadObject.brandMetadata.faqUrl" :external="true" target="_blank" class="subhead-long-3-b text-black md:cursor-pointer"
        >{{ getHeadObject.brandMetadata.siteName }} FAQ</NuxtLink
      >

      <hr class="my-4 border-rgray-100" />

      <NuxtLink :to="getHeadObject.brandMetadata.personalUrl" :external="true" target="_blank" class="subhead-long-3-b text-black md:cursor-pointer">개인정보처리방침</NuxtLink>

      <hr class="my-4 border-rgray-100" />

      <NuxtLink :to="getHeadObject.brandMetadata.ruleUrl" :external="true" target="_blank" class="subhead-long-3-b text-black md:cursor-pointer">이용약관</NuxtLink>
    </ClientOnly>

    <hr class="mb-6 mt-4 border-rgray-100" />

    <div class="label-2-r mb-6 text-center text-black">
      고객님은 안전거래를 위해 결제 시 저희 사이트에서<br />
      가입한 구매안전 서비스를 이용하실 수 있습니다.
      <NuxtLink to="/files/구매안전서비스 이용 확인증.pdf" :external="true" target="_blank" class="flex justify-center">
        <NuxtImg class="mt-2" src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/tosspayments.png" width="245px" height="20px" />
      </NuxtLink>
    </div>

    <div class="mx-auto flex w-fit" @click="isOpen = !isOpen">
      <p class="subhead-2-b my-auto text-black">(주)마들렌메모리 사업자 정보</p>

      <svg v-if="isOpen == false" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M6.5 9.65039L12.5 15.6504L18.5 9.65039" stroke="black" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M18.5 15.6504L12.5 9.65039L6.5 15.6504" stroke="black" />
      </svg>
    </div>

    <div v-if="isOpen" class="mt-2 text-center">
      <p class="label-2-r text-rgray-600">
        사업자등록번호 : 705-87-01046<br />통신판매업신고번호 : 2023-서울강남-06072호<br />대표자 : 유재원<br />주소 : 서울특별시 강남구 테헤란로79길 6, 4층 417호(삼성동)
      </p>

      <NuxtLink :to="`http://www.ftc.go.kr/bizCommPop.do?wrkr_no=7058701046`" :external="true" target="_blank" class="caption-2-b text-rgray-600 md:cursor-pointer">사업자 정보 확인</NuxtLink>
    </div>

    <p class="label-2-r mt-2 text-center text-black">Copyright ©RELAY All Rights Reserved.</p>
  </div>
</template>

<script setup>
// footer입니다.
// brandMetadata의 정보를 따라갑니다.
// 페이지에 따라 footer를 보여줄지 말지 결정합니다.
import { storeToRefs } from 'pinia'

const route = useRoute()
const { getHeadObject } = storeToRefs(appStore())

const isOpen = ref(false)
const footerType = ref(true)

const footerTypeMap = {
  address: false,
  'address-input': false,
  'order-result': false,
  product_list: false,
  'event-pi-id': false,
  search: false,
  'sell-new': false,
  'order-checkout': false,
  'join-select': false,
  'join-check': false,
  'join-email': false,
  'join-password': false,
  'join-welcome': false,
  'join-validEmail': false,
  login: false,
  'login-email': false,
  'help-email': false,
  'help-password': false,
  'my-order-id': false,
  'my-sell-id': false,
  'my-password': false
}

const routeMatch = () => {
  if (route.name) {
    footerType.value = footerTypeMap[route.name] !== undefined ? footerTypeMap[route.name] : true
  }
}

routeMatch()

watch(
  () => route.name,
  () => {
    routeMatch()
  }
)
</script>
