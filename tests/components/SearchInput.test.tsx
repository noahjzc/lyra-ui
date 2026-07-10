import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  SearchInput,
  SearchInputWithPanel,
  SearchSuggestionPanel,
} from '../../src/components/data-input';

describe('SearchInput', () => {
  it('submits search with Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} placeholder="搜索客户" />);

    await user.type(screen.getByRole('searchbox'), '王明{Enter}');

    expect(onSearch).toHaveBeenCalledWith('王明');
  });

  it('supports controlled value changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<SearchInput onValueChange={onValueChange} value="" />);

    await user.type(screen.getByRole('searchbox'), '合同');

    expect(onValueChange).toHaveBeenLastCalledWith('同');
  });

  it('clears uncontrolled search value, returns focus, and submits empty search', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onSearch = vi.fn();

    render(
      <SearchInput
        defaultValue="contract"
        onClear={onClear}
        onSearch={onSearch}
      />,
    );

    const input = screen.getByRole('searchbox');

    await user.click(screen.getByRole('button', { name: '清空搜索' }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('submits with explicit button and blocks while loading', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    const { rerender } = render(
      <SearchInput defaultValue="invoice" onSearch={onSearch} searchButton />,
    );

    await user.click(screen.getByRole('button', { name: '搜索' }));

    expect(onSearch).toHaveBeenCalledWith('invoice');

    rerender(
      <SearchInput
        defaultValue="invoice"
        loading
        onSearch={onSearch}
        searchButton
      />,
    );

    await user.click(screen.getByRole('button', { name: '搜索' }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('shows loading state with aria busy', () => {
    render(<SearchInput loading value="contract" />);

    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('搜索中')).toBeInTheDocument();
  });

  it('renders flexible suggestion option content', () => {
    render(
      <SearchSuggestionPanel
        groups={[
          {
            label: '建议结果',
            options: [
              {
                data: { owner: '张明' },
                render: option => (
                  <span>
                    客户：{option.value} / 负责人：
                    {option.data?.owner}
                  </span>
                ),
                value: '上海霖宜贸易',
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByText('建议结果')).toHaveAttribute(
      'data-slot',
      'search-suggestion-group-label',
    );
    expect(
      screen.getByRole('option', { name: /客户：上海霖宜贸易/ }),
    ).toBeInTheDocument();
  });

  it('selects panel option with keyboard without submitting raw input first', async () => {
    const user = userEvent.setup();
    const onOptionSelect = vi.fn();
    const onSearch = vi.fn();
    const onValueChange = vi.fn();

    render(
      <SearchInputWithPanel
        groups={[
          {
            label: '最近搜索',
            options: [
              { label: 'invoice overdue report', value: 'invoice overdue' },
              { label: '客户资料', value: 'customer profile' },
            ],
          },
        ]}
        onOptionSelect={onOptionSelect}
        onSearch={onSearch}
        onValueChange={onValueChange}
        placeholder="搜索内容"
      />,
    );

    await user.click(screen.getByRole('searchbox'));
    await user.keyboard('{Enter}');

    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'invoice overdue' }),
    );
    expect(onValueChange).toHaveBeenLastCalledWith('invoice overdue');
    expect(onSearch).toHaveBeenCalledWith('invoice overdue');
    expect(onSearch).not.toHaveBeenCalledWith('');
  });

  it('positions SearchInputWithPanel portal with trigger rect and z-stack', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <SearchInputWithPanel
        groups={[
          {
            label: '最近搜索',
            options: [{ label: '客户资料', value: 'customer profile' }],
          },
        ]}
        placeholder="搜索内容"
      />,
    );
    const root = container.querySelector(
      '[data-slot="search-input-with-panel"]',
    ) as HTMLSpanElement;

    root.getBoundingClientRect = () =>
      ({
        bottom: 44,
        height: 32,
        left: 12,
        right: 332,
        top: 12,
        width: 320,
        x: 12,
        y: 12,
        toJSON: () => ({}),
      }) as DOMRect;

    await user.click(screen.getByRole('searchbox'));

    const panel = document.querySelector(
      '[data-slot="search-input-panel-content"]',
    ) as HTMLDivElement;

    expect(panel).toHaveStyle({
      left: '12px',
      position: 'fixed',
      top: '48px',
      width: '320px',
    });
    expect(panel).not.toHaveClass('absolute', 'top-full');
    expect(Number.isFinite(Number(panel.style.zIndex))).toBe(true);
  });
});
