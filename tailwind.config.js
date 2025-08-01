/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
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
                destructive: "oklch(0.704 0.191 22.216)",
                border: "oklch(1 0 0 / 10%)",
                input: "oklch(1 0 0 / 15%)",
                ring: "oklch(0.551 0.027 264.364)",
                sidebar: {
                    DEFAULT: "oklch(0.208 0.042 265.755)",
                    foreground: "oklch(0.984 0.003 247.858)",
                    primary: "oklch(0.488 0.243 264.376)",
                    "primary-foreground": "oklch(0.984 0.003 247.858)",
                    accent: "oklch(0.279 0.041 260.031)",
                    "accent-foreground": "oklch(0.984 0.003 247.858)",
                    border: "oklch(1 0 0 / 10%)",
                    ring: "oklch(0.551 0.027 264.364)",
                },
            },
            fontFamily: {
                sans: ["Public Sans", "sans-serif"],
                heading: ["Work Sans", "sans-serif"],
                body: ["Mozilla Headline", "sans-serif"],
            },
            fontSize: {
                h1: ["3.488rem", {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }],
                h2: ["2.074rem", {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }],
                h3: ["1.328rem", {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }],
                h4: ["1.24rem", {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }],
                h5: ["1.2rem", {
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                }],
                body: ["0.833rem", {
                    lineHeight: "1.5",
                    letterSpacing: "-0.02em"
                }],
                "body-sm": ["0.694rem", {
                    lineHeight: "1.5"
                }],
            },
            backgroundImage: {
                "content-gradient": "radial-gradient(ellipse 80% 70% at 50% -40%, rgba(21, 99, 131, 0.9), rgb(18, 18, 20)), radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 24, 51, .6), rgba(24, 23, 26, 0.3))",
                "body-gradient": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 24, 51, .6), rgba(78, 38, 120, 0.3))",
            },
            backdropBlur: {
                glass: "40px",
            },
            boxShadow: {
                glass: "0 10px 12px 0 oklch(0 0 none / 0.09), 0 1px 3px lch(5.81% 3.47 304.61 / 0.266), inset 0 1px 1px #4cfbf561, 3px 18px 17px #0000001d, 0 1px 3px #0000001a, inset -100px 10px 200px -1px oklch(0.45 0.1749 288.98 / 0.41)",
                episode: "inset 0px 1px 1px #fbdb4c61, 3px 20px 17px #00000036",
            },
        },
    },
    plugins: [],
}