<template>
  <div class="mt-10 px-5 pt-10">
    <!-- <nuxt-img
      :src="`https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/${appStore().getDomain.trim()}/wfull_logo.png`"
      fit="cover"
      loading="lazy"
      placeholder
      class="mx-auto mb-20 w-full"
    />
    <button class="btn-h60-r30-fill-wfull bg-kakao text-black" @click="kakaoSignupReqHandler">카카오로 시작하기</button>

    <p v-if="data?.data.contents.email_enabled === true" class="subhead-2-b mt-6 text-center text-rgray-400 md:cursor-pointer" @click="goToEmailJoin">이메일로 시작하기</p>

    <hr class="my-10 bg-rgray-100 text-rgray-100" />
    <p v-if="data?.data.contents.relayDescription" v-html="data?.data.contents.relayDescription"></p> -->
  </div>
</template>

<script setup>
// 회원가입 유형 선택 페이지
//  -> 로그인 화면과 병합하여, 회원가입 응답 페이지로 변경. (240731)
import { showMessenger, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { certifyUserAuthAPI } from '~/composables/apiFactories/user'

useHead({
  script: [
    {
      src: 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
    }
  ]
})

const router = useRouter()
const route = useRoute()
// const config = useRuntimeConfig()

// const { data } = await getPageContentAPI('login')

/**
 * 본인인증 확인
 * @param impuid
 */
const onCertifyUser = async (impuid) => {
  const JOIN_TYPE = useCookie('JOIN_TYPE')
  const form = {
    impUid: impuid,
    snsType: JOIN_TYPE.value
  }

  const cuaaObj = await certifyUserAuthAPI(form)
  if (cuaaObj.error.value != null) {
    // 본인인증 실패 > 고객센터로 문의
    appStore().setDialogDTO({
      message: '본인인증에 실패했습니다. 고객센터로 문의해주세요.',
      timeout: 3
    })
    showChannelButton()
    showMessenger()
  } else if (cuaaObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '본인인증에 성공했습니다. 로그인 후 이용해주세요.',
      timeout: 3
    })
  } else {
    appStore().setDialogDTO({
      message: '본인인증에 실패했습니다. 고객센터로 문의해주세요.',
      timeout: 3
    })
    showChannelButton()
    showMessenger()
  }
}

/** 이메일 회원가입 페이지로 이동 */
// const goToEmailJoin = () => {
//   amplitude.track('signup_agree_pv', {
//     type: 'email'
//   })

//   const JOIN_TYPE = useCookie('JOIN_TYPE')
//   JOIN_TYPE.value = 'email'
//   router.push('/join/check')
// }

/** 카카오 회원가입 요청 */
// const kakaoSignupReqHandler = async () => {
//   amplitude.track('signUp')
//   await navigateTo(`${config.public.baseURL}/oauth2/authorization/kakao?brandDomain=${appStore().getDomain}`, {
//     external: true
//   })
// }

/**
 * 카카오 회원가입 응답. 토큰 등 데이터와 함께 본인인증 페이지로 이동
 * @param query
 */
const kakaoSignupResHandler = async (query) => {
  amplitude.track('signup_agree_pv', {
    type: 'kakao'
  })

  const JOIN_TYPE = useCookie('JOIN_TYPE')
  JOIN_TYPE.value = 'kakao'

  sessionStorage.setItem('JOIN_ACCSSTOKEN', query.accessToken)
  const JOIN_USERID = useCookie('JOIN_USERID')
  JOIN_USERID.value = query.userId

  router.replace('/join/check')
}

if (route.query.imp_uid && route.query.success) {
  setTimeout(async () => {
    await onCertifyUser(route.query.imp_uid)
  }, 1000)
}

onBeforeMount(async () => {
  // appStore().setHeaderType({
  //   back: true,
  //   logo: false,
  //   title: '회원가입',
  //   home: false,
  //   search: false,
  //   cart: false,
  //   close: false,
  //   backRoute: ''
  // })

  if (route.query.isAuthVerified) {
    if (route.query.accessToken) {
      await kakaoSignupResHandler(route.query)
    } else if (route.query.message) {
      router.replace('/login')
      if (route.query.message === 'not_passed_1_month') {
        appStore().setDialogDTO({
          message: '탈퇴 후, 한달 이내 재가입이 불가능합니다. 궁금한 점은 고객센터로 문의해주세요.',
          timeout: 3
        })
      }
    }
  }
})

// onActivated(() => {
//   appStore().setHeaderType({
//     back: true,
//     logo: false,
//     title: '회원가입',
//     home: false,
//     search: false,
//     cart: false,
//     close: false,
//     backRoute: ''
//   })
// })
</script>
