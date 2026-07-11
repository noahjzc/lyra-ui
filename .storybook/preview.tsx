import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return <Story />;
    },
  ],
  globalTypes: {
    theme: {
      description: '主题',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { title: '浅色', value: 'light' },
          { title: '深色', value: 'dark' },
        ],
      },
    },
  },
  parameters: {
    a11y: { test: 'error' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { codePanel: true, toc: true },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
