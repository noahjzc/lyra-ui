import {
  AlertTriangle,
  Inbox,
  SearchX,
  Settings2,
  ShieldAlert,
} from 'lucide-react';
import type * as React from 'react';
import type { EmptyType } from './types';

export const emptyDefaultTitle = {
  'error-empty': '加载失败',
  'no-data': '暂无数据',
  'no-permission': '暂无权限',
  'no-result': '暂无匹配结果',
  'not-configured': '暂未配置',
} satisfies Record<EmptyType, string>;

export const emptyDefaultDescription = {
  'error-empty': '请稍后重试，或联系管理员确认服务状态。',
  'no-data': '当前区域还没有可展示的数据。',
  'no-permission': '你暂时无法查看这里的内容。',
  'no-result': '调整筛选条件后再试一次。',
  'not-configured': '完成配置后即可在这里查看内容。',
} satisfies Record<EmptyType, string>;

export const emptyIcon = {
  'error-empty': AlertTriangle,
  'no-data': Inbox,
  'no-permission': ShieldAlert,
  'no-result': SearchX,
  'not-configured': Settings2,
} satisfies Record<EmptyType, React.ComponentType<{ className?: string }>>;
