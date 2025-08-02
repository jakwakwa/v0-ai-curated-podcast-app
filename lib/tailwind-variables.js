// Simple approach: Define variables in a dedicated file
// This is the most straightforward method

const cssVariables = {
  // Colors from your global CSS
  'background-hsl': '222.2 84% 4.9%',
  'foreground-hsl': '210 40% 98%',
  'card-hsl': '222.2 84% 4.9%',
  'card-foreground-hsl': '210 40% 98%',
  'popover-hsl': '222.2 84% 4.9%',
  'popover-foreground-hsl': '210 40% 98%',
  'primary-hsl': '210 40% 98%',
  'primary-foreground-hsl': '222.2 84% 4.9%',
  'secondary-hsl': '217.2 32.6% 17.5%',
  'secondary-foreground-hsl': '210 40% 98%',
  'muted-hsl': '217.2 32.6% 17.5%',
  'muted-foreground-hsl': '215 20.2% 65.1%',
  'accent-hsl': '217.2 32.6% 17.5%',
  'accent-foreground-hsl': '210 40% 98%',
  'destructive-hsl': '0 62.8% 30.6%',
  'destructive-foreground-hsl': '210 40% 98%',
  'border-hsl': '217.2 32.6% 17.5%',
  'input-hsl': '217.2 32.6% 17.5%',
  'ring-hsl': '212.7 26.8% 83.9%',
  
  // Font sizes from your global CSS
  'font-size-h1': '3.488rem',
  'font-size-h2': '2.074rem', 
  'font-size-h3': '1.328rem',
  'font-size-h4': '1.24rem',
  'font-size-h5': '1.2rem',
  'font-size-body': '0.833rem',
  'font-size-body-sm': '0.694rem',
  
  // Colors from your global CSS
  'color-h1': 'oklch(0.984 0.003 247.858)',
  'color-h2': 'oklch(0.984 0.003 247.858)',
  'color-h3': 'oklch(0.984 0.003 247.858)',
  'color-h4': 'oklch(0.984 0.003 247.858)',
  'color-h5': 'oklch(0.984 0.003 247.858)',
  'color-body': 'oklch(0.984 0.003 247.858)',
  
  // Button colors
  'button-primary': 'oklch(0.929 0.013 255.508)',
  'button-primary-d': 'oklch(0.208 0.042 265.755)',
  'button-primary-shadow': '0 1px 3px #0000001a, 0 1px 2px -1px #0000001a',
}

// Helper function to convert to Tailwind format
function cssVarToTailwind(varName, fallback = '') {
  const value = cssVariables[varName]
  if (!value) return fallback
  
  // Handle different value types
  if (value.includes('oklch')) {
    return value
  } else if (value.includes('hsl')) {
    return `hsl(var(--${varName}) ${fallback})`
  } else {
    return `var(--${varName})`
  }
}

// Generate Tailwind color object
function generateTailwindColors() {
  const colors = {}
  
  // Add all CSS variables as Tailwind colors
  Object.keys(cssVariables).forEach(varName => {
    if (varName.includes('-hsl')) {
      colors[varName] = cssVarToTailwind(varName)
    }
  })
  
  return colors
}

module.exports = {
  cssVariables,
  cssVarToTailwind,
  generateTailwindColors
} 