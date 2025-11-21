<script setup lang="ts">
//底部信息
import { computed, reactive, ref } from 'vue'
import { useAppStore } from '~/stores/app'
import { GlobalDatas } from '~/types/user'

//全局配置
const appStore = useAppStore()
const globalData = computed(() => reactive<GlobalDatas>(<GlobalDatas>appStore?.globalData))

const props = defineProps({
  //列表数据
  pcHomeCon: {
    type: Object,
    default: null,
  },
})
const { pcHomeCon } = toRefs(props)

const { getFooterIsIntersecting } = useAppStore()
const targetElement = ref(null)
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 元素进入可视区域
        getFooterIsIntersecting(true)
      } else {
        getFooterIsIntersecting(false)
        // 元素离开可视区域
      }
    })
  })
  if (targetElement.value) {
    observer.observe(targetElement.value)
  }
})
</script>
<!--页面底部-->
<template>
  <div v-if="pcHomeCon" class="layoutFooter mt-20px" ref="targetElement">
    <div
      v-if="pcHomeCon.philosophyList && pcHomeCon.philosophyList.length"
      class="w-100% h-90px bg-#FFFFFF"
      style="border-top: 1px solid #f5f5f5"
    >
      <div class="wrapper_1200 h-90px flex-between-center">
        <div v-for="item in pcHomeCon.philosophyList" :key="item.id">
          <div class="flex-y-center">
            <img :src="item.imageUrl" class="w-40px h-40px b-rd-50% mr-14px" />
            <div class="text-16px text-#333 font-500">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部黑色模块 -->
    <div class="py-40px bg-#333333">
      <div class="wrapper_1200 flex justify-between">
        <!-- 左边 -->
        <div class="color-#FFFFFF l-box">
          <div v-for="(val, index) in pcHomeCon.quickEntryList" :key="index">
            <div class="l-title" @click="openUrl(val.linkUrl)">
              <span class="font-500 oppoSans-M">{{ val.name }}</span>
            </div>
            <div class="l-tips" v-for="(tip, index) in val.linkList" :key="index">
              <a v-if="tip.linkUrl" :href="tip.linkUrl" target="_blank" class="font-400 oppoSans-R"> {{ tip.name }}</a>
              <span v-else class="font-400 oppoSans-R">{{ tip.name }}</span>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="flex">
          <!-- 联系客服和关注我们 -->
          <!-- <div class="code-r" v-for="(code, index) in pcHomeCon.qrCodeList">
            <div class="code">
              <img :src="code.imageUrl" alt="" />
            </div>
            <span class="mt-12px">{{ code.name }}</span>
          </div> -->
        </div>
      </div>
      <!-- 分割线 -->
      <div class="wrapper_1200 divisionLine"></div>
      <!-- 企业信息 -->
      <!-- <div v-if="pcHomeCon.friendlyLinkList.length" class="wrapper_1200 flex-x-center text-s mb-40px">
        <div class="w-953px flex flex-justify-center flex-wrap lh-19px">
          <div class="mr-15px text-#999" v-for="item in pcHomeCon.friendlyLinkList">
            <a style="color: #999999" v-if="item.linkUrl" :href="item.linkUrl" target="_blank"> {{ item.name }}</a>
            <span v-else>{{ item.name }}</span>
          </div>
        </div>
      </div> -->
      <div class="min_wrapper_1200 flex-col flex-items-center flex-x-center text-s">
        <div>
          <span v-if="globalData.authorizePhone" class="mr-20px">联系电话：{{ globalData.authorizePhone }}</span>
          <span v-if="globalData.authorizeAddress">地址：{{ globalData.authorizeAddress }}</span>
        </div>
        <div class="mt-17px">
          {{ globalData.authorizeInfo
          }}<a style="color: #999999" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
            {{ globalData.authorizeFilingNum }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.l-box {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: none;
  grid-gap: 40px;
  font-weight: 400;
  font-family: PingFang SC-Regular, PingFang SC;

  .l-title {
    font-size: 16px;
    margin-bottom: 26px;
  }
  .l-tips {
    cursor: pointer;
    margin-bottom: 14px;
    color: #cccccc !important;
    font-size: 14px;
    a {
      color: #cccccc !important;
    }
  }
}
.code-r {
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 400;
  font-size: 14px;

  font-family: PingFang SC-Regular, PingFang SC;
  .code {
    width: 100px;
    height: 100px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.code-r:nth-child(1) {
  margin-right: 40px;
}
.divisionLine {
  margin-top: 10px;
  border: 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.15);
  margin-bottom: 40px;
}

.text-s {
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}
</style>
