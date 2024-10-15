<template>
  <div class="mt-10 px-5">
    <!-- <p class="display-1-b mb-12 text-black"></p> -->

    <client-only>
      <p v-if="data?.data.contents.headTitle" class="mb-6" v-html="data?.data.contents.headTitle"></p>
      <div v-if="data?.data.contents.imgs" class="mb-6 flex w-auto space-x-1">
        <div v-for="(item, index) in data?.data.contents.imgs" :key="index" class="flex w-1/3">
          <img :src="item" class="flex h-min max-h-[150px] w-full flex-col justify-start object-contain" />
        </div>
      </div>
      <button class="btn-h60-r30-fill-wfull bg-kakao text-black" @click="kakaoLoginReqHandler">카카오로 시작하기</button>
      <div v-if="data?.data.contents.email_enabled == true" class="mt-6 flex justify-center space-x-6">
        <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="goToEmailLogin">이메일 로그인</p>
        <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="goToJoin">이메일 회원가입</p>
      </div>
      <hr class="my-8 bg-rgray-100 text-rgray-100" />
      <div class="mb-4 flex h-8 items-center justify-center">
        <!--  -->
        <NuxtImg :src="appStore().getHeadObject.brandMetadata.logo_image" width="160px" height="100%" class="object-contain" />
      </div>
      <p v-if="data?.data.contents.relayDescription" v-html="data?.data.contents.relayDescription"></p>
    </client-only>
  </div>
</template>

<script setup>
// 로그인 페이지
// 모든 정보는 DB로부터 받는다.
import { showMessenger, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { certifyUserAuthAPI } from '~/composables/apiFactories/user'
import { getPageContentAPI } from '~/composables/apiFactories/app'
import { getItemActionsListAPI } from '~/composables/apiFactories/sell'

definePageMeta({
  middleware: [
    async () => {
      // 로그인된 상태라면 바로 홈으로 리다이렉팅 시킴
      const user = userStore()
      if (user.getLoginState) {
        return navigateTo('/', {
          external: true
        })
      }
    }
  ]
})

useHead({
  script: [
    {
      src: 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
    }
  ]
})

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const { data } = await getPageContentAPI('login')

/**
 * 본인인증 확인
 * @param impuid
 */
const onCertifyUser = async (impuid) => {
  const form = {
    impUid: impuid
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
      message: '본인인증에 성공했습니다. 다시 로그인 후 이용해주세요.',
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

/** 이메일 로그인 페이지 이동 */
const goToEmailLogin = () => {
  router.push('/login/email')
}

const goToRel = async () => {
  await navigateTo(`naver.com`, {
    external: true
  })
}

/** 회원가입 페이지 이동 */
const goToJoin = () => {
  amplitude.track('signup_start')
  // router.push('/join/select')
  const JOIN_TYPE = useCookie('JOIN_TYPE')
  JOIN_TYPE.value = 'email'
  router.push('/join/check')
}

/** 카카오 로그인 요청 */
const kakaoLoginReqHandler = async () => {
  amplitude.track('startKakao_click')
  await navigateTo(`${config.public.baseURL}/oauth2/authorization/kakao?brandDomain=${appStore().getDomain}`, {
    external: true
  })
}

/**
 * 카카오 로그인 응답
 * @param {LoginToken} query 로그인 관련 토큰을 query string으로 받아옴
 */
const kakaoLoginResHandler = async (query) => {
  amplitude.track('signIn')
  if (appStore().getDomain === 'orm') fbq('trackCustom', 'signIn_fb')
  userStore().setLogin({
    accessToken: query.accessToken,
    refreshToken: query.refreshToken
  })

  userStore().setUserAction({
    isInSellBig: query.isInSellBig === 'true',
    isInSellSmall: query.isInSellSmall === 'true'
  })

  const resaleGetActionItems = await getItemActionsListAPI()
  if (resaleGetActionItems.error.value !== null && resaleGetActionItems.error.value.data) {
    useRetryError(resaleGetActionItems.error.value.data.statusCode, resaleGetActionItems.execute)
  } else {
    userStore().setSellActionTotalPoints(resaleGetActionItems.data.value?.data.totalPoints)
  }

  const recentRoute = useCookie('RECENT_ROUTE')
  if (recentRoute.value) {
    setTimeout(() => {
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = query.accessToken
      refreshToken.value = query.refreshToken
      router.push(recentRoute.value)
      recentRoute.value = ''
    }, 300)
  } else {
    router.push('/')
  }
}

/** pass 본인 인증 */
const goToPass = () => {
  const IMP = window.IMP
  IMP.init('imp79674425')

  const mUrl = `${window.location.origin}/login`

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

if (route.query.imp_uid && route.query.success) {
  if (route.query.success) {
    setTimeout(async () => {
      await onCertifyUser(route.query.imp_uid)
    }, 1000)
  }
}

onBeforeMount(async () => {
  hideGnb()
  showChannelButton()
  if (route.query.isAuthVerified) {
    if (!route.query.isAuthVerified) {
      goToPass()
    } else if (route.query.accessToken) {
      await kakaoLoginResHandler(route.query)
    } else if (route.query.message) {
      if (route.query.message === 'not_passed_1_month') {
        appStore().setDialogDTO({
          message: '탈퇴 후, 한달 이내 재가입이 불가능합니다. 궁금한 점은 고객센터로 문의해주세요.',
          timeout: 3
        })
      }
    }
  }

  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '로그인',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: ''
  })
})

onActivated(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '로그인',
    home: false,
    search: false,
    cart: false,
    close: false,
    backRoute: ''
  })
})

onUpdated(() => {
  hideGnb()
})
onUnmounted(() => {
  showGnb()
})
</script>
