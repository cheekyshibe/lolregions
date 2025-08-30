# LOL 阵营对决助手

一个基于 Svelte 的英雄联盟阵营筛选工具，支持配置分享和多种筛选功能。

## 技术栈

- **前端框架**：Vite + Svelte + TypeScript
- **包管理器**：pnpm
- **样式架构**：模块化 CSS，支持 CSS 变量和响应式设计

## 核心功能

- **阵营筛选**：支持多选阵营，随机选取功能
- **类型筛选**：按英雄类型（坦克、法师、射手等）筛选
- **搜索功能**：实时搜索英雄名称和称号
- **配置分享**：
  - 复制/粘贴配置字符串
  - 生成分享链接（URL 参数）
  - 自动应用 URL 配置
- **显示选项**：可切换英雄头像和称号显示
- **数据导出**：一键复制当前筛选结果

## 项目架构

```
src/
├── components/          # 组件模块
│   ├── ActionButtons.svelte    # 操作按钮组件
│   ├── ChampionGrid.svelte     # 英雄网格展示
│   ├── RegionSelector.svelte   # 阵营选择器
│   └── TypeSelector.svelte     # 类型选择器
├── data/               # 数据层
│   ├── champions.ts    # 英雄数据
│   ├── regions.ts      # 阵营数据
│   └── imageMapping.ts # 图片映射
├── styles/             # 样式模块
│   ├── global.css      # 全局样式和 CSS 变量
│   ├── components.css  # 组件通用样式
│   ├── layout.css      # 布局和响应式样式
│   └── special.css     # 特殊组件样式
├── types/              # 类型定义
│   └── index.ts        # 统一类型导出
├── utils/              # 工具函数
│   ├── configShare.ts  # 配置分享功能
│   ├── arrayUtils.ts   # 数组操作工具
│   └── clipboardUtils.ts # 剪贴板工具
└── App.svelte          # 主应用组件
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

默认地址：http://localhost:5173

## 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 数据扩展

### 英雄数据结构

在 `src/data/champions.ts` 中维护英雄数据：

```ts
type Champion = {
  id: string;        // 英雄 ID
  name: string;      // 英雄名称
  title: string;     // 英雄称号
  region: string;    // 所属阵营 ID
  types: string[];   // 英雄类型数组
};
```

### 阵营数据结构

在 `src/data/regions.ts` 中维护阵营数据：

```ts
type Region = {
  id: string;    // 阵营 ID
  name: string;  // 阵营名称
};
```

## 配置分享机制

### 编码方案
配置通过 `JSON.stringify` → `encodeURIComponent` → `Base64` 编码，确保 URL 安全性。

### 分享方式
1. **配置字符串**：复制编码后的配置到剪贴板
2. **分享链接**：生成包含配置参数的完整 URL
3. **自动加载**：页面加载时自动解析 URL 参数并应用配置

## 设计特点

- **模块化架构**：组件、样式、工具函数完全分离
- **类型安全**：完整的 TypeScript 类型定义
- **响应式设计**：支持移动端和桌面端
- **无后端依赖**：纯前端实现，便于部署
- **配置持久化**：支持 URL 参数和剪贴板分享
- **现代化开发**：遵循前端最佳实践，代码可维护性强
