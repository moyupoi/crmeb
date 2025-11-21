<!--首页秒杀组件-->
<script setup lang="ts">
import { pcHomeSeckillApi } from '~/server/homeApi'
import useOrder from '~/composables/useOrder'
import { Navigation } from 'swiper'
const { handleIntoPage } = useOrder()
const { data: seckillLists } = await useAsyncData(async () => pcHomeSeckillApi())

const swiperData = reactive({
  spaceBetween: 0,
  slidesPerView: 4,
  boxWidth: 'w-100%',
  slideWidth: 'w-240px',
  modules: [Navigation],
  navigationColor: 'color: #fff',
  navigationBgColor: 'background: rgba(0, 0, 0, 0.3)',
})
</script>

<template>
  <div
    v-if="seckillLists?.length"
    class="seckillIndex cursors acea-row wrapper_1200 mb-38px bg-#FFFFFF b-rd-12px overflow-hidden 3cfea756"
  >
    <img
      @click.prevent="handleIntoPage('/activity/seckill_list', { type: '3' })"
      src="@/assets/images/miaosbj.jpg"
      class="w-240px h-316px"
    />
    <div class="py-30px w-960px">
      <swiper-index :swiperSlideList="seckillLists" :swiperData="swiperData">
        <template v-slot:default="slotProps">
          <div class="bg-#FFFFFF w-240px overflow-hidden seckill-border flex-x-center af90db">
            <div class="w-180px" @click="handleIntoPage('/activity/seckill_list', { type: '3' })">
              <el-image class="backImg w-180px h-180px b-rd-12px" :src="slotProps.value.swiperItem.image"></el-image>
              <div class="bg-white px15px pt-15px content" style="margin-top: -5px">
                <div class="line1 text-14px fontColor333 mb22px products-name h-18px line-heightOne">
                  {{ slotProps.value.swiperItem.name }}
                </div>
                <div class="center 8bfb4">
                  <div class="text-12px font-color text-center">
                    <span class="font-600 oppoSans-M">￥</span
                    ><span class="text-20px lh-20px font-600 dinProSemiBold">{{
                      slotProps.value.swiperItem.seckillPrice
                    }}</span>
                    <span class="line-through text-14px text-#999 ml-10px dinProRegular font-400 3cfea756"
                      >￥{{ slotProps.value.swiperItem.price }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </swiper-index>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dinSemiBold {
  font-family: 'dinSemiBold';
}
.seckill-border {
  border-right: 1px solid #eeeeee;
}
.seckillIndex {
  :deep(.swiper-slide) {
    display: flex;
    justify-content: center;
    // width: 180px !important;
  }
}
</style>
