<template>
  <view
    class="rounded-full bg-white/35 pl-[10px] py-[5px] pr-[16px] flex items-center justify-center gap-3 shadow-md border border-white/30 transition-all"
  >
    <!-- 设备选择器 -->
    <picker :range="deviceNames" :value="selectedIndex" @change="onDeviceChange">
      <view class="selector-view flex items-center px-2 py-1 mr-2 bg-white/90 rounded-lg">
        <text class="text-[15px] text-green-700 font-bold">{{ deviceNames[selectedIndex] || '请选择设备' }}</text>
        <view class="i-myy-chevron-down ml-1" style="font-size:14px;" />
      </view>
    </picker>
    <!-- 健康状态 -->
    <image class="size-[32px]" :src="iconSrc" />
    <text class="text-[16px] font-bold text-black drop-shadow-sm">{{ healthStatus || '未知' }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCourtyardStore } from "@/stores/courtyard";
import { storeToRefs } from "pinia";

import HealthNormal from "@/assets/icons/health-normal.svg";
import HealthWater from "@/assets/icons/health-water.svg";
import HealthDry from "@/assets/icons/health-dry.svg";
import HealthLight from "@/assets/icons/health-light.svg";
import HealthUnknown from "@/assets/icons/health-unknown.svg";

const courtyardStore = useCourtyardStore();
const { healthStatus, devicesList, currentDevice, currentDeviceIndex } = storeToRefs(courtyardStore);

const selectedIndex = ref(currentDeviceIndex.value || 0);
const deviceNames = computed(() => devicesList.value.map(d => d.deviceName || `设备${d.id}`));

watch(currentDeviceIndex, (idx) => {
  selectedIndex.value = idx;
});
watch(devicesList, (list) => {
  if (list.length > 0) {
    const idx = list.findIndex(d => d.id === currentDevice.value?.id);
    selectedIndex.value = idx !== -1 ? idx : 0;
  }
});

function onDeviceChange(e) {
  const idx = e.detail.value;
  selectedIndex.value = idx;
  courtyardStore.setCurrentDeviceByIndex(idx);
}

// 根据 healthStatus 返回对应 SVG 路径
const iconSrc = computed(() => {
  const st = healthStatus.value;
  if (st === "健康") return HealthNormal;
  if (st === "积水") return HealthWater;
  if (st === "干旱") return HealthDry;
  if (st === "缺光照") return HealthLight;
  return HealthUnknown;
});
</script>

<style scoped>
.selector-view {
  min-width: 80px;
  cursor: pointer;
  user-select: none;
}
</style>


<style scoped></style>
