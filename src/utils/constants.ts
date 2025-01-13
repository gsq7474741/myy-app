type OrderStatusInfo = Record<
  OrderStatus,
  {
    label: string;
    class: string;
  }
>;

export const ORDER_STATUS_INFO: OrderStatusInfo = {
  completed: {
    label: "已完成",
    class: "text-green-700",
  },
  cancelled: {
    label: "已取消",
    class: "text-gray-700",
  },
  inprogress: {
    label: "进行中",
    class: "text-blue-700",
  },
  pending: {
    label: "待处理",
    class: "text-red-700",
  },
};
