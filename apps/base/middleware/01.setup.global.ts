import layoutData from '../assets/data/layout/layoutData.json'
import headData from '../assets/data/layout/headData.json'
import thirdpartyData from '../assets/data/layout/thirdpartyData.json'

export default defineNuxtRouteMiddleware(async () => {
  // 고객이 처음으로 해당 사이트에 진입했을때, 사이트 정보, 기본 값들을 여기서 받아옴.

  const nuxtApp = useNuxtApp()

  // console.log('------------------------------------')
  // console.log('|            MIDDLE WARE           |')
  // console.log('------------------------------------')
  // console.log(config.public.baseURL)

  const requestURL = useRequestURL()
  // const config = useRuntimeConfig()

  if (requestURL.pathname === '/hello') {
    return
  }
  // 0. 대용량 버전 test용 @2024-07-01
  // LMS 분기 버전
  // if (requestURL.pathname.startsWith('/test') || config.public.tempLms === 'true') {
  //   return TestSetup()
  // }
  // 1. 고객이 client side로 접속되었는데, 이미 nuxtapp은 준비된경우
  // 이런 경우는 보통 모바일에서 다른 탭으로 갔다가 다시 돌아오는 경우다.
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    await setup(window.location.origin)
  }
  // 2. 첫 진입.
  // 아예 사이트에 처음일 수도 있고 아닐 수도 있지만, 중요한건 캐시나 히스토리가 없어서 어플리케이션 자체적으로 랜더링을 준비하는 경우다.
  else if (process.server && nuxtApp.payload.serverRendered) {
    await setup(requestURL.hostname || '')
  }
  // 3. 도메인이 없는 경우, third party key가 없는 경우
  else if (appStore().getDomain === '' || appStore().getThirdpartyKeys.amplitude === '') {
    await setup(requestURL.hostname || '')
  }
})

async function setup(origin: string) {
  const config = useRuntimeConfig()
  const requestURL = useRequestURL()

  let finalDomain: DomainType = ''

  // devIp가 포함되어있거나, http로 시작하거나, localhost거나, local (Mac 인터넷공유)이 포함되어있는 경우
  if (origin.includes(config.public.devIP) || origin.includes('http://') || origin.includes('local')) {
    finalDomain = config.public.tempBrandDomain as DomainType
  } else if (origin.split('.')[0].includes('dev') || origin.split('.')[0].includes('temp')) {
    finalDomain = origin.replace('https://', '').replace('http://', '').split('.')[0].split('-')[1] as DomainType
  } else {
    finalDomain = origin.replace('https://', '').replace('http://', '').split('.')[0] as DomainType
  }

  // 대용량 버전용
  if (requestURL.pathname.startsWith('/test') || (config.public.tempLms === 'true' && finalDomain === 'orm')) {
    TestSetup()
    return
  }

  appStore().setDomain(finalDomain)

  if (
    appStore().getHeadObject.hostName !== finalDomain ||
    (appStore().getHeadObject.hostName === finalDomain && appStore().getHeadObject.brandMetadata.logo_image === '') ||
    appStore().getThirdpartyKeys.amplitude === ''
  ) {
    await Promise.all([appStore().setThirdpartyKeys(), appStore().setBrandHeads(), appStore().setGlobalProductComponentFactor(finalDomain)])
  }
}

// 대용량 버전 test용 - orm 데이터 static하게 저장 @2024-07-01
async function TestSetup() {
  const finalDomain: DomainType = 'orm'

  appStore().setDomain(finalDomain)
  appStore().setBrandLayoutData(layoutData as unknown as LayoutObjectType)
  appStore().setBrandHeadsData(headData as unknown as HeadObjectType)
  appStore().setThirdPartyKeysData(thirdpartyData as unknown as ThirdpartyKeysType)
  appStore().setGlobalProductComponentFactor(finalDomain)
}
