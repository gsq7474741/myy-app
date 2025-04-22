<template>
  <view class="flex flex-col items-center justify-center">
    <image :src="ChatLogoImg" class="size-15"></image>
    <view class="text-lg font-bold text-center">嗨！主人你好</view>
    <view class="text-center">我是小树，你的虚拟树宠。有什么可以帮到主人的吗？</view>
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
  "你的生长习性是什么？",
  "你现在健康状态怎么样？",
  "我今天运势怎么样？",
  "你有哪些文化寓意？"
];

// 发送预设问题的函数
const sendPresetQuestion = (question: string) => {
  chatStore.push(question);
};
</script>

<style scoped></style>
