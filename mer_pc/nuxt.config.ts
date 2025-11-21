import { getEnvConfig } from './nuxt/env'
import { loadEnv } from 'vite'
const envScript = (process.env as any).npm_lifecycle_script.split(' ')
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境

const envConfig = getEnvConfig()
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    baseURL: envConfig.baseUrl,
    head: {
      title: '加载中...',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Java商城，PC商城，CRMEB开源商城系统，新零售社交电商，小程序商城，公众号商城，免费商城系统源码，商城系统开发，开源商城系统，微商城源码，直播商城系统，多商户商城，B2B2C，私域电商，分销商城，高性能商城系统，陀螺匠OA系统',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // { rel: 'stylesheet', type: 'text/css', href: '/fonts/iconfont.css' },
        { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/c/font_4138656_3e69hlfaevj.css' },
        { rel: '', type: 'text/css', href: '//at.alicdn.com/t/c/font_4138656_3e69hlfaevj.css' },
      ],
    },
  },
  ssr: false,
  // 开发服务器，
  devServer: {
    port: '192.168.31.185', //监听端口，默认3000，可以配置自己的ip地址
    host: '0.0.0.0', //默认值：localhost
  },
  css: ['~/assets/fonts/font.css', '~/assets/scss/index.scss', '~/assets/iconfont/iconfont.css', 'aos/dist/aos.css'],
  typescript: {
    strict: true,
    shim: false,
  },
  runtimeConfig: {
    public: {
      ...envConfig,
    },
  },
  // build modules
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/color-mode',
    '@fullpage/nuxt-fullpage',
    // 'nuxt-swiper',
  ],
  swiper: {
    // Swiper options
    //----------------------
    // prefix: 'Swiper',
    // styleLang: 'css',
    // modules: ['navigation', 'pagination'], // all modules are imported by default
  },
  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // colorMode
  colorMode: {
    classSuffix: '',
  },
  plugins: [{ src: '~/plugins/fetch' }, { src: '~/plugins/vue-swiper', ssr: false }],
  unocss: {
    uno: true,
    attributify: true,
    icons: {
      scale: 1.2,
    },
  },
  vite: {
    envDir: '~/env', // 指定env文件夹
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
        },
      },
    },
  },
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },
})
