import type * as React from 'react';

export interface BreadcrumbItem {
  /** 稳定 key，用于 React 渲染 */
  key?: React.Key;
  /** 节点文案 */
  label: React.ReactNode;
  /** 导航链接，存在时渲染为 &lt;a&gt; */
  href?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义图标（用于首页位） */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** 路径节点列表，最后一个自动作为当前页 */
  items: BreadcrumbItem[];
  /** 紧凑尺寸，适用于抽屉 / 浮层等窄容器 */
  compact?: boolean;
  /** 首页图标，会覆盖第一个 item 的 icon */
  homeIcon?: React.ReactNode;
  /** 可见节点最多数量，超出时折叠中间节点（默认 4） */
  maxItems?: number;
  /** 自定义分隔符（默认 "/"） */
  separator?: React.ReactNode;
  /** 自定义节点渲染 */
  renderItem?: (item: BreadcrumbItem, index: number) => React.ReactNode;
}
