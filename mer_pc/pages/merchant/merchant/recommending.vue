<!--swiper轮播-->
<script setup lang="ts">
import {reactive, toRefs} from "vue";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import {merchantRecommendApi} from "~/server/merchantApi";
import {Navigation, Pagination} from "swiper";
import useOrder from "~/composables/useOrder";
import {ItemObject} from "~/types/global";
const { handlerProDetailLink } = useOrder()

const swiperData = reactive({
  spaceBetween:16,
  slidesPerView:4,
  boxWidth: 'w-940px',
  slideWidth: 'w-223px',
  modules: [Navigation]
})
const props = defineProps({
  //列表数据 swiperImage
  merId: {
    type: Number,
    default: 0,
  }
})
const { merId } = toRefs(props)

//商户分类
const { data: recommendList } = await useAsyncData(async () => merchantRecommendApi(merId.value))

const sizeData = reactive<ItemObject>({
  width: '223px',
  height: '223px',
})
</script>

<template>
  <div v-if="recommendList.length" class="w-970px b-rd-16px bg-#FFFFFF px-15px py-20px mb-20px recommending">
    <div class="text-#333 text-16px font-500 ml-10px mb-20px">店铺推荐</div>
    <swiper-index :swiperSlideList="recommendList" :swiperData="swiperData">
      <!-- 这里是插槽传递的值 -->
      <template v-slot:default="slotProps">
        <div class="borRadius bg-#FFFFFF w-223px cursors" @click="handlerProDetailLink(slotProps.value.swiperItem.id, 0)">
          <product :item="slotProps.value.swiperItem" :sizeData="sizeData"></product>
        </div>
      </template>

    </swiper-index>
  </div>
</template>

<style scoped lang="scss">
.recommending{
  :deep(.swiper-slide){
    width: 223px !important;
  }
  :deep(.content){
    height: 118px !important;
  }
}

</style>
