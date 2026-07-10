import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Notification, NotificationList } from '../../src/components/feedback';

describe('Notification', () => {
  it('renders actionable notification with polite live region', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Notification
        action={<button type="button">查看详情</button>}
        closeLabel="关闭导入完成通知"
        description="客户导入批次 CRM-IMPORT-20260610-0248 已完成。"
        meta="2 分钟前 · 审批中心"
        onClose={onClose}
        title="导入完成"
        type="success"
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(
      screen.getByRole('button', { name: '查看详情' }),
    ).toBeInTheDocument();
    expect(screen.getByText('导入完成')).toHaveAttribute(
      'data-slot',
      'notification-title',
    );
    expect(screen.getByRole('status')).toHaveClass('animate-ui-layer-in');
    expect(screen.getByText(/CRM-IMPORT/)).toHaveAttribute(
      'data-slot',
      'notification-description',
    );
    expect(screen.getByText('2 分钟前 · 审批中心')).toHaveAttribute(
      'data-slot',
      'notification-meta',
    );

    await user.click(screen.getByRole('button', { name: '关闭导入完成通知' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders warning notification as assertive alert', () => {
    render(<Notification title="库存风险" type="warning" />);

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses notification viewport token', () => {
    render(
      <NotificationList>
        <Notification title="导入完成" type="success" />
      </NotificationList>,
    );

    expect(
      document.querySelector('[data-slot="notification-viewport"]'),
    ).toHaveClass('fixed', 'top-16', 'right-4');
    expect(
      document.querySelector('[data-slot="notification-viewport"]')
        ?.parentElement,
    ).toBe(document.body);
    expect(
      Number(
        (
          document.querySelector(
            '[data-slot="notification-viewport"]',
          ) as HTMLElement
        ).style.zIndex,
      ),
    ).toBeGreaterThan(0);
  });
});
