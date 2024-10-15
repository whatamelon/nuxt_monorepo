<template>
  <AppModalBottomSheet :is-open="isOpen" @update-open="close">
    <div class="pb-13 relative h-[420px] w-full px-5 md:max-w-pc">
      <h2 class="headline-b text-black">이미 가입하신<br />이력이 있습니다.</h2>
      <p class="body-1-r mb-10 mt-2 text-rgray-400">아래 정보를 확인하시고 진행해주세요.</p>

      <div v-if="users.length > 0" class="h-[300px] space-y-4 overflow-scroll no-scroll">
        <div v-for="user in users" :key="user.relayId" class="border-b border-rgray-100 pb-4">
          <div class="flex justify-between">
            <p v-if="user.snsType == 'email'" class="subhead-2-b text-black">이메일로 가입</p>
            <p v-else class="subhead-2-b text-black">카카오 계정으로 가입</p>

            <p class="body-1-r text-rgray-400">{{ formatDateKR(user.createdAt) }}</p>
          </div>

          <p v-if="user.snsType == 'email'" class="subhead-2-b text-black">{{ user.relayId }}</p>
        </div>
      </div>
    </div>

    <div v-if="JOIN_TYPE == 'email' && users.findIndex((e) => e.snsType == 'email') > -1" class="fixed bottom-0 w-full bg-white px-5 py-2 md:max-w-pc">
      <button class="btn-h56-r28-fill-wfull bg-rgray-50 text-black" @click="goLogin">로그인하기</button>
    </div>
    <div v-else class="fixed bottom-0 flex w-full space-x-2 bg-white px-5 py-2 md:max-w-pc">
      <button class="btn-h56-r28-fill-wfull bg-rgray-50 text-black" @click="goJoin">계속 진행하기</button>
      <button class="btn-h56-r28-fill-wfull" @click="goLogin">로그인하기</button>
    </div>
  </AppModalBottomSheet>
</template>

<script setup>
// 가입이력이 있는 회원정보를 리스팅하는 바텀시트 다이얼로그 입니다.
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  users: {
    type: Array,
    required: true
  }
})

const JOIN_TYPE = useCookie('JOIN_TYPE')

const emit = defineEmits(['close', 'goLogin', 'continueJoin'])

const goJoin = () => {
  emit('continueJoin')
}

const goLogin = () => {
  emit('goLogin')
}

const close = () => {
  emit('close')
}
</script>
