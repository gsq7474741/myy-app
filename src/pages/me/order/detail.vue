<template>
  <view class="flex flex-col h-full">
    <CommonNavbar
      :show-back="true"
      title="订单详情"
      class="static flex-none text-black"
    ></CommonNavbar>
    <view class="size-full bg-gray-100 p-4">
      <view v-if="isLoading" class="flex items-center justify-center h-full">
        <AtActivityIndicator :size="32" mode="center"></AtActivityIndicator>
      </view>
      <view
        v-else-if="orderDetail"
        class="bg-white pt-4 pb-1 rounded-lg border border-solid border-gray-200/80"
      >
        <view
          class="border-b border-solid border-gray-100 px-4 pb-4 flex justify-between"
        >
          <view>订单编号：{{ orderDetail.id }}</view>
          <view class="text-base" :class="orderStatus.class">{{ 
            orderStatus.label
          }}</view>
        </view>
        <view class="pt-2 pb-1">
          <view v-if="orderDetail.dev_id > 0" class="line px-4 py-2">设备ID：{{ orderDetail.dev_id }}</view>
          <view class="line px-4 py-2">服务类型：{{ orderDetail.type }}</view>
          <view v-if="orderDetail.consultation_description" class="line px-4 py-2">问题描述：{{ orderDetail.consultation_description }}</view>
          <view v-if="orderDetail.model_advice" class="line px-4 py-2">
            <view>系统建议：</view>
            <view class="mt-1 text-sm text-gray-600">{{ orderDetail.model_advice }}</view>
          </view>
          <view v-if="orderDetail.manual_advice" class="line px-4 py-2">
            <view>人工建议：</view>
            <view class="mt-1 text-sm text-gray-600">{{ orderDetail.manual_advice }}</view>
          </view>
          <view class="line px-4 py-2">下单时间：{{ formatTime(orderDetail.create_time) }}</view>
          <view v-if="orderDetail.completion_time" class="line px-4 py-2">完成时间：{{ formatTime(orderDetail.completion_time) }}</view>
          
          <!-- 图片展示区 -->
          <view v-if="orderDetail.user_images && orderDetail.user_images.length > 0" class="line px-4 py-2">
            <view class="mb-2">问题图片：</view>
            <view class="flex flex-wrap gap-2">
              <view 
                v-for="(img, index) in orderDetail.user_images" 
                :key="index"
                class="w-24 h-24 relative rounded overflow-hidden"
                @click="previewImage(img, orderDetail.user_images)"
              >
                <image :src="img" mode="aspectFill" class="w-full h-full" />
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="flex items-center justify-center h-full">
        <text class="text-gray-500">订单信息不存在或已被删除</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { AtActivityIndicator } from "taro-ui-vue3";
import { ORDER_STATUS_INFO } from "@/config";

const orderStore = useOrderStore();
const router = Taro.useRouter();
const orderID = computed(() => parseInt(router.params.id!));
const orderDetail = ref<OrderDetail | null>(null);
const isLoading = ref(true);

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

// 预览图片
const previewImage = (current: string, urls: string[]) => {
  Taro.previewImage({
    current,
    urls
  });
};

// 订单状态
const orderStatus = computed(() => {
  if (!orderDetail.value || !orderDetail.value.status) {
    return ORDER_STATUS_INFO.inprogress;
  }
  return ORDER_STATUS_INFO[orderDetail.value.status];
});

// 获取订单详情
const refresh = async () => {
  isLoading.value = true;
  try {
    const detail = await orderStore.fetchOrderDetail(orderID.value);
    orderDetail.value = detail;
  } catch (error) {
    console.error("获取订单详情失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时获取订单详情
onMounted(() => {
  refresh();
});

// 页面显示时刷新订单详情
Taro.useDidShow(() => {
  refresh();
});
</script>

<style scoped>
.line + .line {
  border-top-width: 1px;
  border-top: 1px solid rgb(243 244 246);
}
</style>
