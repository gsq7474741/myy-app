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
  pid: number;
  status: OrderStatus;
  type: string;
  createTime: number;
  updateTime: number;
};

type OrderStatus = "pending" | "completed" | "cancelled" | "inprogress";

type OrderDetail = {
  id: number;
  pid: number;
  status: OrderStatus;
  type: string;
  createTime: number;
  updateTime: number;
  name: string;
  phone: string;
  remark: string;
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
