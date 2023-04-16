import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    browserName: 'chromium',
    headless: false,
    viewport: { width: 1280, height: 1024 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    launchOptions: {
      executablePath: './chromium/bin/chromium',
    },
  },
};

export default config;