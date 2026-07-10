import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Image } from '../../src/components/data-view';

describe('Image', () => {
  it('renders image with ratio and object fit', () => {
    render(
      <Image
        alt="资质图片"
        objectFit="contain"
        ratio="4 / 3"
        src="/license.png"
        width={120}
      />,
    );

    expect(screen.getByRole('img', { name: '资质图片' })).toHaveStyle({
      objectFit: 'contain',
    });
    expect(document.querySelector('[data-slot="image"]')).toHaveStyle({
      aspectRatio: '4 / 3',
      width: '120px',
    });
  });

  it('shows fallback when image fails', () => {
    render(<Image alt="附件" src="/missing.png" />);

    fireEvent.error(screen.getByRole('img', { name: '附件' }));

    expect(screen.getByText('图片不可用')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('opens and closes preview', async () => {
    const user = userEvent.setup();
    const onPreviewChange = vi.fn();

    render(
      <Image
        alt="附件"
        onPreviewChange={onPreviewChange}
        preview
        src="/attachment.png"
      />,
    );

    await user.click(screen.getByRole('button', { name: '预览附件' }));

    expect(
      screen.getByRole('dialog', { name: '预览附件' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: '预览附件' })).toHaveClass(
      'data-[state=open]:animate-ui-dialog-in',
      'data-[state=closed]:animate-ui-dialog-out',
    );
    expect(onPreviewChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button', { name: '关闭预览' }));

    expect(onPreviewChange).toHaveBeenCalledWith(false);
  });

  it('closes preview with Escape', async () => {
    const user = userEvent.setup();
    const onPreviewChange = vi.fn();

    render(
      <Image
        alt="合同附件"
        onPreviewChange={onPreviewChange}
        preview
        src="/attachment.png"
      />,
    );

    await user.click(screen.getByRole('button', { name: '预览合同附件' }));
    await user.keyboard('{Escape}');

    expect(onPreviewChange).toHaveBeenLastCalledWith(false);
  });

  it('renders permission-denied state and download action', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <Image
        alt="资质图片"
        downloadable
        onDownload={onDownload}
        permissionText="无预览权限"
        src="/license.png"
        status="permission-denied"
      />,
    );

    expect(screen.getByText('无预览权限')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="image-fallback-actions"]'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '下载资质图片' }));

    expect(onDownload).toHaveBeenCalledTimes(1);

    render(
      <Image
        alt="可下载附件"
        downloadable
        onDownload={onDownload}
        src="/attachment.png"
      />,
    );

    await user.click(screen.getByRole('link', { name: '下载可下载附件' }));

    expect(onDownload).toHaveBeenCalledTimes(2);
  });
});
