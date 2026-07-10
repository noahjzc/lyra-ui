import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, History, User } from 'lucide-react';
import * as React from 'react';
import { SearchInputWithPanel } from '../../search-input-with-panel';
import type { SearchSuggestionGroup } from '../../search-suggestion-panel';
import { SearchInput } from '../index';

const meta = {
  title: 'Primitives/Data Input/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[320px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-28 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

interface BusinessSearchData {
  owner?: string;
  type?: string;
}

const suggestionGroups: SearchSuggestionGroup<BusinessSearchData>[] = [
  {
    label: '最近搜索',
    options: [
      {
        description: '最近搜索',
        icon: <History aria-hidden="true" className="size-4" />,
        label: 'invoice overdue report',
        meta: '2 分钟前',
        value: 'invoice overdue report',
      },
    ],
  },
  {
    label: '建议结果',
    options: [
      {
        data: { owner: '张明', type: '客户' },
        render: option => (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <User
              aria-hidden="true"
              className="size-4 shrink-0 text-(--ui-button-default-hover-foreground)"
            />
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="truncate font-extrabold">
                客户：{option.value}
              </span>
              <span className="truncate text-xs text-ui-muted-foreground">
                负责人：{option.data?.owner}
              </span>
            </span>
            <span className="rounded border border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) px-1.5 py-0.5 text-xs font-bold text-(--ui-button-default-hover-foreground)">
              {option.data?.type}
            </span>
          </span>
        ),
        value: '上海霖宜贸易',
      },
      {
        description: '文档',
        icon: <FileText aria-hidden="true" className="size-4" />,
        label: 'invoice overdue workflow',
        meta: '18',
        value: 'invoice overdue workflow',
      },
    ],
  },
];

function ControlledDemo() {
  const [value, setValue] = React.useState('contract');
  const [lastSearch, setLastSearch] = React.useState('contract');

  return (
    <div className={cardClassName}>
      <span className={labelClassName}>Manual</span>
      <SearchInput
        onSearch={setLastSearch}
        onValueChange={setValue}
        searchButton
        value={value}
      />
      <p className={noteClassName}>最近搜索：{lastSearch || '无'}</p>
    </div>
  );
}

export const Basic: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Instant</span>
          <SearchInput placeholder="搜索关键词..." shortcut="⌘ K" />
          <p className={noteClassName}>
            输入变化由 onValueChange 交给上层防抖。
          </p>
        </div>
        <ControlledDemo />
      </div>
    </div>
  ),
};

export const Status: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Loading</span>
          <SearchInput loading value="contract" />
          <p className={noteClassName}>后缀展示轻量 loading，不清空关键词。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <SearchInput disabled placeholder="不可搜索" />
        </div>
      </div>
    </div>
  ),
};

export const Size: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[760px] gap-3">
        <SearchInput placeholder="紧凑搜索..." size="small" />
        <SearchInput placeholder="搜索..." />
        <SearchInput
          placeholder="搜索全部内容..."
          shortcut="⌘ K"
          size="large"
        />
        <SearchInput placeholder="页面级搜索..." searchButton size="xlarge" />
      </div>
    </div>
  ),
};

export const SuggestionPanel: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <div className="max-w-[420px]">
        <SearchInputWithPanel
          groups={suggestionGroups}
          placeholder="搜索客户 / 文档 / 模板"
        />
      </div>
    </div>
  ),
};
