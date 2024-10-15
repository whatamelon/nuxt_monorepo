<template>
  <div>
    <NuxtLoadingIndicator color="#121212" />
    <NuxtLayout>
      <NuxtPage :keepalive="{ include: 'Alive' }" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { loadScript, boot } from '@channel.io/channel-web-sdk-loader'
import * as amplitude from '@amplitude/analytics-browser'

const config = useRuntimeConfig()

// 채널톡 init
loadScript()
boot({
  pluginKey: config.public.channelIoPluginKey as string
})

// amplitude init
amplitude.init(appStore().getThirdpartyKeys.amplitude)
</script>
