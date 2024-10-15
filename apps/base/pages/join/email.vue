<template>
  <div class="px-5 pt-10">
    <h2 class="display-1-b mb-10 text-black">로그인에 사용할<br />이메일 주소를 입력해주세요.</h2>
    <input
      v-model="email"
      class="subhead-2-b w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
      :class="{
        'border-orange-600': errorObj.code == 'fail_regx'
      }"
      placeholder="이메일 입력"
    />
    <p v-if="errorObj.code == 'fail_regx'" class="label-2-r mt-1 text-orange-600">{{ errorObj.msg }}</p>

    <button v-if="isLoading" class="btn-h52-r0-fill-wfull mt-6">
      <AppSpinner class="mx-auto !border-white"></AppSpinner>
    </button>

    <button
      v-else
      class="btn-h52-r0-fill-wfull mt-6"
      :disabled="!isValidForm"
      :class="{
        'bg-rgray-100': !isValidForm,
        'bg-black': isValidForm
      }"
      @click="next"
    >
      다음
    </button>
  </div>
</template>

<script setup>
// 회원가입 이메일 입력 페이지
// validate를 통해 이메일 유효성검사를 한다.
import * as amplitude from '@amplitude/analytics-browser'
import { checkDuplicatedEmailAPI } from '~/composables/apiFactories/user'

const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

/** 이메일 유효한지 확인 */
const isValidForm = computed(() => {
  if (email.value.trim().length > 0) return true
  return false
})

const setErrorObj = (obj) => {
  errorObj.value = obj

  setTimeout(() => {
    errorObj.value = {
      code: '',
      msg: '',
      time: 0
    }
  }, obj.time)
}

/**
 * 이메일 정규식으로 유효한지 확인
 * @param {string} email 이메일
 */
const emailRegxTest = (email) => {
  const regx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  if (!regx.test(email)) {
    return false
  }
  return true
}

/**
 * 중복된 이메일인지 확인
 * @param {string} email 이메일
 */
const onCheckDuplicatedEmail = async (email) => {
  const checkDuplEmailObj = await checkDuplicatedEmailAPI({
    relayId: email
  })
  if (checkDuplEmailObj.error.value != null) {
    useRetryError(checkDuplEmailObj.error.value.data.statusCode, checkDuplEmailObj.execute)
    return false
  }
  if (checkDuplEmailObj.data.value.data.isRelayIdExists) {
    return false
  }
  return true
}

/** 이메일 유효한지 확인하고, 회원가입 - 비밀번호 등록하는 페이지로 이동. */
const next = async () => {
  isLoading.value = true
  const duplValue = await onCheckDuplicatedEmail(email.value)

  if (isValidForm.value) {
    if (!emailRegxTest(email.value)) {
      isLoading.value = false
      setErrorObj({
        code: 'fail_regx',
        msg: '올바른 형식의 이메일을 입력해주세요.',
        time: 3000
      })
    } else if (!duplValue) {
      isLoading.value = false
      setErrorObj({
        code: 'fail_regx',
        msg: '이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.',
        time: 3000
      })
    } else {
      isLoading.value = false
      const JOIN_EMAIL = useCookie('JOIN_EMAIL')
      JOIN_EMAIL.value = email.value
      router.push('/join/password')
    }
  }
}

onMounted(() => {
  amplitude.track('signup_email_pv', {
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
