import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import { useAppStore } from "./app";
import { useCourtyardStore } from "./courtyard";
import { getApiUrl } from "../api";

// 预约表单数据类型
type BookingFormData = {
  deviceId: string;
  date: string;
  time: string;
  remark: string;
};

// 预约响应类型
type BookingResponse = {
  code: number;
  message: string | null;
  data: {
    token: string;
  };
};

export const useBookingStore = defineStore("booking", () => {
  // 表单数据
  const formData = reactive<BookingFormData>({
    deviceId: "",
    date: "",
    time: "",
    remark: "",
  });

  // 表单状态
  const formValid = ref(false);
  const submitting = ref(false);

  // 可选时间段
  const availableTimes = [
    "09:00-11:00",
    "13:00-15:00",
    "15:00-17:00"
  ];

  // 可选日期（未来7天）
  const availableDates = ref<string[]>([]);

  // 依赖的store
  const appStore = useAppStore();
  const courtyardStore = useCourtyardStore();

  // 检查是否有设备
  const hasDevices = computed(() => courtyardStore.devicesList.length > 0);

  // 生成可选日期
  const generateDates = () => {
    const dates: string[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      dates.push(`${year}-${month}-${day}`);
    }
    
    availableDates.value = dates;
    
    // 默认选择第一个日期
    if (dates.length > 0) {
      formData.date = dates[0];
    }
  };

  // 验证表单
  const validateForm = () => {
    const deviceIdValid = formData.deviceId !== '';
    const dateValid = formData.date !== '';
    const timeValid = formData.time !== '';
    
    formValid.value = deviceIdValid && dateValid && timeValid;
  };

  // 重置表单
  const resetForm = () => {
    formData.deviceId = "";
    formData.date = "";
    formData.time = "";
    formData.remark = "";
    formValid.value = false;
    submitting.value = false;
  };

  // 初始化表单
  const initForm = async () => {
    generateDates();
    
    // 默认选择第一个时间段
    if (availableTimes.length > 0) {
      formData.time = availableTimes[0];
    }
    
    // 获取设备列表并设置默认设备
    await fetchDevices();
  };

  // 获取设备列表
  const fetchDevices = async () => {
    if (!appStore.isLogin) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    try {
      await courtyardStore.getDevices();
      // 如果有设备，默认选择第一个
      if (courtyardStore.devicesList.length > 0) {
        formData.deviceId = String(courtyardStore.devicesList[0].id);
      }
      // 验证表单
      validateForm();
    } catch (error) {
      console.error('获取设备列表失败:', error);
      Taro.showToast({
        title: '获取设备列表失败',
        icon: 'none'
      });
    }
  };

  // 提交养护预约
  const submitBooking = async (): Promise<boolean> => {
    if (!formValid.value || submitting.value) return false;
    
    // 检查登录状态
    if (!appStore.isLogin) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      });
      appStore.goToLogin();
      return false;
    }
    
    submitting.value = true;
    
    try {
      // 调用API提交养护预约
      const response = await Taro.request<BookingResponse>({
        url: getApiUrl('users/maintenance-appointment'),
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': appStore.userToken
        },
        data: {
          user_id: String(appStore.userId),
          dev_id: formData.deviceId,
          maintenance_categories: 1
        }
      });
      
      if (response.statusCode === 200 && response.data.code === 0) {
        Taro.showToast({
          title: '预约成功',
          icon: 'success'
        });
        
        resetForm();
        return true;
      } else {
        throw new Error(response.data.message || '提交失败');
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      Taro.showToast({
        title: (error as Error).message || '提交失败，请重试',
        icon: 'none'
      });
      return false;
    } finally {
      submitting.value = false;
    }
  };

  // 监听表单变化
  watch(() => ({ ...formData }), () => {
    validateForm();
  });

  return {
    formData,
    formValid,
    submitting,
    availableTimes,
    availableDates,
    hasDevices,
    generateDates,
    validateForm,
    resetForm,
    initForm,
    fetchDevices,
    submitBooking
  };
});
