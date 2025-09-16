# Product Requirements Document: AudioPlayerSheet Figma Design Implementation

## Introduction/Overview

This PRD outlines the implementation of a pixel-perfect AudioPlayerSheet component based on a Figma design. The goal is to create a new, visually polished audio player component that provides an enhanced user experience for podcast episode playback. The component will replace existing audio player implementations with a design that precisely matches the provided Figma specifications.

**Problem Statement:** The current audio player components lack visual polish and don't align with the desired design system. Users need a more intuitive and visually appealing audio player interface.

**Goal:** Create a pixel-perfect AudioPlayerSheet component that exactly replicates the Figma design while maintaining all existing audio playback functionality.

## Goals

1. **Pixel-Perfect Implementation:** Achieve 100% visual fidelity with the provided Figma design
2. **Enhanced User Experience:** Improve the visual appeal and usability of the audio player
3. **Design System Alignment:** Ensure the component follows the established design language
4. **Responsive Design:** Implement responsive behavior for mobile, tablet, and desktop viewports
5. **Dark Theme Support:** Ensure optimal appearance in dark theme environments
6. **Zero Functional Regression:** Maintain all existing audio playback functionality

## Scope and Boundaries

- **New Component:** Build a fresh `AudioPlayerSheet.tsx` component (do not modify legacy players directly).
- **Structural Changes:** Allowed where necessary to achieve exact design parity, while preserving existing logic and behavior.
- **Logic:** No new features; maintain current playback capabilities and interactions.
- **Theming:** Dark theme only for this scope.
- **Responsiveness:** Must work seamlessly on mobile, tablet, and desktop.
- **Design Source of Truth:** The linked Figma frame accessed via MCP must be replicated exactly.
 - **Component Trigger:** The sheet opens from the right when the episode card Play action is invoked (slide-in from right behavior).

## User Stories

**As an end user listening to podcast episodes, I want:**
- A visually polished audio player that matches the design system
- Intuitive controls that are easy to understand and use
- A responsive interface that works well on all device sizes
- Clear visual feedback for play/pause states and progress
- An aesthetically pleasing dark-themed interface

**As a developer, I want:**
- A component that exactly matches the Figma specifications
- Clean, maintainable code with no dry code patterns
- Proper TypeScript typing throughout
- Reusable component structure

## Functional Requirements

### Core Visual Requirements
1. **Layout & Structure:** The component must replicate Figma auto-layout properties using CSS Modules (Flexbox/Grid)
2. **Colors:** All hex codes for text, backgrounds, icons, borders, and fills must be taken directly from Figma properties
3. **Typography:** Every text element must use exact Font Family, Font Weight, Font Size, and Line Height from Figma
4. **Spacing:** All padding, margins, and gaps must precisely match Figma values
5. **Sizing:** All elements must have exact width, height, min/max-width, and aspect ratio per Figma specs
6. **Effects & Styles:** All Border Radius, Box Shadows, and visual styles must perfectly replicate Figma

### Audio Player Functionality
7. **Play/Pause Controls:** Maintain existing play/pause functionality with new visual design
8. **Progress Bar:** Implement seekable progress bar with visual feedback
9. **Time Display:** Show current time and duration with proper formatting
10. **Volume Controls:** Include volume adjustment and mute functionality
11. **Episode Information:** Display episode title, description, and artwork
12. **Responsive Behavior:** Adapt layout for mobile, tablet, and desktop viewports

### Technical Requirements
13. **Figma Integration:** Use MCP Figma server to extract exact design specifications
14. **Component Structure:** Create new AudioPlayerSheet component from scratch
15. **TypeScript:** Maintain strict typing throughout the component (no `any` types)
16. **Styling:** CSS Modules only per workspace rules (no Tailwind usage)
17. **UI Framework:** Use existing shadcn/ui `Sheet` from `@/components/ui/sheet` with `side="right"` to match slide-in behavior per docs ([Sheet docs](https://ui.shadcn.com/docs/components/sheet)).
18. **Component Reuse:** Reuse existing UI components (e.g., `Button`, `Typography`, `episode-progress` if applicable) and extend via variants; avoid duplicating components.
19. **Accessibility:** Ensure proper ARIA labels and keyboard navigation
20. **Performance:** Optimize for smooth interactions and minimal re-renders

## Non-Goals (Out of Scope)

1. **Logic Changes:** No modifications to existing audio playback logic or state management
2. **API Changes:** No changes to data fetching or backend integration
3. **Feature Additions:** No new functionality beyond what exists in current audio players
4. **Light Theme:** Focus only on dark theme implementation
5. **Legacy Support:** No need to maintain compatibility with old audio player components
6. **Custom CSS:** Use CSS Modules exclusively; do not use Tailwind

## Design Considerations

### Figma Design Source
- **Primary Source:** Figma frame (via MCP): [Audio Player Sheet – Figma](https://www.figma.com/design/vriYe1lagcHjrXn6iRPHT3/figma-resume-sample?node-id=58-22&t=MbuMMZb20ShGOxwe-4)
- **Design System:** Follow established component patterns and design tokens
- **Visual Hierarchy:** Maintain clear information hierarchy as specified in Figma
- **Interactive States:** Implement hover, active, and focus states per design

### Responsive Design
- **Mobile First:** Design for mobile viewport as primary target
- **Breakpoints:** Implement responsive behavior at standard breakpoints (sm, md, lg, xl)
- **Touch Targets:** Ensure adequate touch target sizes for mobile interaction
- **Layout Adaptation:** Adjust component layout for different screen sizes

### Dark Theme Focus
- **Color Palette:** Use dark theme color scheme exclusively
- **Contrast:** Ensure proper contrast ratios for accessibility
- **Visual Depth:** Implement appropriate shadows and layering for dark theme
- **Icon Treatment:** Use appropriate icon styles for dark backgrounds

## Technical Considerations

### Component Architecture
- **New Component:** Create `AudioPlayerSheet.tsx` as a new component
- **Props Interface:** Define clear TypeScript interface for component props
- **State Management:** Use existing state management patterns (useState, useRef, useCallback)
- **Event Handling:** Maintain existing event handling patterns

### Styling Approach
 - **CSS Modules Only:** Implement styles via CSS Modules to align with workspace standards; no Tailwind in new styles.
 - **Component Variants:** Prefer adding/using variants on existing UI components rather than creating new ad-hoc elements.
 
- **Design Tokens:** Extract colors, spacing, and typography from Figma
- **Responsive Rules:** Encode responsive behavior using CSS Modules and media queries consistent with project patterns

### Figma Integration
 - **MCP Server:** Use Figma MCP server to access design specifications
 - **Design Extraction:** Extract exact measurements, colors, and typography
 - **Color Tokens in Globals:** Add Figma color variables to `app/globals.css` under `:root` and `.dark` (e.g., `--audio-sheet-bg`, `--audio-sheet-foreground`, border, accents), then reference them from CSS Modules.
 - **Asset Management:** Download and optimize any required assets from Figma
 - **Version Control:** Ensure design specifications are properly documented

### Performance Considerations
- **Memoization:** Use React.memo and useMemo for expensive calculations
- **Event Optimization:** Implement proper event handling to prevent unnecessary re-renders
- **Asset Optimization:** Optimize any images or icons from Figma
- **Bundle Size:** Minimize impact on application bundle size

## Success Metrics

### Design Fidelity
- **Pixel Perfect Match:** 100% visual match with Figma design
- **Cross-Device Consistency:** Identical appearance across all target devices
- **Design Review Approval:** Stakeholder approval of visual implementation

### User Experience
- **User Feedback:** Positive feedback on visual improvements
- **Usability Testing:** Successful completion of audio player tasks
- **Accessibility Compliance:** Meets WCAG guidelines for audio controls

### Technical Quality
- **Code Quality:** Clean, maintainable code with no dry code patterns
- **Type Safety:** Zero TypeScript errors or warnings
- **Performance:** Smooth interactions with no visual lag
- **Responsive Behavior:** Proper adaptation across all viewport sizes

## Open Questions

1. **Component Integration:** How should the new AudioPlayerSheet integrate with existing audio player wrappers across pages?
2. **Asset Requirements:** Are there specific icons, images, or other assets to export from Figma, or should we rely on existing icon sets?
3. **Animation Requirements:** Are there micro-interactions/animations (e.g., progress bar easing, button press states) specified in Figma?
4. **Error States:** How should error states (failed audio load, network issues) be visually presented within the sheet?
5. **Loading States:** What visual feedback should be shown during audio loading/buffering?
6. **Accessibility Requirements:** Any requirements beyond standard ARIA labeling and keyboard interaction?

## Implementation Notes

- **Critical Directive:** This implementation must be an exact replica of the Figma design with no compromises
- **MCP Integration:** Use the Figma MCP server to access design specifications - there is no excuse for not creating an exact replica
- **Fresh Start:** Create a completely new component rather than modifying existing ones
- **No Dry Code:** Ensure clean, maintainable code without repetitive patterns
- **Pixel Perfect Execution:** Every visual element must match the Figma specifications exactly

---

**Document Version:** 1.0  
**Created:** [Current Date]  
**Status:** Ready for Implementation  
**Priority:** High  
**Estimated Effort:** 2-3 days
