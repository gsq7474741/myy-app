<template>
  <view class="flex flex-col h-full camera-box">
    <CommonNavbar
      :show-back="true"
      class="static flex-none text-black"
      right-text="提交"
      :right-handler="onClickRightHandler"
    ></CommonNavbar>
    <view class="flex-1 h-0 px-4 py-8">
      <view class="mb-3 text-lg font-bold"><text>疑难杂症</text></view>
      <view class="p-2 bg-gray-300 bg-op-20 rounded-lg mb-3">
        <textarea
          v-model="inputValue"
          :focus="true"
          class="bg-transparent w-full h-full chat-input-box text-base leading-[1.75] box-border"
          :auto-height="true"
          :auto-focusd="true"
          placeholder="请您描述您的问题"
          :maxlength="-1"
        />
      </view>
      <input type="file" class="hidden" id="camera-input" />
      <view class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
        <view
          class="flex items-center justify-center size-20 bg-gray-500 bg-opacity-50"
          @click="onUploadFile"
        >
          <view class="size-8 i-myy-camera text-white"></view>
        </view>
        <view
          v-for="image in images"
          :key="image.path"
          class="flex items-center justify-center size-20 bg-white bg-opacity-10 border border-gray-200 border-solid"
        >
          <image
            :src="image.path"
            class="size-full flex items-center justify-center"
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <template v-if="hasResult">
        <view class="mb-3 text-lg font-bold mt-5"><text>疑难解答</text></view>
        <view><text>Demo账户暂不支持解答</text></view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
// import { useCameraH5 } from "../../utils/camera";
import Taro from "@tarojs/taro";

const hasResult = ref(false);
const inputValue = ref("");
const images = reactive<Taro.chooseImage.ImageFile[]>([]);

const onUploadFile = () => {
  Taro.chooseImage({
    count: 7 - images.length,
    imageId: "camera-input",
    success: (res) => {
      images.push(...res.tempFiles);
      images.splice(7, 100);
    },
  });
};

const onClickRightHandler = () => {
  if (inputValue.value.trim() === "" && images.length === 0) {
    Taro.showToast({ title: "请您描述您的问题或上传图片" });
    return;
  }
  hasResult.value = true;

  Taro.showToast({ title: "Demo账户不支持提交AI疑难问询" });
};
</script>

<style>
.camera-box {
  .taro-textarea {
    background: transparent;
    min-height: 6ex;
    font-size: 16px;
    background-color: transparent;
  }
}
</style>
