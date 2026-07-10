import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../internal/cn';

const lineVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-5 w-px self-center',
    },
    variant: {
      soft: 'border-0 bg-(--ui-divider-soft)',
      default: 'border-0 bg-(--ui-divider-default)',
      strong: 'border-0 bg-(--ui-divider-strong)',
      dashed:
        'border-dashed bg-transparent [border-color:var(--ui-divider-dashed)]',
      section: 'border-0 bg-(--ui-divider-default)',
      edge: 'border-0 bg-(--ui-divider-default) shadow-(--ui-divider-shadow)',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      variant: 'dashed',
      className: 'border-t',
    },
    {
      orientation: 'vertical',
      variant: 'dashed',
      className: 'border-l',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'soft',
  },
});

const wrapperVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'my-3 flex w-full items-center',
      vertical: 'mx-2 inline-flex h-5 items-center',
    },
    variant: {
      soft: '',
      default: '',
      strong: '',
      dashed: '',
      section: 'my-4',
      edge: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'soft',
  },
});

const textLineVariants = cva('h-px min-w-0 flex-1 shrink', {
  variants: {
    variant: {
      soft: 'border-0 bg-(--ui-divider-soft)',
      default: 'border-0 bg-(--ui-divider-default)',
      strong: 'border-0 bg-(--ui-divider-strong)',
      dashed:
        'border-t border-dashed bg-transparent [border-color:var(--ui-divider-dashed)]',
      section: 'border-0 bg-(--ui-divider-default)',
      edge: 'border-0 bg-(--ui-divider-default) shadow-(--ui-divider-shadow)',
    },
  },
  defaultVariants: {
    variant: 'soft',
  },
});

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    VariantProps<typeof lineVariants> {
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
  decorative?: boolean;
  inset?: boolean | number | string;
}

function resolveInsetStyle(
  inset: DividerProps['inset'],
): React.CSSProperties | undefined {
  if (!inset) return undefined;

  const marginInlineStart =
    inset === true ? '36px' : typeof inset === 'number' ? `${inset}px` : inset;

  return { marginInlineStart };
}

function resolveDividerStyle(
  inset: DividerProps['inset'],
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  return {
    ...resolveInsetStyle(inset),
    ...style,
  };
}

const TextDivider = React.forwardRef<HTMLElement, DividerProps>(
  (
    {
      align = 'center',
      children,
      className,
      decorative,
      inset,
      style,
      variant,
      ...props
    },
    ref,
  ) => {
    const beforeClassName = cn(
      textLineVariants({ variant }),
      align === 'left' && 'max-w-9',
    );
    const afterClassName = cn(
      textLineVariants({ variant }),
      align === 'right' && 'max-w-9',
    );

    return (
      <div
        aria-hidden={decorative ? true : undefined}
        className={cn(
          wrapperVariants({ orientation: 'horizontal', variant }),
          'gap-2.5 text-xs font-semibold text-ui-muted-foreground',
          className,
        )}
        ref={ref as React.Ref<HTMLDivElement>}
        style={resolveDividerStyle(inset, style)}
        {...props}
      >
        <span aria-hidden="true" className={beforeClassName} />
        <span className="shrink-0">{children}</span>
        <span aria-hidden="true" className={afterClassName} />
      </div>
    );
  },
);

TextDivider.displayName = 'TextDivider';

export const Divider = React.forwardRef<HTMLElement, DividerProps>(
  (
    {
      align = 'center',
      children,
      className,
      decorative,
      inset,
      orientation = 'horizontal',
      style,
      variant = 'soft',
      ...props
    },
    ref,
  ) => {
    const isDecorative = decorative ?? !children;

    if (children && orientation === 'horizontal') {
      return (
        <TextDivider
          align={align}
          className={className}
          decorative={isDecorative}
          inset={inset}
          ref={ref}
          style={style}
          variant={variant}
          {...props}
        >
          {children}
        </TextDivider>
      );
    }

    if (isDecorative) {
      return (
        <div
          aria-hidden="true"
          className={cn(wrapperVariants({ orientation, variant }), className)}
          ref={ref as React.Ref<HTMLDivElement>}
          style={resolveDividerStyle(inset, style)}
          {...props}
        >
          <div
            className={lineVariants({ orientation, variant })}
            data-slot="divider-line"
          />
        </div>
      );
    }

    return (
      <hr
        aria-orientation={orientation ?? undefined}
        className={cn(
          wrapperVariants({ orientation, variant }),
          lineVariants({ orientation, variant }),
          className,
        )}
        ref={ref as React.Ref<HTMLHRElement>}
        style={resolveDividerStyle(inset, style)}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
