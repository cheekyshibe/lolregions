<!-- 说明：英雄网格展示组件 -->
<script lang="ts">
  import { regions } from '../data/regions';
  import { getChampionImageUrl } from '../data/imageMapping';
  import type { Champion } from '../types';

  export let champions: Champion[];
  export let showTitles: boolean;
  export let showAvatars: boolean;
</script>

<div class="grid">
  {#each champions as c}
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
    </a>
  {/each}
</div>

