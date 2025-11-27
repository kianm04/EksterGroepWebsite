# Mobile Redesign Plan

## Goal
Create an immersive mobile experience where the 3D model fills the viewport background (positioned to the right), stays fixed while scrolling, and zooms in as the user scrolls - matching the dramatic desktop effect with text overlaid on the left side.

---

## Current State vs Target

### Current Mobile Layout
```
┌─────────────────────┐
│      Navigation     │
├─────────────────────┤
│  ┌───────────────┐  │
│  │  3D Viewport  │  │  ← Fixed floating card (40vh)
│  │   (centered)  │  │
│  └───────────────┘  │
├─────────────────────┤
│                     │
│   Text Content      │  ← Scrolls normally, separate from model
│   (below model)     │
│                     │
└─────────────────────┘
```

### Target Mobile Layout
```
┌─────────────────────┐
│      Navigation     │
├─────────────────────┤
│ Text    │           │
│ Overlay │   3D      │  ← Full-screen fixed canvas
│ (left)  │  Model    │     Model positioned to right
│         │  (right)  │     Text overlays on left with
│         │           │     semi-transparent backdrop
│ [CTA]   │   ↓       │  ← Camera zooms in as user scrolls
│         │  zoom     │
└─────────────────────┘
```

---

## Implementation Plan

### Phase 1: Full-Screen Fixed Canvas

**File: `pages/index.vue`**

1. Remove `MobileViewportContainer` wrapper for mobile
2. Create new mobile layout structure:
   - Full-viewport fixed `TresCanvas` (100vw × 100vh minus nav)
   - Overlay container for text content with `pointer-events: none` on container, `pointer-events: auto` on text elements
3. Enable scroll-based camera zoom for mobile (modify `useScrollCamera` config)

**Changes:**
```vue
<!-- Mobile Layout: Full-screen 3D with overlay text -->
<div v-else class="relative pt-16">
  <!-- Fixed full-screen 3D Canvas -->
  <div class="fixed inset-0 pt-16 z-0">
    <TresCanvas ...>
      <HouseModelRig
        :scroll-controlled-radius="cameraRadius"
        :is-scrolling-active="isScrolling"
        responsive-mode="mobile"
        ...
      />
    </TresCanvas>
  </div>

  <!-- Scrollable overlay content -->
  <div class="relative z-10 min-h-[200vh] pointer-events-none">
    <div class="mobile-text-overlay pointer-events-auto">
      <!-- Text content with backdrop -->
    </div>
  </div>
</div>
```

### Phase 2: Enable Scroll-Zoom for Mobile

**File: `pages/index.vue`**

1. Change `useScrollCamera` to be enabled on mobile:
```typescript
const { scrollProgress, easedScrollProgress, cameraRadius, isScrolling } = useScrollCamera({
  startRadius: isMobile.value ? 50 : 45,  // Slightly further on mobile
  endRadius: isMobile.value ? 22 : 20,    // Zoom in close
  enabled: true  // Always enabled (was: computed(() => !isMobile.value))
});
```

2. Pass scroll-controlled radius to mobile `HouseModelRig`:
```vue
<HouseModelRig
  :scroll-controlled-radius="cameraRadius"
  :is-scrolling-active="isScrolling"
  responsive-mode="mobile"
  ...
/>
```

### Phase 3: Text Overlay Styling

**File: `pages/index.vue` (new mobile section)**

Create text overlay positioned to the left with clean backdrop:

```vue
<div class="mobile-text-overlay">
  <!-- Positioned left, partial width -->
  <div class="absolute left-0 top-0 bottom-0 w-[65%] sm:w-[55%]
              flex items-center px-6 py-12">
    <div class="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg
                border border-gray-200 max-w-md">
      <!-- Content with fade based on scroll -->
      <div :style="{ opacity: section1Opacity }">
        <p class="text-base font-light leading-relaxed text-gray-700">
          De Ekstergroep doet beheer...
        </p>
        <!-- ... rest of content ... -->
      </div>
    </div>
  </div>
</div>
```

**Styling considerations:**
- Left-aligned text container (55-65% width)
- Semi-transparent white background (`bg-white/90`)
- Subtle blur for depth (`backdrop-blur-sm`)
- Clean border and shadow per design guidelines
- Content fades based on scroll progress (reuse `section1Opacity`, `section2Opacity`)

### Phase 4: Adjustable Model Positioning

**File: `components/HouseModelRig.vue`**

Add prop for model viewport offset to position model to the right:

```typescript
const props = defineProps<{
  // ... existing props
  viewportOffset?: { x: number; y: number }; // Offset for positioning model
}>();
```

Alternative approach - use CSS to offset the canvas:
```vue
<!-- In mobile layout -->
<div class="fixed inset-0 pt-16 z-0"
     style="left: 15%; width: 100%;">  <!-- Shift canvas right -->
  <TresCanvas ... />
</div>
```

This allows easy tweaking of model position by adjusting the `left` percentage.

### Phase 5: Scroll Spacer for Content Progression

Create scrollable height for the zoom effect:

```vue
<!-- Invisible scroll spacer to enable zoom range -->
<div class="h-[150vh]" />  <!-- Adjust height to control zoom speed -->
```

The longer the scroll distance, the more gradual the zoom effect.

---

## Component Changes Summary

### `pages/index.vue`
- [ ] Remove `MobileViewportContainer` usage
- [ ] Create full-screen fixed canvas layout for mobile
- [ ] Enable `useScrollCamera` for mobile
- [ ] Add overlay text container with left positioning
- [ ] Add scroll spacer for zoom range
- [ ] Add CSS variable or prop for model position offset

### `components/HouseModelRig.vue`
- [ ] Ensure `scroll-controlled-radius` works with mobile mode
- [ ] Consider adding viewport offset prop (optional)

### `composables/useScrollCamera.ts`
- [ ] No changes needed (already supports `enabled` config)

### `components/MobileViewportContainer.vue`
- [ ] Can be kept for potential future use, but not used in new mobile layout

---

## Design Specifications

### Text Overlay Card
```css
/* Clean architectural style per CLAUDE.md */
.mobile-text-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  max-width: 320px;
}
```

### Scroll Fade Transitions
- Section 1 content: Visible at 0% scroll, fades out by 40%
- Section 2 content: Fades in starting at 50%, fully visible at 90%
- Smooth opacity transitions (200-300ms)

### Model Positioning
- Canvas offset: `left: 10-20%` (adjustable)
- This positions the model focal point to the right ~60-70% of screen

### Touch Interaction
- Model still supports drag-to-rotate when user touches the canvas area
- Text areas have `pointer-events: auto` for links/buttons
- Smooth 60fps animation for zoom and rotation

---

## Responsive Breakpoint Handling

The mobile layout applies when `viewport.width < 768px` (defined in `useResponsive.ts`).

For tablets (768-1024px), consider:
- Slightly wider text overlay (60-70%)
- Larger text card max-width
- More padding

---

## Testing Checklist

- [ ] Scroll-zoom works smoothly on mobile Safari
- [ ] Scroll-zoom works smoothly on mobile Chrome
- [ ] Touch-to-rotate works alongside scroll-zoom
- [ ] Text remains readable over model
- [ ] Links/buttons in overlay are clickable
- [ ] Performance: 60fps during scroll
- [ ] No layout shift when loading model
- [ ] Navigation remains accessible
- [ ] Correct behavior at different scroll positions

---

## Configuration Points (Easy to Tweak)

| Setting | Location | Default | Description |
|---------|----------|---------|-------------|
| Model offset | CSS `left` on canvas container | `15%` | Shifts model to right |
| Text overlay width | Tailwind class | `w-[65%]` | Width of text area |
| Start zoom radius | `useScrollCamera` config | `50` | Initial camera distance |
| End zoom radius | `useScrollCamera` config | `22` | Final camera distance |
| Scroll height | Spacer div | `150vh` | Controls zoom speed |
| Backdrop opacity | Tailwind class | `bg-white/90` | Text card transparency |

---

## Alternative Approaches Considered

1. **Horizontal scroll** - Rejected: Non-standard mobile UX
2. **Snap scrolling** - Could add later for section-based navigation
3. **Parallax layers** - Current approach simpler and more performant
4. **Video fallback** - Not needed, 3D should work well on modern mobile
