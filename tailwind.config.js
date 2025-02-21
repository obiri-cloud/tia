/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 
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
        pink: {
          200: "hsl(270, 45%, 24%)",
          500: "hsl(270, 60%, 52%)",
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
        formTextLight: "rgb(180, 188, 208)",
        danger: "rgb(235, 87, 87)",
        mint: "#4fb05c",
        info: "#899090",
        cardHoverBg: "#F5F6F8",
        heroBg: "#F6F7F9",
        appBlack: "#121212",
        appSecondaryBg: "#001D3D",
        appBlue: "#1D68CE",
        appSecondaryText: "#414141",
        appGreen: "#2FBF71",
        appGray: "#F6F7F9",
        appGold: "#FCBF49",
        appBlue: "#1D68CE",
        appBorder: "#D0D0D0",
        appTertiary: "#00142B",
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
      border: {
        glassBorder: "1px solid hsl(0, 0%, 18%)",
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
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "meteor-effect": "meteor 5s linear infinite",
      },
    },
    fontFamily: {
      jet: "'JetBrains Mono', monospace",
    },
    boxShadow: {
      input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
};


function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}