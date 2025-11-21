<template>
  <!-- 路由出口 -->
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { GlobalDatas } from '~/types/user'
const appStore = useAppStore()
const globalData = computed(() => reactive<GlobalDatas>(<GlobalDatas>appStore?.globalData))
useSeoMeta({
  title: `PC商城-Java商城`,
  ogTitle: `PC商城-Java商城`,
  ogDescription:
    'Java商城，PC商城，CRMEB开源商城系统，新零售社交电商，小程序商城，公众号商城，免费商城系统源码，商城系统开发，开源商城系统，微商城源码，直播商城系统，多商户商城，B2B2C，私域电商，分销商城，高性能商城系统，陀螺匠OA系统',
  description:
    'Java商城，PC商城，CRMEB开源商城系统，新零售社交电商，小程序商城，公众号商城，免费商城系统源码，商城系统开发，开源商城系统，微商城源码，直播商城系统，多商户商城，B2B2C，私域电商，分销商城，高性能商城系统，陀螺匠OA系统',
})
useHead({
  titleTemplate: `%s`,
  meta: [
    {
      name: 'description',
      content:
        'Java商城，PC商城，CRMEB开源商城系统，新零售社交电商，小程序商城，公众号商城，免费商城系统源码，商城系统开发，开源商城系统，微商城源码，直播商城系统，多商户商城，B2B2C，私域电商，分销商城，高性能商城系统，陀螺匠OA系统',
    },
    {
      name: 'keywords',
      content:
        'CRMEB开源商城系统，围绕新零售、品牌连锁、商家入驻等多种商业模式，自主研发B2C商城系统、B2B2C多商户商城系统、连锁多门店商城系统、跨境电商系统等；应用于直播电商、社交新零售、商家入驻等多种应用场景，系统支持多语言、多端登录，代码开源、独立部署、永久免费升级。',
    },
  ],
  bodyAttrs: {
    class: 'test',
  },
})
</script>
