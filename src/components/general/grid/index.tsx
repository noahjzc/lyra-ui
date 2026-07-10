import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { type GapSize, resolveGap } from '../shared/gap';

const gridVariants = cva(
  'grid gap-x-(--ui-grid-column-gap) gap-y-(--ui-grid-row-gap)',
  {
    variants: {
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-items-start',
        center: 'justify-items-center',
        end: 'justify-items-end',
        stretch: 'justify-items-stretch',
      },
      dense: {
        true: 'grid-flow-dense',
        false: '',
      },
    },
    defaultVariants: {
      align: 'stretch',
      justify: 'stretch',
      dense: false,
    },
  },
);

const gridItemVariants = cva('min-w-0', {
  variants: {
    span: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      full: 'col-span-full',
    },
  },
  defaultVariants: {
    span: 1,
  },
});

const responsiveClassName = cn(
  'sm:[grid-template-columns:var(--ui-grid-columns-sm)]',
  'md:[grid-template-columns:var(--ui-grid-columns-md)]',
  'lg:[grid-template-columns:var(--ui-grid-columns-lg)]',
  'xl:[grid-template-columns:var(--ui-grid-columns-xl)]',
  '2xl:[grid-template-columns:var(--ui-grid-columns-2xl)]',
);

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  autoFit?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | string;
  gap?: GapSize;
  minColumnWidth?: number | string;
  /** 按 Tailwind 断点覆盖列模板，base 会作为默认列模板。 */
  responsive?: Partial<
    Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', GridProps['columns']>
  >;
}

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {}

function resolveColumns({
  autoFit,
  columns = 1,
  minColumnWidth = 240,
}: Pick<GridProps, 'autoFit' | 'columns' | 'minColumnWidth'>) {
  if (autoFit) {
    const minWidth =
      typeof minColumnWidth === 'number'
        ? `${minColumnWidth}px`
        : minColumnWidth;

    return `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
  }

  if (typeof columns === 'number') {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }

  return columns;
}

function resolveResponsiveColumns({
  autoFit,
  minColumnWidth,
  responsive,
}: Pick<GridProps, 'autoFit' | 'minColumnWidth' | 'responsive'>) {
  if (!responsive) return {};

  return Object.fromEntries(
    (['sm', 'md', 'lg', 'xl', '2xl'] as const)
      .filter(breakpoint => responsive[breakpoint] != null)
      .map(breakpoint => [
        `--ui-grid-columns-${breakpoint}`,
        resolveColumns({
          autoFit,
          columns: responsive[breakpoint],
          minColumnWidth,
        }),
      ]),
  ) as Record<string, string>;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      align = 'stretch',
      autoFit = false,
      className,
      columns = 1,
      dense = false,
      gap = [10, 12],
      justify = 'stretch',
      minColumnWidth = 240,
      responsive,
      style,
      ...props
    },
    ref,
  ) => {
    const { columnGap, rowGap } = resolveGap(gap);
    const baseColumns = responsive?.base ?? columns;

    return (
      <div
        className={cn(
          gridVariants({ align, dense, justify }),
          responsive && responsiveClassName,
          className,
        )}
        data-slot="grid"
        ref={ref}
        style={
          {
            '--ui-grid-column-gap': columnGap,
            '--ui-grid-row-gap': rowGap,
            ...resolveResponsiveColumns({
              autoFit,
              minColumnWidth,
              responsive,
            }),
            gridTemplateColumns: resolveColumns({
              autoFit,
              columns: baseColumns,
              minColumnWidth,
            }),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

Grid.displayName = 'Grid';

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, ...props }, ref) => (
    <div
      className={cn(gridItemVariants({ span }), className)}
      data-slot="grid-item"
      ref={ref}
      {...props}
    />
  ),
);

GridItem.displayName = 'GridItem';
