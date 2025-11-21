<!--商品价格，包括普通价、会员价-->
<script setup lang="ts">
import {toRefs, reactive, computed} from 'vue'
import { useAppStore } from '~/stores/app'
import { GlobalDatas } from '~/types/user'

const props = defineProps({
  //是否展示返回按钮
  productPrice: {
    type: Object ,
    default: null,
  },
  //普通商品样式
  priceStyle: {
    type: Object,
    default: null,
  },
  topStyle: {
    type: Object,
    default: null,
  }
})
const { productPrice, priceStyle, topStyle } = toRefs(props)

//全局配置
const appStore = useAppStore()
const globalData = computed(()=>reactive<GlobalDatas>(<GlobalDatas>appStore?.globalData))
</script>

<template>
  <div class="acea-row items-baseline line-heightOne">
    <div class="x-money mr-8px acea-row items-baseline relative font-color" :style="topStyle">
      <span class="oppoSans-M">￥</span>
      <div class="dinProSemiBold vipPrice" :style="priceStyle">
        {{ globalData.userIsPaidMember && productPrice.isPaidMember ? productPrice.vipPrice : productPrice.price }}
      </div>
    </div>

    <div
      v-if="globalData.userIsPaidMember && productPrice.isPaidMember"
      class="svip-icon acea-row row-middle h-18px lh-19px"
    >
      <div class="text-11px">SVIP会员价</div>
    </div>
    <div
      v-if="!globalData.userIsPaidMember && globalData.paidMemberPriceDisplay === 'all' && productPrice.isPaidMember"
      class="svip-price acea-row row-middle"
    >
      <div class="icon pl-10px h-18px lh-19px" :class="productPrice.vipPrice.length>5?'text-7px':'text-11px'">SVIP</div>
      <div class="price ml-3px dinProSemiBold" :class="productPrice.vipPrice.length>5?'text-13px':''">¥ {{ productPrice.vipPrice }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.x-money {
  top: 3px;
  font-weight: 700;
}
.vipPrice {
}
.svip-price {
  padding: 0 6px 0 0;
  background: #fff0d1;
  border-radius: 30px 28px 28px 13px;
  .icon {
    font-weight: 600;
    color: #fddaa4;
    padding-right: 3px;
    padding: 0 3px 0 5px;
    border-radius: 8px 0 8px 1px;
    background: linear-gradient(180deg, #484643 100%, #1f1b17 100%);
  }
  .price {
    color: #333333;
  }
}
.svip-icon {
  padding: 0 8px;
  background: linear-gradient(180deg, #fdf6ec 0%, #ffe3b7 100%);
  color: #70490c;
  border-radius: 18px 20px 20px 0.4px;
}
</style>
