<template>
  <!-- 사용자 결제 후에, 주문완료페이지로 들어와서 백엔드 훅을 받기까지의 시간텀이 존재합니다. -->
  <!-- 이를 위해 로딩을 넣었습니다. -->

  <div class="mx-auto pt-10 text-center">
    <div class="flex justify-center">
      <AppSpinner></AppSpinner>
    </div>

    <h3 class="display-1-b mt-15 text-black">결제중입니다.</h3>
    <p class="body-2-r mt-4 text-rgray-600">잠시만 기다려 주세요.</p>
  </div>
</template>
