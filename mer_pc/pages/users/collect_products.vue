<template>
  <div class="collect h-100%">
    <div class="acea-row header">
      <div class="font18">全部宝贝({{tableData.total}})</div>
    </div>
    <div v-loading="listLoading">
      <div v-if="tableData.total>0">
        <UserProductList :list="tableData.list" type="collect_products" @handleComplete="handleComplete"></UserProductList>
        <div class="acea-row row-middle mt-30px">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="tableData.total"
                         :page-size="where.limit"
                         :current-page="where.page"  @update:current-page="pageChange" class="page-item" />
        </div>
      </div>
      <div v-else class="w-100%">
        <empty-page title="暂无收藏呦~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wushoucang.png">
          </template>
        </empty-page>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCollectProApi } from '~/server/userApi'
import { PageQuery } from '~/types/global'
import { reactive } from 'vue'
import UserProductList from '~/components/userProductList.vue'

const handleComplete = async () => {
  refresh()
}

/**
 * 收藏列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 12,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => getCollectProApi(where), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChange = (e: number) => {
  where.page = e
  refresh()
}
</script>

<style scoped lang="scss">
.collect {
  .header {
    margin-bottom: 27px;
  }
}
</style>