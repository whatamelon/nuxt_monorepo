export default defineNuxtRouteMiddleware((to) => {
  // 로컬에 bearer 토큰이 저장되어있다면, 해당 토큰을 api로 던져봄.
  // 던져보고 fail 뜨면 로그인 ㄱㄱ
  // success 뜨면 페이지 진입 및 해당 api 호출

  const user = userStore()
  const accessToken = useCookie('accessToken')

  const loggedIn = user.getLoginState

  if (loggedIn && !accessToken.value) {
    user.setLogout()
  }

  // protect route
  if (import.meta.client) {
    if (!loggedIn || !accessToken.value) {
      if (to.fullPath.startsWith('/my') || to.fullPath.startsWith('/cart') || to.fullPath.startsWith('/order') || to.fullPath.startsWith('/sell/new')) {
        const recentRoute = useCookie('RECENT_ROUTE')
        recentRoute.value = to.fullPath
        appStore().setDialogDTO({
          message: '로그인 후 이용해주세요.',
          timeout: 1
        })
        return navigateTo('/login')
      }
    }
  }
})
