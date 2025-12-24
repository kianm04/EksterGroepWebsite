<script setup lang="ts">
import { ref, onMounted } from "vue";

const buttons = [
  { id: "home", label: "Home", href: "#home" },
  { id: "gallery", label: "Gallery", href: "#gallery" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// Navigation is always visible (no loading screen anymore)
const isVisible = ref(true);

// Add entrance animation on mount
onMounted(() => {
  // Small delay for smooth entrance
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <nav
    v-show="isVisible"
    class="flex-shrink-0 z-50 px-4 sm:px-6 py-1.5 sm:py-3 bg-white border-b border-gray-200 shadow-md antialiased transition-opacity duration-300 ease-out"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-3 items-center py-1 sm:py-2">
      <!-- Logo section -->
      <div class="flex items-center justify-start">
        <div class="flex items-center space-x-4">
          <img
            src="/images/loading-pagina-logo.png"
            alt="Ekster Logo"
            class="h-10 w-10 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
          />
        </div>
      </div>

      <!-- Center space (empty but maintains grid balance) -->
      <div></div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-end gap-1.5 sm:gap-2">
        <a
          v-for="(button, index) in buttons"
          :key="button.id"
          :href="button.href"
          class="relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 ease-out cursor-pointer select-none group bg-white border border-gray-200 shadow-sm text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:scale-102 hover:shadow-lg active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          :style="`animation-delay: ${index * 100}ms;`"
          :class="isVisible ? 'animate-slide-in' : 'opacity-0'"
        >
          <!-- Button text -->
          <span class="relative z-10 font-sans">{{ button.label }}</span>
        </a>
      </div>
    </div>
  </nav>
</template>
