<template>
  <view
    class="rounded-full bg-white/35 pl-[6px] py-[5px] pr-[10px] flex items-center justify-center gap-[7px] shadow-md border border-white/30 transition-all"
  >
    <image class="size-[32px]" :src="iconSrc" />
    <text class="text-[16px] font-bold text-black drop-shadow-sm">{{ healthStatus || '未知' }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCourtyardStore } from "@/stores/courtyard";
import { storeToRefs } from "pinia";

import HealthNormal from "@/assets/icons/health-normal.svg";
import HealthWater from "@/assets/icons/health-water.svg";
import HealthDry from "@/assets/icons/health-dry.svg";
import HealthLight from "@/assets/icons/health-light.svg";
import HealthUnknown from "@/assets/icons/health-unknown.svg";

const courtyardStore = useCourtyardStore();
const { healthStatus } = storeToRefs(courtyardStore);

// 根据 healthStatus 返回对应 SVG 路径
const iconSrc = computed(() => {
  const st = healthStatus.value;
  if (st === "正常") return HealthNormal;
  if (st === "积水") return HealthWater;
  if (st === "干旱") return HealthDry;
  if (st === "缺光照") return HealthLight;
  return HealthUnknown;
});
</script>

<style scoped></style>
