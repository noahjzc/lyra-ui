/* eslint-disable react-refresh/only-export-components -- Select 需要按 Radix slot 形式导出复合组件。 */
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { SelectTriggerProps } from './types';
import { selectItemClassName, selectTriggerVariants } from './variants';

const SelectOpenContext = React.createContext<boolean | undefined>(undefined);

export function Select({
  defaultOpen = false,
  onOpenChange,
  open,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open != null;
  const mergedOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <SelectOpenContext.Provider value={mergedOpen}>
      <SelectPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SelectOpenContext.Provider>
  );
}
Select.displayName = 'Select';

export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      disabled,
      invalid,
      size = 'middle',
      variant = 'outlined',
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      className={cn(
        selectTriggerVariants({ size, variant }),
        variant === 'underlined' && 'px-0',
        className,
      )}
      data-disabled={disabled ? true : undefined}
      data-invalid={invalid ? true : undefined}
      data-slot="select-trigger"
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 text-ui-muted-foreground transition-ui-transform group-data-[state=open]:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = 'popper',
      sideOffset = 4,
      style,
      ...props
    },
    ref,
  ) => {
    const open = React.useContext(SelectOpenContext);
    const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.popover, ref, open);

    return (
      <SelectPrimitive.Portal>
        <div
          data-slot="select-portal-layer"
          style={{ position: 'relative', zIndex }}
        >
          <SelectPrimitive.Content
            className={cn(
              'relative max-h-80 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-(--ui-input-border) bg-ui-background text-ui-foreground shadow-ui-elevation-2 data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in',
              className,
            )}
            data-slot="select-content"
            position={position}
            ref={layerRef}
            sideOffset={sideOffset}
            style={{ zIndex, ...style }}
            {...props}
          >
            <SelectPrimitive.Viewport className="grid gap-1 p-2">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </div>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    description?: React.ReactNode;
    disabledReason?: React.ReactNode;
  }
>(({ className, children, description, disabledReason, ...props }, ref) => (
  <SelectPrimitive.Item
    className={cn(selectItemClassName, description && 'min-h-11', className)}
    data-slot="select-item"
    ref={ref}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate">{children}</span>
        {description != null && (
          <span className="truncate text-xs font-medium text-ui-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </SelectPrimitive.ItemText>
    {disabledReason != null && (
      <span className="shrink-0 text-xs text-ui-muted-foreground">
        {disabledReason}
      </span>
    )}
    <SelectPrimitive.ItemIndicator className="ml-auto text-(--ui-input-focus-border)">
      <Check aria-hidden="true" className="size-3.5" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    className={cn(
      'px-2 py-1.5 text-xs font-extrabold text-ui-muted-foreground',
      className,
    )}
    data-slot="select-label"
    ref={ref}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-ui-border', className)}
    data-slot="select-separator"
    ref={ref}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
