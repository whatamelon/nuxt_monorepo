<template>
  <div class="bg-white pb-48 pt-10">
    <div class="px-5">
      <p class="caption-2-b" :style="setTextColor(data.contents.tagColor)">{{ data.contents.tag }}</p>
      <h2 class="display-1-b mt-4 whitespace-pre-line" :style="setTextColor(data.contents.titleColor)">{{ data.contents.title }}</h2>

      <div class="mt-10 flex justify-between">
        <button class="btn-h32-r16-line-p16-gray pl-2 pr-4" @click="toggleDontknowDialogHandler">
          <i class="rb-question-fill my-auto text-base text-black"></i>
          <p class="body-1-r my-auto text-black">{{ data.contents.dontknowTagText }}</p>
        </button>
      </div>

      <form class="mt-4 flex space-x-1" @submit.prevent="getItemFromCode">
        <div v-if="data.contents.dividePosition != 0" class="flex space-x-1" style="width: calc(100% - 76px)">
          <div class="w-2/3">
            <input
              ref="firstOptionRef"
              v-model="firstOption"
              type="text"
              class="subhead-2-b h-13 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              :class="{
                'border-orange-600': errorObj.code.length > 0
              }"
              :placeholder="data.contents.placeHolderList[0]"
              maxlength="10"
              @keyup="onInputItemCode"
            />
          </div>

          <div class="w-1/3">
            <input
              ref="secondOptionRef"
              v-model="secondOption"
              type="text"
              class="subhead-2-b h-13 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
              :class="{
                'border-orange-600': errorObj.code.length > 0
              }"
              :placeholder="data.contents.placeHolderList[1]"
              maxlength="3"
              @keydown="onInputItemOpt"
            />
          </div>
        </div>

        <div v-else style="width: calc(100% - 76px)">
          <input
            ref="firstOptionRef"
            v-model="firstOption"
            type="text"
            class="subhead-2-b h-13 w-full border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 focus:border-black"
            :class="{
              'border-orange-600': errorObj.code === 'no_code'
            }"
            :placeholder="data.contents.placeHolderList[0]"
            maxlength="10"
            @keyup="onInputItemCode"
          />
        </div>

        <div class="relative">
          <div
            class="bottom-arrow absolute bottom-16 right-0 flex min-w-[125px] flex-col rounded border-none bg-caribbean-green-200 px-2 py-1 text-center text-caribbean-green-900"
            :class="itemList.length >= 10 ? 'block' : 'hidden'"
          >
            <span class="label-2-r font-semibold">소량 판매는</span>
            <span class="label-2-r"><b class="font-semibold">최대 10개까지</b> 가능해요! </span>
          </div>
          <button
            :disabled="
              itemListResalable.length >= 10 || (data.contents.dividePosition != 0 && firstOption.length + secondOption.length < 13) || (data.contents.dividePosition === 0 && firstOption.length < 10)
            "
            type="submit"
            class="btn-h52-r0-fill-p24 disabled:bg-gray-200"
          >
            입력
          </button>
        </div>
      </form>

      <p v-if="errorObj.code.length > 0" class="body-1-r mt-2 text-orange-600">
        {{ errorObj.msg }}
      </p>

      <div v-if="itemList.length > 0" class="mb-10 mt-10">
        <p class="subhead-3-b text-black">판매 신청 제품 ({{ itemListResalable.length }}/10)</p>
        <hr class="mt-4 border-black" />

        <div class="w-full divide-y divide-rgray-100">
          <div v-for="(item, itemIndex) in itemList" :key="itemIndex" class="relative w-full py-4">
            <p v-if="item.isResalable === false" class="caption-2-b absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center text-orange-600">
              <img :src="'/icons/global/ic-info-thin.svg'" alt="판매불가상품 아이콘" />
              판매 불가 상품입니다.
            </p>
            <div class="flex w-full">
              <img :src="item.imgLinkTh" class="mr-2 w-16 object-cover" :class="item.isResalable === false && 'opacity-20'" />

              <div class="mr-1 space-y-1" style="width: calc(100% - 104px)" :class="item.isResalable === false && 'opacity-20'">
                <p class="caption-2-b text-black">{{ item.snCode }}</p>
                <p v-if="item.subBrandName != ''" class="label-2-r line-clamp-1 text-rgray-400">{{ item.subBrandName }}</p>
                <p class="body-1-r line-clamp-1 text-black">{{ item.itemName }}</p>
                <div class="flex space-x-1">
                  <p class="body-1-r text-black">{{ data.contents.pointWord }}</p>
                  <p class="subhead-2-b text-black">{{ formatWonNoBlank(item.credit) }}P</p>
                </div>
              </div>

              <i class="rb-close-thin cursor-pointer text-32xl text-black" @click="() => emit('onRemoveItem', itemIndex)"></i>
            </div>
          </div>

          <div v-if="itemListResalable.length < 10" class="mt-6 flex flex-col items-center gap-1">
            <button type="button" class="btn-h52-r0-line-wfull" @click="onFocusNewItem"><img class="inline-block h-4 w-4" src="/icons/global/ic-plus.svg" />제품 추가</button>
            <p class="body-1-r text-center text-gray-400">최대 10개의 제품을 한 번에 판매할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div v-if="itemListResalable.length > 0">
        <hr class="border border-black" />

        <div class="flex w-full justify-between py-4">
          <div class="flex">
            <p class="subhead-3-b my-auto text-black">
              총 <span class="text-green-600">{{ itemListResalable.length }}</span
              >개 {{ data.contents.allPointWord }}
            </p>
          </div>

          <p class="headline-b text-green-600">{{ formatWonNoBlank(totalItemPointPlus) }} P</p>
        </div>
      </div>
      <button
        v-if="itemList.length === 0 && appStore().getDomain === 'orm' && userStore().getSalesCnt !== 0"
        class="mt-10 w-full rounded-2xl bg-caribbean-green-100 p-5 text-left"
        @click="openBuyListPopup"
      >
        <strong class="subhead-3-b">판매 가능한 상품이 있어요</strong>
        <p class="body-1-r text-gray-600">과거 구매 내역에 판매 가능한 상품이 있습니다. <br />상품을 확인 후, 쉽고 간편하게 판매 신청해 보세요!</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="subhead-2-b btn-h34-r17-fill-p16">판매 가능한 상품 보기<i class="rb-arrow-right_light ml-0.5 inline-block align-top text-base font-bold text-white"></i></span>
          <img src="/icons/sell/ic-sparkling.svg" />
        </div>
      </button>

      <div
        v-if="data.contents.isMassive"
        class="flex justify-between space-x-4 rounded-2xl bg-rgray-50 px-6 py-[14px] md:cursor-pointer"
        :class="itemListResalable.length === 0 ? 'mt-2' : 'mt-10'"
        @click="goToMassive"
      >
        <p class="body-1-r text-black">{{ data.contents.massiveWord }}</p>

        <div class="flex space-x-1">
          <p class="subhead-2-b my-auto text-black">{{ data.contents.massiveApplyWord }}</p>
          <i class="rb-arrow-right my-auto text-black"></i>
        </div>
      </div>
    </div>

    <div id="bottomFixedButton" class="fixed bottom-0 flex w-full space-x-1 bg-white px-5 pt-2 ios-safe-area md:max-w-pc" style="z-index: 998">
      <button class="btn-h56-r28-line-wfull" @click="goToPrevious">이전</button>
      <button :disabled="itemListResalable.length === 0" class="btn-h56-r28-fill-wfull disabled:bg-gray-200" @click="goToNext">주소 입력하기</button>
    </div>

    <!-- dontworry bottom sheet -->
    <AppModalBottomSheet :is-open="isDontknowDialog" @update-open="toggleDontknowDialogHandler">
      <div class="px-5">
        <div class="relative">
          <h3 class="headline-b whitespace-pre-line text-black">{{ data.contents.dontknowDialogTitle }}</h3>
          <p class="body-2-r mt-4 whitespace-pre-line text-rgray-600">{{ data.contents.dontknowDialogBody }}</p>

          <div class="max-h-[calc(50vh)] space-y-4 divide-y divide-gray-100 overflow-y-scroll pb-5 pt-8 no-scroll md:max-h-[calc(66vh)]">
            <div v-for="(item, index) in data.contents.dontknowDialogList" :key="index" class="w-full pt-4">
              <p class="subhead-3-b">{{ item.caption }}</p>
              <img :src="item.imgUrl" class="mt-2 w-full" />
            </div>
          </div>
          <div class="relative bottom-0 w-full bg-white pt-2">
            <button class="btn-h56-r28-fill-wfull" @click="toggleDontknowDialogHandler">네, 확인했어요!</button>
          </div>
        </div>
      </div>
    </AppModalBottomSheet>

    <!-- impossible bottom sheet -->
    <AppModalDialog :is-open="isImpossibleBottomSheetOpen" is-full-screen @update-open="toggleImpossibleDialogHandler">
      <div class="h-svh overflow-y-scroll pb-20">
        <div class="flex w-full justify-between px-5 py-4">
          <div class="w-6"></div>
          <p class="subhead-3-b text-black">{{ selectedBrandsImpossibleDialog.title }}</p>
          <i class="rb-close text-24xl text-black" @click="toggleImpossibleDialogHandler"></i>
        </div>

        <div class="w-full px-5 py-4">
          <!-- <div v-if="selectedBrandsImpossibleDialog.listType == 'list'" class="mb-6 space-y-4 divide-y divide-rgray-100">
            <div v-for="(item, index) in selectedBrandsImpossibleDialog.list" :key="index" class="flex space-x-2 pt-4">
              <img :src="item.imgUrl" class="h-22 w-22 object-cover" />
              <div class="p-1" style="width: calc(100% - 96px)">
                <p class="caption-2-b w-fit bg-rgray-100 px-1 text-black">{{ item.tag }}</p>
                <p class="subhead-2-b mt-2 whitespace-pre-line text-black">{{ item.text }}</p>
              </div>
            </div>
          </div> -->

          <div class="my-6 space-y-10">
            <div v-for="(item, gridIdx) in selectedBrandsImpossibleDialog.list" :key="gridIdx" class="space-y-2">
              <p class="subhead-3-b">{{ item.tag }}</p>
              <div class="grid w-full gap-2" :class="item.type" :style="item.type === 'grid-cols-3' && 'grid-template-columns: repeat(3, minmax(0, 1fr))'">
                <div v-for="(listItem, listIdx) in item.listItem" :key="listIdx" class="space-y-2">
                  <img :src="listItem.imgUrl" class="w-full" />
                  <p class="subhead-2-b text-black">{{ listItem.text }}</p>
                </div>
              </div>
              <p v-if="item.warnText && item.warnText !== ''" class="body-long-2-r bg-rgray-50 px-4 py-2 text-[#222]">{{ item.warnText }}</p>
            </div>
          </div>

          <div class="fixed bottom-0 left-0 w-full bg-white px-5 py-2 md:absolute">
            <button class="btn-h56-r28-fill-wfull" @click="goToNextForDialog">네, 확인했어요!</button>
          </div>
        </div>
      </div>
    </AppModalDialog>
  </div>
</template>

<script setup lang="ts">
// 판매신청하기 페이지 내의 2단계인 코드 입력 컴포넌트입니다.
// 24.04.08 기준 OLO, NSR에서 사용중입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// dividePosition값을 기준으로 input의 갯수를 지정합니다.
// OLO의 경우, 슈콤마보니 제품을 신청하면, 슈콤마보니 판매불가 사진 다이얼로그를 띄웁니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { getSncodeItemAPI, setSmallItemAPI } from '~/composables/apiFactories/sell'
import { SellItemActionType } from '~/types/enums/global'

interface Props {
  data: {
    contents: {
      tagColor: string
      tag: string
      titleColor: string
      title: string
      dontknowTagText: string
      dividePosition: number
      placeHolderList: string[]
      pointWord: string
      allPointWord: string
      massiveWord: string
      massiveApplyWord: string
      isMassive: boolean
      dontknowDialogTitle: string
      dontknowDialogBody: string
      dontknowDialogList: {
        caption: string
        imgUrl: string
      }[]
      impossibleDialog: {
        brandCode: string
        title: string
        body: string
        listType: string
        list: {
          tag: string
          type: string
          warnText: string
          listItem: {
            imgUrl: string
            text: string
          }[]
        }[]
      }
    }
  }
  sncodeList: BrandItemResponse[]
  step: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  changeSellType: [step: number, type: string]
  goToPrev: [step: number]
  goToNext: [step: number]
  putSncodeList: [sncodeList: BrandItemResponse[]]
  openItemDialog: []
  onRemoveItem: [index: number]
  toggleBuyListDialog: [value: boolean]
}>()

const device = useDevice()

const firstOption = ref('')
const secondOption = ref('')
const firstOptionRef = ref()
const secondOptionRef = ref()
const itemList = ref(props.sncodeList)
const isDontknowDialog = ref(false)
const selectedBrandsImpossibleDialog = ref(props.data.contents.impossibleDialog)
const isImpossibleBottomSheetOpen = ref(false)

const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

watch(
  () => props.sncodeList,
  (value) => {
    itemList.value = value
  }
)

/** itemList중 판매가능제품만 return */
const itemListResalable = computed(() => {
  // 새로 추가한 건의 경우 isResalable이 없어서 undefined가 나옴. 이런 경우를 위해 조건문 !== false로 처리
  return itemList.value.filter((item) => item.isResalable !== false)
})

/** 판매가능 제품들의 포인트 합 return */
const totalItemPointPlus = computed(() => {
  let point = 0
  itemListResalable.value.forEach((e) => {
    point += e.credit
  })
  return point
})

const setErrorObj = (obj: ErrorDialog) => {
  errorObj.value = obj

  setTimeout(() => {
    errorObj.value = {
      code: '',
      msg: '',
      time: 0
    }
  }, obj.time)
}

/** 품번을 모르겠어요 버튼 누를 시 나오는 dialog 토글 핸들러 */
const toggleDontknowDialogHandler = () => {
  if (!isDontknowDialog.value) {
    amplitude.track('hfproIDGuide_click')
  }
  isDontknowDialog.value = !isDontknowDialog.value
  if (device.isMobile) {
    if (isDontknowDialog.value) {
      hideChannelButton()
    } else {
      showChannelButton()
    }
  }
}

/** 슈콤마보니, 쿠론, 아카이브앱크 => 매입 불가 상품에 대한 안내 dialog 토글 핸들러 */
const toggleImpossibleDialogHandler = () => {
  isImpossibleBottomSheetOpen.value = !isImpossibleBottomSheetOpen.value
  if (device.isMobile) {
    if (isImpossibleBottomSheetOpen.value) {
      hideChannelButton()
    } else {
      showChannelButton()
    }
  }
}

/**
 * 품번 입력, 실패 시 안내 메세지 및 앰플리튜드
 * @param amplitudeId 앰플리튜드 result id
 * @param prodId 제품코드
 * @param message 안내 메세지
 */
const onErrorProductId = (amplitudeId: string, prodId: string, message: string) => {
  amplitude.track('hfproIDCheck_click', { result: amplitudeId, proID: prodId })
  setErrorObj({
    code: amplitudeId,
    msg: message,
    time: 5000
  })
}

/** 판매 신청 제품 추가. DB에서 품번을 조회해오고, 만약 조회 안되는 이유가 있다면 서버에서 코드로 알려줌. */
const getItemFromCode = async () => {
  let code = ''
  let first = ''
  let second = ''

  if (props.data.contents.dividePosition !== 0) {
    first = firstOption.value.toUpperCase()
    second = secondOption.value.toUpperCase()
    code = first + second
  } else {
    first = firstOption.value.toUpperCase()
    code = first
  }

  if (appStore().getDomain === 'orm') {
    // case 2. 한글 입력 : 품번 1~10번째 문자 중, 한글 입력
    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(first)) {
      onErrorProductId('bad_korean', code, '품번 형식이 아닙니다. 영문과 숫자 조합으로 입력해 주세요.')
      return
    }
    // case 3. 색상코드 오입력 : 품번 11~13번째 문자 중, 한글 또는 숫자 입력
    if (!/^[a-zA-Z]*$/.test(second)) {
      onErrorProductId('bad_color', code, '품번 형식이 아닙니다. 마지막 세자리는 영문으로만 입력해 주세요.')
      return
    }
    // case 4. 시리즈 아울렛 : 품번 1~2번째 문자가 SH
    if (code.startsWith('SH')) {
      onErrorProductId('bad_sh', code, '시리즈 아울렛 기획 상품은 판매가 불가능합니다.')
      return
    }
    // case 5. 신발/가방/악세사리/잡화 : 품번 1~2번째 문자가 SH
    const conditionList = ['LK', 'LX', 'FE', 'SR', 'SS', 'SZ', 'SX', 'MI', 'MX', 'MW', 'RY', 'EN', 'EO', '2B', '2C', 'CA', 'CR', 'CU', 'FT', 'J4', 'J6', 'J7', 'AR', '8I', '8J', '8K', '8L']
    if (conditionList.some((value) => code.startsWith(value))) {
      onErrorProductId('bad_item', code, '신발, 가방, 악세사리, 잡화류는 판매가 불가능합니다.')
      return
    }
    // case 6. 코오롱스포츠 흰색 패딩 : 코오롱스포츠, 품번 3~4번째 문자가 JD, 품번 11~13번째 문자가 WHX, OWH
    const ksWhiteList = ['JK', 'JW', 'TL', 'TV']
    const code34 = first.substring(2, 4)
    if (ksWhiteList.some((value) => code.startsWith(value)) && code34 === 'JD' && (second === 'WHX' || second === 'OWH')) {
      onErrorProductId('bad_ks_jd_white', code, '코오롱스포츠 흰색 패딩 상품은 판매가 불가능합니다.')
      return
    }
    // case 7. 코오롱스포츠 티셔츠 : 코오롱스포츠, 품번 3~4번째 문자가 TA, TB, TC
    const ksTShirtsList = ['21', '22', 'JK', 'JW', 'TL', 'TV', 'V2', 'V3', 'VH', 'VK']
    if (ksTShirtsList.some((value) => code.startsWith(value)) && (code34 === 'TA' || code34 === 'TB' || code34 === 'TC')) {
      onErrorProductId('bad_ks_tshirt', code, '코오롱스포츠 티셔츠 상품은 판매가 불가능합니다.')
      return
    }
    // case 8. 출시년도 경과 : 품번 6~7번째 문자가 숫자(출시년도). 그러나 숫자(출시년도)가 최근 5년 이내가 아님
    const before5year = new Date().getFullYear() - 2000 - 5
    if (Number(first.substring(5, 7)) < before5year) {
      onErrorProductId('bad_year_over', code, '출시된 지 5년이 경과된 상품은 판매가 불가능합니다.')
      return
    }
    // case 9. 올해 출시 : 품번 6~7번째 문자가 숫자(출시년도). 그러나 숫자(출시년도)가 올해임
    const thisyear = new Date().getFullYear() - 2000
    if (Number(first.substring(5, 7)) === thisyear) {
      onErrorProductId('bad_year_this', code, '올해 출시된 상품은 판매가 불가능합니다.')
      return
    }
  }

  const snInfoObj = await getSncodeItemAPI(code)

  if (snInfoObj.error.value != null && snInfoObj.error.value.data) {
    if (snInfoObj.error.value.data.statusCode === 401) {
      useRetryError(snInfoObj.error.value.data.statusCode, snInfoObj.execute)
    } else if (snInfoObj.error.value.data.statusCode === 400) {
      // case 10. 품번 미존재 : 품번 형식 맞으나, 품번 없음
      onErrorProductId('bad_code', code, '없는 품번입니다. 라벨 재확인 또는 우측 하단 채널톡으로 문의해 주세요.')
      // amplitude.track('hfproIDCheck_click', { result: 'bad_network', proID: code })
      // if (snInfoObj.error.value.data.data === 'RLY1000') {
      //   setErrorObj({
      //     code: 'fail_sncode',
      //     msg: '품번이 없습니다. 다시 확인 또는 우측 하단의 채널톡으로 문의해 주세요.',
      //     time: 5000
      //   })
      // }
      // if (snInfoObj.error.value.data.data === 'RLY1001') {
      //   setErrorObj({
      //     code: 'fail_sncode',
      //     msg: '조회하신 제품은 판매 대상이 아닙니다.',
      //     time: 5000
      //   })
      // }
    } else {
      // case 10. 품번 미존재 : 품번 형식 맞으나, 품번 없음
      onErrorProductId('bad_code', code, '없는 품번입니다. 라벨 재확인 또는 우측 하단 채널톡으로 문의해 주세요.')
    }
  } else {
    itemList.value.unshift(snInfoObj.data.value.data)
    firstOption.value = ''
    secondOption.value = ''
    firstOptionRef.value.focus()

    const onSaveItemDto = {
      snCodes: itemList.value.map((e) => e.snCode),
      actionType: SellItemActionType.Add
    }

    const result = await setSmallItemAPI(onSaveItemDto)
    if (result.data.value.statusCode === 200) {
      amplitude.track('hfproIDCheck_click', { result: 'good', proID: code })
    }
  }
}

const goToMassive = () => {
  emit('changeSellType', props.step, 'sncode')
}

const goToPrevious = () => {
  if (itemListResalable.value.length === 0) {
    emit('goToPrev', props.step)
  } else {
    emit('openItemDialog')
  }
}

const goToNext = () => {
  if (itemList.value.findIndex((e) => e.subBrandName === 'SUECOMMA BONNIE' || e.subBrandName === 'COURONNE' || e.subBrandName === 'Archivepke' || e.subBrandName === '아카이브앱크') > -1) {
    toggleImpossibleDialogHandler()
  } else {
    const priceTotal = itemList.value.reduce((prev, cur) => prev + cur.credit, 0)
    amplitude.track('hfproIDNext_click', {
      credit: priceTotal
    })
    emit('putSncodeList', itemList.value)
    emit('goToNext', props.step)
  }
}

/** 슈콤마보니, 쿠론, 아카이브앱크 => 매입 불가 상품에 대한 안내 dialog => 이후 작업. */
const goToNextForDialog = () => {
  toggleImpossibleDialogHandler()
  const priceTotal: number = itemList.value.reduce((prev, cur) => prev + cur.credit, 0)
  amplitude.track('hfproIDNext_click', {
    credit: priceTotal
  })
  emit('putSncodeList', itemList.value)
  emit('goToNext', props.step)
}

/**
 * 제품 품번 입력
 * @param evt
 */
const onInputItemCode = (evt: KeyboardEvent) => {
  if (firstOption.value.length >= 10) {
    // keyup event가 galaxy note 10+ 에서는 Shift키로 나오는 이슈로 Shift키 조건 추가
    if (evt.code === 'Backspace' || evt.key === 'Backspace' || evt.keyCode === 8 || evt.key === 'Shift') return
    secondOptionRef.value.focus()
  }
}

/**
 * 제품 색상/옵션 입력
 * @param evt
 */
const onInputItemOpt = (evt: KeyboardEvent) => {
  if (secondOption.value.length === 0) {
    if (evt.code === 'Backspace') {
      if (evt.target instanceof HTMLElement) {
        evt.target.blur()
      }
      secondOption.value = ''
      firstOptionRef.value.focus()
      evt.preventDefault()
    }
  }
}

/** 신청 제품 추가 버튼 클릭시, input창focus */
const onFocusNewItem = () => {
  window.scrollTo(0, 0)
  firstOptionRef.value.focus()
}

const setTextColor = (color: string) => {
  return {
    color
  }
}

/** 구매내역 리스트 풀팝업 오픈 */
const openBuyListPopup = () => {
  amplitude.track('hforderIDCheck_itemlist')
  emit('toggleBuyListDialog', true)
}
</script>

<style scoped>
.bottom-arrow:after {
  content: '';
  border-top: 12px solid;
  @apply border-t-caribbean-green-200;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-radius: 4px;
  bottom: -8px;
  position: absolute;
  right: 30px;
}
</style>
