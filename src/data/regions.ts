// 说明：仅保留阵营定义，英雄数据已迁移至 `src/data/champions.ts`
import type { Region } from './types';

export const regions: Region[] = [
  { id: 'demacia', name: '德玛西亚' },
  { id: 'noxus', name: '诺克萨斯' },
  { id: 'ionia', name: '艾欧尼亚' },
  { id: 'freljord', name: '弗雷尔卓德' },
  { id: 'piltover', name: '皮尔特沃夫' },
  { id: 'zaun', name: '祖安' },
  { id: 'shadow_isles', name: '暗影岛' },
  { id: 'targon', name: '巨神峰' },
  { id: 'shurima', name: '恕瑞玛' },
  { id: 'bilgewater', name: '比尔吉沃特' },
  { id: 'bandle', name: '班德尔城' },
  { id: 'ixtal', name: '以绪塔尔' },
  { id: 'void', name: '虚空' },
  { id: 'runeterra', name: '符文之地' }
];
