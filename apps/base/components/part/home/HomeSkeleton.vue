<template>
  <!-- 홈에서 정보가 로딩되기 이전에 보여주는 스켈레톤 UI입니다. -->

  <div class="w-full">
    <USkeleton class="aspect-h-1 aspect-w-1 w-full animate-pulse" />

    <div class="no-scroll grid w-full grid-cols-4 gap-x-4 gap-y-6 px-5 py-10">
      <USkeleton v-for="idx in [0, 1, 2, 3, 4, 5, 6, 7]" :key="idx" class="h-[72px] w-[72px] animate-pulse" :ui="{ rounded: 'rounded-full' }" />
    </div>

    <div class="w-full px-5">
      <USkeleton class="h-8 w-2/3 animate-pulse" />
      <USkeleton class="mt-4 h-20 w-full animate-pulse" />

      <USkeleton class="mt-8 h-8 w-2/3 animate-pulse" />
      <USkeleton class="mt-4 h-20 w-full animate-pulse" />
    </div>
  </div>
</template>
