import { defineStore } from "pinia";

export const useCourtyardStore = defineStore("courtyard", () => {
  const treeList = reactive<TreeListItem[]>([
    {
      id: 1,
      name: "测试树木1",
      model: "测试模型1src",
    },
  ]);

  const getTree = (id: number) => {
    return treeList.find((item) => item.id === id);
  };
  return {
    treeList,
    getTree,
  };
});
