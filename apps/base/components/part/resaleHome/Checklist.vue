<template>
  <div class="bg-[#222] px-10 pb-15 pt-10">
    <p class="caption-2-b text-green-300">{{ data.contents.tag }}</p>
    <h2 class="display-2-b mt-4 whitespace-pre-line text-white">{{ data.contents.title }}</h2>

    <ul class="mt-10 list-inside list-disc">
      <li v-for="(item, index) in data.contents.checkList" :key="index" class="body-long-1-r mt-1 list-inside break-keep pl-5 -indent-5 text-rgray-200">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 판매신청하기 체크리스트 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
defineProps({
  data: {
    type: Object,
    default() {
      return {
        tag: 'CHECK!',
        title: '꼭 읽어주세요.',
        checkList: [
          '본 프로그램은 코오롱몰의 회원을 대상으로\n진행됩니다.',
          '판매 신청하신 제품에 대한 보상은 코오롱몰에서 사용하실 수 있는 OLO 포인트로 지급해드립니다.',
          '보상가는 제품의 상태와 생산연도 별로 상이합니다.',
          '검수 완료된 제품의 보상 포인트는 제품의 품목과 생산연도 별로 상이하며 유동적으로 책정됩니다.',
          '기준에 부합하지 않는 제품은 수거된 제품이라도 보상 포인트 지급이 어렵습니다.',
          '판매 신청을 완료하시면 사전에 제시된 보상가에 동의한 것으로 간주합니다.',
          '본 프로그램을 통해 지급된 포인트는 정해진 사용 기간이 있으며, 만료된 이후에는 포인트 원복이\n불가합니다.',
          '프로그램과 관련된 정책에 대해 자주 묻는 질문을 통해 확인하실 수 있습니다.'
        ]
      }
    }
  }
})
</script>
