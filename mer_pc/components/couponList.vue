<!--商户主页优惠券列表、我的优惠券-->
<script setup lang="ts">
import { couponTypeFilter } from '~/utils/filter'
import { toRefs } from 'vue'
import { couponReceiveApi } from '~/server/merchantApi'
import { getCouponTime } from '~/utils/util'
import feedback from '~/utils/feedback'

const props = defineProps({
  //列表数据
  list: {
    type: Array,
    default: [],
  },
  //领取后的文字
  receivedText:{
    type: String,
    default: '',
  },
  //是否要跳转到可使用优惠券的商品列表
  isShowJump: {
    type: Boolean,
    default: false,
  }
})
const { list, isShowJump, receivedText } = toRefs(props)

const loading = ref<boolean>(false)
//领券优惠券
const handleReceiveCoupon = async (item: any) => {
  if (item.isUse) return
  loading.value = true
  try {
    await couponReceiveApi(item.id)
    feedback.msgSuccess('领取成功')
    item.isUse = !item.isUse
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

//去使用
import { linkNavigateTo } from '~/utils/util'
const handleToUse = async (item: any) => {
  if(!isShowJump.value && item.validStr === 'unusable') return
  await linkNavigateTo('/activity/coupon_goods_list', { type: 2,couponId: item.id, isUserReceive: true,money:item.money,minPrice:item.minPrice })
}
</script>

<template>
  <!--  validStr 优惠券有效状态：usable-可用，unusable-已用，overdue-过期，notStart-未开始 || !item.validStr ? 'usable' : ''-->
  <div class="acea-row" v-loading="loading">
    <div
      v-for="item in list"
      :key="item.id"
      class="coupon-item mb-20px w-306px h-130px flex-between-center pos-relative"
      :class="item.validStr ? (item.validStr === 'usable'||item.validStr === 'notStart' ? 'usable' : 'unusable'):'usable'"
    >
      <div class="w-254px h-130px pl-14px pr-5px">
        <div class="flex">
         <div class="mt-27px">
           <div
               class="text-18px flex-y-center mb-6px"
               :class="item.validStr ? (item.validStr === 'usable' ? 'font-color' : 'text-#999') : 'font-color'"
           >
             <span class="mt-13px oppoSans-M">￥</span><span class="text-34px dinProSemiBold">{{ item.money }}</span>
           </div>
           <div
               class="text-12px left-10px text-center w-50px"
           >
            <div :class="item.validStr ? (item.validStr === 'usable'||item.validStr === 'notStart' ? 'font-color bg-#FFE1DE' : 'text-#999 bg-#EDEDED') : 'font-color bg-#FFE1DE'" class="line-heightOne px-7px py-2px b-rd-8px inline-block">{{ couponTypeFilter(item.category) }}</div>
           </div>
         </div>
         <div class="ml-14px mt-24px">
            <div
              class="text-14px mb-14px font-500 h-34px lh-18px line2"
              :class="item.validStr ? (item.validStr === 'usable' ? 'fontColor333' : 'text-#999') : 'fontColor333'"
            >
              {{ item.name }}
            </div>
            <div
              class="text-14px"
              :class="item.validStr ? (item.validStr === 'usable' ? 'text-#666' : 'text-#999') : 'text-#666'"
            >
              满 {{ item.minPrice }} 可用
            </div>
          </div>
        </div>
        <!--领券中心时间显示-->
        <div v-if="item.validStr">
          <div
              v-if="item.startTime && item.endTime && (item.validStr === 'usable' || item.validStr ==='notStart')"
            class="pos-absolute bottom-15px left-14px text-12px text-#666"
          >
            {{ getCouponTime(item.startTime, item.endTime) }}
          </div>
          <div v-if="item.validStr === 'unusable'" class="pos-absolute bottom-15px left-14px text-12px text-#666">
            该优惠券已使用
          </div>
          <div v-if="item.validStr === 'overdue'" class="pos-absolute bottom-15px left-14px text-12px text-#666">
            该优惠券已失效无法使用
          </div>
        </div>
        <!--商户主页领券时间显示-->
        <div v-else>
          <div v-show="item.isFixedTime" class="pos-absolute bottom-15px left-14px text-12px text-#666">
            {{ item.useStartTimeStr }} ~ {{ item.useEndTimeStr }} 可用
          </div>
          <div
            v-show="!item.isFixedTime && !item.validStr"
            class="pos-absolute bottom-15px left-14px text-12px text-#666"
          >
            {{ '领取后' + item.day + '天内可用' }}
          </div>
        </div>
      </div>
      <div v-if="item.validStr" class="w-50px text-#fff text-16px verticalClass" :class="item.validStr === 'unusable'?'':'cursors'" @click="handleToUse(item)">
        {{
          item.validStr === 'usable' || item.validStr === 'notStart'
            ? receivedText
            : item.validStr === 'unusable'
            ? '已使用'
            : '已失效'
        }}
      </div>
      <div v-else class="w-50px text-#fff text-16px verticalClass" :class="!item.isUse?'cursors':''" @click="handleReceiveCoupon(item)">
        {{ item.isUse ? '已领取' : '立即领取' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.manage {
  display: flex;
  align-items: center; /* 在交叉轴上居中对齐 */
  writing-mode: vertical-rl;
  text-orientation: upright;
  white-space: nowrap;
}
.coupon {
  &-item {
    margin-right: 20px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .item {
    position: relative;
    cursor: pointer;
    &.on {
      color: #e93323;
    }
  }
  .usable {
    background-image: url('@/assets/images/mycoupon.png');
  }
  .unusable {
    background-image: url('@/assets/images/mycouponhui.png');
  }
}
</style>
