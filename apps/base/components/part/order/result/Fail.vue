<template>
  <div class="bg-white px-5 py-5">
    <IconError></IconError>

    <h2 class="display-1-b mt-10 text-center text-black">주문 결제가<br />정상처리 되지 않았습니다.</h2>

    <p v-if="errorMsg" class="body-2-r mt-6 px-4 text-center text-orange-600">{{ errorMsg }}</p>

    <button class="btn-h60-r30-fill-wfull mt-15" @click="goToCheckout">구매페이지로 이동</button>

    <p class="body-1-r mt-16 text-center text-rgray-600">지속적으로 결제가 이루어지지 않는 경우<br />아래 고객센터로 문의주세요.</p>
    <NuxtLink href="tel:025221352" target="_blank" class="mt-2 flex justify-center">
      <p class="subhead-2-b my-auto text-black">02-522-1352</p>
      <i class="rb-arrow-right my-auto text-base"></i>
    </NuxtLink>
  </div>
</template>

<script setup>
// 주문완료 페이지에서 결제가 실패한 경우에 띄워주는 컴포넌트입니다.
// 결제 대행사를 통해 받아온 errorMsg를 함께 보여줍니다.
defineProps({
  errorMsg: {
    type: String,
    required: true
  }
})

const router = useRouter()

const goToCheckout = () => {
  router.push('/order/checkout')
}
</script>
