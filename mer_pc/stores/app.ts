import { defineStore, createPinia } from 'pinia'
import { ProductInfo } from '~/types/order'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { ApplicationDataQuery } from '~/types/merchant'
import { globalConfigApi } from '~/server/userApi'
import { GlobalDatas } from '~/types/user'

const pinia = createPinia()

interface AppSate {
  stateEvaluationInfo: ProductInfo | null
  stateApplicationData: ApplicationDataQuery | null
  stateCarNumber: number
  stateisShowHeaderMenu: boolean
  stateFooterIsIntersecting: boolean
  stateIsHomePage: boolean
  stateRoutePath: string
  stateMerId: number
  stateExpressAll: any
  stateGlobalData: GlobalDatas
  stateWechatRoutePath: string
}
export const useAppStore = defineStore({
  id: 'appStore',
  state: (): AppSate => ({
    stateEvaluationInfo: null, //评价商品信息
    stateApplicationData: null, //商户入驻申请数据
    stateCarNumber: 0, //购物车数量
    stateisShowHeaderMenu: true, //是否展示头部导航
    stateFooterIsIntersecting: true, //底部导航是否出现在可视区域内
    stateIsHomePage: false, //是否是首页
    stateRoutePath: '', //路由地址
    stateMerId: 0, //商户id
    stateExpressAll: [], //全部物流公司
    stateGlobalData: {
      changeColorConfig: '',
      copyrightCompanyImage: '',
      frontDomain: '',
      imageDomain: '',
      paidMemberPriceDisplay: '',
      userIsPaidMember: false,
      siteName: '',
    }, //全局配置
    stateWechatRoutePath: '', //微信授权登录或者当前未登录地址
  }),
  persist: process.client && {
    // 仅在客户端使用
    storage: localStorage, // localStorage 本地存储，可替换sessionStorage
  },
  getters: {
    evaluationInfo: (state) => state.stateEvaluationInfo,
    applicationData: (state) => state.stateApplicationData,
    carNumber: (state) => state.stateCarNumber,
    isShowHeaderMenu: (state) => state.stateisShowHeaderMenu,
    footerIsIntersecting: (state) => state.stateFooterIsIntersecting,
    isHomePage: (state) => state.stateIsHomePage,
    routePath: (state) => state.stateRoutePath,
    pcMerId: (state) => state.stateMerId,
    expressAll: (state) => state.stateExpressAll,
    globalData: (state) => state.stateGlobalData,
    wechatRoutePath: (state) => state.stateWechatRoutePath,
  },
  actions: {
    //评价商品信息
    getEvaluationInfo(info: ProductInfo) {
      this.stateEvaluationInfo = info
    },
    //商户入驻申请数据
    getApplicationData(info: ApplicationDataQuery) {
      this.stateApplicationData = info
    },
    //购物车数量
    getCarNumber(num: number) {
      this.stateCarNumber = num
    },
    //头部是否展示菜单
    getIsShowHeaderMenu(bool: boolean) {
      this.stateisShowHeaderMenu = bool
    },
    // 底部导航是否出现在可视区域内
    getFooterIsIntersecting(bool: boolean) {
      this.stateFooterIsIntersecting = bool
    },
    //是否是首页
    setIsHomePage(bool: boolean) {
      this.stateIsHomePage = bool
    },
    //获取路由地址
    getRoutePath(path: string) {
      this.stateRoutePath = path
    },
    // 商户id
    getMerId(merId: number) {
      this.stateMerId = merId
    },
    getExpressList(express: any) {
      this.stateExpressAll = express
    },
    //获取全局配置
    async getGlobalConfig() {
      this.stateGlobalData = await globalConfigApi()
    },
    //获取路由地址
    getWechatRoutePath(path: string) {
      this.stateWechatRoutePath = path
    },
  },
})
// 添加持久化插件到Pinia中
pinia.use(createPersistedState())

export default pinia
