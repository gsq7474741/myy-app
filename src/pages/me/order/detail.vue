<template>
  <Layout>
    <view class="size-full bg-gray-100 p-4">
      <view
        v-if="orderDetail"
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
        <view
          class="pt-2 pb-1 [&>view]:px-4 [&>view]:py-2 [&>view+view]:border-t [&>view+view]:border-solid [&>view+view]:border-gray-100"
        >
          <view>服务产品：{{ treeInfo.name }}</view>
          <view>服务类型：{{ orderDetail.type }}</view>
          <view>联系称呼：{{ orderDetail.name }}</view>
          <view>联系电话：{{ orderDetail.phone }}</view>
          <view v-if="orderDetail.remark">备注：{{ orderDetail.remark }}</view>
          <view
            >下单时间：{{ timestampToDateString(orderDetail.createTime) }}</view
          >
          <view
            >更新时间：{{ timestampToDateString(orderDetail.updateTime) }}</view
          >
        </view>
      </view>
    </view>
  </Layout>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";

const orderStore = useOrderStore();
const courtyardStore = useCourtyardStore();
const router = Taro.useRouter();
const orderID = computed(() => parseInt(router.params.id!));
const orderDetail = ref<OrderDetail | null>(null);
const treeInfo = computed(
  () =>
    (orderDetail.value
      ? courtyardStore.getTree(orderDetail.value.pid)
      : {}) as TreeListItem
);
const refresh = async () => {
  orderDetail.value = await orderStore.fetchOrderDetail(orderID.value);
};
const orderStatus = computed(() =>
  orderDetail.value
    ? ORDER_STATUS_INFO[orderDetail.value.status]
    : ({} as (typeof ORDER_STATUS_INFO)["pending"])
);
onMounted(() => {
  refresh();
});
</script>
