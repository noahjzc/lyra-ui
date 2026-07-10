import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Result } from '../../src/components/feedback';

describe('Result', () => {
  it('renders semantic region, hidden icon, description and actions', () => {
    render(
      <Result
        actions={<button type="button">返回列表</button>}
        description="批量导入客户已完成，可以查看导入记录。"
        status="success"
        title="导入成功"
      />,
    );

    expect(screen.getByRole('region', { name: '导入成功' })).toHaveAttribute(
      'role',
      'region',
    );
    expect(document.querySelector('[data-slot="result-icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(
      screen.getByText('批量导入客户已完成，可以查看导入记录。'),
    ).toHaveAttribute('data-slot', 'result-description');
    expect(
      screen.getByRole('button', { name: '返回列表' }),
    ).toBeInTheDocument();
  });

  it('associates region with a generated title id', () => {
    render(
      <Result
        description="服务暂时不可用，请稍后重试。"
        status="error"
        title="提交失败"
      />,
    );

    const result = screen.getByRole('region', { name: '提交失败' });
    const title = screen.getByRole('heading', { name: '提交失败' });

    expect(result).toHaveAttribute('aria-labelledby', title.id);
  });

  it('supports densities and extra content', () => {
    const { rerender } = render(
      <Result
        density="compact"
        extra={<div>错误明细</div>}
        status="error"
        title="提交失败"
      />,
    );

    expect(screen.getByRole('region', { name: '提交失败' })).toHaveClass(
      'py-6',
    );
    expect(screen.getByText('错误明细').closest('[data-slot]')).toHaveAttribute(
      'data-slot',
      'result-extra',
    );

    rerender(<Result density="page" status="403" title="暂无访问权限" />);

    expect(screen.getByRole('region', { name: '暂无访问权限' })).toHaveClass(
      'min-h-[320px]',
    );
  });

  it('maps all semantic statuses to result status data', () => {
    const statuses = ['success', 'warning', 'error', '403', '404', 'empty'];

    for (const status of statuses) {
      const { unmount } = render(
        <Result
          status={
            status as 'success' | 'warning' | 'error' | '403' | '404' | 'empty'
          }
          title={`状态 ${status}`}
        />,
      );

      expect(
        screen.getByRole('region', { name: `状态 ${status}` }),
      ).toHaveAttribute('data-status', status);

      unmount();
    }
  });
});
