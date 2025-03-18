<template>
  <view
    :class="cn('h-3 w-full rounded', props.class)"
    :style="{ backgroundColor: bgColor }"
  >
    <view
      class="h-full rounded"
      :style="{ width: `${value}%`, backgroundColor: color }"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { ClassValue } from "@/utils";

const props = defineProps<{
  value: number;
  color: string;
  bgColor: string;
  class?: ClassValue;
}>();
</script>

<style scoped></style>
