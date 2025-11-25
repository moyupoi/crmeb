<script setup lang="ts">
import { articleHotListApi, pcHomeBannerApi, pcHomeConfigApi } from '~/server/homeApi'
import { useUserStore } from '~/stores/user'
import { linkNavigateTo } from '~/utils/util'
import useOrder from '~/composables/useOrder'
import { useAppStore } from '~/stores/app'
import {reactive, ref, shallowRef} from 'vue'
import { GlobalDatas } from '~/types/user'
import {useNuxtApp} from "nuxt/app";
const userStore = useUserStore()
const { handleIntoPage } = useOrder()

//获取全局配置数据
const appStore = useAppStore()
const globalData = computed(() => reactive<GlobalDatas>(<GlobalDatas>appStore?.globalData))

//首页banner数据
const { data: bannerList } = await useAsyncData(async () => pcHomeBannerApi(), {
  default: () => [],
})

//资讯热门列表
const { data: articleList } = await useAsyncData(async () => articleHotListApi(), {
  default: () => [],
})

const menuList = ref<Array<string>>([
  {
    name: '宝贝收藏',
    icon: 'icon-baobeishoucang',
    url: '/users/collect_products',
    id: '3',
  },
  // {
  //   name: '关注店铺',
  //   icon: 'icon-guanzhudianpu',
  //   url: '/users/collect_merchant',
  //   id: '4',
  // },
  {
    name: '我的足迹',
    icon: 'icon-zuji',
    url: '/users/browsing_history',
    id: '8',
  },
])

/**
 * 登录
 */
const nuxtApp = useNuxtApp()
const userLoginRef = shallowRef()
const handlerLogin = async () => {
  if (!userStore.isLogin) {
    await nuxtApp.$onHandlerLogin()
  }
}

const handlerNuxtLink = async (url: string, type: number) => {
  if (!userStore.isLogin) {
    await nuxtApp.$onHandlerLogin()
  } else {
    await linkNavigateTo(url, { type: type })
  }
}
</script>

<template>
  <div class="bannerIndex h-410px bg-#FFFFFF w-100% mb-30px">
    <div class="min_wrapper_1200 acea-row">
      <!--分类组件-->
      <classify-card></classify-card>
      <!--轮播-->
      <div class="w-730px h-360px mt-20px ml-220px 70ba6a">
        <el-carousel :interval="5000" height="360px" arrow="always">
          <el-carousel-item v-for="item in bannerList" :key="item" class="w-730px h-360px el-image">
            <a v-if="item.linkUrl" :href="item.linkUrl" target="_blank">
              <el-image :src="item.imageUrl" class="w-730px h-360px el-image b-rd-12px" fit="fill" />
            </a>
            <el-image v-else :src="item.imageUrl" class="w-730px h-360px el-image b-rd-12px" fit="fill" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--登录-->
      <div class="ml-30px w-220px mt-20px">
        <div class="flex-col-center relative">
          <img
            v-if="!userStore.isLogin"
            @click="handlerLogin"
            class="cursors w-60px h-60px b-rd-50% mb-10px 3cfea756"
            src="@/assets/images/morentou.png"
          />
          <div v-else>
            <img
              :src="userStore.userInfo.avatar"
              @click="linkNavigateTo('/users/user_info', { type: 11 })"
              class="w-60px h-60px b-rd-50% mb-10px cursors"
            />
            <img
              v-show="globalData.userIsPaidMember"
              :src="`${globalData.imageDomain}/crmebimage/presets/viptu.png`"
              class="w-20px h-20px absolute top-40px right-77px"
            />
          </div>
          <div
            v-if="!userStore.isLogin"
            @click="handlerLogin"
            class="cursors mb-20px line1 w-218px text-center text-#666 text-16px"
          >
            Hi~<span class="text-#333">你好</span>
          </div>
          <div v-else class="mb-20px line1 w-218px text-center text-#666 text-16px cursors">
            Hi~<span class="text-#333" @click="linkNavigateTo('/users/user_info', { type: 11 })">{{
              userStore.userInfo.nickname
            }}</span>
          </div>
          <div class="flex-x-center mb-20px">
            <div
              v-if="!userStore.isLogin"
              class="handleBtn w-105px h-32px lh-31px mr-10px cursors"
              @click="handlerLogin"
            >
              登录/注册
            </div>
            <div
              class="handleBtnBorder borderSolE9 w-105px h-32px lh-31px font-color cursors 48bfb4a"
              @click="handlerNuxtLink('/merchant/merchant_settled', 0)"
            >
              商户入驻
            </div>
          </div>
          <div class="flex flex-start w-200px">
            <div
              v-for="(item, index) in menuList"
              :key="index"
              class="flex-col-center cursors"
              @click="handlerNuxtLink(item.url, item.id)"
              style="margin-right: 20px;"
            >
              <div class="iconfont font-color mb-8px" :class="item.icon" style="font-size: 18px;"></div>
              <div class="text-12px text-#333">{{ item.name }}</div>
            </div>
          </div>
          <el-divider border-style="dashed" />
        </div>

        <div v-if="articleList && articleList.length">
          <div
            @click="handleIntoPage('/activity/information_info', { informationId: item.id })"
            v-for="item in articleList.length === 2 ? articleList : articleList.slice(0, 3)"
            class="acea-row items-center cursors mb-12px af90db"
          >
            <div class="text-12px font-color bg-#FDEAE9 px-4px py-3px b-rd-2px mr-6px line-heightOne">资讯</div>
            <div class="text-14px text-#666 line1 w-180px fontFamilyOPPOSans">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bannerIndex {
  :deep(.el-carousel__indicators) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.el-carousel__container) {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
  }
}
</style>
