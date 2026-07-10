import { AlertCircle, Check } from 'lucide-react';
import { cn } from '../../../internal/cn';
import type {
  NormalizedStepItem,
  StepsOrientation,
  StepsVariant,
} from './types';
import {
  stepActionClassName,
  stepConnectorStatusClassName,
  stepItemBaseClassName,
  stepItemOrientationClassName,
  stepNodeSizeClassName,
  stepNodeStatusClassName,
  stepStatusLabel,
  stepTitleStatusClassName,
} from './variants';

interface StepItemViewProps {
  item: NormalizedStepItem;
  onSelect: (index: number) => void;
  orientation: StepsOrientation;
  variant: StepsVariant;
}

const horizontalMobileTrackClassName: Record<StepsVariant, string> = {
  compact: 'max-[760px]:grid-cols-[24px_minmax(0,1fr)]',
  default: 'max-[760px]:grid-cols-[28px_minmax(0,1fr)]',
  progress: 'max-[760px]:grid-cols-[24px_minmax(0,1fr)]',
};

const horizontalMobileConnectorClassName: Record<StepsVariant, string> = {
  compact:
    'max-[760px]:top-7 max-[760px]:bottom-1 max-[760px]:left-[11px] max-[760px]:h-auto max-[760px]:w-0.5',
  default:
    'max-[760px]:top-8 max-[760px]:bottom-1 max-[760px]:left-[13px] max-[760px]:h-auto max-[760px]:w-0.5',
  progress:
    'max-[760px]:top-7 max-[760px]:bottom-1 max-[760px]:left-[11px] max-[760px]:h-auto max-[760px]:w-0.5',
};

function StepNode({
  item,
  variant,
}: {
  item: NormalizedStepItem;
  variant: StepsVariant;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative z-10 inline-grid shrink-0 place-items-center rounded-full border font-extrabold',
        stepNodeSizeClassName[variant],
        stepNodeStatusClassName[item.status],
      )}
      data-slot="step-node"
    >
      {item.icon ??
        (item.status === 'finish' ? (
          <Check className="size-3.5" />
        ) : item.status === 'error' ? (
          <AlertCircle className="size-3.5" />
        ) : (
          item.index + 1
        ))}
    </span>
  );
}

function StepConnector({
  item,
  orientation,
  variant,
}: {
  item: NormalizedStepItem;
  orientation: StepsOrientation;
  variant: StepsVariant;
}) {
  if (item.isLast) return null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute',
        stepConnectorStatusClassName[item.status],
        orientation === 'horizontal'
          ? cn(
              'top-3.5 right-3 left-10 h-0.5',
              horizontalMobileConnectorClassName[variant],
            )
          : 'top-8 bottom-1 left-[13px] w-0.5',
        variant !== 'default' &&
          orientation === 'horizontal' &&
          'top-3 right-2 left-9',
      )}
      data-slot="step-connector"
    />
  );
}

function StepContent({
  item,
  variant,
}: {
  item: NormalizedStepItem;
  variant: StepsVariant;
}) {
  const hideDescription = variant === 'compact' || variant === 'progress';
  const disabledLabel = item.disabled ? '，已禁用' : '';

  return (
    <>
      <StepNode item={item} variant={variant} />
      <span className="grid min-w-0 gap-1" data-slot="step-copy">
        <span className="sr-only">
          {stepStatusLabel[item.status]}
          {disabledLabel}
        </span>
        <span
          className={cn(
            'min-w-0 overflow-hidden text-ellipsis font-extrabold leading-5',
            variant === 'default' ? 'line-clamp-2 text-sm' : 'truncate text-xs',
            stepTitleStatusClassName[item.status],
          )}
          data-slot="step-title"
        >
          {item.title}
        </span>
        {item.description != null && !hideDescription && (
          <span
            className="line-clamp-2 min-w-0 text-xs leading-5 text-ui-muted-foreground"
            data-slot="step-description"
          >
            {item.description}
          </span>
        )}
      </span>
    </>
  );
}

export function StepItemView({
  item,
  onSelect,
  orientation,
  variant,
}: StepItemViewProps) {
  const content = <StepContent item={item} variant={variant} />;
  const horizontalContentClassName = cn(
    'grid grid-rows-[auto_auto] gap-2 max-[760px]:grid-rows-none',
    horizontalMobileTrackClassName[variant],
    variant !== 'default' && 'grid-rows-[auto_auto] gap-1',
  );

  return (
    <li
      aria-current={item.isCurrent ? 'step' : undefined}
      aria-disabled={item.disabled ? 'true' : undefined}
      className={cn(
        stepItemBaseClassName,
        stepItemOrientationClassName[orientation],
        orientation === 'horizontal' && horizontalMobileTrackClassName[variant],
      )}
      data-clickable={item.clickable ? 'true' : undefined}
      data-disabled={item.disabled ? 'true' : undefined}
      data-slot="step-item"
      data-status={item.status}
    >
      {item.clickable ? (
        <button
          className={cn(
            stepActionClassName,
            'col-span-full',
            orientation === 'horizontal'
              ? horizontalContentClassName
              : 'grid grid-cols-[28px_minmax(0,1fr)] gap-2',
          )}
          onClick={() => onSelect(item.index)}
          type="button"
        >
          {content}
        </button>
      ) : (
        <div
          className={cn(
            'col-span-full grid min-w-0',
            orientation === 'horizontal'
              ? horizontalContentClassName
              : 'grid-cols-[28px_minmax(0,1fr)] gap-2',
          )}
        >
          {content}
        </div>
      )}
      <StepConnector item={item} orientation={orientation} variant={variant} />
    </li>
  );
}
