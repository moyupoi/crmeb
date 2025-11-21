<script setup lang="ts">
import { orderDetailApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
import { CartBatchAdd, NavigateToTitle } from '~/types/order'
import { ref, reactive } from 'vue'
const { handleIntoPage } = useOrder()
import { activeStatuFilter } from '~/utils/filter'
import SystemFromInfo from '~/components/systemFromInfo.vue'

const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo)
const loading = ref<boolean>(false)
const type = ref<number>(0) //订单类型 0-普通订单，1-视频号订单,2-秒杀订单

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
const shippingType = ref<number>(1) //是快递还是自提 1快递2自提
const getOrderDetail = async () => {
  loading.value = true
  await orderDetailApi(orderNo.value)
    .then((res) => {
      Object.assign(orderInfo, res)
      userAddress.value = res.merchantOrderList.filter((item: any) => {
        return item.shippingType === 1
      })
      orderExtend.value = res.orderExtend ? JSON.parse(res.orderExtend) : []
      cartInfo.value = res.merchantOrderList[0].orderInfoList
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getOrderDetail()

// 地址跳转
const handlerNuxtLink = async () => {
  await linkNavigateTo(`/order/order_logistics`, { orderNo: orderNo.value })
}

const useOrders = useOrder()

//立即付款
const handlePaymentOrder = (orderNo: string) => {
  linkNavigateTo(`/order/order_payment`, { orderNo: orderNo })
}

//倒计时结束
const isShowCancelTime = ref<boolean>(false)
const stopTime = () => {
  isShowCancelTime.value = true
}

//复制
const { handleCopy } = useCopy()
const copyText = (Number: string) => {
  handleCopy(Number)
}
const navigateToTitle = reactive<NavigateToTitle>({
  title: '我的订单',
  linkUrl: '/users/order_list',
  params: { type: 1, page: route.query.page, orderStatus: route.query.orderStatus },
})
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
      <div class="fontColor333 text-16px">订单状态：{{ orderStatusFilter(orderInfo.status) }}</div>
      <div v-if="orderInfo.status !== 9 && orderInfo.status !== 3" class="mt-40px">
        <el-steps :active="activeStatuFilter(orderInfo.status)" align-center finish-status="success">
          <el-step title="待付款" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="已收货" />
          <el-step title="已完成" />
        </el-steps>
      </div>
    </div>
    <!--订单基本信息-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div class="fontColor333 text-16px mb-30px">订单基本信息</div>
      <div class="acea-row">
        <div class="text-14px fontColor333 w-540px">
          <div class="mb-20px">订单编号：{{ orderInfo.orderNo }}</div>
          <div class="mb-20px">下单时间：{{ orderInfo.createTime }}</div>
          <div v-show="orderInfo.payType" class="mb-20px">支付方式：{{ payTypeFilter(orderInfo.payType) }}</div>
        </div>
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
        >
          {{ item.merName }}
        </div>
      </div>
      <div v-for="itm in item.orderInfoList">
        <confirm-product :list="itm" :productType="orderInfo.type" useType="orderDetails"></confirm-product>
        <div
          v-show="orderInfo.secondType === 5"
          class="acea-row flex-justify-between bg-#F5F5F5 w-100% h-44px lh-44px b-rd-4px px-10px"
          style="margin-top: -10px"
        >
          <div class="text-14px text-#666">{{ itm.expand }}</div>
          <div class="text-14px font-color cursors" @click="copyText(itm.expand)">复制</div>
        </div>
        <div v-show="orderInfo.secondType === 6" style="margin-top: -10px">
          <div
            v-for="items in itm.cardSecretList"
            :key="items.id"
            class="acea-row flex-justify-between bg-#F5F5F5 w-100% h-44px lh-44px b-rd-4px px-10px mb-10px"
          >
            <div class="acea-row">
              <div class="text-14px text-#666">卡号{{ items.cardNumber }}</div>
              <div class="text-14px text-#666 ml-50px">密码{{ items.secretNum }}</div>
            </div>
            <div
              class="text-14px font-color cursors"
              @click="copyText('卡号:' + items.cardNumber + ',密码:' + items.secretNum)"
            >
              复制
            </div>
          </div>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <div class="acea-row mb20px">
        <div class="text-14px fontColor6">配送方式：</div>
        <div class="text-14px fontColor6 ml-10px">自动发货</div>
      </div>
      <div class="acea-row">
        <div class="text-14px fontColor6">买家留言：</div>
        <div class="text-14px fontColor6 ml-10px">{{ item.userRemark || '-' }}</div>
      </div>
    </div>
    <!--系统表单信息-->
    <SystemFromInfo v-if="orderExtend?.length" :orderExtend="orderExtend"></SystemFromInfo>
    <!--费用详情-->
    <div class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
      <div v-if="orderInfo.payPostage > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">运费:</div>
        <div class="text-14px fontColor333">
          <span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.payPostage }}</span>
        </div>
      </div>
      <div v-if="orderInfo.merCouponPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">商家优惠:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.merCouponPrice || 0 }}</span>
        </div>
      </div>
      <div v-if="orderInfo.platCouponPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">平台优惠:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.platCouponPrice || 0 }}</span>
        </div>
      </div>
      <div v-if="orderInfo.integralPrice > 0" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">积分抵扣:</div>
        <div class="text-14px fontColor333">
          -<span class="oppoSans-M">￥</span><span class="dinProRegular">{{ orderInfo.integralPrice || 0 }}</span>
        </div>
      </div>
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
      <div class="text-14px">
        合计： <span class="font-color oppoSans-M">￥</span
        ><span class="text-22px font-color fw-600 dinProRegular">{{ orderInfo.payPrice || 0 }}</span>
      </div>
      <div class="handleBtnBox">
        <!--        <el-button round class="w-150px btn">联系客服</el-button>-->
        <el-button
          v-if="orderInfo.status == 0"
          round
          class="w-120px btn"
          @click="useOrders.onCancelOrder(orderInfo.orderNo)"
          >取消订单</el-button
        >
        <el-button
          v-if="orderInfo.status == 6 || orderInfo.status == 9"
          round
          class="w-120px btn"
          @click="useOrders.onDeleteOrder(orderInfo.orderNo)"
          >删除订单</el-button
        >
        <el-button
          v-if="orderInfo.status == 0 && !isShowCancelTime"
          color="#E93323"
          round
          class="w-120px btn"
          @click="handlePaymentOrder(orderInfo.orderNo)"
          >立即付款</el-button
        >
        <el-button
          v-if="orderInfo.status == 4"
          color="#E93323"
          round
          class="w-120px btn text-16px"
          @click="useOrders.onConfirmOrder(orderInfo.orderNo)"
          >确认收货</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-divider--horizontal) {
  margin: 20px 0;
}
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
