import type { StepStatus, StepsOrientation, StepsVariant } from './types';

export const stepStatusLabel: Record<StepStatus, string> = {
  error: '错误',
  finish: '已完成',
  process: '当前',
  wait: '未开始',
};

export const stepsRootClassName = 'min-w-0 text-sm text-ui-foreground';

export const stepsOrientationClassName: Record<StepsOrientation, string> = {
  horizontal:
    'grid auto-cols-fr grid-flow-col items-start gap-0 max-[760px]:grid-flow-row max-[760px]:auto-rows-auto',
  vertical: 'grid gap-0',
};

export const stepsVariantClassName: Record<StepsVariant, string> = {
  compact: 'text-xs',
  default: 'text-sm',
  progress: 'text-xs',
};

export const stepItemBaseClassName =
  'group/step relative min-w-0 data-[disabled=true]:opacity-60';

export const stepItemOrientationClassName: Record<StepsOrientation, string> = {
  horizontal:
    'grid grid-rows-[auto_auto] justify-items-start pr-4 max-[760px]:grid-rows-none max-[760px]:gap-2 max-[760px]:pb-4 max-[760px]:pr-0',
  vertical: 'grid grid-cols-[28px_minmax(0,1fr)] gap-2 pb-4',
};

export const stepNodeSizeClassName: Record<StepsVariant, string> = {
  compact: 'size-6 text-xs',
  default: 'size-7 text-xs',
  progress: 'size-6 text-xs',
};

export const stepNodeStatusClassName: Record<StepStatus, string> = {
  error: 'border-ui-destructive bg-ui-destructive/10 text-ui-destructive',
  finish:
    'border-(--ui-button-primary-border) bg-(--ui-button-primary-background) text-(--ui-button-primary-foreground)',
  process:
    'border-(--ui-button-primary-border) bg-(--ui-button-primary-background)/10 text-(--ui-button-primary-background) ring-2 ring-(--ui-button-focus-ring)',
  wait: 'border-ui-border bg-ui-muted/40 text-ui-muted-foreground',
};

export const stepTitleStatusClassName: Record<StepStatus, string> = {
  error: 'text-ui-destructive',
  finish: 'text-ui-foreground',
  process: 'text-(--ui-button-primary-background)',
  wait: 'text-ui-muted-foreground',
};

export const stepConnectorStatusClassName: Record<StepStatus, string> = {
  error: 'bg-ui-border',
  finish: 'bg-(--ui-button-primary-background)',
  process: 'bg-ui-border',
  wait: 'bg-ui-border',
};

export const stepActionClassName =
  'grid min-w-0 rounded-md text-left outline-none transition-ui-state hover:bg-(--ui-button-ghost-hover-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';
