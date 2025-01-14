<template>
  <view class="size-full bg-gray-100">
    <OrderEmpty v-if="isEmpty" />
    <view v-else class="h-full p-4 flex flex-col gap-2 overflow-auto">
      <OrderCard v-for="item in data" :key="item.id" :data="item"></OrderCard>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{ data: OrderListItem[] }>();

const isEmpty = computed(() => props.data.length === 0);
</script>

<style scoped></style>
