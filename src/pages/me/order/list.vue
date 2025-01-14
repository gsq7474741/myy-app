<template>
  <Layout>
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
  </Layout>
</template>

<script setup lang="ts">
import { AtTabs, AtTabsPane } from "taro-ui-vue3";

const orderStore = useOrderStore();
const currentTab = ref(0);

const orderListAll = computed(() => orderStore.orderList);
const orderListPending = computed(() =>
  orderStore.orderList.filter((order) => order.status === "pending")
);
const orderListInProgress = computed(() =>
  orderStore.orderList.filter((order) => order.status === "inprogress")
);
const orderListCompleted = computed(() =>
  orderStore.orderList.filter((order) => order.status === "completed")
);
const orderListCancelled = computed(() =>
  orderStore.orderList.filter((order) => order.status === "cancelled")
);

type TabList = {
  title: string;
  status: OrderStatus | "all";
  list: MaybeRefOrGetter<OrderListItem[]>;
}[];
const tabList = ref([
  { title: "全部订单", status: "all", list: orderListAll },
  { title: "进行中", status: "inprogress", list: orderListInProgress },
  { title: "待处理", status: "pending", list: orderListPending },
  { title: "已完成", status: "completed", list: orderListCompleted },
  { title: "已取消", status: "cancelled", list: orderListCancelled },
] satisfies TabList);

const handleClick = (index: number) => {
  currentTab.value = index;
};
</script>

<style lang="less">
.order-list__tabs {
  .at-tabs__body {
    height: 100%;
  }
}
</style>
