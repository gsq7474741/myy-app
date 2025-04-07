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
        :src="getCardImage()"
        mode="aspectFit"
        class="rounded size-20 bg-gray-100/70"
      />
      <view class="flex-1 flex flex-col">
        <text class="font-semibold text-base mb-1">{{ data.type }}</text>
        <text v-if="data.dev_id > 0" class="text-sm text-gray-400">设备ID：{{ data.dev_id }}</text>
        <text class="text-sm text-gray-400">下单时间：{{ orderCreateTime }}</text>
        <text v-if="data.completion_time" class="text-sm text-gray-400">完成时间：{{ formatTime(data.completion_time) }}</text>
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
import { ORDER_STATUS_INFO } from "@/config";

// 导入服务类型对应的图片
import ConsultImg from "@/assets/images/consult.png";
import WorkOrderImg from "@/assets/images/workorder.png";
import WateringImg from "@/assets/images/watering.png";
import DefaultImg from "@/assets/images/test.png";

const props = defineProps<{ data: OrderListItem }>();

// 根据服务类型获取对应图片
const getServiceImage = (type: number) => {
  switch (type) {
    case 0: return ConsultImg; // 问诊
    case 1: return WorkOrderImg; // 工单
    case 2: return WateringImg; // 浇水
    default: return DefaultImg;
  }
};

// 获取卡片显示的图片
const getCardImage = () => {
  // 如果是问诊或工单，且有用户上传的图片，显示第一张图片
  if ((props.data.maintenance_categories === 0 || props.data.maintenance_categories === 1) && 
      props.data.user_images && 
      props.data.user_images.length > 0) {
    return props.data.user_images[0];
  }
  
  // 否则显示默认服务类型图片
  return getServiceImage(props.data.maintenance_categories);
};

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  try {
    const date = new Date(timeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    return timeStr;
  }
};

// 订单状态
const orderStatus = computed(() => {
  if (!props.data.status) return ORDER_STATUS_INFO.inprogress;
  return ORDER_STATUS_INFO[props.data.status];
});

// 创建时间
const orderCreateTime = computed(() => formatTime(props.data.create_time));

// 点击卡片跳转到详情页
const onCardClick = () => {
  Taro.navigateTo({ url: `/pages/me/order/detail?id=${props.data.id}` });
};
</script>

<style scoped></style>
