// plugins/model-viewer.client.ts
import { defineNuxtPlugin } from '#app'

// Define the <model-viewer> custom element for the browser
export default defineNuxtPlugin(() => {
  // Importing inside plugin ensures SSR safety
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('@google/model-viewer')
})
