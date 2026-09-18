import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `npm run build && npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  // Full Chromium (new headless) rather than the headless shell: it uses a
  // real GPU when the machine has one, so the 3D scene is actually exercised.
  // On GPU-less machines the scene tests skip and the fallback tests still run.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chromium" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chromium" } },
  ],
});
