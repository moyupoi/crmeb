<script setup lang="ts">

import {auto} from "@popperjs/core";
</script>

<template>
<div>
  <!--黑条-->
  <div class="header bg-#F5F5F5" :class="showSeach ? 'headerfixed' : ''">
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
              <span class="iconfont icon-shoujishangcheng inline-block"></span>手机商城
            </div>
          </template>
          <template #default>
            <div class="acea-row">
              <div v-if="pcHomeCon.goPhoneQrCodeType.includes('1')">
                <div :class="pcHomeCon.goPhoneQrCodeType.includes('2')?'mr-26px':''">
                  <div class="borderSol-eee w-80px h-80px flex-center b-rd-4px mb-10px">
                    <el-image :src="wechatQrcode" class="w-72px h-72px"></el-image>
                  </div>
                  <div class="font-400 text-12px text-#333 w-80px text-center">小程序商城</div>
                </div>
              </div>
              <div v-if="pcHomeCon.goPhoneQrCodeType.includes('2')">
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
          <span class="line1 font-color" style="max-width: 135px">Hi，{{ userStore.userInfo.nickName }}</span>
          <p class="ml-10px item" @click.stop="handleHeaderLogout">退出</p>
        </div>

        <div class="item" @click="handlerNuxtLink('/users/order_list', 1)">我的订单</div>
        <div class="item" @click="handlerNuxtLink('/users/collect_products', 3)">我的收藏</div>
        <el-dropdown class="user">
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
</div>
</template>

<style scoped lang="scss">

</style>