import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import { Image } from '../index';

const imageSrc =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=480&fit=crop';
const wideImageSrc =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=640&h=360&fit=crop';
const storyContainerClassName = 'flex w-full max-w-[960px] flex-col gap-4';
const sectionClassName =
  'flex min-w-0 flex-col gap-3 rounded-md border border-ui-border bg-ui-background p-4';
const imageRowClassName = 'flex min-w-0 flex-wrap items-start gap-3';

const meta = {
  title: 'Primitives/Data View/Image',
  component: Image,
  tags: ['autodocs'],
  args: {
    alt: '附件图片',
    src: imageSrc,
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Thumbnail: Story = {
  render: args => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className={imageRowClassName}>
          <Image
            {...args}
            caption="营业执照.jpg"
            downloadable
            onDownload={fn()}
            preview
            ratio="4 / 3"
            width={112}
          />
          <Image
            alt="签收回单 PNG 缩略图"
            caption="签收回单.png"
            objectFit="contain"
            ratio="4 / 3"
            src={imageSrc}
            width={112}
          />
          <Image
            alt="门店照片缩略图"
            caption="门店照片"
            preview
            ratio="16 / 9"
            src={wideImageSrc}
            width={144}
          />
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className={imageRowClassName}>
          <Image
            alt="加载中的附件"
            caption="加载中"
            ratio="4 / 3"
            status="loading"
            width={112}
          />
          <Image
            alt="加载失败附件"
            caption="文件不存在"
            errorText="加载失败"
            ratio="4 / 3"
            status="error"
            width={112}
          />
          <Image
            alt="权限受限附件"
            caption="可申请权限"
            permissionText="无预览权限"
            ratio="4 / 3"
            status="permission-denied"
            width={112}
          />
        </div>
        <span className="w-max max-w-full rounded-[5px] border border-ui-warning/35 bg-ui-warning/10 px-2 py-1 text-xs font-semibold text-ui-warning">
          失败态必须保留文件名和下一步
        </span>
      </div>
    </div>
  ),
};

export const RatioAndFit: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className={imageRowClassName}>
          <Image
            alt="组织 Logo 缩略图"
            caption="1:1 组织 Logo"
            objectFit="contain"
            ratio={1}
            src={imageSrc}
            width={96}
          />
          <Image
            alt="证照缩略图"
            caption="4:3 证照"
            ratio="4 / 3"
            src={imageSrc}
            width={120}
          />
          <Image
            alt="场景图缩略图"
            caption="16:9 场景图"
            ratio="16 / 9"
            src={wideImageSrc}
            width={160}
          />
        </div>
      </div>
    </div>
  ),
};

export const Verification: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className="text-sm font-bold text-ui-foreground">客户资质附件</div>
        <div className={imageRowClassName}>
          <Image
            alt="营业执照缩略图"
            caption="执照"
            preview
            ratio="4 / 3"
            src={imageSrc}
            width={112}
          />
          <Image
            alt="授权书缩略图"
            caption="授权书"
            errorText="失败"
            ratio="4 / 3"
            status="error"
            width={112}
          />
        </div>
        <span className="w-max max-w-full rounded-[5px] border border-ui-destructive/25 bg-ui-destructive/10 px-2 py-1 text-xs font-semibold text-ui-destructive">
          授权书.pdf 文件不存在，可重新上传
        </span>
        <Button
          className="w-max"
          icon={<Download className="size-3.5" />}
          size="small"
          variant="ghost"
        >
          下载原文件
        </Button>
      </div>
    </div>
  ),
};
