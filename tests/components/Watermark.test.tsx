import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Watermark } from '../../src/components/feedback';

describe('Watermark', () => {
  it('renders children and a decorative watermark layer', () => {
    render(
      <Watermark content="内部资料">
        <section aria-label="客户详情">客户名称：上海霖宜</section>
      </Watermark>,
    );

    expect(screen.getByLabelText('客户详情')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="watermark-layer"]'),
    ).toHaveAttribute('aria-hidden', 'true');
    expect(
      document.querySelector('[data-slot="watermark-content"]'),
    ).toHaveAttribute(
      'style',
      expect.stringContaining('color: var(--ui-watermark-foreground);'),
    );
  });

  it('composes multiple text lines into the generated watermark image', () => {
    render(
      <Watermark
        content={['张明', '上海总部']}
        data-testid="watermark"
        opacity={0.16}
      />,
    );

    const layer = document.querySelector('[data-slot="watermark-layer"]');

    expect(screen.getByTestId('watermark')).toHaveAttribute(
      'data-slot',
      'watermark',
    );
    expect(layer).toHaveAttribute('data-content', '张明 上海总部');
    expect(layer).toHaveClass('pointer-events-none');
    expect(layer).toHaveStyle({
      opacity: '0.16',
    });
  });

  it('applies rotation, font size and gap styles without animation', () => {
    render(
      <Watermark
        content="预生产环境"
        fontSize={18}
        gap={[220, 144]}
        rotate={-18}
      />,
    );

    const content = document.querySelector('[data-slot="watermark-content"]');
    const layer = document.querySelector('[data-slot="watermark-layer"]');

    expect(content).toHaveStyle({
      transform: 'rotate(-18deg)',
      fontSize: '18px',
    });
    expect(layer).toHaveStyle({
      backgroundSize: '220px 144px',
    });
  });

  it('keeps full-page watermark decorative while preserving child clicks', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">底层操作</button>
        <Watermark content="内部资料" fullPage>
          <button type="button">水印内操作</button>
        </Watermark>
      </>,
    );

    const root = document.querySelector('[data-slot="watermark"]');
    const children = document.querySelector('[data-slot="watermark-children"]');

    expect(root).toHaveClass('pointer-events-none');
    expect(children).toHaveClass('pointer-events-auto');
    expect(document.querySelector('[data-slot="watermark-layer"]')).toHaveClass(
      'pointer-events-none',
    );

    await user.click(screen.getByRole('button', { name: '水印内操作' }));

    expect(screen.getByRole('button', { name: '水印内操作' })).toHaveFocus();
    expect(screen.getByRole('button', { name: '底层操作' })).toBeEnabled();
  });
});
