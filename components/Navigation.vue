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
    class="fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-700 bg-white border-b border-gray-200"
    :class="
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    "
    style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-3 items-center py-2">
      <!-- Logo section -->
      <div class="flex items-center justify-start">
        <div class="flex items-center space-x-4">
          <img
            src="/images/loading-pagina-logo.png"
            alt="Ekster Logo"
            class="h-16 w-16 lg:h-20 lg:w-20 object-contain"
          />
        </div>
      </div>

      <!-- Center space (empty but maintains grid balance) -->
      <div></div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-end gap-2">
        <a
          v-for="(button, index) in buttons"
          :key="button.id"
          :href="button.href"
          class="relative px-5 py-2.5 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 ease-out cursor-pointer select-none group bg-white border border-gray-200 hover:border-gray-300"
          :style="`animation-delay: ${index * 100}ms;`"
          :class="[
            'text-gray-700 hover:text-gray-900',
            'hover:scale-102 active:scale-98',
            'hover:shadow-lg',
            isVisible ? 'animate-slide-in' : 'opacity-0',
          ]"
          style="
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease-out;
          "
        >
          <!-- Button text -->
          <span class="relative z-10 font-sans">{{ button.label }}</span>

          <!-- Focus ring for accessibility -->
          <div
            class="absolute inset-0 rounded-lg ring-2 ring-gray-400/0 group-focus-visible:ring-gray-400/50 transition-all duration-200"
          ></div>
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Clean navigation styling */
nav {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* GPU acceleration for smooth animations */
a {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* Custom focus styles for better accessibility */
a:focus-visible {
  outline: none;
}

/* Active state enhancement */
a:active {
  transform: scale(0.98) translateZ(0);
}
</style>
