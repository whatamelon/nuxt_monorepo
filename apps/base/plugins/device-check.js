export default defineNuxtPlugin((nuxtApp) => {
    // nuxt device 라이브러리에 카카오,인스타그램 인앱웹뷰를 추가하는 로직
    let device = useDevice();
    device.isKakao = device.userAgent.includes('KAKAO') ? true : false;
    device.isInstagram = device.userAgent.includes('INSTAGRAM') ? true : false;
})