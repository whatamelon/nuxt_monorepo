<template>
  <div class="px-5 py-10">
    <h2 class="display-1-b mb-2 text-black">고객리뷰</h2>
    <div class="space-y-4 divide-y divide-rgray-50">
      <FeatReviewItem v-for="reviewItem in data.data.slice(0, data.contents.limit)" :key="reviewItem.reviewId" :review-item="reviewItem"></FeatReviewItem>
    </div>
    <button class="btn-h60-r30-fill-wfull mt-8 bg-rgray-50 text-rgray-800" @click="goToAll"><span>전체보기</span> <i class="rb-arrow-right_light ml-0.5 text-24xl leading-22"></i></button>
  </div>
</template>

<script setup>
// 홈 구매리뷰 컴포넌트입니다.
import * as amplitude from '@amplitude/analytics-browser'

defineProps({
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToAll = () => {
  amplitude.track('review_click', {
    type: 'order'
  })
  router.push('/review_list/buy')
}
</script>
