<template>
  <view class="bg-white rounded-lg shadow-sm shadow-gray-300/10">
    <view class="py-5 px-4 border-b border-gray-200 border-solid flex gap-3">
      <view class="flex-1 flex flex-col">
        <text class="font-semibold text-base mb-1">{{ data.meta.name }}</text>
        <text v-if="data.expiredTime" class="text-sm text-gray-400"
          >过期时间：{{ orderCreateTime }}</text
        >
      </view>
      <view>
        <AtButton
          size="small"
          :full="false"
          class="w-min m-0 text-white bg-primary/90 rounded-3xl"
          >去使用</AtButton
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { AtButton } from "taro-ui-vue3";
const props = defineProps<{ data: CardListItem }>();

const orderCreateTime = computed(() =>
  timestampToDateString(props.data.expiredTime)
);
</script>

<style scoped></style>
