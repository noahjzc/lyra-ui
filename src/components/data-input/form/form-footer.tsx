import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useFormContext } from './context';
import type { FormFooterProps } from './types';
import { columnWidth } from './utils';
import { footerJustifyClassName } from './variants';

export const FormFooter = React.forwardRef<HTMLDivElement, FormFooterProps>(
  (
    { alignWithControls = true, className, justify = 'start', style, ...props },
    ref,
  ) => {
    const form = useFormContext();
    const labelWidth = columnWidth(form.labelCol) ?? '25%';

    return (
      <div
        className={cn(
          'flex min-w-0 items-center gap-2',
          form.layout === 'horizontal' && alignWithControls && 'pl-0',
          form.layout === 'inline' && 'self-end',
          footerJustifyClassName[justify],
          className,
        )}
        data-slot="form-footer"
        ref={ref}
        style={
          {
            marginLeft:
              form.layout === 'horizontal' && alignWithControls
                ? labelWidth
                : undefined,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

FormFooter.displayName = 'FormFooter';
