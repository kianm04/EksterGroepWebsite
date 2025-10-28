// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss','@tresjs/nuxt'],

  // For 3D-heavy routes, render on client only; prerender everything else for speed/SEO
  routeRules: {
    '/': { prerender: true },
    '/services/**': { prerender: true },
    '/case-studies/**': { prerender: true },
    '/models/**': { ssr: false },
    '/viewer/**': { ssr: false }   // hybrid rendering: disable SSR only here
  },

  nitro: {
    preset: 'node-server',
  },

  // Vite can serve files from /public; our decoders live there
  devtools: { enabled: true },
})
