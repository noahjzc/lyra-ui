import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Upload, type UploadFileItem } from '../../src/components/data-input';

function createFile(name: string, size: number, type: string) {
  return new File(['x'.repeat(size)], name, { type });
}

describe('Upload', () => {
  it('adds selected files and renders file rows', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Upload multiple onValueChange={onValueChange} />,
    );

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      createFile('合同.pdf', 128, 'application/pdf'),
    );

    expect(onValueChange).toHaveBeenCalledWith([
      expect.objectContaining({
        name: '合同.pdf',
        status: 'ready',
      }),
    ]);
    expect(screen.getByText('合同.pdf')).toBeInTheDocument();
  });

  it('validates max size before adding a file', async () => {
    const user = userEvent.setup();
    const { container } = render(<Upload maxSize={2} />);

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      createFile('large.pdf', 8, 'application/pdf'),
    );

    expect(screen.getByText('文件超过 2 B')).toBeInTheDocument();
    expect(screen.getByText('large.pdf')).toBeInTheDocument();
  });

  it('supports beforeUpload rejection with a recoverable error row', async () => {
    const user = userEvent.setup();
    const beforeUpload = vi.fn(() => ({
      error: '业务校验失败',
      ok: false,
    }));
    const { container } = render(<Upload beforeUpload={beforeUpload} />);

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      createFile('customers.xlsx', 4, 'application/vnd.ms-excel'),
    );

    expect(beforeUpload).toHaveBeenCalledTimes(1);
    expect(screen.getByText('业务校验失败')).toBeInTheDocument();
  });

  it('removes files from controlled list', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const file: UploadFileItem = {
      name: '协议.pdf',
      size: 12,
      status: 'done',
      uid: 'contract',
    };

    render(<Upload onValueChange={onValueChange} value={[file]} />);

    await user.click(screen.getByRole('button', { name: '移除 协议.pdf' }));

    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('replaces a single filled file even when maxCount is reached', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const file: UploadFileItem = {
      name: '旧协议.pdf',
      size: 12,
      status: 'done',
      uid: 'old-contract',
    };

    const { container } = render(
      <Upload maxCount={1} onValueChange={onValueChange} value={[file]} />,
    );

    await user.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      createFile('新协议.pdf', 24, 'application/pdf'),
    );

    expect(onValueChange).toHaveBeenCalledWith([
      expect.objectContaining({
        name: '新协议.pdf',
        status: 'ready',
      }),
    ]);
  });

  it('keeps readOnly filled files viewable but not removable', () => {
    const file: UploadFileItem = {
      name: '营业执照.pdf',
      size: 12,
      status: 'done',
      uid: 'license',
    };

    render(<Upload onPreview={() => undefined} readOnly value={[file]} />);

    expect(
      screen.getByRole('button', { name: '预览 营业执照.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '移除 营业执照.pdf' }),
    ).not.toBeInTheDocument();
  });

  it('renders progress and retry actions', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const files: UploadFileItem[] = [
      {
        name: '报价.xlsx',
        percent: 68,
        status: 'uploading',
        uid: 'quote',
      },
      {
        error: '校验失败',
        name: '客户清单.xlsx',
        status: 'error',
        uid: 'customer-list',
      },
    ];

    render(<Upload multiple onRetry={onRetry} value={files} />);

    expect(screen.getByText('上传中 · 68% · 可取消')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: '重试 客户清单.xlsx' }),
    );

    expect(onRetry).toHaveBeenCalledWith(files[1]);
  });

  it('renders picture wall actions as keyboard reachable buttons', () => {
    render(
      <Upload
        onPreview={() => undefined}
        value={[{ name: 'license.png', status: 'done', uid: 'license' }]}
        variant="picture"
      />,
    );

    expect(
      screen.getByRole('button', { name: '预览 license.png' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /删除/ })).toBeInTheDocument();
  });
});
