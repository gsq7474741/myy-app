<script lang="ts" setup>
import Taro from "@tarojs/taro";
import UnknownUserIcon from "../../assets/images/unknown-user.png";
defineOptions({ inheritAttrs: true });
type QuickEntry = {
  id: string;
  icon: string;
  label: string;
  operation: () => void;
};

const menuList = [
  { type: "1", label: "客服热线" },
  { type: "2", label: "隐私政策" },
  { type: "3", label: "用户协议" },
];

const quickEntries: QuickEntry[] = [
  {
    id: useId(),
    icon: "i-lets-icons-order",
    label: "我的订单",
    operation: () => {
      Taro.navigateTo({ url: "/pages/me/order/list" });
    },
  },
  {
    id: useId(),
    icon: "i-lets-icons-credit-card",
    label: "我的卡券",
    operation: () => {
      Taro.navigateTo({ url: "/pages/me/card/list" });
    },
  },
];
</script>

<template>
  <view>
    <view class="pt-[35px] flex flex-col gap-[12.5px]">
      <view class="flex flex-col items-center gap-[12.5px]">
        <image
          :src="UnknownUserIcon"
          mode="aspectFit"
          class="rounded size-40"
        />
        <text>Hi, 欢迎来到木易养</text>
        <button
          class="rounded-full border-2 border-solid border-gray-600 mt-[25px] w-[325px] p-0"
        >
          手机号快捷登录
        </button>
      </view>
      <view
        class="grid gap-y-[12.5px] mt-[12.5px] grid-cols-[repeat(auto-fill,minmax(25vw,1fr))]"
      >
        <view
          class="flex flex-col items-center text-xs whitespace-nowrap"
          v-for="item in quickEntries"
          :key="item.id"
          @click="item.operation"
        >
          <view :class="cn('size-16 text-gray-900', item.icon)"></view>

          <text class="mt-1">{{ item.label }}</text>
        </view>
      </view>
      <!-- <view class="w-[700px] h-[1px] bg-gray-200 mx-auto"></view> -->
      <!-- <view class="text-base py-[5px] px-[55px]">
      <view v-for="item in menuList" :key="item.type" class="mb-[10px]">{{
        item.label
      }}</view>
    </view> -->
    </view>
  </view>
</template>
