// 说明：统一的类型定义文件

// 数据模型类型
export type Champion = {
  id: string; // 英文/别名标识
  name: string; // 中文名
  title: string; // 英雄称号
  region: string; // 单一归宿阵营 ID
  types?: string[]; // 英雄类型标签，如['战士', '坦克']
};

export type Region = {
  id: string; // 英文标识
  name: string; // 中文名
};

// 英雄类型常量
export const championTypes = ['战士', '法师', '刺客', '坦克', '射手', '辅助'] as const;
export type ChampionType = typeof championTypes[number];

// 应用配置接口
export interface AppConfig {
  regions: string[];
  types: string[];
  query: string;
  showTitles: boolean;
  showAvatars: boolean;
}

// 应用状态接口
export interface AppState {
  selectedRegions: Set<string>;
  selectedTypes: Set<string>;
  query: string;
  randomCount: number;
  showTitles: boolean;
  showAvatars: boolean;
}
