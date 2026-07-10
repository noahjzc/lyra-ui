import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefreshCw } from 'lucide-react';
import { createRef, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, IconButton } from '../../src/components/general';

describe('Button', () => {
  it('renders as a real button and handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>保存</Button>);

    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not submit a form by default unless type is submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <form onSubmit={onSubmit}>
        <Button>Default action</Button>
        <Button type="submit">Submit action</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Default action' }));

    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Submit action' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports design-system variants', () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="default">Default</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="text">Text</Button>
        <Button variant="link">Link</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="warning">Warning</Button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Primary' })).toHaveClass(
      'bg-(--ui-button-primary-background)',
    );
    expect(screen.getByRole('button', { name: 'Default' })).toHaveClass(
      'bg-(--ui-button-default-background)',
    );
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass(
      'bg-(--ui-button-ghost-background)',
    );
    expect(screen.getByRole('button', { name: 'Text' })).toHaveClass(
      'bg-transparent',
    );
    expect(screen.getByRole('button', { name: 'Link' })).toHaveClass(
      'text-(--ui-button-link-foreground)',
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'bg-(--ui-button-danger-background)',
    );
    expect(screen.getByRole('button', { name: 'Warning' })).toHaveClass(
      'bg-(--ui-button-warning-background)',
    );
  });

  it('uses default middle styling by default', () => {
    render(<Button>默认按钮</Button>);

    expect(screen.getByRole('button', { name: '默认按钮' })).toHaveClass(
      'bg-(--ui-button-default-background)',
      'h-8',
      'px-3',
    );
  });

  it('renders asChild with button classes on the child element', () => {
    render(
      <Button asChild>
        <a href="/customers">客户列表</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: '客户列表' })).toHaveClass(
      'inline-flex',
      'bg-(--ui-button-default-background)',
      'h-8',
    );
  });

  it('blocks disabled asChild interaction and keeps composed content', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button asChild disabled icon={<RefreshCw data-testid="link-icon" />}>
        <a href="/customers" onClick={onClick}>
          客户列表
        </a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: '客户列表' });

    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();

    await user.click(link);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders icon buttons with accessible names', () => {
    render(
      <IconButton aria-label="刷新">
        <RefreshCw />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: '刷新' })).toHaveClass(
      'h-8',
      'w-8',
    );
  });

  it('renders a single icon when icon button receives an icon prop', () => {
    render(
      <IconButton
        aria-label="刷新"
        icon={<RefreshCw data-testid="refresh-icon" />}
      />,
    );

    expect(screen.getAllByTestId('refresh-icon')).toHaveLength(1);
  });

  it('supports loading state and blocks repeated clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        保存中
      </Button>,
    );

    const button = screen.getByRole('button', { name: '保存中' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders loading indicator in asChild mode', () => {
    render(
      <Button asChild loading>
        <a href="/save">保存中</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: '保存中' });

    expect(link.querySelector('.animate-spin')).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-busy', 'true');
  });

  it('renders icon prop before or after text', () => {
    render(
      <>
        <Button icon={<RefreshCw data-testid="start-icon" />}>刷新</Button>
        <Button icon={<RefreshCw data-testid="end-icon" />} iconPosition="end">
          展开
        </Button>
      </>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('forwards ref to the native button', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>保存</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: '保存' }));
  });
});
