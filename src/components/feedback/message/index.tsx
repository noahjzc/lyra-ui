import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { Button } from '../../general';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  closeLabel?: string;
  closable?: boolean;
  content: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  type?: MessageType;
}

const messageIcon = {
  error: AlertCircle,
  info: Info,
  loading: Loader2,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

const messageTypeClassName = {
  error: 'border-ui-destructive/25 text-ui-destructive',
  info: 'border-(--ui-button-primary-border) text-(--ui-button-primary-background)',
  loading:
    'border-(--ui-button-primary-border) text-(--ui-button-primary-background)',
  success: 'border-ui-success/25 text-ui-success',
  warning: 'border-ui-warning/25 text-ui-warning',
} as const;

const messageLiveRegion = {
  error: { ariaLive: 'assertive', role: 'alert' },
  info: { ariaLive: 'polite', role: 'status' },
  loading: { ariaLive: 'polite', role: 'status' },
  success: { ariaLive: 'polite', role: 'status' },
  warning: { ariaLive: 'assertive', role: 'alert' },
} as const;

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      className,
      closeLabel = '关闭消息',
      closable = false,
      content,
      duration,
      onClose,
      type = 'info',
      ...props
    },
    ref,
  ) => {
    const Icon = messageIcon[type];
    const liveRegion = messageLiveRegion[type];

    return (
      <div
        {...props}
        aria-live={liveRegion.ariaLive}
        className={cn(
          'pointer-events-auto inline-flex min-h-9 max-w-[360px] items-center gap-2 rounded-md border bg-ui-background px-3 py-2 text-sm font-semibold shadow-ui-elevation-4 animate-ui-layer-in motion-reduce:animate-none',
          messageTypeClassName[type],
          className,
        )}
        data-duration={duration}
        data-slot="message"
        ref={ref}
        role={liveRegion.role}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0',
            type === 'loading' && 'animate-spin motion-reduce:animate-none',
          )}
          data-slot="message-icon"
        />
        <span
          className="min-w-0 truncate text-ui-foreground"
          data-slot="message-content"
        >
          {content}
        </span>
        {closable && (
          <Button
            aria-label={closeLabel}
            className="-mr-1 size-6"
            data-slot="message-close"
            iconOnly
            onClick={onClose}
            size="small"
            variant="ghost"
          >
            <X aria-hidden="true" className="size-3.5" />
          </Button>
        )}
      </div>
    );
  },
);
Message.displayName = 'Message';

export const MessageViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const [zIndex, layerRef] = useOverlayZIndex(Z_BASE.notification, ref, true);

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed top-16 left-1/2 grid -translate-x-1/2 justify-items-center gap-2',
        className,
      )}
      data-slot="message-viewport"
      ref={layerRef}
      style={{ zIndex, ...style }}
      {...props}
    />,
    document.body,
  );
});
MessageViewport.displayName = 'MessageViewport';
