<script lang="ts" setup>
import Taro from "@tarojs/taro";
import Tree1Img from "@/assets/images/tree-1.png";
import Light1Img from "@/assets/images/light-1.png";
import WaterOpen from "@/assets/images/water-open.png";
import WaterClose from "@/assets/images/water-close.png";
import { storeToRefs } from "pinia";
import { formatPH } from "../../utils/format";

const appStore = useAppStore();
const courtyardStore = useCourtyardStore();
const { currentDevice } = storeToRefs(courtyardStore);
const isWatering = computed({
  get: () => {
    return (currentDevice?.value?.WaterOutletSwitch ?? 0) === 1;
  },
  set: (v) => {
    Taro.showToast({ title: "Demo账号不支持水泵控制", icon: "error" });
  },
});
const onClickBooking = () => {
  Taro.showToast({ title: "Demo账号不支持预约", icon: "error" });
};
const goToChat = () => {
  if (appStore.isLogin) {
    Taro.navigateTo({ url: "/pages/chat/index" });
  } else {
    appStore.goToLogin();
  }
};
</script>
<template>
  <view class="main-content relative size-full pt-[56px]">
    <CommonNavbar
      with-auto-background
      with-auto-foreground
      with-auto-shadow
      :show-back="false"
    ></CommonNavbar>
    <view class="relative px-2 size-full flex flex-col items-center gap-4">
      <GardenFloatStatus class="absolute top-3 left-4"></GardenFloatStatus>
      <GardenChatBtn
        class="absolute top-3 right-4"
        @click="goToChat"
      ></GardenChatBtn>
      <view class="mt-[30px]">
        <image :src="Tree1Img" class="size-auto"></image>
      </view>
      <view class="bg-white/72 rounded-2xl px-2 py-1.75 w-full">
        <view class="w-full flex justify-between items-center mb-6">
          <button
            class="m-0 bg-green text-white text-base w-40 h-11.25 flex items-center justify-center rounded-2xl"
            @click="onClickBooking"
          >
            预约养护
          </button>
          <CommonSwitch
            v-model="isWatering"
            :thumb-image="isWatering ? WaterOpen : WaterClose"
          ></CommonSwitch>
        </view>
        <view class="grid grid-cols-2 gap-2">
          <view
            class="card-1 rounded-2xl h-45 p-4 flex flex-col justify-between gap-5"
          >
            <view>
              <text class="text-sm font-bold text-black/89 block mb-2"
                >空气湿度</text
              >
              <view class="text-blue">
                <text class="text-xl">{{
                  currentDevice?.RelativeHumidity ?? 60
                }}</text
                ><text class="text-xs text-[10px]">%</text>
                <CommonProgress
                  class="mt-2"
                  :value="currentDevice?.RelativeHumidity ?? 60"
                  color="#007AFF"
                  bg-color="#007AFF40"
                ></CommonProgress>
              </view>
            </view>
            <view>
              <text class="text-sm font-bold text-black/89 block mb-2"
                >空气温度</text
              >
              <view class="text-blue">
                <text class="text-xl">{{
                  currentDevice?.CurrentTemperature ?? 23
                }}</text
                ><text class="text-xs text-[10px]">℃</text>
              </view>
            </view>
          </view>
          <view
            class="card-2 rounded-2xl h-45 p-4 flex flex-col justify-between gap-5 relative"
          >
            <image
              :src="Light1Img"
              class="absolute top-3 right-4 size-6.25"
            ></image>
            <view>
              <text class="text-sm font-bold text-black/89 block mb-5.25"
                >环境光照</text
              >
              <view class="text-green">
                <text class="text-xl">6</text
                ><text class="text-xs text-[10px]">H</text
                ><text class="text-xl">12</text
                ><text class="text-xs text-[10px]">M</text>
                <view class="h-[1px] bg-[#4BAF4F40] w-full mt-1.5"></view>
              </view>
            </view>
            <view>
              <text class="text-sm font-bold text-black/89 block mb-2"
                >环境天气</text
              >
              <view class="text-green">
                <text class="text-xl">多云转晴</text>
              </view>
            </view>
          </view>
          <view
            class="card-3 rounded-2xl h-45 p-4 flex justify-between gap-10 col-span-2"
          >
            <view class="flex-1/2 flex flex-col justify-between gap-5 w-full">
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >土壤水分</text
                >
                <view class="text-brown">
                  <text class="text-xl">{{
                    currentDevice?.SoilHumidity ?? 60
                  }}</text
                  ><text class="text-xs text-[10px]">%</text>
                  <CommonProgress
                    class="mt-2"
                    :value="currentDevice?.SoilHumidity ?? 60"
                    color="#A2845E"
                    bg-color="#A2845E33"
                  ></CommonProgress>
                </view>
              </view>
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >土壤温度</text
                >
                <view class="text-brown">
                  <text class="text-xl">{{
                    currentDevice?.SoilTemperature ?? 23
                  }}</text
                  ><text class="text-xs text-[10px]">℃</text>
                </view>
              </view>
            </view>
            <view class="flex-1/2 flex flex-col justify-between gap-5 w-full">
              <view>
                <text class="text-sm font-bold text-black/89 block mb-5.25"
                  >土壤PH值</text
                >
                <view class="text-brown">
                  <text class="text-xl">{{
                    formatPH(currentDevice?.SoilPH ?? 7)
                  }}</text
                  ><text class="text-xs text-[10px]"
                    >({{ currentDevice?.SoilPH ?? 7 }})</text
                  >
                  <view class="h-[1px] bg-brown/40 w-full mt-1.5"></view>
                </view>
              </view>
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >土壤导电率</text
                >
                <view class="text-brown">
                  <text class="text-xl">{{ currentDevice?.SoilEC ?? 60 }}</text
                  ><text class="text-xs text-[10px]">μs/cm℃</text>
                </view>
              </view>
            </view>
          </view>
          <view
            class="card-4 rounded-2xl p-4 flex justify-between gap-10 col-span-2"
          >
            <view class="flex-1/2 flex flex-col justify-between gap-5 w-full">
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >氮</text
                >
                <view class="text-black">
                  <view class="flex items-center justify-between">
                    <view
                      ><text class="text-xl">{{
                        currentDevice?.SoilN ?? 20.6
                      }}</text
                      ><text class="text-xs text-[10px]">%</text></view
                    >
                    <view>
                      <text class="text-[#82BCEF] text-xs">缺乏</text>
                    </view>
                  </view>

                  <CommonProgress
                    class="mt-2"
                    :value="60"
                    color="#007AFF"
                    bg-color="#007AFF40"
                  ></CommonProgress>
                </view>
              </view>
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >钾</text
                >
                <view class="text-black">
                  <view class="flex items-center justify-between">
                    <view
                      ><text class="text-xl">{{
                        currentDevice?.SoilK ?? 20.6
                      }}</text
                      ><text class="text-xs text-[10px]">%</text></view
                    >
                    <view>
                      <text class="text-[#82BCEF] text-xs">缺乏</text>
                    </view>
                  </view>

                  <CommonProgress
                    class="mt-2"
                    :value="60"
                    color="#007AFF"
                    bg-color="#007AFF40"
                  ></CommonProgress>
                </view>
              </view>
            </view>
            <view class="flex-1/2 flex flex-col justify-between gap-5 w-full">
              <view>
                <text class="text-sm font-bold text-black/89 block mb-2"
                  >磷</text
                >
                <view class="text-black">
                  <view class="flex items-center justify-between">
                    <view
                      ><text class="text-xl">{{
                        currentDevice?.SoilP ?? 20.6
                      }}</text
                      ><text class="text-xs text-[10px]">%</text></view
                    >
                    <view>
                      <text class="text-[#82BCEF] text-xs">缺乏</text>
                    </view>
                  </view>

                  <CommonProgress
                    class="mt-2"
                    :value="60"
                    color="#007AFF"
                    bg-color="#007AFF40"
                  ></CommonProgress>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="less">
page {
  height: 100vh;
  background-color: #f5f5f5;
}

.card-1 {
  background: linear-gradient(
    180deg,
    rgba(196, 224, 255, 0.52) 0%,
    rgba(227, 241, 255, 0.52) 50.4%,
    rgba(246, 251, 255, 0.52) 100%
  );
}
.card-2 {
  background: linear-gradient(
    180deg,
    rgba(181, 233, 183, 0.52) 0%,
    rgba(228, 245, 228, 0.52) 50%,
    rgba(240, 250, 240, 0.52) 100%
  );
}
.card-3 {
  background: linear-gradient(
    180deg,
    rgba(237, 214, 184, 0.52) 0%,
    rgba(249, 237, 222, 0.52) 50%,
    rgba(251, 245, 238, 0.52) 100%
  );
}
.card-4 {
  background: linear-gradient(
    180deg,
    rgba(223, 237, 253, 0.52) 0%,
    rgba(238, 246, 253, 0.52) 50%,
    rgba(246, 250, 253, 0.52) 100%
  );
}
</style>
