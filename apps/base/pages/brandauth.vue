<template>
  <div class="bg-white px-5 py-10 text-center">
    <img :src="brandAuth.data.contents.brandMallImg" class="mx-auto h-20" />
    <h2 class="display-1-b mt-10 text-black">{{ brandAuth.data.contents.brandMallName }} 회원인증</h2>
    <p class="body-1-r mt-2 text-rgray-600">아래 버튼을 클릭하시면,<br />{{ brandAuth.data.contents.brandMallName }} 회원 인증이 진행됩니다.</p>

    <button class="btn-h60-r30-fill-wfull mt-10" @click="brandAuthHandler">{{ brandAuth.data.contents.brandMallName }} 회원인증하기</button>

    <p class="body-1-r mt-6 text-rgray-400">아직 {{ brandAuth.data.contents.brandMallName }} 회원이 아니세요?</p>
    <div class="mx-auto mt-1 flex w-fit justify-center md:cursor-pointer" @click="goToSign">
      <p class="subhead-2-b my-auto text-black">{{ brandAuth.data.contents.brandMallName }} 회원가입하기</p>
      <i class="rb-arrow-right mt-0.5 text-base"></i>
    </div>
  </div>
</template>

<script setup>
// 브랜드 인증페이지
// 모든 정보는 DB로부터 받는다.
import { getBrandAuthPageAPI, certifyUserBrandAuthAPI } from '~/composables/apiFactories/user'

const router = useRouter()

const { data: brandAuth } = await getBrandAuthPageAPI()

const pageHeaderTitle = `${brandAuth.value.data.contents.brandMallName} 계정인증`

/** 브랜드몰 인증 */
const brandAuthHandler = async () => {
  const cubaObj = await certifyUserBrandAuthAPI()
  if (cubaObj.error.value != null) {
    useRetryError(cubaObj.error.value.data.statusCode, cubaObj.execute)
  } else if (cubaObj.data.value.statusCode === 200) {
    if (cubaObj.data.value.data.status === 'GOOD') {
      appStore().setDialogDTO({
        message: '인증에 성공했습니다!\n판매 신청하고 보상 포인트를 받아보세요!',
        timeout: 4
      })
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
    }
    router.back()
  } else {
    appStore().setDialogDTO({
      message: '브랜드몰 회원인증에 실패했습니다.',
      timeout: 4
    })
  }
}

/** 회원가입 페이지로 이동 */
const goToSign = async () => {
  await navigateTo(brandAuth.value.data.contents.brandMallSignUpUrl, {
    external: true,
    open: {
      target: '_blank'
    }
  })
}

onMounted(() => {
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: pageHeaderTitle,
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
