# Lyra UI

面向高密度业务系统的 React 19 基础组件库，基于 Radix UI、Tailwind CSS 和
CSS variables 构建。

## 安装

```bash
pnpm add @noah-ji/lyra-ui
```

## 使用

```tsx
import { Button, Drawer } from '@noah-ji/lyra-ui';
import { DataTable } from '@noah-ji/lyra-ui/data-view/data-table';
import '@noah-ji/lyra-ui/styles.css';
```

应用根入口只导入一次 `styles.css`。主题通过 CSS variables 覆盖；暗色主题在根元素
设置 `data-theme="dark"`。

## 公开入口

- `@noah-ji/lyra-ui`
- `@noah-ji/lyra-ui/general`
- `@noah-ji/lyra-ui/data-input`
- `@noah-ji/lyra-ui/data-view`
- `@noah-ji/lyra-ui/navigation`
- `@noah-ji/lyra-ui/feedback`
- `@noah-ji/lyra-ui/overlay`
- `@noah-ji/lyra-ui/styles.css`

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
