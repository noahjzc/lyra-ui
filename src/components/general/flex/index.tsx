import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { type GapSize, resolveGap } from '../shared/gap';

const flexVariants = cva(
  'min-w-0 gap-x-(--ui-flex-column-gap) gap-y-(--ui-flex-row-gap)',
  {
    variants: {
      direction: {
        row: 'flex-row',
        column: 'flex-col',
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
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
      inline: {
        true: 'inline-flex',
        false: 'flex',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      grow: {
        true: 'flex-1',
        false: '',
      },
    },
    defaultVariants: {
      direction: 'row',
      align: 'stretch',
      justify: 'start',
      wrap: false,
      inline: false,
      fullWidth: false,
      grow: false,
    },
  },
);

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  gap?: GapSize;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      align = 'stretch',
      className,
      direction = 'row',
      fullWidth = false,
      gap = 8,
      grow = false,
      inline = false,
      justify = 'start',
      style,
      wrap = false,
      ...props
    },
    ref,
  ) => {
    const { columnGap, rowGap } = resolveGap(gap);

    return (
      <div
        className={cn(
          flexVariants({
            align,
            direction,
            fullWidth,
            grow,
            inline,
            justify,
            wrap,
          }),
          className,
        )}
        data-slot="flex"
        ref={ref}
        style={
          {
            '--ui-flex-column-gap': columnGap,
            '--ui-flex-row-gap': rowGap,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

Flex.displayName = 'Flex';
