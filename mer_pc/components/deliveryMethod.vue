<script setup lang="ts">
import {toRefs} from "vue";
import { ProductTypeEnum } from '@/enums/productEnums'

const props = defineProps({
  orderInfo: {
    type: Object,
    default: {}
  },
  item: {
    type: Object,
    default: {}
  }
})
const { orderInfo, item } = toRefs(props)
</script>

<template>
<div>
  <div v-if="orderInfo.secondType === ProductTypeEnum.Reservation">
    <div class='text-14px fontColor6 acea-row mb20px'>
      <div class="text-14px fontColor6">预约时间：</div>
      <div class='fontColor6'>{{ item.reservationDate || '-' }} , {{ item.reservationTimeSlot || '-' }}</div>
    </div>
    <div class='item acea-row text-14px'>
      <div class="fontColor6">预约方式：</div>
      <div class='fontColor6'>{{item.shippingType == 4 ? '到店': '上门'}}</div>
    </div>
  </div>
  <div v-else class="acea-row mb20px">
    <div class="text-14px fontColor6">配送方式：</div>
    <div v-if="orderInfo.secondType > 4" class="text-14px fontColor6 ml-10px">自动发货</div>
    <div v-if="orderInfo.secondType === 2" class="text-14px fontColor6 ml-10px">虚拟发货</div>
    <div v-else class="text-14px fontColor6 ml-10px">
      {{ item.shippingType === 1 ? '商家配送' : '到店自提，请前往移动端操作' }}
    </div>
  </div>
</div>
</template>
<style scoped>

</style>