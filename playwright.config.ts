import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/music-picture-bingo/",
    browserName: "chromium",
    launchOptions: process.env.LOCAL_CHROMIUM_PATH
      ? {
          executablePath: process.env.LOCAL_CHROMIUM_PATH,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
          ],
        }
      : {},
  },
  webServer: {
    command: process.env.E2E_PRODUCTION ? "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort" : "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/music-picture-bingo/",
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium" },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
