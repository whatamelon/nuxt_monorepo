<template>
  <div>
    <ClientOnly>
      <PartResaleApplyProgress :active-step="activeStep" :ip-step="ipStep" :ip-step-raw="ipStepRaw"></PartResaleApplyProgress>

      <component
        :is="'Part' + activeStep.component"
        v-model="massiveCount"
        :data="activeStep.data"
        :step="activeStep.step"
        :sncode-list="sncodeList"
        :addr-d-t-o="addrDTO"
        :pre-date="preDate"
        :origin-massive-count="originMassiveCount"
        :is-open-brand-auth="isOpenBrandAuth"
        @go-to-next="goToNext"
        @go-to-prev="goToPrev"
        @change-sell-type="onChangeSellType"
        @put-sncode-list="putSncodeList"
        @change-massive-count="changeMassiveCount"
        @put-address="putAddress"
        @setPreDate="onSetPredate"
        @on-remove-item="onRemoveItem"
        @open-item-dialog="openItemDialog"
        @open-brand-auth="openBrandAuth"
        @open-confirm-modal="openBuyListConfirmModal"
        @toggle-buy-list-dialog="toggleBuyListDialog"
      ></component>
      <!-- 판매신청 중지 컨펌모달 -->
      <AppModalConfirmDialog ref="stopSellConfirmModal">
        <template #title>거의 다 왔어요!</template>
        <template #content>
          <template v-if="appStore().getSellType === 'sncode'">
            지금 판매시,
            <span class="subhead-3-b text-black">
              보상 예정 포인트는 <br />
              총 {{ formatWon(smallTotalCredit) }}P
            </span>
            입니다. <br />
            판매 신청을 중단하시겠습니까?
          </template>
          <template v-else>
            지금 판매시,
            <span class="subhead-3-b text-black">최대 {{ originMassiveCount }}벌</span>에 대해<br />
            <span class="subhead-3-b text-black"> 보상 예정포인트 </span>
            를 받을 수 있습니다.<br />
            판매 신청을 중단하시겠습니까?
          </template>
        </template>
        <template #confirm-text>계속하기</template>
        <template #cancel-text>다음에 팔기</template>
      </AppModalConfirmDialog>
      <!-- 판매가능상품 컨펌모달 -->
      <AppModalConfirmDialog ref="hasBuyListConfirmModal" icon-img="/icons/sell/ic-sparkling-bg.svg">
        <template #title>더 편하게 재판매 하기!</template>
        <template #content>OLO 릴레이 마켓에서 구매한 상품 중<br />재판매 가능한 상품이 있어요!<br />간편하게 품번입력 없이 재판매해 보세요.</template>
        <template #confirm-text>구매 상품 불러오기</template>
        <template #cancel-text>건너뛰기</template>
      </AppModalConfirmDialog>
      <!-- 판매신청중인 상품 컨펌모달 -->
      <AppModalConfirmDialog ref="hasSncodeConfirmModal" icon-img="/icons/global/ic-caution.svg">
        <template #title>판매 신청중인 상품이 있어요!</template>
        <template #content
          >기존에 판매 신청 중이던 상품이 있습니다. <br />
          상품 리스트를 교체할까요?</template
        >
        <template #confirm-text>상품 리스트 교체하기</template>
        <template #cancel-text>기존 상품 리스트 유지하기</template>
      </AppModalConfirmDialog>
      <!-- 구매내역 리스트 풀팝업 -->
      <PartResaleApplyBuyListFullPopup v-if="piniaAppStore.getDomain === 'orm'" :open-buy-list="openBuyList" @check-typecode-list="checkTypecodeList" @toggle-buy-list-dialog="toggleBuyListDialog" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// 판매신청페이지
import { showChannelButton, hideChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { getUserInfoAPI } from '~/composables/apiFactories/user'
import { getResaleApplyPageAPI, getItemActionsListAPI, setSenderAddressAPI, setBigItemAPI, setSmallItemAPI } from '~/composables/apiFactories/sell'
import { SellItemActionType } from '~/types/enums/global'

// SPRINT6 ticket no.1,2 알림톡 개발중단. 사유: 알림톡 템플릿 광고성 아닌 정보성으로 검수 반려
definePageMeta({
  keepalive: false
  //   middleware: [
  //     async (to) => {
  //       const user = userStore()
  //       const loggedIn = user.getLoginState
  //       if (Object.keys(to.query).findIndex((qry) => qry === 'isalert') > -1 && loggedIn === false) {
  //         return navigateTo('/sell')
  //       }
  //     }
  //   ]
})

// 알림톡 URL 규칙
// https://orm.the-relay.kr/sell/new?isAlert=true&componentstep=typecode
// isAlert -> 알림톡을 통해 들어옴
// componentstep -> 단계 및 컴포넌트값 그대로 작성
// notloggedinredirect -> 미로그인시 리다이렉트 URL (앞에다 /만 붙이는걸로, 서브 URL은 - 으로 표시)

useHead({
  script: [
    {
      src: 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    }
  ]
})

const piniaAppStore = appStore()

const ipStep: Ref<IpStep[]> = ref([])
const ipStepRaw: Ref<IpStep[]> = ref([])
const activeStep: Ref<IpStep> = ref({} as IpStep)
const sncodeList: Ref<SmallItemList[]> = ref([])
const originMassiveCount = ref(0) // DB와 sync된 origin 대량 카운트
const massiveCount = ref(0) // input 대량 카운트
const addrDTO = ref({
  addrCode: '',
  addr0: '',
  addr1: ''
})
const preDate = ref('')
const stopSellConfirmModal = ref()
const hasBuyListConfirmModal = ref()
const hasSncodeConfirmModal = ref()
const openBuyList = ref(false)
// 브랜드몰 인증
const isOpenBrandAuth = ref(false)

/** itemList중 판매가능제품만 return */
const itemListResalable = computed(() => {
  // 새로 추가한 건의 경우 isResalable이 없어서 undefined가 나옴. 이런 경우를 위해 조건문 !== false로 처리
  return sncodeList.value.filter((item) => item.isResalable !== false)
})

const smallTotalCredit = computed(() => {
  return itemListResalable.value.reduce((acc, cur) => acc + cur.credit, 0)
})

const resaleApplyPageObj = await getResaleApplyPageAPI()
const resaleGetActionItems = await getItemActionsListAPI()
if (resaleGetActionItems.error.value !== null && resaleGetActionItems.error.value.data) {
  useRetryError(resaleGetActionItems.error.value.data.statusCode, resaleGetActionItems.execute)
}

if (resaleApplyPageObj.error.value === null && resaleApplyPageObj.data.value) {
  ipStep.value = resaleApplyPageObj.data.value.data.pageComponents.map((e) => {
    return {
      step: parseInt(e.template.url.split('/')[1][e.template.url.split('/')[1].length - 1], 10),
      data: {
        contents: e.contents
      },
      component: e.template.url.split('/')[2].split('.vue')[0]
    }
  }) as IpStep[]

  activeStep.value = ipStep.value[0]

  ipStepRaw.value = ipStep.value.filter((arr, index, callback) => index === callback.findIndex((t) => t.step === arr.step))
}

const userInfoObj = await getUserInfoAPI()
if (userInfoObj.error.value != null && userInfoObj.error.value.data) {
  useRetryError(userInfoObj.error.value.data.statusCode, userInfoObj.execute)
} else {
  if (!userInfoObj.data.value.data.authFlag) {
    appStore().setDialogDTO({
      message: '본인인증 후에 판매신청해주세요.',
      timeout: 3
    })
    navigateTo('/my/profile')
  }
  addrDTO.value.addrCode = userInfoObj.data.value.data.sender.addrCode
  addrDTO.value.addr0 = userInfoObj.data.value.data.sender.addr0
  addrDTO.value.addr1 = userInfoObj.data.value.data.sender.addr1
}

/**
 * 4단계 - 판매 신청서 컴포넌트(Part > resaleApply > Receipt)
 * 브랜드 인증 모달 오픈 상태 조작
 */
const openBrandAuth = (value: boolean) => {
  isOpenBrandAuth.value = value
}

/**
 * 판매 타입 전환. 소량 판매 (sncode) / 대량 판매 (massive)
 * @param step
 * @param type 소량은 대량으로 보내고 대량은 소량으로 보낸다.
 */
const onChangeSellType = (step: number, type: string) => {
  const comps = ipStep.value.filter((e) => e.step === step)

  if (type === 'sncode') {
    // 소량으로 들어왔을 때 대량매입으로 이동
    piniaAppStore.setSellType('massive')
    activeStep.value = comps.find((e) => e.component === 'ResaleApplyTypemassive') as IpStep
  } else {
    // 대량으로 들어왔을 때 소량매입으로 이동
    piniaAppStore.setSellType('sncode')
    activeStep.value = comps.find((e) => e.component === 'ResaleApplyTypecode') as IpStep
  }
}

const goToPrev = (step: number) => {
  const prevComponents = ipStep.value.filter((e) => e.step === step - 1)

  if (prevComponents.length > 1 && prevComponents[0].step === 2) {
    if (piniaAppStore.getSellType !== '') {
      if (piniaAppStore.getSellType === 'sncode') {
        activeStep.value = prevComponents.find((e) => e.component === 'ResaleApplyTypecode') as IpStep
      } else {
        activeStep.value = prevComponents.find((e) => e.component === 'ResaleApplyTypemassive') as IpStep
      }
    } else {
      activeStep.value = prevComponents[0]
    }
  } else {
    activeStep.value = prevComponents[0]
  }
}

const goToNext = async (step: number) => {
  const nextComponents = ipStep.value.filter((e) => e.step === step + 1)

  if (nextComponents.length > 1 && nextComponents[0].step === 2) {
    if (piniaAppStore.getSellType !== '') {
      if (piniaAppStore.getSellType === 'sncode') {
        activeStep.value = nextComponents.find((e) => e.component === 'ResaleApplyTypecode') as IpStep
      } else {
        activeStep.value = nextComponents.find((e) => e.component === 'ResaleApplyTypemassive') as IpStep
      }
    } else {
      activeStep.value = nextComponents[0]
    }
  } else if (nextComponents[0].step === 4) {
    if (userInfoObj.error.value !== null || userInfoObj.data.value === null) {
      if (userInfoObj.error.value!.data) {
        useRetryError(userInfoObj.error.value!.data.statusCode, userInfoObj.execute)
      }
    }

    activeStep.value = nextComponents[0]
    activeStep.value.data.data = {}
    activeStep.value.data.data.userInfo = {
      name: userInfoObj.data.value.data.name,
      telNo: userInfoObj.data.value.data.mobileNo
    }
    activeStep.value.data.data.address = addrDTO.value
    activeStep.value.data.data.itemList = sncodeList.value
    activeStep.value.data.data.massiveCount = originMassiveCount.value
  } else {
    activeStep.value = nextComponents[0]
  }
}

const putSncodeList = (itemList: SmallItemList[]) => {
  sncodeList.value = itemList
}

const putAddress = (addressDTO: SenderAddressRequest) => {
  addrDTO.value = addressDTO
}

const onSetPredate = (date: string) => {
  preDate.value = date
}

/** 소량/대량 매입일때 현재 진행중인 매입건의 totalPoint 를 store에 저장시키는 함수 */
const onSaveStorePoints = async () => {
  if (appStore().getSellType === 'sncode') {
    await resaleGetActionItems.execute()
    userStore().setSellActionTotalPoints(resaleGetActionItems.data.value?.data.totalPoints)

    const actions = {
      isInSellSmall: false,
      isInSellBig: userStore().getUserAction.isInSellBig
    }

    if (resaleGetActionItems.data.value?.data.totalPoints > 0) {
      actions.isInSellSmall = true
    }
    userStore().setUserAction(actions)
  } else {
    const actions = {
      isInSellSmall: userStore().getUserAction.isInSellSmall,
      isInSellBig: false
    }

    // store에 대량 개수 10-50 사이일 때만 save.
    if (originMassiveCount.value >= 10 && originMassiveCount.value <= 50) {
      actions.isInSellBig = true
    }
    userStore().setUserAction(actions)
  }
}

/**
 * 대량 매입 input 데이터를 DB와 sync하는 함수
 * 1. input 데이터가 없으면 0으로 업데이트
 * 2. 0벌, 10~50벌 사이일 때 데이터 DB에 업데이트.
 */
const changeMassiveCount = async () => {
  // input 데이터가 없으면 0으로 업데이트
  if (!massiveCount.value) {
    massiveCount.value = 0
  }

  // 0벌 혹은 10~50벌 사이일 때만 데이터 sync
  if (massiveCount.value === 0 || (massiveCount.value >= 10 && massiveCount.value <= 50)) {
    originMassiveCount.value = massiveCount.value
    const { error, execute } = await setBigItemAPI({ quantity: originMassiveCount.value })
    if (error.value != null) {
      useRetryError(error.value.statusCode, execute)
    }
  } else {
    // 대량의 경우, 10-50 벌 사이가 아닐때 입력데이터를 기존 데이터로 복구
    massiveCount.value = originMassiveCount.value
  }
}

/** 소량 매입 item을 삭제하는 함수
 * 1. item에 x버튼 클릭 시 삭제
 * 2. 화면 이탈 시 판매불가 item 삭제
 */
const onRemoveItem = async (index: number, isNotResalable?: boolean) => {
  // 이탈 시 판매불가 item 삭제
  if (isNotResalable) {
    const onSaveItemDto = {
      snCodes: itemListResalable.value.map((e) => e.snCode),
      actionType: SellItemActionType.Delete
    }
    await setSmallItemAPI(onSaveItemDto)
    return
  }

  // item에 x버튼 클릭 시 삭제
  const code = sncodeList.value[index].snCode
  sncodeList.value.splice(index, 1)

  const onSaveItemDto = {
    snCodes: sncodeList.value.map((e) => e.snCode),
    actionType: SellItemActionType.Delete
  }
  const result = await setSmallItemAPI(onSaveItemDto)
  if (result.data.value.statusCode === 200) {
    amplitude.track('hfproIDDel_click', { result: 'good', proID: code })
  }
}

const openItemDialog = async () => {
  // 모달 오픈 여부와 상관없이, 현재 진행중인 매입건이 있는지 여부를 확인해야함.
  onSaveStorePoints()
  await stopSellConfirmModal.value.show().then((res: boolean) => {
    hideChannelButton()
    if (!res) {
      // 소량 판매불가 item이 있는 경우 삭제
      if (appStore().getSellType === 'sncode' && itemListResalable.value.length !== sncodeList.value.length) {
        onRemoveItem(0, true)
      }
      // 대량의 경우, 10-50 벌 사이가 아닐때 입력 데이터를 기존 데이터로 복구
      if (appStore().getSellType === 'massive') {
        massiveCount.value = originMassiveCount.value
      }
      goToPrev(activeStep.value.step)
    }
    showChannelButton()
  })
}

/** 판매 가능한 상품이 있을때 컨펌모달 노출 */
const openBuyListConfirmModal = async () => {
  hideChannelButton()
  await hasBuyListConfirmModal.value.show().then((res: boolean) => {
    if (res) {
      amplitude.track('hforderIDExist_itemlist', { choice: 'itemlist' })
      toggleBuyListDialog(true)
    } else {
      amplitude.track('hforderIDExist_itemlist', { choice: 'ignore' })
      hasBuyListConfirmModal.value.cancel()
      showChannelButton()
      goToNext(activeStep.value.step)
    }
  })
}

/** 구매내역 리스트 풀팝업 토글 노출 */
const toggleBuyListDialog = (state: boolean) => {
  openBuyList.value = state
}

/** 구매내역 리스트 풀팝업에서 선택한 상품으로 sncode 교체되도록 하는 함수 */
const onSaveBuyListItem = async (item: SalesProductListResponse[]) => {
  const onSaveItemDto = {
    snCodes: item.map((e) => e.snCode),
    actionType: SellItemActionType.Add
  }
  const result = await setSmallItemAPI(onSaveItemDto)
  // 추가된 item을 다시 조회하여 sncodeList에 추가
  await resaleGetActionItems.execute()
  if (resaleGetActionItems.data.value?.data.smalls.length > 0) {
    putSncodeList(resaleGetActionItems.data.value.data.smalls)
  }
  return result
}

/**
 * 구매내역 리스트 풀팝업에서 기존에 신청중인 소량매입 상품이 있으면, 컨펌모달 노출
 * 노출 후, 상품 리스트 교체 여부에 따라 다음 단계로 이동
 */
const checkTypecodeList = async (itemList: SalesProductListResponse[]) => {
  if (sncodeList.value.length > 0) {
    // 입력한 기존의 snCode가 있을 때.
    await hasSncodeConfirmModal.value.show().then((res: boolean) => {
      if (res) {
        amplitude.track('hfsellExist_itemlist', { choice: 'change' })
        piniaAppStore.setSellType('sncode') // 대랑으로 들어와도 소량타입으로 변경
        onSaveBuyListItem(itemList).then((result) => {
          if (result.data.value.statusCode === 200) {
            if (activeStep.value.step === 1) {
              goToNext(activeStep.value.step)
            }
          }
          toggleBuyListDialog(false)
          hasSncodeConfirmModal.value.cancel()
        })
      } else {
        amplitude.track('hfsellExist_itemlist', { choice: 'ignore' })
        hasSncodeConfirmModal.value.cancel()
        if (activeStep.value.step === 1) {
          goToNext(activeStep.value.step)
        }
        toggleBuyListDialog(false)
      }
    })
  } else {
    // 입력한 기존의 snCode가 없을 때.
    piniaAppStore.setSellType('sncode') // 대랑으로 들어와도 소량타입으로 변경
    onSaveBuyListItem(itemList).then((result) => {
      if (result.data.value.statusCode === 200) {
        if (activeStep.value.step === 1) {
          goToNext(activeStep.value.step)
        }
      }
      toggleBuyListDialog(false)
    })
  }
}

onMounted(async () => {
  // 전 화면에서 바텀시트로 진입 시 채널톡이 hide 처리되므로 페이지 진입 시 show 처리
  showChannelButton()

  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '판매하기',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: 'goHome' // 다른 backRoute와 다르게 실제로 이동되진 않으나 header에서 해당 값으로 appStore IS_MANUAL_CLOSE 처리, home으로 이동되는 로직 수행
  })

  // 판매하기 페이지 진입 시 기존에 입력 한 리스트 조회 / 새로고침할때도 조회가 되어야해서 onMounted 시킬때 execute
  resaleGetActionItems.execute()
  if (resaleGetActionItems.data.value?.data.smalls.length > 0) {
    putSncodeList(resaleGetActionItems.data.value.data.smalls)
  }
  if (resaleGetActionItems.data.value?.data.big) {
    originMassiveCount.value = resaleGetActionItems.data.value.data.big.quantity
    massiveCount.value = resaleGetActionItems.data.value.data.big.quantity
  }
})

/**
 * 판매하기 컴포넌트 사이의 이동 감지하여 맨 처음 컴포넌트일때만 판매하기 랜딩화면으로 이동. 이전 버튼 클릭해서 이동하는것은 감지 못함
 *
 * [ confirm modal 이 오픈되는 조건 ]
 *           step 1               step 2                 step 3    step 4
 * |     | brandTile | Typecode/Typemassive/Orderlist | Address | Receipt |
 * | --- | --------- | ------------------------------ | ------- | ------- |
 * | orm | -         | 이전, X                          | X       | X       |
 * | nsr | -         | 이전, X                          | X       | X       |
 * | gf  | -         | -                              | X       | X       |
 */
onBeforeRouteLeave(async (to, from, next) => {
  // 브랜드몰 인증 dialog가 열려있을 때 뒤로가기를 하면 dialog 닫아야 함.
  if (isOpenBrandAuth.value && to.name === 'sell') {
    next(false)
    isOpenBrandAuth.value = false
    return
  }
  // 대량의 경우, route 이동 전 데이터 sync.
  // sync 후 onSaveStorePoints() 메소드가 실행되어야 함.
  if (appStore().getSellType === 'massive') {
    changeMassiveCount()
  }
  // 모달 오픈 여부와 상관없이, 현재 진행중인 매입건이 있는지 여부를 확인해야함.
  onSaveStorePoints()

  // 구매목록 dialog가 열려있을 때, 이탈 시 닫기
  if (openBuyList.value) {
    next(false)
    toggleBuyListDialog(false)
  }

  // 주소 입력 창에서 빠져나갈 때, 입력한 주소를 저장.
  if (activeStep.value.step === 3) {
    // 주소 데이터가 있을 때만 저장.
    if (Object.values(addrDTO.value).every((data) => data)) {
      const senderObj = await setSenderAddressAPI(addrDTO.value)
      if (senderObj.error.value != null) {
        useRetryError(senderObj.error.value.statusCode, senderObj.execute)
      }
    }
  }

  // 첫 스텝과 판매 완료의 경우에는 바로 다음으로 나감.
  if (activeStep.value.step === 1 || activeStep.value.step === 5) {
    next()
    return
  }

  // Header X버튼 클릭 시 다음으로 이동.
  // 단, 소량/대량 매입 데이터가 존재하면 confirm modal 노출
  if (appStore().getIsManualClose) {
    // 소량 - 데이터 있는 경우, 대량 - 개수 10-50 사이일 때만 confirm modal open.
    if ((appStore().getSellType === 'sncode' && itemListResalable.value.length > 0) || (appStore().getSellType === 'massive' && originMassiveCount.value >= 10 && originMassiveCount.value <= 50)) {
      const result = await stopSellConfirmModal.value.show()
      if (!result) {
        // 소량 판매불가 item이 있는 경우 삭제
        if (appStore().getSellType === 'sncode' && itemListResalable.value.length !== sncodeList.value.length) {
          onRemoveItem(0, true)
        }

        next()
      } else {
        next(false)
      }
      appStore().setIsManualClose(false)
      return
    }

    // greenforet 2단계에서 이탈 시 다음으로 바로 이동
    if (activeStep.value.component === 'ResaleApplyOrderlist') {
      next()
      appStore().setIsManualClose(false)
      return
    }

    // 위의 조건이 다 아닐 경우 다음으로 이동
    next()
    appStore().setIsManualClose(false)
    return
  }

  // typecode, typemassive 화면에서 이전이나 브라우저 뒤로가기를 한 경우, confirm modal 노출
  if (activeStep.value.step === 2 && activeStep.value.component !== 'ResaleApplyOrderlist') {
    // 소량 - 데이터 있는 경우, 대량 - 개수 10-50 사이일 때만 confirm modal open.
    if ((appStore().getSellType === 'sncode' && itemListResalable.value.length > 0) || (appStore().getSellType === 'massive' && originMassiveCount.value >= 10 && originMassiveCount.value <= 50)) {
      const result = await stopSellConfirmModal.value.show()
      if (!result) {
        // 소량 판매불가 item이 있는 경우 삭제
        if (appStore().getSellType === 'sncode' && itemListResalable.value.length !== sncodeList.value.length) {
          onRemoveItem(0, true)
        }
        goToPrev(activeStep.value.step)
      }
      next(false)
      return
    }
    // 위의 조건이 다 아닐 경우 이전단계로 이동
    next(false)
    goToPrev(activeStep.value.step)
    return
  }

  // 그 외의 경우에는 이전 컴포넌트로 이동.
  next(false)
  goToPrev(activeStep.value.step)
})
</script>
