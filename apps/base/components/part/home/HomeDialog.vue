<template>
  <div v-if="isHomeDialogOpen">
    <div style="z-index: 998" class="fixed top-0 z-40 h-screen w-full bg-black opacity-60 md:max-w-pc" @click="close"></div>
    <div style="z-index: 999" class="fixed bottom-0 z-50 w-full rounded-t-3xl bg-white ios-safe-area md:max-w-pc">
      <div class="aspect-h-3 aspect-w-4 w-full cursor-pointer rounded-t-3xl" @click="() => move(data.contents)">
        <NuxtImg :src="data.contents.imgLink" class="h-full w-full rounded-t-3xl object-cover" alt="홈 다이얼로그 이미지" />
      </div>
      <div class="flex w-full justify-between px-5 py-4">
        <p class="subhead-3-b cursor-pointer text-rgray-300" @click="noMoreToday">오늘 보지 않기</p>
        <p class="subhead-3-b cursor-pointer text-black" @click="close">닫기</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 홈 다이얼로그 컴포넌트 입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// dim과 바텀 다이얼로그로 구성되어있습니다.
// 이미지는 3:4의 비율을 가집니다.
// contentsId를 통해 오늘 보지 않기 기능을 수행합니다.
import { hideChannelButton, showChannelButton } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const isHomeDialogOpen = useHomeDialogOpen()

const close = () => {
  isHomeDialogOpen.value = false
  // homeDialog 가 닫힐 때 홈의 회원가입 유도 말풍선을 노출시킴
  userStore().setShowJoinTooltip(true)
  showChannelButton()
}

const noMoreToday = () => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 1)

  let homeDialogContentsId = useCookie('HOME_DIALOG_CONTENTS_ID')
  homeDialogContentsId = useCookie('HOME_DIALOG_CONTENTS_ID', {
    expires: expirationDate
  })
  homeDialogContentsId.value = props.data.contents.contentsId

  // let tommorow = dayjs().add(1,'day').format();
  // homeDialogInfo = JSON.stringify({
  //     time: tommorow,
  //     id: props.data.contents.contentsId
  // })

  close()
}

const move = async (contentDTO) => {
  noMoreToday()

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

onBeforeMount(() => {
  const homeDialogContentsId = useCookie('HOME_DIALOG_CONTENTS_ID')
  if (!homeDialogContentsId.value) {
    isHomeDialogOpen.value = true
    // 오늘보지않기를 누르지 않고 bottom navi를 통해서 이동 시, index로 다시 진입할때 다시 다이얼로그가 뜬다.
    // 그때 회원가입 유도 말풍선이 바로 뜨지 않도록 setTimeout을 사용하여 0.1초 뒤에 false처리한다.
    setTimeout(() => {
      userStore().setShowJoinTooltip(false)
    }, 100)
    hideChannelButton()
  } else if (props.data.contents.contentsId !== JSON.parse(homeDialogContentsId.value)) {
    isHomeDialogOpen.value = true
    hideChannelButton()
  }
})
</script>
