export default defineNuxtRouteMiddleware((to) => {
  // 이전 커머스에서 뿌린 카카오 알림톡에 대해서 migration을 위한 redirect 함수

  const user = userStore()
  const config = useRuntimeConfig()
  const loggedIn = user.getLoginState

  // test 페이지 진입 제한
  if (to.fullPath.startsWith('/test') && config.public.env === 'production') {
    return navigateTo('/')
  }

  // 판매신청하기
  if (to.fullPath.startsWith('/package/apply')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/package/apply', '/sell/new'))
    }
    return navigateTo('/')
  }
  // 판매하기
  if (to.fullPath.startsWith('/package')) {
    return navigateTo(to.fullPath.replace('/package', '/sell'))
  }

  // 마이-포인트 내역
  if (to.fullPath.startsWith('/my/pc/upoint')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/upoint', '/my/point'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/upoint')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/upoint', '/my/point'))
    }
    return navigateTo('/')
  }

  // 마이-무료반품권 내역
  if (to.fullPath.startsWith('/my/pc/ufreeret')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/ufreeret', '/my/freeret'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/ufreeret')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/ufreeret', '/my/freeret'))
    }
    return navigateTo('/')
  }

  // 마이-주문 내역
  if (to.fullPath.startsWith('/my/pc/uorder')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/uorder', '/my/order'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/uorder')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/uorder', '/my/order'))
    }
    return navigateTo('/')
  }

  // 마이-판매 내역
  if (to.fullPath.startsWith('/my/pc/upackage')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/upackage', '/my/sell'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/upackage')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/upackage', '/my/sell'))
    }
    return navigateTo('/')
  }

  // 마이-주소 내역
  if (to.fullPath.startsWith('/my/pc/uaddress')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/uaddress', '/my/address'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/uaddress')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/uaddress', '/my/address'))
    }
    return navigateTo('/')
  }

  // 마이-문의 내역
  if (to.fullPath.startsWith('/my/pc/uqna')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/uqna', '/my/qna'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/uqna')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/uqna', '/my/qna'))
    }
    return navigateTo('/')
  }

  // 마이-리뷰 내역
  if (to.fullPath.startsWith('/my/pc/ureview')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/ureview', '/my/review'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/ureview')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/ureview', '/my/review'))
    }
    return navigateTo('/')
  }

  // 마이-내정보
  if (to.fullPath.startsWith('/my/pc/uprofile')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc/uprofile', '/my/profile'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/m/uprofile')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m/uprofile', '/my/profile'))
    }

    return navigateTo('/')
  }

  // 마이
  if (to.fullPath.startsWith('/my/m')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/m', '/my'))
    }
    return navigateTo('/')
  }
  if (to.fullPath.startsWith('/my/pc')) {
    if (loggedIn) {
      return navigateTo(to.fullPath.replace('/my/pc', '/my'))
    }
    return navigateTo('/')
  }

  // 찜상품 리스트
  if (to.fullPath.startsWith('/favor_product')) {
    return navigateTo(to.fullPath.replace('/favor_product', '/my/product/favor'))
  }
  // 최근본상품 리스트
  if (to.fullPath.startsWith('/recent_product')) {
    return navigateTo(to.fullPath.replace('/recent_product', '/my/product/recent'))
  }
  // 구매리뷰 리스트
  if (to.fullPath.startsWith('/sales_reviews')) {
    return navigateTo(to.fullPath.replace('/sales_reviews', '/review_list/buy'))
  }
  // 판매리뷰 리스트
  if (to.fullPath.startsWith('/package_reviews')) {
    return navigateTo(to.fullPath.replace('/package_reviews', '/review_list/sell'))
  }
})
