import { Copy } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type {
  DescriptionColumn,
  DescriptionCopyConfig,
  DescriptionItem,
  DescriptionItemProps,
  DescriptionsProps,
} from './types';

export type {
  DescriptionColumn,
  DescriptionCopyConfig,
  DescriptionItem,
  DescriptionLayout,
  DescriptionSpan,
  DescriptionsProps,
} from './types';

const columnClassName: Record<DescriptionColumn, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 min-[760px]:grid-cols-2',
  3: 'grid-cols-1 min-[760px]:grid-cols-2 min-[1180px]:grid-cols-3',
  4: 'grid-cols-1 min-[760px]:grid-cols-2 min-[1180px]:grid-cols-4',
};

const spanClassName = {
  1: 'col-span-1',
  2: 'min-[760px]:col-span-2',
  3: 'min-[760px]:col-span-2 min-[1180px]:col-span-3',
  4: 'min-[760px]:col-span-2 min-[1180px]:col-span-4',
  full: 'col-span-full',
} as const;

function isEmptyValue(value: DescriptionItem['value']) {
  return value == null || value === '';
}

function getCopyConfig(
  item: DescriptionItem,
): DescriptionCopyConfig | undefined {
  if (!item.copyable) return undefined;
  const config = typeof item.copyable === 'boolean' ? {} : item.copyable;
  const text =
    config.text ??
    item.copyText ??
    (typeof item.value === 'string' || typeof item.value === 'number'
      ? String(item.value)
      : undefined);

  if (!text) return undefined;

  return {
    ...config,
    text,
  };
}

function DescriptionCopyButton({
  copyConfig,
  item,
  onCopy,
}: {
  copyConfig: DescriptionCopyConfig;
  item: DescriptionItem;
  onCopy?: DescriptionsProps['onCopy'];
}) {
  const text = copyConfig.text;
  if (!text) return null;

  const label = copyConfig.label ?? `复制${String(item.label)}`;

  return (
    <button
      aria-label={label}
      className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-[5px] border border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-ghost-hover-border) hover:bg-(--ui-button-ghost-hover-background) active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
      data-slot="description-copy"
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        onCopy?.(text, item);
      }}
      type="button"
    >
      <Copy aria-hidden="true" className="size-3" />
    </button>
  );
}

function DescriptionItemView({
  bordered,
  className,
  compact,
  emptyText,
  item,
  layout,
  onCopy,
  wrap,
  ...props
}: DescriptionItemProps) {
  const empty = isEmptyValue(item.value);
  const copyConfig = getCopyConfig(item);
  const shouldWrap = item.wrap ?? wrap;

  return (
    <div
      className={cn(
        'min-w-0',
        layout === 'grid' && 'grid content-start gap-1.5',
        layout === 'inline' && 'inline-flex items-center gap-1.5',
        bordered
          ? 'border-ui-border border-b border-r bg-ui-background p-3'
          : 'rounded-md border border-ui-border bg-ui-background px-3 py-2.5',
        compact && !bordered && 'px-2.5 py-2',
        layout === 'grid' && spanClassName[item.span ?? 1],
        item.className,
        className,
      )}
      data-slot="description-item"
      {...props}
    >
      <dt
        className={cn(
          'min-w-0 truncate text-ui-muted-foreground text-xs font-bold leading-4',
          layout === 'inline' && 'shrink-0',
          item.labelClassName,
        )}
        data-slot="description-label"
      >
        {item.label}
      </dt>
      <dd
        className={cn(
          'm-0 flex min-w-0 items-center gap-1.5 text-sm leading-5',
          empty
            ? 'font-normal text-ui-muted-foreground'
            : 'font-normal text-ui-foreground',
          compact && 'text-xs leading-4',
          item.valueClassName,
        )}
        data-empty={empty ? true : undefined}
        data-slot="description-value"
      >
        <span
          className={cn(
            'min-w-0',
            shouldWrap ? 'whitespace-normal break-words' : 'truncate',
          )}
        >
          {empty ? (item.emptyText ?? emptyText) : item.value}
        </span>
        {copyConfig != null && (
          <DescriptionCopyButton
            copyConfig={copyConfig}
            item={item}
            onCopy={onCopy}
          />
        )}
      </dd>
    </div>
  );
}

export const Descriptions = React.forwardRef<
  HTMLDListElement,
  DescriptionsProps
>(
  (
    {
      bordered = false,
      className,
      columns = 3,
      compact = false,
      emptyText = '-',
      items,
      layout = 'grid',
      onCopy,
      wrap = false,
      ...props
    },
    ref,
  ) => (
    <dl
      className={cn(
        'min-w-0 text-ui-foreground',
        layout === 'grid' &&
          cn(
            'grid content-start items-stretch gap-2.5',
            columnClassName[columns],
            bordered && 'gap-0',
          ),
        layout === 'inline' && 'flex flex-wrap items-center gap-x-4 gap-y-2',
        bordered &&
          'overflow-hidden rounded-md border border-ui-border bg-ui-background',
        className,
      )}
      data-bordered={bordered ? true : undefined}
      data-layout={layout}
      data-slot="descriptions"
      ref={ref}
      {...props}
    >
      {items.map((item, index) => (
        <DescriptionItemView
          bordered={bordered}
          compact={compact}
          emptyText={emptyText}
          item={item}
          key={`${String(item.label)}-${index}`}
          layout={layout}
          onCopy={onCopy}
          wrap={wrap}
        />
      ))}
    </dl>
  ),
);

Descriptions.displayName = 'Descriptions';

export const Description = Descriptions;
