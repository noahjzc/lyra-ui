import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Form,
  FormControl,
  FormItem,
  Input,
} from '../../src/components/data-input';

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
});
