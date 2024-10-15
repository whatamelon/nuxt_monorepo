<template>
  <div class="px-5 py-10">
    <h2 class="display-1-b text-black">{{ data.contents.title }}</h2>
    <h3 class="body-1-r mb-6 mt-2 text-rgray-400">{{ data.contents.body }}</h3>
    <div class="grid grid-cols-2 gap-x-0.5 gap-y-10">
      <component :is="appStore().getGlobalProductComponent.type" v-for="(pr, index) in data.data.content" :key="index" :product="pr" :types="'md'" :idx="idx" :evt-no="data.componentId"></component>
    </div>

    <button class="btn-h60-r30-fill-wfull mt-8 bg-rgray-50 text-rgray-800" @click="goToEvent"><span>상품 더 보기</span> <i class="rb-arrow-right_light ml-0.5 text-24xl leading-22"></i></button>
  </div>
</template>

<script setup>
// 홈 기획전 상품리스트 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 상품 더보기 상품은 최대 6개까지 리스팅합니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  idx: {
    type: [String, Number],
    required: false
  }
})

const goToEvent = () => {
  amplitude.track('home_md_all', {
    eventid: props.data.componentId
  })
  const router = useRouter()
  router.push(`/event/pl/${props.data.componentId}`)
}
</script>
