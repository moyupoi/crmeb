<script setup lang="ts">
import { refundDetailApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
import { ref, reactive } from 'vue'
const { handleIntoPage } = useOrder()
import { orderRefundTipsStatusFilter, orderRefundFilter } from '~/utils/filter'
import useOrderRefund from '~/composables/useOrderRefund'
import ReturningGoods from '~/pages/order/components/returningGoods.vue'
import { merchantAddressApi, merCustomerApi } from '~/server/merchantApi'
import { ItemObject } from '~/types/global'
import { QuestionFilled } from '@element-plus/icons-vue'
import { NavigateToTitle } from '~/types/order'
const route = useRoute()
const refundOrderNo = ref<string>(<string>route.query.refundOrderNo)
const loading = ref<boolean>(false)
const type = ref<number>(0) //订单类型 0-普通订单，1-视频号订单,2-秒杀订单
const { onRevokeRefund } = useOrderRefund()

//复制
const { handleCopy } = useCopy()
const copyText = () => {
  handleCopy(orderInfo.trackingNumber)
}

/**
 * 退款订单详情
 */
onMounted(() => {
  getOrderRefundDetail()
})
const orderInfo = reactive({})
const cartInfo = ref([]) //再次购买加入购物车的商品
const userAddress = ref([])
const isUserAddress = ref<boolean>(false) //是否只显示一次收货地址
const getOrderRefundDetail = async () => {
  loading.value = true
  await refundDetailApi(refundOrderNo.value)
    .then((res) => {
      Object.assign(orderInfo, res)
      //商户地址
      if (orderInfo.returnGoodsType === 2) getMerchantAddress()
      //客服配置
      getChatConfig()
      userAddress.value = res.merchantOrderList.filter((item: any) => {
        return item.shippingType === 1
      })
      cartInfo.value = res.merchantOrderList[0].orderInfoList
      isUserAddress.value = userAddress.value.length > 0 ? true : false
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

//商户地址
const merchantAddress = ref<string>('')
const getMerchantAddress = async () => {
  merchantAddress.value = await merchantAddressApi(orderInfo.merId)
}

//获取客服配置
const { chatConfig } = useOrder()
const chatConfigData = reactive<ItemObject>({})
const getChatConfig = async () => {
  let data = await merCustomerApi(orderInfo.merId)
  Object.assign(chatConfigData, data)
}

//联系客服
const handleChat = async () => {
  await chatConfig(chatConfigData)
}

//撤销售后
const handleRevokeRefund = async (refundOrderNo: string) => {
  await onRevokeRefund(refundOrderNo).then(async () => {
    await getOrderRefundDetail()
  })
}

//退回弹窗
const { bool: dialogVisible, DialogOpen, DialogClose } = useDialog()
//退回商品
const returnGoodsType = ref<number>(0) //退回状态
const handleReturningRefund = async (item: any) => {
  returnGoodsType.value = item.returnGoodsType
  DialogOpen()
}
//退回提交成功回调
const handleSubmitSuccess = async () => {
  await getOrderRefundDetail()
  await DialogClose()
}
//关闭弹窗
const handleSubmitClose = () => {
  DialogClose()
}

const navigateToTitle = reactive<NavigateToTitle>({
  title: '售后/退款',
  linkUrl: '/users/refund_list',
  params: { type: 9, page: route.query.page, name: '售后/退款', refundStatus: route.query.refundStatus },
})
</script>

<template>
  <div class="wrapper_1200" v-loading="loading">
    <page-header title="售后详情" :navigateToTitle="navigateToTitle"></page-header>
    <!--订单状态 refundStatus售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销-->
    <div class="w-100% borRadius bg-#FFF py-18px px-30px mbtom20">
      <div class="fontColor333 text-20px font-500 oppoSans-M mb-15px acea-row items-center">
        <div class="mr-10px">{{ orderRefundFilter(orderInfo.refundStatus) }}</div>
        <div v-show="orderInfo.refundStatus === 3" class="text-18px font-color dinProSemiBold">
          <span class="text-12px">￥</span>{{ orderInfo.refundPrice }}
        </div>
      </div>
      <div v-if="orderInfo.refundStatus === 1" class="text-#666 text-14px font-400 oppoSans-R">
        {{ orderInfo.refundReason }}
      </div>
      <div v-else class="text-#666 text-14px font-400 oppoSans-R">
        {{ orderRefundTipsStatusFilter(orderInfo.refundStatus) }}
      </div>
    </div>
    <!-- 物流信息-->
    <div
      v-if="
        orderInfo.refundStatus > 0 &&
        orderInfo.afterSalesType === 2 &&
        orderInfo.returnGoodsType === 1 &&
        orderInfo.expressName &&
        orderInfo.trackingNumber
      "
      class="w-100% borRadius bg-#fff h-90px px-30px py-22px mbtom20 flex-y-center"
    >
      <div class="text-14px lh-14px w-50px h-50px b-rd-50% bg-#F7F7F7 text-center lh-50px mr-15px">
        <span class="iconfont icon-kuaidi" style="font-size: 24px"></span>
      </div>
      <div class="font-400 text-14px oppoSans-R">
        <div class="oppoSans-R mb-14px text-#333333">
          <span>快递公司：{{ orderInfo.expressName }}</span>
          <span class="ml-50px">联系电话：{{ orderInfo.telephone }}</span>
        </div>
        <div class="oppoSans-R text-#333333">
          快递单号： {{ orderInfo.trackingNumber
          }}<span
            class="text-#333333 ml-10px oppoSans-R borderSol b-rd-10px w-40px h-20px lh-20px text-12px inline-block text-center cursors"
            @click="copyText"
            >复制</span
          >
        </div>
      </div>
    </div>
    <!-- 用户到店退回联系电话-->
    <div
      v-if="
        orderInfo.refundStatus > 0 &&
        orderInfo.afterSalesType === 2 &&
        orderInfo.returnGoodsType === 2 &&
        orderInfo.telephone
      "
      class="w-100% borRadius bg-#fff h-90px px-30px py-22px mbtom20 flex-y-center"
    >
      <div class="text-14px lh-14px w-50px h-50px b-rd-50% bg-#F7F7F7 text-center lh-50px mr-15px">
        <span class="iconfont icon-kuaidi" style="font-size: 24px"></span>
      </div>
      <div class="font-400 text-14px oppoSans-R">
        <div class="oppoSans-R text-#333333">
          <span>联系电话：{{ orderInfo.telephone }}</span>
        </div>
      </div>
    </div>
    <!--退回地址,订单待审核之后，有地址展示，无地址不展示-->
    <div
      v-if="
        orderInfo.refundStatus > 0 &&
        ((orderInfo.returnGoodsType === 1 && orderInfo.receiver && orderInfo.receiverPhone) ||
          (orderInfo.returnGoodsType === 2 && merchantAddress))
      "
      class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20"
    >
      <div class="fontColor333 text-16px mb-30px">{{ orderInfo.returnGoodsType === 1 ? '退回地址' : '商家地址' }}</div>
      <div v-if="orderInfo.returnGoodsType === 1 && orderInfo.receiver && orderInfo.receiverPhone" class="acea-row">
        <div class="text-14px text-#666">
          <div class="mb-20px oppoSans-R">收货人：{{ orderInfo.receiver }}</div>
          <div class="mb-20px oppoSans-R">联系电话：{{ orderInfo.receiverPhone }}</div>
          <div class="oppoSans-R">收货地址：{{ orderInfo.receiverAddressDetail }}</div>
        </div>
      </div>
      <div v-if="orderInfo.returnGoodsType === 2" class="acea-row">
        <div class="text-14px text-#666">
          <div class="mb-20px oppoSans-R">商户名称：{{ merchantAddress.name }}</div>
          <div class="mb-20px oppoSans-R">联系电话：{{ merchantAddress.phone }}</div>
          <div class="oppoSans-R">收货地址：{{ merchantAddress.addressDetail }}</div>
        </div>
      </div>
    </div>
    <!--售后信息-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div class="fontColor333 text-16px mb-30px">售后信息</div>
      <div class="acea-row">
        <div class="text-14px text-#666 w-540px oppoSans-R">
          <div class="mb-20px oppoSans-R">售后单号：{{ orderInfo.refundOrderNo }}</div>
          <div class="mb-20px oppoSans-R">申请时间：{{ orderInfo.createTime }}</div>
          <div class="mb-20px oppoSans-R">售后类型：{{ orderInfo.afterSalesType === 1 ? '仅退款' : '退货退款' }}</div>
          <div v-if="orderInfo.returnGoodsType !== 0" class="mb-20px oppoSans-R">
            退货方式：{{
              orderInfo.returnGoodsType === 0 ? '不退货' : orderInfo.returnGoodsType === 1 ? '快递退回' : '到店退货'
            }}
          </div>
          <div class="oppoSans-R mb-20px">退款件数：{{ orderInfo.applyRefundNum }}</div>
          <div class="oppoSans-R">退款方式：原路返回</div>
        </div>
        <div class="w-1px h-124px bg-#EEEEEE"></div>
        <div class="text-14px text-#666 ml-30px w-565px">
          <div class="mb-20px oppoSans-R flex-y-center">
            退款金额：￥{{ orderInfo.refundPrice }}
            <div class="cursors acea-row">
              <el-tooltip class="box-item" effect="light" placement="bottom-start">
                <template #content>
                  1. 在线支付，退款金额原路返还；<br />2. 符合退款规则的优惠券，直接退回您已领取优惠券； <br />3.
                  抵扣积分退回与赠送积分扣除，系统自动进行。</template
                >
                <el-icon color="#CCCCCC" class="ml-6px"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </div>
          <div class="mb-20px oppoSans-R">
            退款原因：
            <span v-if="orderInfo.promoterType === 'user'" class="oppoSans-R">{{ orderInfo.refundReasonWap }}</span>
            <span v-else class="oppoSans-R">商家直接退款</span>
          </div>
          <div class="mb-20px oppoSans-R">
            备注说明：{{ orderInfo.refundReasonWapExplain ? orderInfo.refundReasonWapExplain : '-' }}
          </div>
          <div class="acea-row oppoSans-R">
            售后凭证：
            <div v-if="orderInfo.refundReasonWapImg">
              <el-image
                v-for="item in orderInfo.refundReasonWapImg.split(',')"
                :src="item"
                :preview-src-list="orderInfo.refundReasonWapImg.split(',')"
                class="cursors w-66px h-66px b-rd-6px mr-10px"
              ></el-image>
            </div>
            <div>-</div>
          </div>
        </div>
      </div>
    </div>
    <!--商品信息-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div class="flex-between-center mb-30px">
        <div class="fontColor333 text-16px">商品信息</div>
        <div class="text-#999999 font-400 oppoSans-R text-14px">
          订单号：<span class="text-#333333 font-400 oppoSans-R text-14px">{{ orderInfo.orderNo }}</span>
        </div>
      </div>
      <confirm-product :list="orderInfo" :productType="orderInfo.productType"></confirm-product>
    </div>

    <!--操作按钮-->
    <!-- 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销 -->
    <!--    v-show="orderInfo.refundStatus !== 3 && orderInfo.refundStatus !== 6"-->
    <div class="w-100% borRadius bg-#FFF py-18px px-30px mbtom20 flex-between-center">
      <div></div>
      <div>
        <el-button round class="w-120px btn" @click="handleChat">联系客服</el-button>
        <el-button
          v-if="orderInfo.refundStatus === 0 || orderInfo.refundStatus === 4 || orderInfo.refundStatus === 5"
          round
          class="w-120px btn"
          @click="handleRevokeRefund(orderInfo.refundOrderNo)"
          >撤销售后</el-button
        >
        <el-button
          v-if="orderInfo.refundStatus === 4 && orderInfo.afterSalesType === 2"
          round
          type="primary"
          class="w-120px btn"
          @click="handleReturningRefund(orderInfo)"
          >退回商品</el-button
        >
      </div>
    </div>

    <!--退回商品-->
    <returning-goods
      :returnGoodsType="returnGoodsType"
      :refundOrderNo="refundOrderNo"
      :isShowDialog="dialogVisible"
      @handleSubmitSuccess="handleSubmitSuccess"
      v-if="dialogVisible"
      :merchantAddressDetail="merchantAddress"
      @handleSubmitClose="handleSubmitClose"
    ></returning-goods>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-step__head.is-success) {
  --el-color-success: #e93323;
}
:deep(.el-step__title.is-success) {
  --el-color-success: #333333;
}
.btn {
  height: 44px;
  line-height: 44px;
  border-radius: 33px 33px 33px 33px;
  font-size: 16px;
}
</style>
