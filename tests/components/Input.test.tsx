import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from 'lucide-react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input, InputNumber, Textarea } from '../../src/components/data-input';

describe('Input', () => {
  it('renders outlined middle input by default', () => {
    render(<Input aria-label="客户名称" placeholder="请输入客户名称" />);

    const input = screen.getByRole('textbox', { name: '客户名称' });
    const root = input.closest('[data-slot="input-root"]');

    expect(root).toHaveClass(
      'h-8',
      'rounded-md',
      'border-(--ui-input-border)',
      'bg-(--ui-input-background)',
    );
    expect(input).toHaveClass('h-[22px]', 'text-sm', 'leading-[22px]');
  });

  it('normalizes null size to middle for inputs and number inputs', () => {
    render(
      <>
        <Input aria-label="空尺寸文本" size={null} />
        <InputNumber aria-label="空尺寸数值" size={null} />
      </>,
    );

    expect(
      screen
        .getByRole('textbox', { name: '空尺寸文本' })
        .closest('[data-slot="input-root"]'),
    ).toHaveClass('h-8', 'px-2.5');
    expect(
      screen
        .getByRole('spinbutton', { name: '空尺寸数值' })
        .closest('[data-slot="input-number-root"]'),
    ).toHaveClass('h-8', 'px-2.5');
  });

  it('supports design variants and sizes', () => {
    render(
      <>
        <Input aria-label="填充" size="small" variant="filled" />
        <Input aria-label="无边框" variant="borderless" />
        <Input aria-label="底线" size="large" variant="underlined" />
      </>,
    );

    expect(
      screen.getByRole('textbox', { name: '填充' }).closest('[data-slot]'),
    ).toHaveClass('h-7', 'bg-(--ui-input-filled-background)');
    expect(
      screen.getByRole('textbox', { name: '无边框' }).closest('[data-slot]'),
    ).toHaveClass('border-transparent', 'bg-transparent');
    expect(
      screen.getByRole('textbox', { name: '底线' }).closest('[data-slot]'),
    ).toHaveClass('h-9', 'rounded-none', 'border-x-0');
  });

  it('marks invalid inputs with aria-invalid and root state', () => {
    render(<Input aria-label="客户名称" invalid />);

    const input = screen.getByRole('textbox', { name: '客户名称' });
    const root = input.closest('[data-slot="input-root"]');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(root).toHaveAttribute('data-invalid', 'true');
    expect(root).toHaveClass(
      'data-[invalid=true]:border-(--ui-input-error-border)',
    );
  });

  it('supports disabled and readonly states', () => {
    render(
      <>
        <Input aria-label="禁用字段" disabled />
        <Input aria-label="只读字段" readOnly defaultValue="C-001" />
      </>,
    );

    expect(
      screen.getByRole('textbox', { name: '禁用字段' }).closest('[data-slot]'),
    ).toHaveAttribute('data-disabled', 'true');
    expect(
      screen.getByRole('textbox', { name: '只读字段' }).closest('[data-slot]'),
    ).toHaveAttribute('data-readonly', 'true');
  });

  it('renders prefix, suffix and addons in stable slots', () => {
    render(
      <Input
        aria-label="组合字段"
        defaultValue="91310115MA1K3"
        prefix={<Search data-testid="search-icon" />}
        prefixAddon="编码"
        suffix="已校验"
        suffixAddon="天"
      />,
    );

    const root = screen
      .getByRole('textbox', { name: '组合字段' })
      .closest('[data-slot="input-root"]');

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(root?.querySelector('[data-slot="input-prefix"]')).toHaveTextContent(
      '',
    );
    expect(root).toHaveTextContent('编码');
    expect(root).toHaveTextContent('已校验');
    expect(root).toHaveTextContent('天');
  });

  it('clears uncontrolled value and keeps focus', async () => {
    const user = userEvent.setup();

    render(<Input allowClear aria-label="客户名称" defaultValue="张明" />);

    const input = screen.getByRole('textbox', { name: '客户名称' });

    expect(input).toHaveValue('张明');

    await user.click(screen.getByRole('button', { name: '清空输入' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('does not show clear button when showCount is enabled', () => {
    render(
      <Input
        allowClear
        aria-label="重点记录"
        defaultValue="重点记录"
        maxLength={20}
        showCount
      />,
    );

    expect(
      screen.queryByRole('button', { name: '清空输入' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('4 / 20')).toHaveAttribute(
      'data-slot',
      'input-count',
    );
  });

  it('supports custom count formatter and invalid count overflow', () => {
    render(
      <Input
        aria-label="超长记录"
        defaultValue="abcdef"
        maxLength={4}
        showCount={(count, maxLength) => `${count}/${maxLength}`}
      />,
    );

    expect(screen.getByText('6/4')).toHaveClass('text-ui-destructive');
    expect(screen.getByRole('textbox', { name: '超长记录' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('copies readonly value with feedback', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <Input
        aria-label="客户编号"
        copyable={{ copiedLabel: '完成', label: '复制' }}
        readOnly
        defaultValue="CU-2026-0187"
      />,
    );

    await user.click(screen.getByRole('button', { name: '复制' }));

    expect(writeText).toHaveBeenCalledWith('CU-2026-0187');
    expect(screen.getByRole('button', { name: '完成' })).toBeInTheDocument();
  });

  it('forwards ref to the native input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input aria-label="客户名称" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: '客户名称' }));
  });
});

describe('Textarea', () => {
  it('renders Input.Textarea as the textarea family API', () => {
    render(<Input.Textarea aria-label="备注" rows={4} />);

    const textarea = screen.getByRole('textbox', { name: '备注' });
    const root = textarea.closest('[data-slot="textarea-root"]');

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(root).toHaveClass(
      'rounded-md',
      'border-(--ui-input-border)',
      'bg-(--ui-input-background)',
    );
    expect(textarea).toHaveStyle({ '--ui-textarea-rows': '4' });
  });

  it('supports textarea variants, resize and row sizing', () => {
    render(
      <>
        <Textarea aria-label="填充备注" resize="vertical" variant="filled" />
        <Textarea aria-label="底线备注" rows={2} variant="underlined" />
      </>,
    );

    expect(
      screen.getByRole('textbox', { name: '填充备注' }).closest('[data-slot]'),
    ).toHaveClass('bg-(--ui-input-filled-background)');
    expect(screen.getByRole('textbox', { name: '填充备注' })).toHaveClass(
      'resize-y',
    );
    expect(
      screen.getByRole('textbox', { name: '底线备注' }).closest('[data-slot]'),
    ).toHaveClass('rounded-t-md', 'border-x-0');
    expect(screen.getByRole('textbox', { name: '底线备注' })).toHaveStyle({
      '--ui-textarea-rows': '2',
    });
  });

  it('marks invalid textareas and uses invalid token classes', () => {
    render(<Textarea aria-label="无效备注" invalid />);

    const textarea = screen.getByRole('textbox', { name: '无效备注' });
    const root = textarea.closest('[data-slot="textarea-root"]');

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(root).toHaveAttribute('data-invalid', 'true');
    expect(root).toHaveClass(
      'data-[invalid=true]:border-(--ui-input-error-border)',
    );
  });

  it('supports clear and count at different corners', async () => {
    const user = userEvent.setup();

    render(
      <Textarea
        allowClear
        aria-label="处理备注"
        defaultValue="已填写内容"
        maxLength={200}
        showCount
      />,
    );

    const textarea = screen.getByRole('textbox', { name: '处理备注' });

    expect(screen.getByRole('button', { name: '清空输入' })).toHaveAttribute(
      'data-slot',
      'textarea-clear',
    );
    expect(screen.getByText('5 / 200')).toHaveAttribute(
      'data-slot',
      'textarea-count',
    );

    await user.click(screen.getByRole('button', { name: '清空输入' }));

    expect(textarea).toHaveValue('');
    expect(textarea).toHaveFocus();
  });

  it('supports autoSize and forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        aria-label="自动高度"
        autoSize={{ maxRows: 6, minRows: 2 }}
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByRole('textbox', { name: '自动高度' }));
  });
});

describe('InputNumber', () => {
  it('renders Input.Number as spinbutton with shared input styling', () => {
    render(<Input.Number aria-label="金额" defaultValue={128000} />);

    const input = screen.getByRole('spinbutton', { name: '金额' });
    const root = input.closest('[data-slot="input-number-root"]');

    expect(input).toHaveValue('128000');
    expect(input).toHaveAttribute('aria-valuenow', '128000');
    expect(root).toHaveClass(
      'h-8',
      'border-(--ui-input-border)',
      'bg-(--ui-input-background)',
    );
  });

  it('keeps empty value different from zero', () => {
    render(
      <>
        <InputNumber aria-label="空数值" />
        <InputNumber aria-label="零值" defaultValue={0} />
      </>,
    );

    expect(screen.getByRole('spinbutton', { name: '空数值' })).toHaveValue('');
    expect(screen.getByRole('spinbutton', { name: '零值' })).toHaveValue('0');
  });

  it('steps values with precision and range limits', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <InputNumber
        aria-label="比例"
        defaultValue={0.5}
        max={1}
        min={0}
        onValueChange={onValueChange}
        precision={2}
        step={0.25}
        suffixAddon="%"
      />,
    );

    await user.click(screen.getByRole('button', { name: '增加数值' }));

    expect(onValueChange).toHaveBeenLastCalledWith(0.75);
    expect(screen.getByRole('spinbutton', { name: '比例' })).toHaveValue(
      '0.75',
    );

    await user.click(screen.getByRole('button', { name: '减少数值' }));

    expect(onValueChange).toHaveBeenLastCalledWith(0.5);
  });

  it('places stepper according to the input number variant design', () => {
    render(
      <>
        <InputNumber aria-label="默认步进" defaultValue={10} />
        <InputNumber
          aria-label="无边框步进"
          defaultValue={10}
          variant="borderless"
        />
        <InputNumber
          aria-label="底线步进"
          defaultValue={10}
          variant="underlined"
        />
      </>,
    );

    const underlinedRoot = screen
      .getByRole('spinbutton', { name: '底线步进' })
      .closest('[data-slot="input-number-root"]');
    const defaultStepper = screen
      .getByRole('spinbutton', { name: '默认步进' })
      .closest('[data-slot="input-number-root"]')
      ?.querySelector('[data-slot="input-number-stepper"]');
    const borderlessStepper = screen
      .getByRole('spinbutton', { name: '无边框步进' })
      .closest('[data-slot="input-number-root"]')
      ?.querySelector('[data-slot="input-number-stepper"]');
    const underlinedStepper = underlinedRoot?.querySelector(
      '[data-slot="input-number-stepper"]',
    );

    expect(defaultStepper).toHaveClass('-mr-2.5', 'self-stretch');
    expect(borderlessStepper).toHaveClass(
      'h-[30px]',
      'self-center',
      'rounded-[5px]',
      'border',
    );
    expect(underlinedRoot).toHaveClass('px-0');
    expect(underlinedStepper).toHaveClass(
      'h-[30px]',
      'self-center',
      'rounded-[5px]',
      'border',
    );
  });

  it('parses formatted text on blur and formats display value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <InputNumber
        aria-label="预算"
        formatter={value =>
          value == null ? '' : value.toLocaleString('zh-CN')
        }
        onValueChange={onValueChange}
        parser={value => Number(value.replace(/,/g, ''))}
        textAlign="right"
      />,
    );

    const input = screen.getByRole('spinbutton', { name: '预算' });

    await user.click(input);
    await user.type(input, '128,000');
    await user.tab();

    expect(onValueChange).toHaveBeenLastCalledWith(128000);
    expect(input).toHaveValue('128,000');
    expect(input).toHaveClass('text-right', 'tabular-nums');
  });

  it('marks out-of-range values as invalid', () => {
    render(<InputNumber aria-label="折扣" defaultValue={120} max={100} />);

    const input = screen.getByRole('spinbutton', { name: '折扣' });
    const root = input.closest('[data-slot="input-number-root"]');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(root).toHaveAttribute('data-invalid', 'true');
  });

  it('forwards ref to native input', () => {
    const ref = createRef<HTMLInputElement>();

    render(<InputNumber aria-label="数量" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('spinbutton', { name: '数量' }));
  });
});
