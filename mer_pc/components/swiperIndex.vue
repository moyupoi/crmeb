<!--swiper轮播-->
<script setup lang="ts">
import { toRefs } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { Keyboard, Navigation, Pagination } from 'swiper'

const props = defineProps({
  //列表数据 swiperImage
  swiperSlideList: {
    type: Array,
    default: [],
  },
  swiperData: {
    type: Object,
    default: null,
  },
})
const { swiperSlideList, swiperData } = toRefs(props)

let swiperRef: SwiperClass | null = null
const setSwiperRef = (swiper: SwiperClass) => {
  swiperRef = swiper
}

//跳到指定位置
const slideTo = (index: number) => {
  swiperRef?.slideTo(index - 1, 0)
}
defineExpose({ slideTo })
</script>

<template>
  <div class="swiper" :style="swiperData.boxPadding">
    <swiper
      :space-between="swiperData.spaceBetween"
      :slides-per-view="swiperData.slidesPerView"
      :modules="swiperData.modules"
      @swiper="setSwiperRef"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }"
      :pagination="{ clickable: true, el: '.swiper-pagination'}"
      class="swiper h-100% proList acea-row"
    >
      <swiper-slide v-for="(item, index) in swiperSlideList" :key="index" class="h-100%" :class="swiperData.slideWidth">
        <slot
          :value="{
            swiperItem: item,
            swiperIndex: index,
          }"
        ></slot>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev iconfont icon-zuo1 text-center" :style="swiperData.navigationBgColor+';'+ swiperData.navigationColor" slot="button-prev"></div>
    <div class="swiper-button-next iconfont icon-you1 text-center" :style="swiperData.navigationBgColor+';'+ swiperData.navigationColor" slot="button-prev"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<style scoped lang="scss">
.swiper-button-prev:after,
.swiper-button-next:after {
  display: none !important;
}
.swiper-button-prev {
  text-align: center;
  width: 30px;
  height: 42px;
  //background: rgba(0, 0, 0, 0.3);
  border-radius: 0px 23px 23px 0px;
 // color: #fff;
  margin-left: -10px;
}
.swiper-button-next {
  text-align: center;
  width: 30px;
  height: 40px;
 // background: rgba(0, 0, 0, 0.3);
  border-radius: 23px 0 0 23px;
 // color: #fff;
  margin-right: -9px;
}
</style>
