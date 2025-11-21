<!--未登录页面展示-->
<script setup lang="ts">
//调用layouts的方法
import {useNuxtApp} from "nuxt/app";
import {ref} from "vue";
import useScrollHeight from "~/composables/useScrollHeight";

const nuxtApp = useNuxtApp()
//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 215)
</script>

<template>
  <!--未登录页面-->
  <div>
    <ClientOnly>
      <div class="error-page w-1000px h-100% flex ml-20px" :style="{ height: ScrollHeight + 'px' }">
        <div class="m-auto">
          <img src="@/assets/images/cuowu.png">
          <div class="text-#333 text-24px mt-35px text-center mb-26px">请登录查看</div>
          <div class="handleBtnBorder w-100px h-40px text-14px lh-40px m-auto cursors" @click="nuxtApp.$onHandlerLogin()">登录</div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">

</style>