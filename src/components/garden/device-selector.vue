<template>
  <view class="device-selector">
    <picker :range="deviceNames" :value="selectedIndex" @change="onDeviceChange">
      <view class="selector-view">
        <text>{{ deviceNames[selectedIndex] || '请选择设备' }}</text>
        <view class="i-myy-chevron-down ml-2" />
      </view>
    </picker>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useCourtyardStore } from '@/stores/courtyard';
import { storeToRefs } from 'pinia';

const courtyardStore = useCourtyardStore();
const { devicesList, currentDevice } = storeToRefs(courtyardStore);

const selectedIndex = ref(0);

const deviceNames = computed(() => devicesList.value.map(d => d.deviceName || `设备${d.id}`));

watch(devicesList, (list) => {
  // 当前设备变化时自动选中第一个
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
</script>

<style scoped>
.device-selector {
  display: flex;
  align-items: center;
}
.selector-view {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  background: #fff;
  border-radius: 16px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.i-myy-chevron-down {
  font-size: 16px;
}
</style>
