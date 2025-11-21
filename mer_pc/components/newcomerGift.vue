<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import {toRefs} from "vue";
import {couponTypeFilter} from "~/utils/filter";
const props = defineProps({
  //弹窗是否弹起
  couponModal: {
    type: Boolean,
    default: false
  },
  newPeopleCouponList: {
    type: Array,
    default: []
  }
})
const { couponModal } = toRefs(props)

const { userInfo } = useUserStore()

//关闭弹窗
const emit = defineEmits(['onCloseSucceeded'])
const handleClose = async()=>{
  emit('onCloseSucceeded')
}

const getTime = (time: string) => {
  let reg = new RegExp('-', 'g') //g代表全部
  return time ? time.split(' ')[0].substring(2, 10) : ''
}
</script>

<template>
  <!-- 新人礼弹窗 -->
  <div class="coupon_modal" @touchmove.stop.prevent="moveStop" v-if="couponModal">
    <div class="mask"></div>
    <div class="_container">
      <div class="_tit alimama">新人专属大礼包</div>
      <div class="_look oppoSans-R">优惠券将发放至个人账户，可在“我的优惠券”查看</div>
      <div class="_box cursors">
        <div class="_item acea-row row-middle" v-for="item in newPeopleCouponList" :key="item.id">
          <div class="_price_box">
            <div class="_price line-heightOne"><span class="text-20px">¥</span>{{ item.money }}</div>
            <div class="_man">满{{ item.minPrice }}可用</div>
          </div>
          <div class="flex-1 _desc">
            <div v-if="item.category === 3" class="_text line1 line-heightOne oppoSans-M">全平台通用</div>
            <div v-else class="_text line1 line-heightOne oppoSans-M">
              仅限指定{{ couponTypeFilter(item.category) }}可用
            </div>
            <div v-if="item.isFixedTime" class="_end line1 line-heightOne oppoSans-M">
              {{ getTime(item.useStartTime) + ' ~ ' + getTime(item.useEndTime) + '可用' }}
            </div>
            <div v-else class="_end line1 line-heightOne">{{ '领取后' + item.day + '天内可用' }}</div>
          </div>
        </div>
      </div>
      <div class="_btn cursors" @click="handleClose()"></div>
      <span class="guanbi iconfont icon-danchuangguanbi cursors" @click="handleClose()"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.coupon_modal {
  ._container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 370px;
    height: 459px;
    background-size: cover;
    background: url('@/assets/images/coupon_modal_bg.png');
    background-repeat: no-repeat;
    z-index: 330;

    ._tit {
      text-align: center;
      // height: 42px;
      font-size: 26px;
      font-weight: 600;
      color: #ffe9be;
      //  line-height: 42px;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
      margin-top: 137px;
    }

    ._look {
      text-align: center;
      font-size: 12px;
      color: #fff;
      margin: 10px auto 18px;
    }

    ._box {
      width: 370px;
      height: 166px;
      margin: auto;
      padding: 0 26px;
      overflow-y: scroll;
      overflow-x: hidden;
      ._item {
        width: 318px;
        height: 82px;
        background: url('@/assets/images/coupon_item_bg.png');
      }
    }

    ._item {
      width: 100%;
      height: 140px;
      border-radius: 14px;
      background-size: cover;
      padding: 17px 0;

      ._price_box {
        width: 118px;
        padding: 0 15px;
        text-align: center;
        border-right: 1px dashed #e6e6e6;

        ._price {
          font-size: 32px;
          color: #e93323;
          font-weight: 600;
        }

        ._man {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
      }

      ._desc {
        padding: 0 18px;
        width: 80px;
        ._text {
          //width: 280px;
          font-size: 18px;
          color: #282828;
        }

        ._end {
          //width: 280px;
          margin-top: 12px;
          font-size: 12px;
          color: #999;
        }
      }

      ~ ._item {
        margin-top: 12px;
      }
    }

    ._btn {
      width: 188px;
      height: 44px;
      background-size: cover;
      background: url('@/assets/images/coupon_modal_btn.png');
      margin: 23px auto 0;
    }

    .guanbi {
      font-size: 24px;
      color: #fff;
      position: absolute;
      top: 12px;
      right: -53px;
    }
  }
}
</style>