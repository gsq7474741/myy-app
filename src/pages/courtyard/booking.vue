<script lang="ts" setup>
import { onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { useBookingStore } from '../../stores/booking';
import BookingForm from '../../components/booking/form.vue';
import MaintenanceInfo from '../../components/booking/maintenance-info.vue';
import NoDeviceTip from '../../components/booking/no-device-tip.vue';

// 获取store
const appStore = useAppStore();
const bookingStore = useBookingStore();

// 提交表单
const submitForm = async () => {
  const success = await bookingStore.submitBooking();
  if (success) {
    // 跳转回庭院页面
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  }
};

// 页面加载时初始化数据
onMounted(() => {
  appStore.goToLogin();
  bookingStore.initForm();
});
</script>

<template>
  <view class="booking-page relative">
    <CommonNavbar title="预约养护" :show-back="true"></CommonNavbar>
    
    <view class="booking-container">
      <view class="booking-title">填写养护预约信息</view>
      <NoDeviceTip v-if="!bookingStore.hasDevices" />
      
      <view class="form-container">
        <BookingForm :onSubmit="submitForm" />
      </view>
      
      <MaintenanceInfo />
    </view>
  </view>
</template>

<style lang="less">
.booking-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 56px;
}

.booking-container {
  padding: 20px 16px;
}

.booking-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.form-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}
</style>
