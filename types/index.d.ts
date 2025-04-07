type CardListItem = {
  id: number;
  status: OrderStatus;
  meta: {
    name: string;
  };
  expiredTime: number;
  usageTime: number;
};

type OrderListItem = {
  id: number;
  user_id: number;
  dev_id: number;
  maintenance_categories: number;
  create_time: string;
  completion_time: string | null;
  is_completion: number;
  user_images: string[] | null;
  consultation_description: string | null;
  model_advice: string | null;
  manual_advice: string | null;
  status?: OrderStatus; // 前端计算属性
  type?: string; // 前端计算属性
};

type OrderStatus = "pending" | "completed" | "inprogress";

type MaintenanceCategory = 0 | 1 | 2; // 0:问诊 1:工单 2:浇水

type OrderDetail = {
  id: number;
  user_id: number;
  dev_id: number;
  maintenance_categories: number;
  create_time: string;
  completion_time: string | null;
  is_completion: number;
  user_images: string[] | null;
  consultation_description: string | null;
  model_advice: string | null;
  manual_advice: string | null;
  status?: OrderStatus; // 前端计算属性
  type?: string; // 前端计算属性
};

type TreeListItem = {
  id: number;
  name: string;
  model: string;
};

type TreeStatus = {
  /**
   * 是否出水
   */
  effluent: boolean;
  /**
   * 相对湿度
   */
  humidity: number;
  /**
   * 苗木ID
   */
  id: number;
  /**
   * 环境光照
   */
  light: number;
  soil: TreeStatusSoil;
  /**
   * 阶段需求
   */
  stages: number[];
  /**
   * 状态信息
   */
  status: string;
  /**
   * 环境气温
   */
  temperature?: number;
};

type TreeStatusSoil = {
  /**
   * EC值
   */
  ec: number;
  /**
   * 土壤湿度
   */
  humidity: number;
  /**
   * 钾
   */
  ka: number;
  /**
   * 氮
   */
  n: number;
  /**
   * 磷
   */
  p: number;
  /**
   * PH值
   */
  ph: number;
  /**
   * 土壤温度
   */
  temperature: number;
};

type GardenEntry = {
  label: string;
  icon: string;
  route: string;
  colSpan?: number;
  rowSpan?: number;
  display: "row" | "normal";
};
