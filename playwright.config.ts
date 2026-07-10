import { defineConfig, devices } from '@playwright/test';

const externalStorybook = process.env.LYRA_STORYBOOK_URL;

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  retries: 0,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: externalStorybook ?? 'http://127.0.0.1:6006',
    deviceScaleFactor: 1,
    trace: 'retain-on-failure',
    viewport: { height: 900, width: 1440 },
  },
  webServer: externalStorybook
    ? undefined
    : {
        command: 'pnpm storybook',
        reuseExistingServer: false,
        timeout: 120_000,
        url: 'http://127.0.0.1:6006',
      },
});
