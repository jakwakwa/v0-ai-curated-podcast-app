const {
    generateTailwindColors,
    cssVarToTailwind
} = require("./lib/tailwind-variables")

// Generate dynamic colors from CSS variables
const dynamicColors = generateTailwindColors()

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Your OKLCH colors (as defined)
                background: "oklch(0.129 0.042 264.695)",
                foreground: "oklch(0.984 0.003 247.858)",
                card: {
                    DEFAULT: "oklch(0.208 0.042 265.755)",
                    foreground: "oklch(0.984 0.003 247.858)",
                },
                popover: {
                    DEFAULT: "oklch(0.208 0.042 265.755)",
                    foreground: "oklch(0.984 0.003 247.858)",
                },
                primary: {
                    DEFAULT: "oklch(0.929 0.013 255.508)",
                    foreground: "oklch(0.208 0.042 265.755)",
                },
                secondary: {
                    DEFAULT: "oklch(0.279 0.041 260.031)",
                    foreground: "oklch(0.984 0.003 247.858)",
                },
                muted: {
                    DEFAULT: "oklch(0.279 0.041 260.031)",
                    foreground: "oklch(0.704 0.04 256.788)",
                },
                accent: {
                    DEFAULT: "oklch(0.279 0.041 260.031)",
                    foreground: "oklch(0.984 0.003 247.858)",
                },
                destructive: {
                    DEFAULT: "oklch(0.704 0.191 22.216)",
                    foreground: "oklch(0.984 0.003 247.858)",
                },
                border: "oklch(1 0 0 / 10%)",
                input: "oklch(1 0 0 / 15%)",
                ring: "oklch(0.551 0.027 264.364)",

                // Dynamic CSS variables (from your global CSS)
                ...dynamicColors,

                // Additional dynamic colors
                "background-hsl": cssVarToTailwind("background-hsl"),
                "foreground-hsl": cssVarToTailwind("foreground-hsl"),
                "card-hsl": cssVarToTailwind("card-hsl"),
                "card-foreground-hsl": cssVarToTailwind("card-foreground-hsl"),
                "popover-hsl": cssVarToTailwind("popover-hsl"),
                "popover-foreground-hsl": cssVarToTailwind("popover-foreground-hsl"),
                "primary-hsl": cssVarToTailwind("primary-hsl"),
                "primary-foreground-hsl": cssVarToTailwind("primary-foreground-hsl"),
                "secondary-hsl": cssVarToTailwind("secondary-hsl"),
                "secondary-foreground-hsl": cssVarToTailwind("secondary-foreground-hsl"),
                "muted-hsl": cssVarToTailwind("muted-hsl"),
                "muted-foreground-hsl": cssVarToTailwind("muted-foreground-hsl"),
                "accent-hsl": cssVarToTailwind("accent-hsl"),
                "accent-foreground-hsl": cssVarToTailwind("accent-foreground-hsl"),
                "destructive-hsl": cssVarToTailwind("destructive-hsl"),
                "destructive-foreground-hsl": cssVarToTailwind("destructive-foreground-hsl"),
                "border-hsl": cssVarToTailwind("border-hsl"),
                "input-hsl": cssVarToTailwind("input-hsl"),
                "ring-hsl": cssVarToTailwind("ring-hsl"),
            },
            borderColor: {
                border: "var(--border)",
                DEFAULT: "var(--border)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                muted: "var(--muted)",
                accent: "var(--accent)",
                destructive: "var(--destructive)",
                input: "var(--input)",
                ring: "var(--ring)",
            },
            fontFamily: {
                heading: ["Work Sans", "sans-serif"],
                body: ["Mozilla Headline", "sans-serif"],
            },
            fontSize: {
                h1: [
                    "var(--font-size-h1, 2.5rem)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                    },
                ],
                h2: [
                    "var(--font-size-h2, 2rem)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                    },
                ],
                h3: [
                    "var(--font-size-h3, 1.75rem)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                    },
                ],
                h4: [
                    "var(--font-size-h4, 1.5rem)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                    },
                ],
                h5: [
                    "var(--font-size-h5, 1.25rem)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                    },
                ],
                body: [
                    "var(--font-size-body, 1rem)",
                    {
                        lineHeight: "1.5",
                        letterSpacing: "-0.02em",
                    },
                ],
                "body-sm": [
                    "var(--font-size-body-sm, 0.875rem)",
                    {
                        lineHeight: "1.5",
                        letterSpacing: "-0.02em",
                    },
                ],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "glass-gradient": "linear-gradient(349deg, hsla(var(--background-hsl)) 30%, hsla(var(--accent-hsl)) 170%, hsla(var(--muted-foreground-hsl)) 200%)",
            },
            boxShadow: {
                glass: "inset 0px 1px 1px #fbdb4c61, 3px 20px 17px #00000036",
                "glass-hover": "inset 0px 1px 1px #fbdb4c61, 3px 25px 25px #00000040",
            },
            animation: {
                loading: "loading-animation 1.5s ease-in-out infinite",
                spin: "spin 1s linear infinite",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                "loading-animation": {
                    "0%, 100%": {
                        opacity: "1",
                    },
                    "50%": {
                        opacity: "0.5",
                    },
                },
                spin: {
                    "0%": {
                        transform: "rotate(0deg)",
                    },
                    "100%": {
                        transform: "rotate(360deg)",
                    },
                },
                pulse: {
                    "0%, 100%": {
                        opacity: "1",
                    },
                    "50%": {
                        opacity: "0.5",
                    },
                },
            },
        },
    },
    plugins: [],
}