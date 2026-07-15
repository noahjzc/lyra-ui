import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, describe, expect, it, vi } from 'vitest';
import {
  MultiSelect,
  RemoteSelect,
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  type SelectOption,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../src/components/data-input';

const elementPrototype = HTMLElement.prototype as {
  hasPointerCapture?: (pointerId: number) => boolean;
};
const hasPointerCaptureWasOwn = Object.hasOwn(
  elementPrototype,
  'hasPointerCapture',
);
const hasPointerCaptureDescriptor = Object.getOwnPropertyDescriptor(
  elementPrototype,
  'hasPointerCapture',
);
const installedHasPointerCapture =
  typeof elementPrototype.hasPointerCapture !== 'function';

if (installedHasPointerCapture) {
  Object.defineProperty(elementPrototype, 'hasPointerCapture', {
    configurable: true,
    value: () => false,
  });
}

afterAll(() => {
  if (!installedHasPointerCapture) return;

  if (hasPointerCaptureWasOwn && hasPointerCaptureDescriptor != null) {
    Object.defineProperty(
      elementPrototype,
      'hasPointerCapture',
      hasPointerCaptureDescriptor,
    );
    return;
  }

  delete elementPrototype.hasPointerCapture;
});

const statusOptions: SelectOption[] = [
  { label: '待跟进', value: 'pending' },
  { label: '启用', value: 'active' },
  {
    disabled: true,
    disabledReason: '无权限',
    label: '归档',
    value: 'archived',
  },
];

describe('Select', () => {
  it('opens options and handles value selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="客户状态">
          <SelectValue placeholder="选择状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">待跟进</SelectItem>
          <SelectItem value="active">启用</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox', { name: '客户状态' }));
    await user.click(screen.getByRole('option', { name: '启用' }));

    expect(onValueChange).toHaveBeenCalledWith('active');
  });

  it('supports grouped Radix labels without runtime errors', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label="分组状态">
          <SelectValue placeholder="选择状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>状态</SelectLabel>
            <SelectItem value="pending">待跟进</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>受限状态</SelectLabel>
            <SelectItem disabled value="archived">
              已归档
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox', { name: '分组状态' }));

    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByText('受限状态')).toBeInTheDocument();
  });

  it('applies runtime z-index to Radix SelectContent', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label="客户等级">
          <SelectValue placeholder="选择等级" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A级客户</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox', { name: '客户等级' }));

    const content = document.querySelector('[data-slot="select-content"]');

    expect(content).toBeInTheDocument();
    expect((content as HTMLElement).style.zIndex).toMatch(/\d+/);
  });

  it('renders SelectField variants and selects an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SelectField
        aria-label="客户状态"
        onValueChange={onValueChange}
        options={statusOptions}
        placeholder="选择状态"
        variant="filled"
      />,
    );

    const trigger = screen.getByRole('combobox', { name: '选择状态' });

    expect(trigger).toHaveClass('bg-(--ui-input-filled-background)', 'h-8');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: '启用' }));

    expect(onValueChange).toHaveBeenCalledWith('active');
    expect(screen.getByText('启用')).toBeInTheDocument();
  });

  it('clears SelectField value without opening the menu', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SelectField
        clearable
        defaultValue="active"
        onValueChange={onValueChange}
        options={statusOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: '清空选择' }));

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps clear and dropdown icons in separate slots', () => {
    render(
      <SelectField clearable defaultValue="active" options={statusOptions} />,
    );

    expect(screen.getByRole('combobox', { name: '启用' })).not.toHaveClass(
      'pr-8',
      'pr-16',
    );
    expect(
      document.querySelector('[data-slot="select-field-value"]'),
    ).toHaveClass('pr-10');
    expect(screen.getByRole('button', { name: '清空选择' })).toHaveClass(
      'right-8',
    );
  });

  it('filters searchable SelectField options', async () => {
    const user = userEvent.setup();

    render(
      <SelectField
        options={[
          { description: 'wangming@example.com', label: '王明', value: 'wang' },
          { description: 'lina@example.com', label: '李娜', value: 'li' },
        ]}
        placeholder="搜索客户"
        searchable
      />,
    );

    await user.click(screen.getByRole('combobox', { name: '搜索客户' }));
    await user.type(screen.getByRole('textbox', { name: '搜索选项' }), '李');

    expect(screen.getByRole('option', { name: /李娜/ })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /王明/ }),
    ).not.toBeInTheDocument();
  });

  it('clears searchable SelectField without nested controls or opening its panel', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <SelectField
        clearable
        defaultValue="active"
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
        options={statusOptions}
        searchable
        triggerAriaLabel="状态筛选"
      />,
    );

    const trigger = screen.getByRole('combobox', { name: '状态筛选' });
    const clearButton = screen.getByRole('button', { name: '清空选择' });

    expect(clearButton).toHaveAttribute('type', 'button');
    expect(trigger).not.toContainElement(clearButton);
    expect(trigger.querySelector('[role="button"][tabindex]')).toBeNull();

    await user.click(clearButton);

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('loads RemoteSelect options and preserves selected option', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (keyword: string) => [
      { label: `远程-${keyword}`, value: 'remote' },
    ]);

    render(
      <RemoteSelect
        debounceMs={0}
        loadOptions={loadOptions}
        selectedOption={{ label: '已选客户', value: 'selected' }}
        value="selected"
      />,
    );

    await user.click(screen.getByRole('combobox', { name: '已选客户' }));

    expect(
      await screen.findByRole('option', { name: '已选客户' }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: '搜索选项' }), 'A');

    expect(
      await screen.findByRole('option', { name: '远程-A' }),
    ).toBeInTheDocument();
    expect(loadOptions).toHaveBeenLastCalledWith('A');
  });

  it('shows RemoteSelect error and retries', async () => {
    const user = userEvent.setup();
    const loadOptions = vi
      .fn()
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce([{ label: '重试成功', value: 'ok' }]);

    render(<RemoteSelect debounceMs={0} loadOptions={loadOptions} />);

    await user.click(screen.getByRole('combobox', { name: '请选择' }));

    expect(await screen.findByText('选项加载失败')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /重试/ }));

    expect(
      await screen.findByRole('option', { name: '重试成功' }),
    ).toBeInTheDocument();
  });

  it('supports MultiSelect values and keeps the panel open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiSelect
        defaultValue={['pending', 'active']}
        maxTagCount={1}
        onValueChange={onValueChange}
        options={statusOptions}
        placeholder="选择状态"
      />,
    );

    expect(screen.getByText('+1')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: /待跟进/ }));
    await user.click(screen.getByRole('option', { name: /启用/ }));

    expect(onValueChange).toHaveBeenCalledWith(['pending']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('已选择 1 项')).toBeInTheDocument();
  });
});
