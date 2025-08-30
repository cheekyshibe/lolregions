// 说明：配置分享功能模块
import type { AppConfig, AppState } from '../types';
import { regions } from '../data/regions';
import { championTypes } from '../types';

/**
 * 生成当前配置的编码字符串
 */
export function generateConfigString(state: AppState): string {
  const config: AppConfig = {
    regions: Array.from(state.selectedRegions),
    types: Array.from(state.selectedTypes),
    query: state.query.trim(),
    showTitles: state.showTitles,
    showAvatars: state.showAvatars
  };
  
  try {
    const jsonString = JSON.stringify(config);
    // 使用 Base64 编码，确保URL友好
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('配置编码失败:', error);
    return '';
  }
}

/**
 * 解析配置字符串并返回状态更新函数
 */
export function parseConfigString(configString: string): Partial<AppState> | null {
  try {
    const jsonString = decodeURIComponent(atob(configString));
    const config: AppConfig = JSON.parse(jsonString);
    
    // 验证配置数据的有效性
    if (!config || typeof config !== 'object') {
      throw new Error('无效的配置格式');
    }

    const updates: Partial<AppState> = {};

    // 验证并应用阵营选择
    if (Array.isArray(config.regions)) {
      updates.selectedRegions = new Set(config.regions.filter(id => 
        regions.some(r => r.id === id)
      ));
    }

    // 验证并应用类型选择
    if (Array.isArray(config.types)) {
      updates.selectedTypes = new Set(config.types.filter(type => 
        championTypes.includes(type as any)
      ));
    }

    // 应用搜索关键词
    if (typeof config.query === 'string') {
      updates.query = config.query;
    }

    // 应用显示选项
    if (typeof config.showTitles === 'boolean') {
      updates.showTitles = config.showTitles;
    }
    if (typeof config.showAvatars === 'boolean') {
      updates.showAvatars = config.showAvatars;
    }

    return updates;
  } catch (error) {
    console.error('配置解析失败:', error);
    return null;
  }
}

/**
 * 生成分享链接
 */
export function generateShareLink(state: AppState): string {
  const configString = generateConfigString(state);
  if (!configString) return '';
  
  const url = new URL(window.location.href);
  url.searchParams.set('config', configString);
  return url.toString();
}

/**
 * 从URL参数加载配置
 */
export function loadConfigFromURL(): Partial<AppState> | null {
  const urlParams = new URLSearchParams(window.location.search);
  const configString = urlParams.get('config');
  
  if (configString) {
    const updates = parseConfigString(configString);
    if (updates) {
      // 清除URL参数，避免重复加载
      const url = new URL(window.location.href);
      url.searchParams.delete('config');
      window.history.replaceState({}, '', url.toString());
      return updates;
    }
  }
  
  return null;
}
