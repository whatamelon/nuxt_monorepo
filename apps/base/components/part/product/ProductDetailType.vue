<template>
  <ClientOnly>
    <div v-if="detailType.imgLink != ''" class="w-full p-10" :style="{ backgroundColor: props.detailType.backgroundColor }">
      <img :src="detailType.imgLink" class="w-full" />
      <p class="subhead-3-b mt-6" :style="{ color: props.detailType.bodyColor }">
        {{ detailType.body }}
      </p>

      <div v-if="detailType.list.length > 0" class="mt-10 w-full space-y-8">
        <div v-for="(li, index) in detailType.list" :key="index">
          <div class="flex space-x-1">
            <div v-html="li.icon"></div>
            <p class="subhead-3-b my-auto text-black">{{ li.title }}</p>
          </div>
          <p class="body-1-r mt-1 text-black">{{ li.body }}</p>
        </div>
      </div>

      <p v-if="detailType.isCaution == true" class="body-1-r mt-2" :style="{ color: props.detailType.cautionColor }">{{ detailType.cautionText }}</p>
    </div>

    <div v-if="detailType.addInfo == true" class="w-full bg-rgray-950 p-10">
      <img v-if="detailType.addInfoImg != ''" :src="detailType.addInfoImg" class="mb-8 w-full" />
      <div class="mb-4 flex space-x-1">
        <i class="rb-info text-24xl text-white"></i>
        <p class="subhead-3-b my-auto text-white">{{ detailType.addInfoTitle }}</p>
      </div>

      <div class="space-y-2">
        <p v-for="(text, index) in detailType.addInfoTextList" :key="index" class="body-1-r text-rgray-200">{{ text }}</p>
      </div>

      <div v-if="detailType.addInfoIsInvoice == true" class="mt-4 w-full">
        <div class="body-1-r flex space-x-4 text-white">
          <p>유선문의</p>
          <p>02-522-1352</p>
        </div>
        <button class="btn-h40-r0-line-p24-gray mt-4 border-rgray-800 text-white" @click="openChannelTalk">채팅 문의하기</button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
// 상품상세페이지에서 상품유형을 보여주는 컴포넌트입니다.
// 모든 정보는 DB로 부터 받아옵니다.
// 해당 컴포넌트에 대한 추가,삭제,수정사항은 전부 DB로 해결가능합니다.
import { showMessenger } from '@channel.io/channel-web-sdk-loader'

const props = defineProps({
  detailType: {
    type: Object,
    required: true,
    default() {
      return {
        imgLink: '',
        body: '',
        bodyColor: '',
        cautionText: '',
        cautionColor: '',
        backgroundColor: '',
        isCaution: false,
        list: [],
        addInfo: false,
        addInfoTitle: '',
        addInfoTextList: [],
        addInfoIsInvoice: false,
        addInfoImg: ''
      }
    }
  }
})

const openChannelTalk = () => {
  showMessenger()
}
</script>
