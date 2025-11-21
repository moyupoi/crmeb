<!--首页推荐版本-->
<script setup lang="ts">
import { pcHomeRecommendedApi } from '~/server/homeApi'

const { data: recommendedList } = await useAsyncData(async () => pcHomeRecommendedApi(), {
  default: () => [],
})
</script>

<template>
  <div v-for="item in recommendedList" :key="item.id" class="wrapper_1200 merchantIndex mb-50px">
    <div v-if="item.productList.length">
      <div class="acea-row flex-between-center mb-30px">
        <div class="text-28px text-#333 ml-20px title font-500 alimama">{{ item.name }}</div>
        <nuxt-link
          :to="{ path: `/product/product_recommended`, query: { id: item.id, name: item.name } }"
          class="flex-y-center"
          ><div class="text-14px text-#999999 oppoSans-R cursors">
            更多<span class="iconfont icon-gengduo ml-4px"></span></div
        ></nuxt-link>
      </div>
      <div class="grid-container">
        <a v-if="item.linkUrl" :href="item.linkUrl" target="_blank">
          <el-image :src="item.imageUrl" class="w-471px h-340px b-rd-16px item"></el-image>
        </a>
        <el-image v-else :src="item.imageUrl" class="w-471px h-348px b-rd-16px item"></el-image>
        <div v-for="items in item.productList" :key="items.id" class="cursors">
          <product :item="items"></product>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 -8px;
  :deep(.content) {
    height: 120px !important;
  }
}
.item {
  margin: 7.5px;
}

:deep(.productItem) {
  margin: 7.5px;
}
:deep(.products-name) {
  line-height: 16px !important;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 17px !important;
}
</style>
