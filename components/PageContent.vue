<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { PageConfig } from '~/types/pages';

interface Props {
  page: PageConfig | undefined;
  isTransitioning: boolean;
  transitionProgress: number;
}

const props = defineProps<Props>();

// Opacity for fade effect
const contentOpacity = computed(() => {
  if (!props.page) return 0;

  if (props.page.content.visibleDuringTransition) {
    return 1;
  }

  // Fade out at start, fade in at end
  if (props.isTransitioning) {
    if (props.transitionProgress < 0.2) {
      return 1 - (props.transitionProgress / 0.2);
    }
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
    class="flex flex-col bg-white transition-opacity duration-200 ease-out antialiased overflow-hidden"
    :style="{ opacity: contentOpacity }"
  >
    <!-- Dynamic component -->
    <component
      v-if="dynamicComponent"
      :is="dynamicComponent"
      :page="page"
      class="p-8 max-md:p-6 md:max-lg:p-7 2xl:p-10"
    />

    <!-- Static content -->
    <template v-else-if="page.content.staticContent">
      <!-- Scrollable content area -->
      <div class="flex-1 overflow-y-auto p-8 max-md:p-6 md:max-lg:p-7 2xl:p-10 pb-0 max-md:pb-0 md:max-lg:pb-0 2xl:pb-0">
        <h1
          v-if="page.content.staticContent.title"
          class="text-[1.625rem] max-md:text-[1.375rem] 2xl:text-[1.875rem] font-medium text-gray-900 mb-6 leading-tight tracking-tight"
        >
          {{ page.content.staticContent.title }}
        </h1>

        <h2
          v-if="page.content.staticContent.subtitle"
          class="text-[0.9375rem] font-medium text-gray-500 mb-4 leading-relaxed uppercase tracking-widest"
        >
          {{ page.content.staticContent.subtitle }}
        </h2>

        <div class="text-gray-700">
          <p
            v-for="(paragraph, index) in bodyParagraphs"
            :key="index"
            class="leading-7 mb-5 last:mb-0"
            :class="index === 0 ? 'text-base font-normal text-gray-800' : 'text-sm'"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Fixed CTA section at bottom -->
      <div v-if="page.content.staticContent.ctaText" class="shrink-0 px-8 max-md:px-6 md:max-lg:px-7 2xl:px-10 pb-8 max-md:pb-6 md:max-lg:pb-7 2xl:pb-10 pt-6 border-t border-gray-200 bg-white">
        <p class="text-[0.8125rem] text-gray-600 mb-4 leading-relaxed">
          Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen?
        </p>
        <a
          :href="page.content.staticContent.ctaHref || '#'"
          class="flex items-center justify-center w-full py-3.5 px-5 bg-gray-900 text-white rounded-lg text-sm font-medium no-underline transition-all duration-200 ease-out hover:bg-gray-800 active:scale-98"
        >
          {{ page.content.staticContent.ctaText }}
        </a>
      </div>
    </template>
  </div>
</template>
