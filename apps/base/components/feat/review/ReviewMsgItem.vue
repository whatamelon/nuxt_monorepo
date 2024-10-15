<template>
  <div class="flex w-full space-x-2 pt-4">
    <div v-if="reviewItem.imgs != '' && reviewItem.imgs != 'none' && reviewItem.imgs != null" class="relative h-22 w-22" @click="openReviewImgList">
      <nuxt-img :src="reviewItem.imgs.split(',')[0]" fit="cover" class="h-full w-full object-cover" />
      <div class="badge-h22-r0-fill-p8-black absolute left-0 top-0">구매</div>
      <p v-show="reviewItem.imgs.split(',').length > 1" class="label-2-r absolute bottom-1 right-1 rounded-full bg-black bg-opacity-20 px-2 py-0.5 text-white">
        {{ reviewItem.imgs.split(',').length }}
      </p>
    </div>

    <div v-if="reviewItem.imgs != '' && reviewItem.imgs != 'none' && reviewItem.imgs != null" class="inline-block w-[calc(100%-88px)]">
      <div class="mb-1.5 flex h-fit justify-between">
        <div class="flex space-x-1">
          <div class="flex">
            <i v-for="(_, index) in Array(reviewItem.starPoint)" :key="index" class="rb-star text-base text-black"></i>
          </div>
          <p class="body-1-r text-rgray-400">{{ reviewItem.userName }}</p>
        </div>
        <p class="body-1-r text-rgray-400">{{ formatDate(reviewItem.reviewDate) }}</p>
      </div>
      <p class="body-1-r break-words break-keep text-black">{{ reviewItem.msg }}</p>
    </div>

    <div v-else class="inline-block w-full">
      <div class="mb-1.5 flex h-fit justify-between">
        <div class="flex space-x-1">
          <div v-if="reviewItem.reviewType == 'b'" class="badge-h22-r0-fill-p8-black">구매</div>
          <div v-else class="badge-h22-r0-fill-p8-black">판매</div>
          <div class="flex">
            <svg v-for="(_, index) in Array(reviewItem.starPoint)" :key="index" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12.4839L3.64035 15L4.62281 9.90323L1 6.35484L5.91228 5.70968L8 1L10.0877 5.70968L15 6.35484L11.3772 9.90323L12.3596 15L8 12.4839Z" fill="black" />
            </svg>
          </div>
          <p class="body-1-r text-rgray-400">{{ reviewItem.userName }}</p>
        </div>
        <p class="body-1-r text-rgray-400">{{ formatDate(reviewItem.reviewDate) }}</p>
      </div>
      <p class="body-1-r break-words break-keep text-black">{{ reviewItem.msg }}</p>
    </div>
  </div>

  <feat-review-img-swiper
    v-if="reviewItem.imgs != 'none' && reviewItem.imgs != null"
    :review-imgs="reviewItem.imgs.split(',')"
    :is-open="isOpen"
    @close-review-img-list="closeImgList"
  ></feat-review-img-swiper>
</template>

<script setup>
// 리뷰 리스트 페이지에서 띄우는 리뷰 아이템입니다.
// 리뷰 메시지를 단축하지 않고 전부 보여줍니다.
import * as amplitude from '@amplitude/analytics-browser'

const props = defineProps({
  reviewItem: {
    type: Object,
    required: true
  }
})

const isOpen = ref(false)

const openReviewImgList = () => {
  amplitude.track('review_image_click', {
    type: 'order',
    reviewid: props.reviewItem.reviewId
  })

  const elements = document.getElementsByTagName('body')
  Array.from(elements).forEach((body) => {
    body.style.height = '100vh'
  })

  isOpen.value = true
}

const closeImgList = () => {
  isOpen.value = false
  const elements = document.getElementsByTagName('body')
  Array.from(elements).forEach((body) => {
    body.style.height = '100%'
  })
}
</script>
