# lyra-ui 智能体指令

## 项目边界

`lyra-ui` 是 React 基础组件库，不包含 CRM 页面、路由、接口、认证、composites
或 patterns。公开 API 只能通过 `package.json#exports` 暴露。

## 命令

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm build-storybook
pnpm test:visual
pnpm pack:check
pnpm verify:consumer
```

## 结构

- `src/components`：五类公开组件源码。
- `src/internal`：不可公开的共享实现。
- `src/overlay`：公开浮层层级 API。
- `src/styles`：发布为 `styles.css` 的主题和组件样式。
- `tests`：行为、架构和视觉验证。
- `fixtures/consumer`：真实 tarball 消费验证。

## 修改规则

- 组件行为变更先写测试。
- React 和 ReactDOM 必须保持 peerDependencies，不得打入 bundle。
- 不得在发布源码或声明中保留 `@/ui/*` CRM alias。
- 不得用宽泛 wildcard exports 暴露 `context.ts`、`types.ts`、`variants.ts`。
- 修改公开 API、CSS variables、overlay 层级或 package exports 时运行全部验证。
- 文档和代码注释使用中文；代码、命令、配置和接口字段保持原文。
