<template>
  <FeatAddressListDialog order-mode title="배송지" />
</template>

<script setup>
// 배송지 리스트 페이지

onMounted(() => {
  appStore().setHeaderType({
    back: false,
    logo: false,
    title: '배송지 변경',
    home: false,
    search: false,
    cart: false,
    close: true,
    backRoute: ''
  })
})
</script>
