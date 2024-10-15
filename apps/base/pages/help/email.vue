<template>
  <div>
    <div v-if="step == 'init'" class="px-5 pt-10">
      <h2 class="headline-b mt-10 text-black">휴대폰 본인인증을 통해<br />이메일을 찾을 수 있습니다.</h2>

      <button class="btn-h52-r0-fill-wfull mt-10" @click="goToPass">본인인증하기</button>
    </div>

    <div v-if="step == 'not-matched'" class="mx-auto px-5 pt-10 text-center">
      <IconError></IconError>
      <h2 class="headline-b mt-10 text-black">일치하는 회원 정보를 찾지 못했습니다.</h2>

      <button class="subhead-3-b btn-h52-r0-fill-wfull mt-15" @click="() => (step = 'init')">재시도하기</button>
    </div>

    <div v-if="step == 'good'" class="mx-auto px-5 pb-20 pt-10">
      <h2 class="headline-b mt-10 text-black">본인인증을 통해 회원님의 정보와<br />일치하는 이메일을 찾았습니다.</h2>

      <div class="mt-8 space-y-4 divide-y bg-rgray-50 p-4">
        <div v-for="user in users" :key="user" class="pt-4 first:pt-0">
          <p class="subhead-2-b text-black">{{ user.relayId }}</p>

          <p class="body-1-r mt-1 text-rgray-400">가입일 : {{ formatDateKR(user.createdAt) }}</p>
        </div>
      </div>

      <button class="subhead-3-b btn-h52-r0-fill-wfull mt-10" @click="goToLogin">로그인하기</button>
    </div>
  </div>
</template>

<script setup>
// 이메일 찾기 페이지
import { findEmailAPI } from '~/composables/apiFactories/user'

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
const users = ref([])

const goToLogin = () => {
  router.replace('/login/email')
}

/** pass 본인인증 */
const goToPass = () => {
  const IMP = window.IMP
  const runtimeConfig = useRuntimeConfig()

  IMP.init(runtimeConfig.public.passImpKey)

  const mUrl = `${window.location.origin}/help/email`

  IMP.certification(
    {
      popup: false,
      m_redirect_url: mUrl
    },
    async (rsp) => {
      if (rsp.success) {
        const impUID = rsp.imp_uid

        const findObj = await findEmailAPI({
          impUid: impUID,
          snsType: 'email'
        })
        if (findObj.error.value != null) {
          useRetryError(findObj.error.value.statusCode, execute)
          step.value = 'not-matched'
        } else if (findObj.data.value.statusCode === 200) {
          if (findObj.data.value.data.userCnt > 0) {
            users.value = findObj.data.value.data.users.filter((e) => e.snsType === 'email')
            if (users.value.length > 0) {
              appStore().setDialogDTO({
                message: '본인인증에 성공했습니다.',
                timeout: 3
              })
              step.value = 'good'
            } else {
              step.value = 'not-matched'
            }
            // if(findObj.data.value.data.users[0].snsType == 'email') {
            //     email.value = findObj.data.value.data.users[0].relayId;
            //     joindate.value = findObj.data.value.data.users[0].createdAt;

            //     appStore().setDialogDTO({
            //         message: '본인인증에 성공했습니다.',
            //         timeout: 3
            //     })
            //     step.value = 'good';
            // } else {
            //     step.value = 'not-matched';
            // }
          } else {
            step.value = 'not-matched'
          }
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
  const findObj = await findEmailAPI({
    impUid: impUID,
    snsType: 'email'
  })
  if (findObj.error.value != null) {
    useRetryError(findObj.error.value.statusCode, execute)
    step.value = 'not-matched'
  } else if (findObj.data.value.statusCode === 200) {
    if (findObj.data.value.data.userCnt > 0) {
      users.value = findObj.data.value.data.users.filter((e) => e.snsType === 'email')
      if (users.value.length > 0) {
        appStore().setDialogDTO({
          message: '본인인증에 성공했습니다.',
          timeout: 3
        })
        step.value = 'good'
      } else {
        step.value = 'not-matched'
      }
      // if(findObj.data.value.data.users[0].snsType == 'email') {
      //     email.value = findObj.data.value.data.users[0].relayId;
      //     joindate.value = findObj.data.value.data.users[0].createdAt;

      //     appStore().setDialogDTO({
      //         message: '본인인증에 성공했습니다.',
      //         timeout: 3
      //     })
      //     step.value = 'good';
      // } else {
      //     step.value = 'not-matched';
      // }
    } else {
      step.value = 'not-matched'
    }
  } else {
    step.value = 'not-matched'
  }
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
    title: '이메일 찾기',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: ''
  })
})
</script>
