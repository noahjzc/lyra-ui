import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Upload, type UploadFileItem } from '../index';

const meta = {
  title: 'Primitives/Data Input/Upload',
  component: Upload,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'flex min-h-[420px] flex-col gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-32 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';
const licenseThumb =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 88 88%22%3E%3Crect width=%2288%22 height=%2288%22 fill=%22%23f8fafc%22/%3E%3Cpath d=%22M18 18h52v52H18z%22 fill=%22%23e0f7fb%22 stroke=%22%230e7490%22/%3E%3Cpath d=%22M28 34h32M28 44h24M28 54h30%22 stroke=%22%230f5f78%22 stroke-width=%223%22/%3E%3C/svg%3E';
const sceneThumb =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 88 88%22%3E%3Crect width=%2288%22 height=%2288%22 fill=%22%2367e8f9%22/%3E%3Ccircle cx=%2264%22 cy=%2222%22 r=%228%22 fill=%22white%22/%3E%3Cpath d=%22M0 70 34 38l22 20 18-14 14 26z%22 fill=%22%230e7490%22/%3E%3C/svg%3E';

const attachmentFiles: UploadFileItem[] = [
  {
    name: '客户合作协议.pdf',
    size: 1_258_291,
    status: 'done',
    uid: 'contract',
  },
  {
    name: '报价明细.xlsx',
    percent: 68,
    size: 928_120,
    status: 'uploading',
    uid: 'quote',
  },
  {
    error: '第 12 行缺少客户名称',
    name: '客户清单.xlsx',
    size: 428_120,
    status: 'error',
    uid: 'customer-list',
  },
];

const pictureFiles: UploadFileItem[] = [
  {
    name: 'license.png',
    status: 'done',
    thumbUrl: licenseThumb,
    uid: 'license',
  },
  {
    name: 'scene.jpg',
    percent: 42,
    status: 'uploading',
    thumbUrl: sceneThumb,
    uid: 'scene',
  },
  {
    error: '上传失败',
    name: 'failed.png',
    status: 'error',
    uid: 'failed',
  },
];

function ControlledUploadDemo() {
  const [files, setFiles] = React.useState<UploadFileItem[]>(attachmentFiles);

  return (
    <Upload
      accept=".pdf,.xlsx,image/*"
      hint="支持 PDF、Excel、图片；单个文件不超过 10 MB；最多 8 个文件。"
      maxCount={8}
      maxSize={10 * 1024 * 1024}
      multiple
      onRetry={file => {
        setFiles(current =>
          current.map(item =>
            item.uid === file.uid
              ? { ...item, error: undefined, percent: 0, status: 'ready' }
              : item,
          ),
        );
      }}
      onValueChange={setFiles}
      value={files}
      variant="dragger"
    />
  );
}

export const Basic: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="flex max-w-[900px] flex-col gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Button / Empty</span>
          <Upload
            accept=".pdf,.xlsx"
            hint="支持 PDF / Excel，单个文件不超过 10 MB。"
            maxSize={10 * 1024 * 1024}
          />
          <p className={noteClassName}>表单内少量附件使用按钮入口。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Button / Filled</span>
          <Upload
            hint="已有单文件时展示文件名、替换和移除。"
            value={[attachmentFiles[0]]}
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Button / Readonly</span>
          <Upload
            onPreview={() => undefined}
            readOnly
            value={[attachmentFiles[0]]}
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Dragger</span>
          <ControlledUploadDemo />
        </div>
      </div>
    </div>
  ),
};

export const PictureWall: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="max-w-[520px]">
        <Upload
          accept="image/*"
          hint="图片缩略图默认 96px，支持预览、删除、上传中和失败重试。"
          maxCount={6}
          multiple
          onPreview={() => undefined}
          onRetry={() => undefined}
          value={pictureFiles}
          variant="picture"
        />
      </div>
    </div>
  ),
};

export const Status: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="flex max-w-[900px] flex-col gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Progress / Error</span>
          <Upload multiple onRetry={() => undefined} value={attachmentFiles} />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <Upload disabled hint="当前流程不可上传，请先完成审批。" />
        </div>
      </div>
    </div>
  ),
};
