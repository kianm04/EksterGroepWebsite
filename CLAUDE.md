# Ekster Website - Development Guidelines

## Design Philosophy

You are building a **premium architectural visualization website** with the design sensibility of a **Senior Visual Designer at Adobe**. Every element should feel polished, sophisticated, and meticulously crafted.

### Core Visual Principles

1. **Glassmorphism & Depth**
   - Use frosted glass effects with `backdrop-blur-md` or stronger
   - Layer semi-transparent backgrounds (white/20-30 opacity)
   - Create depth with inset borders, subtle gradients, and sophisticated shadows
   - Apply multiple shadow layers for realism: `box-shadow: 0 8px 32px rgba(...), 0 0 0 1px rgba(...) inset`

2. **Micro-Interactions Matter**
   - Every hover state should have 3-4 visual changes (scale, background, glow, shadow)
   - Use GPU-accelerated transforms: `scale()`, `translateZ(0)`
   - Transition durations: 300-700ms with `ease-out` or custom bezier curves
   - Add shimmer/gradient slide effects for premium feel
   - Stagger animations when multiple elements appear (100-150ms delays)

3. **Typography & Spacing**
   - Use the defined font stack: `-apple-system, BlinkMacSystemFont, Inter, Segoe UI`
   - Apply `tracking-wide` for headings and buttons
   - Use `text-shadow` subtly for readability on transparent backgrounds
   - Maintain generous whitespace - never crowd elements

4. **Color Palette**
   - Primary background: `#82DBC5` (cyan-bg)
   - Light accent: `#A8E6D5` (cyan-light)
   - Dark accent: `#5CC4A8` (cyan-dark)
   - UI elements: White with varying opacity (20-80%)
   - Text: Gray-800/80 to Gray-900 with opacity variations
   - Always maintain WCAG AA contrast ratios

5. **Animation Standards**
   - Entrance animations: fade-in + slide-in (0.5-0.7s)
   - Hover effects: instant response (<300ms)
   - Use `will-change: transform` sparingly for performance
   - Target 60fps - test all animations
   - Add `backface-visibility: hidden` to prevent flickering

### Component Design Checklist

When creating ANY component, ensure:

- [ ] Has glassmorphic styling if it overlays 3D content
- [ ] Hover state includes scale transform (1.03-1.05x)
- [ ] Includes glow/shadow effect on interaction
- [ ] Has proper focus-visible states for accessibility
- [ ] Uses stagger animations if multiple items
- [ ] Implements at least one "wow" detail (shimmer, gradient, particle, etc.)
- [ ] Text is anti-aliased (`-webkit-font-smoothing: antialiased`)
- [ ] Transitions use GPU acceleration
- [ ] Has active/pressed state (scale 0.97-0.98x)

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

**Preferred Pattern**: Use Tailwind utility classes extensively, complemented by scoped `<style>` blocks for complex effects.

```vue
<template>
  <div class="backdrop-blur-md bg-white/20 border border-white/30 rounded-full">
    <!-- Tailwind for structure -->
  </div>
</template>

<style scoped>
/* Custom CSS for advanced effects */
.element {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
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

### Shadow & Glow Layers

Create depth with layered shadows:

```css
/* Outer shadow + inner highlight */
box-shadow:
  0 8px 32px 0 rgba(31, 38, 135, 0.15),
  0 0 0 1px rgba(255, 255, 255, 0.18) inset;
```

For glowing effects on hover:
```css
/* Cyan glow */
.glow-effect {
  box-shadow: 0 0 20px rgba(130, 219, 197, 0.4);
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
- Match lighting to the overall color scheme (cyan tones)

### Performance Optimization

```typescript
// Draco compression for models
const { state } = useGLTF('/models/model.glb', { draco: true })

// Dispose of geometries/materials when components unmount
onUnmounted(() => {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose()
    if (object.material) object.material.dispose()
  })
})
```

---

## Code Quality Standards

### TypeScript

- Use `strict` mode (enabled in nuxt.config.ts)
- Define proper types for all props and refs
- Avoid `any` - use `unknown` or proper types
- Type Three.js objects explicitly:
  ```typescript
  const camera: THREE.PerspectiveCamera | null = null
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
feat: add glassmorphic navigation component
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
- [ ] Visual polish: gradients, shadows, transitions complete

---

## Design Inspiration & References

When building components, think:
- **Glassmorphism**: iOS/macOS Big Sur design language
- **Premium software**: Autodesk, SketchUp Pro, Adobe Creative Cloud
- **Micro-interactions**: Stripe, Linear, Framer
- **3D web experiences**: Bruno Simon's portfolio, Awwwards winners

### Resources
- [Glassmorphism Generator](https://hype4.academy/tools/glassmorphism-generator)
- [TresJS Documentation](https://tresjs.org/)
- [Three.js Examples](https://threejs.org/examples/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## Common Patterns

### Overlay Component Template

```vue
<template>
  <div class="fixed inset-0 z-40 pointer-events-none">
    <div class="pointer-events-auto backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl">
      <!-- Your content with SEO-friendly HTML -->
    </div>
  </div>
</template>
```

### Button Component Pattern

```vue
<button
  class="group relative px-6 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-98"
>
  <!-- Background layer -->
  <div class="absolute inset-0 bg-white/0 group-hover:bg-white/60 transition-all duration-300"></div>

  <!-- Glow layer -->
  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-light/40 to-cyan-dark/40"></div>

  <!-- Shimmer effect -->
  <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

  <!-- Text -->
  <span class="relative z-10">Button Text</span>
</button>
```

---

## Final Notes

**Quality over speed**. Take time to add those extra visual details:
- The subtle gradient overlay
- The shimmer on hover
- The perfectly timed stagger animation
- The crisp text shadow

These details transform a good website into an **exceptional** one.

**Remember**: Every pixel matters. Every transition should feel intentional. Every interaction should delight.

Build something beautiful. 🎨
