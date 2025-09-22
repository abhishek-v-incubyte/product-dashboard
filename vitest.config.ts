import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: [
      "node_modules/**",
      ".react-router/**",
      "vite.config.ts",
      "vitest.config.ts",
      "react-router.config.ts",
      "app/root.tsx",
      "app/routes/**",
      "app/components/ui/**",
      "app/theme/**",
      "app/types/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "src/test/setup.ts",
        ".react-router/**",
        "vite.config.ts",
        "vitest.config.ts",
        "react-router.config.ts",
        "app/root.tsx",
        "app/routes/**",
        "app/components/ui/**",
        "app/theme/**",
        "app/types/**",
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./app"),
      "~": resolve(__dirname, "./app"),
    },
  },
});
