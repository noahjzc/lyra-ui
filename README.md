# Lyra UI

面向高密度业务系统的 React 19 基础组件库，基于 Radix UI、Tailwind CSS 和
CSS variables 构建。

## 安装

```bash
pnpm add @noah-ji/lyra-ui
```

## 使用

### 已编译基础样式

不需要在消费项目中运行 Tailwind：

```tsx
import '@noah-ji/lyra-ui/styles.css';
```

应用根入口只导入一次 `styles.css`。主题通过 CSS variables 覆盖；暗色主题在根元素
设置 `data-theme="dark"`。

### 使用 Tailwind 的消费项目

应用仍先导入 Lyra 基础样式，再创建自己的 Tailwind 编译入口，例如
`src/styles/lyra-tailwind.css`：

```css
@layer theme, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "@noah-ji/lyra-ui/tailwind-theme.css";
@import "tailwindcss/utilities.css" layer(utilities);
@source "../";
```

`tailwind-theme.css` 只提供 Lyra token 到 utility namespace 的编译映射，不包含品牌值，
也不会扫描消费项目源码。消费项目负责声明自己的 `@source`。

组件导入方式保持不变：

```tsx
import { Button, Drawer } from '@noah-ji/lyra-ui';
import { DataTable } from '@noah-ji/lyra-ui/data-view/data-table';
```

## 公开入口

- `@noah-ji/lyra-ui`
- `@noah-ji/lyra-ui/general`
- `@noah-ji/lyra-ui/data-input`
- `@noah-ji/lyra-ui/data-view`
- `@noah-ji/lyra-ui/navigation`
- `@noah-ji/lyra-ui/feedback`
- `@noah-ji/lyra-ui/overlay`
- `@noah-ji/lyra-ui/styles.css`
- `@noah-ji/lyra-ui/tailwind-theme.css`

逐组件入口使用 `<category>/<component>`，例如
`@noah-ji/lyra-ui/data-input/select`。未列入 `package.json#exports` 的路径属于私有实现。

## 开发

```bash
pnpm install
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm storybook
pnpm verify
pnpm pack:check
pnpm verify:consumer
```

## 许可证

MIT
