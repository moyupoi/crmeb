<!--商品信息，订单列表、评论列表中展示-->
<script setup lang="ts">
import { toRefs } from 'vue'
import useOrder from '~/composables/useOrder'
const { handlerProDetailLink } = useOrder()
const props = defineProps({
  //列表数据
  list: {
    type: Object,
    default: null,
  },
  refundStatus: {
    type: Number,
    default: null,
  },
})
const { list, refundStatus } = toRefs(props)

//商品详情跳转
const handlerNuxtLinks = async (list: any) => {
  if (refundStatus.value && refundStatus.value === -1) {
    await handlerProDetailLink(list.productId, list.type ? list.type : 0)
  }
}

//跳转至申请记录
const emit = defineEmits(['onHandlerToRecord'])
const handlerToRecord = async (orderNo: string) => {
  emit('onHandlerToRecord', orderNo)
}
</script>

<template>
  <div class="flex-between-center orderProduct cursors">
    <div class="acea-row justify-between" @click="handlerNuxtLinks(list)">
      <el-image :src="list.image" class="backImg w100px h100px b-rd-12px" lazy></el-image>
      <div class="ml-20px acea-row flex-col justify-center">
        <div class="text-14px fontColor333 line1 mb14px w-635px font-500 oppoSans-M">{{ list.productName }}</div>
        <div class="borRadius text-14px fontColor333 line1 mb-15px font-400 oppoSans-R">规格：{{ list.sku }}</div>
        <div class="acea-row">
          <div v-if="list.price && list.payNum" class="text-14px fontColor333 oppoSans-R mr-20px">
            ￥{{ list.price }} ×{{ list.payNum }}
          </div>
          <div
            @click.stop="handlerToRecord(list.orderNo)"
            v-if="list.applyRefundNum + list.refundNum && refundStatus === -1"
            class="text-14px font-color oppoSans-R mr-20px flex-y-center"
          >
            {{ list.applyRefundNum + list.refundNum }}件商品已申请售后 <span class="iconfont icon-gengduo"></span>
          </div>
          <div v-if="list.applyRefundNum && refundStatus > -1" class="text-14px font-color oppoSans-R mr-20px">
            售后申请数量：{{ list.applyRefundNum }}
          </div>
          <div v-if="list.afterSalesType" class="text-14px font-color oppoSans-R mr-20px">
            {{ list.afterSalesType === 1 ? '仅退款' : '退货退款' }}
          </div>
          <div v-if="list.refundStatus === 3" class="text-14px font-color">已退款：{{ list.refundPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orderProduct {
  margin-bottom: 20px;
}
</style>
