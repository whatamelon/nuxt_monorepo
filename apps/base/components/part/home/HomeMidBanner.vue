<template>
  <div
    v-if="data.contents.titleTxt"
    class=""
    :class="{
      'pt-2': beforeHomeCompType == 'HomeMidBanner',
      'pt-10': beforeHomeCompType != 'HomeMidBanner',
      'pb-0': nextHomeCompType == 'HomeMidBanner',
      'pb-10': nextHomeCompType != 'HomeMidBanner'
    }"
  >
    <div class="aspect-h-1 aspect-w-1 relative w-full bg-cover md:cursor-pointer" :style="bannerBgImg()">
      <div>
        <div class="absolute !bottom-[36px] left-1/2 w-[calc(100%-40px)] -translate-x-1/2">
          <div class="flex w-full justify-between">
            <div class="w-[calc(100%-100px)]">
              <h2 class="headline-b line-clamp-2 w-full whitespace-pre-line text-left" :style="textColor(data.contents.titleColor)">{{ data.contents.titleTxt }}</h2>
              <h3 class="body-1-r mt-1 line-clamp-2 w-full whitespace-pre-line text-left" :style="textColor(data.contents.bodyColor)">{{ data.contents.bodyTxt }}</h3>
            </div>
            <div class="flex flex-col justify-end">
              <button class="btn-h32-r16-line-p16" :style="textBorderColor(data.contents.titleColor)" @click="() => move(data.contents)">전체보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 홈 중간배너 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 이미지는 background-image로 처리합니다.
// 홈 중간배너 컴포넌트가 위아래로 함께 있는 경우에는 디자인적으로 연속성을 위해 padding값을 기존의 40px이 아닌, 8px/0px로 설정합니다.

// div가 2개인 이유는 aspect > * 에 bottom:0 스타일이 적용되어서 bottom-6가 원활히 적용이 안됨.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  position: {
    type: Number,
    required: false,
    default: 0
  },
  beforeHomeCompType: {
    type: String,
    required: false
  },
  nextHomeCompType: {
    type: String,
    required: false
  }
})

const router = useRouter()

const move = async (contentDTO) => {
  if (props.position === 0) amplitude.track('midbanner_click', { bannerid: contentDTO.contentsId })
  else amplitude.track('eventbanner_click', { ID: contentDTO.contentsId, position: props.position })

  switch (contentDTO.actType) {
    case 'evpl':
      router.push(`/event/pl/${contentDTO.actData}`)
      break
    case 'ourl':
      await navigateTo(contentDTO.actData, { external: true })
      break
    case 'menu':
      switch (contentDTO.actData) {
        case 'pckg':
          router.push('/sell')
          break
        case 'mypg':
          router.push('/my')
          break
        case 'srev':
          router.push('/review_list/sell')
          break
        case 'prev':
          router.push('/review_list/buy')
          break
        case 'join':
          router.push('/join/select')
          break
        case 'logn':
          router.push('/login')
          break
        default:
      }
      break
    case 'prft': {
      const querys = {}
      let queryString = ''
      const queryList = contentDTO.actData.split('::')
      queryList.forEach((e) => {
        querys[e.split('=')[0]] = e.split('=')[1]
      })

      if ('grade' in querys === false) queryString += 'grade=&'
      else queryString += `grade=${querys.grade}&`

      if ('price' in querys === false) queryString += 'price=&'
      else queryString += `price=${querys.price}&`

      if ('cat' in querys === false) queryString += 'cat=&'
      else queryString += `cat=${querys.cat}&`

      if ('order' in querys === false) queryString += 'order=&'
      else queryString += `order=${querys.order}&`

      if ('brand' in querys === false) queryString += 'brand=&'
      else queryString += `brand=${querys.brand}&`

      if ('type' in querys === false) queryString += 'type=&'
      else queryString += `type=${querys.type}&`

      router.push(`/product_list?${queryString}`)
      break
    }

    case 'evfo': {
      const querys2 = {}
      let queryString2 = ''
      const queryList2 = contentDTO.actData.split('::')
      queryList2.forEach((e) => {
        querys2[e.split('=')[0]] = e.split('=')[1]
      })

      if ('grade' in querys2 === false) queryString2 += 'grade=&'
      else queryString2 += `grade=${querys2.grade}&`

      if ('price' in querys2 === false) queryString2 += 'price=&'
      else queryString2 += `price=${querys2.price}&`

      if ('cat' in querys2 === false) queryString2 += 'cat=&'
      else queryString2 += `cat=${querys2.cat}&`

      if ('order' in querys2 === false) queryString2 += 'order=&'
      else queryString2 += `order=${querys2.order}&`

      if ('brand' in querys2 === false) queryString2 += 'brand=&'
      else queryString2 += `brand=${querys2.brand}&`

      if ('type' in querys2 === false) queryString2 += 'type=&'
      else queryString2 += `type=${querys2.type}&`

      router.push(`/event/fo?${queryString2}`)
      break
    }
    default:
  }
}

const bannerBgImg = () => {
  return {
    backgroundImage: `url(${props.data.contents.imgLink})`,
    backgroundPosition: '50% 50%'
  }
}

const textBorderColor = (colorCode) => {
  return {
    color: `#${colorCode.slice(0, 6)}`,
    borderColor: `#${colorCode.slice(0, 6)}`
  }
}

const textColor = (colorCode) => {
  return {
    color: `#${colorCode.slice(0, 6)}`
  }
}
</script>
