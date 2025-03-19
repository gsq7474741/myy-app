<template>
  <Layout>
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

const hasMessages = computed(() => chatStore.messages.length > 0);

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
</script>

<style scoped></style>
