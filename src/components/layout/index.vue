<script lang="ts" setup></script>

<template>
  <view class="w-full h-[100vh] pt-[56px] flex flex-col">
    <CommonNavbar show-back class="bg-white flex-none"></CommonNavbar>
    <view class="flex-1 h-0 relative">
      <slot></slot>
    </view>
  </view>
</template>

<style scoped></style>
