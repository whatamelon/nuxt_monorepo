<template>
  <div class="flex flex-col justify-between px-5 pt-10">
    <div>
      <h2 class="display-1-b text-black">회원가입을 위해<br />약관 동의가 필요해요</h2>
      <p class="body-2-r mt-4 text-rgray-600">필수항목에 동의 후 본인인증을 진행해주세요.</p>
    </div>

    <div class="mt-10 space-y-4">
      <div class="flex items-center gap-1">
        <IconCheckboxBase id="all" :checked="isCheckedAll" @click-check="onChangeCheckbox"></IconCheckboxBase>
        <label for="all" class="subhead-3-b text-black md:cursor-pointer" @click="() => onChangeCheckbox('all')">네, 모두 동의합니다.</label>
      </div>

      <hr class="border-black" />

      <div class="flex items-center gap-1">
        <IconCheckboxBase id="rule" :checked="checkBoxes.rule" @click-check="onChangeCheckbox"></IconCheckboxBase>
        <label for="rule" class="subhead-2-b grow cursor-pointer text-gray-400" @click="() => onChangeCheckbox('rule')">이용약관 동의 (필수)</label>
        <NuxtLink class="subhead-2-b text-gray-400" to="https://mmemory.notion.site/OLO-RELAY-MARKET-288c00ec4ba54953a4bb1831ae7c2776">보기</NuxtLink>
      </div>
      <div class="flex items-center gap-1">
        <IconCheckboxBase id="personal" :checked="checkBoxes.personal" @click-check="onChangeCheckbox"></IconCheckboxBase>
        <label for="personal" class="subhead-2-b grow cursor-pointer text-gray-400" @click="() => onChangeCheckbox('personal')">개인정보 수집 및 이용 동의 (필수)</label>
        <NuxtLink class="subhead-2-b text-gray-400" to="https://mmemory.notion.site/07aa237a25e74643a96f10ee1fd07192">보기</NuxtLink>
      </div>
      <div class="flex items-center gap-1">
        <IconCheckboxBase id="age" :checked="checkBoxes.age" @click-check="onChangeCheckbox"></IconCheckboxBase>
        <label for="age" class="subhead-2-b grow cursor-pointer text-gray-400" @click="() => onChangeCheckbox('age')">만 14세 이상입니다. (필수)</label>
      </div>
      <div class="flex items-center gap-1">
        <IconCheckboxBase id="marketing" :checked="checkBoxes.marketing" @click-check="onChangeCheckbox"></IconCheckboxBase>
        <label for="marketing" class="subhead-2-b grow cursor-pointer text-gray-400" @click="() => onChangeCheckbox('marketing')">마케팅 정보 수신 동의 (선택)</label>
      </div>
    </div>
    <button
      class="btn-h52-r0-fill-wfull mt-10"
      :class="{
        'bg-rgray-100': !isValidForm,
        'bg-black': isValidForm
      }"
      @click="goToPass"
    >
      동의 후 본인인증하기
    </button>
  </div>

  <PartJoinAccountListDialog :is-open="isAccountListOpen" :users="usersList" @close="onCloseAccountListDialog" @go-login="goToLogin" @continue-join="goToJoin"></PartJoinAccountListDialog>
</template>

<script setup>
// 회원가입 체크리스트 페이지
// 필수 체크박스들을 체크하면, 아래 버튼이 활성화되면서 본인인증 할 수 있다.
import { hideChannelButton, showChannelButton, showMessenger } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { certifyUserAuthAPI } from '~/composables/apiFactories/user'

useHead({
  script: [
    {
      src: 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
    }
  ]
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const isAccountListOpen = ref(false)
const usersList = ref([])
const checkBoxes = ref({
  rule: false,
  personal: false,
  marketing: false,
  age: false
})

/** 전체 체크 */
const isCheckedAll = computed(() => {
  if (checkBoxes.value.rule && checkBoxes.value.personal && checkBoxes.value.marketing && checkBoxes.value.age) return true
  return false
})

/** 필수 체크 확인했는지 */
const isValidForm = computed(() => {
  if (checkBoxes.value.rule && checkBoxes.value.personal && checkBoxes.value.age) return true
  return false
})

/**
 * 체크박스 체크 상태 변경
 * @param {'all' | 'rule' | 'personal' | 'marketing' | 'age'} value
 */
const onChangeCheckbox = (value) => {
  if (value === 'all') {
    if (!checkBoxes.value.rule) {
      checkBoxes.value.rule = true
      checkBoxes.value.personal = true
      checkBoxes.value.marketing = true
      checkBoxes.value.age = true
    } else {
      checkBoxes.value.rule = false
      checkBoxes.value.personal = false
      checkBoxes.value.marketing = false
      checkBoxes.value.age = false
    }
    amplitude.track('agreeinfo_click')
  }
  if (value === 'rule') {
    checkBoxes.value.rule = !checkBoxes.value.rule
  }
  if (value === 'personal') {
    checkBoxes.value.personal = !checkBoxes.value.personal
  }
  if (value === 'marketing') {
    checkBoxes.value.marketing = !checkBoxes.value.marketing
  }
  if (value === 'age') {
    checkBoxes.value.age = !checkBoxes.value.age
  }
}

/** pass 본인 인증 진행 */
const goToPass = async () => {
  if (isValidForm.value) {
    const JOIN_TYPE = useCookie('JOIN_TYPE')
    amplitude.track('signup_pass_click', {
      type: JOIN_TYPE.value
    })
    const JOIN_ISMAFLAG = useCookie('JOIN_ISMAFLAG')
    JOIN_ISMAFLAG.value = checkBoxes.value.marketing

    const IMP = window.IMP
    IMP.init('imp79674425')

    const mUrl = `${window.location.origin}/join/check`

    IMP.certification(
      {
        popup: false,
        m_redirect_url: mUrl
      },
      async (rsp) => {
        if (rsp.success) {
          // 본인인증 성공!

          const JOIN_IMPUID = useCookie('JOIN_IMPUID')
          JOIN_IMPUID.value = rsp.imp_uid

          await onCertifyUser(rsp.imp_uid)
        } else if (rsp.error_code === 'F0000') {
          appStore().setDialogDTO({
            message: '인증을 취소했습니다.',
            timeout: 3
          })
        }
      }
    )
  }
}

/**
 * 본인인증 확인
 * @param impuid
 */
const onCertifyUser = async (impuid) => {
  const JOIN_TYPE = useCookie('JOIN_TYPE')
  const JOIN_USERID = useCookie('JOIN_USERID')
  const form = {
    impUid: impuid,
    snsType: JOIN_TYPE.value
  }
  if (JOIN_TYPE.value === 'kakao') form.userId = JOIN_USERID.value

  const cuaObj = await certifyUserAuthAPI(form)
  if (cuaObj.error.value != null) {
    // 본인인증 실패 > 다시 시도하거나, 고객센터로 문의
    appStore().setDialogDTO({
      message: '본인인증에 실패했습니다. 다시 본인인증을 하시거나, 고객센터로 문의해주세요.',
      timeout: 3
    })
    showChannelButton()
    showMessenger()
  } else {
    const alreadyUsers = cuaObj.data.value.data.users
    if (alreadyUsers.length > 0) {
      // 너 이미 계정있어! 다이얼로그 띄우기
      // 조건!
      // joinType == 'email' 일 때, 이미 가입한 계정이 kakao만 있고 email이 있는 경우에는

      hideChannelButton()
      usersList.value = alreadyUsers
      isAccountListOpen.value = true
    } else {
      await goToJoin()
    }
  }
}

/** 계정이 존재한다는 dialog 닫기 */
const onCloseAccountListDialog = () => {
  showChannelButton()
  isAccountListOpen.value = false
}

/**
 * 회원가입으로 이동
 * - email : email 회원가입 페이지 이동
 * - kakao : 카카오 회원가입 진행
 */
const goToJoin = async () => {
  const JOIN_TYPE = useCookie('JOIN_TYPE')
  // const JOIN_ACCSSTOKEN = useCookie('JOIN_ACCSSTOKEN')

  if (JOIN_TYPE.value === 'email') {
    router.push('/join/email')
  } else {
    const kakaoJoinObj = await useFetch('/v20/auth/signup/kakao', {
      method: 'POST',
      baseURL: config.public.baseURL,
      headers: {
        'Brand-Domain': appStore().getDomain ?? 'orm',
        Authorization: `Bearer ${sessionStorage.getItem('JOIN_ACCSSTOKEN')}`
      }
    })

    if (kakaoJoinObj.error.value != null) {
      // 회원가입 실패 > 고객센터로 문의
      if (kakaoJoinObj.error.value.data.statusCode === 400) {
        if (kakaoJoinObj.error.value.data.message === 'not_passed_1_month') {
          appStore().setDialogDTO({
            message: '탈퇴 후, 한달 이내 재가입이 불가능합니다. 궁금한 점은 고객센터로 문의해주세요.',
            timeout: 5
          })
        } else {
          appStore().setDialogDTO({
            message: '회원가입에 실패했습니다. 고객센터로 문의해주세요.',
            timeout: 5
          })
        }
      } else {
        appStore().setDialogDTO({
          message: '회원가입에 실패했습니다. 고객센터로 문의해주세요.',
          timeout: 5
        })
      }
      setTimeout(() => {
        showChannelButton()
        showMessenger()
      }, 5000)
    } else if (kakaoJoinObj.data.value.statusCode === 200) {
      // 회원가입이 완료되면 자동으로 로그인 상태로 변경.
      const objData = kakaoJoinObj.data.value.data
      userStore().setLogin({
        accessToken: objData.accessToken,
        refreshToken: objData.refreshToken
      })
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = objData.accessToken
      refreshToken.value = objData.refreshToken

      sessionStorage.removeItem('JOIN_ACCSSTOKEN')
      router.push('/join/welcome')
    } else if (kakaoJoinObj.data.value.statusCode === 400) {
      if (kakaoJoinObj.data.value.message === 'not_passed_1_month') {
        appStore().setDialogDTO({
          message: '탈퇴 후, 한달 이내 재가입이 불가능합니다. 궁금한 점은 고객센터로 문의해주세요.',
          timeout: 3
        })
      } else {
        appStore().setDialogDTO({
          message: '회원가입에 실패했습니다. 고객센터로 문의해주세요.',
          timeout: 3
        })
      }
    } else {
      appStore().setDialogDTO({
        message: '회원가입에 실패했습니다. 고객센터로 문의해주세요.',
        timeout: 3
      })
    }
  }
}

/** 로그인 페이지로 이동 */
const goToLogin = () => {
  router.push('/login')
}

if (process.client) {
  if (route.query.imp_uid && route.query.success) {
    const JOIN_IMPUID = useCookie('JOIN_IMPUID')
    JOIN_IMPUID.value = route.query.imp_uid
    // 본인인증 성공!
    setTimeout(async () => {
      await onCertifyUser(route.query.imp_uid)
    }, 1000)
  }
}

onBeforeMount(async () => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: '/login'
  })
  hideGnb()
})

onUpdated(() => {
  hideGnb()
})
onUnmounted(() => {
  showGnb()
})
</script>
