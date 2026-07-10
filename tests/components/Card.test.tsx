import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Card,
  CardActions,
  CardBody,
  CardField,
  CardFooter,
  CardHeader,
  CardMeta,
  CardStatus,
  CardTitle,
} from '../../src/components/data-view';

describe('Card', () => {
  it('renders structured regions', () => {
    render(
      <Card selected>
        <CardHeader>
          <CardTitle>客户记录 A</CardTitle>
          <CardStatus variant="success">已签约</CardStatus>
        </CardHeader>
        <CardBody>
          <CardMeta>
            <CardField label="负责人" value="周明" />
          </CardMeta>
        </CardBody>
        <CardFooter>更新时间</CardFooter>
      </Card>,
    );

    expect(screen.getByText('客户记录 A')).toHaveAttribute(
      'data-slot',
      'card-title',
    );
    expect(screen.getByText('已签约')).toHaveAttribute(
      'data-slot',
      'card-status',
    );
    expect(screen.getByText('周明')).toHaveAttribute(
      'data-slot',
      'card-field-value',
    );
    expect(screen.getByText('更新时间')).toHaveAttribute(
      'data-slot',
      'card-footer',
    );
  });

  it('renders loading skeleton and aria busy', () => {
    render(<Card aria-label="客户卡片加载中" loading />);

    expect(document.querySelector('[data-slot="card"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(
      document.querySelector('[data-slot="card-loading"]'),
    ).toBeInTheDocument();
  });

  it('supports keyboard activation for interactive cards', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Card interactive onClick={handleClick}>
        <CardBody>选择视图</CardBody>
      </Card>,
    );

    const card = screen.getByRole('button', { name: '选择视图' });

    await user.tab();
    expect(card).toHaveFocus();

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('does not trigger card click from action buttons', async () => {
    const user = userEvent.setup();
    const handleCardClick = vi.fn();
    const handleActionClick = vi.fn();

    render(
      <Card interactive onClick={handleCardClick}>
        <CardFooter>
          <span>更新于 10 分钟前</span>
          <CardActions>
            <button onClick={handleActionClick} type="button">
              查看
            </button>
          </CardActions>
        </CardFooter>
      </Card>,
    );

    await user.click(screen.getByRole('button', { name: '查看' }));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('exposes disabled reason through aria-describedby', () => {
    render(
      <Card disabled disabledReason="权限不足，不可进入" interactive>
        <CardBody>跨区额度审批</CardBody>
      </Card>,
    );

    const card = screen.getByText('跨区额度审批').closest('[data-slot="card"]');

    expect(card).toHaveAttribute('aria-disabled', 'true');
    expect(card).toHaveAccessibleDescription('权限不足，不可进入');
  });

  it('does not expose button semantics when interactive has no action', () => {
    render(
      <Card interactive>
        <CardBody>仅悬停增强</CardBody>
      </Card>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.getByText('仅悬停增强').closest('[data-slot="card"]'),
    ).not.toHaveAttribute('tabindex');
  });
});
