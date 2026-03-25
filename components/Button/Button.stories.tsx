import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'dashed', 'text', 'link'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['tiny', 'small', 'default', 'large'],
      description: 'Button size',
    },
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      description: 'Button status',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    htmlType: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    type: 'default',
    children: 'Default Button',
  },
};

export const Dashed: Story = {
  args: {
    type: 'dashed',
    children: 'Dashed Button',
  },
};

export const Text: Story = {
  args: {
    type: 'text',
    children: 'Text Button',
  },
};

export const Link: Story = {
  args: {
    type: 'link',
    children: 'Link Button',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    children: 'Success Button',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    children: 'Warning Button',
  },
};

export const Danger: Story = {
  args: {
    status: 'danger',
    children: 'Danger Button',
  },
};

export const Tiny: Story = {
  args: {
    size: 'tiny',
    children: 'Tiny',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button type="default">Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button status="default">Default Status</Button>
      <Button status="success">Success Status</Button>
      <Button status="warning">Warning Status</Button>
      <Button status="danger">Danger Status</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="tiny">Tiny</Button>
      <Button size="small">Small</Button>
      <Button size="default">Default</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const TypeStatusCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="primary" status="default">
          Primary Default
        </Button>
        <Button type="primary" status="success">
          Primary Success
        </Button>
        <Button type="primary" status="warning">
          Primary Warning
        </Button>
        <Button type="primary" status="danger">
          Primary Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="default" status="default">
          Default Default
        </Button>
        <Button type="default" status="success">
          Default Success
        </Button>
        <Button type="default" status="warning">
          Default Warning
        </Button>
        <Button type="default" status="danger">
          Default Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="dashed" status="default">
          Dashed Default
        </Button>
        <Button type="dashed" status="success">
          Dashed Success
        </Button>
        <Button type="dashed" status="warning">
          Dashed Warning
        </Button>
        <Button type="dashed" status="danger">
          Dashed Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" status="default">
          Text Default
        </Button>
        <Button type="text" status="success">
          Text Success
        </Button>
        <Button type="text" status="warning">
          Text Warning
        </Button>
        <Button type="text" status="danger">
          Text Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="link" status="default">
          Link Default
        </Button>
        <Button type="link" status="success">
          Link Success
        </Button>
        <Button type="link" status="warning">
          Link Warning
        </Button>
        <Button type="link" status="danger">
          Link Danger
        </Button>
      </div>
    </div>
  ),
};
