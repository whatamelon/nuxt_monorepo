<template>
  <div>
    <div v-if="step == 'init'" class="px-5 pt-10">
      <h2 class="headline-b mt-10 text-black">가입하신 이메일과 휴대폰 본인인증을 통해<br />임시 비밀번호를 발급받을 수 있습니다.</h2>

      <p class="body-1-r mb-2 mt-6">가입하신 이메일을 입력해주세요.</p>
      <input v-model="email" class="subhead-2-b w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black" placeholder="이메일 입력" />
      <button
        class="btn-h52-r0-fill-wfull mt-10"
        :class="{
          'bg-rgray-100': email.length == 0,
          'bg-black': email.length > 0
        }"
        @click="goToPass"
      >
        임시 비밀번호 발급받기
      </button>
    </div>

    <div v-if="step == 'not-matched'" class="mx-auto px-5 pt-10 text-center">
      <IconError></IconError>
      <h2 class="headline-b mt-10 text-black">일치하는 회원 정보를 찾지 못했습니다.</h2>
      <p class="body-long-1-r mt-2 text-rgray-600">입력하신 이메일과 고객님의 PASS 정보가<br />일치하지 않습니다.</p>

      <button class="subhead-3-b btn-h52-r0-fill-wfull mt-15" @click="() => (step = 'init')">재시도하기</button>
    </div>

    <div v-if="step == 'good'" class="mx-auto px-5 pb-20 pt-10 text-center">
      <h2 class="headline-b mt-10 text-black">임시 비밀번호가 발급되었습니다.</h2>
      <p class="body-long-1-r mt-2 text-rgray-600">임시 비밀번호는 발급일로부터 7일간만 유효합니다.</p>

      <div class="mt-8 w-full bg-rgray-50 p-4" @click="() => onCopyPassword(tempPassword)">
        <p class="body-2-r text-black">{{ tempPassword }}</p>
      </div>

      <button class="subhead-3-b btn-h52-r0-fill-wfull mt-10" @click="goToLogin">로그인하기</button>
    </div>
  </div>
</template>

<script setup>
// 임시비밀번호 발급 페이지
import { tempPasswordAPI } from '~/composables/apiFactories/user'

useHead({
  script: [
    {
      src: 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
    }
  ]
})

const route = useRoute()
const router = useRouter()

const step = ref('init')
const email = ref('')
const tempPassword = ref('')

const goToLogin = () => {
  router.replace('/login/email')
}

/** pass? 임시 비밀번호 발급 */
const goToPass = () => {
  userStore().setTempEmailForPassword(email.value)

  const IMP = window.IMP
  const runtimeConfig = useRuntimeConfig()

  IMP.init(runtimeConfig.public.passImpKey)

  IMP.certification(
    {
      popup: false,
      m_redirect_url: `${window.location.origin}/help/password`
    },
    async (rsp) => {
      if (rsp.success) {
        const impUID = rsp.imp_uid

        const repassObj = await tempPasswordAPI({
          relayId: email.value,
          impUid: impUID,
          snsType: 'email',
          emailUser: true
        })
        if (repassObj.error.value != null) {
          useRetryError(repassObj.error.value.statusCode, execute)
          step.value = 'not-matched'
        } else if (repassObj.data.value.statusCode === 200) {
          appStore().setDialogDTO({
            message: '본인인증에 성공했습니다.',
            timeout: 3
          })
          tempPassword.value = repassObj.data.value.data.temporaryPassword
          onCopyPassword(repassObj.data.value.data.temporaryPassword)
          step.value = 'good'
        } else {
          step.value = 'not-matched'
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

const checkPhoneCertify = async (impUID) => {
  const repassObj = await tempPasswordAPI({
    relayId: userStore().getEmailForTempPassword,
    impUid: impUID,
    snsType: 'email',
    emailUser: true
  })
  if (repassObj.error.value != null) {
    useRetryError(repassObj.error.value.statusCode, execute)
    step.value = 'not-matched'
  } else if (repassObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '본인인증에 성공했습니다.',
      timeout: 3
    })
    tempPassword.value = repassObj.data.value.data.temporaryPassword
    onCopyPassword(repassObj.data.value.data.temporaryPassword)
    step.value = 'good'
  } else {
    step.value = 'not-matched'
  }
}

/**
 * 임시 비밀번호 복사
 * @param {string} password 임시 비밀번호
 */
const onCopyPassword = (password) => {
  const t = document.createElement('textarea')
  document.body.appendChild(t)
  t.value = password
  t.select()
  document.execCommand('copy')
  document.body.removeChild(t)
  appStore().setDialogDTO({
    message: '임시 비밀번호가 복사되었습니다.',
    timeout: 3
  })
}

if (process.client) {
  if (route.query.imp_uid && route.query.success) {
    setTimeout(async () => {
      await checkPhoneCertify(route.query.imp_uid)
    }, 1000)
  }
}

onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '임시 비밀번호 발급',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: ''
  })
})
</script>
