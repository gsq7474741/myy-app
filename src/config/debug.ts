/**
 * 调试模式配置
 * 可以通过环境变量或手动设置控制调试模式
 */

// 从环境变量中读取调试模式配置，如果未设置则默认为false
const isProduction = process.env.NODE_ENV === 'production';

// 默认配置
const defaultConfig = {
  // 季节背景调试模式
  seasonBgDebug: !isProduction,
  // 树模型调试模式
  treeModelDebug: !isProduction
};

// 导出调试配置
export const debugConfig = {
  ...defaultConfig
};

// 检查是否为生产环境
export const isDebugEnabled = !isProduction;
