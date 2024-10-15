export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      devIP: process.env.IP,
      baseURL: process.env.API_BASE_URL,
      thirdPartyApiToken: process.env.THIRD_PARTY_TOKEN,
      passImpKey: process.env.PASS_IMP_KEY,
      tempBrandDomain: process.env.TEMP_BRAND_DOMAIN,
      tempLms: process.env.TEMP_LMS,
      tossClientKey: process.env.TOSS_CLIENT_KEY,
      env: process.env.ENV,
      channelIoPluginKey: process.env.CHANNEL_IO_PLUGIN_KEY
    }
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        // {
        //   'http-equiv': 'Content-Security-Policy',
        //   content: 'upgrade-insecure-requests'
        // },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui, viewport-fit=cover'
        },
        {
          name: 'author',
          content: 'mmemory'
        },
        {
          hid: 'type',
          name: 'type',
          content: 'website'
        },
        {
          hid: 'format-detection',
          name: 'format-detection',
          property: 'format-detection',
          content: 'telephone=no'
        },
        {
          hid: 'og:locale',
          name: 'og:locale',
          property: 'og:locale',
          content: 'ko_KR'
        },
        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'website'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          as: 'style',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/static/pretendard.min.css'
        },
        // relay-basic icons
        {
          rel: 'stylesheet',
          as: 'style',
          href: 'https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/icon/basic/fonts/relay_basic.eot'
        },
        // {
        //   rel: 'stylesheet',
        //   as: 'style',
        //   href: 'https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/icon/basic/fonts/relay_basic.svg'
        // },
        {
          rel: 'stylesheet',
          as: 'style',
          href: 'https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/icon/basic/fonts/relay_basic.ttf'
        },
        {
          rel: 'stylesheet',
          as: 'style',
          href: 'https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/icon/basic/fonts/relay_basic.woff'
        },
        {
          rel: 'stylesheet',
          as: 'style',
          href: 'https://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay.kr/icon/basic/style.css'
        }
      ],
      // __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          src: '/js/browser.js'
        },
        // {
        //   src: '/js/channelTalk.js'
        // },
        // {
        //   src:'/js/recycle_logo.js'
        // },
        {
          src: '/js/LetThereBeRelay.js'
        },
        {
          hid: 'naver-wcs-log-url',
          src: 'https://wcs.naver.net/wcslog.js',
          type: 'text/javascript'
          // body: true
        },
        {
          src: 'https://cdn.iamport.kr/v1/iamport.js',
          type: 'text/javascript'
        },
        {
          src: 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js',
          integrity: 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4',
          crossorigin: 'anonymous'
        }
      ]
    }
    // keepalive: true
  },
  modules: ['@nuxt/ui', '@nuxtjs/device', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'dayjs-nuxt', '@nuxt/image', 'nuxt-swiper', 'nuxt-viewport', '@artmizu/nuxt-prometheus'],
  // buildModules: ['@nuxtjs/svg'],
  viewport: {
    breakpoints: {
      desktop: 1200,
      tablet: 800,
      mobileWide: 600,
      mobile: 480
    }
  },
  // image:{
  //   providers: {
  //     dataProvider: {
  //       provider: 'http://s3.ap-northeast-2.amazonaws.com/img.the-relay',
  //       options: {}
  //     },
  //     contentProvider: {
  //       provider: 'http://s3.ap-northeast-2.amazonaws.com/saas-img.the-relay',
  //       options: {}
  //     },
  //   }
  // },
  components: {
    global: true,
    dirs: ['~/components']
  },
  imports: {
    dirs: ['./stores', './types']
  },
  pinia: {
    storesDirs: ['./stores/**', './stores/**/**'],
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    }
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  devServer: {
    port: 8070,
    host: `http://${process.env.IP}`
  },
  experimental: {
    componentIslands: true
  }
  // router: {
  //   middleware: ['auth']
  // },
  // routeRules: {
  //   '/product/*': {
  //     ssr: false
  //   }
  // }

  // nitro: {
  //   devProxy: {
  //     host: process.env.IP,
  //   },
  // },
})
