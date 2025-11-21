<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { RefundStatusEnum } from '@/enums/productEnums'
const { handleIntoPage, isBuyAgain, isRefund, isRefunded } = useOrder()
import { ProductTypeEnum } from '@/enums/productEnums'
const tabList = ref([
  {
    name: '全部',
    type: -1,
  },
  {
    name: '待付款',
    type: 0,
  },
  {
    name: '待发货',
    type: 1,
  },
  {
    name: '待收货',
    type: 4,
  },
  {
    name: '已取消',
    type: 9,
  },
])

const bgColor = reactive<any>({
  bgColor: '',
  Color: '#E93323',
  width: '36rpx',
  timeTxtwidth: '16rpx',
  isDay: true,
  fontSize: '14px',
})

/**
 * 我的订单列表
 */
import { PageQuery } from '~/types/global'
import { orderListApi } from '~/server/orderApi'
import { orderStatusFilter, productTypeNameFilter } from '~/utils/filter'
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  status: -1,
  keywords: '',
})
const route = useRoute()
where.page = route.query.page ? Number(route.query.page) : where.page
where.status = route.query.orderStatus ? Number(route.query.orderStatus) : where.status
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => orderListApi(where), {
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
  where.status = type
  where.page = 1
  refresh()
}

//去订单详情
import { linkNavigateTo } from '~/utils/util'
import useOrder from '~/composables/useOrder'
import { CartBatchAdd } from '~/types/order'
import feedback from '~/utils/feedback'
const handleToOrderDetails = async (item: string) => {
  if (!item.orderNo) return feedback.msgWarning('缺少订单号无法查看订单详情')
  if (item.groupBuyRecordStatus === 0) return feedback.msgWarning('拼团中无法查看详情')
  listLoading.value = true
  if (item.secondType < 5 || item.secondType === 7) {
    await linkNavigateTo(`/order/order_details`, { orderNo: item.orderNo, page: where.page, orderStatus: where.status })
  } else {
    await linkNavigateTo(`/order/virtual_order_details`, {
      orderNo: item.orderNo,
      page: where.page,
      orderStatus: where.status,
    })
  }
}

//去退款列表
const handleToOrderRefund = async (orderNo: string) => {
  listLoading.value = true
  await linkNavigateTo(`/users/refund_list`, { type: 9, orderNo: orderNo })
}

const useOrders = useOrder()
//再次购买
const handleByAgain = async (cartInfo: Array<any>) => {
  let cartListRequest: Array<CartBatchAdd> = []
  cartInfo.map((item) => {
    cartListRequest.push({
      productId: parseFloat(item.productId),
      productAttrUnique: item.attrValueId,
      cartNum: parseFloat(item.payNum),
    })
  })
  try {
    listLoading.value = true
    await useOrders.onByAgain(cartListRequest)
    listLoading.value = false
  } catch (e) {
    listLoading.value = false
  }
}

//删除订单
const handleDelOrder = async (orderNo: string) => {
  await useOrders.onDeleteOrder(orderNo).then(async () => {
    await refresh()
  })
}

//确认收货
const handleConfirmOrder = async (orderInfo: any) => {
  let applyRefundNum = 0
  orderInfo.orderInfoList.map((i) => {
    applyRefundNum = Number(i.applyRefundNum)
  })
  //如果有售后中的，给提示
  if (applyRefundNum > 0) {
    return feedback.confirm('请先撤销售后，再进行收货操作!').then(async () => {})
  } else {
    useOrders.onConfirmOrder(orderInfo.orderNo).then(async () => {
      await refresh()
    })
  }
}

//取消订单
const handleCancelOrder = async (orderNo: string) => {
  useOrders.onCancelOrder(orderNo).then(async () => {
    await refresh()
  })
}

//立即付款
const handlePaymentOrder = (orderNo: string) => {
  linkNavigateTo(`/order/order_payment`, { orderNo: orderNo })
}

//倒计时结束
const stopTime = (isShowCancelTime: boolean, item: any) => {
  item.isShowCancelTime = true
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
          :class="where.status === item.type ? 'font-color font-500' : 'text-#666'"
          @click="handleChangeTab(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <el-input @keyup.enter="refresh" v-model="where.keywords" style="width: 275px" placeholder="搜索商品名称或订单号">
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <!--订单信息-->
    <div v-if="tableData.total > 0">
      <div v-for="item in tableData.list" :key="item.id" class="8bfb4 b-rd-12px w-100% overflow-hidden borderSol-eee mb-20px">
        <div class="h-54px lh-52px text-14px flex-between-center bg-#FAFAFA px-20px aaf9">
          <div class="flex items-center">
            <div v-show="item.type > 0 && item.type < 3" class="mr-10px font-color">
              {{ '【' + productTypeNameFilter(item.type) + '】' }}
            </div>
            <div v-show="item.secondType == 1" class="mr-10px font-color">【积分】</div>
            <!--已退款与非退款订单展示订单状态-->
            <div v-if="isRefunded(item)" class="text-#fff labelClass mr-20px bg-#E93323">已退款</div>
            <template v-else>
              <div
                v-if="item.groupBuyRecordStatus == 99 || item.status == 9 || item.groupBuyRecordStatus == 10"
                class="text-#fff labelClass mr-20px"
                :class="item.status === 6 || item.status === 9 ? 'bg-#BBBBBB' : 'bg-#E93323'"
              >
                {{ orderStatusFilter(item.status) }}
              </div>
              <div v-else class="bg-#E93323 text-#fff labelClass mr-20px">
                {{ item.groupBuyRecordStatus === 0 ? '拼团中' : '拼团失败' }}
              </div>
            </template>
            <div class="text-#999999 mr-20px oppoSans-R">{{ item.createTime }}</div>
            <div class="text-#999999 mr-50px oppoSans-R">
              订单号：<span class="text-#333333 font-400 orderNo oppoSans-R">{{ item.orderNo }}</span>
            </div>
            <div
              @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.merId })"
              v-show="item.merName"
              class="cursors text-14px merchant-home"
            >
              <span class="iconfont icon-guanzhudianpu mr-5px line1" style="font-size: 14px"></span
              ><span>{{ item.merName }}</span>
            </div>
            <div class="acea-row font-color" v-if="item.status === 0 && !item.isShowCancelTime">
              <countDown
                class="ml-5px mr-5px"
                :is-day="true"
                :tip-text="' '"
                :day-text="' '"
                :hour-text="' : '"
                :minute-text="' : '"
                :second-text="' '"
                :datatime="item.cancelTime / 1000"
                :isCol="false"
                :bgColor="bgColor"
                :dataItem="item"
                @stopTime="stopTime"
              >
              </countDown>
              <div>后订单取消</div>
            </div>
          </div>
          <div class="text-12px fontColor333 dinProSemiBold">
            <span class="oppoSans-M">￥</span><span class="text-20px dinProRegular font-600">{{ item.payPrice }}</span>
            <span v-show="item.secondType == 1">
              <span ref="hao"> + </span>
              <span class="text-22px fw-600 dinProRegular">{{ item.redeemIntegral }}</span>
              <span class="oppoSans-M ml-5px">积分</span>
            </span>
          </div>
        </div>
        <div class="flex justify-between pl-20px 48bfb4a">
          <div
            @click="handleToOrderDetails(item)"
            class="w-786px mt-20px mb-20px orderProduct"
            style="border-right: 1px dashed #eeeeee"
          >
            <template v-for="(itm, indexs) in item.orderInfoList" :key="indexs">
              <order-product :list="itm"></order-product>
            </template>
          </div>
          <!--操作-->
          <!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待使用，4：待收货,5：已收货,6：已完成，9：已取消） -->
          <div class="w-180px pt-20px pb-6px">
            <div
              v-if="item.status === 0 && !item.isShowCancelTime && !isRefunded(item)"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center font-color text-12px mb-14px"
              style="border: 1px solid #e93323"
              @click="handlePaymentOrder(item.orderNo)"
            >
              立即支付
            </div>
            <div
              v-if="item.status === 4 && !isRefunded(item)"
              @click="handleConfirmOrder(item)"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center font-color text-12px mb-14px"
              style="border: 1px solid #e93323"
            >
              确认收货
            </div>
            <div
              v-if="item.status > 0 && isBuyAgain(item) && !item.systemFormId && !isRefunded(item)"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center text-12px mb-14px"
              :style="item.status === 4 ? '' : 'border: 1px solid #e93323'"
              :class="item.status === 4 ? 'text-#333 borderSol' : 'font-color'"
              @click="handleByAgain(item.orderInfoList)"
            >
              再次购买
            </div>
            <div
              v-if="item.status === 0 && !isRefunded(item)"
              @click="handleCancelOrder(item.orderNo)"
              class="m-auto w-86px h-30px lh-29px b-rd-15px text-center text-#333 text-12px borderSol cursors mb14px"
            >
              取消订单
            </div>
            <div
              v-if="(item.status == 6 || item.status == 9) && !isRefunded(item)"
              @click="handleDelOrder(item.orderNo)"
              class="m-auto w-86px h-30px lh-29px b-rd-15px text-center text-#333 text-12px borderSol cursors mb14px"
            >
              删除订单
            </div>
            <div
              @click="handleToOrderDetails(item)"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center text-#333 text-12px borderSol mb-14px"
            >
              查看详情
            </div>
            <div
              v-if="
                item.refundStatus === RefundStatusEnum.未退款 &&
                isRefund(item, item.orderInfoList[0]) &&
                item.groupBuyRecordStatus > 0 &&
                !isRefunded(item)
              "
              @click="handleToOrderRefund(item.orderNo)"
              class="cursors m-auto w-86px h-30px lh-29px b-rd-15px text-center text-#333 text-12px borderSol mb-14px"
            >
              申请退款
            </div>
          </div>
        </div>
      </div>
      <div class="acea-row row-middle mt-30px 3cfea756">
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
  </div>
</template>

<style scoped lang="scss">
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
