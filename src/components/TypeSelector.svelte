<!-- 说明：英雄类型选择组件 -->
<script lang="ts">
  import { championTypes } from '../types';

  export let selectedTypes: Set<string>;

  // 类型选择/取消选择
  function toggleType(type: string) {
    if (selectedTypes.has(type)) selectedTypes.delete(type);
    else selectedTypes.add(type);
    selectedTypes = new Set(selectedTypes); // 触发更新
  }

  function selectAllTypes() {
    selectedTypes = new Set(championTypes);
  }

  function clearAllTypes() {
    selectedTypes = new Set();
  }
</script>

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

