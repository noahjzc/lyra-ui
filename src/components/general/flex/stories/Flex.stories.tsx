import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../button';
import { Flex } from '../index';

const meta = {
  title: 'Primitives/General/Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    direction: {
      control: 'inline-radio',
      options: ['row', 'column'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const itemClassName =
  'inline-flex min-h-8 min-w-12 items-center justify-center rounded border border-ui-border bg-ui-background px-3 text-sm font-semibold';

export const Variants: Story = {
  render: () => (
    <div className="grid w-[640px] gap-4">
      <Flex
        className="rounded border border-ui-border bg-ui-muted/40 p-3"
        gap={8}
      >
        <span className={itemClassName}>A</span>
        <span className={itemClassName}>B</span>
        <span className={itemClassName}>C</span>
      </Flex>

      <Flex
        align="center"
        className="min-h-16 rounded border border-ui-border bg-ui-muted/40 p-3"
        justify="between"
      >
        <strong>我负责的客户</strong>
        <Button variant="primary">录入新客户</Button>
      </Flex>

      <Flex
        className="rounded border border-ui-border bg-ui-muted/40 p-3"
        gap={[8, 8]}
        wrap
      >
        {['负责人', '客户等级', '商机金额', '最近跟进', '客户来源'].map(
          item => (
            <span className={itemClassName} key={item}>
              {item}
            </span>
          ),
        )}
      </Flex>
    </div>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex
      className="w-80 rounded border border-ui-border bg-ui-background p-4"
      direction="column"
      gap={12}
    >
      <strong>已生效筛选 7</strong>
      <span className="text-sm text-ui-muted-foreground">
        负责人 等于 周启明
      </span>
      <span className="text-sm text-ui-muted-foreground">
        客户等级 包含 A/B
      </span>
    </Flex>
  ),
};
