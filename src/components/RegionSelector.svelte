<!-- 说明：阵营选择组件 -->
<script lang="ts">
  import { regions } from '../data/regions';
  import { randomPick } from '../utils/arrayUtils';

  export let selectedRegions: Set<string>;
  export let randomCount: number;

  // 阵营选择/取消选择
  function toggleRegion(id: string) {
    if (selectedRegions.has(id)) selectedRegions.delete(id);
    else selectedRegions.add(id);
    selectedRegions = new Set(selectedRegions); // 触发更新
  }

  function selectAllRegions() {
    selectedRegions = new Set(regions.map((r) => r.id));
  }

  function clearAllRegions() {
    selectedRegions = new Set();
  }

  function randomPickRegions() {
    const picked = randomPick(regions, randomCount);
    selectedRegions = new Set(picked.map((r) => r.id));
  }
</script>

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
      <button class="btn" on:click={randomPickRegions}>随机选取</button>
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

