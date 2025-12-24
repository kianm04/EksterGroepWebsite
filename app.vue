<script setup lang="ts">
// Clean app.vue - no loading screen logic needed
</script>

<template>
  <div>
    <!-- Main app content -->
    <NuxtPage />
  </div>
</template>

<style>
/* Global styles - hide all scrollbars */
html,
body {
  overflow: hidden;
  margin: 0;
  padding: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
}

/* Prevent any overflow artifacts and reset borders */
* {
  box-sizing: border-box;
}

/* Reset layout divs to prevent Tailwind preflight border issues */
#__nuxt > div,
#__nuxt > div > div {
  border: 0 !important;
  outline: 0 !important;
}
</style>