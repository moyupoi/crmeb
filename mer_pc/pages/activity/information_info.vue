<script setup lang="ts">
import { articleInfoApi } from '~/server/activityApi'
import { ref } from 'vue'

const route = useRoute()
const informationId = ref<number>(Number(<string>route.query.informationId)) //商户id

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 60)

const { data: articleInfo, pending: listLoading } = await useAsyncData(async () => articleInfoApi(informationId.value))
</script>

<template>
  <div class="wrapper_1200">
    <page-header :title="articleInfo.title" menuTitle="资讯信息"></page-header>
    <div
      class="py-50px px-60px bg-#FFFFFF borRadius w-1200px"
      v-loading="listLoading"
      :style="{ minHeight: ScrollHeight - 30 + 'px' }"
    >
      <div class="text-#333 text-24px text-center mb-30px">{{ articleInfo.title }}</div>
      <div class="mt-28px flex-y-center text-#999 text-14px flex-x-center mb-40px">
        <span class="iconfont icon-zuji mr-5px"></span>
        <span>{{ articleInfo.createTime }}</span>
        <span class="iconfont icon-liulan ml-20px mr-5px"></span>
        <span>{{ articleInfo.visit }}</span>
      </div>
      <div class="htmlClass" v-html="articleInfo.content"></div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
