/* eslint-disable react-refresh/only-export-components -- Badge 需要保留 Badge.Ribbon 复合组件 API。 */
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type {
  BadgeCountProps,
  BadgeDotProps,
  BadgePlacement,
  BadgeProps,
  BadgeVariant,
} from './types';

export type {
  BadgeCountProps,
  BadgeDotProps,
  BadgePlacement,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
} from './types';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-extrabold leading-none tabular-nums transition-ui-state transition-ui-transform motion-reduce:transition-none',
  {
    variants: {
      variant: {
        assist: 'bg-ui-assist text-(--ui-inverse-foreground)',
        default: 'bg-ui-destructive text-(--ui-inverse-foreground)',
        destructive: 'bg-ui-destructive text-(--ui-inverse-foreground)',
        info: 'bg-(--ui-button-primary-background) text-(--ui-inverse-foreground)',
        muted: 'bg-ui-muted-foreground text-(--ui-inverse-foreground)',
        neutral: 'bg-ui-muted text-ui-foreground',
        processing: 'bg-ui-processing text-(--ui-inverse-foreground)',
        success: 'bg-ui-success text-(--ui-inverse-foreground)',
        warning: 'bg-ui-warning text-(--ui-inverse-foreground)',
      },
      size: {
        md: 'min-h-5 min-w-6 px-1.5 text-xs',
        sm: 'min-h-[18px] min-w-[18px] px-1.5 text-xs',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'destructive',
    },
  },
);

const standaloneBadgeVariants = cva(
  'inline-flex items-center rounded font-medium leading-none transition-ui-state',
  {
    variants: {
      size: {
        md: 'px-2.5 py-1 text-sm',
        sm: 'px-2 py-0.5 text-xs',
      },
      variant: {
        assist: 'bg-ui-assist/10 text-ui-assist',
        default: 'bg-ui-muted text-ui-foreground',
        destructive: 'bg-ui-destructive/10 text-ui-destructive',
        info: 'bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground)',
        muted: 'bg-ui-muted text-ui-muted-foreground',
        neutral: 'bg-ui-muted text-ui-foreground',
        processing: 'bg-ui-processing/10 text-ui-processing',
        success: 'bg-ui-success/10 text-ui-success',
        warning: 'bg-ui-warning/10 text-ui-warning',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'neutral',
    },
  },
);

const dotVariants = cva(
  'inline-block shrink-0 rounded-full border-2 border-ui-background transition-ui-state transition-ui-transform motion-reduce:transition-none',
  {
    variants: {
      variant: {
        assist: 'bg-ui-assist',
        default: 'bg-ui-destructive',
        destructive: 'bg-ui-destructive',
        info: 'bg-(--ui-button-primary-background)',
        muted: 'bg-ui-muted-foreground',
        neutral: 'bg-ui-muted-foreground',
        processing: 'bg-ui-processing',
        success: 'bg-ui-success',
        warning: 'bg-ui-warning',
      },
      size: {
        md: 'size-3',
        sm: 'size-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'destructive',
    },
  },
);

function getDisplayCount(count: number, overflowCount: number) {
  return count > overflowCount ? `${overflowCount}+` : String(count);
}

function shouldShowBadge({
  count,
  dot,
  showZero,
}: Pick<BadgeProps, 'count' | 'dot' | 'showZero'>) {
  if (dot) return true;
  if (count == null) return true;

  return count > 0 || showZero;
}

function getOffsetStyle(
  offset: BadgeProps['offset'],
  style: React.CSSProperties | undefined,
  anchored = false,
): React.CSSProperties | undefined {
  if (offset == null) return style;

  if (anchored) {
    return {
      ...style,
      transform: `translate(calc(50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))`,
    };
  }

  return {
    ...style,
    transform: `translate(${offset[0]}px, ${offset[1]}px)`,
  };
}

function getEffectiveVariant({
  count,
  dot,
  status,
  variant,
}: Pick<BadgeProps, 'count' | 'dot' | 'status' | 'variant'>): BadgeVariant {
  if (status != null) return status;
  if (variant != null) return variant;
  if (count != null || dot) return 'destructive';

  return 'neutral';
}

function getCornerClassName(placement: BadgePlacement) {
  return placement === 'corner'
    ? 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
    : '';
}

function getDotCornerClassName(placement: BadgePlacement) {
  return placement === 'corner' ? 'absolute top-1 right-1' : '';
}

const BadgeDotView = React.forwardRef<HTMLSpanElement, BadgeDotProps>(
  (
    {
      className,
      offset,
      size = 'md',
      style,
      variant = 'destructive',
      ...props
    },
    ref,
  ) => (
    <span
      aria-hidden={props['aria-label'] == null ? true : undefined}
      className={cn(dotVariants({ size, variant }), className)}
      data-slot="badge-dot"
      ref={ref}
      style={getOffsetStyle(offset, style)}
      {...props}
    />
  ),
);

BadgeDotView.displayName = 'Badge.Dot';

const BadgeCountView = React.forwardRef<HTMLSpanElement, BadgeCountProps>(
  (
    {
      className,
      count,
      offset,
      overflowCount = 99,
      placement = 'corner',
      showZero = false,
      size = 'sm',
      style,
      variant = 'destructive',
      ...props
    },
    ref,
  ) => {
    if (!shouldShowBadge({ count, showZero })) return null;

    return (
      <span
        className={cn(
          badgeVariants({ size, variant }),
          placement === 'suffix' && 'static translate-x-0 translate-y-0',
          className,
        )}
        data-slot="badge-count"
        ref={ref}
        style={
          placement === 'corner' ? getOffsetStyle(offset, style, true) : style
        }
        {...props}
      >
        {getDisplayCount(count, overflowCount)}
      </span>
    );
  },
);

BadgeCountView.displayName = 'Badge.Count';

export const BadgeBase = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      count,
      dot = false,
      offset,
      overflowCount = 99,
      placement = 'corner',
      showZero = false,
      size = 'sm',
      status,
      style,
      variant,
      ...props
    },
    ref,
  ) => {
    const effectiveVariant = getEffectiveVariant({
      count,
      dot,
      status,
      variant,
    });
    const visible = shouldShowBadge({ count, dot, showZero });
    const hasAnchor = children != null && (dot || count != null);

    if (hasAnchor) {
      return (
        <span
          className={cn(
            'relative inline-flex min-w-0 items-center justify-center',
            placement === 'suffix' && 'items-center gap-1.5',
            className,
          )}
          data-slot="badge-anchor"
          ref={ref}
          style={style}
          {...props}
        >
          {children}
          {visible &&
            (dot ? (
              <span
                aria-hidden="true"
                className={cn(
                  dotVariants({ size, variant: effectiveVariant }),
                  getDotCornerClassName(placement),
                )}
                data-slot="badge-dot"
                style={getOffsetStyle(offset, undefined)}
              />
            ) : (
              <BadgeCountView
                aria-hidden="true"
                className={getCornerClassName(placement)}
                count={count ?? 0}
                offset={offset}
                overflowCount={overflowCount}
                placement={placement}
                showZero={showZero}
                size={size}
                variant={effectiveVariant}
              />
            ))}
        </span>
      );
    }

    if (!visible) return null;

    if (status != null && count == null && !dot) {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-sm text-ui-foreground',
            className,
          )}
          data-slot="badge-status"
          ref={ref}
          style={style}
          {...props}
        >
          <BadgeDotView size={size} variant={effectiveVariant} />
          {children}
        </span>
      );
    }

    if (dot) {
      return (
        <BadgeDotView
          className={className}
          offset={offset}
          ref={ref}
          size={size}
          style={style}
          variant={effectiveVariant}
          {...props}
        />
      );
    }

    return (
      <span
        className={cn(
          count == null
            ? standaloneBadgeVariants({
                size,
                variant: effectiveVariant,
              })
            : badgeVariants({ size, variant: effectiveVariant }),
          className,
        )}
        data-slot={count == null ? 'badge' : 'badge-count'}
        ref={ref}
        style={getOffsetStyle(offset, style)}
        {...props}
      >
        {count == null ? children : getDisplayCount(count, overflowCount)}
      </span>
    );
  },
);

BadgeBase.displayName = 'Badge';

export const Badge = Object.assign(BadgeBase, {
  Count: BadgeCountView,
  Dot: BadgeDotView,
});
