<script lang="ts" setup>
import Taro from "@tarojs/taro";
import Light1Img from "@/assets/images/light-1.png";
import WaterOpen from "@/assets/images/water-open.png";
import WaterClose from "@/assets/images/water-close.png";
import { storeToRefs } from "pinia";
import { formatPH } from "../../utils/format";
import { ref, computed } from "vue";

// 是否处于调试模式
const isDebugModeSeasonBg = ref(true);
const isDebugModeTreeModel = ref(true);

const appStore = useAppStore();
const courtyardStore = useCourtyardStore();
const { currentDevice } = storeToRefs(courtyardStore);
const isWatering = computed({
  get: () => {
    return (currentDevice?.value?.WaterOutletSwitch ?? 0) === 1;
  },
  set: (_) => {
    Taro.showToast({ title: "Demo账号不支持水泵控制", icon: "error" });
  },
});
const onClickBooking = () => {
  // 跳转到预约养护页面
  Taro.navigateTo({ url: "/pages/courtyard/booking" });
};
const goToChat = () => {
  if (appStore.isLogin) {
    Taro.navigateTo({ url: "/pages/chat/index" });
  } else {
    appStore.goToLogin();
  }
};
const test = () => {
  Taro.navigateTo({ url: "/pages/courtyard/camera" });
};

// 获取当前季节
const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 月份从0开始，所以+1
  
  if (month >= 3 && month <= 5) return 'spring'; // 春季：3-5月
  if (month >= 6 && month <= 8) return 'summer'; // 夏季：6-8月
  if (month >= 9 && month <= 11) return 'autumn'; // 秋季：9-11月
  return 'winter'; // 冬季：12-2月
};

// 季节列表
const seasons = ['spring', 'summer', 'autumn', 'winter'];
const seasonNames = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季'
};

const currentSeason = ref(getCurrentSeason());
const showSeasonDebug = ref(false); // 控制调试面板显示

// 切换季节
const changeSeason = (season) => {
  currentSeason.value = season;
};

// 切换调试面板显示
const toggleSeasonDebug = () => {
  showSeasonDebug.value = !showSeasonDebug.value;
};

// 根据季节计算背景样式类
const seasonBgClass = computed(() => {
  return `season-bg-${currentSeason.value}`;
});
</script>
<template>
  <view class="main-content size-full">
    <!-- 季节背景层，覆盖标题栏 -->
    <view :class="['seasonal-background-full', seasonBgClass]"></view>
    
    <CommonNavbar
      :show-back="false"
      class="z-10 relative"
    ></CommonNavbar>
    <view class="relative px-2 size-full flex flex-col items-center gap-4 pt-[56px]">
      <!-- 树模型区域的季节背景层不再需要 -->
      <!-- <view :class="['seasonal-background', seasonBgClass]"></view> -->
      
      <!-- 季节调试按钮，只在调试模式下显示 -->
      <view v-if="isDebugModeSeasonBg" class="season-debug-toggle" @click="toggleSeasonDebug">
        <view class="season-debug-icon">🌍</view>
      </view>
      
      <!-- 季节切换面板，只在调试模式下显示 -->
      <view v-if="isDebugModeSeasonBg && showSeasonDebug" class="season-debug-panel">
        <view class="season-debug-title">季节切换</view>
        <view class="season-debug-buttons">
          <view 
            v-for="season in seasons" 
            :key="season"
            :class="['season-button', currentSeason === season ? 'active' : '']"
            @click="changeSeason(season)"
          >
            {{ seasonNames[season] }}
          </view>
        </view>
      </view>
      
      <GardenFloatStatus class="absolute top-3 left-4"></GardenFloatStatus>
      <view></view>
      <GardenChatBtn
        class="absolute top-3 right-4"
        @click="goToChat"
      ></GardenChatBtn>
      <view class="mt-[30px] relative">
        <GardenTreeModel :debug="isDebugModeTreeModel"></GardenTreeModel>
      </view>
      <view class="bg-white/72 rounded-2xl px-2 py-1.75 w-full">
        <view class="w-full flex justify-between items-center mb-6 pt-1.5">
          <view>
            <button
              class="m-0 bg-green text-white text-base w-25 h-11.25 flex items-center justify-center rounded-xl"
              @click="onClickBooking"
            >
              预约养护
            </button>
          </view>
          <view
            @click="test"
            class="rounded-xl bg-green w-28 h-11.25 flex items-center justify-center"
          >
            <text class="text-white pr-1">拍照看诊</text>
            <view class="size-5 i-myy-camera text-white"></view>
          </view>
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

// 季节调试按钮样式
.season-debug-toggle {
  position: absolute;
  top: 70px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.season-debug-icon {
  font-size: 20px;
}

// 季节切换面板
.season-debug-panel {
  position: absolute;
  top: 115px;
  right: 15px;
  width: 120px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 10px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.season-debug-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
}

.season-debug-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.season-button {
  padding: 6px 0;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  background-color: rgba(240, 240, 240, 0.8);
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  &.active {
    background-color: #4CAF50;
    color: white;
  }
}

// 季节背景样式 - 全屏包括标题栏
.seasonal-background-full {
  position: fixed; // 使用fixed而不是absolute来确保覆盖标题栏
  top: 0;
  left: 0;
  right: 0;
  height: 512px; // 56px标题栏 + 400px树区域
  z-index: 0;
  overflow: hidden;
  pointer-events: none; // 确保不影响交互
}

// 春季背景 - 淡绿色渐变，花瓣飘落效果
.season-bg-spring {
  background: linear-gradient(
    180deg,
    rgba(220, 255, 220, 0.6) 0%,
    rgba(240, 255, 240, 0.4) 100%
  );
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, #ffcce5 4px, transparent 4px),
      radial-gradient(circle at 70% 60%, #ffcce5 3px, transparent 3px),
      radial-gradient(circle at 40% 80%, #ffcce5 5px, transparent 5px),
      radial-gradient(circle at 85% 15%, #ffcce5 2px, transparent 2px),
      radial-gradient(circle at 60% 40%, #ffcce5 3px, transparent 3px);
    background-size: 300px 300px;
    animation: floatPetals 60s linear infinite;
    opacity: 0.5;
  }
  &::after {
    background-position: 150px 150px;
    animation-duration: 90s;
    opacity: 0.3;
  }
}

// 夏季背景 - 蓝色渐变，阳光效果
.season-bg-summer {
  background: linear-gradient(
    180deg,
    rgba(200, 240, 255, 0.6) 0%,
    rgba(230, 250, 255, 0.4) 100%
  );
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 200, 0.8) 10px, transparent 40px),
      radial-gradient(circle at 80% 30%, rgba(255, 255, 200, 0.7) 15px, transparent 50px);
    animation: summerSun 30s ease-in-out infinite alternate;
  }
}

// 秋季背景 - 橙色渐变，落叶效果
.season-bg-autumn {
  background: linear-gradient(
    180deg,
    rgba(255, 230, 200, 0.6) 0%,
    rgba(255, 245, 230, 0.4) 100%
  );
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      radial-gradient(ellipse at 30% 40%, #e9a16c 5px, transparent 5px),
      radial-gradient(ellipse at 70% 70%, #d9814c 6px, transparent 6px),
      radial-gradient(ellipse at 50% 20%, #c97a4c 4px, transparent 4px),
      radial-gradient(ellipse at 20% 80%, #e9a16c 5px, transparent 5px),
      radial-gradient(ellipse at 90% 30%, #d9814c 6px, transparent 6px);
    background-size: 300px 300px;
    animation: fallingLeaves 40s linear infinite;
    opacity: 0.6;
  }
  &::after {
    background-position: 150px 150px;
    animation-duration: 60s;
    opacity: 0.4;
  }
}

// 冬季背景 - 蓝白渐变，雪花效果
.season-bg-winter {
  background: linear-gradient(
    180deg,
    rgba(230, 240, 255, 0.6) 0%,
    rgba(245, 250, 255, 0.4) 100%
  );
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, white 2px, transparent 2px),
      radial-gradient(circle at 70% 60%, white 1px, transparent 1px),
      radial-gradient(circle at 40% 80%, white 3px, transparent 3px),
      radial-gradient(circle at 85% 15%, white 1px, transparent 1px),
      radial-gradient(circle at 60% 40%, white 2px, transparent 2px);
    background-size: 200px 200px;
    animation: snowfall 30s linear infinite;
    opacity: 0.7;
  }
  &::after {
    background-position: 100px 100px;
    animation-duration: 45s;
    opacity: 0.5;
  }
}

// 动画定义
@keyframes floatPetals {
  from { background-position: 0 0; }
  to { background-position: 300px 300px; }
}

@keyframes summerSun {
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 0.5; transform: scale(1); }
}

@keyframes fallingLeaves {
  from { background-position: 0 -100px; }
  to { background-position: 300px 500px; }
}

@keyframes snowfall {
  from { background-position: 0 0; }
  to { background-position: 200px 400px; }
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
.tree-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tree-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
