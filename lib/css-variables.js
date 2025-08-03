// Utility to extract CSS custom properties from global CSS
const fs = require("node:fs")
const path = require("node:path")

function extractCSSVariables(cssContent) {
    const variables = {}
    const regex = /--([^:]+):\s*([^;]+);/g
    let match

    match = regex.exec(cssContent)
    while (match !== null) {
        const [, name, value] = match
        variables[name.trim()] = value.trim()
        match = regex.exec(cssContent)
    }

    return variables
}

function getCSSVariables() {
    try {
        // Read your global CSS files
        const globalsCSS = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8")
        const themeCSS = fs.readFileSync(path.join(process.cwd(), "styles/theme.css"), "utf8")

        // Extract variables from both files
        const globalsVars = extractCSSVariables(globalsCSS)
        const themeVars = extractCSSVariables(themeCSS)

        // Merge variables (theme vars override globals)
        return {
            ...globalsVars,
            ...themeVars,
        }
    } catch (error) {
        console.warn("Could not read CSS files for variable extraction:", error.message)
        return {}
    }
}

module.exports = {
    getCSSVariables,
    extractCSSVariables,
}