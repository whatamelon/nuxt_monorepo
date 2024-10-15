export const useAsyncApi = async (url, params) => {
  // const accessToken = useCookie('accessToken')
  // const refreshToken = useCookie('refreshToken')

  const config = useRuntimeConfig()

  const opts = {
    key: url,
    method: 'GET',
    lazy: true,

    baseURL: config.public.baseURL,

    async onRequest({ options }) {
      options.headers['Brand-Domain'] = appStore().getDomain ?? 'orm'

      if (url === '/v20/thirdparty/keys') {
        options.headers.Authorization =
          'Bearer eyJ0eXBlIjoiQUNDRVNTX1RPS0VOIiwiYWxnIjoiSFMyNTYifQ.eyJyb2xlcyI6IlRISVJEUEFSVFkiLCJzdWIiOiItMSIsImlhdCI6MTY5OTMyMTI2NCwiZXhwIjoxNzU5MzIxMjA0fQ.myMrzNw9oOxz-yfJR2vJXL4p81Sy9c97vG6RrLK-Rys'
      }
      //  else {
      //   if (accessToken.value) options.headers['Authorization'] = 'Bearer '+ accessToken.value
      //   if (refreshToken.value) options.headers['RefreshToken'] = 'Bearer '+ refreshToken.value
      // }
    }
  }
  opts.params = params

  const { data, pending, error, execute } = await useAsyncData('data', () => $fetch(config.public.baseURL + url), opts)

  return {
    data,
    pending,
    error,
    execute
  }
}
