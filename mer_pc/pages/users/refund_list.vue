<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
const { handleIntoPage } = useOrder()
const tabList = ref([
  {
    name: '售后申请',
    type: -1,
  },
  {
    name: '处理中',
    type: 0,
  },
  {
    name: '申请记录',
    type: 9,
  },
])
const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo) //订单号
/**
 * 售后申请列表
 */
import { PageQuery } from '~/types/global'
import { refundApplyListApi, refundListApi } from '~/server/orderApi'
import { orderRefundStatusFilter } from '~/utils/filter'
const refundStatus = ref<number>(-1)
refundStatus.value = route.query.refundStatus ? Number(route.query.refundStatus) : refundStatus.value
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  keywords: orderNo.value?orderNo.value:'',
  type: refundStatus.value > -1 ? refundStatus.value : null,
})
where.page = route.query.page ? Number(route.query.page) : where.page

const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => (refundStatus.value > -1 ? refundListApi(where) : refundApplyListApi(where)), {
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

const handleChangeTab = async (type: number) => {
  refundStatus.value = type
  where.type = type
  where.page = 1
  refresh()
}

//去订单详情
import useOrder from '~/composables/useOrder'
const handleToOrderDetails = (refundOrderNo: string) => {
  if(refundStatus.value === -1) return;
  listLoading.value = true
  linkNavigateTo(`/order/orderRefund_details`, { refundOrderNo: refundOrderNo, page: where.page,refundStatus: refundStatus.value })
}

//申请退款
import { linkNavigateTo } from '~/utils/util'
import { useAppStore } from '~/stores/app'
import { ProductInfo } from '~/types/order'
import useOrderRefund from '~/composables/useOrderRefund'
import ReturningGoods from '~/pages/order/components/returningGoods.vue'
const useStore = useAppStore()
const { onRevokeRefund } = useOrderRefund()

const handleApplyRefund = (item: ProductInfo) => {
  useStore.getEvaluationInfo(<ProductInfo>item)
  linkNavigateTo(`/order/apply_refund`)
}

//撤销售后
const handleRevokeRefund = async (refundOrderNo: string) => {
  await onRevokeRefund(refundOrderNo).then(async () => {
    await refresh()
  })
}

//退回弹窗
const { bool: dialogVisible, DialogOpen, DialogClose } = useDialog()
//退回商品
const returnGoodsType = ref<number>(0) //退回状态
const refundOrderNo = ref<string>('') //退款单号
const merId = ref<number>(0)
const handleReturningRefund = async (item: any) => {
  returnGoodsType.value = item.returnGoodsType
  refundOrderNo.value = item.refundOrderNo
  merId.value = item.merId
  DialogOpen()
}
//退回提交成功回调
const handleSubmitSuccess = ()=>{
  DialogClose()
  refresh()
}
//关闭弹窗
const handleSubmitClose = () => {
  DialogClose()
}

//跳转至申请记录
const onHandlerToRecord = async (orderNo:string)=>{
  where.keywords = orderNo
  refundStatus.value = 9
  where.type = 9
  where.page = 1
  refresh()
}
</script>

<template>
  <div class="order-list h-100%" v-loading="listLoading">
    <!--tab导航信息-->
    <div class="flex-between-center mb-23px">
      <div class="acea-row">
        <div
          v-for="item in tabList"
          :key="item.type"
          class="item text-16px mr-50px cursor-pointer"
          :class="refundStatus === item.type ? 'font-color font-500' : 'text-#666'"
          @click="handleChangeTab(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <el-input @keyup.enter="refresh" v-model="where.keywords" style="width: 300px" placeholder="根据商品名称/退款订单号/订单编号搜索">
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <!--订单信息-->
    <div v-if="tableData.total > 0">
      <div v-for="item in tableData.list" :key="item.id" class="b-rd-12px w-100% overflow-hidden borderSol-eee mb-20px">
        <div class="h-54px lh-52px text-14px flex-between-center bg-#FAFAFA px-20px">
          <div class="flex items-center">
            <div v-if="refundStatus > -1" class="text-#fff labelClass mr-20px bg-#E93323">
              {{ orderRefundStatusFilter(item.refundStatus) }}
            </div>
            <div class="text-#999999 mr-50px oppoSans-R">
              {{ refundStatus === -1 ? '订单号' : '售后单号' }}：<span
                class="text-#333333 font-400 orderNo oppoSans-R"
                >{{ refundStatus === -1 ? item.orderNo : item.refundOrderNo }}</span
              >
            </div>
            <div
              @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.merId })"
              v-show="item.merName"
              class="cursors text-14px merchant-home"
            >
              <span class="iconfont icon-guanzhudianpu mr-5px line1" style="font-size: 14px"></span
              ><span>{{ item.merName }}</span>
            </div>
          </div>
          <div v-if="item.payPrice && refundStatus === -1" class="text-12px fontColor333 dinProSemiBold">
            <span class="oppoSans-M">实付金额：</span
            > <span class="oppoSans-M">￥</span><span class="text-20px dinProRegular font-600">{{ item.payPrice }}</span>
          </div>
          <div v-if="item.refundPrice && refundStatus > -1" class="text-12px fontColor333 dinProSemiBold">
            <span class="oppoSans-M">退款金额：￥</span
            ><span class="text-20px dinProRegular font-600">{{ item.refundPrice }}</span>
          </div>
        </div>
        <div class="flex-between-center pl-20px">
          <div
            @click="handleToOrderDetails(item.refundOrderNo)"
            class="w-786px mt-20px mb-20px orderProduct"
            style="border-right: 1px dashed #eeeeee"
          >
            <order-product :list="item" :refundStatus="refundStatus" @onHandlerToRecord="onHandlerToRecord"></order-product>
          </div>
          <!--操作-->
          <!-- 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销   售后类型：1-仅退款，2-退货退款 -->
          <div class="w-180px py-20px handleBtnBox">
            <div
              v-if="refundStatus === -1"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center font-color text-12px "
              @click="handleApplyRefund(item)"
            >
              申请退款
            </div>
            <div
                v-if="item.refundStatus === 4 && item.afterSalesType === 2"
                class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center text-12px mb-14px text-#333 borderSol"
                @click="handleReturningRefund(item)"
            >
              退回商品
            </div>
            <div
              v-if="item.refundStatus === 0 || item.refundStatus === 4 || item.refundStatus === 5"
              @click="handleRevokeRefund(item.refundOrderNo)"
              class="cursors m-auto borderSol w-86px h-30px lh-29px b-rd-15px text-#333 text-center text-12px"
            >
              撤销售后
            </div>
            <div
                v-if="refundStatus !== -1"
                @click="handleToOrderDetails(item.refundOrderNo)"
                class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center text-#333 text-12px borderSol mt-14px"
            >
              查看详情
            </div>
          </div>
        </div>
      </div>
      <div class="acea-row row-middle mt-30px">
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
    </div>
    <div v-else class="w-100%">
      <empty-page title="暂无订单呦~">
        <template v-slot:emptyImage>
          <img src="@/assets/images/wudingdan.png" />
        </template>
      </empty-page>
    </div>

    <!--退回商品-->
    <returning-goods :returnGoodsType="returnGoodsType" :refundOrderNo="refundOrderNo" :isShowDialog="dialogVisible"  @handleSubmitSuccess="handleSubmitSuccess" :merId="merId"
                     v-if="dialogVisible"
                     @handleSubmitClose="handleSubmitClose"></returning-goods>
  </div>
</template>

<style scoped lang="scss">
.handleBtnBox{
  div:first-of-type {
    border: 1px solid #e93323 !important;
    color: #e93323 !important;
  }
}
.merchant-home {
  color: #333333;
  &:hover {
    color: #e93323 !important;
  }
}
.orderNo {
  &:hover {
    color: #e93323 !important;
  }
}
.order-list {
  :deep(.el-input__wrapper) {
    border: none !important;
    box-shadow: none !important;
  }
  :deep(.el-input) {
    --el-fill-color-blank: #f7f7f7 !important;
    --el-border-radius-base: 20px;
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
