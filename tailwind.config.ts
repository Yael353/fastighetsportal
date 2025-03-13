import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#5ec3ff", // Mjukare neonblå
        neonGreen: "#52ff99", // Ljusare neon
        neonPurple: "#a482ff", // Mildare neonlila
        darkBg: "#0b1026", // Djup marinblå bakgrund
        accentBlue: "#3b82f6", // Behaglig blå accent
        deepBlue: "#090926", // Mörkare blå
        softNavy: "#0b0b22", // Mjukare nattblå
        midnight: "#0c1228", // Elegant mörkblå
        twilight: "#090925", // Mörk skuggblå
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
