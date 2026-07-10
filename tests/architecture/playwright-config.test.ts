// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

const originalStorybookUrl = process.env.LYRA_STORYBOOK_URL;

async function loadConfig(storybookUrl?: string) {
  if (storybookUrl == null) {
    delete process.env.LYRA_STORYBOOK_URL;
  } else {
    process.env.LYRA_STORYBOOK_URL = storybookUrl;
  }

  vi.resetModules();
  return (await import('../../playwright.config')).default;
}

afterEach(() => {
  if (originalStorybookUrl == null) {
    delete process.env.LYRA_STORYBOOK_URL;
  } else {
    process.env.LYRA_STORYBOOK_URL = originalStorybookUrl;
  }
  vi.resetModules();
});

describe('Playwright Storybook server identity', () => {
  it('does not start or reuse a target server for an external Storybook URL', async () => {
    const config = await loadConfig('http://127.0.0.1:6007');

    expect(config.use).toMatchObject({
      baseURL: 'http://127.0.0.1:6007',
    });
    expect(config.webServer).toBeUndefined();
  });

  it('refuses to reuse an existing server for target Storybook', async () => {
    const config = await loadConfig();

    expect(config.use).toMatchObject({
      baseURL: 'http://127.0.0.1:6006',
    });
    expect(config.webServer).toMatchObject({
      reuseExistingServer: false,
      url: 'http://127.0.0.1:6006',
    });
  });
});
