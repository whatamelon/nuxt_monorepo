<template>
  <PartProductDetailSizeGuide v-if="appStore().getDomain == 'orm' && prodDTO.subBrandId === '12'" />
  <div class="px-5 pt-10">
    <div v-if="(prodDTO.detailSize.match(/<col /g) || []).length > 3" class="oversizeTable no-scroll" v-html="prodDTO.detailSize"></div>
    <div v-else class="defaultTable" v-html="prodDTO.detailSize"></div>

    <p v-if="prodDTO.srcSpec == 'sr'" class="body-1-r mt-4 text-orange-500">* 이 제품은 수선이력이 있는 제품으로 새 제품과 사이즈가 상이하므로 실측사이즈를 반드시 확인해 주세요.</p>
    <p class="body-1-r mt-4 text-rgray-600">
      * 둘레 사이즈 측정은 상품을 바닥에 펼쳐놓은 상태로 끝선과 끝선을 잰후 x2합니다.<br />* 사이즈 단위는 cm이며, 재는 위치에 따라 약간의 오차가 생길 수 있습니다.
    </p>
  </div>
</template>

<script setup>
// 상품상세페이지 내의 사이즈 컴포넌트입니다.
// html값을 v-html을 통해 랜더링합니다.
// 아래 기재된 css값을 통해 테이블 스타일링을 수행합니다.
defineProps({
  prodDTO: {
    type: Object,
    required: true
  }
})
</script>

<style>
.wrap-table {
  /* margin: 3.2vw auto 0 auto !important; */
  overflow-x: scroll !important;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
}
.wrap-table::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

table > colgroup > col:first-of-type {
  width: 20% !important;
}
table > colgroup > col {
  width: '*';
}

.defaultTable > div > table {
  border: 0 !important;
  margin: 0 auto !important;
  width: 100% !important;
}

.oversizeTable > div > table {
  border: 0 !important;
  margin: 0 auto !important;
  max-width: 150vw !important;
  width: 150% !important;
  overflow-x: scroll !important;
}

th {
  padding: 4vw 0 !important;

  border-top: 1.5pt solid #e7e7e7 !important;
  border-bottom: 1pt solid #e7e7e7 !important;
  border-left: 0 !important;
  border-right: 0 !important;

  font-size: 0.9em !important;
  font-weight: 500 !important;

  color: #000 !important;
  background-color: #ffffff !important;
}

td {
  padding: 4vw 0 !important;

  border-left: 0 !important;
  border-right: 0 !important;

  text-align: center !important;
  font-size: 0.9em !important;

  color: #898989 !important;
}

table > thead > tr > th:first-child {
  position: sticky !important;
  left: 0 !important;
  background-color: #e7e7e7 !important;

  border-left: 1px solid transparent !important;
}

table > tbody > tr > td:first-child {
  position: sticky !important;
  left: 0 !important;
  background-color: #e7e7e7 !important;
  border-left: 1px solid transparent !important;
}

table > thead > tr > th:last-child {
  border-right: 1px solid transparent !important;
}

table > tbody > tr > td:last-child {
  border-right: 1px solid transparent !important;
}

table > tbody > tr:not(:last-child) > td {
  border-top: 1pt solid #e7e7e7 !important;
  border-bottom: 1pt solid #e7e7e7 !important;
}

@media (min-width: 842px) {
  th {
    padding: 1vw 0 !important;
  }
  td {
    padding: 1vw 0 !important;
  }
}
</style>
