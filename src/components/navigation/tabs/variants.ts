import type { TabsSize, TabsVariant } from './types';

export const tabsListClassName: Record<TabsVariant, string> = {
  cache:
    'h-[42px] gap-1.5 overflow-x-auto border-ui-border border-b bg-(--ui-tabs-cache-background) px-2 py-[5px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  card: 'h-10 items-end gap-1 border-ui-border border-b',
  line: 'h-11 gap-5 overflow-x-auto border-ui-border border-b [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  segment:
    'inline-flex w-fit gap-0.5 rounded-[7px] border border-ui-border bg-ui-muted p-1 supports-[width:fit-content]:w-fit',
};

export const tabsTriggerClassName: Record<TabsVariant, string> = {
  cache:
    'inline-grid h-8 min-w-[104px] max-w-[178px] grid-cols-[minmax(0,1fr)_22px] justify-items-start gap-1 overflow-hidden truncate rounded-md border border-ui-border bg-ui-background py-0 pr-1 pl-2.5 text-[13px] text-ui-muted-foreground hover:border-(--ui-button-primary-border) hover:text-(--ui-button-primary-background) disabled:border-ui-border/70 disabled:bg-(--ui-tabs-cache-disabled-background) disabled:text-ui-muted-foreground disabled:opacity-100 data-[state=active]:border-(--ui-tabs-cache-active-border) data-[state=active]:bg-ui-background data-[state=active]:font-bold data-[state=active]:text-(--ui-button-primary-background) data-[state=active]:shadow-(--ui-tabs-cache-active-shadow)',
  card: 'rounded-t-md border border-transparent border-b-0 px-3 text-ui-muted-foreground hover:bg-ui-muted hover:text-ui-foreground data-[state=active]:border-ui-border data-[state=active]:bg-ui-background data-[state=active]:font-bold data-[state=active]:text-ui-foreground',
  line: 'h-11 border-transparent border-b-2 px-0 text-ui-muted-foreground hover:text-ui-foreground data-[state=active]:border-(--ui-button-primary-background) data-[state=active]:font-bold data-[state=active]:text-(--ui-button-primary-background)',
  segment:
    'rounded-[5px] px-3 text-ui-muted-foreground hover:bg-ui-background/60 hover:text-ui-foreground data-[state=active]:bg-ui-background data-[state=active]:font-bold data-[state=active]:text-(--ui-button-primary-background) data-[state=active]:shadow-sm',
};

export const tabsTriggerSizeClassName: Record<TabsSize, string> = {
  large: 'h-10 text-sm',
  middle: 'h-8 text-sm',
  small: 'h-7 text-xs',
};

export const tabsContentClassName =
  'min-w-0 pt-4 outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';
