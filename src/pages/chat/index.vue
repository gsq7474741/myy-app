<template>
  <Layout>
    <!-- 顶部标题栏和新对话按钮 -->
    <view class="header-container px-4 py-3 flex justify-between items-center">
      <view class="flex items-center">
        <text class="text-xl font-bold">小树密语</text>
      </view>
      <view 
        class="new-chat-btn shadow-md"
        @click="startNewChat"
      >
        <text class="text-sm">新对话</text>
      </view>
    </view>
    <view
      :class="
        cn(
          'bga-[#EFF4F6] bg-white h-full w-full flex items-center p-4',
          hasMessages ? 'items-end' : 'items-center justify-center'
        )
      "
    >
      <view :class="cn('flex flex-col w-full gap-6', hasMessages && 'h-full')">
        <scroll-view
          v-if="hasMessages"
          id="historyView"
          class="flex-1 h-0"
          :scroll-y="true"
          :enhanced="true"
        >
          <view class="flex flex-col gap-6">
            <ChatHistory
              v-for="item in chatStore.messages"
              :key="item.time"
              :item="item"
            ></ChatHistory>
          </view>
        </scroll-view>
        <ChatEmpty v-else></ChatEmpty>
        <ChatInput class="flex-shrink-0 flex-grow-0"></ChatInput>
      </view>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
const chatStore = useChatStore();
const appStore = useAppStore();
const hasMessages = computed(() => chatStore.messages.length > 0);

// 开始新对话的方法
const startNewChat = () => {
  chatStore.clearMessages();
  Taro.showToast({ title: '已开始新对话', icon: 'success' });
};

watch(
  () => chatStore.messages,
  () => {
    Taro.createSelectorQuery()
      .select("#historyView")
      .node()
      .exec(([{ node }]) => {
        const height = node.scrollHeight;
        console.log(node, node.scrollTo);
        node.scrollTo({ top: height, behavior: "smooth", animated: true });
      });
  },
  { deep: true }
);

onMounted(() => {
  appStore.goToLogin();
});
</script>

<style scoped>
.header-container {
  width: 100%;
  border-bottom: 1px solid #eee;
  background-color: white;
}

.new-chat-btn {
  background-color: var(--primary-color, #4CAF50);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}
</style>
