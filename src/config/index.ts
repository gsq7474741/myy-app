// 全局配置文件

// API 基础 URL
export const API_BASE_URL = 'https://api.example.com'; // 需要替换为实际的 API 地址

// 订单状态信息配置
export const ORDER_STATUS_INFO = {
  pending: {
    label: '待处理',
    class: 'text-yellow-500',
  },
  inprogress: {
    label: '进行中',
    class: 'text-blue-500',
  },
  completed: {
    label: '已完成',
    class: 'text-green-500',
  },
};
