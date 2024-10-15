<template>
  <AppModalDialog :is-open="isReviewDialogOpen" is-full-screen @update-open="onClose">
    <div class="h-screen overflow-y-auto bg-white pb-32">
      <div class="flex w-full justify-between px-5 py-4">
        <div class="w-6"></div>
        <p class="subhead-3-b text-black">리뷰작성</p>
        <i class="rb-close text-24xl text-black" @click="onClose"></i>
      </div>

      <div v-if="spList.length > 0" class="">
        <div v-if="!spListOpen" class="px-5 py-4">
          <div class="flex h-full justify-between">
            <div class="flex space-x-2">
              <div class="">
                <img :src="spList[0].imgLink" class="h-auto w-10" />
              </div>
              <div
                :class="{
                  'w-[200px]': spList.length > 1
                }"
              >
                <p class="label-2-r text-rgray-400">{{ spList[0].subBrandName }}</p>
                <p class="body-1-r line-clamp-1 text-black">{{ spList[0].name }}</p>

                <div class="flex space-x-1">
                  <span v-for="(opt, optIdx) in spList[0].optCode.split(':')" :key="optIdx" class="caption-2-b flex text-black">
                    {{ formatOptionValue(opt) }}
                    <p v-if="spList[0].optCode.split(':').length - 1 != optIdx" class="ml-1">/</p>
                  </span>
                </div>
              </div>
            </div>

            <div v-if="spList.length > 1" class="flex h-[62px] w-16 justify-end space-x-2" @click="toggleSpListHandler">
              <p class="caption-2-b my-auto w-[29px] text-black">외 {{ spList.length - 1 }}건</p>
              <i class="rb-arrow-down my-auto text-24xl text-black"></i>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-between space-x-2 px-5 py-4">
          <div class="max-h-[340px] space-y-4 overflow-y-scroll no-scroll" style="width: calc(100% - 32px)">
            <div v-for="(item, index) in spList" :key="index" class="flex space-x-2">
              <div class="">
                <img :src="item.imgLink" class="h-auto w-10" />
              </div>
              <div class="w-[250px]">
                <p class="label-2-r text-rgray-400">{{ item.subBrandName }}</p>
                <p class="body-1-r line-clamp-1 text-black">{{ item.name }}</p>

                <div class="flex space-x-1">
                  <span v-for="(opt, optIdx) in item.optCode.split(':')" :key="optIdx" class="caption-2-b flex text-black">
                    {{ formatOptionValue(opt) }}
                    <p v-if="item.optCode.split(':').length - 1 != optIdx" class="ml-1">/</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="h-fit w-6">
            <i class="rb-arrow-up h-fit text-24xl text-black" @click="toggleSpListHandler"></i>
          </div>
        </div>
      </div>

      <div class="border-y border-rgray-100 py-4">
        <p class="subhead-3-b text-center text-black">{{ formatWonNoBlank(calcValidPoint) }} / {{ formatWonNoBlank(calcAllPoint) }} P <span class="body-2-r">적립예정</span></p>

        <div class="mx-auto mt-2.5 flex w-fit space-x-4">
          <div
            v-if="reviewType == 'buy'"
            class="flex space-x-1"
            :class="{
              'text-black': isValidReviewImg,
              'text-rgray-300': !isValidReviewImg
            }"
          >
            <i class="rb-check-thin text-24xl"></i>
            <p class="body-1-r my-auto">제품 사진첨부</p>
          </div>
          <div
            class="flex space-x-1"
            :class="{
              'text-black': isValidReviewMsg,
              'text-rgray-300': !isValidReviewMsg
            }"
          >
            <i class="rb-check-thin text-24xl"></i>
            <p class="body-1-r my-auto">20자 이상 작성</p>
          </div>
        </div>
      </div>

      <div class="px-5 py-10">
        <p class="subhead-3-b text-black">별점을 선택해주세요.</p>
        <div class="mt-4 flex">
          <i
            v-for="star in [1, 2, 3, 4, 5]"
            :key="star"
            class="rb-star text-40xl md:cursor-pointer"
            :class="{
              'text-black': star <= starPoint,
              'text-rgray-100': star > starPoint
            }"
            @click="() => onClickStar(star)"
          ></i>
        </div>
      </div>

      <div class="px-5">
        <p class="subhead-3-b text-black">이용하신 소감을 작성해주세요.</p>
        <textarea
          placeholder="최소 20자 이상의 리뷰를 입력해주세요. (최대 200자)"
          rows="3"
          :value="message"
          maxlength="200"
          class="body-1-r mt-4 w-full resize-none rounded-none border p-4 no-scroll placeholder:text-tiny placeholder:font-normal placeholder:leading-20 placeholder:text-rgray-400 focus:border-black"
          :class="{
            'border-orange-600': errorObj.code == 'no_msg'
          }"
          @input="onUpdateValidMsg"
        ></textarea>
        <div class="flex justify-between">
          <p v-if="errorObj.code == 'no_msg'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
          <p v-else class="text-transparent">에러가 발생했습니다.</p>
          <p
            :class="{
              'text-rgray-400': errorObj.code != 'no_msg',
              'text-orange-600': errorObj.code == 'no_msg'
            }"
            class="label-2-r float-right flex justify-end"
          >
            {{ msgLength }}/200
          </p>
        </div>
      </div>

      <div v-if="reviewType == 'buy'" class="mt-6 px-5">
        <p class="subhead-3-b text-black">사진을 첨부해주세요.</p>
        <input id="reviewImgInput" type="file" style="display: none" accept="image/*" multiple @change="onUploadImg" />
        <div class="mt-4 flex w-full flex-nowrap space-x-1 overflow-x-scroll bg-white no-scroll md:max-w-pc">
          <label for="reviewImgInput" class="h-20 w-20 bg-black px-7 pt-7">
            <i class="rb-plus text-24xl text-white"></i>
            <p class="label-2-r mt-0.5 w-10 text-white">{{ previewImgs.length }} / 5</p>
          </label>

          <img v-for="(img, index) in previewImgs" :key="index" :src="img" class="h-20 w-20 object-cover" />
        </div>
        <p class="label-2-r mt-4 text-black">* 구매 상품 전체가 나오도록 직접 촬용한 경우가 아닐경우, 지급된 포인트가 차감될 수 있습니다.</p>
        <button type="button" class="btn-h24-r0-line-p8 mt-1" @click="toggleExampleDialogHandler">자세히 보기</button>
        <p v-if="errorObj.code == 'img_error'" class="label-2-r text-orange-600">{{ errorObj.msg }}</p>
      </div>

      <div id="bottomFixedButton" class="fixed bottom-0 w-full bg-white px-5 py-2 md:max-w-pc">
        <button :disabled="!isValidReviewMsg || starPoint === 0" class="btn-h56-r28-fill-wfull disabled:bg-gray-200" @click="onRegisterReview">등록하기</button>
      </div>
    </div>

    <AppModalDialog :is-open="isExampleDialog" :is-full-screen="false" @update-open="toggleExampleDialogHandler">
      <div class="relative h-full w-full">
        <div class="flex w-full justify-end">
          <i class="rb-close text-24xl text-black" @click="toggleExampleDialogHandler"></i>
        </div>

        <div class="mt-4 pb-6">
          <p class="subhead-3-b text-black">적합한 예시</p>
          <div class="mt-2 flex space-x-2">
            <img src="https://s3.ap-northeast-2.amazonaws.com/img.the-relay/front_kolon/olo_img/review/review_good_1.png" class="w-1/2" />
            <img src="https://s3.ap-northeast-2.amazonaws.com/img.the-relay/front_kolon/olo_img/review/review_good_2.png" class="w-1/2" />
          </div>
          <p class="subhead-3-b mt-10 text-black">부적합한 예시</p>
          <div class="mt-2 flex space-x-2">
            <img src="https://s3.ap-northeast-2.amazonaws.com/img.the-relay/front_kolon/olo_img/review/review_fail_1.png" class="w-1/2" />
            <img src="https://s3.ap-northeast-2.amazonaws.com/img.the-relay/front_kolon/olo_img/review/review_fail_2.png" class="w-1/2" />
          </div>
        </div>
        <div class="w-full bg-white pb-12">
          <button class="btn-h56-r28-fill-wfull" @click="toggleExampleDialogHandler">확인</button>
        </div>
      </div>
    </AppModalDialog>
  </AppModalDialog>
</template>

<script setup>
// 리뷰다이얼로그 컴포넌트입니다.
// 구매리뷰의 경우, 텍스트와 사진 / 판매리뷰의 경우 텍스트만 받습니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  reviewType: {
    type: String,
    required: true
  },
  idForRegister: {
    type: [String, Number],
    required: true
  },
  spList: {
    type: Array,
    required: false
  },
  isReviewDialogOpen: {
    type: Boolean,
    required: true
  },
  textReviewPointPre: {
    type: Number,
    required: false
  },
  imageReviewPointPre: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['toggleReviewDiaglog', 'registerReview'])

const message = ref('')
const starPoint = ref(0)
const previewImgs = ref([])
const imgFiles = ref([])
const spListOpen = ref(false)
const isExampleDialog = ref(false)
const errorObj = ref({
  code: '',
  msg: '',
  time: 0
})

/** 메세지 작성 길이 */
const msgLength = computed(() => message.value.trim().length)

/** 리뷰 메세지 유효 검사 */
const isValidReviewMsg = computed(() => {
  if (message.value.trim().length >= 20) return true
  return false
})
const isValidReviewImg = computed(() => {
  if (imgFiles.value.length === 0) return false
  return true
})

/** 받을 수 있는 총 포인트 */
const calcAllPoint = computed(() => {
  return props.textReviewPointPre + props.imageReviewPointPre
})

/** 받을 수 있는 유효한 포인트 */
const calcValidPoint = computed(() => {
  let point = 0
  if (isValidReviewMsg.value) point += props.textReviewPointPre
  if (isValidReviewImg.value) point += props.imageReviewPointPre
  return point
})

const toggleSpListHandler = () => {
  spListOpen.value = !spListOpen.value
}

/** 별점 클릭 */
const onClickStar = (star) => {
  starPoint.value = star
}

/** 메세지가 유효한지 확인 */
const onUpdateValidMsg = (e) => {
  if (message.value.trim().length > 200) {
    e.preventDefault()
    return false
  }
  message.value = e.target.value
}

/** 부적합한 이미지 안내 dialog 토글 */
const toggleExampleDialogHandler = () => {
  isExampleDialog.value = !isExampleDialog.value
}

/** 이미지 업로드 */
const onUploadImg = (e) => {
  if (previewImgs.value.length >= 5) {
    appStore().setDialogDTO({
      message: '이미지가 5개 이상입니다. 기존 이미지를 삭제하고 업로드해주세요.',
      timeout: 3
    })
  } else if (e.target.files.length > 5) {
    appStore().setDialogDTO({
      message: '이미지가 5개를 초과했습니다. 이미지는 최대 5개까지 등록할 수 있습니다.',
      timeout: 3
    })
  } else if (e.target.files.length + previewImgs.value.length > 5) {
    appStore().setDialogDTO({
      message: '이미지가 5개를 초과했습니다. 이미지는 최대 5개까지 등록할 수 있습니다. 기존 이미지를 삭제하고 업로드해주세요.',
      timeout: 3
    })
  } else {
    const files = [...e.target.files]
    files.forEach((element) => {
      imgFiles.value.push(element)
      previewImgs.value.push(URL.createObjectURL(element))
    })
  }
}

/** 리뷰 dialog 닫기 */
const onClose = () => {
  emit('toggleReviewDiaglog')
  message.value = ''
  starPoint.value = 0
  imgFiles.value = []
  previewImgs.value = []
  spListOpen.value = false
}

/** 리뷰 등록 */
const onRegisterReview = async () => {
  if (message.value.trim().length !== 0) {
    if (props.reviewType === 'buy') {
      amplitude.track('completereview_click', {
        type: 'buy'
      })

      const formData = new FormData()

      formData.append('starPoint', starPoint.value)
      formData.append('message', message.value)
      formData.append('salesId', props.idForRegister)

      imgFiles.value.forEach((e) => {
        formData.append('imgFiles', e)
      })

      emit('registerReview', formData)
    } else {
      amplitude.track('completereview_click', {
        type: 'sell'
      })
      emit('registerReview', {
        ipId: props.idForRegister,
        starPoint: starPoint.value,
        message: message.value
      })
    }
    onClose()
  }
}

/** 풀팝업에는 채널톡 버튼이 뜨면 안되므로 watch로 팝업 열고 닫히는 부분 감시 */
watch(
  () => props.isReviewDialogOpen,
  (to) => {
    if (to) hideChannelButton()
    else showChannelButton()
  }
)
</script>
