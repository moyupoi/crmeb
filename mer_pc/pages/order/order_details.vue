<script setup lang="ts">
import { invoiceListApi, orderDetailApi, orderListApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
import { CartBatchAdd, NavigateToTitle } from '~/types/order'
import { ref, reactive, computed } from 'vue'
const { handleIntoPage, isBuyAgain, isRefund, isRefunded } = useOrder()
import { activeStatuFilter } from '~/utils/filter'
import { linkNavigateTo } from '~/utils/util'
import feedback from '~/utils/feedback'
import { ProductTypeEnum, RefundStatusEnum } from '@/enums/productEnums'
import SystemFromInfo from '~/components/systemFromInfo.vue'

const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo)
const page = ref<string>(<string>route.query.page)
const orderStatus = ref<string>(<string>route.query.orderStatus)
const loading = ref<boolean>(false)
const type = ref<number>(0) //订单类型:0-基础订单,1-秒杀订单,2-拼团订单

const bgColor = reactive<any>({
  bgColor: '',
  Color: '#E93323',
  width: '36rpx',
  timeTxtwidth: '16rpx',
  isDay: true,
  fontSize: '14px',
})

/**
 * 订单详情
 */
const orderInfo = reactive({})
const cartInfo = ref([]) //再次购买加入购物车的商品
const userAddress = ref([])
const orderExtend = ref([]) // 系统表单数据
const isUserAddress = ref<boolean>(false) //是否只显示一次收货地址
const shippingType = ref<number>(1) //是快递还是自提 1快递2自提
const getOrderDetail = async () => {
  loading.value = true
  await orderDetailApi(orderNo.value)
    .then((res) => {
      Object.assign(orderInfo, res)
      userAddress.value = res.merchantOrderList.filter((item: any) => {
        return item.shippingType === 1
      })
      shippingType.value = res.merchantOrderList[0].shippingType
      cartInfo.value = res.merchantOrderList[0].orderInfoList
      if(orderInfo.secondType === ProductTypeEnum.Reservation){
        orderExtend.value = res.orderExtend ? JSON.parse(res.orderExtend) : []
      }else{
        orderExtend.value = res.orderExtend ? [JSON.parse(res.orderExtend)] : []
      }

      isUserAddress.value = userAddress.value.length > 0 ? true : false
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getOrderDetail()

//物流列表
const { data: invoiceList } = await useAsyncData(async () => invoiceListApi(orderNo.value))
// 地址跳转
const handlerNuxtLink = async () => {
  await linkNavigateTo(`/order/order_logistics`, { orderNo: orderNo.value, secondType: orderInfo.secondType })
}

//去退款列表
const handleToOrderRefund = async (orderNo: string) => {
  await linkNavigateTo(`/users/refund_list`, { type: 9, orderNo: orderNo })
}

const useOrders = useOrder()
//再次购买
const handleByAgain = async () => {
  let cartListRequest: Array<CartBatchAdd> = []
  cartInfo.value.map((item) => {
    cartListRequest.push({
      productId: parseFloat(item.productId),
      productAttrUnique: item.attrValueId,
      cartNum: parseFloat(item.payNum),
    })
  })
  await useOrders.onByAgain(cartListRequest)
}

//立即付款
const handlePaymentOrder = (orderNo: string) => {
  linkNavigateTo(`/order/order_payment`, { orderNo: orderNo })
}

//倒计时结束
const isShowCancelTime = ref<boolean>(false)
const stopTime = () => {
  isShowCancelTime.value = true
}
const navigateToTitle = reactive<NavigateToTitle>({
  title: '我的订单',
  linkUrl: '/users/order_list',
  params: { type: 1, page: page.value, orderStatus: orderStatus.value },
})

//确认收货
const handleConfirmOrder = async () => {
  let applyRefundNum = 0
  orderInfo.merchantOrderList.map((item) => {
    item.orderInfoList.map((i) => {
      applyRefundNum = Number(i.applyRefundNum)
    })
  })
  //如果有售后中的，给提示
  if (applyRefundNum > 0) {
    return feedback.confirm('请先撤销售后，再进行收货操作!').then(async () => {})
  } else {
    useOrders.onConfirmOrder(orderInfo.orderNo)
  }
}
</script>

<template>
  <div class="wrapper_1200" v-loading="loading">
    <page-header title="订单详情" :navigateToTitle="navigateToTitle"></page-header>
    <div v-if="orderInfo.status === 0 && !isShowCancelTime" class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div class="acea-row font-color">
        <countDown
          class="ml-5px mr-5px"
          :is-day="true"
          :tip-text="' '"
          :day-text="' '"
          :hour-text="' : '"
          :minute-text="' : '"
          :second-text="' '"
          :datatime="orderInfo.cancelTime / 1000"
          :isCol="false"
          :bgColor="bgColor"
          @stopTime="stopTime"
        >
        </countDown>
        <div>后订单取消</div>
      </div>
    </div>
    <!--订单状态-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <view v-if="orderInfo.refundStatus == 3"  class="fontColor333 text-16px">订单状态：已退款</view>
      <div v-else class="fontColor333 text-16px">订单状态：{{ orderStatusFilter(orderInfo.status) }}</div>
      <div v-if="orderInfo.status !== 9 && orderInfo.status !== 3 && orderInfo.refundStatus !== 3" class="mt-40px">
        <el-steps :active="activeStatuFilter(orderInfo.status)" align-center finish-status="success">
          <el-step title="待付款" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="已收货" />
          <el-step title="已完成" />
        </el-steps>
      </div>
    </div>
    <!-- 物流信息-->
    <div
      v-if="Number(orderInfo.status) > 1 && Number(orderInfo.status) < 9 && orderInfo.status != 3 && shippingType == 1"
      @click="handlerNuxtLink"
      class="w-100% borRadius bg-#FEF5F4 h-50px lh-49px px-30px mbtom20 flex-between-center cursors"
    >
      <div class="font-color text-14px lh-14px">
        <span class="iconfont icon-xiaoxi mr-10px"></span>
        <span v-if="invoiceList.num > 1">当前订单已发{{ invoiceList.deliveryNum }}个包裹</span>
        <span v-else>当前订单有{{ invoiceList.num }}个包裹</span>
      </div>
      <div class="text-14px text-#666 lh-14px">发货记录 ></div>
    </div>
    <!--订单基本信息-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div class="fontColor333 text-16px mb-30px">订单基本信息</div>
      <div class="acea-row">
        <div class="text-14px fontColor333 w-540px">
          <div class="mb-20px">订单编号：{{ orderInfo.orderNo }}</div>
          <div class="mb-20px">下单时间：{{ orderInfo.createTime }}</div>
          <div
            v-show="
              (orderInfo.secondType === ProductTypeEnum.Integral && orderInfo.payPrice != 0) ||
              (orderInfo.payType && orderInfo.secondType !== ProductTypeEnum.Integral)
            "
            class="mb-20px"
          >
            支付方式：{{ payTypeFilter(orderInfo.payType) }}
          </div>
        </div>
        <template v-if="isUserAddress && orderInfo.secondType !== ProductTypeEnum.Fictitious">
          <div class="w-1px h-124px bg-#EEEEEE"></div>
          <!-- 收货地址只显示一次 -->
          <div class="text-14px fontColor333 ml-30px w-565px">
            <div class="mb-20px">收货人：{{ userAddress[0].realName }}</div>
            <div class="mb-20px">联系电话：{{ userAddress[0].userPhone }}</div>
            <div class="">收货地址：{{ userAddress[0].userAddress }}</div>
          </div>
        </template>
      </div>
    </div>
    <!--商品信息-->
    <div
      v-for="item in orderInfo.merchantOrderList"
      :key="item.id"
      class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20"
    >
      <div class="acea-row mb-30px">
        <div v-if="item.isSelf">
          <span
            class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
            style="top: -2px"
            >自营</span
          >
        </div>
        <div
          @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.merId })"
          class="fontColor333 text-14px cursors"
          v-show="item.merName"
        >
          {{ item.merName }}
        </div>
        <div class="fontColor333 text-14px cursors" v-show="orderInfo.secondType === ProductTypeEnum.Integral">
          积分商品兑换
        </div>
      </div>
      <div v-for="itm in item.orderInfoList">
        <confirm-product
          :list="itm"
          :productType="orderInfo.type"
          :secondType="orderInfo.secondType"
          useType="orderDetails"
        ></confirm-product>
      </div>
      <el-divider border-style="dashed" />
      <div class="">
        <delivery-method :orderInfo="orderInfo" :item="item"></delivery-method>
        <div v-if="item.shippingType === 2" class="acea-row">
          <div class="text-14px fontColor6">
            商户信息：<span class="ml-10px"
              >{{ item.merName }}， {{ item.merAddressDetail }}， {{ item.merPhone }}</span
            >
          </div>
        </div>
        <div class="acea-row mb20px mt-20px">
          <div class="text-14px fontColor6">买家留言：</div>
          <div class="text-14px fontColor6 w-1064px">{{ item.userRemark || '-' }}</div>
        </div>
      </div>
    </div>
    <!--系统表单信息-->
    <SystemFromInfo v-if="orderExtend?.length > 0" :orderExtend="orderExtend"></SystemFromInfo>
    <!--费用详情-->
    <div
      v-show="orderInfo.secondType !== ProductTypeEnum.Integral"
      class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20"
    >
      <div v-show="orderInfo.payPostage > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">运费:</div>
        <div class="text-14px fontColor333">
          <span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.payPostage }}</span>
        </div>
      </div>
      <div v-show="orderInfo.svipDiscountPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">会员优惠:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.svipDiscountPrice || 0 }}</span>
        </div>
      </div>
      <div v-show="orderInfo.merCouponPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">商家优惠:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.merCouponPrice || 0 }}</span>
        </div>
      </div>
      <!-- <div v-show="orderInfo.platCouponPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">平台优惠:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.platCouponPrice || 0 }}</span>
        </div>
      </div>
      <div v-show="orderInfo.integralPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">积分抵扣:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.integralPrice || 0 }}</span>
        </div>
      </div> -->
      <div class="acea-row justify-between">
        <div class="text-14px fontColor6">实付款:</div>
        <div class="text-14px fontColor333">
          <span class="font-color oppoSans-M">￥</span
          ><span class="text-22px font-color fw-600 dinProRegular">{{ orderInfo.payPrice || 0 }}</span>
        </div>
      </div>
    </div>

    <!--操作按钮-->
    <!-- 订单状态（0：待支付，1：待发货,2：部分发货， 3：待使用，4：待收货,5：已收货,6：已完成，9：已取消） -->
    <div class="w-100% borRadius bg-#FFF py-18px px-30px mbtom20 flex-between-center">
      <div class="text-14px fontColor6">
        合计： <span class="font-color oppoSans-M">￥</span
        ><span class="text-22px font-color fw-600 dinProRegular">{{ orderInfo.payPrice || 0 }}</span>
        <span v-show="orderInfo.secondType === ProductTypeEnum.Integral">
          <span ref="hao"> + </span>
          <span class="text-22px font-color fw-600 dinProRegular">{{ orderInfo.redeemIntegral }}</span>
          <span class="font-color oppoSans-M ml-5px">积分</span>
        </span>
      </div>
      <div class="handleBtnBox">
        <!--        <el-button round class="w-150px btn">联系客服</el-button>-->
        <el-button
          v-if="orderInfo.status == 0 && !isRefunded(orderInfo)"
          round
          class="w-120px btn"
          @click="useOrders.onCancelOrder(orderInfo.orderNo)"
          >取消订单</el-button
        >
        <el-button
          v-if="(orderInfo.status == 6 || orderInfo.status == 9) && !isRefunded(orderInfo)"
          round
          class="w-120px btn"
          @click="useOrders.onDeleteOrder(orderInfo.orderNo)"
          >删除订单</el-button
        >
        <el-button
          v-if="orderInfo.status == 0 && !isShowCancelTime && !isRefunded(orderInfo)"
          color="#E93323"
          round
          class="w-120px btn"
          @click="handlePaymentOrder(orderInfo.orderNo)"
          >立即付款</el-button
        >
        <el-button
          v-if="orderInfo.status > 0 && isBuyAgain(orderInfo) && orderExtend.length === 0 && !isRefunded(orderInfo)"
          :color="Number(orderInfo.status) === 4 ? '' : '#E93323'"
          round
          class="w-120px btn"
          @click="handleByAgain"
          >再次购买</el-button
        >
        <el-button
          v-if="
            orderInfo.refundStatus === RefundStatusEnum.未退款 &&
            isRefund(orderInfo, cartInfo[0]) &&
            !isRefunded(orderInfo)
          "
          round
          class="w-120px btn text-16px"
          @click="handleToOrderRefund(orderInfo.orderNo)"
          >申请退款</el-button
        >
        <el-button
          v-if="orderInfo.status == 4 && !isRefunded(orderInfo)"
          color="#E93323"
          round
          class="w-120px btn text-16px"
          @click="handleConfirmOrder()"
          >确认收货</el-button
        >
      </div>
    </div>
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
