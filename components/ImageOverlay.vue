<script setup lang="ts">
interface Props {
  imageSrc: string
  alt?: string
  position?: 'top' | 'bottom' | 'center'
  size?: 'small' | 'medium' | 'large' | 'full'
  showGlassmorphism?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Overlay image',
  position: 'bottom',
  size: 'medium',
  showGlassmorphism: true
})

// Position classes based on prop
const positionClasses = {
  top: 'top-8',
  bottom: 'bottom-8',
  center: 'top-1/2 -translate-y-1/2'
}

// Size classes based on prop
const sizeClasses = {
  small: 'max-w-xs',
  medium: 'max-w-md',
  large: 'max-w-2xl',
  full: 'max-w-full'
}
</script>

<template>
  <div
    class="fixed left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-slide-in"
    :class="positionClasses[position]"
  >
    <!-- Glassmorphic container -->
    <div
      v-if="showGlassmorphism"
      class="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
      :class="sizeClasses[size]"
    >
      <!-- Glass background -->
      <div class="absolute inset-0 backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl"></div>

      <!-- Glow effect on hover -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl glow-effect"></div>

      <!-- Image -->
      <div class="relative p-4">
        <img
          :src="imageSrc"
          :alt="alt"
          class="w-full h-auto rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Simple image without glassmorphism -->
    <div
      v-else
      class="relative transition-all duration-500 hover:scale-105"
      :class="sizeClasses[size]"
    >
      <img
        :src="imageSrc"
        :alt="alt"
        class="w-full h-auto rounded-lg shadow-2xl"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped>
.glow-effect {
  box-shadow: 0 0 30px rgba(130, 219, 197, 0.5);
}
</style>
