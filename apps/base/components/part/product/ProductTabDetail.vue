<template>
  <div class="relative overflow-hidden">
    <!-- info -->
    <PartProductDetailType v-if="detailType != null" :detail-type="detailType"></PartProductDetailType>

    <PartProductDetailBrandIntro v-if="detailBrandIntro != null" :detail-brand-intro="detailBrandIntro"></PartProductDetailBrandIntro>

    <PartProductDetailGrade v-if="detailGrade != null" :detail-grade="detailGrade"></PartProductDetailGrade>

    <div class="overflow-hidden" :style="{ height: isOpenDetail ? '' : '1000px' }">
      <!-- detail -->
      <div class="my-10">
        <h3 class="headline-b px-5 text-black">상품설명</h3>

        <p class="subhead-3-b mt-4 px-5 text-black">착용 계절</p>
        <p class="body-2-r mt-1 px-5 text-black">{{ formatSeason(prodDTO.season) }}</p>

        <p class="subhead-3-b mb-1 mt-4 px-5 text-black">상품 상세 정보</p>
        <div v-if="!prodDTO.detailDesc.startsWith('http')" class="px-5 text-black" v-html="prodDTO.detailDesc"></div>
        <img v-else class="w-full" :src="prodDTO.detailDesc" />
      </div>

      <div class="p-5">
        <img src="https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/global/orm/product_detail/zoom_detail_img.png" alt="이미지를 확대하여 확인해 보세요!" />
      </div>

      <!-- imgs -->
      <div class="space-y-1.5">
        <div
          v-for="(img, index) in prodDTO.imgs"
          :key="index"
          class="overflow-hidden"
          @touchstart="(event) => touchStartHandler(event, index)"
          @touchend="touchEndHandler"
          @touchmove="touchMoveHandler"
        >
          <div :id="'img-wrapper' + index" class="scale-1 origin-top-left transform">
            <img :src="img" class="h-full w-full" draggable="false" />
          </div>
        </div>
      </div>
    </div>

    <!-- 상세정보 더보기 -->
    <div class="absolute w-full">
      <div v-if="!isOpenDetail" :style="{ boxShadow: `0px -10px 50px 50px rgba(255,255,255,1)` }" />
      <div class="mx-5" :class="isOpenDetail ? 'my-5' : ''">
        <button id="product_detail_img_open_button" type="button" class="btn-h52-r0-line-wfull flex gap-0.5" @click="toggleOpenDetail">
          상세 정보 {{ isOpenDetail ? '닫기' : '더보기' }} <i class="text-base" :class="isOpenDetail ? 'rb-arrow-up' : 'rb-arrow-down'" />
        </button>
      </div>
    </div>
    <div class="w-full" :class="isOpenDetail ? 'h-[92px]' : 'h-13'" />
    <PartProductDetailSizeGuide v-if="appStore().getDomain == 'orm' && prodDTO.subBrandId === '12'" />
    <PartProductDetailAddInfo :clean-list="cleanList" :detail-info="detailInfo"></PartProductDetailAddInfo>
  </div>
</template>

<script setup lang="ts">
// 상품페이지 내의 상세정보 선택시에 나오는 컴포넌트입니다.
// 유형,브랜드,등급, 설명, 계절, 이미지 리스트, 정보 등으로 구성되어있습니다.
// 정보의 유무는 DB로부터 오는 정보에 따라 달라집니다.

interface Props {
  prodDTO: ProductDetailInfo
  cleanList: {
    imgs: string[]
    texts: string[]
  }
  detailInfo: string[]
  detailType?: Record<string, any>
  detailGrade: Record<string, any>
  detailBrandIntro?: Record<string, any>
}

defineProps<Props>()

let imageOpenButton: HTMLElement
const imageOpentButtonPosition = ref(0) // 버튼 열기 전 위치
const isOpenDetail = ref(false)

const toggleOpenDetail = () => {
  isOpenDetail.value = !isOpenDetail.value
  if (!isOpenDetail.value) {
    setTimeout(() => {
      window.scrollTo({
        top: imageOpentButtonPosition.value,
        left: 0,
        behavior: 'smooth'
      })
    }, 10)
  } else {
    // 열기 전 위치 기억.
    // "상세 정보 더보기" 버튼 위치 - 현재 디바이스 높이 /2
    const el = imageOpenButton.getBoundingClientRect()
    imageOpentButtonPosition.value = window.pageYOffset + el.top - window.innerHeight / 2
  }
}

type TouchStateType = {
  x: number
  y: number
  scale: number
}

type ZoomType = {
  zoom: number
  x: number
  y: number
}

let preventTouchEvent
let prevDistance = -1
let targetImage: HTMLElement
let eventHistory: any[] = []
let timer: ReturnType<typeof setTimeout>
// let centerXCord = 0
// let centerYCord = 0
// let pinchCenterX = 0
// let pinchCenterY = 0

const touchIndex = ref(0)
const state = ref({
  x: 0,
  y: 0,
  scale: 1
})

/** zoom 이벤트 시 state 변경하는 함수 */
const setState = ({ x, y, scale }: TouchStateType) => {
  state.value.x = x
  state.value.y = y
  state.value.scale = scale
  if (scale <= 1) {
    state.value.x = 0
    state.value.y = 0
    state.value.scale = 1
  }
  targetImage.style.transform = `translateX(${state.value.x}px) translateY(${state.value.y}px) scale(${state.value.scale})`
}

/** 기본 브라우저 zoom 기능 막음 */
const preventBroswerZoom = () => {
  preventTouchEvent = (event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  }

  document.addEventListener('touchmove', preventTouchEvent, { passive: false })
}

/** 타겟 이미지 설정 */
const setTargetImage = (targetId: string) => {
  targetImage = document.getElementById(targetId) as HTMLElement
}

/** touch event 초기화 */
const touchInit = () => {
  state.value = {
    x: 0,
    y: 0,
    scale: 1
  }
  eventHistory = []
  targetImage.style.transformOrigin = `0px 0px`
}

/** touchstart 이벤트 발생 시 실행 */
const touchStartHandler = (event: TouchEvent, index: number) => {
  setTargetImage(`img-wrapper${index}`)

  targetImage.classList.remove('custom-transition')

  if (touchIndex.value !== index) {
    touchInit()
  }

  const touches = event.changedTouches
  if (eventHistory.length + touches.length <= 2) {
    for (let i = 0; i < touches.length; i++) {
      eventHistory.push(touches[i])
    }
  }

  // pinch가 아닌, 1개의 터치로 dragging 이벤트 발생 시 centerXCord, centerYCord 세팅 (transform origin 설정을 위한 세팅)
  // if (eventHistory.length === 1 && touches.length === 1 && state.value.scale > 1) {
  //   centerXCord = touches[0].clientX
  //   centerYCord = touches[0].clientY
  // }

  touchIndex.value = index
}

/** touch 이벤트 끝날때 실행 */
const touchEndHandler = (event: TouchEvent) => {
  const touches = event.changedTouches
  for (let i = 0; i < touches.length; i++) {
    const index = eventHistory.findIndex((ev) => ev.identifier === touches[i].identifier)
    if (index !== -1) {
      eventHistory.splice(index, 1)
    }
  }

  if (state.value.scale > 1) {
    targetImage.classList.add('custom-transition')
    timer = setTimeout(() => {
      setState({
        x: state.value.x,
        y: state.value.y,
        scale: 0
      })
    }, 100)
  }
}

/** touch 중일때 실행 */
const touchMoveHandler = (event: TouchEvent) => {
  const touches = event.changedTouches
  // if (touches.length === 1 && eventHistory.length === 1 && state.value.scale > 1.5) {
  //   // pinch가 아닌, 1개의 터치로 dragging 이벤트 발생 시 transform origin을 세팅하고 transform이동
  //   targetImage.style.transformOrigin = `${centerXCord}px ${centerYCord}px`
  //   targetImage.style.transform = `translateX(${touches[0].clientX - pinchCenterX}px) translateY(${touches[0].clientY - pinchCenterY}px) scale(${state.value.scale})`
  // }

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i]
    const index = eventHistory.findIndex((ev) => ev.identifier === touch.identifier)

    if (index !== -1) {
      eventHistory[index] = touch

      if (eventHistory.length === 2) {
        const xDiff = eventHistory[0].clientX - eventHistory[1].clientX
        const yDiff = eventHistory[0].clientY - eventHistory[1].clientY

        // 유클리드 거리 공식 : (x1 - x2)^2 + (y1 - y2)^2
        const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

        // 첫 핀치의 경우 비교군이 없으므로 prevDiff가 -1인 경우 생략
        if (prevDistance > 0) {
          const zoom = distance - prevDistance

          // 두 터치의 중심점을 구함
          const x = (eventHistory[0].clientX + eventHistory[1].clientX) / 2
          const y = (eventHistory[0].clientY + eventHistory[1].clientY) / 2

          // 현재 브라우저 화면을 기준으로 타겟 요소의 위치 top, left를 가져옴
          const { top, left } = (event.currentTarget as HTMLElement).getBoundingClientRect()

          // pinchCenterX = x - left
          // pinchCenterY = y - top

          handlePinch({ zoom, x: x - left, y: y - top })
        }
        prevDistance = distance
      }
    }
  }
}

/** touch이벤트의 pinch범위 설정 */
const handlePinch = ({ zoom, x: centerX, y: centerY }: ZoomType) => {
  if (zoom === 0) return

  // pinch 일경우, transform origin 을 다시 왼쪽상단으로 세팅
  targetImage.style.transformOrigin = `0px 0px`

  const zoomWeight = 0.05
  const nextScale = state.value.scale + (zoom > 0 ? zoomWeight : -zoomWeight)

  const biasX = (centerX - state.value.x) * (nextScale / state.value.scale) - (centerX - state.value.x)
  const biasY = (centerY - state.value.y) * (nextScale / state.value.scale) - (centerY - state.value.y)

  const nextX = state.value.x - biasX
  const nextY = state.value.y - biasY

  const nextState = {
    x: nextX,
    y: nextY,
    scale: nextScale
  }

  setState(nextState)
}

onMounted(() => {
  preventBroswerZoom()
  imageOpenButton = document.getElementById('product_detail_img_open_button') as HTMLElement
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.custom-transition {
  transition: transform 0.15s ease-in;
}
</style>
