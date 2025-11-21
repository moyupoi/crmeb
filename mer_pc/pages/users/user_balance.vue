<script setup lang="ts">
import { ref, reactive } from 'vue'
import { balanceRecordApi, myAccountApi } from '~/server/userApi'
const tabList = ref([
  {
    name: '全部',
    type: 'all',
  },
  {
    name: '支出',
    type: 'expenditure',
  },
  {
    name: '充值',
    type: 'recharge',
  },
  {
    name: '收入',
    type: 'income',
  },
])

/**
 * 我的账户余额
 */
const { data: myAccount } = await useAsyncData(async () => myAccountApi())

/**
 * 我的余额列表
 */
import { PageQuery } from '~/types/global'
import { QuestionFilled } from '@element-plus/icons-vue'
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  type: 'all',
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => balanceRecordApi(where), {
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
  <div class="balance h-100%">
    <div class="acea-row header">
      <div class="font18 fontColor333 mb-30px">我的余额</div>
    </div>
    <div class="flex mb-40px justify-center">
      <div class="text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myAccount.nowMoney }}</div>
        <div class="text-14px text-#999">账户余额(元)</div>
      </div>
      <div class="mr-180px ml-180px text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myAccount.recharge }}</div>
        <div class="text-14px text-#999">累计充值(元)</div>
      </div>
      <div class="text-center">
        <div class="text-32px fontColor333 fontsweight dinProSemiBold mb-10px">{{ myAccount.monetary }}</div>
        <div class="text-14px text-#999">累计消费(元)</div>
      </div>
    </div>
    <div class="acea-row">
      <div
        v-for="item in tabList"
        :key="item.type"
        class="item acea-row row-center-wrapper text-16px mr-50px text-#666"
        :class="{ on: where.type === item.type }"
        @click="handleChangeTab(item.type)"
      >
        {{ item.name }}
        <el-tooltip
          v-if="item.type === 'income'"
          class="box-item"
          effect="light"
          content="后台管理员添加余额、用户进行余额充值、推广佣金转入余额"
          placement="bottom-start"
        >
          <el-icon color="#CCCCCC" class="ml-4px"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>
    <div v-loading="listLoading">
      <div v-if="tableData.total > 0" class="bg-#FAFAFA b-rd-12px px-20px pt-20px mt-30px min-h-63%">
        <template v-for="(item, index) in tableData.list" :key="index">
          <div v-for="items in item.list" class="flex-between-center balance-item borderBotDas">
            <div>
              <div class="text-16px fontColor333 mb-14px">{{ items.remark }}</div>
              <div class="text-14px text-#999 mb-20px">{{ items.createTime }}</div>
            </div>
            <div class="text-right">
              <div v-if="items.type == 1" class="mb-14px text-#43B36D dinProSemiBold text-18px">
                +￥{{ items.amount }}
              </div>
              <div v-else class="mb-14px font-color dinProSemiBold text-18px">-￥{{ items.amount }}</div>
              <div class="text-14px text-#999 mb-20px">余额 {{ items.balance }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="tableData.total > 0" class="acea-row row-middle mt-30px">
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
    <div v-else class="w-100%">
      <empty-page title="暂无账单明细呦~">
        <template v-slot:emptyImage>
          <img src="@/assets/images/wuzhangdan.png" />
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
