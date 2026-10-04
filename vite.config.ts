import { defineConfig } from "vitest/config";
export default defineConfig({
  base: "/music-picture-bingo/",
  test: { include: ["src/**/*.test.ts"] },
});
