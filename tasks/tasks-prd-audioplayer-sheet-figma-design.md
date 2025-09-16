## Relevant Files

- `components/ui/audio-player.tsx` - Existing bundle episode audio player logic; reference for wiring controls.
- `components/ui/user-episode-audio-player.tsx` - Existing user episode player; reference for wiring controls.
- `components/ui/audio-player.module.css` - Current player styles to study/avoid duplication; informs Tailwind rewrite approach.
- `components/ui/sheet.tsx` - shadcn/radix wrapper used for the slide-in sheet behavior.
- `app/(protected)/episodes/page.tsx` - Integrates current player via portal; useful for trigger integration.
- `app/(protected)/dashboard/page.tsx` - Another integration point for audio player wrappers.
- `components/ui/audio-player-sheet/AudioPlayerSheet.tsx` - New sheet component scaffold.
- `components/ui/button.tsx` - Reuse Button styles/variants.
- `components/ui/typography.tsx` - Reuse typography primitives.
- `hooks/useEpisodeProgress.ts` - Progress polling hook usage pattern; informs progress/time display.
- `app/globals.css` - Add dark theme CSS variables for design tokens.

### Notes

- Unit tests are colocated only where applicable in this project; component-level tests may be added later if desired.
- Use the existing `Sheet` component from `components/ui/sheet.tsx` with `side="right"`.

### Token Mapping (draft)

- `--audio-sheet-bg` → `#131313` (Figma: `fill_C4UK47`)
- `--audio-sheet-foreground` → `rgba(255, 255, 255, 0.66)` (Figma: `fill_XA5SWP`)
- `--audio-sheet-border` → `rgba(60, 58, 98, 0.52)` (Figma: `stroke_ACMD07`)
- `--audio-sheet-accent` → `#19B275` (Figma gradient mid stop from `fill_PQ4FGZ`)

## Tasks

- [ ] 1.0 Establish Figma MCP access and extract design specs/tokens
  - [ ] 1.2 Pull measurements, colors, typography, spacing from the referenced Figma frame
  - [x] 1.3 Define CSS variables in `app/globals.css` under `.dark` for audio sheet (bg, foreground, borders, accents)
  - [x] 1.4 Document tokens mapping (variable name -> Figma value) inline in commit description

- [ ] 2.0 Scaffold `AudioPlayerSheet` using shadcn `Sheet` (side="right") and Tailwind
  - [x] 2.1 Create `components/ui/audio-player-sheet/AudioPlayerSheet.tsx` (Client Component)
  - [x] 2.2 Create Tailwind class structure (no CSS module)
  - [x] 2.3 Use `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription` with `side="right"`
  - [x] 2.4 Add props interface: `open`, `onOpenChange`, `episode`, `onClose`
  - [x] 2.5 Structure minimal layout slots for header, artwork, meta, controls, progress, volume

- [ ] 3.0 Implement pixel-perfect UI (layout, typography, colors, spacing, effects)
  - [ ] 3.1 Recreate layout per Figma using Tailwind utilities (grid/flex as needed)
  - [ ] 3.2 Use existing text/font variables/utilities; do not introduce new font vars
  - [ ] 3.3 Apply exact colors via CSS variables added to `globals.css`
  - [ ] 3.4 Implement exact paddings, gaps, and radii; mirror shadows and borders
  - [ ] 3.5 Use `lucide-react` icons with exact sizes per Figma
  - [ ] 3.6 Add hover/focus/active styles matching interactive states in Figma

- [ ] 4.0 Wire UI to existing playback state/logic (controls, progress, volume, time)
  - [x] 4.1 Reuse the audio element pattern with `ref`, `timeupdate`, `loadedmetadata`, `ended`, `error`
  - [x] 4.2 Implement play/pause toggle and state sync with button visuals
  - [x] 4.3 Implement progress bar seek with correct aria roles and keyboard support
  - [x] 4.4 Display formatted current time and duration using existing `formatTime` pattern
  - [x] 4.5 Implement volume and mute controls with accessible labels
  - [x] 4.6 Ensure no regression vs `components/ui/audio-player.tsx` and `user-episode-audio-player.tsx`

- 
