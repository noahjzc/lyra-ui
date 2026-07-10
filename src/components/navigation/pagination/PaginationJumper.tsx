import * as React from 'react';

export interface PaginationJumperProps {
  currentPage: number;
  disabled?: boolean;
  onJump: (page: number) => void;
  pageCount: number;
}

export function PaginationJumper({
  currentPage,
  disabled = false,
  onJump,
  pageCount,
}: PaginationJumperProps) {
  const [value, setValue] = React.useState(String(currentPage));

  React.useEffect(() => {
    setValue(String(currentPage));
  }, [currentPage]);

  function commitJump() {
    const target = Number(value);

    if (!Number.isFinite(target) || target < 1) {
      setValue(String(currentPage));
      return;
    }

    const nextPage = Math.min(Math.max(Math.trunc(target), 1), pageCount);
    setValue(String(nextPage));
    onJump(nextPage);
  }

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
      data-slot="pagination-jumper"
    >
      <span className="shrink-0 text-xs font-bold text-ui-muted-foreground">
        跳至
      </span>
      <input
        aria-label="跳转页码"
        className="h-[30px] w-12 shrink-0 rounded-md border border-(--ui-input-border) bg-(--ui-input-background) px-2 text-[13px] text-ui-foreground outline-none transition-ui-state hover:border-(--ui-input-hover-border) focus:border-(--ui-input-focus-border) focus:ring-2 focus:ring-(--ui-input-focus-ring) disabled:cursor-not-allowed disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground)"
        disabled={disabled}
        max={pageCount}
        min={1}
        onBlur={commitJump}
        onChange={event => setValue(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            commitJump();
          }
        }}
        type="number"
        value={value}
      />
      <span className="shrink-0 text-xs font-bold text-ui-muted-foreground">
        页
      </span>
    </div>
  );
}
