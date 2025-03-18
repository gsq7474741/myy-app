<template>
  <view class="pt-[56px] size-full">
    <CommonNavbar show-back></CommonNavbar>
    <view
      :class="
        cn(
          'bga-[#EFF4F6] bg-white h-full w-full flex items-center p-4',
          hasMessages ? 'items-end' : ''
        )
      "
    >
      <view :class="cn('flex flex-col w-full gap-6')">
        <view class="flex flex-col gap-6">
          <ChatHistory
            v-for="item in chatStore.messages"
            :key="item.time"
            :item="item"
          ></ChatHistory>
        </view>
        <!-- <ChatEmpty></ChatEmpty> -->
        <ChatInput></ChatInput>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const chatStore = useChatStore();

const hasMessages = computed(() => chatStore.messages.length > 0);
</script>

<style scoped></style>
