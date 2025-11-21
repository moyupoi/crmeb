<script setup lang="ts">
import { orderStatusFilter } from '~/utils/filter'
import { ref, reactive } from 'vue'
const tabList = ref([
  {
    name: '全部',
    type: 'all',
  },
  {
    name: '未使用',
    type: 'usable',
  },
  {
    name: '已使用/失效',
    type: 'unusable',
  },
])


/**
 * 优惠券列表
 */
import { PageQuery } from '~/types/global'
import { couponUserListApi } from '~/server/userApi'
import { getCouponTime } from '~/utils/util'
const where = reactive<PageQuery>({
  page: 1,
  limit: 12,
  type: 'all',
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => couponUserListApi(where), {
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

const handleChangeTab = async (type: string) => {
  where.type = type
  where.page = 1
  refresh()
}

</script>

<template>
  <div class="coupon h-100%">
    <div class="acea-row ml-10px mb-30px items-center">
      <div
        v-for="item in tabList"
        :key="item.type"
        class="item text-16px mr-50px text-#666 cursors"
        :class="{ on: where.type === item.type }"
        @click="handleChangeTab(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-loading="listLoading" class="h-82%">
      <div v-if="tableData.total>0">
        <coupon-list :list="tableData.list" receivedText="去使用" :isShowJump="true"></coupon-list>
        <div class="acea-row row-middle mt-30px">
          <el-pagination
              background
              layout="prev, pager, next"
              :page-size="where.limit"
              :current-page="where.page"
              :total="tableData.total"
              @update:current-page="pageChange"
              class="page-item"
          />
        </div>
      </div>
      <div v-else class="w-100% h-100%">
        <empty-page title="暂无优惠券呦~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wuyouhui.png">
          </template>
        </empty-page>
      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.on{
  font-size: 18px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: #E93323;
}
</style>
