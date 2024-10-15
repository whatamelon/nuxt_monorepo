<template>
  <ClientOnly>
    <div id="product_detail_grade_section" class="mt-1 w-full p-10" :style="{ backgroundColor: detailGrade.backgroundColor }">
      <h3 class="headline-b text-black">{{ detailGrade.title }}</h3>
      <p class="body-1-r mt-2 text-black">{{ detailGrade.body }}</p>
      <hr class="mt-6 border-black" />

      <div class="space-y-4 divide-y divide-black divide-opacity-10">
        <div v-for="(grade, index) in detailGrade.gradeList" :key="index" class="flex space-x-6 pt-4">
          <div v-html="grade.svg"></div>
          <div class="space-y-1">
            <p class="subhead-2-b text-black">{{ grade.title }}</p>
            <p class="subhead-2-b text-black">{{ grade.subTitle }}</p>
            <div class="space-y-0">
              <p v-for="(txt, txtIdx) in grade.texts" :key="txtIdx" class="body-1-r text-rgray-600">{{ txt }}</p>
            </div>
          </div>
        </div>
      </div>

      <p v-if="detailGrade.isCaution == true" class="body-1-r mt-6 text-black">{{ detailGrade.cautionText }}</p>
    </div>
  </ClientOnly>
</template>

<script setup>
// 상품 상세 정보의 등급 설명에 대한 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 해당 컴포넌트에 대한 추가,삭제,수정사항은 전부 DB로 해결가능합니다.
defineProps({
  detailGrade: {
    type: Object,
    required: true,
    default() {
      return {
        title: '',
        body: '',
        gradeList: [],
        cautionText: '',
        isCaution: true,
        backgroundColor: ''
      }
    }
  }
})
</script>
