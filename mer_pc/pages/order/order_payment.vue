<script setup lang="ts">
import { payConfigApi, payGetCashierApi, payPaymentApi } from '~/server/orderApi'
import { ref, reactive } from 'vue'
import QrcodeVue from 'qrcode.vue'
const { routeQuery } = useRouterItem()
const userStore = useUserStore()
//收银台信息
const {
  data: payInfo,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => payGetCashierApi(routeQuery.orderNo))
if (!payInfo.value) linkNavigateTo(`/users/order_list`, { type: 1 })

const bgColor = reactive<any>({
  bgColor: '',
  Color: '#E93323',
  width: '36rpx',
  timeTxtwidth: '16rpx',
  isDay: true,
  fontSize: '14px',
})

/**
 * 获取支付配置
 */
const payTypeList = ref<any[]>([
  {
    name: '微信支付',
    id: 1,
    value: 'weixin',
    tips: '使用微信扫码支付',
    payStatus: false,
    icon: 'icon-weixinzhifu',
  },
  {
    name: '支付宝支付',
    id: 2,
    value: 'alipay',
    tips: '使用支付宝扫码支付',
    payStatus: false,
    icon: 'icon-zhifubaozhifu',
  },
  {
    name: '余额支付',
    id: 3,
    value: 'yue',
    tips: '余额',
    payStatus: false,
    userBalance: '',
    icon: 'icon-yuezhifu',
  },
])
const loading = ref<boolean>(false)
const isShow = ref<boolean>(false)
const getPayConfig = async () => {
  loading.value = true
  await payConfigApi()
    .then((res) => {
      payTypeList.value[2].payStatus = res.yuePayStatus
      payTypeList.value[2].userBalance = res.userBalance ? res.userBalance : 0
      payTypeList.value[0].payStatus = res.payWechatOpen
      payTypeList.value[1].payStatus = res.aliPayStatus
      if (payTypeList.value.length) {
        isShow.value = false
      } else {
        isShow.value = true
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getPayConfig()

/**
 * 选择支付方式
 * @param type
 */
const payType = ref<string>('weixin')
const handlePayItem = (type: string) => {
  payType.value = type
}

/**
 * 立即支付
 */
import useDialog from '~/composables/useDialog'
const { bool: dialogVisibleQrcode, DialogOpen, DialogClose } = useDialog()
const payQrcode = ref<string>('') //支付二维码
const payChannel = ref<string>('')
const btnloading = ref<boolean>(false)
const handleOrderPay = async () => {
  if (!payType.value) return feedback.msgWarning('请选择支付方式')
  if (payType.value === 'yue') {
    payChannel.value = 'yue'
  } else if (payType.value == 'alipay') {
    payChannel.value = 'alipayPc'
  } else {
    payChannel.value = 'native'
  }
  btnloading.value = true
  let data = {
    orderNo: routeQuery.orderNo,
    payChannel: payChannel.value,
    payType: payType.value,
  }
  try {
    const res = await payPaymentApi(data)
    if (res.payType === 'alipay') {
      payQrcode.value = res.alipayRequest
      DialogOpen()
    } else if (res.payType === 'yue') {
      linkNavigateTo(`/order/order_pay_status`, { orderNo: routeQuery.orderNo })
    } else {
      payQrcode.value = res.jsConfig.mwebUrl
      DialogOpen()
    }
    btnloading.value = false
  } catch (err: any) {
    btnloading.value = false
    setTimeout(() => {
      linkNavigateTo(`/order/order_pay_status`, { orderNo: routeQuery.orderNo })
    }, 800);
  }
}

/**
 * 支付弹窗
 */

import feedback from '~/utils/feedback'
import useRouterItem from '~/composables/useRouterItem'
import { linkNavigateTo } from '~/utils/util'
import { useUserStore } from '~/stores/user'

const handleCloseQrcode = () => {
  DialogClose()
}

//我已支付
const getPaymentStatus = () => {
  linkNavigateTo(`/order/order_pay_status`, { orderNo: routeQuery.orderNo })
}

//倒计时结束
const stopTime = () => {
  linkNavigateTo(`/order/order_pay_status`, { orderNo: 0 })
}
</script>

<template>
  <div class="wrapper_1200">
    <div v-if="userStore.isLogin" class="order_payment">
      <page-header title="收银台"></page-header>
      <!--提示语-->
      <div v-loading="listLoading" class="w-100% borRadius bg-#FFF py-56px px-30px flex-between-center mbtom20">
        <div class="acea-row">
          <img class="backImg w100px h90px" src="~/assets/images/tjchenggong.png" alt="" />
          <div class="ml-30px acea-row flex-col w-745px">
            <div class="text-20px fontColor333 fw-700 lg-20px mb-27px">订单提交成功，去付款吧~</div>
            <div class="acea-row text-14px fontColor333 lh-14px mb-12px">
              请在
              <countDown
                class="ml-5px mr-5px"
                :is-day="true"
                :tip-text="' '"
                :day-text="' '"
                :hour-text="' : '"
                :minute-text="' : '"
                :second-text="' '"
                :datatime="payInfo.cancelDateTime / 1000"
                :isCol="false"
                :bgColor="bgColor"
                @stopTime="stopTime"
              >
              </countDown
              >内完成支付，超时后订单将会自动取消
            </div>
            <div class="borRadius text-14px lh-20px">
              收货信息：{{ payInfo?.consigneeName }} {{ payInfo?.consigneePhone }} {{ payInfo?.consigneeAddress }}
            </div>
          </div>
        </div>
        <div class="acea-row flex-col flex-justify-around">
          <div class="fontColor333 text-14px mbtom20">
            应付总额：
            <span class="font-color text-14px oppoSans-M"
              >￥<span class="text-30px font-color dinProRegular">{{ payInfo?.payPrice }}</span></span
            >
          </div>
          <div class="text-14px fontColor6 text-right">共{{ payInfo?.totalNum }}件商品</div>
        </div>
      </div>
      <!--支付方式-->
      <div v-if="isShow" class="titleNo">暂无支付方式！</div>
      <div v-else class="w-100% borRadius bg-#FFF py-30px px-30px">
        <div class="fonts16 text-#282828 mbtom30">选择以下支付方式</div>
        <div v-loading="loading" class="acea-row mbtom30">
          <template v-for="item in payTypeList" :key="item.id">
            <div
              v-if="item.payStatus"
              @click="handlePayItem(item.value)"
              :class="payType === item.value ? 'borderSolRed' : 'pay-type'"
              class="w-270px h-80px b-rd-8px flex-x-center flex-y-center mr-20px cursors"
            >
              <span class="iconfont mr-14px" :class="item.icon"></span>
              <div class="acea-row flex-col flex-justify-around">
                <div class="fonts16 text-#4E4E4E mb-6px">{{ item.name }}</div>
                <div class="font12 text-#969696">
                  {{ item.tips }}
                  <span v-if="item.userBalance">：￥{{ item.userBalance }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="acea-row row-right">
          <div
            v-loading="btnloading"
            @click="handleOrderPay"
            class="cursors b-rd-25px bg-color text-center text-#fff w-150px h-50px text-16px line-height-50px"
          >
            立即支付
          </div>
        </div>
      </div>
      <!-- 支付弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        v-model="dialogVisibleQrcode"
        width="450px"
        :title="payType == 'alipay' ? '支付宝支付' : '微信支付'"
        center
        :show-close="false"
        :before-close="handleCloseQrcode"
      >
        <div class="flex-x-center text-#333 text-14px mb-20px mt-4px" style="align-items: end">
          支付：<span class="font-color font-600 oppoSans-M">￥</span
          ><span class="font-color text-30px font-600 lh-30px dinProRegular">{{ payInfo?.payPrice }}</span>
        </div>
        <div class="flex-x-center">
          <qrcode-vue :value="payQrcode" :size="280" level="H" />
        </div>
        <div class="mt-30px text-16px text-#333 text-center">
          请使用{{ payType == 'alipay' ? '支付宝' : '微信' }}扫描二维码支付
        </div>
        <template #footer>
          <div class="dialog-footer flex-x-center">
            <div
              class="borderSol w-120px h-44px lh-43px text-16px text-#333 b-rd-25px cursors"
              @click="handleCloseQrcode"
            >
              放弃支付
            </div>
            <div class="handleBtn w-120px h-44px lh-43px text-16px ml-20px cursors" @click="getPaymentStatus">
              我已支付
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
    <not-logged-in v-else></not-logged-in>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog__title) {
  font-size: 20px !important;
  font-weight: 500;
  color: #333333 !important;
}
.pay {
  &-type {
    border: 1px solid #cccccc;
  }
}
.order_payment {
  .iconfont {
    font-size: 36px;
  }
}

.icon-yuezhifu {
  color: #fe9c01;
}
.icon-weixinzhifu {
  color: #09bb07;
}
.icon-zhifubaozhifu {
  color: #00aaea;
}
</style>
