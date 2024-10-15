<template>
  <div class="px-5 pt-10">
    <div class="flex flex-col space-y-2">
      <input
        v-model="email"
        class="subhead-2-b rounded-none border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
        :class="{
          'border-orange-600': errorObj.isError && errorObj.code == 'no_user'
        }"
        placeholder="이메일 주소"
      />
      <p v-if="errorObj.isError && errorObj.code == 'no_user'" class="label-2-r text-orange-600">{{ errorObj.message }}</p>

      <input
        v-model="password"
        type="password"
        class="subhead-2-b rounded-none border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
        :class="{
          'border-orange-600': errorObj.isError && errorObj.code == 'not_matched_password'
        }"
        placeholder="비밀번호"
        @keydown.enter="login"
      />
      <p v-if="errorObj.isError && errorObj.code == 'not_matched_password'" class="label-2-r text-orange-600">{{ errorObj.message }}</p>
    </div>
    <button
      class="btn-h52-r0-fill-wfull mt-6"
      :class="{
        'bg-rgray-100': !isValidForm,
        'bg-black': isValidForm
      }"
      @click="login"
    >
      로그인
    </button>

    <div class="mt-6 flex w-full justify-center space-x-6">
      <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="goToEmailHelp">이메일 찾기</p>
      <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="goToPasswordHelp">임시 비밀번호 발급</p>
    </div>
  </div>
</template>

<script setup>
// 이메일 로그인 페이지
// 따로 validate는 없다.
// 에러코드만 inline형태로 띄운다.
import * as amplitude from '@amplitude/analytics-browser'
import { getItemActionsListAPI } from '~/composables/apiFactories/sell'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorObj = ref({
  isError: false,
  code: '',
  message: ''
})

/** 이메일 비밀번호 유효한지 확인 */
const isValidForm = computed(() => {
  if (email.value !== '' && password.value !== '') return true
  return false
})

/** 로그인 로직 */
const login = async () => {
  const SignReqDTOv4 = {
    relayId: email.value,
    relayPassword: password.value
  }
  const response = await userStore().login(SignReqDTOv4)

  if (response.statusCode === 200) {
    amplitude.track('signIn')
    if (appStore().getDomain === 'orm') fbq('trackCustom', 'signIn_fb')

    const resaleGetActionItems = await getItemActionsListAPI()
    if (resaleGetActionItems.error.value !== null && resaleGetActionItems.error.value.data) {
      useRetryError(resaleGetActionItems.error.value.data.statusCode, resaleGetActionItems.execute)
    } else {
      userStore().setSellActionTotalPoints(resaleGetActionItems.data.value.data?.totalPoints)
    }

    userStore().setUserAction(response.data.userAction)

    const recentRoute = useCookie('RECENT_ROUTE')
    if (recentRoute.value) {
      setTimeout(() => {
        router.push(recentRoute.value)
        recentRoute.value = ''
      }, 300)
    } else {
      router.push('/')
    }
  } else if (response.statusCode === 400) {
    if (response.message === 'not_matched_password') {
      errorObj.value = {
        isError: true,
        code: 'not_matched_password',
        message: '이메일과 비밀번호가 일치하지 않습니다.'
      }
    }
    if (response.message === 'not_verified') {
      errorObj.value = {
        isError: true,
        code: 'not_verified',
        message: '인증되지 않은 이메일입니다.'
      }
    }
    setTimeout(() => {
      errorObj.value = {
        isError: false,
        code: '',
        message: ''
      }
    }, 3000)
  } else if (response.statusCode === 404) {
    if (response.message === 'no_user') {
      errorObj.value = {
        isError: true,
        code: 'no_user',
        message: '등록되지 않은 이메일입니다. 이메일을 확인해주세요.'
      }
    }
    setTimeout(() => {
      errorObj.value = {
        isError: false,
        code: '',
        message: ''
      }
    }, 3000)
  } else {
    appStore().setDialogDTO({
      message: '로그인에 실패했습니다. 다시 시도해주세요.',
      timeout: 3
    })
  }
}

const goToEmailHelp = () => {
  router.push('/help/email')
}

const goToPasswordHelp = () => {
  router.push('/help/password')
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '이메일 로그인',
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
