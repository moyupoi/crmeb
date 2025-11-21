<script setup lang="ts">
import {getMerStreetApi} from "~/server/merchantApi";
import {PageQuery} from "~/types/global";
import { reactive, ref } from 'vue'

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176-280 )

//是否显示关注商户按钮
const isShowFollow = ref<boolean>(false)

/**
 * 列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => getMerStreetApi(where), {
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

<template>
  <div class="merchant_street pt-60px h-100% bg-#FFFFFF">
    <div class="wrapper_1200 h-70%" v-loading="listLoading">
      <div class="fontColor333 text-50px text-center mb-50px font-700 alimama">品牌好店</div>
      <div v-if="tableData.total>0">
        <div class="street-mer">
          <merchant-list :list="tableData.list" :isShowFollow="isShowFollow"></merchant-list>
        </div>
        <div class="acea-row row-middle mt-5px pb-20px">
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
        <empty-page title="暂无店铺哟~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/dayang.png" />
          </template>
        </empty-page>
      </div>
    </div>
  </div>

</template>

<style lang="scss">
.street-mer{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 15px;
  grid-column-gap: 15px;
  grid-template-rows: auto;
}
html{
  background-color: #fff;
}
.merchant_street{
  background-image: url("~/assets/images/pinpaibg.png");
  background-size: 100% 353px;
  background-repeat: no-repeat;
  :deep(.mer-item){
    margin-right: 15px;
    &:nth-child(5n){
      margin-right: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
:deep(.empty-box){
  height: 100% !important;
}
</style>