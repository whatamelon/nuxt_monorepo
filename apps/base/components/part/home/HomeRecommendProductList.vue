<template>
  <div class="px-5 py-10">
    <h2 class="display-1-b text-black">{{ data.contents.title }}</h2>
    <div class="mt-4 grid grid-cols-2 gap-x-0.5 gap-y-6">
      <component :is="appStore().getGlobalProductComponent.type" v-for="(pr, index) in data.data.content" :key="index" :product="pr" :types="'sugg'" :idx="0" :evt-no="0"></component>
    </div>

    <button class="btn-h60-r30-fill-wfull mt-8 bg-rgray-50 text-rgray-800" @click="goToEvent"><span>신상품 더 보기</span> <i class="rb-arrow-right_light ml-0.5 text-24xl leading-22"></i></button>
  </div>
</template>

<script setup>
// 홈 추천상품 리스트 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 홈 기획전 상품리스트 컴포넌트와 다른점은 상품리스트를 SSA에서 정하지 않는다는 점입니다.
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const goToEvent = () => {
  const router = useRouter()
  router.push(`/event/pl/${props.data.componentId}`)
}
</script>
