<template>
  <view
    class="bg-white rounded-lg border border-gray-200 border-solid shadow-sm shadow-gray-300/10"
  >
    <view
      class="py-2 px-3 border-b border-gray-200 border-solid flex justify-between items-center"
    >
      <text class="text-xs text-gray-500">订单编号：{{ data.id }}</text>
      <text class="text-sm" :class="orderStatus.class">
        {{ orderStatus.label }}
      </text>
    </view>
    <view
      class="py-2 px-2 border-b border-gray-200 border-solid flex gap-3"
      @click="onCardClick"
    >
      <image
        :src="TestImg"
        mode="aspectFit"
        class="rounded size-160 bg-gray-100/70"
      />
      <view class="flex-1 flex flex-col">
        <text class="font-semibold text-base mb-1">{{ data.type }}</text>
        <text class="text-sm text-gray-400">服务苗木：{{ tree?.name }}</text>
        <text class="text-sm text-gray-400"
          >下单时间：{{ orderCreateTime }}</text
        >
      </view>
    </view>
    <!-- <view v-if="footerVisible" class="py-2 px-3 flex justify-end">
      <AtButton
        v-if="cancelVisible"
        size="small"
        :full="false"
        class="w-min m-0 text-gray-400"
        >取消</AtButton
      >
    </view> -->
  </view>
</template>

<script setup lang="ts">
// import { AtButton } from "taro-ui-vue3";
import Taro from "@tarojs/taro";
import TestImg from "@/assets/images/test.png";
const props = defineProps<{ data: OrderListItem }>();

const courtyardStore = useCourtyardStore();
const tree = computed(() => courtyardStore.getTree(props.data.id));
const orderStatus = computed(() => ORDER_STATUS_INFO[props.data.status]);
const orderCreateTime = computed(() =>
  timestampToDateString(props.data.createTime)
);
// const cancelVisible = computed(() => props.data.status === "pending");
// const footerVisible = computed(() => cancelVisible.value);
const onCardClick = () => {
  Taro.navigateTo({ url: `/pages/me/order/detail?id=${props.data.id}` });
};
</script>

<style scoped></style>
