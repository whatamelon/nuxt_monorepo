<template>
  <button v-if="isShow" class="fixed bottom-[152px] right-2 md:bottom-[92px] md:right-5" type="button" @click="goToSales">
    <NuxtImg v-if="viewport.match('desktop') || viewport.match('tablet')" class="drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" width="56px" height="56px" src="/images/sale_floating_img.png" />
    <NuxtImg v-else class="drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" width="44px" height="44px" src="/images/sale_floating_img.png" />
  </button>
</template>

<script setup>
import * as amplitude from '@amplitude/analytics-browser'

const viewport = useViewport()
const route = useRoute()

const isShow = computed(() => {
  if (route.fullPath === '/sell' || route.fullPath === '/product_list' || route.fullPath === '/my/product/favor' || route.fullPath === '/my/product/recent') return true
  return false
})

const goToSales = () => {
  if (route.fullPath === '/sell') {
    amplitude.track('sell_floatingEvent_click')
  } else if (route.fullPath === '/product_list') {
    amplitude.track('itemlist_floatingEvent_click')
  } else if (route.fullPath === '/my/product/favor') {
    amplitude.track('wishlist_floatingEvent_click')
  } else if (route.fullPath === '/my/product/recent') {
    amplitude.track('recentlist_floatingEvent_click')
  }
  return navigateTo('/event/pl/425')
}
</script>
