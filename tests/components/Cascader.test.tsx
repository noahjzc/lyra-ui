import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Cascader, type CascaderOption } from '../../src/components/data-input';

const options: CascaderOption[] = [
  {
    label: '华东大区',
    value: 'east',
    children: [
      {
        label: '上海公司',
        value: 'shanghai',
        children: [
          { label: '销售一部', value: 'sales-1' },
          { label: '销售二部', value: 'sales-2' },
        ],
      },
      {
        label: '杭州公司',
        value: 'hangzhou',
        children: [{ label: '客户成功', value: 'success' }],
      },
    ],
  },
  {
    label: '华南大区',
    value: 'south',
    children: [
      {
        label: '深圳公司',
        value: 'shenzhen',
        children: [{ label: '直营团队', value: 'direct' }],
      },
    ],
  },
  {
    disabled: true,
    disabledReason: '无权限',
    label: '归档组织',
    value: 'archived',
  },
];

describe('Cascader', () => {
  it('selects a single leaf path and closes the panel', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Cascader
        onValueChange={onValueChange}
        options={options}
        placeholder="选择组织"
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择组织' }));
    await user.click(screen.getByRole('treeitem', { name: /华东大区/ }));
    await user.click(screen.getByRole('treeitem', { name: /上海公司/ }));
    await user.click(screen.getByRole('treeitem', { name: /销售一部/ }));

    expect(onValueChange).toHaveBeenCalledWith(['east', 'shanghai', 'sales-1']);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows full path search results', async () => {
    const user = userEvent.setup();

    render(<Cascader options={options} placeholder="搜索组织" showSearch />);

    await user.click(screen.getByRole('button', { name: '搜索组织' }));
    await user.type(
      screen.getByRole('textbox', { name: '搜索级联路径' }),
      '直营',
    );

    expect(
      screen.getByRole('option', { name: /华南大区.*深圳公司.*直营团队/ }),
    ).toBeInTheDocument();
  });

  it('keeps disabled paths from committing through search', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Cascader
        onValueChange={onValueChange}
        options={[
          { disabled: true, label: '禁用末级', value: 'disabled-leaf' },
          {
            children: [{ label: '禁用祖先子级', value: 'disabled-child' }],
            disabled: true,
            label: '禁用祖先节点',
            value: 'disabled-parent',
          },
        ]}
        placeholder="搜索禁用路径"
        showSearch
      />,
    );

    await user.click(screen.getByRole('button', { name: '搜索禁用路径' }));
    await user.type(
      screen.getByRole('textbox', { name: '搜索级联路径' }),
      '禁用',
    );

    const disabledLeaf = screen.getByRole('option', { name: '禁用末级' });

    expect(disabledLeaf).toBeDisabled();
    await user.click(disabledLeaf);
    expect(
      screen.queryByRole('option', { name: /禁用祖先节点.*禁用祖先子级/ }),
    ).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not expose unloaded nodes as searchable leaves', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Cascader
        changeOnSelect={false}
        onValueChange={onValueChange}
        options={[{ isLeaf: false, label: '待加载节点', value: 'pending' }]}
        placeholder="搜索待加载节点"
        showSearch
      />,
    );

    await user.click(screen.getByRole('button', { name: '搜索待加载节点' }));
    await user.type(
      screen.getByRole('textbox', { name: '搜索级联路径' }),
      '待加载',
    );

    expect(
      screen.queryByRole('option', { name: '待加载节点' }),
    ).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports multiple paths and keeps the panel open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Cascader
        multiple
        onValueChange={onValueChange}
        options={options}
        placeholder="选择多个组织"
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择多个组织' }));
    await user.click(screen.getByRole('treeitem', { name: /华东大区/ }));
    await user.click(screen.getByRole('treeitem', { name: /上海公司/ }));
    await user.click(screen.getByRole('treeitem', { name: /销售二部/ }));

    expect(onValueChange).toHaveBeenLastCalledWith([
      ['east', 'shanghai', 'sales-2'],
    ]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clears selected value and returns focus to trigger', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Cascader
        allowClear
        defaultValue={['east', 'shanghai', 'sales-1']}
        onValueChange={onValueChange}
        options={options}
      />,
    );

    await user.click(screen.getByRole('button', { name: '清空级联选择' }));

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole('button', { name: '请选择' })).toHaveFocus();
  });

  it('shows lazy loading on the current node', async () => {
    const user = userEvent.setup();
    const loadData = vi.fn(
      () => new Promise<void>(resolve => window.setTimeout(resolve, 20)),
    );

    render(
      <Cascader
        loadData={loadData}
        options={[{ isLeaf: false, label: '销售中心', value: 'sales' }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '请选择' }));
    await user.click(screen.getByRole('treeitem', { name: /销售中心/ }));

    expect(loadData).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('treeitem', { name: /加载中/ }),
    ).toBeInTheDocument();
  });

  it('reopens the panel with focus on the selected branch', async () => {
    const user = userEvent.setup();

    render(
      <Cascader allowClear options={options} placeholder="选择组织路径" />,
    );

    await user.click(screen.getByRole('button', { name: '选择组织路径' }));
    await user.click(screen.getByRole('treeitem', { name: /华南大区/ }));
    await user.click(screen.getByRole('treeitem', { name: /深圳公司/ }));
    await user.click(screen.getByRole('treeitem', { name: /直营团队/ }));
    await user.click(
      screen.getByRole('button', {
        name: /华南大区.*深圳公司.*直营团队/,
      }),
    );

    const eastOption = screen.getByRole('treeitem', { name: /华东大区/ });
    const southOption = screen.getByRole('treeitem', { name: /华南大区/ });

    expect(eastOption).not.toHaveAttribute('data-active');
    expect(southOption).toHaveAttribute('data-active', 'true');

    await waitFor(() => expect(southOption).toHaveFocus());
  });
});
