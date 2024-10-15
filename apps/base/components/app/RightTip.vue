<template>
  <ClientOnly>
    <template #fallback>
      <div></div>
    </template>
    <NuxtImg
      id="right-side-tip"
      :src="getLayoutObject.rightSideImage"
      class="fixed right-0 top-1/2 h-40 w-12 cursor-pointer"
      style="transform: translateY(-50%)"
      alt="자주묻는 질문(FAQ)"
      @click="goToFaq"
    />
  </ClientOnly>
</template>

<script setup>
// PC버전에서 우측에 중간에 붙이는 이미지 입니다. LeftPart와 마찬가지로 getLayoutObject로 부터 데이터를 받아옵니다.
// SSA에서 해당 값을 변경할 수 있습니다.
import { storeToRefs } from 'pinia'

const { getLayoutObject, getHeadObject } = storeToRefs(appStore())

const goToFaq = async () => {
  await navigateTo(getHeadObject.value.brandMetadata.faqUrl, {
    external: true,
    open: {
      target: '_blank'
    }
  })
}
</script>
