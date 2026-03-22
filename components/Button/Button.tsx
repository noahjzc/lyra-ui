import { forwardRef } from 'react';
import type { ButtonProps } from './types';
import './style/index.less';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'primary',
      size = 'default',
      children,
      disabled = false,
      loading = false,
      onClick,
      className = '',
      htmlType = 'button',
    },
    ref,
  ) => {
    const cls = [
      'lyra-btn',
      `lyra-btn--${type}`,
      `lyra-btn--size-${size}`,
      loading ? 'lyra-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={htmlType}
        className={cls}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading && <span className="lyra-btn__loading-icon" />}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
