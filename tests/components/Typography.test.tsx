import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Code,
  Kbd,
  Paragraph,
  Text,
  Title,
} from '../../src/components/general';

describe('Typography', () => {
  it('renders title level with semantic heading', () => {
    render(<Title level={2}>客户详情</Title>);

    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(
      'text-2xl',
      'leading-8',
      'font-extrabold',
    );
  });

  it('matches design typography weights for compact and mini text', () => {
    render(
      <>
        <Text data-testid="compact" variant="compact">
          强调信息
        </Text>
        <Text data-testid="mini" variant="mini">
          标签
        </Text>
      </>,
    );

    expect(screen.getByTestId('compact')).toHaveClass(
      'text-sm',
      'leading-[22px]',
      'font-bold',
    );
    expect(screen.getByTestId('mini')).toHaveClass('text-xs', 'font-bold');
  });

  it('supports text tones, truncation and numeric style', () => {
    render(
      <Text data-testid="text" numeric tone="link" truncate>
        ¥128,000
      </Text>,
    );

    expect(screen.getByTestId('text')).toHaveClass(
      'text-(--color-primary)',
      'overflow-hidden',
      'tabular-nums',
    );
  });

  it('supports multiline paragraph clamp', () => {
    render(
      <Paragraph data-testid="paragraph" rows={2}>
        长文本
      </Paragraph>,
    );

    expect(screen.getByTestId('paragraph')).toHaveAttribute('data-rows', '2');
    expect(screen.getByTestId('paragraph')).toHaveClass('overflow-hidden');
  });

  it('renders code and keyboard text', () => {
    render(
      <div>
        <Code>CU-2026-0187</Code>
        <Kbd>⌘</Kbd>
      </div>,
    );

    expect(screen.getByText('CU-2026-0187')).toHaveAttribute(
      'data-slot',
      'typography-code',
    );
    expect(screen.getByText('⌘')).toHaveAttribute(
      'data-slot',
      'typography-kbd',
    );
  });

  it('supports label attributes and forwards refs', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Text as="label" htmlFor="customerName" ref={ref}>
        客户名称
      </Text>,
    );

    expect(screen.getByText('客户名称')).toHaveAttribute('for', 'customerName');
    expect(ref.current).toBe(screen.getByText('客户名称'));
  });
});
