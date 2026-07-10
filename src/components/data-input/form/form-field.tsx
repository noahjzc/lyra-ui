import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { FormItemContext, useFormContext, useFormItemContext } from './context';
import type {
  FormControlProps,
  FormDescriptionProps,
  FormExtraProps,
  FormLabelProps,
  FormMessageProps,
} from './types';
import { messageStatusClassName } from './variants';

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, className, optional, required, ...props }, ref) => {
    const form = useFormContext();
    const item = React.useContext(FormItemContext);
    const showRequired = required && form.requiredMark !== false;
    const showOptional =
      (optional || (!required && form.requiredMark === 'optional')) &&
      form.requiredMark !== false;

    return (
      <label
        className={cn(
          'min-w-0 text-sm font-bold leading-8 text-ui-foreground',
          form.layout === 'horizontal' && 'text-right max-[720px]:text-left',
          form.labelWrap ? 'whitespace-normal break-words' : 'truncate',
          item?.error && 'text-ui-destructive',
          className,
        )}
        data-slot="form-label"
        htmlFor={props.htmlFor ?? item?.fieldId}
        ref={ref}
        {...props}
      >
        {children}
        {showRequired && (
          <span className="ml-0.5 text-ui-destructive" aria-hidden="true">
            *
          </span>
        )}
        {showOptional && (
          <span className="ml-1 text-xs font-medium text-ui-muted-foreground">
            可选
          </span>
        )}
      </label>
    );
  },
);

FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<HTMLElement, FormControlProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const item = useFormItemContext();
    const describedBy = [item.descriptionId, item.messageId]
      .filter(Boolean)
      .join(' ');
    const readOnly = item.readOnly ?? item.readonly;
    const controlProps = {
      'aria-describedby': describedBy || props['aria-describedby'],
      'aria-invalid': item.error ? true : props['aria-invalid'],
      className: cn(!asChild && 'min-w-0', className),
      'data-disabled': item.disabled ? true : undefined,
      'data-readonly': readOnly ? true : undefined,
      'data-slot': 'form-control',
      'data-status': item.validateStatus,
      id: props.id ?? item.fieldId,
      ...props,
    };
    const controlStateProps = {
      ...(item.disabled === undefined ? {} : { disabled: item.disabled }),
      ...(readOnly === undefined ? {} : { readOnly }),
    };

    if (asChild) {
      return <Slot {...controlProps} {...controlStateProps} ref={ref} />;
    }

    return <div {...controlProps} ref={ref as React.Ref<HTMLDivElement>} />;
  },
);

FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn('m-0 text-ui-muted-foreground text-xs leading-4', className)}
    data-slot="form-description"
    ref={ref}
    {...props}
  />
));

FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, status = 'error', ...props }, ref) => (
  <p
    className={cn(
      'm-0 text-xs leading-4',
      messageStatusClassName[status],
      className,
    )}
    data-slot="form-message"
    data-status={status}
    ref={ref}
    {...props}
  />
));

FormMessage.displayName = 'FormMessage';

export const FormExtra = React.forwardRef<HTMLDivElement, FormExtraProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn('text-ui-muted-foreground text-xs leading-4', className)}
      data-slot="form-extra"
      ref={ref}
      {...props}
    />
  ),
);

FormExtra.displayName = 'FormExtra';
