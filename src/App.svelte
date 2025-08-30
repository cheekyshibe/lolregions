<script lang="ts">
  // 说明：核心页面逻辑
  import champions from "./data/champions";
  import { regions } from "./data/regions";
  // 不需要导入types，直接使用championTypes常量
  import { getChampionImageUrl } from "./data/imageMapping";

  // 英雄类型定义
  const championTypes = ['战士', '法师', '刺客', '坦克', '射手', '辅助'] as const;
  
  // UI 状态
  let selectedRegions = new Set<string>();
  let selectedTypes = new Set<string>();
  let query = "";
  let randomCount = 1; // 随机选择的阵营数量
  let showTitles = true; // 控制是否显示英雄称号，默认开启
  let showAvatars = true; // 控制是否显示英雄头像，默认开启

  // 阵营选择/取消选择
  function toggleRegion(id: string) {
    if (selectedRegions.has(id)) selectedRegions.delete(id);
    else selectedRegions.add(id);
    selectedRegions = new Set(selectedRegions); // 触发更新
  }

  // 类型选择/取消选择
  function toggleType(type: string) {
    if (selectedTypes.has(type)) selectedTypes.delete(type);
    else selectedTypes.add(type);
    selectedTypes = new Set(selectedTypes); // 触发更新
  }

  function selectAllRegions() {
    selectedRegions = new Set(regions.map((r) => r.id));
  }

  function clearAllRegions() {
    selectedRegions = new Set();
  }

  function selectAllTypes() {
    selectedTypes = new Set(championTypes);
  }

  function clearAllTypes() {
    selectedTypes = new Set();
  }

  function randomPick() {
    const count = Math.max(1, Math.min(randomCount, regions.length));
    const pool = [...regions];
    // 简单洗牌
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    selectedRegions = new Set(pool.slice(0, count).map((r) => r.id));
  }

  // 依据已选择阵营和类型，聚合英雄去重
  $: filteredChampions = champions.filter((c) => {
    const searchTerm = query.toLowerCase().trim();
    const regionMatch = selectedRegions.size === 0 || selectedRegions.has(c.region);
    const typeMatch = selectedTypes.size === 0 || (c.types && c.types.some(type => selectedTypes.has(type)));
    
    return (
      regionMatch &&
      typeMatch &&
      (searchTerm === "" ||
        c.name.toLowerCase().includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm) ||
        c.title.toLowerCase().includes(searchTerm))
    );
  }).sort((a, b) => a.id.localeCompare(b.id, "en"));

  // 导出当前选择（可复制）
  function exportSelection() {
    const rs = regions
      .filter((r) => selectedRegions.has(r.id))
      .map((r) => r.name)
      .join("、");
    const ts = Array.from(selectedTypes).join("、");
    const cs = filteredChampions.map((c) => c.name).join("、");
    const text = `阵营：${rs || "未选择"}\n类型：${ts || "未选择"}\n英雄（${filteredChampions.length}）：${cs}`;
    navigator.clipboard
      .writeText(text)
      .then(() => alert("已复制到剪贴板"))
      .catch(() => alert("复制失败"));
  }

  // 配置分享功能
  interface AppConfig {
    regions: string[];
    types: string[];
    query: string;
    showTitles: boolean;
    showAvatars: boolean;
  }

  // 生成当前配置的编码字符串
  function generateConfigString(): string {
    const config: AppConfig = {
      regions: Array.from(selectedRegions),
      types: Array.from(selectedTypes),
      query: query.trim(),
      showTitles,
      showAvatars
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

  // 解析配置字符串并应用到当前状态
  function applyConfigString(configString: string): boolean {
    try {
      const jsonString = decodeURIComponent(atob(configString));
      const config: AppConfig = JSON.parse(jsonString);
      
      // 验证配置数据的有效性
      if (!config || typeof config !== 'object') {
        throw new Error('无效的配置格式');
      }

      // 应用阵营选择
      if (Array.isArray(config.regions)) {
        selectedRegions = new Set(config.regions.filter(id => 
          regions.some(r => r.id === id)
        ));
      }

      // 应用类型选择
      if (Array.isArray(config.types)) {
        selectedTypes = new Set(config.types.filter(type => 
          championTypes.includes(type as any)
        ));
      }

      // 应用搜索关键词
      if (typeof config.query === 'string') {
        query = config.query;
      }

      // 应用显示选项
      if (typeof config.showTitles === 'boolean') {
        showTitles = config.showTitles;
      }
      if (typeof config.showAvatars === 'boolean') {
        showAvatars = config.showAvatars;
      }

      return true;
    } catch (error) {
      console.error('配置解析失败:', error);
      return false;
    }
  }

  // 复制配置到剪贴板
  function copyConfig() {
    const configString = generateConfigString();
    if (!configString) {
      alert('配置生成失败');
      return;
    }

    navigator.clipboard
      .writeText(configString)
      .then(() => alert('配置已复制到剪贴板！\n可以分享给其他用户使用。'))
      .catch(() => alert('复制失败'));
  }

  // 从剪贴板粘贴配置
  async function pasteConfig() {
    try {
      const configString = await navigator.clipboard.readText();
      if (!configString.trim()) {
        alert('剪贴板为空');
        return;
      }

      const success = applyConfigString(configString.trim());
      if (success) {
        alert('配置已成功应用！');
      } else {
        alert('配置格式无效，请检查配置字符串是否正确');
      }
    } catch (error) {
      alert('无法读取剪贴板内容，请确保已授权剪贴板访问权限');
    }
  }

  // 生成分享链接
  function generateShareLink(): string {
    const configString = generateConfigString();
    if (!configString) return '';
    
    const url = new URL(window.location.href);
    url.searchParams.set('config', configString);
    return url.toString();
  }

  // 复制分享链接
  function copyShareLink() {
    const shareLink = generateShareLink();
    if (!shareLink) {
      alert('链接生成失败');
      return;
    }

    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert('分享链接已复制到剪贴板！\n其他用户打开此链接即可看到相同的配置。'))
      .catch(() => alert('复制失败'));
  }

  // 页面加载时检查URL参数
  function loadConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const configString = urlParams.get('config');
    
    if (configString) {
      const success = applyConfigString(configString);
      if (success) {
        // 清除URL参数，避免重复加载
        const url = new URL(window.location.href);
        url.searchParams.delete('config');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }

  // 页面加载时执行
  import { onMount } from 'svelte';
  onMount(() => {
    loadConfigFromURL();
  });

</script>

<div class="container">
  <header class="header">
    <div class="header-title">
      <div class="title-group">
        <img 
          src="https://game.gtimg.cn/images/lol/v3/logo-public.png" 
          alt="LOL Logo" 
          class="logo"
          height="40"
        />
        <h1>阵营对决助手</h1>
      </div>
      <div class="action-buttons">
        <a 
          href="https://space.bilibili.com/609288952"
          target="_blank" 
          rel="noopener noreferrer"
          class="announcement-banner"
          title="前往咸鱼的 B 站"
        >
          <div class="banner-content">
            <span class="banner-icon">🎮</span>
            <span class="banner-text">全力支持 2025 七夕咸鱼水友群内战</span>
            <span class="banner-icon">🐟</span>
          </div>
        </a>
        <a 
          href="https://map.leagueoflegends.com/zh_CN" 
          target="_blank" 
          rel="noopener noreferrer"
          class="map-btn"
          title="探索符文之地地图"
        >
          🗺️ 探索符文之地地图
        </a>
      </div>
    </div>
  </header>

  <section class="card controls">
    <div class="row">
      <div class="field inline">
        <label for="random-count">随机阵营数量</label>
        <input
          id="random-count"
          type="number"
          min="1"
          max={regions.length}
          bind:value={randomCount}
        />
      </div>
      <div class="btns">
        <button class="btn" on:click={randomPick}>随机选取</button>
        <button class="btn" on:click={selectAllRegions}>全选</button>
        <button class="btn" on:click={clearAllRegions}>清空</button>
      </div>
    </div>

    <div class="regions">
      {#each regions as r}
        <label class="chip {selectedRegions.has(r.id) ? 'on' : ''}">
          <input
            type="checkbox"
            checked={selectedRegions.has(r.id)}
            on:change={() => toggleRegion(r.id)}
          />
          <span>{r.name}</span>
        </label>
      {/each}
    </div>
  </section>

  <section class="card controls">
    <div class="filter-section">
      <div class="row between">
        <div class="filter-options">
          {#each championTypes as type}
            <label class="chip {selectedTypes.has(type) ? 'on' : ''}">
              <input
                type="checkbox"
                checked={selectedTypes.has(type)}
                on:change={() => toggleType(type)}
              />
              <span>{type}</span>
            </label>
          {/each}
        </div>
        <div class="filter-buttons">
          <button class="btn" on:click={() => selectAllTypes()}>全选</button>
          <button class="btn" on:click={() => clearAllTypes()}>清空</button>
        </div>
      </div>

    </div>
  </section>

  <section class="card heroes">
    <div class="row between">
      <h2>
        可选英雄 <small class="muted">{filteredChampions.length} 位</small>
      </h2>
      <div class="search-container">
        <input
          class="search"
          placeholder="搜索英雄/称号/英文ID..."
          bind:value={query}
        />
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
    </div>

    {#if selectedRegions.size === 0 && selectedTypes.size === 0}
      <p class="muted">
        提示：未选择阵营和类型，默认显示全部英雄（可补全数据），鼠标悬浮可查看归属阵营。
      </p>
    {/if}

    {#if filteredChampions.length === 0}
      <p class="muted">没有匹配结果，请调整阵营或搜索条件。</p>
    {/if}

    <div class="grid">
      {#each filteredChampions as c}
        <a
          class="tile"
          href={`https://yz.lol.qq.com/zh_CN/champion/${c.id}/`}
          target="_blank"
          rel="noopener noreferrer"
          title={`归属：${regions.find((r) => r.id === c.region)?.name || c.region}`}
        >
          {#if showAvatars}
            <div class="avatar-container">
              <img 
                src={getChampionImageUrl(c.id)}
                alt={c.name}
                class="avatar"
                loading="lazy"
                on:error={(e) => {
                  const img = e.currentTarget;
                  if (img instanceof HTMLImageElement) {
                    img.style.display = 'none';
                    const placeholder = img.parentElement?.querySelector('.avatar-placeholder');
                    if (placeholder instanceof HTMLElement) {
                      placeholder.style.display = 'flex';
                    }
                  }
                }}
              />
              <div class="avatar-placeholder" style="display: none;">
                <span>{c.name.charAt(0)}</span>
              </div>
            </div>
          {/if}
          <div class="name">{c.name}</div>
          {#if showTitles}
            <div class="title">{c.title}</div>
          {/if}
          <div class="sub">{c.id}</div>
        </a>
      {/each}
    </div>
  </section>

  <footer class="muted">
    <p>
      数据来源：<a href="https://yz.lol.qq.com/zh_CN/champions/"
        >https://yz.lol.qq.com/zh_CN/champions/</a
      >，如有归属争议可直接在文件中调整。
    </p>
  </footer>
</div>

<style>
  .header-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    padding: 25px 30px;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.2) 0%, 
      rgba(118, 75, 162, 0.2) 50%, 
      rgba(102, 126, 234, 0.1) 100%);
    border-radius: 16px;
    border: 1px solid rgba(102, 126, 234, 0.3);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    margin: 20px;
  }
  
  @media (max-width: 768px) {
    .header-title {
      flex-direction: column;
      text-align: center;
      padding: 20px 15px;
      margin: 10px;
    }
    
    .action-buttons {
      flex-direction: column;
      width: 100%;
      max-width: 400px;
    }
    
    .announcement-banner,
    .map-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .header-title {
      padding: 15px 10px;
      gap: 15px;
    }
    
    .title-group h1 {
      font-size: 1.5rem;
    }
    
    .logo {
      height: 32px;
    }
  }
  
  .title-group {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0;
    border: none;
    background: none;
    box-shadow: none;
    backdrop-filter: none;
  }
  
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .announcement-banner {
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
  }
  
  .title-group h1 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    font-size: 1.8rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }
  
  .header h1 {
    margin: 0;
  }
  
  .map-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  .map-btn.centered {
    margin-top: 16px;
    align-self: center;
  }
  
  .map-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    filter: brightness(1.1);
  }
  .muted {
    color: var(--muted);
  }

  .controls .row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .controls .row.between {
    justify-content: space-between;
  }
  .controls .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .controls .field.inline {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .controls .field.inline label {
    margin-bottom: 0;
    white-space: nowrap;
  }
  .controls input[type="number"] {
    width: 120px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f131a;
    color: var(--text);
  }
  .controls .field.inline input[type="number"] {
    width: 80px;
  }
  .btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .btn {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #0b0e14;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }
  .btn:hover {
    filter: brightness(1.05);
  }
  
  .config-btn {
    background: linear-gradient(135deg, #50c878, #4a90e2);
    position: relative;
  }
  
  .config-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .regions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0f131a;
    border: 1px solid var(--border);
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
  }
  .chip input {
    accent-color: var(--accent);
  }
  .chip.on {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(84, 168, 255, 0.15) inset;
    background: #0c1016;
  }

  .heroes .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .heroes .row.between {
    justify-content: space-between;
  }
  .heroes .row.gap {
    gap: 8px;
  }
  .search {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #0f131a;
    color: var(--text);
    min-width: 220px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin-top: 12px;
  }
  .tile {
    background: #0f131a;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  .tile:hover {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(84, 168, 255, 0.15);
    transform: translateY(-1px);
  }
  .tile .name {
    font-weight: 700;
  }
  .tile .title {
    font-size: 0.75rem;
    color: #3498db;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  .avatar-container {
    width: 48px;
    height: 48px;
    margin: 0 auto 0.5rem auto;
    position: relative;
  }

  .tile .avatar {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #e1e8ed;
  }

  .avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    border: 1px solid #e1e8ed;
  }

  .tile .sub {
    font-size: 0.75rem;
    color: #7f8c8d;
  }

  .announcement-banner {
    background: linear-gradient(135deg, #4a90e2, #50c878);
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
    text-align: center;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .announcement-banner:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(74, 144, 226, 0.4);
    filter: brightness(1.1);
  }
  
  .announcement-banner:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
  }

  .banner-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
  }

  .banner-icon {
    font-size: 1.1rem;
  }

  .banner-text {
    color: white;
  }
  </style>
