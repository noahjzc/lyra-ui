import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';
import { cn } from '../../../internal/cn';

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  edgeShadow?: boolean;
  maxHeight?: number | string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  preventScrollChain?: boolean;
  /** 根据滚动位置显示顶部、底部或双向边缘阴影。 */
  shadow?: boolean | 'top' | 'bottom' | 'both';
  stickyFooter?: React.ReactNode;
  stickyFooterClassName?: string;
  stickyHeader?: React.ReactNode;
  stickyHeaderClassName?: string;
  viewportClassName?: string;
  viewportProps?: React.ComponentPropsWithRef<
    typeof ScrollAreaPrimitive.Viewport
  >;
}

const viewportOverflowClassName = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
} as const;

const scrollbarClassName = cn(
  '[scrollbar-color:var(--ui-scrollbar-thumb)_var(--ui-scrollbar-track)]',
  '[scrollbar-width:thin]',
  '[&::-webkit-scrollbar]:h-1.5',
  '[&::-webkit-scrollbar]:w-1.5',
  '[&::-webkit-scrollbar-thumb]:rounded-full',
  '[&::-webkit-scrollbar-thumb]:bg-(--ui-scrollbar-thumb)',
  '[&::-webkit-scrollbar-thumb:hover]:bg-(--ui-scrollbar-thumb-hover)',
  '[&::-webkit-scrollbar-track]:rounded-full',
  '[&::-webkit-scrollbar-track]:bg-(--ui-scrollbar-track)',
);

const shadowClassName = {
  bottom:
    'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-(--ui-scroll-edge-z-index) after:h-[18px] after:bg-gradient-to-t after:from-(--ui-scroll-shadow) after:to-transparent',
  both: cn(
    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-(--ui-scroll-edge-z-index) before:h-[18px] before:bg-gradient-to-b before:from-(--ui-scroll-shadow) before:to-transparent',
    'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-(--ui-scroll-edge-z-index) after:h-[18px] after:bg-gradient-to-t after:from-(--ui-scroll-shadow) after:to-transparent',
  ),
  top: 'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-(--ui-scroll-edge-z-index) before:h-[18px] before:bg-gradient-to-b before:from-(--ui-scroll-shadow) before:to-transparent',
} as const;

type ShadowState = {
  bottom: boolean;
  top: boolean;
};

function resolveViewportStyle(
  maxHeight: ScrollAreaProps['maxHeight'],
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (!maxHeight) return style;

  return {
    ...style,
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
  };
}

function mergeRefs<T>(
  ...refs: Array<React.ForwardedRef<T> | undefined>
): React.RefCallback<T> {
  return value => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}

export const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      children,
      className,
      edgeShadow = false,
      maxHeight,
      orientation = 'vertical',
      preventScrollChain = true,
      scrollHideDelay = 600,
      shadow,
      stickyFooter,
      stickyFooterClassName,
      stickyHeader,
      stickyHeaderClassName,
      style,
      type = 'hover',
      viewportClassName,
      viewportProps,
      ...props
    },
    ref,
  ) => {
    const {
      className: viewportPropsClassName,
      onScroll,
      ref: viewportPropsRef,
      style: viewportStyle,
      ...restViewportProps
    } = viewportProps ?? {};
    const viewportRef =
      React.useRef<React.ComponentRef<typeof ScrollAreaPrimitive.Viewport>>(
        null,
      );
    const [shadowState, setShadowState] = React.useState<ShadowState>({
      bottom: false,
      top: false,
    });
    const resolvedShadow = shadow === true ? 'both' : shadow;
    const shadowVariant = resolvedShadow ?? (edgeShadow ? 'bottom' : undefined);
    const hasStickyHeader = stickyHeader != null;
    const hasStickyFooter = stickyFooter != null;
    const visibleShadow =
      shadowVariant === 'both'
        ? shadowState.top && shadowState.bottom
          ? 'both'
          : shadowState.top
            ? 'top'
            : shadowState.bottom
              ? 'bottom'
              : undefined
        : shadowVariant === 'top' && shadowState.top
          ? 'top'
          : shadowVariant === 'bottom' && shadowState.bottom
            ? 'bottom'
            : undefined;

    const updateShadowState = React.useCallback(() => {
      const viewport = viewportRef.current;

      if (!viewport || !shadowVariant) {
        setShadowState({ bottom: false, top: false });
        return;
      }

      const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
      const nextState = {
        bottom: maxScrollTop - viewport.scrollTop > 1,
        top: viewport.scrollTop > 1,
      };

      setShadowState(current =>
        current.top === nextState.top && current.bottom === nextState.bottom
          ? current
          : nextState,
      );
    }, [shadowVariant]);

    React.useEffect(() => {
      updateShadowState();
      window.addEventListener('resize', updateShadowState);

      return () => {
        window.removeEventListener('resize', updateShadowState);
      };
    }, [updateShadowState]);

    return (
      <ScrollAreaPrimitive.Root
        {...props}
        className={cn(
          'relative min-h-0 min-w-0 overflow-hidden',
          visibleShadow && shadowClassName[visibleShadow],
          className,
        )}
        data-scroll-shadow={visibleShadow ?? 'none'}
        data-slot="scroll-area"
        ref={ref}
        scrollHideDelay={scrollHideDelay}
        style={style}
        type={type}
      >
        {hasStickyHeader && (
          <div
            className={cn(
              'absolute inset-x-0 top-0 z-(--ui-scroll-sticky-z-index) flex min-h-8 items-center justify-between border-ui-border border-b bg-(--ui-scroll-sticky-background) px-3 text-sm font-semibold text-ui-foreground',
              stickyHeaderClassName,
            )}
            data-slot="scroll-area-sticky-header"
          >
            {stickyHeader}
          </div>
        )}
        <ScrollAreaPrimitive.Viewport
          {...restViewportProps}
          className={cn(
            'h-full min-h-0 w-full min-w-0',
            preventScrollChain && 'overscroll-contain',
            hasStickyHeader && 'pt-8',
            hasStickyFooter && 'pb-8',
            viewportOverflowClassName[orientation],
            scrollbarClassName,
            viewportClassName,
            viewportPropsClassName,
          )}
          data-slot="scroll-area-viewport"
          onScroll={event => {
            updateShadowState();
            onScroll?.(event);
          }}
          ref={mergeRefs(viewportRef, viewportPropsRef)}
          style={resolveViewportStyle(maxHeight, viewportStyle)}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {orientation !== 'horizontal' && (
          <ScrollAreaPrimitive.Scrollbar
            className="flex touch-none select-none bg-(--ui-scrollbar-track) p-0.5 transition-ui-state data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col"
            data-slot="scroll-area-scrollbar"
            orientation="vertical"
          >
            <ScrollAreaPrimitive.Thumb
              className="relative flex-1 rounded-full bg-(--ui-scrollbar-thumb) transition-ui-state hover:bg-(--ui-scrollbar-thumb-hover)"
              data-slot="scroll-area-thumb"
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}
        {orientation !== 'vertical' && (
          <ScrollAreaPrimitive.Scrollbar
            className="flex touch-none select-none bg-(--ui-scrollbar-track) p-0.5 transition-ui-state data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col"
            data-slot="scroll-area-scrollbar"
            orientation="horizontal"
          >
            <ScrollAreaPrimitive.Thumb
              className="relative flex-1 rounded-full bg-(--ui-scrollbar-thumb) transition-ui-state hover:bg-(--ui-scrollbar-thumb-hover)"
              data-slot="scroll-area-thumb"
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}
        {orientation === 'both' && (
          <ScrollAreaPrimitive.Corner
            className="bg-(--ui-scrollbar-track)"
            data-slot="scroll-area-corner"
          />
        )}
        {hasStickyFooter && (
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 z-(--ui-scroll-sticky-z-index) flex min-h-8 items-center justify-between border-ui-border border-t bg-(--ui-scroll-sticky-background) px-3 text-sm font-semibold text-ui-foreground',
              stickyFooterClassName,
            )}
            data-slot="scroll-area-sticky-footer"
          >
            {stickyFooter}
          </div>
        )}
      </ScrollAreaPrimitive.Root>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
