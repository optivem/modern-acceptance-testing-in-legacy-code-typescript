import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['./channel-list-reporter.ts'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    timezoneId: 'UTC',
  },
  projects: [
    {
      name: 'acceptance-test',
      testDir: './tests/acceptance-test',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-test',
      testDir: './tests/smoke-test',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-test',
      testDir: './tests/e2e-test',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'external-system-contract-test',
      testDir: './tests/external-system-contract-test',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
