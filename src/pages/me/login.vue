<template>
  <view class="flex flex-col h-full main-content">
    <CommonNavbar
      :show-back="true"
      :back="backToHome"
      title="登录"
      class="static flex-none text-white"
    ></CommonNavbar>
    <view
      class="px-4 h-0 flex-1 flex flex-col justify-center items-center gap-6"
    >
      <image :src="ChatLogoImg" class="size-18"></image>
      <view
        class="shadow-md rounded-2xl bg-white bg-op-80 min-w-70 max-w-[80vw] h-80 px-8 py-8 text-lg gap-4 flex flex-col justify-between items-center"
      >
        <view
          class="flex-1 h-0 flex flex-col justify-center items-center gap-4"
        >
          <view
            class="flex items-center gap-4 bg-gray-100 rounded-md py-1 px-2"
          >
            <view class="at-icon at-icon-user text-gray-400"></view>
            <input
              v-model="username"
              type="text"
              placeholder="账号"
              placeholder-class="text-gray-400"
              :disabled="loading"
            />
          </view>
          <view
            class="flex items-center gap-4 bg-gray-100 rounded-md py-1 px-2"
          >
            <view class="at-icon at-icon-lock text-gray-400"></view>
            <input
              v-model="password"
              type="password"
              placeholder="密码"
              placeholder-class="text-gray-400"
              :disabled="loading"
            />
          </view>
        </view>
        <view
          class="flex-none btn rounded-full w-full py-2 text-xl btn-green text-center transition flex justify-center items-center h-10"
          hover-class="none "
          :plan="true"
          @click="onClickLogin"
        >
          <view
            v-if="loading"
            class="size-4 i-myy-load animate-spin animate-duration-500"
          ></view>
          <text v-else>登录</text>
        </view>
      </view>
      <view class="w-full h-20"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import ChatLogoImg from "@/assets/images/chat-logo.png";
import { useAppStore } from "@/stores/app";
import Taro from "@tarojs/taro";

const appStore = useAppStore();

const username = ref("ceshi");
const password = ref("123456");
const loading = ref(false);

const backToHome = () => {
  Taro.navigateTo({ url: "/pages/courtyard/index-v2" });
};

const onClickLogin = async () => {
  if (username.value.trim() === "" || password.value.trim() === "") {
    Taro.showToast({
      title: "请输入账号和密码",
      icon: "error",
    });
    return;
  }
  loading.value = true;
  try {
    await appStore.loginByPassword(username.value, password.value);
  } catch {}
  if (appStore.isLogin) {
    Taro.showToast({
      title: "登录成功",
    });
    backToHome();
  } else {
    Taro.showToast({
      title: "账号错误或密码错误",
      icon: "error",
    });
  }

  loading.value = false;
};
</script>

<style scoped></style>
