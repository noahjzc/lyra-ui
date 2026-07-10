import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { CardFieldProps, CardProps, CardStatusProps } from './types';
import { cardStatusVariants, cardVariants } from './variants';

export type {
  CardFieldProps,
  CardProps,
  CardStatusProps,
  CardStatusVariant,
  CardVariant,
} from './types';

const INTERACTIVE_CARD_CHILD_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[data-card-click-ignore]',
].join(',');

function shouldIgnoreCardActivation(
  event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
) {
  if (event.defaultPrevented) return true;

  const target = event.target;

  if (!(target instanceof Element)) return false;

  const interactiveTarget = target.closest(INTERACTIVE_CARD_CHILD_SELECTOR);

  return (
    interactiveTarget !== null &&
    interactiveTarget !== event.currentTarget &&
    event.currentTarget.contains(interactiveTarget)
  );
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      asChild = false,
      children,
      className,
      disabled = false,
      disabledReason,
      interactive: interactiveProp,
      loading = false,
      onClick,
      onKeyDown,
      role,
      selected = false,
      tabIndex,
      title,
      variant = 'item',
      ...props
    },
    ref,
  ) => {
    const disabledReasonId = React.useId();
    const Comp = asChild ? Slot : 'div';
    const interactive = (interactiveProp ?? onClick != null) && onClick != null;
    const describedBy =
      disabled && disabledReason != null
        ? [props['aria-describedby'], disabledReasonId]
            .filter(Boolean)
            .join(' ')
        : props['aria-describedby'];

    function handleClick(event: React.MouseEvent<HTMLElement>) {
      if (disabled || shouldIgnoreCardActivation(event)) {
        event.preventDefault();
        return;
      }

      onClick?.(event as React.MouseEvent<HTMLDivElement>);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);

      if (
        asChild ||
        !interactive ||
        disabled ||
        shouldIgnoreCardActivation(event) ||
        (event.key !== 'Enter' && event.key !== ' ')
      ) {
        return;
      }

      event.preventDefault();
      event.currentTarget.click();
    }

    return (
      <Comp
        aria-busy={loading ? true : undefined}
        aria-describedby={describedBy || undefined}
        aria-disabled={disabled ? true : undefined}
        aria-selected={selected ? true : undefined}
        className={cn(
          cardVariants({
            disabled,
            interactive: interactive && !disabled,
            loading,
            selected,
            variant,
          }),
          className,
        )}
        data-disabled={disabled ? true : undefined}
        data-selected={selected ? true : undefined}
        data-slot="card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
        role={!asChild && interactive ? (role ?? 'button') : role}
        tabIndex={
          !asChild && interactive && !disabled ? (tabIndex ?? 0) : tabIndex
        }
        title={typeof title === 'string' ? title : undefined}
        {...props}
      >
        {loading ? <CardSkeleton /> : children}
        {disabled && disabledReason != null && (
          <span className="sr-only" id={disabledReasonId}>
            {disabledReason}
          </span>
        )}
      </Comp>
    );
  },
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex min-h-10 min-w-0 items-start justify-between gap-3 px-3.5 pt-3.5',
      className,
    )}
    data-slot="card-header"
    ref={ref}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    className={cn(
      'm-0 min-w-0 truncate text-sm font-bold leading-5',
      className,
    )}
    data-slot="card-title"
    ref={ref}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    className={cn(
      'm-0 min-w-0 truncate text-xs font-normal leading-5 text-ui-muted-foreground',
      className,
    )}
    data-slot="card-description"
    ref={ref}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardStatus = React.forwardRef<HTMLSpanElement, CardStatusProps>(
  ({ className, variant = 'info', ...props }, ref) => (
    <span
      className={cn(cardStatusVariants({ variant }), className)}
      data-slot="card-status"
      ref={ref}
      {...props}
    />
  ),
);
CardStatus.displayName = 'CardStatus';

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('min-w-0 px-3.5 py-3', className)}
    data-slot="card-body"
    ref={ref}
    {...props}
  />
));
CardBody.displayName = 'CardBody';

export const CardMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'grid min-w-0 grid-cols-1 gap-x-3 gap-y-2 text-xs leading-5 sm:grid-cols-2',
      className,
    )}
    data-slot="card-meta"
    ref={ref}
    {...props}
  />
));
CardMeta.displayName = 'CardMeta';

export const CardField = React.forwardRef<HTMLDivElement, CardFieldProps>(
  ({ className, label, value, valueClassName, children, ...props }, ref) => (
    <div
      className={cn('grid min-w-0 gap-0.5', className)}
      data-slot="card-field"
      ref={ref}
      {...props}
    >
      <span
        className="min-w-0 truncate text-xs font-normal text-ui-muted-foreground"
        data-slot="card-field-label"
      >
        {label}
      </span>
      <span
        className={cn(
          'min-w-0 truncate text-[13px] font-normal text-ui-foreground',
          valueClassName,
        )}
        data-slot="card-field-value"
      >
        {value ?? children}
      </span>
    </div>
  ),
);
CardField.displayName = 'CardField';

export const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn('flex shrink-0 items-center gap-1.5', className)}
    data-card-click-ignore=""
    data-slot="card-actions"
    ref={ref}
    {...props}
  />
));
CardActions.displayName = 'CardActions';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex min-h-10 min-w-0 items-center justify-between gap-3 border-ui-border/70 border-t px-3.5 py-2 text-xs text-ui-muted-foreground',
      className,
    )}
    data-slot="card-footer"
    ref={ref}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

function CardSkeleton() {
  return (
    <div className="grid gap-3 p-3.5" data-slot="card-loading">
      <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-ui-muted motion-reduce:animate-none" />
      <div className="h-2.5 w-full animate-pulse rounded-full bg-ui-muted motion-reduce:animate-none" />
      <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-ui-muted motion-reduce:animate-none" />
    </div>
  );
}
