<template>
  <div
    class="fixed h-full"
    :class="{
      'left-[60px] w-[calc(50%-60px)]': $device.isTablet,
      'left-[200px] w-[calc(50%-200px)]': $device.isDesktop
    }"
  >
    <NuxtImg
      :src="layoutData.logoImage"
      class="mt-10 h-10"
      :class="{
        'h-3': $device.isTablet,
        'h-6': $device.isDesktop
      }"
      :alt="layoutData.titleTxt + ' 로고'"
    />
    <div class="absolute top-1/2 h-fit w-full" style="transform: translateY(-50%)">
      <h1 class="headline-b" :style="setTextColor(layoutData.titleColor)">{{ layoutData.titleTxt }}</h1>
      <p class="body-2-r mt-1 opacity-60" :style="setTextColor(layoutData.bodyColor)">{{ layoutData.bodyTxt }}</p>

      <div class="mt-10">
        <div v-if="layoutData.cardList.length > 1" class="leftpart-swiper">
          <ClientOnly>
            <template #fallback>
              <USkeleton class="h-[460px] w-[320px] rounded-3xl" />
            </template>
            <Swiper
              :modules="[SwiperAutoplay, SwiperEffectFade, SwiperPagination]"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{
                delay: 5000,
                disableOnInteraction: false
              }"
              :pagination="{
                bulletActiveClass: 'swiper-pagination-bullet-fill h-0.5 block rounded-none'
              }"
              :effect="'fade'"
            >
              <SwiperSlide v-for="(layoutBanner, bannerIdx) in layoutData.cardList" :key="bannerIdx">
                <div
                  :style="setBgColor(layoutBanner.bgColor)"
                  class="flex flex-col justify-between rounded-3xl"
                  :class="{
                    'h-[340px] w-[280px] px-6 py-8': $device.isTablet,
                    'h-[460px] w-[320px] px-8 py-10': $device.isDesktop
                  }"
                >
                  <div>
                    <NuxtImg
                      :src="layoutBanner.imgLink"
                      class="mx-auto w-fit"
                      :class="{
                        'h-20': $device.isTablet,
                        'h-30': $device.isDesktop
                      }"
                      :alt="layoutBanner.titleTxt"
                    />
                    <h2
                      class="display-2-b mt-8 line-clamp-2 w-full"
                      :class="{
                        'subhead-3-b': $device.isTablet,
                        'display-2-b': $device.isDesktop
                      }"
                      :style="setTextColor(layoutBanner.titleColor)"
                    >
                      {{ layoutBanner.titleTxt }}
                    </h2>
                    <h3
                      class="body-2-r mt-2 line-clamp-3 w-full whitespace-pre"
                      :class="{
                        'body-1-r': $device.isTablet,
                        'body-2-r': $device.isDesktop
                      }"
                      :style="setTextColor(layoutBanner.bodyColor)"
                    >
                      {{ layoutBanner.bodyTxt }}
                    </h3>
                  </div>

                  <button
                    :class="{
                      'btn-h48-r99-fill-wfull': $device.isTablet,
                      'btn-h64-r99-fill-wfull': $device.isDesktop
                    }"
                    :style="setBgTextColor(layoutBanner)"
                    @click="() => move(layoutBanner)"
                  >
                    {{ layoutBanner.buttonTxt }}
                  </button>
                </div>
              </SwiperSlide>
            </Swiper>
          </ClientOnly>
        </div>
        <div v-else>
          <div
            :style="setBgColor(layoutData.cardList[0].bgColor)"
            class="flex flex-col justify-between rounded-3xl"
            :class="{
              'h-[340px] w-[280px] px-6 py-8': $device.isTablet,
              'h-[460px] w-[320px] px-8 py-10': $device.isDesktop
            }"
          >
            <div>
              <NuxtImg
                :src="layoutData.cardList[0].imgLink"
                class="mx-auto w-fit"
                :class="{
                  'h-20': $device.isTablet,
                  'h-30': $device.isDesktop
                }"
                :alt="layoutData.cardList[0].titleTxt"
              />
              <h2
                class="mt-8 line-clamp-2 w-full"
                :class="{
                  'subhead-3-b': $device.isTablet,
                  'display-2-b': $device.isDesktop
                }"
                :style="setTextColor(layoutData.cardList[0].titleColor)"
              >
                {{ layoutData.cardList[0].titleTxt }}
              </h2>
              <h3
                class="mt-2 line-clamp-3 w-full whitespace-pre"
                :class="{
                  'body-1-r': $device.isTablet,
                  'body-2-r': $device.isDesktop
                }"
                :style="setTextColor(layoutData.cardList[0].bodyColor)"
              >
                {{ layoutData.cardList[0].bodyTxt }}
              </h3>
            </div>

            <button
              :class="{
                'subhead-2-b btn-h48-r99-fill-wfull': $device.isTablet,
                'subhead-3-b btn-h64-r99-fill-wfull': $device.isDesktop
              }"
              :style="setBgTextColor(layoutData.cardList[0])"
              @click="() => move(layoutData.cardList[0])"
            >
              {{ layoutData.cardList[0].buttonTxt }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// PC버전에서 좌측 부분에 들어가는 컴포넌트입니다.
// layoutData 로부터 데이터를 받아옵니다.
// logo, title, body, cardList로 구성되어있습니다.
// cardList 갯수가 1개일때와 여러개일때로 나뉩니다.
// SSA에서 해당 값을 변경할 수 있습니다.
import layoutData from '../../../assets/data/layout/layoutData.json'

const router = useRouter()

const move = async (layoutBanner) => {
  // amplitude.track('topbanner_click', { bannerid : layoutBanner.hcId });
  switch (layoutBanner.actType) {
    case 'evpl':
      router.push(`/event/pl/${layoutBanner.actData}`)
      break
    case 'ourl':
      await navigateTo(layoutBanner.actData, { external: true })
      break
    case 'menu':
      switch (layoutBanner.actData) {
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
      const queryList = layoutBanner.actData.split('::')
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
      const queryList2 = layoutBanner.actData.split('::')
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

const setTextColor = (colorCode) => {
  return {
    color: `#${colorCode}`
  }
}

const setBgColor = (colorCode) => {
  return {
    backgroundColor: `#${colorCode}`
  }
}

const setBgTextColor = (layoutBanner) => {
  return {
    color: `#${layoutBanner.buttonTxtColor}`,
    backgroundColor: `#${layoutBanner.buttonBgColor}`
  }
}
</script>

<style>
.leftpart-swiper > .swiper > .swiper-pagination {
  position: absolute;
  bottom: -25px !important;
  width: 320px;
  text-align: center;
  display: block;
}

@media (max-width: 1279px) {
  .leftpart-swiper > .swiper > .swiper-pagination {
    width: 320px;
  }
}

.leftpart-swiper > .swiper > .swiper-pagination > .swiper-pagination-bullet {
  background: rgba(256, 256, 256, 0.4) !important;
  opacity: 0.4 !important;
  margin: auto 4px !important;
  flex: none !important;
}

.leftpart-swiper > .swiper > .swiper-pagination > .swiper-pagination-bullet-fill {
  background: rgba(256, 256, 256, 1) !important;
  opacity: 1 !important;
  margin: auto 4px !important;
  flex: none !important;
}
</style>
