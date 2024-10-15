<template>
  <NuxtLink
    v-if="isShow"
    id="floating_gobrand"
    class="fixed bottom-[152px] right-2 z-[996] block transition-all md:bottom-[92px] md:right-5 md:cursor-pointer"
    to="https://www.foretforet.com/index.html"
    :external="true"
    target="_blank"
  >
    <NuxtImg v-if="viewport.match('desktop') || viewport.match('tablet')" class="drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" width="56px" height="56px" src="/icons/etc/greenforet-floating.png" />
    <NuxtImg v-else class="drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" width="44px" height="44px" src="/icons/etc/greenforet-floating.png" />
  </NuxtLink>
</template>

<script setup>
const viewport = useViewport()
const route = useRoute()

const isShow = computed(() => {
  // 메인홈, 상품 리스트, 상품 상세, 판매하기 랜딩에서 노출
  if (route.fullPath === '/sell' || route.fullPath === '/product_list' || route.fullPath === '/' || route.name === 'product-id') return true
  return false
})
</script>
