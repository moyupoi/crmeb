<template>
  <div class="w-100% h100vh relative" @click.stop="handleClick">
    <!-- 头部广告 -->
    <LayoutAdvertisement
      :pc-home-con="pcHomeCon"
      v-if="
        pcHomeCon &&
        pcHomeCon.advertisement &&
        pcHomeCon.advertisement.imageUrl &&
        !pcHomeCon.advertisement.status &&
        useStore.isHomePage &&
        appStore.stateRoutePath!=='/authorizedLogin'
      "
    ></LayoutAdvertisement>
    <!-- 共享的头部内容 -->
    <LayoutHeader :pc-home-con="pcHomeCon" :isShowTop="isShowTop" :globalData="globalData" v-if="appStore.stateRoutePath!=='/authorizedLogin'"></LayoutHeader>
    <main class="main_Box relative">
      <!-- 页面内容 -->
      <div class="h-100%">
        <!-- 内容区域 -->
        <div v-loading="loading">
          <div :class="isShowTop && appStore.isHomePage ? 'h-178px' : ''"></div>
          <slot></slot>
        </div>

        <!-- 右侧黑条-->
        <right-navigation :isShowCoupon="isShowCoupon" :productId="productId"></right-navigation>
      </div>
    </main>
    <!-- 共享的底部内容 -->
    <LayoutFooter :pc-home-con="pcHomeCon" v-if="appStore.stateRoutePath!=='/authorizedLogin'"></LayoutFooter>
    <!-- 登录弹窗 -->
    <UserLogin ref="userLoginRef" @onLoginSucceeded="onLoginSucceeded" @openBindPhone="openBindPhone" @getwxScanSwitch="getwxScanSwitch"></UserLogin>
    <!-- 新人礼 -->
    <newcomer-gift
      :couponModal="couponModal"
      :newPeopleCouponList="newPeopleCouponList"
      @onCloseSucceeded="onCloseSucceeded"
    ></newcomer-gift>
    <!-- 绑定手机号 -->
    <el-dialog
        class="user-login-dialog"
        v-model="dialogVisible"
        :align-center="true"
        :width="420"
        :append-to-body="true"
        :show-close="false"
    >
      <bind-phone @onCloseBindPhone="onCloseBindPhone" :authKey="authKey" :wxScanSwitch="wxScanSwitch" @onLoginSucceededBindPhone="onLoginSucceeded"></bind-phone>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
//全局配置
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
  title: `${globalData.value.siteName}` || 'PC商城',
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

import { ItemObject } from '~/types/global'
import useDialog from '~/composables/useDialog'
import { pcHomeConfigApi } from '~/server/homeApi'
import { useUserStore } from '~/stores/user'
import { shallowRef, ref, onMounted, watch, reactive, computed } from 'vue'

import { tokenIsExistApi, wechatPcApi } from '~/server/userApi'
import { useNuxtApp } from 'nuxt/app'
import {linkNavigateTo} from "~/utils/util";
const userLoginRef = shallowRef()
const userStore = useUserStore()
const useStore = useAppStore()
const loading = ref<boolean>(false)
const route = useRoute()
watch(route, (to) => {}, { flush: 'pre', immediate: true, deep: true })
//没登录，清除缓存
if (process.client) {
  if (!userStore.isLogin) window.localStorage.clear()
}

//首页配置
const { data: pcHomeCon } = useAsyncData(() => pcHomeConfigApi())

// 微信授权登录传回来的code值
const wxCode = ref<string>(<string>route.query.code) //满足条件

// 获取微信扫码登录配置
const wxScanSwitch = ref<number>(0) //满足条件
const getwxScanSwitch = (val) =>{
  wxScanSwitch.value = val //微信扫码开关:0-关闭微信扫码，1-微信网页应用扫码，2-微信公众号扫码
}

//动画
const { $aos } = useNuxtApp()
onMounted(() => {
  $aos().init({
    easing: 'ease-out-back',
    duration: 3000,
  })
  getTokenIsExist()
  //wechatPc()
  if(wxCode.value) wechatPc()
  useStore.getGlobalConfig()
})

// 微信PC授权登录（网页应用）
const wechatPc = async () =>{
  const data = await wechatPcApi({code:wxCode.value})
  //未注册的时候调起绑定手机号去绑定手机号
  if (data.type === 'register') {
    linkNavigateTo(appStore.stateWechatRoutePath)
    openBindPhone(data)
  }
  if (data.type === 'login') {
    userStore.login(data.token)
    userStore.setUserInfo(data)
    await appStore.getGlobalConfig()
    linkNavigateTo(appStore.stateWechatRoutePath)
    onLoginSucceeded(data) //登录成功后操作
  }
}

/**
 * 监听页面滚动
 */
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
const isShowTop = ref<boolean>(false)
const handleScroll = () => {
  if (process.client) {
    const t = document.documentElement.scrollTop || document.body.scrollTop
    if (t > 100) {
      isShowTop.value = true
    } else {
      isShowTop.value = false
    }
  }
}

//购物车没登录状态下显示0
const { getCarNumber } = useAppStore()
const getTokenIsExist = async () => {
  let data = await tokenIsExistApi()
  if (!data) await getCarNumber(0)
}

//登录弹窗
const nuxtApp = useNuxtApp()
nuxtApp.provide('onHandlerLogin', () => {
  userLoginRef.value.open()
})

//登录成功后回调
const couponModal = ref<boolean>(false) //新人礼弹窗
const newPeopleCouponList = ref<any>([])
const onLoginSucceeded = (userInfo: ItemObject) => {
  newPeopleCouponList.value = userInfo.newPeopleCouponList
  if (newPeopleCouponList.value?.length) couponModal.value = Boolean(userInfo.isNew)
  onCloseBindPhone()
}

// 绑定手机号弹窗
const dialogVisible = ref(false)
const authKey = ref<string>('')
const openBindPhone = (data: any) => {
  dialogVisible.value = true
  authKey.value = data.key
}
const onCloseBindPhone = () => {
  dialogVisible.value = false
}

//优惠券弹窗
const productId = ref<number>(0) //商品id
const { bool: isShowCoupon, DialogOpen, DialogClose } = useDialog()
//获取商品id
nuxtApp.provide('onGetProductId', (No: number) => {
  productId.value = No
})

nuxtApp.provide('onHandlerCoupon', () => {
  DialogOpen()
})
nuxtApp.provide('onHandlerCloseCoupon', () => {
  DialogClose()
})

//点击屏幕关掉优惠券弹窗
const handleClick = () => {
  DialogClose()
}
//新人礼弹窗
const onCloseSucceeded = () => {
  couponModal.value = false
}
</script>
<style scoped lang="scss">
.main_Box {
}
.floatClass:hover .floatTitle {
  display: block !important;
  animation: slideRight 0.5s forwards; /* 调用名为slideRight的动画，持续2秒 */
}
@keyframes slideRight {
  from {
    left: -150px; /* 元素初始位置在左侧屏幕外 */
  }
  to {
    left: -122px; /* 元素最终位置靠左边缘 */
  }
}
.floatClass:hover {
  width: 100%;
  background: #e93323;
}
.floatTitle {
  height: 40px;
  background: #222222;
  padding: 0 27px;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  left: -122px;
  border-radius: 3px;
  display: none;
}
.floatTitle::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -16px;
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent transparent #222222; /* 右边三角形的颜色 */
  transform: translateY(-50%);
}
</style>
