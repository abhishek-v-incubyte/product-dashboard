import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0f9ff" },
          100: { value: "#e0f2fe" },
          200: { value: "#bae6fd" },
          300: { value: "#7dd3fc" },
          400: { value: "#38bdf8" },
          500: { value: "#0ea5e9" },
          600: { value: "#0284c7" },
          700: { value: "#0369a1" },
          800: { value: "#075985" },
          900: { value: "#0c4a6e" },
          950: { value: "#082f49" },
        },
        accent: {
          50: { value: "#fefce8" },
          100: { value: "#fef9c3" },
          200: { value: "#fef08a" },
          300: { value: "#fde047" },
          400: { value: "#facc15" },
          500: { value: "#eab308" },
          600: { value: "#ca8a04" },
          700: { value: "#a16207" },
          800: { value: "#854d0e" },
          900: { value: "#713f12" },
          950: { value: "#422006" },
        },
      },
      fonts: {
        heading: {
          value:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        body: {
          value:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      },
    },
  },
});

export default system;
