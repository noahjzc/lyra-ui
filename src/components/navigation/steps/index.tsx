import { cn } from '../../../internal/cn';
import { StepItemView } from './step-item';
import type { NormalizedStepItem, StepStatus, StepsProps } from './types';
import {
  stepsOrientationClassName,
  stepsRootClassName,
  stepsVariantClassName,
} from './variants';

export type {
  StepItem,
  StepStatus,
  StepsOrientation,
  StepsProps,
  StepsVariant,
} from './types';
export { stepStatusLabel } from './variants';

function clampCurrent(current: number, length: number) {
  if (length <= 0) return 0;
  if (!Number.isFinite(current)) return 0;

  return Math.min(Math.max(Math.floor(current), 0), length - 1);
}

function resolveStepStatus({
  current,
  index,
  itemStatus,
  status,
}: {
  current: number;
  index: number;
  itemStatus?: StepStatus;
  status?: StepStatus;
}): StepStatus {
  if (itemStatus != null) return itemStatus;
  if (index < current) return 'finish';
  if (index === current) return status ?? 'process';

  return 'wait';
}

function canClickStep({
  clickable,
  disabled,
  isCurrent,
  status,
}: {
  clickable: boolean;
  disabled?: boolean;
  isCurrent: boolean;
  status: StepStatus;
}) {
  if (!clickable || disabled) return false;
  if (status === 'finish') return true;

  return isCurrent && (status === 'process' || status === 'error');
}

function normalizeSteps({
  clickable,
  current,
  items,
  status,
}: Pick<StepsProps, 'clickable' | 'items' | 'status'> & {
  current: number;
}): NormalizedStepItem[] {
  return items.map((item, index) => {
    const stepStatus = resolveStepStatus({
      current,
      index,
      itemStatus: item.status,
      status,
    });
    const isCurrent = index === current;

    return {
      ...item,
      clickable: canClickStep({
        clickable: clickable ?? false,
        disabled: item.disabled,
        isCurrent,
        status: stepStatus,
      }),
      index,
      isCurrent,
      isLast: index === items.length - 1,
      status: stepStatus,
    };
  });
}

export function Steps({
  className,
  clickable = false,
  current = 0,
  items,
  onCurrentChange,
  orientation = 'horizontal',
  status,
  variant = 'default',
  ...props
}: StepsProps) {
  const safeCurrent = clampCurrent(current, items.length);
  const normalizedItems = normalizeSteps({
    clickable,
    current: safeCurrent,
    items,
    status,
  });

  return (
    <ol
      className={cn(
        stepsRootClassName,
        stepsOrientationClassName[orientation],
        stepsVariantClassName[variant],
        className,
      )}
      data-orientation={orientation}
      data-slot="steps"
      data-variant={variant}
      {...props}
    >
      {normalizedItems.map(item => (
        <StepItemView
          item={item}
          key={item.key ?? item.index}
          onSelect={index => onCurrentChange?.(index)}
          orientation={orientation}
          variant={variant}
        />
      ))}
    </ol>
  );
}
