# Dialog Components Migration Task

## 🎯 **Objective**

Migrate all dialog/modal components from CSS modules to Tailwind CSS using our unified component system.

## ⚠️ **Why This Must Be Done First**

- Dialogs are used across multiple pages (dashboard, bundles, account, etc.)
- They contain forms and complex layouts that need consistent styling
- Prevents duplicate work when migrating individual pages
- Ensures consistent user experience across all modals

## 📋 **Components to Migrate**

### **1. EditUserFeedModal**

**File**: `components/edit-user-feed-modal.tsx`
**CSS**: `components/edit-user-feed-modal.module.css`
**Usage**: Dashboard, Bundle pages

### **2. UserFeedSelector**

**File**: `components/features/user-feed-selector.tsx`
**CSS**: `components/features/user-feed-selector.module.css`
**Usage**: Dashboard, Bundle pages

### **3. Dialog Base Components**

**Files**:

- `components/ui/dialog.tsx`
- `components/ui/dialog.module.css`
**Usage**: All modal dialogs across the app

### **4. Form Components**

**Files**:

- `components/ui/input.tsx`
- `components/ui/select.tsx`
- `components/ui/textarea.tsx`
**Usage**: All forms in dialogs

## 🔄 **Migration Steps**

### **Step 1: EditUserFeedModal Migration**

**Before:**

```tsx
import styles from "./edit-user-feed-modal.module.css"

<div className={styles.modalContainer}>
  <div className={styles.formGroup}>
    <label className={styles.label}>Feed Name</label>
    <input className={styles.input} />
  </div>
  <div className={styles.buttonGroup}>
    <button className={styles.cancelButton}>Cancel</button>
    <button className={styles.saveButton}>Save</button>
  </div>
</div>
```

**After:**

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { H3, Body } from "@/components/ui/typography"

<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Personalized Feed</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Feed Name</Label>
        <Input id="name" value={name} onChange={handleNameChange} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button  variant="submit" onClick={handleSave}>Save</Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

### **Step 2: UserFeedSelector Migration**

**Before:**

```tsx
import styles from "./user-feed-selector.module.css"

<div className={styles.selectorContainer}>
  <div className={styles.bundleGrid}>
    {bundles.map(bundle => (
      <div key={bundle.id} className={styles.bundleCard}>
        <h3 className={styles.bundleTitle}>{bundle.name}</h3>
        <p className={styles.bundleDescription}>{bundle.description}</p>
      </div>
    ))}
  </div>
</div>
```

**After:**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { H3, Body } from "@/components/ui/typography"

<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {bundles.map(bundle => (
      <Card key={bundle.id} variant="bundle" className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{bundle.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Body>{bundle.description}</Body>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

### **Step 3: Dialog Base Components**

**Before:**

```tsx
import styles from "./dialog.module.css"

<div className={styles.overlay}>
  <div className={styles.content}>
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
    </div>
    <div className={styles.body}>
      {children}
    </div>
  </div>
</div>
```

**After:**

```tsx
// Already using Radix UI Dialog primitives with Tailwind
<DialogPrimitive.Root>
  <DialogPrimitive.Trigger asChild>
    {trigger}
  </DialogPrimitive.Trigger>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
```

## 🎨 **Design System Integration**

### **Typography in Dialogs**

```tsx
import { H3, Body, BodySmall } from "@/components/ui/typography"

<DialogHeader>
  <DialogTitle>
    <H3>Edit Personalized Feed</H3>
  </DialogTitle>
</DialogHeader>
<DialogContent>
  <Body>Configure your personalized podcast feed settings.</Body>
</DialogContent>
```

### **Button Variants in Dialogs**

```tsx
import { Button } from "@/components/ui/button"

<div className="flex gap-2 justify-end">
  <Button variant="outline" onClick={onCancel}>Cancel</Button>
  <Button variant="default" onClick={onSave}>Save Changes</Button>
  <Button variant="destructive" onClick={onDelete}>Delete</Button>
</div>
```

### **Form Layout in Dialogs**

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Feed Name</Label>
    <Input id="name" placeholder="Enter feed name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="category">Category</Label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tech">Technology</SelectItem>
        <SelectItem value="news">News</SelectItem>
        <SelectItem value="entertainment">Entertainment</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

## 🚨 **Critical Anti-Patterns to Avoid**

❌ **Forbidden:**

- Creating custom modal containers instead of using Dialog components
- Hardcoding form styles instead of using our form components
- Using `any` types for form handlers
- Mixing CSS modules with Tailwind classes
- Creating custom button styles instead of using Button variants

✅ **Required:**

- Use Dialog, DialogContent, DialogHeader components
- Use Input, Label, Select form components
- Use Button component with proper variants
- Use Typography components (H3, Body, BodySmall)
- Use `cn()` utility for className merging
- Remove all CSS module dependencies

## 📋 **Success Criteria**

- ✅ All dialog components use Tailwind classes only
- ✅ No CSS module imports in dialog files
- ✅ Consistent styling across all modals
- ✅ Type-safe form handling
- ✅ Proper accessibility with ARIA labels
- ✅ Responsive design with Tailwind breakpoints
- ✅ Build passes without errors
- ✅ Lint passes without warnings

## 🎯 **Next Steps After Dialog Migration**

1. **Test all dialog interactions** across the app
2. **Verify form submissions** work correctly
3. **Check accessibility** with screen readers
4. **Move to Bundle page migration** (Task 2)
5. **Update any remaining modal references**

## 📝 **Files to Clean Up After Migration**

- `components/edit-user-feed-modal.module.css` (delete)
- `components/features/user-feed-selector.module.css` (delete)
- `components/ui/dialog.module.css` (delete)
- Any page-specific modal CSS files
