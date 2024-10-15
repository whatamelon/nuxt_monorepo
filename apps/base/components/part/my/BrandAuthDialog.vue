<template>
  <AppModalDialog :is-open="dialogOpen" :is-full-screen="true">
    <!-- header -->
    <div class="flex w-full justify-between px-5 py-4">
      <div class="w-[18px]"></div>
      <h1 class="subhead-3-b my-auto w-[176px] truncate text-center text-black">{{ brandMallName }} 인증하기</h1>
      <i class="rb-close my-auto text-24xl text-black" @click="closeHandler"></i>
    </div>
    <!-- body -->
    <div class="space-y-5 px-5 py-10">
      <div class="space-y-4">
        <h2 class="display-1-b">{{ brandMallName }} 인증이 필요해요</h2>
        <p class="body-2-r break-keep text-rgray-600">{{ sellName }} 성공시, {{ brandMallName }}{{ pointName }} 지급하기 위해 {{ brandMallName }} 인증이 필요합니다.</p>
      </div>
      <div class="flex flex-col gap-4">
        <!-- step 1 -->
        <button type="button" class="flex flex-col p-6" :class="!isCheckedStep ? 'bg-black text-white' : 'border border-black bg-white text-black'" @click="goToBrandMall">
          <p class="subhead-2-b mb-1">Step 1</p>
          <p class="subhead-3-b mb-3.5">{{ brandMallName }} 회원가입</p>
          <div class="flex w-full justify-end">
            <p class="flex items-center justify-center gap-0.5 pr-2" :class="!isCheckedStep ? 'btn-h32-r16-fill-p16-white' : 'btn-h32-r16-fill-p16'">
              <span class="subhead-2-b">{{ brandMallName }}</span> <i class="rb-arrow-right_light" />
            </p>
          </div>
        </button>
        <!-- step 2 -->
        <button type="button" :disabled="!isCheckedStep" class="group relative flex justify-between bg-black p-6 text-white disabled:bg-rgray-50 disabled:text-rgray-400" @click="brandAuthHandler">
          <div class="mb-0.5 flex flex-col items-start gap-1">
            <p class="subhead-2-b">Step 2</p>
            <p class="subhead-3-b">{{ relayMallName }} 인증 완료하기</p>
            <p class="body-1-r text-start">
              {{ brandMallName }} 회원가입 후,<br />
              인증 완료하시기 바랍니다
            </p>
          </div>
          <div class="absolute bottom-6 right-6">
            <p class="btn-h32-r16-fill-p16-white flex items-center justify-center gap-0.5 pr-2 group-disabled:text-rgray-400">
              <span class="subhead-2-b">인증완료</span> <i class="rb-arrow-right_light" />
            </p>
          </div>
        </button>
      </div>
    </div>
  </AppModalDialog>
</template>

<script setup>
/**
 * 브랜드몰 인증 dialog 정책 정리
 * @since 2024-08-29
 * @author ssj
 * @version 1
 *
 * [현재 진입 지점]
 * 1. /sell/new 판매 신청
 * 2. /my/profile 브랜드몰 인증
 *
 * [사용자 액션]
 * 1-1. 인증 완료 - 판매 신청 step 1 : 판매 가능 조건 확인 페이지로 이동. (단순 dialog 닫기)
 * 1-2. 인증 실패 - dialog 유지
 * 1-3. 닫기/뒤로가기 - 홈으로 이동.
 *
 * 2-1. 인증 완료 - 판매 랜딩 페이지로 이동. (/sell)
 * 2-2. 인증 실패 - dialog 유지
 * 2-3. 닫기/뒤로가기 - 홈으로 이동.
 *
 * [dialog close]
 * 현재 단순히 닫는 행위는 없음.
 * - 인증이 완료되거나 (커스텀 이동)
 * - 실패하거나 (유지)
 * - 홈으로 이동하거나 (홈으로 이동)
 *
 * =====================================================
 *
 * @since 2024-09-27
 * @author ssj
 * @version 2
 *
 * [사용자 액션]
 * 1-1. 인증 완료 - 판매 신청 step 4 : 최종 확인(소량/대량) > 판매 신청 완료 버튼 클릭시, dialog 오픈.
 * 1-2. 인증 실패 - dialog 유지
 * 1-3. 닫기/뒤로가기 - dialog 닫기
 *
 * 2-1. 인증 완료 - 판매 랜딩 페이지로 이동. (/sell)
 * 2-2. 인증 실패 - dialog 유지
 * 2-3. 닫기/뒤로가기 - dialog 닫기
 *
 * [dialog close]
 * - 인증이 완료되거나 (커스텀 이동)
 * - 실패하거나 (유지)
 * - dialog 닫거나
 */
import { getBrandAuthPageAPI, certifyUserBrandAuthAPI } from '~/composables/apiFactories/user'

defineProps({
  dialogOpen: {
    type: Boolean,
    required: true
  }
})
// 인증이 완료되면 각 페이지 별로 이동하는 곳이 다르기 때문에 emit으로.
const emit = defineEmits(['successDialog', 'closeDialog'])

const isCheckedStep = ref(false) // 브랜드몰을 다녀왔는지 여부 확인
let brandMallName // 브랜드몰 이름
// 릴레이몰 이름
const relayMallName = computed(() => {
  if (appStore().getDomain === 'orm') return 'OLO 릴레이마켓'
  if (appStore().getDomain === 'nsr') return 'RE-NSR 공식 온라인몰'
  if (appStore().getDomain === 'greenforet') return '그린포레 공식몰'
  return ''
})
// 포인트 명칭
const pointName = computed(() => {
  if (appStore().getDomain === 'orm') return ' OLO 포인트로'
  if (appStore().getDomain === 'nsr') return '에서 사용하실 수 있는 포인트로'
  if (appStore().getDomain === 'greenforet') return '에서 사용하실 수 있는 적립금으로'
  return ''
})
// 판매 명칭. 그린포레만 리셀.
const sellName = computed(() => {
  if (appStore().getDomain === 'greenforet') return '리셀'
  return '판매'
})

const { data: brandAuth } = await getBrandAuthPageAPI()

if (process.client) {
  brandMallName = brandAuth.value.data.contents.brandMallName
}

/** 브랜드몰 인증 */
const brandAuthHandler = async () => {
  const cubaObj = await certifyUserBrandAuthAPI()
  if (cubaObj.error.value != null) {
    useRetryError(cubaObj.error.value.data.statusCode, cubaObj.execute)
  } else if (cubaObj.data.value.statusCode === 200) {
    if (cubaObj.data.value.data.status === 'GOOD') {
      appStore().setDialogDTO({
        message: '인증에 성공했습니다!\n판매 신청하고 보상 포인트를 받아보세요!',
        timeout: 4
      })
      isCheckedStep.value = false
      emit('successDialog')
    }
    if (cubaObj.data.value.data.status === 'HOLD') {
      appStore().setDialogDTO({
        message: '휴면 회원입니다.\n브랜드몰에서 휴면 해지 후, 다시 시도해 주세요.',
        timeout: 4
      })
    }
    if (cubaObj.data.value.data.status === 'MANY') {
      appStore().setDialogDTO({
        message: '브랜드몰 계정이 여러개입니다. 고객센터에 문의해주세요.',
        timeout: 4
      })
    }
    if (cubaObj.data.value.data.status === 'NONE') {
      appStore().setDialogDTO({
        message: '인증에 실패했습니다.\n브랜드몰 회원가입 후, 다시 시도해 주세요.',
        timeout: 4
      })
    }
  } else {
    appStore().setDialogDTO({
      message: '브랜드몰 회원인증에 실패했습니다.',
      timeout: 4
    })
  }
}

/** 브랜드몰 회원가입 페이지로 이동 */
const goToBrandMall = () => {
  navigateTo(brandAuth.value.data.contents.brandMallSignUpUrl, {
    external: true,
    open: {
      target: '_blank'
    }
  })
  isCheckedStep.value = true
}

/** 닫기 버튼 (X) 누를 시 행동 */
const closeHandler = () => {
  isCheckedStep.value = false
  emit('closeDialog')
}
</script>
