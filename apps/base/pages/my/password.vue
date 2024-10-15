<template>
  <form class="mb-[120px] flex flex-col gap-6 px-5 pt-10" @submit.prevent="onChangePassword">
    <input
      v-model="oldPassword"
      type="password"
      class="subhead-2-b rounded-none border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
      :class="{
        'border-orange-600': includeError('not_matched_password')
      }"
      placeholder="현재 비밀번호 입력"
      @focus="resetErrorForNotMatched"
    />
    <div class="flex flex-col gap-2 pt-2">
      <div class="flex flex-col gap-0.5">
        <input
          v-model="newPassword"
          type="password"
          class="subhead-2-b border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600': isErrorRegx || isErrorLength || isErrorSame
          }"
          placeholder="새 비밀번호를 입력하세요."
          @keyup="checkPasswordHandler"
          @focus="resetPasswordForSameData"
        />
        <div class="flex gap-2.5">
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
          v-model="newPasswordChk"
          type="password"
          class="subhead-2-b border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
          :class="{
            'border-orange-600': isErrorMatch || isErrorSame
          }"
          placeholder="새 비밀번호를 다시 입력하세요."
          @keyup="recheckPasswordHandler"
          @focus="resetPasswordForSameData"
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

    <button class="btn-h52-r0-fill-wfull bg-black disabled:bg-rgray-100" :disabled="!isValidForm">변경하기</button>
  </form>
</template>

<script setup lang="ts">
// 마이페이지 > 내정보 > 비밀번호 변경 페이지
/**
 * @version 2024-08-07
 * @author sujin. shin
 * @link https://www.figma.com/design/2I2K35dNPOzOFR7M4GmMr7/Saas_%EC%8A%A4%ED%94%84%EB%A6%B0%ED%8A%B8?node-id=532-19494&m=dev
 *
 * [비밀번호 변경 정책]
 *
 * 1. 새 비밀번호 입력 시, 에러 조건 (keyup으로 바로바로 반영)
 *    1.1. default는 -> rgray 400
 *    1.2. 입력 시작하고, 조건에 맞지 않으면 -> orange 600
 *    1.3. 조건에 맞게 입력 시 -> black
 *    - [관련 error code]
 *      1. incorrect_char : 영문과 숫자 포함
 *      2. incorrect_length : 8-20자 이내
 *      3. not_matched_new_password : 비밀번호 일치
 *    ※ 만약, 해당 부분 정책 변경시 "/join/password"도 함께 변경되어야 합니다.
 *
 * 2. 현재 비밀번호와 새 비밀번호가 같은 경우, ("변경하기" 버튼을 클릭시, client에서 확인)
 *    2.1. dialog 보여주고 error 표시
 *    2.2. 새 비밀번호, 새 비밀번호 확인 input이 focusing
 *      2.2.1. error 삭제
 *      2.2.2. 새 비밀번호 데이터 삭제
 *      2.2.3. 새 비밀번호 확인 데이터 삭제
 *    - [관련 error code]
 *      1. not_matched_password
 *
 * 3. 현재 비밀번호가 틀린 경우, ("변경하기" 버튼을 클릭시, api - 서버에서 확인)
 *    3.1. api에서 'Password not matched' error message 보내줌.
 *    3.2. dialog 보여주고 error 표시
 *    3.3. 현재 비밀번호 input이 focusing 되면 error 삭제
 *    - [관련 error code]
 *      1. same_password
 */
import { repasswordAPI } from '~/composables/apiFactories/user'

const router = useRouter()

const oldPassword = ref('') // 기존 비밀번호
const newPassword = ref('') // 새 비밀번호
const newPasswordChk = ref('') // 새 비밀번호 확인
const errorArr = ref<string[]>([]) // 에러 목록

/** 에러 목록에서 삭제 */
const deleteError = (message: string) => {
  errorArr.value = errorArr.value.filter((err) => err !== message)
}
/** 에러 목록에 존재하는지 여부 확인 */
const includeError = (message: string): boolean => {
  return errorArr.value.includes(message)
}

/** 최종적으로 비밀번호 변경 가능한지 여부 */
const isValidForm = computed(() => {
  if (isCheckRegx.value && isCheckLength.value && isCheckMatch.value) return true
  return false
})

/** 영문과 숫자가 포함되어있는지 확인 여부. 전방탐색(?=)으로 무조건 1번 이상 들어가게끔 검사 */
const isCheckRegx = computed(() => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/g.test(newPassword.value)
})
/** 영문 + 숫자 에러 확인 */
const isErrorRegx = computed(() => {
  if (newPassword.value.length > 0 && includeError('incorrect_char')) return true
  return false
})

/** 유효한 길이인지 확인 여부 */
const isCheckLength = computed(() => {
  const pwLen = newPassword.value.trim().length
  if (pwLen <= 20 && pwLen >= 8) return true
  return false
})
/** 길이 유효 에러 확인 */
const isErrorLength = computed(() => {
  if (newPassword.value.length > 0 && includeError('incorrect_length')) return true
  return false
})

/** 새 비밀번호와 새 비밀번호 확인이 일치한지 확인 여부 */
const isCheckMatch = computed(() => {
  if (newPassword.value.length > 0 && newPassword.value.trim() === newPasswordChk.value.trim()) return true
  return false
})
/** 비밀번호 일치 에러 확인 */
const isErrorMatch = computed(() => {
  if (newPasswordChk.value.length > 0 && includeError('not_matched_new_password')) return true
  return false
})

/** 비밀번호 일치 에러 확인 */
const isErrorSame = computed(() => {
  if (includeError('same_password')) return true
  return false
})

/** 새 비밀번호가 유효한지 확인 */
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

/** 새 비밀번호 확인이 유효한지 확인 */
const recheckPasswordHandler = () => {
  if (!isCheckMatch.value && !isErrorMatch.value) {
    errorArr.value.push('not_matched_new_password')
  } else if (isCheckMatch.value) {
    deleteError('not_matched_new_password')
  }
}

/** 현재 비밀번호가 일치하지 않을 때, 현재 비밀번호 input 창을 focusing 하면 error 정보 삭제하는 로직 */
const resetErrorForNotMatched = () => {
  if (includeError('not_matched_password')) {
    deleteError('not_matched_password')
  }
}

/** 현재 비밀번호와 변경하려는 비밀번호가 같을 때, 변경 비밀번호 input창을 focusing 하면 데이터 초기화하는 로직 */
const resetPasswordForSameData = () => {
  if (includeError('same_password')) {
    deleteError('same_password')
    newPassword.value = ''
    newPasswordChk.value = ''
  }
}

/** 비밀번호 변경 로직 */
const onChangePassword = async () => {
  // 현재 비밀번호와 변경하려는 비밀번호가 같으면, 에러
  if (oldPassword.value === newPassword.value) {
    if (!includeError('same_password')) {
      errorArr.value.push('same_password')
    }
    appStore().setDialogDTO({
      message: '현재 비밀번호와 다른 비밀번호를 입력해주세요.',
      timeout: 3
    })
    return
  }

  const repassObj = await repasswordAPI({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  })

  if (repassObj.error.value) {
    if (repassObj.error.value.data?.message === 'Password not matched') {
      errorArr.value.push('not_matched_password')
      appStore().setDialogDTO({
        message: '현재 비밀번호가 올바르지 않습니다.',
        timeout: 3
      })
    } else {
      appStore().setDialogDTO({
        message: '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
        timeout: 3
      })
    }
  } else if (repassObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '비밀번호를 변경했습니다. 변경하신 비밀번호로 다시 로그인 후 이용해주세요.',
      timeout: 3
    })
    userStore().logout()
    router.replace('/login/email')
  } else {
    appStore().setDialogDTO({
      message: '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
      timeout: 3
    })
  }
}

onMounted(() => {
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '비밀번호 변경하기',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
