<template>
  <div class="w-100%">
    <!--轮播图-->
    <BannerIndex></BannerIndex>
    <!--秒杀-->
    <SeckillIndex></SeckillIndex>
    <!--品牌好店-->
    <MerchantIndex :goodStoreImage="pcHomeCon?.goodStoreImage"></MerchantIndex>
    <!--推荐商品-->
    <RecommendedIndex></RecommendedIndex>
    <!--猜你喜欢-->
    <recommend></recommend>
  </div>
</template>

<script lang="ts" setup>
import { pcHomeConfigApi } from '~/server/homeApi'

const { data: pcHomeCon } = useAsyncData(() => pcHomeConfigApi())
</script>

<style>
html {
  background: #f5f5f5 !important;
}
</style>

<style lang="scss" scoped>
.swiper {
  --swiper-theme-color: #ff6600;
  --swiper-pagination-color: #fff; /* 两种都可以 */
  --swiper-pagination-bottom: 10px;
  --swiper-navigation-size: 0;
}
</style>
