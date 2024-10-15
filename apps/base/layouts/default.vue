<template>
  <div id="container" class="mx-auto flex w-full min-w-[280px] bg-[#011C1F]">
    <div v-if="viewport.match('desktop')" class="relative h-screen w-1/2">
      <template v-if="config.public.tempLms === 'true' && appStore().getDomain === 'orm'">
        <!-- LMS 분기 버전 -->
        <AppTestLeftPart />
      </template>
      <template v-else>
        <AppLeftPart />
      </template>
    </div>
    <div class="mx-auto min-h-screen w-full bg-white pt-14 shadow md:relative md:max-w-[375px] xl:mx-0">
      <AppHeader></AppHeader>
      <div id="main_wrapper" class="bg-white md:max-w-pc">
        <slot />
        <!-- <AppFloatingSale v-if="appStore().getDomain === 'orm'" /> -->
        <AppFloatingGoBrand v-if="appStore().getDomain === 'greenforet'" />
      </div>
      <AppBottomNavigation />
      <template v-if="config.public.tempLms === 'true' && appStore().getDomain === 'orm'">
        <!-- LMS 분기 버전 -->
        <LazyAppTestFooter />
      </template>
      <template v-else>
        <LazyAppFooter />
      </template>
    </div>
    <div v-if="viewport.match('desktop') || viewport.match('tablet')">
      <template v-if="config.public.tempLms === 'true' && appStore().getDomain === 'orm'">
        <!-- LMS 분기 버전 -->
        <AppTestRightTip />
      </template>
      <template v-else>
        <AppRightTip />
      </template>
    </div>
  </div>

  <AppNotificationBasic></AppNotificationBasic>
</template>

<script setup>
// nuxt-viewport 라이브러리 사용중입니다.
// 각 viewPort 사이즈에 맞춰서 보여지는 컴포넌트가 달라집니다.
import { storeToRefs } from 'pinia'

const { getThirdpartyKeys, getHeadObject, getLayoutObject } = storeToRefs(appStore())

const config = useRuntimeConfig()
const viewport = useViewport()

useHead({
  title: `${getHeadObject.value.brandMetadata.title}`,
  // titleTemplate: `%s - ${process.env.title}`,
  meta: [
    {
      name: 'color-scheme',
      content: 'light-only'
    },
    {
      name: 'supported-color-schemes',
      content: 'light'
    },
    {
      hid: 'og:title',
      name: 'og:title',
      property: 'og:title',
      content: `${getHeadObject.value.brandMetadata.title}`
    },
    {
      hid: 'description',
      name: 'description',
      content: `${getHeadObject.value.brandMetadata.description}`
    },
    {
      hid: 'og:description',
      name: 'og:description',
      property: 'og:description',
      content: `${getHeadObject.value.brandMetadata.description}`
    },
    {
      hid: 'keywords',
      name: 'keywords',
      property: 'keywords',
      content: `${getHeadObject.value.brandMetadata.keywords}`
    },
    {
      hid: 'og:keywords',
      name: 'og:keywords',
      property: 'og:keywords',
      content: `${getHeadObject.value.brandMetadata.keywords}`
    },
    {
      hid: 'og:image',
      name: 'og:image',
      property: 'og:image',
      content: `${getHeadObject.value.brandMetadata.og_image}`
    },
    {
      hid: 'url',
      name: 'url',
      content: `${getHeadObject.value.brandMetadata.url}`
    },
    {
      hid: 'og:url',
      name: 'og:url',
      property: 'og:url',
      content: `${getHeadObject.value.brandMetadata.url}`
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      property: 'og:site_name',
      content: `${getHeadObject.value.brandMetadata.siteName}`
    },
    {
      name: 'app-mobile-web-app-title',
      content: `${getHeadObject.value.brandMetadata.siteName}`
    },
    {
      name: 'application-name',
      content: `${getHeadObject.value.brandMetadata.siteName}`
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${getHeadObject.value.brandMetadata.url}`
    },
    { rel: 'icon', type: 'image/png', href: `${getHeadObject.value.brandMetadata.favicon}` },
    {
      rel: 'stylesheet',
      href: `${getHeadObject.value.brandMetadata.globalCssLink}`
    }
  ],
  script: [
    {
      hid: 'light-mode-script',
      innerHTML: `
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            `,
      type: 'text/javascript',
      charset: 'utf-8'
    },
    {
      hid: 'naver-wcs-script',
      innerHTML: `
                if (!wcs_add) var wcs_add={};
                wcs_add["wa"] = "${getThirdpartyKeys.value.naver}";
                if (!_nasa) var _nasa={};
                if(window.wcs){
                wcs.inflow();
                wcs_do(_nasa);
                }

            `,
      type: 'text/javascript',
      charset: 'utf-8',
      body: true
    },
    {
      hid: 'facebook-script',
      innerHTML: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/ko_KR/fbevents.js');
              fbq('init', "${getThirdpartyKeys.value.facebook}");
              fbq('track', 'PageView');
            `,
      type: 'text/javascript',
      charset: 'utf-8'
    }
    // {
    //   hid: 'amplitude-script',
    //   innerHTML: `
    //         !function(){"use strict";!function(e,t){var n=e.amplitude||{_q:[],_iq:{}};if(n.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var r=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,n){return function(r){e._q.push({name:t,args:Array.prototype.slice.call(n,0),resolve:r})}},o=function(e,t,n){e[t]=function(){if(n)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<y.length;t++)o(e,y[t],!1);for(var n=0;n<g.length;n++)o(e,g[n],!0)};n.invoked=!0;var a=t.createElement("script");a.type="text/javascript",a.integrity="sha384-TPZhteUkZj8CAyBx+GZZytBdkuKnhKsSKcCoVCq0QSteWf/Kw5Kb9oVFUROLE1l3",a.crossOrigin="anonymous",a.async=!0,a.src="https://cdn.amplitude.com/libs/analytics-browser-1.9.1-min.js.gz",a.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var c=t.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c);for(var u=function(){return this._q=[],this},l=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],p=0;p<l.length;p++)r(u,l[p]);n.Identify=u;for(var d=function(){return this._q=[],this},f=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],v=0;v<f.length;v++)r(d,f[v]);n.Revenue=d;var y=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset"],g=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(n),n.createInstance=function(e){return n._iq[e]={_q:[]},i(n._iq[e]),n._iq[e]},e.amplitude=n}}(window,document)}();
    //         amplitude.init("${getThirdpartyKeys.value.amplitude}");
    //         `,
    //   type: 'text/javascript',
    //   charset: 'utf-8'
    // }
  ]
})

onMounted(() => {
  const container = document.getElementById('container')
  container.style.backgroundColor = `#${getLayoutObject.value.bgColor}`

  Kakao.init('7a5f8cb4a3e0d3caf221976a7084906a')
})
</script>

<style>
.swiper {
  overflow-y: visible !important;
}
</style>
