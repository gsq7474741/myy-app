import { defineStore } from "pinia";
import Taro from "@tarojs/taro";

type UserInfo = {
  id: number;
  username: string;
};
export const useAppStore = defineStore("app", () => {
  const isLogin = ref(!false);
  const userInfo = ref<UserInfo | null>();
  const userToken = ref("");
  const loginByPassword = async (username: string, password: string) => {
    return new Promise<UserInfo>((resolve, reject) => {
      Taro.request({
        url: getApiUrl("login"),
        method: "POST",
        data: JSON.stringify({
          user_name: username,
          password,
        }),
        success: (res) => {
          if (res.data.code === 0) {
            userToken.value = res.data.data;
            isLogin.value = true;
            useCourtyardStore().getDevices();
            resolve(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  };
  const goToLogin = () => {
    Taro.navigateTo({
      url: "/pages/me/login",
    });
  };
  return {
    isLogin,
    userInfo,
    loginByPassword,
    goToLogin,
    userToken,
  };
});
