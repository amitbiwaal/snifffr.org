import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests. Run against a production build:
 *   npm run build && npx next start -p 3210
 *   E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... npm run test:e2e
 * Uses the locally installed Microsoft Edge (no browser download needed);
 * set E2E_BROWSER_CHANNEL=chrome to use Google Chrome instead.
 */
const channel = process.env.E2E_BROWSER_CHANNEL || 'msedge'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3210',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel } },
    {
      name: 'mobile',
      testMatch: /public\.spec\.ts/,
      use: { ...devices['Pixel 7'], channel },
    },
  ],
})
