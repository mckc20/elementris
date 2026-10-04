import { defineConfig, devices } from '@playwright/test';

const deployedURL = process.env.ELEMENTRIS_TEST_URL;

export default defineConfig({
  testDir: './tests',
  use: { baseURL: deployedURL ?? 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'portrait', use: { ...devices['iPhone SE'], defaultBrowserType: 'chromium' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'ios', use: { ...devices['iPhone SE'] } },
  ],
  webServer: deployedURL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
  },
});
