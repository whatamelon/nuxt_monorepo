import { acceptHMRUpdate, defineStore } from 'pinia'
import { loginAPI } from '~/composables/apiFactories/user'

// 회원에 대한 store
// cookie에 저장됨.

type UserState = {
  IS_LOGGED_IN: boolean
  GLOBAL_CART_CNT: number
  GLOBAL_SALES_CNT: number
  CHECKED_ADDRESS: AddressInfo
  EMAIL_FOR_TEMP_PASSWORD: string
  SHOW_JOIN_TOOLTIP: boolean
  SHOW_SELL_TOOLTIP: boolean
  USER_ACTION: UserAction
  SELL_ACTION_TOTAL_POINTS: number
}

export const userStore = defineStore('user', {
  state: (): UserState => {
    return {
      IS_LOGGED_IN: false,
      GLOBAL_CART_CNT: 0,
      GLOBAL_SALES_CNT: 0,

      // for checkout
      CHECKED_ADDRESS: {
        addrId: 0,
        receiverName: '',
        addrCode: '',
        addr0: '',
        addr1: '',
        telNo: '',
        msg: '',
        defaultFlag: false
      },

      // 임시비밀번호 발급시에 모바일에서 PASS리다이렉팅 때문에 페이지 값을 잃어버리기 때문에, store에 값 저장
      EMAIL_FOR_TEMP_PASSWORD: '',
      // 회원가입 유도 말풍선을 보여줄지 여부 (home banner 닫기를 눌렀을때도 보여야하므로 전역상태관리)
      SHOW_JOIN_TOOLTIP: false,
      // 진행중인 판매건 말풍선을 보여줄지 여부 (home banner 닫기를 눌렀을때도 보여야하므로 전역상태관리)
      SHOW_SELL_TOOLTIP: false,
      // 진행중인 판매건에 대해 SigninResponse 에서 받아오는 USER_ACTIONS값
      USER_ACTION: {
        isInSellBig: false,
        isInSellSmall: false
      },
      // 진행중인 판매건에 대한 소량판매 포인트값
      SELL_ACTION_TOTAL_POINTS: 0
    }
  },
  getters: {
    getLoginState: (state) => state.IS_LOGGED_IN,
    getCartCnt: (state) => state.GLOBAL_CART_CNT,
    getSalesCnt: (state) => state.GLOBAL_SALES_CNT,
    getCheckedAddress: (state) => state.CHECKED_ADDRESS,
    getEmailForTempPassword: (state) => state.EMAIL_FOR_TEMP_PASSWORD,
    getShowJoinTooltip: (state) => state.SHOW_JOIN_TOOLTIP,
    getShowSellTooltip: (state) => state.SHOW_SELL_TOOLTIP,
    getUserAction: (state) => state.USER_ACTION,
    getSellActionTotalPoints: (state) => state.SELL_ACTION_TOTAL_POINTS
  },
  actions: {
    setLoginState(payload: boolean) {
      this.IS_LOGGED_IN = payload
    },
    setTempEmailForPassword(payload: string) {
      this.EMAIL_FOR_TEMP_PASSWORD = payload
    },
    setCheckedAddress(payload: AddressInfo) {
      this.CHECKED_ADDRESS = payload
    },
    resetCheckedAddress() {
      this.CHECKED_ADDRESS = {
        addrId: 0,
        receiverName: '',
        addrCode: '',
        addr0: '',
        addr1: '',
        telNo: '',
        msg: '',
        defaultFlag: false
      }
    },
    setLogin(payload: LoginToken) {
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = payload.accessToken
      refreshToken.value = payload.refreshToken
      this.setLoginState(true)
    },
    setGlobalUserInfo(payload: UserSession) {
      this.GLOBAL_CART_CNT = payload.cartCount ?? 0
      this.GLOBAL_SALES_CNT = payload.salesCount ?? 0
      if (this.IS_LOGGED_IN && !payload.tokenValid) {
        this.setLogout()
      }
    },
    setLogout() {
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = ''
      refreshToken.value = ''
      this.setLoginState(false)
    },
    setShowJoinTooltip(payload: boolean) {
      this.SHOW_JOIN_TOOLTIP = payload
    },
    setShowSellTooltip(payload: boolean) {
      this.SHOW_SELL_TOOLTIP = payload
    },
    setUserAction(payload: UserAction) {
      this.USER_ACTION = payload

      if (payload.isInSellBig === true || payload.isInSellSmall === true) this.SHOW_SELL_TOOLTIP = true
    },
    setSellActionTotalPoints(payload: number) {
      this.SELL_ACTION_TOTAL_POINTS = payload
    },
    async login(payload: SigninRequest) {
      const { data, error } = await loginAPI(payload)

      if (error.value != null) {
        if (error.value.statusCode !== 200) {
          return error.value.data // data, message, statusCode
        }
      } else {
        if (data.value?.statusCode === 200) {
          const accessToken = useCookie('accessToken')
          const refreshToken = useCookie('refreshToken')
          accessToken.value = data.value.data.accessToken
          refreshToken.value = data.value.data.refreshToken
          this.setLoginState(true)
          return data.value
        }
        return data.value
      }
    },
    async logout() {
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = null
      refreshToken.value = null
      this.setLoginState(false)
    },
    async deleteUser() {
      const accessToken = useCookie('accessToken')
      const refreshToken = useCookie('refreshToken')
      accessToken.value = null
      refreshToken.value = null
      this.setLoginState(false)
    }
  },
  persist: {
    storage: persistedState.localStorage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot))
}
