<script lang="ts" setup>
// 无需props或状态，纯展示组件
</script>

<template>
  <view class="maintenance-info">
    <view class="info-title">养护说明</view>
    <view class="info-item">
      <view class="info-dot"></view>
      <view class="info-text">我们将安排专业园艺师为您的苗木提供养护服务</view>
    </view>
    <view class="info-item">
      <view class="info-dot"></view>
      <view class="info-text">养护服务包括水肥管理、病虫害防治、修剪整形等</view>
    </view>
    <view class="info-item">
      <view class="info-dot"></view>
      <view class="info-text">预约成功后，我们将与您电话确认具体时间</view>
    </view>
  </view>
</template>

<style lang="less">
.maintenance-info {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  
  .info-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 8px;
    align-items: flex-start;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .info-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #4CAF50;
    margin-top: 8px;
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  .info-text {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}
</style>
