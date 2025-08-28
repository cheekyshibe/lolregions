# LOL 阵营对决助手（轻量版）

- 技术栈：Vite + Svelte + TypeScript（构建产物极小，运行时开销低）
- 包管理器：pnpm
- 功能：
  - 随机选取一个或多个阵营
  - 支持手动多选阵营
  - 根据所选阵营展示可选英雄，并支持搜索与一键复制

## 本地启动

```bash
pnpm install
pnpm dev
```

默认地址：http://localhost:5173

## 构建与预览

```bash
pnpm build
pnpm preview
```

## 数据扩充

在 `src/data/regions.ts` 中补充 `champions` 数组（支持多阵营归属）。为方便维护，建议：

- 遵循：
  ```ts
  type Champion = { id: string; name: string; regions: string[] };
  ```
- `regions` 值需引用上方 `regions` 列表中的 `id`
- 如需拆分数据，可在 `src/data/` 下新增多个文件后在 `regions.ts` 中合并导出

## 设计取舍（简要）

- Svelte 编译期优化，首屏无需引入庞大运行时，适合轻量化网页
- 纯前端实现，无后端依赖，便于水友赛现场临时使用
- 组件与数据文件解耦，后续可以：
  - 接入远端 JSON（例如 GitHub Pages）
  - 增加“按位置筛选/人数限制/随机英雄”等高级功能
