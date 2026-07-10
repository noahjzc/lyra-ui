import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../internal/cn';

const textVariants = cva('m-0 tracking-normal', {
  variants: {
    variant: {
      body: 'text-sm leading-[22px] font-normal',
      compact: 'text-sm leading-[22px] font-bold',
      caption: 'text-xs leading-[18px] font-normal',
      mini: 'text-xs leading-4 font-bold',
      label: 'text-sm leading-5 font-bold',
    },
    tone: {
      primary: 'text-ui-foreground',
      secondary: 'text-ui-muted-foreground',
      muted: 'text-ui-muted-foreground',
      link: 'text-(--color-primary) hover:text-(--color-primary-hover)',
      danger: 'text-ui-destructive',
      success: 'text-ui-success',
      warning: 'text-ui-warning',
    },
    truncate: {
      true: 'overflow-hidden text-ellipsis whitespace-nowrap',
      false: '',
    },
    numeric: {
      true: 'font-[Inter,_DIN_Alternate,_SFMono-Regular,_Consolas,_monospace] tabular-nums',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'primary',
    truncate: false,
    numeric: false,
  },
});

const titleVariants = cva('m-0 tracking-normal text-ui-foreground', {
  variants: {
    level: {
      1: 'text-[28px] leading-9 font-extrabold',
      2: 'text-2xl leading-8 font-extrabold',
      3: 'text-xl leading-7 font-extrabold',
      4: 'text-base leading-6 font-bold',
    },
    truncate: {
      true: 'overflow-hidden text-ellipsis whitespace-nowrap',
      false: '',
    },
  },
  defaultVariants: {
    level: 4,
    truncate: false,
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'span' | 'div' | 'label' | 'strong';
  htmlFor?: string;
}

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    Pick<VariantProps<typeof textVariants>, 'tone' | 'numeric'> {
  rows?: number;
}

export type CodeProps = React.HTMLAttributes<HTMLElement>;

export type KbdProps = React.HTMLAttributes<HTMLElement>;

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Comp = 'span',
      className,
      numeric,
      tone,
      truncate,
      variant,
      ...props
    },
    ref,
  ) =>
    React.createElement(Comp, {
      ...props,
      className: cn(
        textVariants({ numeric, tone, truncate, variant }),
        className,
      ),
      'data-slot': 'typography-text',
      ref,
    }),
);

Text.displayName = 'Text';

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ as, className, level = 4, truncate, ...props }, ref) => {
    const Comp = as ?? (`h${level}` as NonNullable<TitleProps['as']>);

    return (
      <Comp
        className={cn(titleVariants({ level, truncate }), className)}
        data-slot="typography-title"
        ref={ref}
        {...props}
      />
    );
  },
);

Title.displayName = 'Title';

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, numeric, rows, style, tone = 'secondary', ...props }, ref) => (
    <p
      className={cn(
        textVariants({ numeric, tone, variant: 'body' }),
        rows != null &&
          'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]',
        className,
      )}
      data-slot="typography-paragraph"
      data-rows={rows}
      ref={ref}
      style={
        {
          WebkitLineClamp: rows,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  ),
);

Paragraph.displayName = 'Paragraph';

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, ...props }, ref) => (
    <code
      className={cn(
        'rounded bg-ui-muted px-1.5 py-0.5 font-mono text-xs text-ui-foreground',
        className,
      )}
      data-slot="typography-code"
      ref={ref}
      {...props}
    />
  ),
);

Code.displayName = 'Code';

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-ui-border bg-ui-background px-1.5 font-mono text-[11px] text-ui-muted-foreground shadow-sm',
        className,
      )}
      data-slot="typography-kbd"
      ref={ref}
      {...props}
    />
  ),
);

Kbd.displayName = 'Kbd';
