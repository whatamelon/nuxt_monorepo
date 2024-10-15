import type { UseFetchOptions, AsyncData } from 'nuxt/app'
import { userStore } from '~/stores/user'
import { appStore } from '~/stores/app'

export const useRetryError = async <T>(statusCode: number, execute: () => Promise<void>) => {
  const route = useRoute()
  const router = useRouter()
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')
  const config = useRuntimeConfig()

  if (statusCode) {
    if (statusCode === 401) {
      const tokenRefreshObj = (await useFetch('/v20/users/signre', {
        method: 'POST',
        baseURL: config.public.baseURL,
        params: {
          accessToken: accessToken.value,
          refreshToken: refreshToken.value
        },
        async onRequest({ options }: { options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> } }) {
          options.headers = useRequestHeaders() || {}
          options.headers['Brand-Domain'] = appStore().getDomain

          if (accessToken.value) options.headers.Authorization = `Bearer ${accessToken.value}`
          if (refreshToken.value) options.headers.RefreshToken = `Bearer ${refreshToken.value}`
        }
      })) as AsyncData<T, unknown>
      if (tokenRefreshObj.error.value != null) {
        appStore().setDialogDTO({
          message: '로그인 해주세요.',
          timeout: 1
        })
        const recentRoute = useCookie('RECENT_ROUTE')
        recentRoute.value = route.fullPath
        userStore().setLogout()
        router.push('/login')
      } else {
        accessToken.value = (tokenRefreshObj.data.value as { data: { accessToken: string; refreshToken: string } }).data.accessToken
        refreshToken.value = (tokenRefreshObj.data.value as { data: { accessToken: string; refreshToken: string } }).data.refreshToken
        execute()
      }
    }
  }
}
