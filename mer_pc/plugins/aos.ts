import AOS from 'aos'
export default defineNuxtPlugin(() => {
  return {
    provide: {
      aos: () => AOS,
    },
  }
})
