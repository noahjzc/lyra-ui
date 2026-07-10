import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type {
  FormContextValue,
  FormItemContextValue,
} from '../../src/components/data-input';
import {
  Form,
  FormContext,
  FormControl,
  FormItem,
  FormItemContext,
  Input,
  useFormContext,
  useFormItemContext,
} from '../../src/components/data-input';

const formContextValue = {
  disabled: true,
  layout: 'horizontal',
  readOnly: true,
  requiredMark: 'optional',
  size: 'small',
} satisfies FormContextValue;

const formItemContextValue = {
  disabled: true,
  fieldId: 'contract-field',
  readOnly: true,
} satisfies FormItemContextValue;

const FormContractProbe = () => {
  const form = useFormContext();
  const item = useFormItemContext();

  return (
    <output
      data-disabled={form.disabled && item.disabled ? 'true' : 'false'}
      data-field-id={item.fieldId}
      data-layout={form.layout}
      data-readonly={form.readOnly && item.readOnly ? 'true' : 'false'}
      data-size={form.size}
      data-testid="form-contract-probe"
    />
  );
};

describe('Form primitive', () => {
  it('links label, control, description and message', () => {
    render(
      <Form>
        <FormItem
          error="请输入 11 位手机号"
          help="用于短信通知"
          label="联系电话"
          name="mobile"
          required
        >
          <FormControl asChild>
            <Input placeholder="请输入手机号" />
          </FormControl>
        </FormItem>
      </Form>,
    );

    const input = screen.getByRole('textbox', { name: /联系电话/ });

    expect(input).toHaveAttribute('id', 'form-field-mobile');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('form-field-mobile-message'),
    );
    expect(screen.getByText('请输入 11 位手机号')).toBeInTheDocument();
  });

  it('supports horizontal layout and label column width', () => {
    const { container } = render(
      <Form labelCol={{ width: 120 }} layout="horizontal">
        <Form.Item label="客户名称" name="name">
          <Form.Control asChild>
            <Input />
          </Form.Control>
        </Form.Item>
        <Form.Footer>Actions</Form.Footer>
      </Form>,
    );

    expect(container.querySelector('[data-slot="form-item"]')).toHaveStyle({
      '--ui-form-label-width': '120px',
    });
    expect(container.querySelector('[data-slot="form-footer"]')).toHaveStyle({
      marginLeft: '120px',
    });
  });

  it('submits native form values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <Form onSubmit={onSubmit}>
        <Form.Item label="客户名称" name="name">
          <Form.Control asChild>
            <Input name="name" />
          </Form.Control>
        </Form.Item>
        <button type="submit">保存</button>
      </Form>,
    );

    await user.type(
      screen.getByRole('textbox', { name: '客户名称' }),
      '上海客户',
    );
    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports Form.Item namespace API', () => {
    render(
      <Form>
        <Form.Item label="编号" name="code" optional>
          <Form.Control asChild>
            <Input />
          </Form.Control>
        </Form.Item>
      </Form>,
    );

    expect(screen.getByText('可选')).toBeInTheDocument();
  });

  it('renders section, responsive grid and readonly value', () => {
    const { container } = render(
      <Form layout="vertical">
        <Form.Section description="客户基础信息" title="基础字段">
          <Form.Grid columns={3}>
            <Form.Item label="客户编号">
              <Form.ReadonlyValue value="CU-2026-0187" />
            </Form.Item>
          </Form.Grid>
        </Form.Section>
      </Form>,
    );

    expect(screen.getByText('基础字段')).toBeInTheDocument();
    expect(screen.getByText('客户基础信息')).toBeInTheDocument();
    expect(screen.getByText('CU-2026-0187')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="form-grid"]')).toHaveAttribute(
      'data-columns',
      '3',
    );
  });

  it('exposes validation status and feedback icon', () => {
    const { container } = render(
      <Form hasFeedback>
        <Form.Item
          help="正在检查重复客户"
          label="客户名称"
          name="name"
          validateStatus="validating"
        >
          <Form.Control asChild>
            <Input />
          </Form.Control>
        </Form.Item>
      </Form>,
    );

    expect(screen.getByRole('textbox', { name: '客户名称' })).toHaveAttribute(
      'data-status',
      'validating',
    );
    expect(
      container.querySelector('[data-slot="form-feedback-icon"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-slot="form-item"]')).toHaveAttribute(
      'data-status',
      'validating',
    );
  });

  it('supports item span and footer alignment options', () => {
    const { container } = render(
      <Form layout="vertical">
        <Form.Grid columns={2}>
          <Form.Item label="备注" span="full">
            <Form.Control asChild>
              <Input.Textarea />
            </Form.Control>
          </Form.Item>
        </Form.Grid>
        <Form.Footer justify="end">Actions</Form.Footer>
      </Form>,
    );

    expect(container.querySelector('[data-slot="form-item"]')).toHaveClass(
      'col-span-full',
    );
    expect(container.querySelector('[data-slot="form-footer"]')).toHaveClass(
      'justify-end',
    );
  });

  it('propagates disabled form state to asChild inputs', async () => {
    const user = userEvent.setup();

    render(
      <Form disabled>
        <Form.Item label="禁用客户名称" name="disabled-name">
          <Form.Control asChild>
            <Input defaultValue="不可修改" />
          </Form.Control>
        </Form.Item>
      </Form>,
    );

    const input = screen.getByRole('textbox', { name: '禁用客户名称' });

    expect(input).toBeDisabled();
    expect(input.closest('[data-slot="input-root"]')).toHaveAttribute(
      'data-disabled',
      'true',
    );

    await user.type(input, '新增');

    expect(input).toHaveValue('不可修改');
  });

  it('propagates readonly form state without disabling inputs', async () => {
    const user = userEvent.setup();

    render(
      <Form readOnly>
        <Form.Item label="只读客户名称" name="readonly-name">
          <Form.Control asChild>
            <Input defaultValue="仅查看" />
          </Form.Control>
        </Form.Item>
      </Form>,
    );

    const input = screen.getByRole('textbox', { name: '只读客户名称' });

    expect(input).toHaveAttribute('readonly');
    expect(input).not.toBeDisabled();
    expect(input.closest('[data-slot="input-root"]')).toHaveAttribute(
      'data-readonly',
      'true',
    );

    await user.type(input, '新增');

    expect(input).toHaveValue('仅查看');
  });

  it('allows explicit field state false to override form defaults', async () => {
    const user = userEvent.setup();

    render(
      <Form disabled readOnly>
        <Form.Item
          disabled={false}
          label="可编辑客户名称"
          name="editable-name"
          readOnly={false}
        >
          <Form.Control asChild>
            <Input defaultValue="初始值" />
          </Form.Control>
        </Form.Item>
      </Form>,
    );

    const input = screen.getByRole('textbox', { name: '可编辑客户名称' });
    const item = input.closest('[data-slot="form-item"]');

    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(item).not.toHaveAttribute('data-disabled');
    expect(item).not.toHaveAttribute('data-readonly');

    await user.type(input, '已更新');

    expect(input).toHaveValue('初始值已更新');
  });

  it('exports form contexts, hooks and value types through data-input', () => {
    render(
      <FormContext.Provider value={formContextValue}>
        <FormItemContext.Provider value={formItemContextValue}>
          <FormContractProbe />
        </FormItemContext.Provider>
      </FormContext.Provider>,
    );

    expect(screen.getByTestId('form-contract-probe')).toHaveAttribute(
      'data-layout',
      'horizontal',
    );
    expect(screen.getByTestId('form-contract-probe')).toHaveAttribute(
      'data-size',
      'small',
    );
    expect(screen.getByTestId('form-contract-probe')).toHaveAttribute(
      'data-field-id',
      'contract-field',
    );
    expect(screen.getByTestId('form-contract-probe')).toHaveAttribute(
      'data-disabled',
      'true',
    );
    expect(screen.getByTestId('form-contract-probe')).toHaveAttribute(
      'data-readonly',
      'true',
    );
  });
});
