import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Menu,
  type MenuGroup,
  type MenuItem,
  TopMenu,
} from '../../src/components/navigation';

const groups: MenuGroup[] = [
  {
    key: 'growth',
    label: '客户增长',
    items: [
      {
        href: '#overview',
        icon: <span>概</span>,
        key: 'overview',
        label: '业务总览',
      },
      {
        badge: 126,
        children: [
          { href: '#customer-list', key: 'customer-list', label: '客户列表' },
          { href: '#pool', key: 'pool', label: '公共池' },
          {
            disabled: true,
            disabledReason: '无权限',
            key: 'recycle',
            label: '回收站',
          },
        ],
        icon: <span>客</span>,
        key: 'customer',
        label: '客户管理',
      },
    ],
  },
  {
    key: 'sales',
    label: '销售协同',
    items: [
      {
        badge: 8,
        href: '#contract',
        icon: <span>合</span>,
        key: 'contract',
        label: '合同审批',
      },
      {
        href: '#task',
        icon: <span>任</span>,
        key: 'task',
        label: '跟进任务',
      },
    ],
  },
];

function mockReducedMotion(matches: boolean) {
  const originalMatchMedia = window.matchMedia;

  window.matchMedia = vi.fn().mockImplementation(query => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  }));

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

describe('Menu', () => {
  it('renders side groups, items, submenu and footer', () => {
    render(
      <Menu
        activeKey="customer-list"
        footer={<button type="button">收起导航</button>}
        groups={groups}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: '导航菜单' }),
    ).toBeInTheDocument();
    expect(screen.getByText('客户增长')).toBeInTheDocument();
    expect(screen.getByText('销售协同')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '业务总览' })).toHaveAttribute(
      'href',
      '#overview',
    );
    expect(
      screen.queryByRole('link', { name: /概.*业务总览/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /客.*客户管理/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /客户管理/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(
      screen.getByRole('button', { name: /客户管理/ }).parentElement,
    ).toHaveClass('grid', 'min-w-0', 'gap-1');
    expect(
      screen.getByRole('link', { name: '业务总览' }).parentElement,
    ).toHaveClass('min-w-0');
    expect(screen.getByRole('link', { name: '客户列表' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: '客户列表' })).toHaveClass(
      'shadow-ui-menu-active-indicator',
    );
    expect(
      screen.getByRole('button', { name: '收起导航' }),
    ).toBeInTheDocument();
  });

  it('toggles a submenu and emits open key changes', async () => {
    const user = userEvent.setup();
    const onOpenKeysChange = vi.fn();

    render(<Menu groups={groups} onOpenKeysChange={onOpenKeysChange} />);

    const trigger = screen.getByRole('button', { name: /客户管理/ });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(['customer']);

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenKeysChange).toHaveBeenLastCalledWith([]);
  });

  it('manages submenu disclosure motion state', async () => {
    const user = userEvent.setup();

    render(<Menu groups={groups} />);

    const trigger = screen.getByRole('button', { name: /客户管理/ });
    const motion = document.querySelector('[data-slot="menu-submenu-motion"]');
    const panel = document.querySelector('[data-slot="menu-submenu-panel"]');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: '客户列表' })).toBeNull();
    expect(motion).toBeInTheDocument();
    expect(motion).toHaveClass('grid-rows-[0fr]');
    expect(motion).toHaveStyle({
      height: '0px',
      transitionProperty: 'height, grid-template-rows',
    });
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');

    fireEvent.click(trigger);

    const openingMotion = document.querySelector(
      '[data-slot="menu-submenu-motion"]',
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(openingMotion).toHaveClass('grid-rows-[1fr]');
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="menu-submenu-content"]'),
      ).toHaveClass('animate-ui-disclosure-in');
    });

    await user.click(trigger);

    const closingMotion = document.querySelector(
      '[data-slot="menu-submenu-motion"]',
    );
    const closingPanel = document.querySelector(
      '[data-slot="menu-submenu-panel"]',
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(closingMotion).toHaveClass('grid-rows-[0fr]');
    expect(closingPanel).toHaveAttribute('aria-hidden', 'true');
    expect(closingPanel).toHaveAttribute('inert');
    expect(
      document.querySelector('[data-slot="menu-submenu-content"]'),
    ).toHaveClass('animate-ui-disclosure-out');
    expect(
      document.querySelector('[data-slot="menu-submenu"]'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '客户列表' })).toBeNull();

    fireEvent.transitionEnd(closingMotion as Element);

    expect(screen.queryByRole('link', { name: '客户列表' })).toBeNull();
    expect(
      document.querySelector('[data-slot="menu-submenu-motion"]'),
    ).toBeInTheDocument();
  });

  it('hides closed submenu from navigation for reduced motion users', async () => {
    const restoreMatchMedia = mockReducedMotion(true);
    const user = userEvent.setup();

    try {
      render(<Menu defaultOpenKeys={['customer']} groups={groups} />);

      expect(
        screen.getByRole('link', { name: '客户列表' }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /客户管理/ }));

      await waitFor(() => {
        expect(screen.queryByRole('link', { name: '客户列表' })).toBeNull();
      });
    } finally {
      restoreMatchMedia();
    }
  });

  it('keeps controlled open keys under caller control', async () => {
    const user = userEvent.setup();
    const onOpenKeysChange = vi.fn();

    render(
      <Menu
        groups={groups}
        onOpenKeysChange={onOpenKeysChange}
        openKeys={[]}
      />,
    );

    const trigger = screen.getByRole('button', { name: /客户管理/ });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenKeysChange).toHaveBeenCalledWith(['customer']);
  });

  it('emits item and root select callbacks for leaf items', async () => {
    const user = userEvent.setup();
    const onItemSelect = vi.fn();
    const onSelect = vi.fn();
    const callbackGroups: MenuGroup[] = [
      {
        key: 'growth',
        label: '客户增长',
        items: [
          {
            children: [
              {
                key: 'pool',
                label: '公共池',
                onSelect: onItemSelect,
              },
            ],
            key: 'customer',
            label: '客户管理',
          },
        ],
      },
    ];

    render(
      <Menu
        defaultOpenKeys={['customer']}
        groups={callbackGroups}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: '公共池' }));

    expect(onItemSelect).toHaveBeenCalledWith('pool');
    expect(onSelect).toHaveBeenCalledWith(
      'pool',
      expect.objectContaining<MenuItem>({ key: 'pool', label: '公共池' }),
    );

    const itemCallOrder = onItemSelect.mock.invocationCallOrder.at(0);
    const rootCallOrder = onSelect.mock.invocationCallOrder.at(0);

    expect(itemCallOrder).toBeDefined();
    expect(rootCallOrder).toBeDefined();
    expect(itemCallOrder).toBeLessThan(rootCallOrder as number);
  });

  it('prevents native link navigation when selection is handled by caller', () => {
    const onSelect = vi.fn();

    render(<Menu groups={groups} onSelect={onSelect} />);

    const link = screen.getByRole('link', { name: '业务总览' });
    const event = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });

    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenCalledWith(
      'overview',
      expect.objectContaining({ key: 'overview' }),
    );
  });

  it('keeps native link navigation when no caller handles selection', () => {
    render(<Menu groups={groups} />);

    const link = screen.getByRole('link', { name: '业务总览' });
    const event = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });

    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('does not select disabled items and displays the disabled reason', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu
        defaultOpenKeys={['customer']}
        groups={groups}
        onSelect={onSelect}
      />,
    );

    const disabledItem = screen.getByText('回收站 · 无权限');

    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabledItem);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders local navigation as expanded even when collapsed is passed', async () => {
    const user = userEvent.setup();

    render(<Menu collapsed groups={groups.slice(0, 1)} variant="local" />);

    expect(screen.getByRole('link', { name: '业务总览' })).toHaveTextContent(
      '业务总览',
    );

    const trigger = screen.getByRole('button', { name: '客户管理' });

    expect(trigger).toHaveTextContent('客户管理');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '客户列表' })).toBeInTheDocument();
  });

  it('renders collapsed readable icon navigation and opens child popover', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Menu collapsed groups={groups} onSelect={onSelect} />);

    expect(screen.getByRole('link', { name: '业务总览' })).toHaveAttribute(
      'aria-label',
      '业务总览',
    );

    await user.click(screen.getByRole('button', { name: '客户管理' }));

    const childEntry = await screen.findByRole('link', { name: '公共池' });
    const popoverSubmenu = document.querySelector('[data-slot="menu-submenu"]');

    expect(popoverSubmenu).toHaveClass('grid', 'gap-0.5');
    expect(popoverSubmenu).not.toHaveClass('pl-9');
    expect(
      document.querySelector('[data-slot="menu-sub-dot"]'),
    ).not.toBeInTheDocument();
    await user.click(childEntry);

    expect(onSelect).toHaveBeenCalledWith(
      'pool',
      expect.objectContaining({ key: 'pool' }),
    );
  });

  it('uses textValue for collapsed ReactNode labels and submenu dialog names', async () => {
    const user = userEvent.setup();
    const nodeGroups: MenuGroup[] = [
      {
        key: 'automation',
        label: '自动化',
        items: [
          {
            children: [
              {
                href: '#rules',
                key: 'rules',
                label: <span>规则配置</span>,
                textValue: '规则配置',
              },
            ],
            icon: <span>自</span>,
            key: 'workflow',
            label: (
              <span>
                自动化
                <strong>中心</strong>
              </span>
            ),
            textValue: '自动化中心',
          },
        ],
      },
    ];

    render(<Menu collapsed groups={nodeGroups} />);

    expect(screen.queryByRole('button', { name: 'workflow' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '自动化中心' }));

    expect(
      await screen.findByRole('dialog', { name: '自动化中心子菜单' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '规则配置' })).toHaveAttribute(
      'href',
      '#rules',
    );
  });
});

describe('TopMenu', () => {
  it('renders active and disabled top items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TopMenu
        activeKey="crm"
        items={[
          { href: '#crm', key: 'crm', label: 'CRM' },
          { href: '#pms', key: 'pms', label: 'PMS' },
          { disabled: true, key: 'wms', label: 'WMS' },
        ]}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole('link', { name: 'CRM' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('WMS')).toHaveAttribute('aria-disabled', 'true');

    await user.click(screen.getByText('WMS'));

    expect(onSelect).not.toHaveBeenCalled();

    await user.click(screen.getByRole('link', { name: 'PMS' }));

    expect(onSelect).toHaveBeenCalledWith(
      'pms',
      expect.objectContaining({ key: 'pms' }),
    );
  });
});
