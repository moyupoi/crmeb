<!--下单页中的商品信息-->
<script setup lang="ts">
import { Mul } from '~/utils/util'
import { toRefs } from 'vue'
import { ProductTypeEnum } from '@/enums/productEnums'
import useOrder from '~/composables/useOrder'
import {ProductMarketingTypeEnum} from "~/enums/productEnums";
const { handlerProDetailLink } = useOrder()
const props = defineProps({
  //列表数据
  list: {
    type: Object,
    default: null,
  },
  //订单类型:0-基础订单,1-秒杀订单,2-拼团订单
  productType: {
    type: Number,
    default: 0,
  },
  // 商户信息
  merchantInfo: {
    type: Object,
    default: null,
  },
  // 订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
  secondType: {
    type: Number,
    default: 0,
  }
  //秒杀状态
  // seckillStatus: {
  //   type: Number,
  //   default: 0,
  // }
  // //秒杀时间
  // datatime: {
  //   type: Number,
  //   default: 0,
  // }
})
const { list, productType, secondType } = toRefs(props)

// 商品详情跳转
const handlerDetailLink = () => {
  if (secondType.value !== ProductTypeEnum.Integral && productType?.value !== ProductMarketingTypeEnum.Groupbuying){
    handlerProDetailLink(list.value.productId, productType.value)
  }else{
    feedback.msgWarning(productType?.value == ProductMarketingTypeEnum.Groupbuying?'拼团商品请在移动端购买':'积分商品请在移动端购买')
  }
}
</script>

<template>
  <div @click="handlerDetailLink" class="flex-between-center mbtom30 cursors">
    <div class="acea-row justify-between">
      <el-image :src="list.image" class="backImg w100px h100px b-rd-12px" lazy></el-image>
      <div class="ml-20px acea-row flex-col justify-center">
        <div class="text-14px fontColor333 font-500 line1 mb14px w-580px oppoSans-M" :title="list.productName">
          {{ list.productName }}
        </div>
        <div class="borRadius text-14px fontColor333 line1 oppoSans-R mb-10px">规格：{{ list.sku }}</div>
      </div>
    </div>
    <div class="flex-x-center flex-y-center">
      <div v-if="list.price || list.productPrice" class="w-160px text-14px oppoSans-R fontColor333">
        ￥{{ list.price || list.productPrice }}
      </div>
      <div v-if="list.payNum" class="w-100px text-right text-14px oppoSans-R fontColor333">×{{ list.payNum }}</div>
      <div v-if="list.price && list.payNum" class="w-160px text-right font-color text-12px">
        <span class="oppoSans-M">￥</span
        ><span class="dinProSemiBold text-18px fw-600">{{ Mul(list.price, list.payNum) }}</span>
        <span v-show="secondType === ProductTypeEnum.Integral">
          <span ref="hao"> + </span>
          <span class="text-18px font-color fw-600 dinProRegular">{{ list.redeemIntegral }}</span>
          <span class="font-color oppoSans-M ml-5px">积分</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
