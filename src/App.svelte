<script lang="ts">
  // 说明：核心页面逻辑
  import { onMount } from 'svelte';
  import champions from "./data/champions";
  import { regions } from "./data/regions";
  import { championTypes } from './types';
  import { loadConfigFromURL } from './utils/configShare';
  
  // 样式导入
  import './styles/global.css';
  import './styles/components.css';
  import './styles/layout.css';
  import './styles/special.css';
  import './styles/background.css';
  
  // 组件导入
  import RegionSelector from './components/RegionSelector.svelte';
  import TypeSelector from './components/TypeSelector.svelte';
  import ChampionGrid from './components/ChampionGrid.svelte';
  import ActionButtons from './components/ActionButtons.svelte';
  
  // UI 状态
  let selectedRegions = new Set<string>();
  let selectedTypes = new Set<string>();
  let query = "";
  let randomCount = 1; // 随机选择的阵营数量
  let showTitles = true; // 控制是否显示英雄称号，默认开启
  let showAvatars = true; // 控制是否显示英雄头像，默认开启

  // 页面加载时执行
  onMount(() => {
    const updates = loadConfigFromURL();
    if (updates) {
      if (updates.selectedRegions) selectedRegions = updates.selectedRegions;
      if (updates.selectedTypes) selectedTypes = updates.selectedTypes;
      if (updates.query !== undefined) query = updates.query;
      if (updates.showTitles !== undefined) showTitles = updates.showTitles;
      if (updates.showAvatars !== undefined) showAvatars = updates.showAvatars;
    }
  });

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

  <RegionSelector bind:selectedRegions bind:randomCount />
  <TypeSelector bind:selectedTypes />

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
        <ActionButtons 
          {filteredChampions}
          bind:selectedRegions
          bind:selectedTypes
          bind:query
          bind:showTitles
          bind:showAvatars
        />
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

    <ChampionGrid champions={filteredChampions} {showTitles} {showAvatars} />
  </section>

  <footer class="muted">
    <p>
      数据来源：<a href="https://yz.lol.qq.com/zh_CN/champions/"
        >https://yz.lol.qq.com/zh_CN/champions/</a
      >，如有归属争议可直接在文件中调整。
    </p>
  </footer>
</div>

