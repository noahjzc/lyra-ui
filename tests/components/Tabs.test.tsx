import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../src/components/navigation';

describe('Tabs', () => {
  it('renders Radix tabs semantics and switches panels', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview" variant="line">
        <TabsList aria-label="客户详情分区">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">总览内容</TabsContent>
        <TabsContent value="logs">操作日志内容</TabsContent>
      </Tabs>,
    );

    expect(
      screen.getByRole('tablist', { name: '客户详情分区' }),
    ).toHaveAttribute('data-slot', 'tabs-list');
    expect(screen.getByRole('tab', { name: '总览' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('总览内容');

    await user.click(screen.getByRole('tab', { name: '操作日志' }));

    expect(screen.getByRole('tab', { name: '操作日志' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('操作日志内容');
  });

  it('does not switch to disabled triggers', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs
        defaultValue="overview"
        onValueChange={onValueChange}
        variant="line"
      >
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger disabled value="credit">
            授信
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">总览内容</TabsContent>
        <TabsContent value="credit">授信内容</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: '授信' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('总览内容');
  });

  it('supports controlled value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Tabs onValueChange={onValueChange} value="overview" variant="segment">
        <TabsList>
          <TabsTrigger value="overview">显示字段</TabsTrigger>
          <TabsTrigger value="hidden">隐藏字段</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">显示字段内容</TabsContent>
        <TabsContent value="hidden">隐藏字段内容</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: '隐藏字段' }));

    expect(onValueChange).toHaveBeenCalledWith('hidden');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('显示字段内容');

    rerender(
      <Tabs onValueChange={onValueChange} value="hidden" variant="segment">
        <TabsList>
          <TabsTrigger value="overview">显示字段</TabsTrigger>
          <TabsTrigger value="hidden">隐藏字段</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">显示字段内容</TabsContent>
        <TabsContent value="hidden">隐藏字段内容</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveTextContent('隐藏字段内容');
  });

  it('inherits line variant and middle size from the root', () => {
    render(
      <Tabs defaultValue="overview" variant="line">
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">总览内容</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass(
      'h-11',
      'border-b',
      '[-ms-overflow-style:none]',
      '[scrollbar-width:none]',
      '[&::-webkit-scrollbar]:hidden',
    );
    expect(screen.getByRole('tab', { name: '总览' })).toHaveClass(
      'h-11',
      'border-b-2',
      'transition-ui-state',
    );
  });

  it('supports cache tabs variant sizing and long text truncation', () => {
    render(
      <Tabs defaultValue="list" variant="cache">
        <TabsList>
          <TabsTrigger value="list">
            华东供应链合同审批详情页签超长标题
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">记录列表内容</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass(
      'h-[42px]',
      'overflow-x-auto',
      '[-ms-overflow-style:none]',
      '[scrollbar-width:none]',
      '[&::-webkit-scrollbar]:hidden',
    );
    expect(
      screen.getByRole('tab', {
        name: '华东供应链合同审批详情页签超长标题',
      }),
    ).toHaveClass(
      'h-8',
      'min-w-[104px]',
      'max-w-[178px]',
      'truncate',
      'pr-1',
      'pl-2.5',
    );
    expect(
      screen.getByRole('tab', {
        name: '华东供应链合同审批详情页签超长标题',
      }),
    ).toHaveClass(
      'bg-ui-background',
      'data-[state=active]:border-(--ui-tabs-cache-active-border)',
      'data-[state=active]:shadow-(--ui-tabs-cache-active-shadow)',
    );
    expect(
      screen.getByRole('tab', {
        name: '华东供应链合同审批详情页签超长标题',
      }),
    ).not.toHaveClass(
      'data-[state=active]:border-[#9ce6f1]',
      'data-[state=active]:shadow-[inset_0_2px_0_0_var(--ui-button-primary-background)]',
    );
  });

  it('allows local variant and size overrides on list and trigger', () => {
    render(
      <Tabs defaultValue="shown" size="large" variant="line">
        <TabsList variant="segment">
          <TabsTrigger size="small" value="shown" variant="segment">
            显示字段
          </TabsTrigger>
        </TabsList>
        <TabsContent value="shown">显示字段内容</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveAttribute(
      'data-variant',
      'segment',
    );
    expect(screen.getByRole('tab', { name: '显示字段' })).toHaveClass(
      'h-7',
      'rounded-[5px]',
    );
  });
});
