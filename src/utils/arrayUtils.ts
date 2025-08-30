// 说明：数组操作工具函数

/**
 * Fisher-Yates 洗牌算法
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 从数组中随机选择指定数量的元素
 */
export function randomPick<T>(array: T[], count: number): T[] {
  const validCount = Math.max(1, Math.min(count, array.length));
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, validCount);
}
