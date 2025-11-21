<script setup lang="ts">
import { orderReplyListApi } from '~/server/userApi'
import { PageQuery } from '~/types/global'
import { reactive, ref } from 'vue'
import useOrder from "~/composables/useOrder";
const { handleIntoPage, handlerProDetailLink } = useOrder()

/**
 * 评论列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
})
const route = useRoute()
where.page = route.query.page ? Number(route.query.page) : where.page
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => orderReplyListApi(where), {
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

/**
 * 去评论
 */
import { linkNavigateTo } from '~/utils/util'
import { useAppStore } from '~/stores/app'
import { ProductInfo } from '~/types/order'
const useStore = useAppStore()
const handleEvaluate = (item: ProductInfo) => {
  useStore.getEvaluationInfo(<ProductInfo>item)
  linkNavigateTo(`/order/product_evaluate`, { orderNo: item.orderNo, page: where.page })
}
</script>

<template>
  <div class="h-100%" v-loading="listLoading">
    <div class="text-#333 text-18px font-500 mb-30px">评价晒单</div>
    <div v-if="tableData.total>0">
      <div v-for="item in tableData.list" :key="item.id" class="b-rd-12px w-100% overflow-hidden borderSol-eee mb-20px">
        <div class="h-54px lh-52px text-14px flex-between-center bg-#EEEEEE px-20px">
          <div class="flex items-center">
            <div class="text-#999999 mr-50px oppoSans-R">
              订单号：<span class="text-#333333 oppoSans-R">{{ item.orderNo }}</span>
            </div>
            <div class="cursors merchant-home" @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.merId })"><span class="iconfont icon-guanzhudianpu mr-5px"></span>{{ item.merName }}</div>
          </div>
          <div class="text-12px fontColor333">
            <span class="oppoSans-M">￥</span><span class="text-20px dinProSemiBold font-600">{{ item.price }}</span>
          </div>
        </div>
        <div class="flex-between-center pl-20px">
          <div @click="handlerProDetailLink(item.productId, 0)" class="w-786px mt-20px mb-20px orderProduct" style="border-right: 1px dashed #eeeeee;">
            <order-product :list="item"></order-product>
          </div>
          <!--操作-->
          <div class="w-180px">
            <div @click="handleEvaluate(item)" class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center font-color text-12px" style="border: 1px solid #E93323;">评价晒单</div>
          </div>
        </div>
      </div>
      <div class="acea-row row-middle">
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
<!--    <div v-for="item in tableData.list" :key="item.id">-->
<!--      <el-button @click="handleEvaluate(item)">去评价</el-button>-->
<!--    </div>-->
    <div v-else class="w-100% h-100%">
      <empty-page title="暂无评价呦~">
        <template v-slot:emptyImage>
          <img src="@/assets/images/wupinlun.png">
        </template>
      </empty-page>
    </div>
  </div>
</template>

<style scoped lang="scss">

.merchant-home{
  color: #333333;
  &:hover{
    color: #E93323 !important;
  }
}
.orderProduct {
  :deep(.orderProduct) {
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
}
</style>
