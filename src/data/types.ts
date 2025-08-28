// 说明：公共类型定义，便于在多个数据文件中复用
export type Region = {
  id: string; // 英文标识
  name: string; // 中文名
};

export type Champion = {
  id: string; // 英文/别名标识
  name: string; // 中文名
  title: string; // 英雄称号
  region: string; // 单一归宿阵营 ID
  types?: string[]; // 英雄类型标签，如['战士', '坦克']
};
