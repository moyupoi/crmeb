<script setup lang="ts">
import { aliPayResultApi, orderDetailApi, wechatPayResultApi } from '~/server/orderApi'
import { ref, reactive } from 'vue'
import { linkNavigateTo } from '~/utils/util'

const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo)
const loading = ref<boolean>(false)
/**
 * 订单详情
 */
const payResult = ref<string>('')
const orderInfo = reactive({})
const getOrderDetail = async () => {
  loading.value = true
  await orderDetailApi(orderNo.value)
    .then((res) => {
      Object.assign(orderInfo, res)
      if (orderInfo.payType === 'weixin') {
        getWechatPayResult()
      } else if (orderInfo.payType === 'alipay') {
        getAliPayResult()
      } else {
        if (orderInfo.paid) {
          payResult.value = '支付成功'
        } else {
          payResult.value = '支付失败'
        }
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
if (orderNo.value && orderNo.value !== '0') {
  getOrderDetail()
} else {
  payResult.value = '订单支付超时'
}

//支付宝支付查询结果
const aliPayResult = ref<boolean>(false)
const getAliPayResult = async () => {
  try {
    loading.value = true
    let data = await aliPayResultApi(orderNo.value)
    aliPayResult.value = data
    if (data) {
      payResult.value = '支付成功'
      loading.value = false
    }
  } catch (err) {
    payResult.value = err
    loading.value = false
    aliPayResult.value = false
  }
}

//微信支付查询结果
const wechatPayResult = ref<boolean>(false)
const getWechatPayResult = async () => {
  try {
    loading.value = true
    let data = await wechatPayResultApi(orderNo.value)
    wechatPayResult.value = data
    if (data) {
      payResult.value = '支付成功'
      loading.value = false
    } else {
      payResult.value = '支付失败'
      loading.value = false
    }
  } catch (err) {
    wechatPayResult.value = false
    payResult.value = err
    loading.value = false
  }
}

// 地址跳转
const handlerNuxtLinkOrder = async () => {
  await linkNavigateTo(`/users/order_list`, { type: 1 })
}
</script>

<template>
  <div class="wrapper_1200">
    <div class="w-100% borRadius bg-#FFF py-56px px-30px flex-between-center mb-60px mt-20px">
      <div v-loading="loading" class="acea-row">
        <img class="backImg w100px h88px" src="~/assets/images/tjchenggong.png" alt="" />
        <div class="ml-30px acea-row flex-col flex-justify-around">
          <div class="text-20px fontColor333 fw-700">{{ payResult }}</div>
          <div v-if="orderInfo.payType === 'alipay' && aliPayResult" class="borRadius text-14px">
            实付款：<span class="font-color oppoSans-M">￥</span
            ><span class="text-30px font-color fontsweight dinProRegular">{{ orderInfo.payPrice }}</span>
          </div>
          <div v-else-if="orderInfo.payType === 'weixin' && wechatPayResult" class="borRadius text-14px">
            实付款：<span class="font-color oppoSans-M">￥</span
            ><span class="text-30px font-color fontsweight dinProRegular">{{ orderInfo.payPrice }}</span>
          </div>
          <div v-else-if="orderInfo.payType === 'yue' && orderInfo.paid" class="borRadius text-14px">
            实付款：<span class="font-color oppoSans-M">￥</span
            ><span class="text-30px font-color fontsweight dinProRegular">{{ orderInfo.payPrice }}</span>
          </div>
          <!--          <div v-else-if="orderInfo.paid && orderNo && orderNo !== '0'&&payType" class="borRadius text-14px">-->
          <!--            实付款：<span class="font-color">￥</span><span class="text-30px font-color fontsweight">{{ orderInfo.payPrice }}</span>-->
          <!--          </div>-->
          <div v-else>若有疑问，请联系客服</div>
          <div v-if="orderNo === '0'">订单支付已超时，您可在订单列表重新下单～</div>
        </div>
      </div>
      <div @click="handlerNuxtLinkOrder" class="handleBtn w-150px h-50px lh-49px text-16px cursors">查看订单</div>
    </div>
    <recommend></recommend>
  </div>
</template>

<style scoped lang="scss"></style>
