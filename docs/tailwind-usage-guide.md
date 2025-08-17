# Tailwind CSS Usage Guide

## **Overview**

This guide shows how to use our dynamic CSS variables and Tailwind classes in JSX components. Our system provides both OKLCH colors and CSS custom properties that can be used throughout your components.

## **🎨 Color System**

### **OKLCH Colors (Primary)**

These are our main design tokens using OKLCH color space:

```tsx
// Background colors
<div className="bg-background">Main background</div>
<div className="bg-card">Card background</div>
<div className="bg-popover">Popover background</div>

// Text colors
<div className="text-foreground">Primary text</div>
<div className="text-card-foreground">Card text</div>
<div className="text-muted-foreground">Muted text</div>

// Interactive colors
<button className="bg-primary text-primary-foreground">Primary button</button>
<button className="bg-secondary text-secondary-foreground">Secondary button</button>
<button className="bg-accent text-accent-foreground">Accent button</button>
<button className="bg-destructive text-destructive-foreground">Destructive button</button>

// Border and input colors
<div className="border border-border">Bordered element</div>
<input className="bg-input" />
<div className="ring ring-ring">Ring focus</div>
```

### **CSS Custom Properties (Dynamic)**

These are extracted from your global CSS files:

```tsx
// HSL-based colors (from your CSS variables)
<div className="bg-background-hsl">Background using HSL</div>
<div className="text-foreground-hsl">Text using HSL</div>
<div className="border border-border-hsl">Border using HSL</div>

// Glass morphism effects
<div className="bg-glass-gradient">Glass gradient background</div>
<div className="shadow-glass">Glass shadow</div>
<div className="shadow-glass-hover hover:shadow-glass-hover">Glass hover effect</div>
```

## **📝 Typography System**

### **Font Families**

```tsx
// Heading font (Work Sans)
<h1 className="font-heading">Heading text</h1>
<h2 className="font-heading">Subheading</h2>

// Body font (Mozilla Headline)
<p className="font-body">Body text</p>
<span className="font-body">Inline text</span>
```

### **Font Sizes (Using CSS Variables)**

```tsx
// Heading sizes
<h1 className="text-h1">Large heading</h1>
<h2 className="text-h2">Medium heading</h2>
<h3 className="text-h3">Small heading</h3>
<h4 className="text-h4">Tiny heading</h4>
<h5 className="text-h5">Micro heading</h5>

// Body text sizes
<p className="text-body">Regular body text</p>
<p className="text-body-sm">Small body text</p>
```

### **Typography Components (Recommended)**

Use our Typography components for consistent styling:

```tsx
import { H1, H2, H3, H4, H5, Body, BodySmall, Muted } from "@/components/ui/typography"

// Semantic typography
<H1>Main Page Title</H1>
<H2>Section Title</H2>
<H3>Subsection Title</H3>
<Body>Regular paragraph text</Body>
<BodySmall>Smaller text for captions</BodySmall>
<Muted>Secondary/muted text</Muted>
```

## **🎯 Component Examples**

### **Card Components**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Default card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Body>Card content goes here</Body>
  </CardContent>
</Card>

// Episode card with glass effect
<Card variant="episode" className="shadow-glass hover:shadow-glass-hover">
  <CardContent>
    <H3>Episode Title</H3>
    <Body>Episode description</Body>
    <BodySmall className="text-muted-foreground">Published: 2024-01-15</BodySmall>
  </CardContent>
</Card>

// Bundle card
<Card variant="bundle">
  <CardHeader>
    <CardTitle>Bundle Name</CardTitle>
  </CardHeader>
  <CardContent>
    <Body>Bundle description</Body>
  </CardContent>
</Card>
```

### **Button Components**

```tsx
import { Button } from "@/components/ui/button"

// Primary button
<Button className="bg-primary text-primary-foreground">
  Primary Action
</Button>

// Secondary button
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Secondary Action
</Button>

// Destructive button
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete Item
</Button>

// Outline button
<Button variant="outline" className="border-border text-foreground">
  Outline Button
</Button>
```

### **Form Components**

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Input with proper styling
<div className="space-y-2">
  <Label htmlFor="email" className="text-foreground">Email</Label>
  <Input 
    id="email" 
    className="bg-input border-border text-foreground"
    placeholder="Enter your email"
  />
</div>

// Form group
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="description">Description</Label>
    <textarea 
      id="description"
      className="w-full bg-input border border-border text-foreground rounded-md p-2"
    />
  </div>
</div>
```

### **Dialog/Modal Components**

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="bg-card border-border">
    <DialogHeader>
      <DialogTitle className="text-card-foreground">Modal Title</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <Body>Modal content goes here</Body>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

## **🎨 Advanced Styling Patterns**

### **Glass Morphism Effects**

```tsx
// Glass card with backdrop blur
<div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6">
  <H3>Glass Card</H3>
  <Body>Content with glass effect</Body>
</div>

// Glass button
<button className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-md px-4 py-2 hover:bg-primary/30 transition-colors">
  Glass Button
</button>

// Glass gradient background
<div className="bg-glass-gradient rounded-lg p-6">
  <H3>Gradient Glass</H3>
  <Body>Content with gradient glass effect</Body>
</div>
```

### **Responsive Design**

```tsx
// Responsive typography
<h1 className="text-h1 md:text-h2 lg:text-h3">Responsive Heading</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Grid Item 1</Card>
  <Card>Grid Item 2</Card>
  <Card>Grid Item 3</Card>
</div>
```

### **Dark Mode Support**

```tsx
// Automatic dark mode (uses CSS variables)
<div className="bg-background text-foreground">
  <p>This automatically adapts to dark/light mode</p>
</div>

// Conditional dark mode classes
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  <p>Manual dark mode control</p>
</div>
```

## **🎯 Animation and Effects**

### **Loading States**

```tsx
// Loading spinner
<div className="animate-spin w-6 h-6 border-2 border-border border-t-primary rounded-full"></div>

// Loading pulse
<div className="animate-pulse bg-muted rounded-md h-4 w-32"></div>

// Custom loading animation
<div className="animate-loading bg-primary rounded-full h-8 w-8"></div>
```

### **Hover Effects**

```tsx
// Card hover effects
<Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
  <CardContent>
    <H3>Hover Card</H3>
    <Body>This card has hover effects</Body>
  </CardContent>
</Card>

// Button hover effects
<Button className="transition-colors hover:bg-primary/90">
  Hover Button
</Button>
```

## **📋 Best Practices**

### **✅ Do's**

```tsx
// ✅ Use semantic color classes
<div className="bg-background text-foreground">Good</div>

// ✅ Use Typography components
<H1>Page Title</H1>
<Body>Content text</Body>

// ✅ Use Card variants
<Card variant="episode">Episode content</Card>

// ✅ Use proper spacing
<div className="space-y-4 p-6">Well-spaced content</div>

// ✅ Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Responsive grid</div>
```

### **❌ Don'ts**

```tsx
// ❌ Don't use hardcoded colors
<div className="bg-blue-500 text-white">Bad - hardcoded colors</div>

// ❌ Don't use inline styles
<div style={{ backgroundColor: '#000', color: '#fff' }}>Bad - inline styles</div>

// ❌ Don't mix CSS modules with Tailwind
<div className={styles.container + " bg-background"}>Bad - mixed approaches</div>

// ❌ Don't use arbitrary values when design tokens exist
<div className="text-[16px]">Bad - use text-body instead</div>
```

## **🔧 Utility Classes Reference**

### **Colors**

- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `border-border`, `ring-ring`

### **Typography**

- `font-heading`, `font-body`
- `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-h5`
- `text-body`, `text-body-sm`

### **Effects**

- `shadow-glass`, `shadow-glass-hover`
- `bg-glass-gradient`
- `animate-loading`, `animate-spin`, `animate-pulse`

### **Spacing**

- `space-y-4`, `space-x-4`
- `p-4`, `px-4`, `py-4`
- `m-4`, `mx-4`, `my-4`

## **🎯 Migration Examples**

### **Before (CSS Modules)**

```tsx
import styles from "./component.module.css"

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
  <p className={styles.description}>Description</p>
  <button className={styles.button}>Click me</button>
</div>
```

### **After (Tailwind)**

```tsx
import { H1, Body } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

<div className="bg-card p-6 rounded-lg border border-border">
  <H1>Title</H1>
  <Body>Description</Body>
  <Button>Click me</Button>
</div>
```

## **📝 Troubleshooting**

### **Common Issues**

1. **Colors not working**: Make sure you're using the correct class names
2. **Typography not applying**: Use Typography components instead of raw classes
3. **Responsive not working**: Check your breakpoint prefixes (`md:`, `lg:`)
4. **Animations not working**: Ensure the animation classes are defined in your config

### **Debugging Tips**

```tsx
// Use browser dev tools to inspect applied classes
<div className="bg-red-500">Debug: This should be red</div>

// Check if CSS variables are loaded
<div className="bg-background-hsl">Debug: Should use HSL background</div>

// Verify responsive behavior
<div className="bg-blue-500 md:bg-red-500 lg:bg-green-500">
  Debug: Color changes on different screen sizes
</div>
```

This guide provides a comprehensive reference for using our dynamic CSS variables and Tailwind classes in your JSX components. Always prefer using our Typography and component systems over raw Tailwind classes for consistency.
