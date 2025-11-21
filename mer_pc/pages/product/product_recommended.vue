<script setup lang="ts">
import { ref, reactive } from 'vue'
import { indexRecommendedProductApi } from '~/server/homeApi'
import {ItemObject, PageQuery} from '~/types/global'
const route = useRoute()
const name = ref<string>(<string>route.query.name)
const id = ref<string>(<string>route.query.id)

const sizeData = reactive<ItemObject>({
  width: '228px',
  height: '228px',
})

/**
 * 列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  id: id,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => indexRecommendedProductApi(where))

// 分页数据
const pageChange = (e: number) => {
  where.page = e
  refresh()
}

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 140)
</script>

<template>
  <div class="wrapper_1200">
    <page-header :title="name"></page-header>
    <div v-loading="listLoading" class="h-70%">
      <div v-if="tableData.total > 0" class="acea-row">
        <div class="grid-column-5 gap-15px proList">
          <div v-for="item in tableData.list" :key="item.id" class="cursors">
            <product :item="item" :sizeData="sizeData"></product>
          </div>
        </div>
        <div class="acea-row row-middle mt-20px pb-10px w-100%">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="tableData.total"
            class="page-item"
            :page-size="where.limit"
            :current-page="where.page"
            @update:current-page="pageChange"
          />
        </div>
      </div>
      <div v-else class="w-100%" :style="{ height: ScrollHeight + 'px' }">
        <empty-page title="暂无商品哟~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wushangpin.png" />
          </template>
        </empty-page>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
