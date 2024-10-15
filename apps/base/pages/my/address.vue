<template>
  <FeatAddressListDialog title="주소지" />
</template>

<script setup>
// 마이페이지 > 배송지리스트
onMounted(() => {
  appStore().setHeaderType({
    back: true,
    logo: false,
    title: '주소지 관리',
    home: false,
    search: true,
    cart: true,
    close: false,
    backRoute: ''
  })
})
</script>
