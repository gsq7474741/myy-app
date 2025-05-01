import { defineStore } from "pinia";
import Taro from "@tarojs/taro";

type UserInfo = {
  id: number;
  username: string;
};
export const useAppStore = defineStore("app", () => {
  const [route] = useRouter();
  const isLogin = ref(false);
  const userInfo = ref<UserInfo | null>();
  const userToken = ref("");
  const userId = ref(1);

  console.log(route);
  if (route.params.quick) {
    userId.value = route.params.id;
    userToken.value = route.params.token;
    // 这里假设 quick 模式下 username 不可得，用 id 填充
    userInfo.value = { id: route.params.id, username: '' };
    if (userToken.value && userId.value) {
      isLogin.value = true;
      Taro.navigateTo({ url: "/pages/me/index" });
    }
  }
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
            // 假设登录接口只返回 token，需要额外请求用户信息接口
            // 这里简单处理：用本地 userId 拼装 userInfo
            userInfo.value = { id: userId.value, username: '' };
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
    if (isLogin.value) return;
    Taro.navigateTo({
      url: "/pages/me/login",
    });
  };
  return {
    isLogin,
    userInfo,
    userId,
    loginByPassword,
    goToLogin,
    userToken,
  };
});
