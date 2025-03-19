<template>
  <template v-if="isAiSender">
    <view class="chat-ai-item">
      <view class="flex items-start gap-4">
        <view
          class="flex-none rounded-full border border-[#EAEDF2] border-solid size-10 flex items-center justify-center"
        >
          <image
            :src="ChatLogoImg"
            class="size-8 flex items-center justify-center"
            mode="aspectFit"
          ></image>
        </view>
        <view>
          <view class="bg-transparent rounded-2xl w-fit">
            <text>{{ item.content }}</text>
          </view>
          <view v-if="item.loading" class="flex items-center min-h-9">
            <view
              class="size-4 i-myy-load animate-spin animate-duration-500"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </template>
  <template v-else-if="isUserSender">
    <view class="chat-user-item">
      <view class="bg-[#EFF6FF] rounded-2xl py-2 px-5 w-fit">
        <text>{{ item.content }}</text>
      </view>
    </view>
  </template>
</template>

<script setup lang="ts">
import ChatLogoImg from "@/assets/images/chat-logo.png";
import { AiMessageItem } from "../../stores/chat";

const props = defineProps<{ item: AiMessageItem }>();

const isAiSender = computed(() => props.item.sender === AiMessageSender.myy);
const isUserSender = computed(() => props.item.sender === AiMessageSender.me);
</script>

<style scoped>
.chat-user-item {
  padding-left: 68px;
  display: flex;
  justify-content: flex-end;
}
.chat-ai-item {
  padding-right: 68px;
  display: flex;
  justify-content: flex-start;
}
</style>
