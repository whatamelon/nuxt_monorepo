<template>
  <div class="px-10 pb-15 pt-10" :style="{ backgroundColor: data.contents.bgColor }">
    <p class="caption-2-b text-[#BBF7D0]">{{ data.contents.tag }}</p>
    <h2 class="display-1-b mt-1 whitespace-pre-line text-white">{{ title }}</h2>
    <hr class="mt-6 border border-white" />
    <div class="space-y-4 divide-y divide-rgray-50">
      <FeatReviewResaleReviewItem v-for="(reviewItem, index) in data.data.reviewList" :key="index" :review-item="reviewItem"></FeatReviewResaleReviewItem>
    </div>
    <button class="btn-h52-r0-line-wfull mt-3 mt-6 border-white text-white" @click="goToAll">고객리뷰 전체보기</button>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 판매리뷰리스트 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const title = computed(() => {
  return formatWonNoBlank(props.data.data.totalCount) + props.data.contents.title
})

const goToAll = () => {
  amplitude.track('review_click', {
    type: 'sell'
  })
  router.push('/review_list/sell')
}
</script>
