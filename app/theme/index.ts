import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Brand colors for product dashboard
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Primary brand color
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        // Custom accent color for CTAs
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
      },
      fonts: {
        heading:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      fontSizes: {
        "2xs": "0.625rem",
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
      },
      spacing: {
        px: "1px",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
      },
      radii: {
        none: "0",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
    semanticTokens: {
      colors: {
        // Product dashboard specific semantic tokens
        "product.bg": {
          _light: "{colors.gray.50}",
          _dark: "{colors.gray.900}",
        },
        "product.card.bg": {
          _light: "{colors.white}",
          _dark: "{colors.gray.800}",
        },
        "product.price": {
          _light: "{colors.brand.600}",
          _dark: "{colors.brand.400}",
        },
        "product.title": {
          _light: "{colors.gray.900}",
          _dark: "{colors.gray.100}",
        },
        "cart.badge": {
          _light: "{colors.accent.500}",
          _dark: "{colors.accent.400}",
        },
        "search.bg": {
          _light: "{colors.white}",
          _dark: "{colors.gray.700}",
        },
      },
    },
    textStyles: {
      "product.title": {
        fontSize: "lg",
        fontWeight: "semibold",
        lineHeight: "1.5",
        color: "product.title",
      },
      "product.price": {
        fontSize: "xl",
        fontWeight: "bold",
        color: "product.price",
      },
      "product.description": {
        fontSize: "sm",
        color: "fg.muted",
        lineHeight: "1.6",
      },
      "dashboard.heading": {
        fontSize: "3xl",
        fontWeight: "bold",
        color: "fg",
        lineHeight: "1.2",
      },
    },
    layerStyles: {
      "product.card": {
        bg: "product.card.bg",
        borderRadius: "xl",
        border: "1px solid",
        borderColor: "border.subtle",
        p: 6,
        shadow: "sm",
        _hover: {
          shadow: "md",
          transform: "translateY(-2px)",
          transition: "all 0.2s",
        },
      },
      "search.container": {
        bg: "search.bg",
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "border.muted",
        p: 4,
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
export default system;
