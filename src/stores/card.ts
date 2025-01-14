import { defineStore } from "pinia";

export const useCardStore = defineStore("card", () => {
  const cardList = reactive<CardListItem[]>([
    {
      id: 1,
      usageTime: 1735372243,
      expiredTime: 1755372243,
      status: "pending",
      meta: { name: "测试券" },
    },
  ]);

  const fetchCardList = async () => {};

  return {
    cardList,
    fetchCardList,
  };
});
