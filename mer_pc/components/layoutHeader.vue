<!--页面头部-->
<template>
  <div class="relative w-100%" :class="isShowTop && appStore.isHomePage ? 'headerfixed' : ''">
    <!--黑条-->
    <div class="header bg-#F5F5F5">
      <div class="headerCon acea-row row-between-wrapper">
        <div class="flex-y-center text-12px">
          <div class="mr-30px flex-y-center">
            <nuxt-link :to="{ path: '/' }" class="flex-y-center"
              ><span class="iconfont icon-shangchengshouye inline-block"></span>商城首页</nuxt-link
            >
          </div>
          <el-popover
            v-if="pcHomeCon && pcHomeCon.goPhoneQrCodeType"
            :width="auto"
            :minWidth="auto"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
          >
            <template #reference>
              <div class="flex-y-center mobileMall">
                <span class="iconfont icon-shoujishangcheng inline-block"></span> 手机商城
              </div>
            </template>
            <template #default>
              <div class="acea-row">
                <div v-if="pcHomeCon && pcHomeCon.goPhoneQrCodeType.includes('1')">
                  <div :class="pcHomeCon.goPhoneQrCodeType.includes('2') ? 'mr-26px' : ''">
                    <div class="borderSol-eee w-80px h-80px flex-center b-rd-4px mb-10px">
                      <el-image :src="wechatQrcode" class="w-72px h-72px" :preview-src-list="[wechatQrcode]"></el-image>
                    </div>
                    <div class="font-400 text-12px text-#333 w-80px text-center">小程序商城</div>
                  </div>
                </div>
                <div v-if="pcHomeCon && pcHomeCon.goPhoneQrCodeType.includes('2')">
                  <div class="borderSol-eee w-80px h-80px flex-center b-rd-4px mb-10px">
                    <qrcode-vue :value="indexDomain" :size="72" level="H" />
                  </div>
                  <div class="font-400 text-12px text-#333 w-80px text-center">H5商城</div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="user acea-row row-middle">
          <div v-if="!userStore.isLogin" class="item" @click="handlerLogin">登录/注册</div>
          <div v-else class="acea-row row-middle" @click.stop="handlerNuxtLink('/users/user_info', 11)">
            <span class="line1 font-color" style="max-width: 135px"
              >Hi，{{ userStore?.userInfo?.nickname }}</span
            >
            <p class="ml-10px item" @click.stop="handleHeaderLogout">退出</p>
          </div>

          <div class="item" @click="handlerNuxtLink('/users/order_list', 1)">我的订单</div>
          <div class="item" @click="handlerNuxtLink('/users/collect_products', 3)">我的收藏</div>
          <el-dropdown class="user" v-show="globalData.merchantApplySwitch==1">
            <span class="el-dropdown-link text-12px item">
              商户入驻
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="text-12px" @click="handlerNuxtLink('/merchant/merchant_settled', 0)"
                  >商户入驻</el-dropdown-item
                >
                <el-dropdown-item class="text-12px" @click="handlerNuxtLink('/merchant/application_record', 0)"
                  >申请记录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!--菜单/搜索框/菜单-->
    <div class="w-100% bg-white">
      <!--搜索框-->
      <div class="w-100% bg-white">
        <div class="min_wrapper_1200">
          <div class="flex flex-justify-between pt-30px">
            <!--logo-->
            <div class="w-303px">
              <nuxt-link :to="{ path: '/' }"
              ><el-image lazy :src="pcHomeCon?.leftTopLogo" class="max-w-303px h38px"></el-image
              ></nuxt-link>
            </div>
            <!--搜索框商品详情页、商户主页-->
            <div
              v-if="appStore.routePath === '/merchant/merchant_home' || appStore.routePath.includes('product/detail')"
              class="acea-row"
            >
              <div class="w-560px ml-5px">
                <el-input
                  v-model="searchVal"
                  placeholder="搜索全站/本店"
                  class="input-with-select"
                  @keyup.enter="handleEnterKey"
                >
                  <template #append>
                    <div @click="handleEnterKey" class="cursors w-80px h-40px bg-color b-rd-20px text-center lh-40px">
                      <span class="text-#fff text-14px font-400">搜全站</span>
                    </div>
                  </template>
                </el-input>
              </div>
              <div
                @click="handleEnterKeyHome"
                class="cursors w-80px h-40px bg-#333333 b-rd-20px text-center lh-40px ml-10px"
              >
                <span class="text-#fff text-14px font-400">搜本店</span>
              </div>
            </div>
            <!--搜索框-->
            <div v-else class="w-560px ml-5px">
              <el-input
                v-model="searchVal"
                placeholder="搜索商品/店铺"
                class="input-with-select"
                @keyup.enter="handleEnterKey"
              >
                <template #prepend>
                  <el-select v-model="selectVal" placeholder="Select" style="width: 115px">
                    <el-option label="商品" value="1" />
                    <el-option label="店铺" value="2" />
                  </el-select>
                </template>
                <template #append>
                  <div @click="handleEnterKey" class="cursors w-80px h-40px bg-color b-rd-20px text-center lh-40px">
                    <span class="iconfont icon-sousuo text-#fff font-400"></span>
                  </div>
                </template>
              </el-input>
            </div>
            <!--购物车-->
            <div class="flex justify-end" :class="appStore.routePath === '/merchant/merchant_home' || appStore.routePath.includes('product/detail')?'w-242px':'w-303px'">
              <div
                  @click="handlerNuxtLink('/order/shopping_cart', 0)"
                  class="h-40px borderSol b-rd-20px font-color text-14px flex-center mb-26px cursors w-140px mr-5px"
              >
                <span class="iconfont icon-gouwuche mr-10px"></span>购物车({{ appStore.carNumber }})
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--菜单分类-->
      <div v-if="appStore.isShowHeaderMenu" class="w-100% bg-white header-menu">
        <div class="min_wrapper_1200">
          <div @mouseenter="handlerMenuEnter" @mouseleave="handleSubmitLeave">
            <!--菜单分类-->
            <div class="menu flex-y-center">
              <div
                @mouseenter="handlerMenuEnter(0)"
                @click="handleGoPage(item, 0)"
                class="cursor-pointer menu-item fontColor333 text-16px mr-40px font-500 oppoSans-M classification flex" style="flex: none;"
              >
                <span class="iconfont icon-shangpinfenlei mr-8px"></span>商品分类
              </div>
              <template v-if="pcHomeCon && pcHomeCon.homeNavigationList.length">
                <div
                    v-for="(item, index) in pcHomeCon.homeNavigationList"
                    :key="item.id"
                    @click="handleGoPage(item, index)"
                    :class="current === index ? 'font-color' : ''"
                    class="cursor-pointer menu-item fontColor333 text-16px mr-40px font-500 oppoSans-M flex" style="flex: none;"
                >
                  {{ item.name }}
                </div>
              </template>
            </div>
            <!--分类显示 -->
            <div v-if="showMenu" class="absolute w-1200px yop-179px z-11" :class="showSeach ? 'on' : ''">
              <div class="classify z-8">
                <!--分类组件-->
                <classify-card @handleSubmitLeave="handleSubmitLeave"></classify-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { headerMenuListDefault } from '~/components/defaultComponents'
import { ArrowDown } from '@element-plus/icons-vue'
import { b64toBlob, Debounce, linkJump, linkNavigateTo } from '~/utils/util'
import { loginLogout } from '~/server/userApi'
import feedback from '~/utils/feedback'

defineOptions({ name: 'layoutHeader' })
import { useUserStore } from '@/stores/user'
import {onMounted, ref, toRefs, watch} from 'vue'
import { searcKeywordApi } from '~/server/goodsApi'
import { useAppStore } from '~/stores/app'
import QrcodeVue from 'qrcode.vue'
import { indexDomainApi, wechatQrcodeApi } from '~/server/homeApi'
import { auto } from '@popperjs/core'
import {useNuxtApp} from "nuxt/app";
import {ItemObject} from "~/types/global";
const userStore = useUserStore()
const appStore = useAppStore()
const route = useRoute()

//头部信息，首页接口调用
const props = defineProps({
  pcHomeCon: {
    type: Object || String,
    default: null || '',
  },
  globalData: {
    type: Object,
    default: null,
  },
  isShowTop: {
    type: Boolean,
    default: false,
  }
})
const { pcHomeCon,globalData,isShowTop } = toRefs(props)


//移动端域名
const { data: indexDomain } = useAsyncData(() => indexDomainApi())

//移动端域名
const wechatQrcode = ref<string>('')
const getWechatQrcode = async () => {
  // env_version	默认值为："release"，要打开的小程序版本。正式版为"release"，体验版为"trial"，开发版为"develop"，仅在微信外打开时生效。
  let data = await wechatQrcodeApi({
    scene: 'id=0',
    path: 'pages/index/index',
    env_version: 'release',
  })
  let blob = b64toBlob(data.code)
  wechatQrcode.value = URL.createObjectURL(blob)
}
getWechatQrcode()

//搜索
const searchVal = ref<string>('') //搜索框输入值
const selectVal = ref<string>('1') //搜索框选择值
searchVal.value = route.query.searchValue ? route.query.searchValue.toString() : searchVal.value.toString()

onMounted(() => {
  selectVal.value = '1'
})

//搜本店
const handleEnterKeyHome = async () => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: appStore.pcMerId, searchValue: searchVal.value, currentVal: 1 })
}

//搜索跳入页面
const handleEnterKey = async () => {
  if (appStore.routePath === '/merchant/merchant_home' || appStore.routePath.includes('product/detail')) {
    await linkNavigateTo(`/product/product_list`, { searchValue: searchVal.value })
  } else {
    if (selectVal.value === '1') {
      await linkNavigateTo(`/product/product_list`, { searchValue: searchVal.value })
    } else {
      await linkNavigateTo(`/merchant/merchant_list`, { searchValue: searchVal.value })
    }
  }

  showSeach.value = !showSeach.value
  showMenu.value = false
}

//头部菜单
const menuList = ref<ItemObject[]>(headerMenuListDefault())

//动画
const { $aos } = useNuxtApp()
onMounted(() => {
  $aos().init({
    easing: 'ease-out-back',
    duration: 1000,
  })
})

/**
 * 热门搜索词
 */
const showSeach = ref<boolean>(false)
const { data: searcKeywordList } = await useAsyncData(async () => searcKeywordApi())

//清空搜索词
const nuxtApp = useNuxtApp()
if(nuxtApp.onClearSearchVal){
  nuxtApp.provide('onClearSearchVal', () => {
    searchVal.value = ''
    selectVal.value = '1'
  })
}


/**
 * 菜单移入
 */
const checkedIndex = ref<number>(10) //分类鼠标悬浮索引
const showMenu = ref<boolean>(false) //是否展示分类菜单
const handlerMenuEnter = (idx: number | undefined) => {
  checkedIndex.value = idx ? idx : 10
  if ((idx === 0 && !appStore.isHomePage && !isShowTop.value) || (idx === 0 && isShowTop.value && appStore.isHomePage) ) {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
}

//鼠标移出回调
const handleSubmitLeave = () => {
  showMenu.value = false
}

// 跳入页面

//const current = ref<string>(route.query.type?<string>route.query.type:'')
const current = ref<number | null>(null)

const handleGoPage = async (obj: any, idx: number) => {
  current.value = idx
  if (obj && obj.linkUrl) await linkJump(obj.linkUrl)
}

/**
 * 登录
 */
const handlerLogin = async () => {
  if (userStore.isLogin) {
    // await linkNavigateTo('/forum/create')
  } else {
    nuxtApp.$onHandlerLogin()
  }
}

/**
 * 地址跳转
 */
const handlerNuxtLink = async (url: string, type: number) => {
  if (userStore.token) {
    await linkNavigateTo(url, { type: type })
  } else {
    nuxtApp.$onHandlerLogin()
  }
}

//退出登录
//购物车没登录状态下显示0
const { getCarNumber } = useAppStore()
const handleHeaderLogout = Debounce(async () => {
  await feedback.confirm('确定退出吗？')
  await loginLogout()
  await getCarNumber(0)
  await userStore.logout()
  await appStore.getGlobalConfig()
}, 500)
</script>
<style scoped lang="scss">
:deep(.el-dropdown-menu__item) {
  font-size: 12px !important;
}
:deep(.el-dropdown__popper.el-popper),
:deep(.el-popper) {
  font-size: 12px !important;
}
.header-menu {
  border-bottom: 2px solid #e93323;
}
.mobileMall {
  &:hover {
    color: #e93323;
  }
}
.classification {
  width: 200px;
  height: 40px;
  background: #e93323;
  border-radius: 12px 12px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
:deep(.el-input-group) {
  height: 40px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
  border: 1px solid #e93323;
  overflow: hidden;
}
:deep(.el-input__wrapper) {
  padding-left: 20px !important;
}
:deep(.el-input__wrapper),
:deep(.el-input-group__prepend),
:deep(.el-input-group__prepend:hover),
:deep(.el-input-group__append) {
  padding: 0;
  box-shadow: none !important;
  --el-fill-color-light: rgba(255, 255, 255, 0) !important;
}
:deep(.el-input-group__append) {
  padding: 0;
}
:deep(.el-input) {
  --el-input-hover-border-color: none !important;
  --el-input-focus-border-color: none !important;
}
:deep(.el-select) {
  margin: 0 !important;
  width: 74px !important;
  --el-select-input-focus-border-color: none !important;
}
:deep(.el-input-group__prepend:hover) {
  border: none;
}
.headerfixed {
  top: 0;
  z-index: 99;
  position: fixed;
}
.menufixed {
  top: 40px;
  z-index: 99;
  position: fixed;
}
.seachfixed {
  position: fixed;
  top: 124px;
  z-index: 99;
}
.classify {
  border-radius: 0px 0px 26px 26px;
  overflow: hidden;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
}
.search {
  &-ipt {
    outline: none;
    border: 0;
    background: none;
  }

  &-history {
    border-radius: 0px 0px 16px 16px;
  }
}
.header {
  flex: 1;
  width: 100%;
  height: 40px;
  font-size: 12px;
  color: #666666;
  cursor: pointer;

  .headerCon {
    height: 100%;
    position: relative;
    max-width: 1200px;
    margin: 0 auto;

    a {
      color: #666666;

      &:hover {
        color: #e93323;
      }
    }

    .iconfont {
      margin-right: 5px;
    }

    .user {
      .item {
        margin-right: 8px;
        position: relative;
        padding-left: 8px;
        color: #666666;
        &:hover {
          color: #e93323;
        }
      }
    }
  }
}
</style>
