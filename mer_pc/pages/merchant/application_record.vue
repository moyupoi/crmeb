<script setup lang="ts">
import { reactive } from 'vue'
import { ItemObject, PageQuery } from '~/types/global'
import { getMerCategoryListApi, getMerSettledRecordApi, getMerTypeListApi } from '~/server/merchantApi'
import { applicationRecordAuditStatus, applicationRecordAuditStatusIcon } from '~/utils/filter'
import { useAppStore } from '~/stores/app'
import { linkNavigateTo } from '~/utils/util'
import { ApplicationDataQuery } from '~/types/merchant'

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 200)

//商户分类
const { data: classOptions } = useAsyncData(async () => getMerCategoryListApi())
const merCategoryFilter = (status: number) => {
  if (!status) {
    return ''
  }
  let arrayList = classOptions.value
  let array = arrayList.filter((item: any) => status === item.id)
  if (array.length) {
    return array[0].name
  } else {
    return ''
  }
}

//商户类型
const { data: typeOptions } = useAsyncData(async () => getMerTypeListApi())
const merchantTypeFilter = (status: number) => {
  if (!status) {
    return ''
  }
  let arrayList = typeOptions.value
  let array = arrayList.filter((item: any) => status === item.id)
  if (array.length) {
    return array[0].name
  } else {
    return ''
  }
}
/**
 * 记录列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => getMerSettledRecordApi(where), {
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

//重新提交
const useStore = useAppStore()
const resubmit = (item: ApplicationDataQuery) => {
  useStore.getApplicationData(<ApplicationDataQuery>item)
  linkNavigateTo(`/merchant/merchant_settled`, { type: 1 })
}

const navigateToTitle = reactive<ItemObject>({
  title: '商户入驻',
  linkUrl: '/merchant/merchant_settled',
  params: { type: 0 },
})
</script>

<template>
  <div class="wrapper_1200" v-loading="listLoading">
    <page-header title="申请记录" :navigateToTitle="navigateToTitle"></page-header>
    <div v-if="tableData.total > 0">
      <div v-for="item in tableData.list" :key="item.id" class="w-100% borRadius bg-#FFF pb-20px px-30px mbtom20">
        <div class="h-78px flex-between-center title mb-30px">
          <div>
            <span class="iconfont mr-6px" :class="applicationRecordAuditStatusIcon(item.auditStatus)"></span>
            <span class="fontColor333 text-16px fontsweight mr-20px">{{
              applicationRecordAuditStatus(item.auditStatus)
            }}</span>
            <span v-show="item.denialReason" class="font-color text-14px">{{ item.denialReason }}</span>
          </div>
          <div v-if="item.auditStatus === 3" class="text-right">
            <div @click="resubmit(item)" class="w-86px h-30px lh-29px handleBtnBorder borderSolE9 font-color cursors">
              重新提交
            </div>
          </div>
        </div>
        <div class="acea-row">
          <div class="text-14px fontColor333 w-560px">
            <div class="mb-20px">商户名称：{{ item.name }}</div>
            <div class="mb-20px">商户分类：{{ merCategoryFilter(item.categoryId) }}</div>
            <div class="mb-20px">商户类型：{{ merchantTypeFilter(item.typeId) }}</div>
            <div class="mb-20px">申请时间：{{ item.createTime }}</div>
          </div>
          <div class="w-1px h-124px bg-#EEEEEE"></div>
          <div class="text-14px fontColor333 ml-30px w-549px">
            <div class="mb-20px">商户姓名：{{ item.realName }}</div>
            <div class="mb-20px">联系电话：{{ item.phone }}</div>
            <div class="acea-row">
              <div>资质证照：</div>
              <div class="acea-row w-470px">
                <div
                  v-for="(i, index) in JSON.parse(item?.qualificationPicture)"
                  :key="index"
                  class="w-66px h-66px mr-10px qualificationPicture"
                >
                  <el-image
                    :src="i"
                    fit="cover"
                    class="w-66px h-66px b-rd-8px"
                    :preview-src-list="JSON.parse(item.qualificationPicture)"
                  >
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="acea-row row-middle pb-10px">
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
      <empty-page title="暂无申请记录哟~">
        <template v-slot:emptyImage>
          <img src="@/assets/images/wuzhangdan.png" />
        </template>
      </empty-page>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-shenhezhong {
  color: #0095ff;
}
.icon-weitongguo1 {
  color: #e93323;
}
.icon-yitongguo {
  color: #43b36d;
}
.title {
  border-bottom: 1px dashed #dddddd;
}
.qualificationPicture {
  margin-bottom: 10px;
  &:nth-last-child(7) ~ div {
    margin-bottom: 0;
  }
}
</style>
