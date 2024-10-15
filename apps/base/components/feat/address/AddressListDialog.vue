<template>
  <div class="px-5 pb-8 pt-10">
    <div v-if="data.data?.length > 0">
      <ul class="divide-y divide-rgray-100">
        <li v-for="(address, index) in data.data" :key="index" class="space-y-1 py-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <div class="flex items-center space-x-2">
                <p class="subhead-2-b my-auto text-black">{{ address.receiverName }}</p>
                <p v-if="address.defaultFlag" class="badge-h18-r0-fill-p4-black">기본{{ title }}</p>
              </div>
              <button v-if="orderMode" type="button" :aria-label="title + ' 선택 버튼'" class="btn-h32-r0-line-p16-gray py-1" @click="() => checkAddressForOrder(address)">선택</button>
            </div>
            <p class="body-1-r text-black">({{ address.addrCode }}) {{ address.addr0 }} {{ address.addr1 }}</p>
            <p class="body-1-r text-black">{{ formatPhone(address.telNo) }}</p>
            <p class="body-1-r text-black">{{ address.msg }}</p>
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" :aria-label="title + ' 수정'" class="subhead-2-b text-rgray-400" @click="() => modifyAddress(address)">수정</button>
            <div class="border-r border-rgray-100" />
            <button type="button" :aria-label="title + ' 삭제'" class="subhead-2-b text-rgray-400 md:cursor-pointer" @click="() => openDeleteDialog(address)">삭제</button>
          </div>
        </li>
      </ul>
      <button class="btn-h56-r28-line-wfull mt-8" @click="addAddress">{{ title }} 추가</button>
    </div>
    <div v-else>
      <p class="body-1-r mb-16 mt-6 text-center text-black">등록된 배송지가 없습니다.</p>
      <button class="btn-h52-r0-fill-wfull" @click="addAddress">{{ title }} 추가</button>
    </div>
  </div>

  <FeatAddressInputDialog :origin-address="addressObj" :is-open="isInputDialogOpen" @close-dialog="toggleInputDialogOpen"></FeatAddressInputDialog>

  <AppModalBottomSheet :is-open="isDeleteModalOpen" @update-open="closeDeleteDialog">
    <div class="pb-13 w-full px-5 text-center md:max-w-pc">
      <h3 class="headline-b text-black">알림</h3>
      <p class="body-2-r mb-12 mt-6 text-black">선택한 {{ title }}를 삭제하시겠습니까?</p>
      <div class="flex space-x-1">
        <button class="subhead-3-b h-14 w-1/2 rounded-3.5xl border border-solid border-black bg-white text-black" @click="closeDeleteDialog">취소</button>
        <button class="subhead-3-b h-14 w-1/2 rounded-3.5xl bg-black text-white" @click="deleteAddress">삭제</button>
      </div>
    </div>
  </AppModalBottomSheet>
</template>

<script setup>
// 주소지 리스트 다이얼로그입니다.
// 주소지를 선택하는 기능을 가지고 있습니다.
import { getAddressListAPI, deleteAddressAPI } from '~/composables/apiFactories/user'

const { orderMode } = defineProps({
  orderMode: {
    type: Boolean,
    require: true,
    default: false
  },
  title: {
    type: String,
    require: true,
    default: '주소지'
  }
})

const router = useRouter()

const { data, error, execute } = await getAddressListAPI()
if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
}

const initAddress = () => {
  return {
    addrId: 0,
    receiverName: '',
    addrCode: '',
    addr0: '',
    addr1: '',
    telNo: '',
    msg: '',
    defaultFlag: true
  }
}
const addressObj = ref(initAddress())
const isDeleteModalOpen = ref(false)
const isInputDialogOpen = ref(false)
const settingAddrForDelete = ref(0)

const toggleInputDialogOpen = (val) => {
  if (!val) execute()
  isInputDialogOpen.value = val
}

const modifyAddress = (addr) => {
  addressObj.value = addr
  toggleInputDialogOpen(true)
}

const addAddress = () => {
  if (data.value.data.length === 10) {
    appStore().setDialogDTO({
      message: '주소지는 최대 10개까지 추가 가능합니다.',
      timeout: 3
    })
  } else {
    addressObj.value = initAddress()
    toggleInputDialogOpen(true)
  }
}

const openDeleteDialog = (addr) => {
  settingAddrForDelete.value = addr.addrId
  isDeleteModalOpen.value = true
}

const closeDeleteDialog = () => {
  settingAddrForDelete.value = 0
  isDeleteModalOpen.value = false
}

const deleteAddress = async () => {
  const deleteAddrObj = await deleteAddressAPI(settingAddrForDelete.value)
  if (deleteAddrObj.error.value != null) {
    appStore().setDialogDTO({
      message: '주소를 삭제하지 못했습니다.',
      timeout: 3
    })
    useRetryError(deleteAddrObj.error.value.data.statusCode, deleteAddrObj.execute)
  } else if (deleteAddrObj.data.value.statusCode === 200) {
    appStore().setDialogDTO({
      message: '주소를 삭제했습니다.',
      timeout: 3
    })
    execute()
  } else {
    appStore().setDialogDTO({
      message: '주소를 삭제하지 못했습니다.',
      timeout: 3
    })
  }
  closeDeleteDialog()
}

const checkAddressForOrder = (addr) => {
  userStore().setCheckedAddress(addr)
  router.replace('/order/checkout')
}
</script>
