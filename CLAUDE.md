# Ekster Website - Development Guidelines

## Design Philosophy

You are building a **premium architectural visualization website** with the design sensibility of a **professional architectural firm**. Every element should feel clean, sophisticated, and purposeful - emphasizing clarity and professional presentation.

### Core Visual Principles

1. **Clean Minimalism & Structure**

   - Use crisp white backgrounds with RAL9010 (#F7F9F7) as the primary color
   - Eliminate all transparency and glass effects
   - Create depth through subtle shadows and clean geometric borders
   - Apply single, purposeful shadows: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`

2. **Subtle Interactions**

   - Hover states should have 1-2 clean visual changes (subtle scale, background, or shadow)
   - Use smooth transforms: `scale(1.02)` for subtle elevation
   - Transition durations: 200-300ms with `ease-out`
   - Avoid complex effects - focus on crisp, professional feedback
   - Use minimal stagger animations (50-100ms delays) sparingly

3. **Typography & Spacing**

   - Use the defined font stack: `-apple-system, BlinkMacSystemFont, Inter, Segoe UI`
   - Apply `tracking-wide` sparingly for major headings only
   - Avoid text-shadows completely - rely on color contrast for readability
   - Maintain generous whitespace with clean, architectural spacing

4. **Color Palette**

   - Primary background: RAL9010 `#F7F9F7` (pure white)
   - Secondary background: Pure white `#FFFFFF`
   - Accent elements: Light gray `#F5F5F5` for subtle differentiation
   - UI elements: Solid white backgrounds with clean gray borders
   - Text: Gray-900 `#111827` for primary text, Gray-600 `#4B5563` for secondary
   - Always maintain WCAG AA contrast ratios with high-contrast approach

5. **Animation Standards**
   - Entrance animations: fade-in + slide-in (0.5-0.7s)
   - Hover effects: instant response (<300ms)
   - Use `will-change: transform` sparingly for performance
   - Target 60fps - test all animations
   - Add `backface-visibility: hidden` to prevent flickering

### Component Design Checklist

When creating ANY component, ensure:

- [ ] Uses clean white backgrounds with solid colors (no transparency)
- [ ] Hover state includes subtle scale transform (1.01-1.02x) if appropriate
- [ ] Uses clean, minimal shadows for depth when needed
- [ ] Has proper focus-visible states for accessibility
- [ ] Avoids unnecessary animations - only animate when it adds value
- [ ] Maintains architectural precision and cleanliness
- [ ] Text is anti-aliased (`-webkit-font-smoothing: antialiased`)
- [ ] Transitions are smooth and purposeful (200-300ms)
- [ ] Has subtle active/pressed state (scale 0.98x) for interactive elements

---

## Technical Architecture

### Technology Stack

- **Framework**: Nuxt 3 (Vue 3 Composition API)
- **3D Rendering**: TresJS (Three.js wrapper for Vue)
- **Styling**: TailwindCSS with extensive custom configuration
- **Type Safety**: TypeScript throughout
- **3D Models**: GLTF/GLB with Draco compression

### Project Structure

```
/components/          # Reusable UI and 3D components
/pages/              # Nuxt pages (file-based routing)
/public/models/      # 3D model assets (.glb files)
/public/libs/        # Draco/Basis decoders for 3D
tailwind.config.ts   # Extended theme, animations, colors
nuxt.config.ts       # SSR/prerender rules, modules
```

---

## SEO & Performance Guidelines

### CRITICAL: Text Content Strategy

**NEVER render text content in Three.js/WebGL that should be indexable by search engines.**

- ✅ **DO**: Use HTML overlays for all text content (headings, descriptions, navigation, etc.)
- ✅ **DO**: Layer HTML UI over 3D canvas using CSS positioning (`fixed`, `absolute`, `z-index`)
- ✅ **DO**: Ensure text is in the DOM for screen readers and web crawlers
- ❌ **DON'T**: Render text as 3D objects or textures in the scene
- ❌ **DON'T**: Use canvas-based text that isn't in the HTML

### SEO Best Practices

1. **Semantic HTML**

   - Use proper heading hierarchy (h1, h2, h3)
   - Semantic tags: `<nav>`, `<main>`, `<article>`, `<section>`
   - Alt text for all images
   - Descriptive link text

2. **Pre-rendering**

   - Static pages are pre-rendered (see `nuxt.config.ts` routeRules)
   - 3D-heavy routes use `ssr: false` for performance
   - Meta tags in Vue components using `useHead()` composable

3. **Performance Targets**

   - First Contentful Paint (FCP): < 1.5s
   - Largest Contentful Paint (LCP): < 2.5s
   - Total Blocking Time (TBT): < 200ms
   - Cumulative Layout Shift (CLS): < 0.1

4. **3D Model Optimization**
   - Use Draco compression for GLTF models
   - Keep model poly count reasonable (< 100k triangles for web)
   - Lazy load models not immediately visible
   - Use LOD (Level of Detail) for complex scenes

### Accessibility Requirements

- All interactive elements must be keyboard navigable
- Focus states must be clearly visible (`focus-visible:` utilities)
- Color contrast ratios ≥ 4.5:1 for text
- Provide `aria-labels` for icon-only buttons
- Test with screen readers

---

## Styling Guidelines

### TailwindCSS Usage

**Preferred Pattern**: Use Tailwind utility classes extensively, complemented by scoped `<style>` blocks for clean styling.

```vue
<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Clean, minimal structure -->
  </div>
</template>

<style scoped>
/* Clean, minimal styling */
.element {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

### Animation Implementation

Use the custom animations defined in `tailwind.config.ts`:

- `animate-slide-in`: Entrance animation for elements
- `animate-fade-in`: Simple opacity fade
- `animate-float`: Subtle floating idle animation
- `animate-glow`: Pulsing glow effect

**Staggered Animations Example**:

```vue
<div
  v-for="(item, index) in items"
  :style="`animation-delay: ${index * 100}ms;`"
  class="animate-slide-in"
>
```

### Clean Shadows & Borders

Create depth with clean, minimal shadows:

```css
/* Simple, clean shadow */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Elevated shadow for hover states */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

For clean borders:

```css
/* Clean border styling */
.bordered-element {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
```

---

## 3D Development Guidelines

### TresJS Component Patterns

**HouseModel.vue** demonstrates best practices:

- Extract camera settings from GLTF scene
- Use `watch` with `immediate: true` for reactive loading
- Computed properties for scene traversal
- Proper TypeScript typing for Three.js objects

### Camera & Lighting

- Use cameras exported from Blender/3D software when possible
- Always include `TresAmbientLight` for base illumination
- Consider `TresDirectionalLight` for realistic shadows
- Use neutral lighting that complements the clean white aesthetic

### Performance Optimization

```typescript
// Draco compression for models
const { state } = useGLTF("/models/model.glb", { draco: true });

// Dispose of geometries/materials when components unmount
onUnmounted(() => {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) object.material.dispose();
  });
});
```

---

## Code Quality Standards

### TypeScript

- Use `strict` mode (enabled in nuxt.config.ts)
- Define proper types for all props and refs
- Avoid `any` - use `unknown` or proper types
- Type Three.js objects explicitly:
  ```typescript
  const camera: THREE.PerspectiveCamera | null = null;
  ```

### Vue Composition API

- Use `<script setup lang="ts">` syntax
- Destructure composables clearly: `const { state } = useGLTF(...)`
- Keep components focused - split large components
- Use computed properties for derived state

### Component Organization

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props/Emits
// 3. Composables
// 4. Reactive state
// 5. Computed properties
// 6. Watchers
// 7. Lifecycle hooks
// 8. Functions
</script>

<template>
  <!-- Clean, readable template -->
</template>

<style scoped>
/* Component-specific styles */
</style>
```

---

## Commit & PR Standards

### Commit Messages

Follow conventional commits:

```
feat: add clean white navigation component
fix: resolve camera positioning in HouseModel
style: enhance button hover animations
perf: optimize 3D model loading with Draco
docs: update CLAUDE.md with SEO guidelines
```

### Pull Request Checklist

Before creating a PR:

- [ ] All animations run smoothly at 60fps
- [ ] Component has hover, focus, and active states
- [ ] Text content is in HTML (not WebGL)
- [ ] Accessibility: keyboard navigation works
- [ ] TypeScript errors resolved
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Performance tested (Lighthouse score > 90)
- [ ] Visual polish: clean styling, minimal shadows, smooth transitions complete

---

## Design Inspiration & References

When building components, think:

- **Architectural minimalism**: Tadao Ando, John Pawson, Dieter Rams design principles
- **Professional software**: AutoCAD, Rhino, SketchUp Pro interface design
- **Clean interactions**: Apple.com, Stripe, Linear clean aesthetics
- **Architectural websites**: Foster + Partners, Zaha Hadid Architects, BIG

### Resources

- [TresJS Documentation](https://tresjs.org/)
- [Three.js Examples](https://threejs.org/examples/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [RAL Color Standards](https://www.ral-farben.de/)

---

## Common Patterns

### Overlay Component Template

```vue
<template>
  <div class="fixed inset-0 z-40 pointer-events-none">
    <div
      class="pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      <!-- Your content with SEO-friendly HTML -->
    </div>
  </div>
</template>
```

### Button Component Pattern

```vue
<button
  class="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-102 active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
>
  Button Text
</button>
```

---

## Final Notes

**Quality over speed**. Focus on architectural precision and clean details:

- The perfect white balance
- The subtle shadow depth
- The clean geometric alignment
- The crisp typography hierarchy

These details transform a good website into a **professional architectural showcase**.

**Remember**: Every pixel matters. Every line should be intentional. Every interaction should feel precise.

Build something timeless and professional. 🏛️

DEVELOPMENT RULES:
Leave the testing of the website to the user, never run 'npm run dev' or attempt to visit the website using curl.