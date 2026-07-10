import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: "html",
  retries: process.env.CI ? 2 : 1,
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:4319",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4319 --strictPort",
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://localhost:4319",
  },
  // Tests hit the live PokeAPI; capping workers keeps us well under any
  // rate limit and away from flakes caused by resource contention.
  workers: 4,
});
