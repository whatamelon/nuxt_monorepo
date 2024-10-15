<template>
  <form class="px-5 pt-10" @submit.prevent="signUpEmailHandler">
    <h2 class="display-1-b mb-10 text-black">로그인에 사용할<br />비밀번호를 입력해주세요.</h2>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-0.5">
        <input
          v-model="password"
          type="password"
          class="subhead-2-b border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600': isErrorRegx || isErrorLength
          }"
          placeholder="비밀번호를 입력하세요."
          @keyup="checkPasswordHandler"
        />
        <div class="flex items-center gap-2.5">
          <div
            class="flex"
            :class="{
              'text-orange-600': !isCheckRegx && isErrorRegx,
              'text-rgray-400': !isCheckRegx && !isErrorRegx,
              'text-black': isCheckRegx
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.5 11.25L10.0263 16.5L19.5 7.5"
                :class="{
                  'stroke-orange-600': !isCheckRegx && isErrorRegx,
                  'stroke-rgray-400': !isCheckRegx && !isErrorRegx,
                  'stroke-black': isCheckRegx
                }"
              />
            </svg>
            <p class="label-2-r">영문과 숫자포함</p>
          </div>
          <div
            class="flex"
            :class="{
              'text-orange-600': !isCheckLength && isErrorLength,
              'text-rgray-400': !isCheckLength && !isErrorLength,
              'text-black': isCheckLength
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.5 11.25L10.0263 16.5L19.5 7.5"
                :class="{
                  'stroke-orange-600': !isCheckLength && isErrorLength,
                  'stroke-rgray-400': !isCheckLength && !isErrorLength,
                  'stroke-black': isCheckLength
                }"
              />
            </svg>
            <p class="label-2-r">8-20자 이내</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <input
          v-model="passwordChk"
          type="password"
          class="subhead-2-b border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600': isErrorMatch
          }"
          placeholder="비밀번호를 다시 입력하세요."
          @keyup="recheckPasswordHandler"
        />
        <div
          class="flex"
          :class="{
            'text-orange-600': !isCheckMatch && isErrorMatch,
            'text-rgray-400': !isCheckMatch && !isErrorMatch,
            'text-black': isCheckMatch
          }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.5 11.25L10.0263 16.5L19.5 7.5"
              :class="{
                'stroke-orange-600': !isCheckMatch && isErrorMatch,
                'stroke-rgray-400': !isCheckMatch && !isErrorMatch,
                'stroke-black': isCheckMatch
              }"
            />
          </svg>
          <p class="label-2-r">비밀번호 일치</p>
        </div>
      </div>
    </div>

    <button class="btn-h52-r0-fill-wfull mt-6 bg-black disabled:bg-rgray-100" :disabled="!isValidForm">다음</button>
  </form>
</template>

<script setup lang="ts">
// 회원가입 비밀번호 입력페이지
// validate를 통해 비밀번호 유효성 체크를 한다.
/**
 * @version 2024-08-07
 * @author sujin. shin
 * @link https://www.figma.com/design/2I2K35dNPOzOFR7M4GmMr7/Saas_%EC%8A%A4%ED%94%84%EB%A6%B0%ED%8A%B8?node-id=230-4761&m=dev
 *
 * [비밀번호 입력 정책]
 *
 * 1. 비밀번호 입력 시, 에러 조건 (keyup으로 바로바로 반영)
 *    1.1. default는 -> rgray 400
 *    1.2. 입력 시작하고, 조건에 맞지 않으면 -> orange 600
 *    1.3. 조건에 맞게 입력 시 -> black
 *    - [관련 error code]
 *      1. incorrect_char : 영문과 숫자 포함
 *      2. incorrect_length : 8-20자 이내
 *      3. not_matched_password : 비밀번호 일치
 *    ※ 만약, 해당 부분 정책 변경시 "/my/password"도 함께 변경되어야 합니다.
 */
import { showMessenger, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { signupAPI } from '~/composables/apiFactories/user'

const router = useRouter()

const password = ref('') // 비밀번호
const passwordChk = ref('') // 비밀번호 확인
const errorArr = ref<string[]>([]) // 에러 목록

/** 에러 목록에서 삭제 */
const deleteError = (message: string) => {
  errorArr.value = errorArr.value.filter((err) => err !== message)
}
/** 에러 목록에 존재하는지 여부 확인 */
const includeError = (message: string): boolean => {
  return errorArr.value.includes(message)
}

/** 비밀번호 유효성 검사 */
const isValidForm = computed(() => {
  if (isCheckRegx.value && isCheckLength.value && isCheckMatch.value) return true
  return false
})

/** 영문 + 숫자 인지 확인 */
const isCheckRegx = computed(() => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/g.test(password.value)
})
/** 영문과 숫자가 포함되어있는지 확인 여부. 전방탐색(?=)으로 무조건 1번 이상 들어가게끔 검사 */
const isErrorRegx = computed(() => {
  if (password.value.length > 0 && includeError('incorrect_char')) return true
  return false
})

/** 길이 유효한지 확인 */
const isCheckLength = computed(() => {
  const pwLen = password.value.trim().length
  if (pwLen <= 20 && pwLen >= 8) return true
  return false
})
/** 길이 유효 에러 확인 */
const isErrorLength = computed(() => {
  if (password.value.length > 0 && includeError('incorrect_length')) return true
  return false
})

/** 비밀번호가 일치하는지 확인 */
const isCheckMatch = computed(() => {
  if (password.value.length > 0 && password.value.trim() === passwordChk.value.trim()) return true
  return false
})
/** 비밀번호 일치 에러 확인 */
const isErrorMatch = computed(() => {
  if (password.value.length > 0 && includeError('not_matched_password')) return true
  return false
})

/** 비밀번호 입력 중에, 에러 조건을 확인하는 로직 */
const checkPasswordHandler = () => {
  if (!isCheckLength.value && !isErrorLength.value) {
    errorArr.value.push('incorrect_length')
  } else if (isCheckLength.value) {
    deleteError('incorrect_length')
  }

  if (!isCheckRegx.value && !isErrorRegx.value) {
    errorArr.value.push('incorrect_char')
  } else if (isCheckRegx.value) {
    deleteError('incorrect_char')
  }
}

/** 비밀번호 일치 입력 중에, 에러 조건을 확인하는 로직 */
const recheckPasswordHandler = () => {
  if (!isCheckMatch.value && !isErrorMatch.value) {
    errorArr.value.push('not_matched_password')
  } else if (isCheckMatch.value) {
    deleteError('not_matched_password')
  }
}

/** 최종 이메일 회원가입 로직 */
const signUpEmailHandler = async () => {
  const JOIN_IMPUID = useCookie('JOIN_IMPUID')
  const JOIN_ISMAFLAG = useCookie('JOIN_ISMAFLAG')
  const JOIN_EMAIL = useCookie('JOIN_EMAIL')
  const JOIN_PASSWORD = useCookie('JOIN_PASSWORD')
  JOIN_PASSWORD.value = password.value

  // TODO: useCookie에 값이 없을 수도 있어서 그 때를 대비한 방어 코드가 필요하지 않을까??
  const signupObj = await signupAPI({
    relayId: JOIN_EMAIL.value ?? '',
    relayPassword: password.value,
    marketingFlag: Boolean(JOIN_ISMAFLAG.value),
    impUid: JOIN_IMPUID.value ?? ''
  })

  if (signupObj.error.value != null) {
    // 회원가입 실패 > 고객센터로 문의
    appStore().setDialogDTO({
      message: '회원가입에 실패했습니다. 고객센터로 문의해주세요.',
      timeout: 3
    })
    // 채널톡 메신저 오픈
    showChannelButton()
    showMessenger()
  } else if (signupObj.data.value.statusCode === 200) {
    // 회원가입이 완료되면 자동으로 로그인 상태로 변경.
    const objData = signupObj.data.value.data
    userStore().setLogin({
      accessToken: objData.accessToken,
      refreshToken: objData.refreshToken
    })
    const accessToken = useCookie('accessToken')
    const refreshToken = useCookie('refreshToken')
    accessToken.value = objData.accessToken
    refreshToken.value = objData.refreshToken

    router.push('/join/welcome')
  } else if (signupObj.data.value.statusCode === 400) {
    if (signupObj.data.value.message === 'not_passed_1month') {
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

onMounted(() => {
  amplitude.track('signup_pw_pv', {
    type: 'email'
  })
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '회원가입',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: ''
  })
})

onBeforeMount(() => {
  hideGnb()
})
onUpdated(() => {
  hideGnb()
})
onUnmounted(() => {
  showGnb()
})
</script>
