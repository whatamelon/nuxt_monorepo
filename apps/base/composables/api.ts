/* eslint-disable no-param-reassign */
import type { UseFetchOptions } from 'nuxt/app'
import { userStore } from '~/stores/user'
import { appStore } from '~/stores/app'

export const useApi = async <T>(url: string, method: RestMethod, params?: unknown, keys?: string) => {
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  const opts: UseFetchOptions<UseFetchOptions<T>> = {
    key: keys ?? url,
    method,
    baseURL: config.public.baseURL,

    async onRequest({ options }: { options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> } }) {
      options.headers = useRequestHeaders() || {}
      options.headers['Brand-Domain'] = appStore().getDomain

      if (url === '/v20/thirdparty/keys') {
        options.headers.Authorization = config.public.thirdPartyApiToken
      }
      // else if (url === '/v20/brands/check') {
      // }
      else {
        // if(url == '/v20/reviews/buy' || url == '/v20/reviews/sell') {
        //   options.headers['Content-Type'] = 'multipart/form-data';
        // }

        if (accessToken.value) options.headers.Authorization = `Bearer ${accessToken.value}`
        if (refreshToken.value) options.headers.RefreshToken = `Bearer ${refreshToken.value}`
      }
    },

    async onResponse({ request, response, options }) {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_data"] }] */
      if (response._data.statusCode === 200) {
        if (response._data.userSession) {
          const piniaUserStore = userStore()
          piniaUserStore.setGlobalUserInfo(response._data.userSession)
        }
      }
    },

    async onResponseError({ response }) {
      const reurl = `${config.public.baseURL}/v20/users/signre`
      if (response.url === reurl) {
        const recentRoute = useCookie('RECENT_ROUTE')
        recentRoute.value = route.fullPath
        userStore().setLogout()
        router.push('/login')
      }
    }
  }

  if (params) {
    if (method === 'GET') opts.params = params
    if (method === 'DELETE') opts.params = params
    if (method === 'POST') opts.body = params
    if (method === 'PUT') opts.body = params
    if (method === 'PATCH') opts.body = params
  }

  const response = await useFetch<UseFetchOptions<T>>(url, opts)
  const { data, pending, error, execute } = response

  return {
    data,
    pending,
    error,
    execute
  }
}
