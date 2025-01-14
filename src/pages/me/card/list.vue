<template>
  <Layout>
    <AtTabs
      class="card-list__tabs"
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
        <CardList :data="item.list"></CardList>
      </AtTabsPane>
    </AtTabs>
  </Layout>
</template>

<script setup lang="ts">
import { AtTabs, AtTabsPane } from "taro-ui-vue3";

const cardStore = useCardStore();
const currentTab = ref(0);

const cardListAll = computed(() => cardStore.cardList);
const cardListPending = computed(() =>
  cardStore.cardList.filter((card) => card.status === "pending")
);
const cardListCompleted = computed(() =>
  cardStore.cardList.filter((card) => card.status === "completed")
);
const cardListCancelled = computed(() =>
  cardStore.cardList.filter((card) => card.status === "cancelled")
);

type TabList = {
  title: string;
  status: OrderStatus | "all";
  list: MaybeRefOrGetter<CardListItem[]>;
}[];
const tabList = ref([
  { title: "全部卡券", status: "all", list: cardListAll },
  { title: "待使用", status: "pending", list: cardListPending },
  { title: "已使用", status: "completed", list: cardListCompleted },
  { title: "已过期", status: "cancelled", list: cardListCancelled },
] satisfies TabList);

const handleClick = (index: number) => {
  currentTab.value = index;
};
</script>

<style lang="less">
.card-list__tabs {
  .at-tabs__body {
    height: 100%;
  }
}
</style>
