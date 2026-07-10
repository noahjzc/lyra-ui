import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, AvatarGroup } from '../../src/components/data-view';

describe('Avatar', () => {
  it('renders initials and status label', () => {
    render(<Avatar name="张明" status="online" statusLabel="在线" />);

    expect(screen.getByText('张明')).toBeInTheDocument();
    expect(screen.getByLabelText('在线')).toHaveAttribute(
      'data-slot',
      'avatar-status',
    );
  });

  it('falls back when image loading fails', () => {
    render(<Avatar alt="李佳" name="李佳" src="/missing-avatar.png" />);

    fireEvent.error(screen.getByRole('img', { name: '李佳' }));

    expect(screen.getByText('李佳')).toHaveAttribute(
      'data-slot',
      'avatar-fallback',
    );
  });

  it('renders overflow count in group', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="张明" />
        <Avatar name="李佳" />
        <Avatar name="王强" />
      </AvatarGroup>,
    );

    expect(screen.getByLabelText('还有 1 个成员')).toHaveTextContent('+1');
  });

  it('uses default square shape for org and app variants', () => {
    render(
      <>
        <Avatar name="华东供应链" variant="org" />
        <Avatar fallback="CRM" variant="app" />
      </>,
    );

    expect(screen.getByLabelText('华东供应链')).toHaveClass('rounded-lg');
    expect(screen.getByText('CRM').closest('[data-slot="avatar"]')).toHaveClass(
      'rounded-lg',
    );
  });

  it('supports xlarge size and default status label', () => {
    render(<Avatar name="王洋" size="xlarge" status="busy" />);

    expect(screen.getByLabelText('王洋')).toHaveClass('size-12');
    expect(screen.getByLabelText('忙碌')).toHaveAttribute(
      'data-slot',
      'avatar-status',
    );
  });

  it('supports keyboard activation when interactive has an action', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Avatar interactive name="张明" onClick={handleClick} />);

    const avatar = screen.getByRole('button', { name: '张明' });

    await user.tab();
    expect(avatar).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
