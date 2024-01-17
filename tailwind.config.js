/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        appYellow: "#ffc300",
        appBlue: "#1d4ed8",
        darkGlass: "#ffffff0d",
        pink:{
          200: 'hsl(270, 45%, 24%)',
          500: 'hsl(270, 60%, 52%)'
        },
        menuHov: "rgb(38, 39, 54)",
        menuHovWhite: "rgb(240, 243, 249)",
        
        dashboardText: "rgb(210, 211, 224)",
        comboBg: "rgb(39, 41, 57)",
        whiteDark: "rgb(40, 42, 48)",
        whiteEdge: "rgb(239, 241, 244)",
        dashboardDarkHeadText: "rgb(238, 239, 252)",
        dashboardDarkSeparator: "rgb(44, 45, 60)",
        dashboardDarkInput: "rgb(21, 22, 33)",
        dashboardDarkInputBorder: "rgb(49, 50, 72)",
        dashboardLightInputBorder: " rgb(223, 225, 228)",
        cardDarkBg: "rgb(32, 33, 46)",
        cardDarkBorder: "rgb(53, 56, 74)",
        cardLightBorder: "rgb(239, 241, 244)",
        formTextLight: "rgb(180, 188, 208)"


       
      },
      backgroundImage: {
        darkGlass:
          "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      border:{
        glassBorder: "1px solid hsl(0, 0%, 18%)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    fontFamily: {
      jet: "'JetBrains Mono', monospace",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
