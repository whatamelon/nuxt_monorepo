<template>
  <div id="resaleUsageSection" class="bg-white p-10">
    <p class="caption-2-b text-black">{{ data.contents.tag }}</p>
    <h2 class="display-1-b mt-2 whitespace-pre-line text-black">{{ data.contents.title }}</h2>
    <div v-if="data.contents.isTab" class="my-10 flex space-x-0.5 rounded-3.5xl bg-rgray-100 p-0.5">
      <div
        v-for="tab in data.contents.tabList"
        :key="tab.code"
        class="subhead-3-b flex h-14 w-1/2 justify-center text-center"
        :class="{
          'rounded-3.5xl bg-black text-white': tab.code == selectedTab.code,
          'bg-transparent text-black md:cursor-pointer': tab.code != selectedTab.code
        }"
        @click="() => selectTab(tab)"
      >
        <p class="my-auto">{{ tab.name }}</p>
      </div>
    </div>

    <div v-if="!data.contents.isTab" class="mt-10 space-y-10">
      <div v-for="(step, index) in data.contents.stepList" :key="index">
        <div v-if="step.isImg" class="relative">
          <img :src="step.imgLink" class="w-full" />
          <div class="badge-h28-r0-fill-p12-black absolute bottom-0 left-0">STEP {{ step.step }}</div>
        </div>
        <div v-else class="badge-h28-r0-fill-p12-black">STEP {{ step.step }}</div>

        <p class="subhead-3-b mt-2 text-black">{{ step.title }}</p>
        <p class="body-2-r mt-0.5 text-rgray-600">{{ step.body }}</p>
      </div>
    </div>

    <div v-if="data.contents.isTab" class="space-y-10">
      <div v-for="(step, index) in data.contents.stepList.filter((e) => e.code == selectedTab.code)" :key="index">
        <div v-if="step.isImg" class="relative">
          <img :src="step.imgLink" class="w-full" />
          <div class="badge-h28-r0-fill-p12-black absolute bottom-0 left-0">STEP {{ step.step }}</div>
        </div>
        <div v-else class="badge-h28-r0-fill-p12-black">STEP {{ step.step }}</div>

        <p class="subhead-3-b mt-2 break-keep text-black">{{ step.title }}</p>
        <p class="body-2-r mt-0.5 break-keep text-rgray-600">{{ step.body }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 판매랜딩페이지에서 이용방법 컴포넌트입니다.
// 모든 정보는 DB로부터 받아옵니다.
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const selectedTab = ref(props.data.contents.isTab ? props.data.contents.tabList[0] : {})

const selectTab = (tab) => {
  selectedTab.value = tab
}
</script>
