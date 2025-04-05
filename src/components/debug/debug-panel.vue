<template>
  <view v-if="isDebugEnabled" class="debug-panel">
    <view class="debug-panel-header" @click="togglePanel">
      <text class="debug-panel-title">调试面板</text>
      <text class="debug-panel-toggle">{{ isExpanded ? '收起' : '展开' }}</text>
    </view>
    <view v-if="isExpanded" class="debug-panel-content">
      <view class="debug-item">
        <text class="debug-item-label">季节背景调试</text>
        <switch 
          :checked="isRef(debugConfig.seasonBgDebug) ? debugConfig.seasonBgDebug.value : debugConfig.seasonBgDebug" 
          @change="debugConfig.toggleDebug('seasonBg')" 
          color="#4CAF50"
        />
      </view>
      <view class="debug-item">
        <text class="debug-item-label">树模型调试</text>
        <switch 
          :checked="isRef(debugConfig.treeModelDebug) ? debugConfig.treeModelDebug.value : debugConfig.treeModelDebug" 
          @change="debugConfig.toggleDebug('treeModel')" 
          color="#4CAF50"
        />
      </view>
      <view class="debug-info">
        <text class="debug-info-text">环境: {{ envName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, isRef } from 'vue';
import { debugConfig, isDebugEnabled } from '../../config/debug';

// 获取当前环境名称
const envName = process.env.NODE_ENV || '未知';

const isExpanded = ref(false);

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss">
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  overflow: hidden;
}

.debug-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.debug-panel-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.debug-panel-toggle {
  font-size: 12px;
  color: #666;
}

.debug-panel-content {
  padding: 10px 15px;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.debug-item-label {
  font-size: 14px;
  color: #333;
}

.debug-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.debug-info-text {
  font-size: 12px;
  color: #666;
}
</style>
