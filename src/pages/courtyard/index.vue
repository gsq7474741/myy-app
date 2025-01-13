<script lang="ts" setup>
import bannerImg from "@/assets/images/tree.png";

const data = ref({
  temperature: 27.8, // 温度
  humidity: 78.3, // 湿度
  light: 5913, // 光照
  soil: {
    temperature: 18.8,
    humidity: 40.6,
    n: 60.1,
    ka: 60.1,
    p: 60.1,
    ec: 493,
    ph: 4.2,
  }, // 土壤信息
});

const firstLineCardBlocks = [
  {
    name: "temperature",
    label: "温度",
    icon: "i-myy-temperature",
    unit: "°C",
  },
  {
    name: "humidity",
    label: "湿度",
    icon: "i-myy-humidity",
    unit: "%",
  },
  {
    name: "light",
    label: "光照",
    icon: "i-myy-light",
    unit: "lux",
  },
];

const secondLineCardBlocks = {
  soil: {
    name: "soil",
    label: "土壤信息",
    icon: "i-myy-soil",
    unit: "",
  },
};

const alerts = ref(["土壤湿度过低"]);

const entryConfig: GardenEntry[] = [
  // {
  //   label: "苗木管理",
  //   icon: "i-myy-leaf",
  //   route: "/garden/manage",
  //   display: "normal",
  // },
  {
    label: "环境预警",
    icon: "i-myy-alarm",
    route: "/garden/alarm",
    display: "normal",
  },
  {
    label: "预约养护",
    icon: "i-myy-booking",
    route: "/garden/booking",
    display: "normal",
  },
  {
    label: "自动灌溉",
    icon: "i-myy-irrigate",
    route: "/garden/irrigate",
    colSpan: 2,
    display: "row",
  },
];
</script>
<template>
  <view
    class="size-full gap-4 py-5 px-2 flex flex-col justify-center items-center relative"
  >
    <view class="absolute top-30 left-30">
      <view class="text-sm">
        <view :key="1">
          <view class="size-18 rounded-full bg-green inline-block mr-1"></view>
          欣欣向荣
        </view>
        <view :key="2">
          <view class="size-18 rounded-full bg-red inline-block mr-1"></view>
          需喷灌
        </view>
        <view :key="3">
          <view class="size-18 rounded-full bg-red inline-block mr-1"></view>
          需施肥
        </view>
        <view :key="4">
          <view class="size-18 rounded-full bg-red inline-block mr-1"></view>
          需养护
        </view>
      </view>
    </view>
    <view
      class="overflow-hidden flex-1 w-full flex justify-center items-center"
    >
      <image :src="bannerImg" class="size-full" mode="aspectFit"></image>
    </view>

    <view class="w-full grid grid-cols-3 gap-2">
      <view
        v-for="item in firstLineCardBlocks"
        :key="item.name"
        class="myy-shadow__garden--card bg-white p-2 rounded-lg"
      >
        <view class="flex items-center mb-2">
          <view class="size-32 mr-1" :class="item.icon"></view>
          {{ item.label }}
        </view>
        <view class="whitespace-nowrap px-1">
          <text class="font-semibold text-2xl">{{ data[item.name] }}</text>
          <text class="text-sm">{{ item.unit }}</text>
        </view>
      </view>
    </view>

    <view class="w-full grid grid-cols-3 gap-2">
      <view key="soil" class="myy-shadow__garden--card bg-white p-2 rounded-lg">
        <view class="flex items-center mb-2">
          <view
            class="size-32 mr-1"
            :class="secondLineCardBlocks.soil.icon"
          ></view>
          {{ secondLineCardBlocks.soil.label }}
        </view>
        <view class="whitespace-nowrap px-1">
          <view>温度: {{ data.soil.temperature }}℃</view>
          <view>湿度: {{ data.soil.humidity }}%</view>
          <view>PH: {{ data.soil.ph }}</view>
          <view>EC: {{ data.soil.ec }}</view>
        </view>
      </view>

      <view
        key="alert"
        class="myy-shadow__garden--card bg-white p-2 rounded-lg flex flex-col"
      >
        <view class="flex items-center mb-2 flex-none">
          <view class="size-32 mr-1 i-myy-alert"></view>
          预警
        </view>
        <view
          class="whitespace-nowrap px-1 text-3xl font-medium flex-1 flex flex-col justify-center"
        >
          <view>良好</view>
        </view>
      </view>

      <view key="operation" class="w-full flex flex-col gap-2">
        <view
          key="irrigate"
          class="flex-1 myy-shadow__garden--card bg-white p-2 rounded-3xl flex items-center justify-center"
        >
          <view class="i-myy-irrigate size-48"></view>
          <text>自动灌溉</text>
        </view>
        <view
          key="booking"
          class="flex-1 myy-shadow__garden--card bg-white p-2 rounded-3xl flex items-center justify-center"
        >
          <view class="i-myy-booking size-48"></view>
          <text>预约养护</text>
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
</style>
