export function PaginationEllipsis() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[30px] min-w-5 items-center justify-center px-1 text-[13px] text-ui-muted-foreground"
      data-slot="pagination-ellipsis"
    >
      ...
    </span>
  );
}
