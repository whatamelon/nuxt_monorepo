<template>
  <NuxtImg id="right-side-tip" :src="layoutData.rightSideImage" class="fixed right-0 top-1/2 h-40 w-12 cursor-pointer" style="transform: translateY(-50%)" alt="자주묻는 질문(FAQ)" @click="goToFaq" />
</template>

<script setup>
// PC버전에서 우측에 중간에 붙이는 이미지 입니다. LeftPart와 마찬가지로 getLayoutObject로 부터 데이터를 받아옵니다.
// SSA에서 해당 값을 변경할 수 있습니다.
import layoutData from '../../../assets/data/layout/layoutData.json'
import headData from '../../../assets/data/layout/headData.json'

const goToFaq = async () => {
  await navigateTo(headData.brandMetadata.faqUrl, {
    external: true,
    open: {
      target: '_blank'
    }
  })
}
</script>
