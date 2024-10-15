<template>
  <div class="px-5 pb-48">
    <div v-if="qnaObj.data.value.data?.content.length == 0" class="space-y-16 pt-16 text-center">
      <p class="body-1-r text-center text-black">등록된 문의가 없습니다.<br />상품에 대해 궁금한점은 언제든 문의해주세요.</p>
      <button class="subhead-3-b btn-h52-r0-fill-wfull" @click="addQna">문의하기</button>
    </div>
    <div v-else class="pt-10">
      <div class="mb-10 flex justify-between">
        <p class="subhead-long-3-b text-black">상품에 대해 궁금한점은<br />언제든 문의해주세요.</p>
        <button class="subhead-3-b h-14 w-[152px] bg-black text-white" @click="addQna">문의하기</button>
      </div>

      <div class="space-y-4">
        <div v-for="(item, index) in qnaObj.data.value.data?.content" :key="index" class="space-y-2">
          <hr class="mt-4 w-full border-rgray-100" />
          <div class="flex justify-between pt-4">
            <p class="body-1-r my-auto text-black">Q</p>
            <p v-if="!item.anFlag" class="badge-h22-r0-fill-p8-gray">미답변</p>
            <p v-else class="badge-h22-r0-fill-p8-black">답변 완료</p>
          </div>

          <p class="body-1-r text-black">{{ item.msg }}</p>

          <div class="flex w-full justify-end">
            <div class="flex space-x-2">
              <p class="label-2-r text-rgray-400">{{ formatDate(item.quDate) }}</p>
              <p class="label-2-r text-black">{{ item.userName }}</p>
            </div>
          </div>

          <div v-if="item.anFlag" class="bg-rgray-50 p-4">
            <p class="subhead-2-b text-black">A</p>
            <p class="body-1-r mt-1 text-black">{{ item.anMsg }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isOpen" id="bottomFixedButton" style="z-index: 999" class="fixed top-0 h-screen w-full bg-white ios-safe-area md:max-w-pc">
    <div class="flex h-14 w-full justify-between px-5">
      <div class="w-[18px]"></div>

      <h2 class="subhead-3-b my-auto w-[176px] truncate text-center">상품문의</h2>

      <i class="rb-close my-auto text-24xl text-black" @click="close"></i>
    </div>

    <div class="mt-10 px-5">
      <div>
        <p class="body-2-r text-black">유형</p>
        <div
          class="mt-1 flex h-12 w-full justify-between border border-solid px-4 md:cursor-pointer"
          :class="{
            'border-black': dropdownActive,
            'border-rgray-100': !dropdownActive,
            'border-orange-600': errorObj.code == 'no_select'
          }"
          @click="toggleDropdown"
        >
          <p class="body-1-r my-auto text-black">{{ selectedMsg.text }}</p>
          <i
            class="rb-arrow-down my-auto text-24xl"
            :class="{
              'rotate-180': dropdownActive
            }"
          ></i>
        </div>
        <div v-if="dropdownActive" class="static space-y-4 border-x border-b border-black px-4 pb-4">
          <p v-for="(msgs, index) in msgList" :key="index" class="body-1-r w-full pt-4 text-black md:cursor-pointer" @click="changeMsg(msgs)">{{ msgs.text }}</p>
        </div>
        <p v-if="errorObj.code == 'no_select'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
      </div>

      <div class="mt-10">
        <p class="body-2-r text-black">내용</p>
        <textarea
          rows="3"
          :value="qnaMsg"
          maxlength="500"
          placeholder="문의내용을 입력하세요. (500자 이내)"
          class="body-1-r mt-2 w-full resize-none border p-4 placeholder:text-tiny placeholder:font-normal placeholder:leading-20 placeholder:text-rgray-400 focus:border-black"
          :class="{
            'border-orange-600': errorObj.code == 'no_msg'
          }"
          @input="updateIfPossible"
        ></textarea>
        <div class="flex justify-between">
          <p v-if="errorObj.code == 'no_msg'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
          <p v-else class="text-transparent">문의내용을 입력해주세요.</p>
          <p
            :class="{
              'text-rgray-400': errorObj.code != 'no_msg',
              'text-orange-600': errorObj.code == 'no_msg'
            }"
            class="label-2-r float-right flex justify-end"
          >
            {{ titleLimit }}/500
          </p>
        </div>
      </div>

      <button class="subhead-3-b btn-h52-r0-fill-wfull mt-10" @click="registerQna">문의하기</button>
      <p class="body-1-r mt-4 text-black">개인 정보 보호를 위해 주민등록번호, 전화번호 등 개인 정보를 기재하지 않도록 주의해주세요.</p>
    </div>
  </div>
</template>

<script setup>
// 상품상세 문의하기 탭 선택시에 나오는 컴포넌트입니다.
// 이게 원래는 리스트와 다이얼로그가 분리되어야하지만, 왜인지 알것 같은데 분리가 안되어있습니다. 아마 탭바이탭으로 상태 관리가 어려워서 그랬을 수도 있습니다.
// 앞으로 페이지네이션의 추가등 기능 개선이 필요한 부분입니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'
import { addProductIdQnaAPI } from '~/composables/apiFactories/product'

const props = defineProps({
  qnaObj: {
    type: Object,
    required: true
  },
  prodName: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const dropdownActive = ref(false)
const selectedMsg = ref({
  quClass: '',
  text: '문의 유형을 선택해주세요.'
})
const msgList = ref([
  { quClass: 'prod', text: '상품' },
  { quClass: 'deli', text: '배송' },
  { quClass: 'refu', text: '반품' },
  { quClass: 'etcq', text: '기타' }
])
const qnaMsg = ref('')
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

const loginState = computed(() => userStore().getLoginState)
const titleLimit = computed(() => {
  const titleLength = qnaMsg.value.trim().length
  return titleLength
})

const setErrorObj = (obj) => {
  errorObj.value = obj
  setTimeout(() => {
    errorObj.value = {
      code: '',
      msg: '',
      time: 0
    }
  }, obj.time)
}

const toggleDropdown = () => {
  dropdownActive.value = !dropdownActive.value
}

const addQna = () => {
  if (loginState.value === false) {
    appStore().setDialogDTO({
      message: '로그인 후 이용해주세요.',
      timeout: 1
    })

    const recentRoute = useCookie('RECENT_ROUTE')
    recentRoute.value = route.fullPath
    router.push('/login')
  } else {
    amplitude.track('ask_start')
    isOpen.value = true
    hideChannelButton()
  }
}

const close = () => {
  isOpen.value = false
  showChannelButton()
}

const changeMsg = (msg) => {
  selectedMsg.value = msg
  // qnaMsg.value = '';
  toggleDropdown()
}

const updateIfPossible = (e) => {
  if (qnaMsg.value.trim().length > 500) return
  qnaMsg.value = e.target.value
}

const registerQna = async () => {
  if (selectedMsg.value.quClass === '') {
    setErrorObj({
      code: 'no_select',
      msg: '문의 유형을 선택해주세요.',
      time: 3000
    })
  } else if (qnaMsg.value.length === 0) {
    setErrorObj({
      code: 'no_msg',
      msg: '문의 내용을 입력해주세요.',
      time: 3000
    })
  } else {
    amplitude.track('ask_finish', {
      type: formatAmpQnatypeNameFilter(selectedMsg.value.quClass)
    })
    const addQnaObj = await addProductIdQnaAPI({
      prodId: route.params.id,
      params: {
        quClass: selectedMsg.value.quClass,
        msg: qnaMsg.value
      }
    })
    if (addQnaObj.error.value != null) {
      useRetryError(addQnaObj.error.value.data.statusCode, addQnaObj.execute)
    }

    if (addQnaObj.error.value == null) {
      close()
      props.qnaObj.execute()
      dropdownActive.value = false
      selectedMsg.value = {
        quClass: '',
        text: '문의 유형을 선택해주세요.'
      }
      qnaMsg.value = ''
    } else {
      appStore().setDialogDTO({
        message: '상품문의 등록에 실패했습니다.',
        timeout: 3
      })
    }
  }
}
</script>
