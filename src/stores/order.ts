import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", () => {
  const orderList = reactive<OrderListItem[]>([
    {
      id: 1,
      pid: 1,
      type: "苗木保养",
      status: "pending",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 2,
      pid: 1,
      type: "苗木保养",
      status: "completed",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 3,
      pid: 1,
      type: "苗木保养",
      status: "cancelled",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 4,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 5,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 6,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 7,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 8,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
    {
      id: 9,
      pid: 1,
      type: "苗木保养",
      status: "inprogress",
      createTime: 1735372243,
      updateTime: 1735372243,
    },
  ]);

  const fetchOrderList = async () => {};
  const fetchOrderDetail = async (orderID: number) => {
    return {
      id: 1,
      pid: 1,
      type: "苗木保养",
      status: "pending",
      createTime: 1735372243,
      updateTime: 1735372243,
      name: "张三",
      phone: "13812345678",
      remark: "无",
    } as OrderDetail;
  };
  return {
    orderList,
    fetchOrderList,
    fetchOrderDetail,
  };
});
