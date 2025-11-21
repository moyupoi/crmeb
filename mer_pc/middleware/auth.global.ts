import { useAppStore } from '~/stores/app'
import { useUserStore } from '~/stores/user'
import { linkNavigateTo } from '~/utils/util'
import {TOKEN_KEY} from "~/enums/cacheEnums";

interface MyObject {
  myFunction: () => void
}

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const { getIsShowHeaderMenu, setIsHomePage, getRoutePath } = useAppStore()
  const nuxtApp = useNuxtApp()

  //是否是商品详情页 或者是店铺详情页
  getRoutePath(to.path)

  if (to.path.includes('product/detail')) {
    if (checkIfFunctionExists(nuxtApp, '$onShowCoupon')) {
      // nuxtApp.$onShowCoupon(to.path)
    }
  }

  // 路由发生了变化,清空搜索词
  if (to.path !== from.path && to.path !== '/merchant/merchant_list' && to.path !== '/product/product_list') {
    if (checkIfFunctionExists(nuxtApp, '$onClearSearchVal')) {
      nuxtApp.$onClearSearchVal()
    }
  }

  //是否是首页
  if (to.path === '/') {
    setIsHomePage(true)
  } else {
    setIsHomePage(false)
  }

  //是否展示头部导航
  if (to.path === '/merchant/merchant_home') {
    getIsShowHeaderMenu(false)
  } else {
    getIsShowHeaderMenu(true)
  }

  //别的页面打开，关闭商品详情页优惠券弹窗
  if (!to.path.includes('product/detail')) {
    if (checkIfFunctionExists(nuxtApp, '$onHandlerCloseCoupon')) {
      nuxtApp.$onHandlerCloseCoupon()
    }
  }
})
// 判断对象是否存在某个函数
function checkIfFunctionExists(obj: unknown, functionName: string): obj is { [key: string]: (...args: any[]) => any } {
  return typeof (obj as { [key: string]: unknown })[functionName] === 'function'
}
