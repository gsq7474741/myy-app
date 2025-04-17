import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import { useCameraH5 } from "../utils/camera";
import { getApiUrl } from "../api";
import { useAppStore } from "./app";

type WeatherInfo = {
  location: string;
  temperature: string;
  condition: string;
  lastUpdate: string;
};

type DeviceInfo = {
  CurrentTemperature: number;
  LightLux: number;
  RelativeHumidity: number;
  SoilEC: number;
  SoilHumidity: number;
  SoilK: number;
  SoilN: number;
  SoilP: number;
  SoilPH: number;
  SoilTemperature: number;
  WaterOutletSwitch: number;
  createTime: string;
  deviceName: string;
  id: number;
  time: string;
  updateTime: string;
};
export const useCourtyardStore = defineStore("courtyard", () => {
  const treeList = reactive<TreeListItem[]>([
    {
      id: 1,
      name: "测试树木1",
      model: "测试模型1src",
    },
  ]);
  const devicesList = ref<DeviceInfo[]>([]);
  const currentDevice = computed(() => devicesList.value?.[0]);
  
  // 天气信息
  const weatherInfo = ref<WeatherInfo | null>(null);
  const isLoadingWeather = ref(false);
  const getTree = (id: number) => {
    return treeList.find((item) => item.id === id);
  };
  const appStore = useAppStore();

  const getDevices = () => {
    console.count("getDevices");
    if (!appStore.isLogin) {
      return;
    }
    Taro.request({
      url: getApiUrl("users/get-mydev"),
      method: "GET",
      header: {
        Authorization: `${appStore.userToken}`,
      },
      data: {
        user_id: 1,
      },
      success: (res) => {
        devicesList.value = res.data.data;
      },
    });
  };

  // 获取天气信息
  const getWeather = (location: string = "深圳") => {
    if (!appStore.isLogin) {
      return;
    }
    isLoadingWeather.value = true;
    Taro.request({
      url: getApiUrl("users/get-weather"),
      method: "GET",
      header: {
        Authorization: `${appStore.userToken}`,
      },
      data: {
        location,
      },
      success: (res) => {
        if (res.data.code === 0) {
          weatherInfo.value = res.data.data;
        } else {
          console.error("获取天气信息失败", res.data.message);
        }
      },
      fail: (err) => {
        console.error("获取天气信息请求失败", err);
      },
      complete: () => {
        isLoadingWeather.value = false;
      }
    });
  };

  // 初始化数据
  const initData = () => {
    getDevices();
    getWeather();
  };

  // 定时刷新数据
  setInterval(() => {
    getDevices();
  }, 10000);
  
  // 天气信息每小时更新一次
  setInterval(() => {
    getWeather();
  }, 10000);

  // 初始化数据
  initData();

  return {
    treeList,
    getTree,
    currentDevice,
    getDevices,
    devicesList,
    weatherInfo,
    isLoadingWeather,
    getWeather,
  };
});
