<script lang="ts" setup>
import { useBookingStore } from '../../stores/booking';
import { useCourtyardStore } from '../../stores/courtyard';
import type { PropType } from 'vue';

// 获取store
const bookingStore = useBookingStore();
const courtyardStore = useCourtyardStore();

// 定义props
const props = defineProps({
  onSubmit: {
    type: Function as PropType<() => void>,
    default: () => {}
  }
});

// 点击提交按钮
const handleSubmit = () => {
  props.onSubmit();
};
</script>

<template>
  <view class="booking-form">
    <!-- 设备选择 -->
    <view class="form-item">
      <view class="form-label">选择设备</view>
      <view class="form-input">
        <picker 
          mode="selector" 
          :range="courtyardStore.devicesList" 
          range-key="deviceName" 
          @change="e => bookingStore.formData.deviceId = String(courtyardStore.devicesList[e.detail.value].id)"
        >
          <view class="picker-value">
            {{ courtyardStore.devicesList.find(d => String(d.id) === bookingStore.formData.deviceId)?.deviceName || '请选择设备' }}
          </view>
        </picker>
        <view class="picker-arrow">▼</view>
      </view>
    </view>
    
    <!-- 预约日期 -->
    <view class="form-item">
      <view class="form-label">预约日期</view>
      <view class="form-input">
        <picker mode="selector" :range="bookingStore.availableDates" @change="e => bookingStore.formData.date = bookingStore.availableDates[e.detail.value]">
          <view class="picker-value">{{ bookingStore.formData.date || '请选择日期' }}</view>
        </picker>
        <view class="picker-arrow">▼</view>
      </view>
    </view>
    
    <!-- 预约时间 -->
    <view class="form-item">
      <view class="form-label">预约时间</view>
      <view class="form-input">
        <picker mode="selector" :range="bookingStore.availableTimes" @change="e => bookingStore.formData.time = bookingStore.availableTimes[e.detail.value]">
          <view class="picker-value">{{ bookingStore.formData.time || '请选择时间' }}</view>
        </picker>
        <view class="picker-arrow">▼</view>
      </view>
    </view>
    
    <!-- 备注 -->
    <view class="form-item">
      <view class="form-label">备注</view>
      <view class="form-input">
        <textarea v-model="bookingStore.formData.remark" placeholder="请输入备注信息（选填）" maxlength="200" />
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-container">
      <button 
        class="submit-btn" 
        :class="{ 'submit-btn-disabled': !bookingStore.formValid || bookingStore.submitting || !bookingStore.hasDevices }"
        @click="handleSubmit"
        :disabled="!bookingStore.hasDevices || !bookingStore.formValid || bookingStore.submitting"
      >
        {{ bookingStore.submitting ? '提交中...' : '提交预约' }}
      </button>
    </view>
  </view>
</template>

<style lang="less">
.booking-form {
  width: 100%;
}

.form-item {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  position: relative;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  
  input, textarea, .picker-value {
    width: 100%;
    font-size: 14px;
    color: #333;
    border: none;
    background: transparent;
  }
  
  textarea {
    height: 80px;
    line-height: 1.5;
  }
  
  .picker-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 12px;
  }
}

.submit-container {
  padding: 16px 0;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &-disabled {
    background-color: #A5D6A7;
    opacity: 0.8;
  }
}
</style>
