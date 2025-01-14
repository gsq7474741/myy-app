<template>
  <view class="size-full bg-gray-100">
    <CardEmpty v-if="isEmpty" />
    <view v-else class="h-full p-4 flex flex-col gap-2 overflow-auto">
      <CardCard v-for="item in data" :key="item.id" :data="item"></CardCard>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{ data: CardListItem[] }>();

const isEmpty = computed(() => props.data.length === 0);
</script>

<style scoped></style>
