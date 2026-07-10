import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Message, MessageViewport } from '../../src/components/feedback';

describe('Message', () => {
  it('renders long warning message as alert with truncation', () => {
    render(
      <Message
        content="导入完成，但有 18 条客户记录因为手机号重复被跳过，请在导入记录中查看详情。"
        type="warning"
      />,
    );

    const message = screen.getByRole('alert');

    expect(message).toHaveAttribute('data-slot', 'message');
    expect(message).toHaveAttribute('aria-live', 'assertive');
    expect(message).toHaveClass('animate-ui-layer-in');
    expect(screen.getByText(/导入完成/)).toHaveClass('truncate');
  });

  it('renders loading message as polite status with reduced motion class', () => {
    render(<Message content="正在同步客户资料" type="loading" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(document.querySelector('[data-slot="message-icon"]')).toHaveClass(
      'animate-spin',
      'motion-reduce:animate-none',
    );
  });

  it('preserves native div title attribute', () => {
    render(<Message content="保存成功" title="原生提示" type="success" />);

    expect(screen.getByRole('status')).toHaveAttribute('title', '原生提示');
  });

  it('supports close action and viewport placement', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MessageViewport>
        <Message
          closable
          closeLabel="关闭保存失败消息"
          content="保存失败"
          onClose={onClose}
          type="error"
        />
      </MessageViewport>,
    );

    expect(
      document.querySelector('[data-slot="message-viewport"]'),
    ).toHaveClass('fixed', 'top-16');
    expect(
      document.querySelector('[data-slot="message-viewport"]')?.parentElement,
    ).toBe(document.body);
    expect(
      Number(
        (
          document.querySelector(
            '[data-slot="message-viewport"]',
          ) as HTMLElement
        ).style.zIndex,
      ),
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: '关闭保存失败消息' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
