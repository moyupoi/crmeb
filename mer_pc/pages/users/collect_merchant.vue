<script setup lang="ts">
import { collectMerchantApi } from '~/server/userApi'
import { PageQuery } from '~/types/global'
import { reactive, ref } from 'vue'
import MerchantList from '~/components/merchantList.vue'

const isShowFollow = ref<boolean>(true)
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
} = await useAsyncData(async () => collectMerchantApi(where), {
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

const getIsCollect = () => {
  refresh()
}
</script>

<template>
  <div class="collect h-100%">
    <div class="acea-row header mb-25px">
      <div class="font18">全部店铺({{ tableData.total }})</div>
    </div>
    <div v-loading="listLoading">
      <div v-if="tableData.total>0">
        <div class="collect-mer">
          <merchant-list
              :list="tableData.list"
              @handleSubmitSuccess="refresh"
              :isShowFollow="isShowFollow"
          ></merchant-list>
        </div>
        <div class="acea-row row-middle mt-20px">
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
      <div v-else class="w-100% h-96%">
        <empty-page title="暂无收藏呦~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wushoucang.png">
          </template>
        </empty-page>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collect-mer{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 15px;
  grid-column-gap: 15px;
  grid-template-rows: auto;
}
@import '@/assets/scss/checkbox.scss';
.top-20px {
  top: 20px !important;
  left: 10px !important;
  background-color: #fff;
}
.smegma {
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.5s ease-in-out;
  width: 228px;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.allSelect {
  /*width: 90px;*/
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  .checkAll {
    margin-left: 30px;
  }
}
</style>
