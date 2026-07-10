import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from '../../src/components/feedback';

describe('Alert', () => {
  it('renders warning alert with action and wrapped long description', () => {
    render(
      <Alert
        action={<button type="button">查看原因</button>}
        description="客户资料缺少统一社会信用代码，保存后将无法进入授信审批。"
        title="资料不完整"
        variant="warning"
      />,
    );

    expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert');
    expect(
      screen.getByText(
        '客户资料缺少统一社会信用代码，保存后将无法进入授信审批。',
      ),
    ).toHaveClass('break-words');
    expect(
      screen.getByRole('button', { name: '查看原因' }),
    ).toBeInTheDocument();
    expect(screen.getByText('资料不完整')).toHaveAttribute(
      'data-slot',
      'alert-title',
    );
  });

  it('maps success and info to polite status by default', () => {
    const { rerender } = render(
      <Alert
        description="客户标签已同步。"
        title="同步完成"
        variant="success"
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('同步完成');

    rerender(<Alert description="系统将在夜间同步。" variant="info" />);

    expect(screen.getByRole('status')).toHaveTextContent('系统将在夜间同步。');
  });

  it('maps error to alert and allows role override', () => {
    const { rerender } = render(
      <Alert description="保存失败。" title="系统错误" variant="error" />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('系统错误');

    rerender(
      <Alert
        description="此提示由上层区域统一播报。"
        role="status"
        variant="error"
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '此提示由上层区域统一播报。',
    );
  });

  it('renders custom icon and close button slot', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Alert
        closable
        closeLabel="关闭加载失败提示"
        icon={<span data-testid="custom-icon">!</span>}
        onClose={onClose}
        title="加载失败"
        variant="warning"
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('关闭加载失败提示')).toHaveAttribute(
      'data-slot',
      'alert-close',
    );

    await user.click(screen.getByRole('button', { name: '关闭加载失败提示' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
