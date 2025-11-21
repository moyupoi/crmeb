<script setup lang="ts">
import { reactive } from 'vue'
import { integralListApi, myIntegralApi } from '~/server/userApi'

/**
 * 我的积分记录
 */
const { data: myIntegral } = await useAsyncData(async () => myIntegralApi())

/**
 * 积分记录列表
 */
import { PageQuery } from '~/types/global'
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => integralListApi(where), {
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
  <div class="balance h-100%">
    <div class="acea-row header">
      <div class="font18 fontColor333 mb-30px">我的积分</div>
    </div>
    <div class="flex mb-40px justify-center">
      <div class="mr-160px text-center">
        <div class="text-32px font-color fontsweight dinProSemiBold mb-10px">{{ myIntegral.integral }}</div>
        <div class="text-14px text-#999">当前积分</div>
      </div>
      <div class="mr-160px text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myIntegral.settledIntegral }}</div>
        <div class="text-14px text-#999">累计积分</div>
      </div>
      <div class="mr-160px text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myIntegral.useIntegral }}</div>
        <div class="text-14px text-#999">消耗积分</div>
      </div>
      <div class="text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myIntegral.freezeIntegral }}</div>
        <div class="text-14px text-#999">冻结积分</div>
      </div>
    </div>
    <div v-loading="listLoading">
      <div v-if="tableData.total>0" class="bg-#FAFAFA b-rd-12px px-20px pt-20px mt-30px min-h-70%">
        <div v-for="item in tableData.list" :key="item.id" class="flex-between-center balance-item borderBotDas">
          <div>
            <div class="text-16px fontColor333 mb-14px">{{ item.title }}</div>
            <div class="text-14px text-#999 mb-20px">{{ item.updateTime }}</div>
          </div>
          <div>
            <div v-if="item.type === 1" class="mb-14px text-#43B36D dinProSemiBold text-18px">+{{ item.integral }}</div>
            <div v-else class="mb-14px font-color dinProSemiBold text-18px">-{{ item.integral }}</div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="tableData.total>0" class="acea-row row-middle mt-30px">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.total"
          :page-size="where.limit"
          :current-page="where.page"
          @update:current-page="pageChange"
          class="page-item"
      />
    </div>
    <div v-else class="w-100% h-70%">
      <empty-page title="暂无积分明细呦~">
        <template v-slot:emptyImage>
          <img src="@/assets/images/wuzhangdan.png">
        </template>
      </empty-page>
    </div>
  </div>
</template>

<style scoped lang="scss">
.balance {
  .item {
    position: relative;
    cursor: pointer;
    &.on {
      color: #e93323;
      &::before {
        content: '';
        position: absolute;
        top: 31px;
        bottom: 18px;
        height: 2px;
        width: 22px;
        background: #e93323;
      }
    }
  }
  &-item {
    margin-bottom: 20px;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
</style>
