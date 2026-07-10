import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useDisclosureMotion } from '../../../internal/disclosure-motion';
import type { CollapseItem, CollapseProps } from './types';
import {
  getItemDomId,
  getNextValue,
  normalizeValue,
  serializeValue,
} from './utils';
import {
  collapseHeaderClassName,
  collapseItemClassName,
  collapsePanelContentMotionClassName,
  collapsePanelMotionClassName,
  collapseSizeClassName,
  collapseVariants,
} from './variants';

export type {
  CollapseItem,
  CollapseProps,
  CollapseSize,
  CollapseType,
  CollapseValue,
  CollapseVariant,
} from './types';

export function Collapse({
  className,
  collapsible = true,
  defaultValue,
  items,
  onValueChange,
  size = 'middle',
  type = 'single',
  value,
  variant = 'bordered',
  ...props
}: CollapseProps) {
  const idPrefix = React.useId();
  const [internalValue, setInternalValue] = React.useState(() =>
    normalizeValue(defaultValue, type),
  );
  const openKeys = normalizeValue(value ?? internalValue, type);
  const disclosureMotion = useDisclosureMotion(openKeys);
  const triggerRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const enabledItemKeys = items
    .filter(item => !item.disabled)
    .map(item => item.key);

  function focusItemByKey(itemKey: string) {
    triggerRefs.current.get(itemKey)?.focus();
  }

  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    itemKey: string,
  ) {
    const currentIndex = enabledItemKeys.indexOf(itemKey);

    if (currentIndex === -1) return;

    if (event.key === 'Home') {
      event.preventDefault();
      focusItemByKey(enabledItemKeys[0]);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusItemByKey(enabledItemKeys[enabledItemKeys.length - 1]);
      return;
    }

    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowLeft'
    ) {
      return;
    }

    event.preventDefault();

    const direction =
      event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + enabledItemKeys.length) %
      enabledItemKeys.length;

    focusItemByKey(enabledItemKeys[nextIndex]);
  }

  function toggleItem(item: CollapseItem) {
    if (item.disabled) return;

    const nextValue = getNextValue({
      collapsible,
      itemKey: item.key,
      openKeys,
      type,
    });

    if (value == null) {
      setInternalValue(nextValue);
    }

    onValueChange?.(serializeValue(nextValue, type));
  }

  function handleTriggerClick(
    event: React.MouseEvent<HTMLButtonElement>,
    item: CollapseItem,
  ) {
    toggleItem(item);

    if (event.detail > 0) {
      event.currentTarget.blur();
    }
  }

  return (
    <div
      className={cn(collapseVariants({ variant }), className)}
      data-slot="collapse"
      {...props}
    >
      {items.map((item, itemIndex) => {
        const {
          open: isOpen,
          present: isPresent,
          visible: isVisible,
        } = disclosureMotion.getDisclosureState(item.key);
        const triggerId = getItemDomId(
          idPrefix,
          item.key,
          itemIndex,
          'trigger',
        );
        const panelId = getItemDomId(idPrefix, item.key, itemIndex, 'panel');

        return (
          <section
            className={cn(
              'min-w-0',
              collapseItemClassName[variant],
              item.disabled && 'bg-ui-muted/40',
            )}
            data-open={isOpen ? true : undefined}
            data-slot="collapse-item"
            key={item.key}
          >
            <div
              className={cn(
                'flex min-w-0 items-center gap-2 transition-ui-state focus-within:ring-2 focus-within:ring-(--ui-button-focus-ring) motion-reduce:transition-none',
                collapseHeaderClassName[variant],
                !item.disabled &&
                  'hover:bg-(--ui-button-ghost-hover-background)',
                collapseSizeClassName[size].header,
              )}
              data-slot="collapse-header"
            >
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className={cn(
                  'flex min-w-0 flex-1 items-center gap-2 rounded-md text-left outline-none transition-ui-state disabled:cursor-not-allowed motion-reduce:transition-none',
                  collapseSizeClassName[size].trigger,
                )}
                disabled={item.disabled}
                id={triggerId}
                onKeyDown={event => handleTriggerKeyDown(event, item.key)}
                onClick={event => handleTriggerClick(event, item)}
                ref={node => {
                  if (node == null) {
                    triggerRefs.current.delete(item.key);
                    return;
                  }

                  triggerRefs.current.set(item.key, node);
                }}
                type="button"
              >
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    'size-4 shrink-0 text-ui-muted-foreground transition-ui-transform motion-reduce:transition-none',
                    isOpen && 'rotate-90',
                  )}
                />
                <span className="grid min-w-0 gap-0.5">
                  <span
                    className={cn(
                      'truncate text-sm font-bold',
                      item.disabled
                        ? 'text-ui-muted-foreground'
                        : 'text-ui-foreground',
                    )}
                    data-slot="collapse-title"
                  >
                    {item.title}
                  </span>
                  {item.summary != null && (
                    <span className="truncate text-xs font-normal text-ui-muted-foreground">
                      {item.summary}
                    </span>
                  )}
                </span>
              </button>
              {item.extra != null && (
                <div className="shrink-0" data-slot="collapse-extra">
                  {item.extra}
                </div>
              )}
            </div>
            {isPresent && (
              <div
                className={cn(
                  collapsePanelMotionClassName,
                  isVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
                data-slot="collapse-panel-motion"
                onTransitionEnd={event =>
                  disclosureMotion.handleDisclosureTransitionEnd(
                    event,
                    item.key,
                  )
                }
              >
                <section
                  aria-busy={isOpen && item.loading ? true : undefined}
                  aria-hidden={isOpen ? undefined : true}
                  aria-labelledby={triggerId}
                  className="min-h-0 overflow-hidden"
                  data-slot="collapse-panel"
                  id={panelId}
                  inert={isOpen ? undefined : true}
                >
                  <div
                    className={cn(
                      'border-ui-border/70 border-t bg-(--ui-input-filled-background) leading-5 text-ui-muted-foreground',
                      isVisible
                        ? collapsePanelContentMotionClassName.open
                        : collapsePanelContentMotionClassName.closed,
                      collapseSizeClassName[size].panel,
                    )}
                    data-slot="collapse-panel-content"
                  >
                    {item.loading ? (
                      <div className="grid gap-2" data-slot="collapse-loading">
                        <div className="h-2.5 w-10/12 animate-pulse rounded-full bg-ui-muted motion-reduce:animate-none" />
                        <div className="h-2.5 w-7/12 animate-pulse rounded-full bg-ui-muted motion-reduce:animate-none" />
                      </div>
                    ) : (
                      item.children
                    )}
                  </div>
                </section>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
