<template>
  <div class="mb-[120px] bg-white pt-10">
    <div class="px-5">
      <div>
        <ClientOnly>
          <p class="headline-b text-black">내 정보</p>
          <hr class="mt-4 border border-black" />

          <div v-if="data.data?.authFlag" class="space-y-6 pt-6">
            <div class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">이름</p>
              <p class="body-1-r text-black">{{ data.data.name }}</p>
            </div>
            <div v-if="data.data?.snsType == 'email'" class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">이메일</p>
              <p class="body-1-r text-black">{{ data.data.relayId }}</p>
            </div>
            <div class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">휴대전화번호</p>
              <p class="body-1-r text-black">{{ formatPhone(data.data.mobileNo) }}</p>
            </div>
            <button class="btn-h52-r0-line-wfull-gray200" @click="onUpdateUserAuth">본인인증으로 정보 수정하기</button>
          </div>

          <button v-else class="btn-h52-r0-line-wfull-gray200 mt-6" @click="onUpdateUserAuth">본인인증하기</button>

          <button v-if="data.data?.snsType == 'email'" class="btn-h52-r0-line-wfull-gray200 mt-2" @click="goToChangePassword">비밀번호 변경하기</button>

          <p class="headline-b mt-16 text-black">{{ pageObj.data.value.data.contents.brandMallName }} 인증</p>
          <hr class="mt-4 border border-black" />

          <div v-if="data.data?.buidAuthFlag" class="mt-6 flex items-start space-x-4">
            <p class="subhead-2-b my-auto w-20 break-keep text-rgray-400">{{ pageObj.data.value.data.contents.brandMallName }} 계정</p>
            <div class="flex space-x-2">
              <p class="body-1-r my-auto text-black">인증완료</p>
              <button class="btn-h24-r0-line-p8-gray" @click="onUpdateBrandAuth">재인증</button>
            </div>
          </div>

          <button v-else class="btn-h52-r0-line-wfull-gray200 mt-6" @click="onUpdateBrandAuth">{{ pageObj.data.value.data.contents.brandMallName }} 인증하기</button>

          <!-- <button class="btn-h52-r0-line-wfull-gray200 mt-6" @click="() => (isOpenBrandAuth = true)">{{ pageObj.data.value.data.contents.brandMallName }} 인증하기</button> -->

          <p class="headline-b mt-16 text-black">환불 계좌 정보</p>
          <hr class="mt-4 border border-black" />

          <div v-if="data.data?.refInfo.bankName != null" class="mt-6 space-y-6">
            <div class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">이름</p>
              <p class="body-1-r text-black">{{ data.data.refInfo.holder }}</p>
            </div>
            <div class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">은행</p>
              <p class="body-1-r text-black">{{ data.data.refInfo.bankName }}</p>
            </div>
            <div class="flex space-x-4">
              <p class="subhead-2-b w-20 text-rgray-400">계좌번호</p>
              <p class="body-1-r text-black">{{ data.data.refInfo.account }}</p>
            </div>
            <button class="btn-h52-r0-line-wfull-gray200" @click="toggleOpenAccountDialogHandler">환불계좌 변경하기</button>
          </div>

          <button v-else class="btn-h52-r0-line-wfull-gray200 mt-6" @click="toggleOpenAccountDialogHandler">환불계좌 등록하기</button>

          <p class="headline-b mt-16 text-black">마케팅 정보 수신 동의</p>
          <hr class="mt-4 border border-black" />

          <div class="mt-6 flex justify-between">
            <p class="subhead-2-b my-auto text-black">카카오톡 혹은 문자 등으로 수신되는 소식 받기</p>

            <svg v-if="!data.data?.maFlag" xmlns="http://www.w3.org/2000/svg" width="66" height="32" viewBox="0 0 66 32" fill="none" class="md:cursor-pointer" @click="() => onUpdateMarketing(true)">
              <rect width="66" height="32" rx="16" fill="#E7E7E7" />
              <circle cx="16" cy="16" r="12" fill="white" />
              <path
                d="M40.3555 15.7578C40.3555 16.6484 40.1875 17.4238 39.8516 18.084C39.5195 18.7402 39.0586 19.2441 38.4688 19.5957C37.8789 19.9434 37.2109 20.1172 36.4648 20.1172C35.7188 20.1172 35.0508 19.9434 34.4609 19.5957C33.875 19.2441 33.4141 18.7383 33.0781 18.0781C32.7422 17.418 32.5742 16.6445 32.5742 15.7578C32.5742 14.8594 32.7422 14.082 33.0781 13.4258C33.4141 12.7695 33.875 12.2676 34.4609 11.9199C35.0508 11.5723 35.7188 11.3984 36.4648 11.3984C37.2109 11.3984 37.8789 11.5723 38.4688 11.9199C39.0586 12.2676 39.5195 12.7695 39.8516 13.4258C40.1875 14.082 40.3555 14.8594 40.3555 15.7578ZM38.8262 15.7578C38.8262 15.125 38.7266 14.584 38.5273 14.1348C38.332 13.6855 38.0566 13.3457 37.7012 13.1152C37.3496 12.8848 36.9375 12.7695 36.4648 12.7695C36 12.7695 35.5879 12.8848 35.2285 13.1152C34.873 13.3457 34.5957 13.6855 34.3965 14.1348C34.2012 14.584 34.1035 15.125 34.1035 15.7578C34.1035 16.3906 34.2012 16.9316 34.3965 17.3809C34.5957 17.8301 34.873 18.1699 35.2285 18.4004C35.5879 18.6309 36 18.7461 36.4648 18.7461C36.9375 18.7461 37.3496 18.6309 37.7012 18.4004C38.0566 18.1699 38.332 17.8301 38.5273 17.3809C38.7266 16.9316 38.8262 16.3906 38.8262 15.7578ZM41.1207 11.5156H46.5523V12.7988H42.6441V15.1191H46.1773V16.3906H42.6441V20H41.1207V11.5156ZM47.2473 11.5156H52.6789V12.7988H48.7707V15.1191H52.3039V16.3906H48.7707V20H47.2473V11.5156Z"
                fill="#888888"
              />
            </svg>

            <svg v-else xmlns="http://www.w3.org/2000/svg" width="63" height="32" viewBox="0 0 63 32" fill="none" class="md:cursor-pointer" @click="() => onUpdateMarketing(false)">
              <rect width="63" height="32" rx="16" fill="#222222" />
              <path
                d="M20.3555 15.7578C20.3555 16.6484 20.1875 17.4238 19.8516 18.084C19.5195 18.7402 19.0586 19.2441 18.4688 19.5957C17.8789 19.9434 17.2109 20.1172 16.4648 20.1172C15.7188 20.1172 15.0508 19.9434 14.4609 19.5957C13.875 19.2441 13.4141 18.7383 13.0781 18.0781C12.7422 17.418 12.5742 16.6445 12.5742 15.7578C12.5742 14.8594 12.7422 14.082 13.0781 13.4258C13.4141 12.7695 13.875 12.2676 14.4609 11.9199C15.0508 11.5723 15.7188 11.3984 16.4648 11.3984C17.2109 11.3984 17.8789 11.5723 18.4688 11.9199C19.0586 12.2676 19.5195 12.7695 19.8516 13.4258C20.1875 14.082 20.3555 14.8594 20.3555 15.7578ZM18.8262 15.7578C18.8262 15.125 18.7266 14.584 18.5273 14.1348C18.332 13.6855 18.0566 13.3457 17.7012 13.1152C17.3496 12.8848 16.9375 12.7695 16.4648 12.7695C16 12.7695 15.5879 12.8848 15.2285 13.1152C14.873 13.3457 14.5957 13.6855 14.3965 14.1348C14.2012 14.584 14.1035 15.125 14.1035 15.7578C14.1035 16.3906 14.2012 16.9316 14.3965 17.3809C14.5957 17.8301 14.873 18.1699 15.2285 18.4004C15.5879 18.6309 16 18.7461 16.4648 18.7461C16.9375 18.7461 17.3496 18.6309 17.7012 18.4004C18.0566 18.1699 18.332 17.8301 18.5273 17.3809C18.7266 16.9316 18.8262 16.3906 18.8262 15.7578ZM28.0875 20H26.734L22.7203 14.2051H22.6441V20H21.1207V11.5156H22.4918L26.4937 17.3164H26.5699V11.5156H28.0875V20Z"
                fill="white"
              />
              <circle cx="47" cy="16" r="12" fill="white" />
            </svg>
          </div>
        </ClientOnly>
      </div>
    </div>

    <PartMyBrandAuthDialog :dialog-open="isOpenBrandAuth" @success-dialog="onSuccessBrandAuthDialog" @close-dialog="onCloseBrandAuthDialog" />

    <AppModalDialog :is-open="isOpenAccountDialog" is-full-screen @update-open="toggleOpenAccountDialogHandler">
      <div class="px-5 pb-8 pt-10">
        <div class="flex h-full w-full justify-between pb-5">
          <div class="w-[18px]"></div>

          <!-- title -->
          <h1 class="subhead-3-b my-auto w-[176px] truncate text-center text-black">{{ accountDialogTitle }}</h1>

          <!-- close -->
          <i class="rb-close my-auto text-24xl text-black" @click="toggleOpenAccountDialogHandler"></i>
        </div>

        <div class="max-h-screen space-y-3 pb-10 pt-5">
          <div class="flex space-x-2">
            <p class="body-1-r my-auto w-16 text-black">계좌주</p>
            <div style="width: calc(100% - 72px)">
              <input
                v-model="holderInput"
                type="text"
                class="subhead-2-b h-13 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
                :class="{
                  'border-orange-600': errorObj.code == 'no_holder'
                }"
                placeholder="이름을 입력해주세요."
              />
            </div>
          </div>

          <div class="flex w-full justify-between space-x-2">
            <p class="body-1-r w-16 pt-3.5 text-black">은행</p>

            <div style="width: calc(100% - 72px)">
              <div
                class="flex h-12 w-full justify-between border border-solid px-4 md:cursor-pointer"
                :class="{
                  'border-black': dropdownActive,
                  'border-rgray-100': !dropdownActive
                }"
                @click="toggleDropdownHandler"
              >
                <p class="body-1-r my-auto text-black">{{ selectedBank.name }}</p>
                <i
                  class="rb-arrow-down my-auto text-24xl"
                  :class="{
                    'rotate-180': dropdownActive
                  }"
                ></i>
              </div>
              <div v-if="dropdownActive" class="static max-h-64 space-y-4 overflow-y-scroll border-x border-b border-black px-4 pb-4">
                <p v-for="bank in bankList" :key="bank" class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="() => onChangeBank(bank)">{{ bank.name }}</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-2">
            <p class="body-1-r my-auto w-16 text-black">계좌번호</p>
            <div style="width: calc(100% - 72px)">
              <input
                v-model="accountInput"
                type="text"
                class="subhead-2-b h-13 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
                :class="{
                  'border-orange-600': errorObj.code == 'no_account'
                }"
                placeholder="숫자로만 입력 (-제외)"
                maxlength="20"
              />
            </div>
          </div>
        </div>

        <button
          class="btn-h56-r28-fill-wfull"
          :class="{
            'bg-rgray-200': !isBankValid,
            'bg-black': isBankValid
          }"
          @click="onUpdateRetBankDialog"
        >
          저장
        </button>
      </div>
    </AppModalDialog>
  </div>
</template>

<script setup>
// 마이페이지 > 내정보페이지
import { getUserInfoAPI, certifyUserBrandAuthAPI, updateUserInfoAPI, certifyUserMyPageAuthAPI, getMyProfilePageAPI } from '~/composables/apiFactories/user'

useHead({
  script: [
    {
      src: 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
    }
  ]
})

const route = useRoute()
const router = useRouter()

const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})
// 브랜드몰 인증
const isOpenBrandAuth = ref(false)
const isOpenAccountDialog = ref(false)
const holderInput = ref('')
const selectedBank = ref({ name: '', code: '' })
const dropdownActive = ref(false)
const accountInput = ref('')

const accountDialogTitle = computed(() => {
  if (data.value.data?.refInfo.holder !== '') return '환불계좌 변경하기'
  return '환불계좌 등록하기'
})

const isBankValid = computed(() => {
  if (holderInput.value.trim() !== '' && selectedBank.value.name.trim() !== '' && accountInput.value.trim() !== '' && accountInput.value.trim().length < 20) {
    return true
  }
  return false
})

const { data, error, execute } = await getUserInfoAPI()
if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
}

const pageObj = await getMyProfilePageAPI()
if (pageObj.error.value != null) {
  useRetryError(pageObj.error.value.data.statusCode, pageObj.execute)
}

if (process.client) {
  if (route.query.imp_uid && route.query.success) {
    if (route.query.success) {
      setTimeout(async () => {
        await onCertifyUser(route.query.imp_uid)
      }, 1000)
    }
  }
}

/** 비밀번호 변경 페이지로 이동 */
const goToChangePassword = () => {
  router.push('/my/password')
}

/**
 * 본인인증 확인
 * @param impuid
 */
const onCertifyUser = async (impuid) => {
  const cuaaObj = await certifyUserMyPageAuthAPI({
    impUid: impuid
  })
  if (cuaaObj.error.value != null) {
    appStore().setDialogDTO({
      message: '본인인증에 실패했습니다.',
      timeout: 3
    })
    useRetryError(cuaaObj.error.value.data.statusCode, cuaaObj.execute)
  } else {
    appStore().setDialogDTO({
      message: '본인인증에 성공했습니다.',
      timeout: 3
    })
  }
}

/**
 * 본인인증 절차 진행 - 아임포트
 */
const onUpdateUserAuth = async () => {
  const IMP = window.IMP
  IMP.init('imp79674425')

  const mUrl = `${window.location.origin}/my/profile`

  IMP.certification(
    {
      popup: false,
      m_redirect_url: mUrl
    },
    async (rsp) => {
      if (rsp.success) {
        const impUID = rsp.imp_uid

        const cuaaObjs = await certifyUserMyPageAuthAPI({
          impUid: impUID
        })
        if (cuaaObjs.error.value != null) {
          useRetryError(cuaaObjs.error.value.data.statusCode, cuaaObjs.execute)
        } else {
          appStore().setDialogDTO({
            message: '본인인증에 성공했습니다.',
            timeout: 3
          })
          execute()
        }
      } else if (rsp.error_code === 'F0000') {
        appStore().setDialogDTO({
          message: '본인인증을 취소했습니다.',
          timeout: 3
        })
      }
    }
  )
}

/** 브랜드몰 인증 절차 진행 */
const onUpdateBrandAuth = async () => {
  if (!data.value.data?.authFlag) {
    appStore().setDialogDTO({
      message: '먼저 본인인증을 완료해주세요.',
      timeout: 3
    })
  } else {
    const cubaObj = await certifyUserBrandAuthAPI()
    if (cubaObj.error.value != null) {
      useRetryError(cubaObj.error.value.data.statusCode, cubaObj.execute)
    } else if (cubaObj.data.value.statusCode === 200) {
      if (cubaObj.data.value.data.status === 'GOOD') {
        appStore().setDialogDTO({
          message: '인증에 성공했습니다!\n판매 신청하고 보상 포인트를 받아보세요!',
          timeout: 4
        })
        // 인증 성공. /sell로 이동
        onSuccessBrandAuthDialog()
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
        // 브랜드몰 인증 dialog 오픈.
        isOpenBrandAuth.value = true
      }
      execute()
    } else {
      appStore().setDialogDTO({
        message: '브랜드몰 회원인증에 실패했습니다.',
        timeout: 4
      })
    }
  }
}

/**
 * 마케팅 정보 수신 동의
 * @param {boolean} flag
 */
const onUpdateMarketing = async (flag) => {
  const obj = {
    marketingFlag: flag
  }
  const uuiaObj = await updateUserInfoAPI(obj)
  if (uuiaObj.error.value != null) {
    useRetryError(uuiaObj.error.value.data.statusCode, uuiaObj.execute)
  } else if (uuiaObj.data.value.statusCode === 200) {
    if (flag) {
      appStore().setDialogDTO({
        message: '마케팅 정보 수신에 동의했습니다.',
        timeout: 3
      })
    } else {
      appStore().setDialogDTO({
        message: '마케팅 정보 수신 동의 해제했습니다.',
        timeout: 3
      })
    }
    execute()
  } else {
    appStore().setDialogDTO({
      message: '마케팅 정보 수신동의 변경에 실패했습니다.',
      timeout: 3
    })
  }
}

/** 환불계좌 업데이트 */
const onUpdateRetBankDialog = async () => {
  if (isBankValid.value) {
    let obj
    if (data.value.data?.refInfo.bankName !== null) {
      obj = {
        holder: holderInput.value,
        bankName: selectedBank.value.name,
        account: accountInput.value
      }
    } else {
      // 환불계좌 최초 등록일경우 bankCode도 넘겨야함
      obj = {
        holder: holderInput.value,
        bankName: selectedBank.value.name,
        bankCode: selectedBank.value.code,
        account: accountInput.value
      }
    }
    const uuiaObj = await updateUserInfoAPI(obj)

    if (uuiaObj.error.value != null) {
      appStore().setDialogDTO({
        message: '환불계좌 저장에 실패했습니다.',
        timeout: 3
      })
      useRetryError(uuiaObj.error.value.data.statusCode, uuiaObj.execute)
    } else if (uuiaObj.data.value.statusCode === 200) {
      appStore().setDialogDTO({
        message: '환불계좌를 저장했습니다.',
        timeout: 3
      })
      execute()
      toggleOpenAccountDialogHandler()
    } else {
      appStore().setDialogDTO({
        message: '환불계좌 저장에 실패했습니다.',
        timeout: 3
      })
    }
  }
}

/** 환불계좌 dialog 토글 */
const toggleOpenAccountDialogHandler = () => {
  isOpenAccountDialog.value = !isOpenAccountDialog.value
}

/** 브랜드 인증 성공 => 판매 페이지로 이동 */
const onSuccessBrandAuthDialog = () => {
  router.push('/sell')
}
/** close 브랜드 인증 dialog */
const onCloseBrandAuthDialog = () => {
  isOpenBrandAuth.value = false
}
/** dropdown 토글 */
const toggleDropdownHandler = () => {
  dropdownActive.value = !dropdownActive.value
}

/**
 * 환불계좌 은행 변경
 * @param {GlobalCode} bank 환불 은행 정보
 */
const onChangeBank = (bank) => {
  selectedBank.value = bank
  toggleDropdownHandler()
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '내 정보 관리',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})

onBeforeRouteLeave((to, _, next) => {
  if (to.name === 'my' && isOpenBrandAuth.value) {
    // 브랜드몰 인증 dialog가 열려있을 때 뒤로가기를 하면 dialog 닫아야 함.
    isOpenBrandAuth.value = false
    next(false)
    return
  }
  next()
})
</script>
