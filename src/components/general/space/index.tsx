import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Children } from 'react';
import { cn } from '../../../internal/cn';

type SpaceSizeToken = 4 | 6 | 8 | 12 | 16 | 20;

export type SpaceSize =
  | SpaceSizeToken
  | 'small'
  | 'middle'
  | 'large'
  | [
      SpaceSizeToken | 'small' | 'middle' | 'large',
      SpaceSizeToken | 'small' | 'middle' | 'large',
    ];

const SPACE_SIZE_MAP = {
  small: 4,
  middle: 8,
  large: 12,
} as const;

const spaceVariants = cva(
  'gap-x-(--ui-space-column-gap) gap-y-(--ui-space-row-gap)',
  {
    variants: {
      direction: {
        horizontal: 'inline-flex flex-row',
        vertical: 'inline-flex flex-col',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      direction: 'horizontal',
      align: 'center',
      justify: 'start',
      wrap: false,
    },
  },
);

export interface SpaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spaceVariants> {
  separator?: React.ReactNode;
  /** 单值同时控制横纵间距，数组格式为 [rowGap, columnGap]。 */
  size?: SpaceSize;
}

function resolveSize(size: SpaceSize = 8) {
  const [rowGap, columnGap] = Array.isArray(size) ? size : [size, size];

  return {
    rowGap: resolveSizeValue(rowGap),
    columnGap: resolveSizeValue(columnGap),
  };
}

function resolveSizeValue(size: Exclude<SpaceSize, unknown[]>): string {
  const value = typeof size === 'number' ? size : SPACE_SIZE_MAP[size];

  return `${value}px`;
}

function renderChildrenWithSeparator(
  children: React.ReactNode,
  separator: React.ReactNode,
) {
  const items = Children.toArray(children);

  return items.flatMap((child, index) => {
    if (index === items.length - 1) return child;

    const separatorKey = React.isValidElement(child) ? child.key : index;

    return [
      child,
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center"
        data-slot="space-separator"
        key={`space-separator-${separatorKey}`}
      >
        {separator}
      </span>,
    ];
  });
}

export const Space = React.forwardRef<HTMLDivElement, SpaceProps>(
  (
    {
      align = 'center',
      children,
      className,
      direction = 'horizontal',
      justify = 'start',
      separator,
      size,
      style,
      wrap = false,
      ...props
    },
    ref,
  ) => {
    const defaultSize = direction === 'vertical' ? 12 : 8;
    const { columnGap, rowGap } = resolveSize(size ?? defaultSize);
    const content =
      separator == null
        ? children
        : renderChildrenWithSeparator(children, separator);

    return (
      <div
        className={cn(
          spaceVariants({ align, direction, justify, wrap }),
          className,
        )}
        data-slot="space"
        ref={ref}
        style={
          {
            '--ui-space-column-gap': columnGap,
            '--ui-space-row-gap': rowGap,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {content}
      </div>
    );
  },
);

Space.displayName = 'Space';

// TODO: 后续补充 Compact，用于按钮连体、输入框加按钮等紧贴组合。
