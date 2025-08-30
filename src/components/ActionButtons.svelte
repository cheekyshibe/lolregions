<!-- 说明：操作按钮组件 -->
<script lang="ts">
  import { regions } from '../data/regions';
  import { generateConfigString, generateShareLink, parseConfigString } from '../utils/configShare';
  import { copyToClipboard, readFromClipboard } from '../utils/clipboardUtils';
  import type { AppState } from '../types';

  export let filteredChampions: any[];
  export let selectedRegions: Set<string>;
  export let selectedTypes: Set<string>;
  export let query: string;
  export let showTitles: boolean;
  export let showAvatars: boolean;

  // 创建当前状态对象
  $: currentState = {
    selectedRegions,
    selectedTypes,
    query,
    randomCount: 1, // 这个值在这里不重要
    showTitles,
    showAvatars
  };

  // 导出当前选择（可复制）
  function exportSelection() {
    const rs = regions
      .filter((r) => selectedRegions.has(r.id))
      .map((r) => r.name)
      .join("、");
    const ts = Array.from(selectedTypes).join("、");
    const cs = filteredChampions.map((c) => c.name).join("、");
    const text = `阵营：${rs || "未选择"}\n类型：${ts || "未选择"}\n英雄（${filteredChampions.length}）：${cs}`;
    
    copyToClipboard(text).then(success => {
      if (success) {
        alert("已复制到剪贴板");
      } else {
        alert("复制失败");
      }
    });
  }

  // 复制配置到剪贴板
  function copyConfig() {
    const configString = generateConfigString(currentState);
    if (!configString) {
      alert('配置生成失败');
      return;
    }

    copyToClipboard(configString).then(success => {
      if (success) {
        alert('配置已复制到剪贴板！\n可以分享给其他用户使用。');
      } else {
        alert('复制失败');
      }
    });
  }

  // 从剪贴板粘贴配置
  async function pasteConfig() {
    const configString = await readFromClipboard();
    if (!configString) {
      alert('剪贴板为空');
      return;
    }

    const updates = parseConfigString(configString);
    if (updates) {
      // 触发状态更新事件
      if (updates.selectedRegions) selectedRegions = updates.selectedRegions;
      if (updates.selectedTypes) selectedTypes = updates.selectedTypes;
      if (updates.query !== undefined) query = updates.query;
      if (updates.showTitles !== undefined) showTitles = updates.showTitles;
      if (updates.showAvatars !== undefined) showAvatars = updates.showAvatars;
      
      alert('配置已成功应用！');
    } else {
      alert('配置格式无效，请检查配置字符串是否正确');
    }
  }

  // 复制分享链接
  function copyShareLink() {
    const shareLink = generateShareLink(currentState);
    if (!shareLink) {
      alert('链接生成失败');
      return;
    }

    copyToClipboard(shareLink).then(success => {
      if (success) {
        alert('分享链接已复制到剪贴板！\n其他用户打开此链接即可看到相同的配置。');
      } else {
        alert('复制失败');
      }
    });
  }
</script>

<div class="action-buttons">
  <button 
    class="btn"
    on:click={() => showTitles = !showTitles}
    class:active={showTitles}
  >
    {showTitles ? '隐藏称号' : '显示称号'}
  </button>
  <button 
    class="btn"
    on:click={() => showAvatars = !showAvatars}
    class:active={showAvatars}
  >
    {showAvatars ? '隐藏头像' : '显示头像'}
  </button>
  <button class="btn" on:click={exportSelection}>复制当前列表</button>
  <button class="btn config-btn" on:click={copyConfig}>复制配置</button>
  <button class="btn config-btn" on:click={pasteConfig}>粘贴配置</button>
  <button class="btn config-btn" on:click={copyShareLink}>复制分享链接</button>
</div>

