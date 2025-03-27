<template>
  <view class="flex flex-col items-center justify-center">
    <image :src="ChatLogoImg" class="size-15"></image>
    <view class="text-lg font-bold text-center">嗨！我是小树</view>
    <view class="text-center">探索无尽知识宝库, 每时每刻都精彩</view>
  </view>
  <view class="mt-4">
    <view class="text-gray-400 mb-2">你可以这样问我</view>
    <view class="flex flex-col gap-3">
      <view 
        v-for="(question, index) in presetQuestions" 
        :key="index"
        class="bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
        @click="sendPresetQuestion(question)"
      >
        {{ question }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import ChatLogoImg from "@/assets/images/chat-logo.png";

const chatStore = useChatStore();

// 预设的三个问题
const presetQuestions = [
  "罗汉松应该怎么浇水？",
  "我的树现在怎么样了？",
  "我今天运势怎么样？"
];

// 发送预设问题的函数
const sendPresetQuestion = (question: string) => {
  chatStore.push(question);
};
</script>

<style scoped></style>
