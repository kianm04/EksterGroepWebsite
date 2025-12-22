<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent } from 'vue';
import type { PageConfig, ContentPosition } from '~/types/pages';

interface Props {
  page: PageConfig | undefined;
  isTransitioning: boolean;
  transitionProgress: number;
}

const props = defineProps<Props>();

// Content visibility based on transition state
const isVisible = computed(() => {
  if (!props.page) return false;

  // If content should be visible during transition, always show
  if (props.page.content.visibleDuringTransition) {
    return true;
  }

  // Otherwise, hide during transitions
  return !props.isTransitioning;
});

// Opacity for fade effect
const contentOpacity = computed(() => {
  if (!props.page) return 0;

  if (props.page.content.visibleDuringTransition) {
    return 1;
  }

  // Fade out at start, fade in at end
  if (props.isTransitioning) {
    // First 20% of transition: fade out
    if (props.transitionProgress < 0.2) {
      return 1 - (props.transitionProgress / 0.2);
    }
    // Last 20% of transition: fade in
    if (props.transitionProgress > 0.8) {
      return (props.transitionProgress - 0.8) / 0.2;
    }
    return 0;
  }

  return 1;
});

// Dynamic component loading
const dynamicComponent = computed(() => {
  if (!props.page?.content.component) return null;
  return defineAsyncComponent(props.page.content.component);
});

// Position classes
const positionClass = computed(() => {
  const position = props.page?.content.position ?? 'left';
  return `content-position-${position}`;
});

// Static content helpers
const bodyParagraphs = computed(() => {
  const body = props.page?.content.staticContent?.body;
  if (!body) return [];
  return Array.isArray(body) ? body : [body];
});
</script>

<template>
  <div
    v-if="page"
    class="page-content"
    :class="positionClass"
    :style="{ opacity: contentOpacity }"
  >
    <div class="content-card">
      <!-- Dynamic component -->
      <component
        v-if="dynamicComponent"
        :is="dynamicComponent"
        :page="page"
      />

      <!-- Static content fallback -->
      <template v-else-if="page.content.staticContent">
        <!-- Title -->
        <h1
          v-if="page.content.staticContent.title"
          class="content-title"
        >
          {{ page.content.staticContent.title }}
        </h1>

        <!-- Subtitle -->
        <h2
          v-if="page.content.staticContent.subtitle"
          class="content-subtitle"
        >
          {{ page.content.staticContent.subtitle }}
        </h2>

        <!-- Body paragraphs -->
        <div class="content-body">
          <p
            v-for="(paragraph, index) in bodyParagraphs"
            :key="index"
            class="content-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- Call to action -->
        <div
          v-if="page.content.staticContent.ctaText"
          class="content-cta"
        >
          <p class="cta-label">
            Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen?
          </p>
          <a
            :href="page.content.staticContent.ctaHref || '#'"
            class="cta-button"
          >
            {{ page.content.staticContent.ctaText }}
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-content {
  position: fixed;
  top: 80px;
  bottom: 100px;
  z-index: 40;
  display: flex;
  align-items: center;
  padding: 24px;
  pointer-events: none;
  transition: opacity 200ms ease-out;
  will-change: opacity;
}

.content-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
  max-width: 480px;
  max-height: 100%;
  overflow-y: auto;
  pointer-events: auto;
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.content-card::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Position variants */
.content-position-left {
  left: 0;
  justify-content: flex-start;
}

.content-position-right {
  right: 0;
  justify-content: flex-end;
}

.content-position-center {
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
}

.content-position-fullscreen {
  left: 0;
  right: 0;
  justify-content: center;
}

.content-position-fullscreen .content-card {
  max-width: 720px;
  width: 100%;
}

/* Typography */
.content-title {
  font-size: 1.5rem;
  font-weight: 300;
  color: #111827;
  margin: 0 0 16px 0;
  line-height: 1.3;
  -webkit-font-smoothing: antialiased;
}

.content-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #4B5563;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.content-body {
  color: #374151;
}

.content-paragraph {
  font-size: 0.875rem;
  line-height: 1.75;
  margin: 0 0 16px 0;
}

.content-paragraph:last-child {
  margin-bottom: 0;
}

.content-paragraph:first-child {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.75;
}

/* CTA section */
.content-cta {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.cta-label {
  font-size: 0.875rem;
  color: #4B5563;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 20px;
  background: #111827;
  color: #FFFFFF;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 200ms ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  background: #1F2937;
  transform: scale(1.02);
}

.cta-button:active {
  transform: scale(0.98);
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .page-content {
    top: auto;
    bottom: auto;
    left: 0;
    right: 0;
    padding: 12px;
    position: relative;
    pointer-events: auto;
  }

  .content-position-left,
  .content-position-right,
  .content-position-center {
    left: 0;
    right: 0;
    transform: none;
    justify-content: center;
  }

  .content-card {
    max-width: 100%;
    padding: 20px;
  }

  .content-title {
    font-size: 1.25rem;
  }
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .page-content {
    padding: 20px;
  }

  .content-card {
    max-width: 400px;
  }
}

/* Large desktop */
@media (min-width: 1536px) {
  .content-card {
    max-width: 520px;
    padding: 32px;
  }

  .content-title {
    font-size: 1.75rem;
  }
}
</style>
