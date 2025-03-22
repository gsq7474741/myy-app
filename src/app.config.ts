export default {
  pages: [
    "pages/index/index",
    "pages/chat/index",
    "pages/courtyard/index-v2",
    "pages/courtyard/maintenance",
    "pages/courtyard/camera",
    "pages/me/index",
    "pages/me/login",
    "pages/me/order/list",
    "pages/me/order/detail",
    "pages/me/card/list",
  ],
  entryPagePath: "pages/me/index",
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#7CCF7F",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "white",
    navigationStyle: "custom", // custom: 保留右上角胶囊
  },

  tabBar: {
    custom: false,
    color: "#2c2c2c",
    selectedColor: "#004198",
    backgroundColor: "#ffffff",
    list: [
      // {
      //   pagePath: "pages/index/index",
      //   text: "发现",
      //   selectedIconPath: "assets/icon/icon-home.png",
      //   iconPath: "assets/icon/icon-home.png",
      // },
      {
        pagePath: "pages/courtyard/index-v2",
        text: "庭院",
        selectedIconPath: "assets/icon/icon-garden-active.png",
        iconPath: "assets/icon/icon-garden.png",
      },
      {
        pagePath: "pages/me/index",
        text: "我的",
        selectedIconPath: "assets/icon/icon-user-active.png",
        iconPath: "assets/icon/icon-user.png",
      },
    ],
  },
};
