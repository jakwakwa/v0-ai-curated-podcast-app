const {
    getCSSVariables
} = require("./lib/css-variables")

module.exports = {
    plugins: [
        [
            "@tailwindcss/postcss",
            {
                theme: {
                    colors: {
                        ...getCSSVariables(),
                        "accent-selection": "var(--color-accent-selection)",
                        "accent-selection-bg": "var(--color-accent-selection-bg)",
                        "accent-selection-border": "var(--color-accent-selection-border)",
                    },
                },
            },
        ],
        "autoprefixer",
    ],
}