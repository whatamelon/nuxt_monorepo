<template>
  <ClientOnly>
    <template #fallback>
      <USkeleton class="h-[375px] w-[375px] animate-pulse" />
    </template>
    <div v-if="data.contents.list.length > 1" class="home-top-banner">
      <Swiper
        :modules="[SwiperAutoplay, SwiperPagination, SwiperEffectCreative]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false
        }"
        :pagination="{
          type: `progressbar`,
          progressbarFillClass: 'swiper-pagination-progressbar-fill h-0.5 block rounded-none m-0'
        }"
        :effect="'creative'"
        :creative-effect="{
          prev: {
            shadow: false,
            translate: ['-20%', 0, -1]
          },
          next: {
            translate: ['100%', 0, 0]
          }
        }"
      >
        <SwiperSlide v-for="(homeTopBanner, index) in data.contents.list" :key="index">
          <div class="aspect-h-1 aspect-w-1 relative w-full bg-cover md:cursor-pointer" :style="bannerBgImg(homeTopBanner.imgLink)" @click="() => move(homeTopBanner)">
            <!-- div가 2개인 이유는 aspect > * 에 bottom:0 스타일이 적용되어서 bottom-6가 원활히 적용이 안됨. -->
            <div>
              <div class="absolute bottom-10 left-1/2 w-[calc(100%-40px)] -translate-x-1/2 text-left">
                <h2 class="display-1-b line-clamp-2 w-full whitespace-pre" :style="textColor(homeTopBanner.titleColor)">{{ homeTopBanner.titleTxt }}</h2>
                <h3 class="body-2-r mt-2 line-clamp-2 w-full whitespace-pre" :style="textColor(homeTopBanner.bodyColor)">{{ homeTopBanner.bodyTxt }}</h3>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div v-else class="home-top-banner">
      <div class="aspect-h-1 aspect-w-1 relative w-full bg-cover md:cursor-pointer" :style="bannerBgImg(data.cotents.list[0].imgLink)" @click="() => move(data.cotents.list[0])">
        <div>
          <div class="absolute bottom-10 left-1/2 w-[calc(100%-40px)] -translate-x-1/2 text-left">
            <h2 class="display-1-b line-clamp-2 w-full whitespace-pre" :style="textColor(data.cotents.list[0].titleColor)">{{ data.cotents.list[0].titleTxt }}</h2>
            <h3 class="body-2-r mt-2 line-clamp-2 w-full whitespace-pre" :style="textColor(data.cotents.list[0].bodyColor)">{{ data.cotents.list[0].bodyTxt }}</h3>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
// 홈 상단배너 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 상단배너의 갯수가 1개면, swiper를 사용하지 않습니다.

// div가 2개인 이유는 aspect > * 에 bottom:0 스타일이 적용되어서 bottom-6가 원활히 적용이 안됨.
import * as amplitude from '@amplitude/analytics-browser'

defineProps({
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const move = async (contentDTO) => {
  amplitude.track('topbanner_click', { bannerid: contentDTO.contentsId })
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

      if ('season' in querys === false) queryString += 'season=&'
      else queryString += `season=${querys.season}&`

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

      if ('season' in querys2 === false) queryString2 += 'season=&'
      else queryString2 += `season=${querys2.season}&`

      if ('price' in querys2 === false) queryString2 += 'price=&'
      else queryString2 += `price=${querys2.price}&`

      if ('cat' in querys2 === false) queryString2 += 'cat=&'
      else queryString2 += `cat=${querys2.cat}&`

      if ('order' in querys2 === false) queryString2 += 'order=&'
      else queryString2 += `order=${querys2.order}&`

      if ('brand' in querys2 === false) queryString2 += 'brand=&'
      else queryString2 += `brand=${querys2.brand}&`

      if ('type' in querys2 === false) queryString2 += 'type=&'
      else queryString2 += `type=${querys2.brand}&`

      router.push(`/event/fo?${queryString2}`)
      break
    }
    default:
  }
}

const bannerBgImg = (imgLink) => {
  return {
    backgroundImage: `url(${imgLink})`,
    backgroundPosition: '50% 50%'
  }
}

const textColor = (colorCode) => {
  if (colorCode) {
    return {
      color: `#${colorCode.slice(0, 6)}`
    }
  }
  return {
    color: '#222222'
  }
}

onMounted(() => {
  const elements = document.getElementsByClassName('swiper-pagination-bullet')
  Array.from(elements).forEach((element) => {
    element.style.flex = '1 0 0'
    element.style.margin = '0'
  })

  const elements2 = document.getElementsByClassName('swiper-pagination')
  Array.from(elements2).forEach((element) => {
    // element.classList.add('space-x-0.5')
    element.style.bottom = '-1px'
  })
})
</script>

<style>
.home-top-banner > .swiper > .swiper-pagination {
  display: flex;
  top: auto !important;
  overflow: hidden;
}

.home-top-banner > .swiper > .swiper-horizontal > .swiper-pagination-progressbar,
.swiper-pagination-progressbar.swiper-pagination-horizontal {
  height: 2px !important;
}

.home-top-banner > .swiper > .swiper-pagination > .swiper-pagination-progressbar {
  background: rgba(231, 231, 231, 1);
}

.home-top-banner > .swiper > .swiper-pagination > .swiper-pagination-progressbar-fill {
  background: rgba(34, 34, 34, 1) !important;
}
</style>
