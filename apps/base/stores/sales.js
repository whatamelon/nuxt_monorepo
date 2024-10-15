import { acceptHMRUpdate, defineStore } from 'pinia'

// 구매에 대한 store
// cookie에 저장됨.

export const salesStore = defineStore('sales', {
  state: () => {
    return {
      ORDER_ITEM_LIST: [],
      ORDER_INFORMATION: {
        paymethod: '',
        prodamount: 0,
        totalamount: 0,
        usepoint: 0,
        salesid: '',
        merchant_uid: '',
        paid_at: '',
        due_date: '',
        escrow: 'off',

        name: '',
        telNo: '',
        shipMsg: '',
        address: ''
      }
    }
  },
  getters: {
    getOrderItemList: (state) => state.ORDER_ITEM_LIST,
    getOrderInformation: (state) => state.ORDER_INFORMATION
  },
  actions: {
    setOrderItemList(payload) {
      this.ORDER_ITEM_LIST = payload
    },
    setOrderInformation(payload) {
      this.getOrderInformation = payload
    },
    resetOrderValue() {
      this.ORDER_ITEM_LIST = []
      this.getOrderInformation = {
        paymethod: '',
        prodamount: 0,
        totalamount: 0,
        usepoint: 0,
        salesid: '',
        merchant_uid: '',
        paid_at: '',
        due_date: '',
        escrow: 'off',

        name: '',
        telNo: '',
        shipMsg: '',
        address: ''
      }
    }
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(salesStore, import.meta.hot))
}
