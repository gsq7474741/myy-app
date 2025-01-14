<script lang="ts" setup>
// defineOptions({});
const props = defineProps<{
  data: GardenEntry[];
}>();
</script>
<script lang="ts">
export default {
  options: { virtualHost: true },
};
</script>
<template>
  <view class="module-entries w-full">
    <view
      v-for="item in data"
      class="common-box"
      :class="`item-${item.display}`"
      :key="item.label"
      :style="{
        gridColumn: `span ${item.colSpan ?? 1}`,
        gridRow: `span ${item.rowSpan ?? 1}`,
      }"
    >
      <view class="icon">
        <view :class="item.icon" class="size-64"></view>
      </view>

      <text>{{ item.label }}</text>
    </view>
  </view>
</template>

<style lang="less" scoped>
.module-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  gap: 24rpx;
  justify-content: space-between;
  font-size: 12px;
  list-style: 1;
  .item-normal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24rpx;
    gap: 8rpx;
  }
  .item-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx;
    gap: 8rpx;
    text {
      font-size: 18px;
    }
  }
}
</style>
