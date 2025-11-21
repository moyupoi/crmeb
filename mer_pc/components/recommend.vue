<!--推荐商品列表组件-->
<script setup lang="ts">
import { productRecommendListApi } from '~/server/goodsApi'
import { PageQuery, PageResult } from '~/types/global'
import { onMounted } from 'vue'
import useScrollHeight from "~/composables/useScrollHeight";
const example = useScrollHeight()

/**
 * 监听页面滚动
 */
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

/**
 * 推荐商品列表
 */
onMounted(() => {
  getList()
})
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  cid: '0',
})
const tableData = reactive<PageResult<any>>({
  list: [],
  total: 0,
})
const pullRefreshss = ref<boolean>(false)
const loading = ref<boolean>(false)
const getList = async () => {
  loading.value = true
  try {
    let data = await productRecommendListApi(where)
    tableData.total = data.total
    let proList = data.list
    tableData.list = tableData.list.concat(proList)
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

/**
 * 滚动加载
 */
const handleScroll = () => {
  if (process.client) {
    let scollY = example.getScrollTop() + example.getWindowHeight() - example.getScrollHeight() + 636
    // 把下拉刷新置为false，防止多次请求
    if (scollY >= -50) {
      if (where.page >= Math.ceil(tableData.total / where.limit)) {
        pullRefreshss.value = true
        return false
      }
      if (!pullRefreshss.value) {
        return false
      }
      pullRefreshss.value = false
      if (tableData.list.length < tableData.total) {
        // 加页码数
        where.page++
        getList()
      }
    } else {
      // 其他时候把下拉刷新置为true
      pullRefreshss.value = true
    }
  }
}
</script>

<template>
  <div class="wrapper_1200" v-if="tableData.list.length">
    <div class="w-100% text-28px fontColor333 fw-700 text-center mb-30px alimama">猜你喜欢</div>
    <div class="pb-10px item grid-column-5 gap-15px">
      <div v-for="item in tableData.list" :key="item.id" class="productItem cursors">
        <product :item="item"></product>
      </div>
    </div>
    <div class="loadingicon acea-row row-center-wrapper" v-if="loading">
      <span class="loading iconfont icon-jiazai">加载中...</span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
