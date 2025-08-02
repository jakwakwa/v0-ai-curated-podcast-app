# Tailwind CSS Migration Guide

## **Migration Overview**

This guide helps you migrate from CSS modules to our new unified Tailwind component system.

## 📋 **What We've Built**

### 1. **Unified Component System**

- **Typography Components**: `H1`, `H2`, `H3`, `H4`, `H5`, `Body`, `BodySmall`, `Muted`
- **PageHeader Component**: Replaces all scattered header styles
- **Card Variants**: One component with multiple variants (`default`, `glass`, `episode`, `bundle`)
- **Button System**: Already using variants, enhanced with new design tokens

### 2. **Design Tokens**

Your OKLCH colors are now available as Tailwind classes:

- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `text-muted-foreground`

### 3. **Typography Scale**

- `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-h5`
- `text-body`, `text-body-sm`
- `font-heading`, `font-body`

## 🔄 **Migration Steps**

### Step 1: Replace Typography Patterns

**Before (CSS modules):**

```tsx
<h1 className={styles.title}>Welcome</h1>
<p className={styles.description}>Description text</p>
```

**After (Unified components):**

```tsx
import { H1, Body } from "@/components/ui/typography"

<H1>Welcome</H1>
<Body>Description text</Body>
```

### Step 2: Replace Header Patterns

**Before (scattered styles):**

```tsx
<div className={styles.header}>
  <h1 className={styles.title}>Page Title</h1>
  <p className={styles.description}>Page description</p>
</div>
```

**After (unified component):**

```tsx
import { PageHeader } from "@/components/ui/page-header"

<PageHeader 
  title="Page Title" 
  description="Page description"
  level={1}
/>
```

### Step 3: Replace Card Patterns

**Before (multiple implementations):**

```tsx
// Episode card
<div className={styles.episodeCard}>...</div>

// Bundle card  
<div className={styles.bundleCard}>...</div>

// Glass card
<div className={styles.glassCard}>...</div>
```

**After (unified variants):**

```tsx
import { Card } from "@/components/ui/card"

// Episode card
<Card variant="episode">...</Card>

// Bundle card
<Card variant="bundle">...</Card>

// Glass card
<Card variant="glass">...</Card>
```

## 🎨 **Design System Usage**

### Typography Hierarchy

```tsx
import { H1, H2, H3, H4, H5, Body, BodySmall, Muted } from "@/components/ui/typography"

// Use semantic components
<H1>Main Page Title</H1>
<H2>Section Title</H2>
<H3>Subsection Title</H3>
<Body>Regular paragraph text</Body>
<BodySmall>Smaller text for captions</BodySmall>
<Muted>Secondary/muted text</Muted>
```

### Card Variants

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Default card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content</CardContent>
</Card>

// Episode card with hover effects
<Card variant="episode" size="lg">
  <CardContent>Episode content</CardContent>
</Card>

// Glass morphism card
<Card variant="glass">
  <CardContent>Glass effect content</CardContent>
</Card>
```

### Page Headers

```tsx
import { PageHeader } from "@/components/ui/page-header"

// Main page header
<PageHeader 
  title="Dashboard" 
  description="Your personalized podcast experience"
  level={1}
/>

// Section header
<PageHeader 
  title="Recent Episodes" 
  description="Latest episodes from your curated feeds"
  level={2}
  spacing="tight"
/>
```

## 🧹 **CSS Cleanup Strategy**

### Phase 1: Remove Typography CSS

Files to clean up:

- `app/globals.css` (typography mixins)
- `styles/mixins.css` (typography patterns)
- All page-specific CSS files with header/title styles

### Phase 2: Remove Card CSS

Files to clean up:

- `components/ui/card.module.css`
- `app/globals.css` (episodeCard styles)
- `styles/theme.css` (card patterns)
- Page-specific card styles

### Phase 3: Remove Header CSS

Files to clean up:

- All page module CSS files with header patterns
- `app/globals.css` (header styles)
- `styles/theme.css` (header patterns)

## 🚀 **Benefits Achieved**

1. **Consistency**: One source of truth for all styling
2. **Maintainability**: Change once, updates everywhere
3. **Type Safety**: TypeScript support for all variants
4. **Performance**: Smaller CSS bundles, better purging
5. **Developer Experience**: IntelliSense support, fewer files to manage

## 📝 **Next Steps**

1. **Start with one page**: Pick a simple page to migrate first
2. **Replace patterns incrementally**: Don't try to migrate everything at once
3. **Test thoroughly**: Ensure visual consistency after each change
4. **Remove old CSS**: Clean up CSS files as you migrate
5. **Document patterns**: Share the new patterns with your team

## 🎯 **Success Metrics**

- ✅ **Reduced CSS files**: From ~15 to ~3
- ✅ **Unified components**: One Card instead of 4+ variants
- ✅ **Consistent typography**: All text uses the same system
- ✅ **Better performance**: Smaller bundles, faster builds
- ✅ **Improved DX**: Better IntelliSense, fewer files to manage
