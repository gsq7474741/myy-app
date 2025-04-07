<template>
  <view class="flex flex-col h-full">
    <CommonNavbar
      :show-back="true"
      :back="backToHome"
      title="我的订单"
      class="static flex-none text-black"
    ></CommonNavbar>
    <AtTabs
      class="order-list__tabs"
      :current="currentTab"
      :tabList="tabList"
      :scroll="true"
      @click="handleClick"
    >
      <AtTabsPane
        v-for="(item, index) in tabList"
        :key="index"
        class="h-[calc(100%-80px)]"
        :current="currentTab"
        :index="index"
      >
        <OrderList :data="item.list"></OrderList>
      </AtTabsPane>
    </AtTabs>
    <view v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <AtActivityIndicator :size="32" mode="center"></AtActivityIndicator>
    </view>
  </view>
</template>

<script setup lang="ts">
import { AtTabs, AtTabsPane, AtActivityIndicator } from "taro-ui-vue3";
import Taro from "@tarojs/taro";

const orderStore = useOrderStore();
const currentTab = ref(0);
const isLoading = ref(false);

// 所有订单列表
const orderListAll = computed(() => orderStore.orderList);

// 进行中的订单列表
const orderListInProgress = computed(() =>
  orderStore.orderList.filter((order) => order.status === "inprogress")
);

// 已完成的订单列表
const orderListCompleted = computed(() =>
  orderStore.orderList.filter((order) => order.status === "completed")
);

type TabList = {
  title: string;
  status: OrderStatus | "all";
  list: MaybeRefOrGetter<OrderListItem[]>;
}[];

// 定义标签页列表
const tabList = ref([
  { title: "全部订单", status: "all", list: orderListAll },
  { title: "进行中", status: "inprogress", list: orderListInProgress },
  { title: "已完成", status: "completed", list: orderListCompleted },
] satisfies TabList);

// 处理标签页点击
const handleClick = (index: number) => {
  currentTab.value = index;
};

// 返回我的页面
const backToHome = () => {
  Taro.navigateTo({ url: "/pages/me/index" });
};

// 刷新订单列表
const refreshOrderList = async () => {
  isLoading.value = true;
  try {
    await orderStore.fetchOrderList();
  } catch (error) {
    console.error("刷新订单列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时获取订单列表
onMounted(() => {
  refreshOrderList();
});

// 使用 Taro 的页面生命周期钩子
Taro.useDidShow(() => {
  refreshOrderList();
});
</script>

<style lang="less">
.order-list__tabs {
  .at-tabs__body {
    height: 100%;
  }
}
</style>
