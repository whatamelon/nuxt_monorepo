<template>
  <div>
    <p class="text-28xl font-bold">I have api connection</p>
    <div class="max-w-pc break-all">
      <div v-if="pending">pending...</div>
      <div v-else-if="error">error... {{ error.statusCode }} : {{ error.message }}</div>
      <div v-else-if="data">
        <div v-for="(item, index) in data.data.content" :key="item.prodId">
          <p>{{ index }}. {{ item.prodId }}</p>
          <p class="ml-5">{{ item.brandSubName }} - {{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'none'
})

const accessToken = useCookie('accessToken')
const refreshToken = useCookie('refreshToken')
const config = useRuntimeConfig()

const page = ref(1)
const { data, pending, error, execute } = await useAsyncData('test-hearts', () =>
  $fetch(`${config.public.baseURL}/v20/products/hearts`, {
    headers: {
      'Brand-Domain': appStore().getDomain,
      Authorization: `Bearer ${accessToken.value}`,
      RefreshToken: `Bearer ${refreshToken.value}`
    },
    params: {
      page: page.value,
      limit: 30
    },
    watch: [page.value]
  })
)
if (error.value != null) {
  useRetryError(error.value.data.statusCode, execute)
} else if (data.value.statusCode === 200) {
  userStore().setGlobalUserInfo(data.value.userSession)
}
</script>
