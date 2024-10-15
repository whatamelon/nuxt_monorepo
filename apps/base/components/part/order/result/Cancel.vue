<template>
  <div class="bg-white px-5 py-5">
    <IconError></IconError>

    <h2 class="display-1-b mt-10 text-center text-black">결제를 취소했습니다.<br />주문진행을 원하시면<br />구매페이지로 이동해주세요.</h2>

    <button class="btn-h60-r30-fill-wfull mt-15" @click="goToCheckout">구매페이지로 이동</button>

    <p class="body-1-r mt-16 text-center text-rgray-600">지속적으로 결제가 이루어지지 않는 경우<br />아래 고객센터로 문의주세요.</p>
    <div class="mt-2 flex justify-center">
      <p class="subhead-2-b text-black">02-522-1352</p>
      <i class="rb-arrow-right text-base"></i>
    </div>
  </div>
</template>

<script setup>
// 주문완료 페이지에서 사용자가 결제를 취소한 경우에 띄워주는 컴포넌트입니다.
const router = useRouter()
const goToCheckout = () => {
  router.replace('/order/checkout')
}
</script>
