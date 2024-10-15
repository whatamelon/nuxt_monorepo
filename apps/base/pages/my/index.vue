<template>
  <div class="bg-white pb-12">
    <div class="bg-rgray-950 px-5 py-8">
      <p v-if="data?.data.name != ''" class="display-1-b mb-8 text-white">{{ data?.data.name }}</p>

      <div class="flex w-full">
        <div class="w-1/2 md:cursor-pointer" @click="goToPoint">
          <p class="body-1-r text-white">포인트</p>
          <div class="flex space-x-1 text-white">
            <p class="headline-b mt-1">{{ formatWonNoBlank(data?.data.totalPoints) }} P</p>
            <i class="rb-arrow-right my-auto text-base"></i>
          </div>
        </div>
        <div class="w-1/2 md:cursor-pointer" @click="goToFreeret">
          <p class="body-1-r text-white">무료 반품권</p>
          <div class="flex space-x-1 text-white">
            <p class="headline-b mt-1">{{ formatWonNoBlank(data?.data.freeretsCount) }} 매</p>
            <i class="rb-arrow-right my-auto text-base"></i>
          </div>
        </div>
      </div>
    </div>

    <img
      v-if="appStore().getDomain == 'orm'"
      src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/my/mypage_banner_image.png"
      alt="재판매 해보세요!"
      class="my-6 px-5"
      @click="goToResale()"
    />

    <div class="mt-10 px-5">
      <h3 class="subhead-3-b text-black">쇼핑 정보</h3>
      <hr class="mt-4 border border-black" />

      <div class="flex flex-col space-y-4 divide-y divide-rgray-100">
        <NuxtLink to="/my/order" class="body-2-r pt-4 text-black">주문 내역</NuxtLink>
        <NuxtLink to="/my/sell" class="body-2-r pt-4 text-black">판매 내역</NuxtLink>
        <NuxtLink to="/my/qna" class="body-2-r pt-4 text-black">문의 내역</NuxtLink>
        <NuxtLink to="/my/review" class="body-2-r pt-4 text-black">리뷰 내역</NuxtLink>
      </div>
    </div>

    <div class="mt-10 px-5">
      <h3 class="subhead-3-b text-black">내 정보</h3>
      <hr class="mt-4 border border-black" />

      <div class="flex flex-col space-y-4 divide-y divide-rgray-100">
        <NuxtLink to="/my/profile" class="body-2-r flex gap-2 pt-4 text-black">
          <span>내 정보 관리</span>
          <p v-if="!data.data.buidAuthFlag" class="caption-2-b rounded bg-caribbean-green-300 px-1.5 py-0.5">{{ brandAuth?.data?.contents.brandMallName }} 인증하고 판매해 보세요!</p>
        </NuxtLink>
        <NuxtLink to="/my/address" class="body-2-r pt-4 text-black">내 주소지 관리</NuxtLink>
      </div>
    </div>

    <div class="mt-10 flex space-x-6 px-5">
      <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="logOutHandler">로그아웃</p>
      <p class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="onOpenSignOutDialog">회원탈퇴</p>
    </div>

    <AppModalConfirmBottomSheet
      :is-open="openConfirm"
      :title="'회원탈퇴하시겠습니까?'"
      :body="'이후 30일간 재가입이 불가합니다.'"
      :left="'아니오'"
      :right="'탈퇴할게요'"
      @close="onCloseSignOutDialog"
      @click-left="onCloseSignOutDialog"
      @click-right="onClickSignOut"
    ></AppModalConfirmBottomSheet>
  </div>
</template>

<script setup lang="ts">
// 마이페이지
import { showMessenger, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { getUserInfoAPI, deleteUserAPI, logoutAPI, getBrandAuthPageAPI } from '~/composables/apiFactories/user'

const router = useRouter()
const user = userStore()

const openConfirm = ref(false)

const { data, error, execute } = await getUserInfoAPI()

if (error.value != null) {
  userStore().setLogout()
  useRetryError(error.value.data.statusCode, execute)
}

const { data: brandAuth } = await getBrandAuthPageAPI()

/** 포인트 페이지 이동 */
const goToPoint = () => {
  router.push('/my/point')
}

/** 무료 반품권 페이지 이동 */
const goToFreeret = () => {
  router.push('/my/freeret')
}

const goToResale = () => {
  router.push('/sell')
}

/** 로그아웃 로직 */
const logOutHandler = async () => {
  amplitude.track('logout')
  await logoutAPI()

  setTimeout(() => {
    userStore().logout()
    router.replace('/')
  }, 300)
}

/** close 회원 탈퇴 bottom sheet */
const onCloseSignOutDialog = () => {
  openConfirm.value = false
}

/** 회원 탈퇴 bottom sheet 오픈 */
const onOpenSignOutDialog = () => {
  amplitude.track('signout')
  openConfirm.value = true
}

/**
 * 회원 탈퇴 로직
 */
const onClickSignOut = async () => {
  const delObj = await deleteUserAPI()
  if (delObj.error.value != null) {
    // 회원탈퇴 실패 > 고객센터로 문의
    // failToDelUser('회원탈퇴에 실패했습니다. 재시도 시 같은 문제가 발생된다면 고객센터로 문의해주세요.');
    if (delObj.error.value.data.statusCode === 400) {
      if (delObj.error.value.data.message === 'has_resale_product') {
        failToDelUser('진행중인 판매 건이 있어서 회원탈퇴가 불가능합니다. 회원탈퇴를 원하시면 고객센터로 연락주시기 바랍니다.')
      } else {
        failToDelUser('회원탈퇴에 실패했습니다. 재시도 시 같은 문제가 발생된다면 고객센터로 문의해주세요.')
      }
    }
    execute()
  } else if (delObj.data.value.statusCode === 200) {
    onCloseSignOutDialog()
    appStore().setDialogDTO({
      message: '회원 탈퇴하였습니다.',
      timeout: 3
    })
    setTimeout(() => {
      userStore().deleteUser()
      router.replace('/')
    }, 300)
  } else if (delObj.data.value.statusCode === 400) {
    if (delObj.data.value.message === 'has_resale_product') {
      failToDelUser('진행중인 판매 건이 있어서 회원탈퇴가 불가능합니다. 회원탈퇴를 원하시면 고객센터로 연락주시기 바랍니다.')
    } else {
      failToDelUser('회원탈퇴에 실패했습니다. 재시도 시 같은 문제가 발생된다면 고객센터로 문의해주세요.')
    }
    execute()
  } else {
    failToDelUser('회원탈퇴에 실패했습니다. 재시도 시 같은 문제가 발생된다면 고객센터로 문의해주세요.')
    execute()
  }
}

/**
 * 사용자 회원 탈퇴 실패 dialog
 * @param {string} msg 실패 메세지
 */
const failToDelUser = (msg: string) => {
  appStore().setDialogDTO({
    message: msg,
    timeout: 5
  })
  setTimeout(() => {
    showChannelButton()
    showMessenger()
  }, 5000)
}

onMounted(() => {
  amplitude.track('Mypage_pv')

  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '마이페이지',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })

  if (user.getUserAction.isInSellBig === true || user.getUserAction.isInSellSmall === true) {
    if (user.getShowSellTooltip === true) {
      user.setShowSellTooltip(false)
      setTimeout(() => {
        user.setShowSellTooltip(true)
      }, 1000)
    } else {
      setTimeout(() => {
        user.setShowSellTooltip(true)
      }, 1000)
    }
  }
})

onActivated(() => {
  if (user.getUserAction.isInSellBig === true || user.getUserAction.isInSellSmall === true) {
    if (user.getShowSellTooltip === true) {
      user.setShowSellTooltip(false)
      setTimeout(() => {
        user.setShowSellTooltip(true)
      }, 1000)
    } else {
      setTimeout(() => {
        user.setShowSellTooltip(true)
      }, 1000)
    }
  }
})
</script>
