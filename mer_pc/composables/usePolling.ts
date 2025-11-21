import { ref } from 'vue'

export const usePolling = () => {
  const timer = ref<number | null>(null)

  const startPolling = (callback: () => Promise<void>, interval: number = 3000) => {
    // Clear any existing timer
    if (timer.value) {
      clearInterval(timer.value)
    }

    // Start new polling
    timer.value = window.setInterval(async () => {
      try {
        await callback()
      } catch (error) {
        console.error('Polling error:', error)
        stopPolling()
      }
    }, interval)
  }

  const stopPolling = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  return {
    startPolling,
    stopPolling
  }
} 