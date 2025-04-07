<template>
  <view class="flex flex-col h-full camera-box">
    <CommonNavbar
      :show-back="true"
      class="static flex-none text-black"
      right-text="提交"
      :right-handler="onClickRightHandler"
    ></CommonNavbar>
    <view class="flex-1 h-0 overflow-auto bg-gradient-to-b from-green-50 to-white">
      <view class="px-5 py-6">
        <!-- 问题描述区域 -->
        <view class="mb-4">
          <view class="flex items-center mb-3">
            <view class="w-1 h-5 bg-green-500 rounded-full mr-2"></view>
            <text class="text-lg font-bold text-gray-800">疑难杂症</text>
          </view>
          <view class="p-4 bg-white rounded-xl shadow-sm mb-4 border border-gray-100">
            <textarea
              v-model="inputValue"
              :focus="isInputFocused"
              class="bg-transparent w-full h-full chat-input-box text-base leading-[1.75] box-border"
              :auto-height="true"
              :auto-focusd="true"
              placeholder="请您描述您的问题，越详细越好"
              :maxlength="-1"
              :disabled="isSubmitting || hasResult"
            />
          </view>
        </view>
        
        <!-- 图片上传区域 -->
        <input type="file" class="hidden" id="camera-input" />
        <view class="mb-6">
          <view class="flex items-center mb-3">
            <view class="w-1 h-5 bg-green-500 rounded-full mr-2"></view>
            <text class="text-base font-medium text-gray-800">上传图片</text>
            <text class="text-xs text-gray-500 ml-2">(最多7张)</text>
          </view>
          <view class="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3">
            <view
              v-if="!hasResult && images.length < 7"
              class="flex items-center justify-center size-[90px] bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-400 transition-colors"
              @click="onUploadFile"
            >
              <view class="flex flex-col items-center">
                <view class="size-10 i-myy-camera text-gray-400"></view>
                <text class="text-xs text-gray-500 mt-1">点击上传</text>
              </view>
            </view>
            <view
              v-for="(image, index) in images"
              :key="image.path"
              class="relative flex items-center justify-center size-[90px] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <image
                :src="image.path"
                class="size-full object-cover"
                mode="aspectFill"
                @click="previewImage(index)"
              ></image>
              <view 
                v-if="!hasResult"
                class="absolute -top-1 -right-1 size-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-red-600 transition-colors"
                @click.stop="removeImage(index)"
              >×</view>
            </view>
          </view>
        </view>
        
        <!-- 加载状态 -->
        <view v-if="isSubmitting" class="my-8 flex flex-col items-center">
          <AtActivityIndicator :size="36" mode="center" color="#10b981"></AtActivityIndicator>
          <text class="mt-3 text-gray-600 font-medium">正在分析您的问题...</text>
          <text class="mt-1 text-xs text-gray-500">请稍等片刻</text>
        </view>
        
        <!-- 结果显示区域 -->
        <template v-if="hasResult && !isSubmitting">
          <view class="mb-4 mt-6">
            <view class="flex items-center mb-3">
              <view class="w-1 h-5 bg-green-500 rounded-full mr-2"></view>
              <text class="text-lg font-bold text-gray-800">疑难解答</text>
            </view>
            <view class="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <text class="text-base leading-relaxed text-gray-700">{{ modelResponse }}</text>
            </view>
          </view>
          
          <!-- 满意度反馈 -->
          <view class="mt-8 mb-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <text class="font-medium text-gray-700 block mb-4">这个回答解决了您的问题吗？</text>
            <view class="flex justify-center gap-4">
              <view>
                <button
                  class="m-0 bg-green text-white text-base w-32 h-11 flex items-center justify-center rounded-xl"
                  @click="handleSatisfied"
                  :disabled="isCreatingWorkOrder"
                >
                <view class="size-5 i-myy-check-circle text-white"></view>
                  <text class="text-white pr-1 pl-1">已解决</text>
                </button>
              </view>
              <view>
                <button
                  class="m-0 bg-white text-gray-700 text-base w-32 h-11 flex items-center justify-center rounded-xl border border-gray-200"
                  @click="handleUnsatisfied"
                  :disabled="isCreatingWorkOrder"
                >
                  <text class="pr-1 pl-1">未解决</text>
                  <view class="size-5 i-myy-file-text"></view>
                  <view v-if="isCreatingWorkOrder" class="ml-2 size-4 i-myy-load animate-spin animate-duration-500"></view>
                </button>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
    
    <!-- 提示弹窗 -->
    <AtToast 
      :isOpened="toast.isOpen" 
      :text="toast.text" 
      :status="toast.status"
      :duration="2000"
      :iconSize="15"
      @close="closeToast"
    ></AtToast>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { AtButton, AtActivityIndicator, AtToast } from "taro-ui-vue3";
import { getApiUrl } from "@/api";

const appStore = useAppStore();
const courtyardStore = useCourtyardStore();
const orderStore = useOrderStore();

// 状态变量
const hasResult = ref(false);
const inputValue = ref("");
const images = reactive<Taro.chooseImage.ImageFile[]>([]);
const isSubmitting = ref(false);
const isInputFocused = ref(true);
const modelResponse = ref("");
const consultationId = ref<number | null>(null); // 存储问诊订单ID
const isCreatingWorkOrder = ref(false);

// 提示信息
const toast = reactive({
  isOpen: false,
  text: "",
  status: "" as "" | "success" | "error" | "loading",
});

// 显示提示信息
const showToast = (text: string, status: "" | "success" | "error" | "loading" = "") => {
  toast.isOpen = true;
  toast.text = text;
  toast.status = status;
  
  // 如果是分析完成的提示，使用无图标模式
  if (text === "分析完成" && status === "success") {
    toast.status = "";
  }
};

// 关闭提示信息
const closeToast = () => {
  toast.isOpen = false;
};

// 上传图片
const onUploadFile = () => {
  if (isSubmitting.value) return;
  
  Taro.chooseImage({
    count: 7 - images.length,
    imageId: "camera-input",
    success: (res) => {
      images.push(...res.tempFiles);
      images.splice(7, 100);
    },
  });
};

// 移除图片
const removeImage = (index: number) => {
  if (isSubmitting.value) return;
  images.splice(index, 1);
};

// 预览图片
const previewImage = (index: number) => {
  const urls = images.map(img => img.path);
  Taro.previewImage({
    current: images[index].path,
    urls
  });
};

// 提交问题
const onClickRightHandler = async () => {
  if (hasResult.value) return;
  
  if (inputValue.value.trim() === "" && images.length === 0) {
    showToast("请您描述您的问题或上传图片", "error");
    return;
  }
  
  if (!appStore.isLogin) {
    showToast("请先登录", "error");
    return;
  }
  
  // 开始提交
  isSubmitting.value = true;
  
  try {
    // 准备上传数据
    // 注意：表单数据的准备将在下面根据不同平台分别处理
    
    // 在小程序环境下，需要使用 uploadFile 方法来上传文件
    let res;
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      // 小程序环境下，需要先上传图片，再提交表单
      const uploadPromises = [];
      const uploadedImages = [];
      
      // 先上传所有图片
      for (const image of images) {
        const uploadPromise = Taro.uploadFile({
          url: getApiUrl("upload/image"), // 假设有这个上传图片的接口
          filePath: image.path,
          name: 'file',
          header: {
            'Authorization': appStore.userToken,
          },
          formData: {
            'user_id': String(appStore.userInfo?.id || 1)
          }
        }).then(uploadRes => {
          const data = JSON.parse(uploadRes.data);
          if (data.code === 0 && data.data) {
            uploadedImages.push(data.data.url);
          }
          return uploadRes;
        });
        uploadPromises.push(uploadPromise);
      }
      
      // 等待所有图片上传完成
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
      
      // 提交表单数据
      res = await Taro.request({
        url: getApiUrl("users/upload-consultation"),
        method: "POST",
        header: {
          'content-type': 'application/json',
          'Authorization': appStore.userToken,
        },
        data: {
          user_id: appStore.userInfo?.id || 1,
          consultation_description: inputValue.value,
          dev_id: courtyardStore.currentDevice?.id || 0,
          images: uploadedImages
        },
      });
    } else {
      // H5环境下使用 FormData 上传
      // 注意：在H5环境中，我们需要使用XMLHttpRequest来处理multipart/form-data
      // 因为Taro.request在H5环境下可能无法正确处理FormData
      
      // 创建一个Promise来处理XMLHttpRequest
      res = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', getApiUrl("users/upload-consultation"));
        xhr.setRequestHeader('Authorization', appStore.userToken);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({ data: response, statusCode: xhr.status });
            } catch (e) {
              reject(new Error('解析响应失败'));
            }
          } else {
            reject(new Error(`请求失败，状态码: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('网络请求失败'));
        
        // 创建FormData对象
        const formData = new FormData();
        formData.append("user_id", String(appStore.userInfo?.id || 1));
        formData.append("consultation_description", inputValue.value);
        
        // 如果有选择设备，添加设备ID
        if (courtyardStore.currentDevice) {
          formData.append("dev_id", String(courtyardStore.currentDevice.id));
        }
        
        // 添加图片
        for (const image of images) {
          // 在H5环境中，我们可以直接使用File对象
          if (image.originalFileObj) {
            formData.append("images[]", image.originalFileObj);
          }
        }
        
        xhr.send(formData);
      });
    }
    
    // 处理响应
    if (res.data.code === 0) {
      hasResult.value = true;
      modelResponse.value = res.data.data.model_advice || "系统已收到您的问题，但暂时无法提供解答。";
      consultationId.value = res.data.data.id; // 保存问诊ID，用于后续创建工单
      
      // 刷新订单列表
      orderStore.fetchOrderList();
      
      showToast("分析完成", "success");
    } else {
      showToast(res.data.message || "提交失败，请重试", "error");
    }
  } catch (error) {
    console.error("提交问题失败:", error);
    showToast("网络错误，请重试", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// 用户对回答满意
const handleSatisfied = () => {
  showToast("感谢您的反馈", "success");
  setTimeout(() => {
    Taro.navigateBack();
  }, 1500);
};

// 创建人工工单
const createWorkOrder = async () => {
  if (!consultationId.value) {
    showToast("无法创建工单，请重试", "error");
    return;
  }
  
  isCreatingWorkOrder.value = true;
  
  try {
    const res = await Taro.request({
      url: getApiUrl("users/upload-work-order"),
      method: "POST",
      header: {
        'content-type': 'application/json',
        'Authorization': appStore.userToken,
      },
      data: {
        order_id: consultationId.value
      },
    });
    
    if (res.data.code === 0) {
      showToast("工单已创建，我们将尽快处理", "success");
      
      // 刷新订单列表
      orderStore.fetchOrderList();
      
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } else {
      showToast(res.data.message || "创建工单失败", "error");
    }
  } catch (error) {
    console.error("创建工单失败:", error);
    showToast("网络错误，请重试", "error");
  } finally {
    isCreatingWorkOrder.value = false;
  }
};

// 用户对回答不满意，弹出确认框
const handleUnsatisfied = () => {
  Taro.showModal({
    title: '确认提交工单',
    content: '您确认要提交人工线上看诊工单吗？专业人员将会尽快为您解答问题。',
    confirmText: '确认提交',
    cancelText: '取消',
    success: function (res) {
      if (res.confirm) {
        // 用户点击确定，创建工单
        createWorkOrder();
      } else if (res.cancel) {
        // 用户点击取消，不做任何操作
        console.log('用户取消了工单创建');
      }
    }
  });
};

onMounted(() => {
  appStore.goToLogin();
});
</script>

<style>
.camera-box {
  .taro-textarea {
    background: transparent;
    min-height: 8ex;
    font-size: 16px;
    background-color: transparent;
    color: #374151;
    padding: 8px;
    border-radius: 8px;
  }
}

/* 禁用状态的文本域样式 */
textarea:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  color: #4b5563;
}

/* 图片预览样式 */
.image-preview {
  position: relative;
  transition: transform 0.2s ease;
  &:active {
    transform: scale(0.98);
  }
}

/* 自定义按钮样式 */
.navbar-button {
  background-color: #07c160 !important;
  border-color: #07c160 !important;
  box-shadow: 0 2px 4px rgba(7, 193, 96, 0.2) !important;
  font-size: 14px !important;
  height: 36px !important;
  line-height: 36px !important;
  &:hover {
    background-color: #06ad56 !important;
    border-color: #06ad56 !important;
  }
}

.navbar-button-secondary {
  background-color: #f2f2f2 !important;
  border-color: #e0e0e0 !important;
  color: #333333 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  font-size: 14px !important;
  height: 36px !important;
  line-height: 36px !important;
  &:hover {
    border-color: #d0d0d0 !important;
    background-color: #e6e6e6 !important;
  }
}

/* 渐变背景 */
.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.from-green-50 {
  --tw-gradient-from: #f0fdf4 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(240 253 244 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-white {
  --tw-gradient-to: #ffffff var(--tw-gradient-to-position);
}

/* 文本区域样式 */
.chat-input-box:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* 上传按钮样式 */
.border-dashed {
  border-style: dashed;
}

/* 动画效果 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:border-green-400:hover {
  border-color: #34d399;
}

.hover\:bg-red-600:hover {
  background-color: #dc2626;
}
</style>
