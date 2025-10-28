<script setup lang="ts">
import { ref, onMounted } from 'vue'

const buttons = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]

const isVisible = ref(false)

onMounted(() => {
  // Trigger entrance animation after mount
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-opacity duration-700"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="max-w-7xl mx-auto flex justify-center">
      <!-- Glassmorphic container -->
      <div
        class="relative inline-flex items-center gap-2 px-3 py-3 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl"
        style="box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.18) inset;"
      >
        <!-- Subtle gradient overlay -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>

        <!-- Navigation buttons -->
        <a
          v-for="(button, index) in buttons"
          :key="button.id"
          :href="button.href"
          class="relative px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ease-out cursor-pointer select-none group overflow-hidden"
          :style="`animation-delay: ${index * 100}ms;`"
          :class="[
            'text-gray-800/80 hover:text-gray-900',
            'hover:scale-105 active:scale-98',
            isVisible ? 'animate-slide-in' : 'opacity-0'
          ]"
        >
          <!-- Button background layers -->
          <div class="absolute inset-0 bg-white/0 group-hover:bg-white/60 transition-all duration-300 rounded-full"></div>

          <!-- Glow effect on hover -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-sm bg-gradient-to-r from-cyan-light/40 via-white/40 to-cyan-dark/40"></div>

          <!-- Shimmer effect -->
          <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <!-- Button text -->
          <span class="relative z-10 font-sans">{{ button.label }}</span>

          <!-- Focus ring for accessibility -->
          <div class="absolute inset-0 rounded-full ring-2 ring-cyan-dark/0 group-focus-visible:ring-cyan-dark/50 transition-all duration-200"></div>
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Enhance the glassmorphic effect with CSS */
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

/* Subtle text shadow for better readability on light backgrounds */
a span {
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* Active state enhancement */
a:active {
  transform: scale(0.98) translateZ(0);
}
</style>
