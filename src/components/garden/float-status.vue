<template>
  <view
    class="rounded-full bg-white/35 pl-[6px] py-[5px] pr-[10px] flex items-center justify-center gap-[7px] shadow-md border border-white/30 transition-all"
  >
    <image class="size-[32px]" :src="FaceImg1"></image>
    <text class="text-[16px] font-bold text-white drop-shadow-sm">健康</text>
  </view>
</template>

<script setup lang="ts">
import FaceImg1 from "@/assets/images/face-1.png";
</script>

<style scoped></style>
