<template>
  <div>
    <div class="mx-auto px-5 pb-32 pt-10 text-center">
      <IconError></IconError>

      <h2 class="headline-b mt-20 text-black">품절된 상품입니다.</h2>
      <p class="body-1-r mt-2 text-gray-600">죄송합니다.<br />선택하신 상품은 품절된 상품입니다.</p>

      <button class="btn-h60-r30-fill-wfull mt-20" @click="goToHome">홈으로</button>
    </div>
  </div>
</template>

<script setup>
// 상품상세 페이지 내에서 품절된 상품에 대한 UI입니다.
const goToHome = () => {
  location.href = '/'
}
</script>
