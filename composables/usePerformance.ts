import { ref, onMounted, onUnmounted } from 'vue'

export function usePerformance() {
  const fps = ref(0)
  const memory = ref({ used: 0, limit: 0 })
  const frameTime = ref(0)

  let lastTime = performance.now()
  let frames = 0
  let interval: NodeJS.Timer | null = null
  let rafId: number | null = null

  const startMonitoring = () => {
    // FPS calculation
    interval = setInterval(() => {
      fps.value = Math.round(frames)
      frames = 0

      // Memory usage (if available)
      if ((performance as any).memory) {
        const memInfo = (performance as any).memory
        memory.value = {
          used: Math.round(memInfo.usedJSHeapSize / 1048576), // Convert to MB
          limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) // Convert to MB
        }
      }
    }, 1000)

    // Frame time tracking using requestAnimationFrame
    const updateFrame = () => {
      frames++
      const currentTime = performance.now()
      frameTime.value = currentTime - lastTime
      lastTime = currentTime
      rafId = requestAnimationFrame(updateFrame)
    }
    rafId = requestAnimationFrame(updateFrame)
  }

  const stopMonitoring = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    fps,
    memory,
    frameTime
  }
}