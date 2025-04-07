import { defineStore } from "pinia";
import Taro from "@tarojs/taro";

// 维护类别映射表
const MAINTENANCE_CATEGORY_MAP = {
  0: "问诊",
  1: "工单",
  2: "浇水",
};

export const useOrderStore = defineStore("order", () => {
  const orderList = ref<OrderListItem[]>([]);
  const appStore = useAppStore();

  // 处理订单状态
  const processOrderStatus = (order: OrderListItem): OrderListItem => {
    const result = { ...order };
    // 根据 is_completion 判断订单状态
    result.status = order.is_completion === 1 ? "completed" : "inprogress";
    // 根据 maintenance_categories 判断订单类型
    result.type = MAINTENANCE_CATEGORY_MAP[order.maintenance_categories as keyof typeof MAINTENANCE_CATEGORY_MAP] || "未知服务";
    return result;
  };

  // 获取订单列表
  const fetchOrderList = async () => {
    if (!appStore.isLogin) {
      return;
    }

    try {
      const res = await Taro.request({
        url: getApiUrl("users/check-orders"),
        method: "GET",
        header: {
          Authorization: `${appStore.userToken}`,
        },
        data: {
          user_id: appStore.userInfo?.id || 1,
        },
      });

      if (res.data.code === 0 && Array.isArray(res.data.data)) {
        // 处理每个订单的状态
        orderList.value = res.data.data.map(processOrderStatus);
      } else {
        console.error("获取订单列表失败:", res.data.message);
      }
    } catch (error) {
      console.error("获取订单列表出错:", error);
    }
  };

  // 获取订单详情
  const fetchOrderDetail = async (orderID: number): Promise<OrderDetail | null> => {
    if (!appStore.isLogin) {
      return null;
    }

    // 先从列表中查找
    const orderItem = orderList.value.find(item => item.id === orderID);
    if (orderItem) {
      return processOrderStatus(orderItem) as OrderDetail;
    }

    // 如果列表中没有，可以考虑单独请求订单详情接口
    // 目前接口文档中没有提供单独的订单详情接口，所以这里返回 null
    return null;
  };

  // 初始化时获取订单列表
  onMounted(() => {
    fetchOrderList();
  });

  return {
    orderList,
    fetchOrderList,
    fetchOrderDetail,
  };
});
