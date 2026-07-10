import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border text-sm font-semibold shadow-none outline-none transition-ui-state transition-ui-transform hover:shadow-sm active:translate-y-px active:shadow-inner focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:translate-y-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:shadow-none',
  {
    variants: {
      variant: {
        default:
          'border-(--ui-button-default-border) bg-(--ui-button-default-background) text-(--ui-button-default-foreground) hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) hover:text-(--ui-button-default-hover-foreground) active:border-(--ui-button-default-active-border) active:bg-(--ui-button-default-active-background) active:text-(--ui-button-default-active-foreground) focus-visible:border-(--ui-button-focus-border)',
        primary:
          'border-(--ui-button-primary-border) bg-(--ui-button-primary-background) text-(--ui-button-primary-foreground) hover:border-(--ui-button-primary-hover-border) hover:bg-(--ui-button-primary-hover-background) active:border-(--ui-button-primary-active-border) active:bg-(--ui-button-primary-active-background) focus-visible:border-(--ui-button-focus-border)',
        ghost:
          'border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground) hover:border-(--ui-button-ghost-hover-border) hover:bg-(--ui-button-ghost-hover-background) active:border-(--ui-button-ghost-active-border) active:bg-(--ui-button-ghost-active-background) active:text-(--ui-button-ghost-active-foreground) focus-visible:border-(--ui-button-focus-border)',
        text: 'border-transparent bg-transparent text-(--ui-button-text-foreground) hover:bg-(--ui-button-text-hover-background) active:bg-(--ui-button-text-active-background) focus-visible:border-transparent',
        link: 'h-auto border-transparent bg-transparent p-0 text-(--ui-button-link-foreground) hover:bg-transparent hover:text-(--ui-button-link-hover-foreground) hover:underline active:bg-transparent active:text-(--ui-button-link-active-foreground) focus-visible:border-transparent',
        danger:
          'border-(--ui-button-danger-border) bg-(--ui-button-danger-background) text-(--ui-button-danger-foreground) hover:border-(--ui-button-danger-hover-border) hover:bg-(--ui-button-danger-hover-background) hover:text-(--ui-button-danger-hover-foreground) active:border-(--ui-button-danger-active-border) active:bg-(--ui-button-danger-active-background) active:text-(--ui-button-danger-active-foreground) focus-visible:border-(--ui-button-danger-focus-border) focus-visible:ring-(--ui-button-danger-focus-ring)',
        warning:
          'border-(--ui-button-warning-border) bg-(--ui-button-warning-background) text-(--ui-button-warning-foreground) hover:border-(--ui-button-warning-hover-border) hover:bg-(--ui-button-warning-hover-background) active:border-(--ui-button-warning-active-border) active:bg-(--ui-button-warning-active-background) active:text-(--ui-button-warning-active-foreground) focus-visible:border-(--ui-button-warning-focus-border) focus-visible:ring-(--ui-button-warning-focus-ring)',
      },
      size: {
        small: 'h-7 px-2.5 text-xs',
        middle: 'h-8 px-3',
        large: 'h-9 px-3.5',
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: 'small',
        className: 'w-7 px-0',
      },
      {
        iconOnly: true,
        size: 'middle',
        className: 'w-8 px-0',
      },
      {
        iconOnly: true,
        size: 'large',
        className: 'w-9 px-0',
      },
    ],
    defaultVariants: {
      iconOnly: false,
      variant: 'default',
      size: 'middle',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 使用子元素承载按钮样式，适合链接或路由组件。 */
  asChild?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      icon,
      iconOnly = false,
      iconPosition = 'start',
      loading = false,
      onClick,
      variant,
      size,
      asChild = false,
      type,
      ...props
    },
    ref,
  ) => {
    const loadingIcon = (
      <Loader2
        aria-hidden="true"
        className="size-3.5 animate-spin motion-reduce:animate-none"
      />
    );
    const startIcon = iconOnly
      ? null
      : loading
        ? loadingIcon
        : iconPosition === 'start'
          ? icon
          : null;
    const endIcon =
      !iconOnly && !loading && iconPosition === 'end' ? icon : null;
    const disabledState = disabled || loading;
    const classNames = cn(
      buttonVariants({ iconOnly, variant, size }),
      loading && 'cursor-wait',
      className,
    );

    if (asChild) {
      const child = React.Children.only(children);
      const childElement = React.isValidElement<{
        children?: React.ReactNode;
        onClick?: React.MouseEventHandler<HTMLElement>;
      }>(child)
        ? child
        : null;
      const childChildren = childElement ? childElement.props.children : child;
      const content = iconOnly
        ? loading
          ? loadingIcon
          : (icon ?? childChildren)
        : childChildren;
      const slottedChild = childElement
        ? React.cloneElement(
            childElement,
            {
              onClick: event => {
                if (disabledState) {
                  event.preventDefault();
                  event.stopPropagation();
                  return;
                }

                childElement.props.onClick?.(event);
              },
            },
            startIcon,
            content,
            endIcon,
          )
        : child;

      return (
        <Slot
          aria-busy={loading || undefined}
          aria-disabled={disabledState ? true : undefined}
          className={classNames}
          onClick={event => {
            if (disabledState) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
          }}
          ref={ref}
          tabIndex={disabledState ? -1 : props.tabIndex}
          {...props}
        >
          {slottedChild}
        </Slot>
      );
    }

    const content = iconOnly
      ? loading
        ? loadingIcon
        : (icon ?? children)
      : children;

    return (
      <button
        aria-busy={loading || undefined}
        className={classNames}
        disabled={disabledState}
        onClick={onClick}
        ref={ref}
        type={type ?? 'button'}
        {...props}
      >
        {startIcon}
        {content}
        {endIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export interface IconButtonProps extends Omit<ButtonProps, 'iconOnly'> {
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', ...props }, ref) => (
    <Button iconOnly ref={ref} variant={variant} {...props} />
  ),
);

IconButton.displayName = 'IconButton';
