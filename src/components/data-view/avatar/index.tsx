import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { AvatarGroupProps, AvatarProps, AvatarStatus } from './types';
import { getDefaultIcon, getInitials, resolveSizeStyle } from './utils';
import {
  avatarStatusClassName,
  avatarStatusSizeClassName,
  avatarVariants,
} from './variants';

export type {
  AvatarGroupProps,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
  AvatarVariant,
} from './types';

const defaultStatusLabel = {
  away: '离开',
  busy: '忙碌',
  offline: '离线',
  online: '在线',
} satisfies Record<AvatarStatus, string>;

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      alt,
      className,
      disabled = false,
      fallback,
      icon,
      interactive: _interactive = false,
      loading = 'lazy',
      name,
      onClick,
      onKeyDown,
      role,
      shape,
      size = 'middle',
      src,
      status,
      statusLabel,
      style,
      tabIndex,
      variant = 'user',
      ...props
    },
    ref,
  ) => {
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>();
    const resolvedShape = shape ?? (variant === 'user' ? 'circle' : 'square');
    const resolvedStatusLabel =
      status != null ? (statusLabel ?? defaultStatusLabel[status]) : undefined;
    const sizeVariant = typeof size === 'number' ? 'middle' : size;
    const hasImage = src != null && src !== '' && failedSrc !== src;
    const initials = getInitials(name);
    const fallbackNode =
      fallback ?? (initials || icon || getDefaultIcon(resolvedShape));
    const actionable = onClick != null && !disabled;
    const accessibilityProps = actionable
      ? {
          'aria-label': alt ?? name ?? '头像',
          role: role ?? 'button',
          tabIndex: disabled ? tabIndex : (tabIndex ?? 0),
        }
      : !hasImage && (alt != null || name != null)
        ? {
            'aria-label': alt ?? name,
            role: role ?? 'img',
            tabIndex,
          }
        : { role, tabIndex };
    const actionProps = actionable
      ? {
          onClick,
          onKeyDown: handleKeyDown,
        }
      : undefined;

    function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
      onKeyDown?.(event);

      if (
        event.defaultPrevented ||
        disabled ||
        (event.key !== 'Enter' && event.key !== ' ')
      ) {
        return;
      }

      event.preventDefault();
      event.currentTarget.click();
    }

    return (
      <span
        aria-disabled={disabled ? true : undefined}
        className={cn(
          avatarVariants({
            interactive: actionable,
            shape: resolvedShape,
            size: sizeVariant,
            variant,
          }),
          disabled && 'border-ui-border bg-ui-muted text-ui-muted-foreground',
          className,
        )}
        data-slot="avatar"
        ref={ref}
        style={resolveSizeStyle(size, style)}
        {...accessibilityProps}
        {...actionProps}
        {...props}
      >
        {hasImage ? (
          <img
            alt={alt ?? name ?? ''}
            className="h-full w-full object-cover"
            loading={loading}
            onError={() => setFailedSrc(src)}
            src={src}
          />
        ) : (
          <span
            aria-hidden={alt != null || name != null ? true : undefined}
            className="inline-flex h-full w-full items-center justify-center"
            data-slot="avatar-fallback"
          >
            {fallbackNode}
          </span>
        )}
        {status != null && (
          <span
            aria-label={resolvedStatusLabel}
            className={cn(
              'absolute right-0 bottom-0 rounded-full ring-2 ring-ui-background',
              avatarStatusSizeClassName[sizeVariant],
              avatarStatusClassName[status],
            )}
            data-slot="avatar-status"
            role="img"
          />
        )}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

export function AvatarGroup({
  children,
  className,
  max = 5,
  shape,
  size = 'middle',
  totalLabel = hiddenCount => `还有 ${hiddenCount} 个成员`,
  variant = 'user',
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const hiddenCount = Math.max(0, items.length - visibleItems.length);
  const resolvedShape = shape ?? (variant === 'user' ? 'circle' : 'square');

  return (
    <div
      className={cn('flex items-center pl-2', className)}
      data-slot="avatar-group"
      {...props}
    >
      {visibleItems.map((child, index) => (
        <span
          className={cn(
            '-ml-2 inline-flex ring-2 ring-ui-background',
            resolvedShape === 'circle' ? 'rounded-full' : 'rounded-lg',
          )}
          key={React.isValidElement(child) ? child.key : index}
        >
          {React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, {
                shape: child.props.shape ?? resolvedShape,
                size: child.props.size ?? size,
                variant: child.props.variant ?? variant,
              })
            : child}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            '-ml-2 inline-flex ring-2 ring-ui-background',
            resolvedShape === 'circle' ? 'rounded-full' : 'rounded-lg',
          )}
        >
          <Avatar
            aria-label={totalLabel(hiddenCount)}
            fallback={`+${hiddenCount}`}
            shape={resolvedShape}
            size={size}
            variant="neutral"
          />
        </span>
      )}
    </div>
  );
}
