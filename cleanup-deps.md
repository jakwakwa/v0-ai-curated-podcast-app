# 🧹 Dependencies to Remove for Faster Installs

## Definitely Remove (Redundant)

```bash
npm remove biome  # You already have @biomejs/biome
```

## Likely Unused (Remove if not using)

```bash
# Drag & Drop (if not using drag/drop features)
npm remove @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities

# Charts (if not displaying charts)
npm remove recharts

# Command Palette (if not using search/command interface)
npm remove cmdk

# OTP Input (if not using one-time passwords)
npm remove input-otp

# Drawer Component (if not using mobile drawers)
npm remove vaul

# Data Tables (if not using complex tables)
npm remove @tanstack/react-table

# YouTube Transcripts (if not processing YouTube videos)
npm remove youtube-transcript

# PostCSS Mixins (if not using CSS mixins)
npm remove postcss-mixins
```

## Radix UI Components (Remove unused ones)

```bash
# Only remove the ones you're NOT using:
npm remove @radix-ui/react-collapsible    # Collapsible content
npm remove @radix-ui/react-navigation-menu # Complex navigation
npm remove @radix-ui/react-toggle         # Toggle buttons
npm remove @radix-ui/react-toggle-group   # Toggle groups
```

## Quick Command to Remove All Likely Unused

```bash
npm remove biome @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities recharts cmdk input-otp vaul @tanstack/react-table youtube-transcript postcss-mixins
```

## Expected Results

- **Before**: 69 dependencies
- **After**: ~50-55 dependencies
- **Install speed**: 30-50% faster
- **Build speed**: 20-30% faster

## How to Check What You're Actually Using

```bash
# Search your codebase for imports
grep -r "from 'recharts'" app components
grep -r "from '@dnd-kit" app components
grep -r "from 'cmdk'" app components
```
