/**
 * 调试模式配置
 * 可以通过环境变量或手动设置控制调试模式
 */
import { ref } from 'vue';

// 检查当前环境
const isProduction = process.env.TARO_APP_BUILD_ENV === 'production';
const isDevelopment = process.env.TARO_APP_BUILD_ENV === 'development';

// 默认配置
const defaultConfig = {
  // 季节背景调试模式
  seasonBgDebug: !isProduction,
  // 树模型调试模式
  treeModelDebug: !isProduction
};

// 如果是开发环境，使用响应式对象允许手动配置
const developmentConfig = {
  seasonBgDebug: ref(true),
  treeModelDebug: ref(true),
  // 切换调试模式
  toggleDebug: (type: 'seasonBg' | 'treeModel') => {
    if (type === 'seasonBg') {
      developmentConfig.seasonBgDebug.value = !developmentConfig.seasonBgDebug.value;
    } else if (type === 'treeModel') {
      developmentConfig.treeModelDebug.value = !developmentConfig.treeModelDebug.value;
    }
  }
};

// 生产环境配置
const productionConfig = {
  ...defaultConfig,
  // 在生产环境中切换调试模式无效
  toggleDebug: () => {}
};

// 导出调试配置
export const debugConfig = isDevelopment ? developmentConfig : productionConfig;

// 检查是否为生产环境
export const isDebugEnabled = !isProduction;
