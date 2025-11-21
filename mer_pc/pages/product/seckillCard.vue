<script setup lang="ts">
import { toRefs, reactive } from 'vue'

const props = defineProps({
  // 0=已结束 1=抢购中 2=即将开始 3=明日预告
  seckillStatus: {
    type: Number,
    default: 0,
  },
  productInfo: {
    type: Object,
    default: () => {},
  },
  seckillTime: {
    type: Number,
    default: 0,
  },
})
const { seckillStatus, productInfo, seckillTime } = toRefs(props)

const bgColor = reactive<any>({
  bgColor: '',
  Color: '',
  width: '36rpx',
  timeTxtwidth: '16rpx',
  isDay: true,
  fontSize: '22px'
})
</script>

<template>
  <div class="w-209px seckillCard px-20px">
    <div class="w-100% h-53px lh-52px text-#fff text-14px acea-row font-500">
      {{seckillStatus === 0? '活动已结束' : seckillStatus === 2 || seckillStatus === 3? '距活动开始' : '距活动结束'}}
      <countDown
          class="ml-10px"
        v-if="seckillStatus > 0"
        :is-day="true"
        :tip-text="' '"
        :day-text="' '"
        :hour-text="' : '"
        :minute-text="' : '"
        :second-text="' '"
        :datatime="seckillTime"
        :isCol="false"
        :bgColor="bgColor"
      >
      </countDown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.seckillCard{
  width: 630px;
  height: 53px;
  background-image: url("@/assets/images/msb.png");
}
</style>
