import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import { useCameraH5 } from "../utils/camera";

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

  setInterval(() => {
    getDevices();
  }, 10000);

  return {
    treeList,
    getTree,
    currentDevice,
    getDevices,
    devicesList,
  };
});
