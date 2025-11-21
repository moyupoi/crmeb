<!--商品列表，可用优惠券商品列表、商品搜索列表使用-->
<script setup lang="ts">
import { linkNavigateTo } from '~/utils/util'
import { toRefs } from 'vue'
import { Mul } from '~/utils/util'
import useOrder from '~/composables/useOrder'
const { handlerProDetailLink } = useOrder()
const props = defineProps({
  //列表数据
  list: {
    type: Array,
    default: [],
  },
  //图片大小
  sizeData: {
    type: Object,
    default: {
      width: '228px',
      height: '228px',
    },
  },
})
const { list, sizeData } = toRefs(props)

/**
 * 地址跳转
 */
const handlerNuxtLink = async (id: number) => {
  await handlerProDetailLink(id, 0)
  // await linkNavigateTo(`/product/detail/${id}`, { type: 'normal' })
}

// 跳入页面
const handleGoPage = (id) => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: id })
}
</script>

<template>
  <div class="acea-row mt-20px">
    <div v-for="item in list" :key="item.id" class="mb15px item cursors">
      <div data-aos="fade-up" data-aos-anchor-placement="top-bottom" @click="handlerNuxtLink(item.id)">
        <div class="w228px borRadius overflow-hidden bg-#FFFFFF" :style="{ width: sizeData.width }">
          <div class="relative">
            <div v-show="item.stock===0" class="sellOut">已售罄</div>
            <el-image
              class="backImg w228px h228px"
              :src="item.image"
              :style="{ width: sizeData.width, height: sizeData.height }"
            ></el-image>
            <div
              v-if="item.activityStyle"
              :style="{ backgroundImage: `url(${item.activityStyle})` }"
              class="border-picture backImg"
            ></div>
          </div>
          <div
            class="bg-white pt-15px pb-13px px-12px flex flex-justify-between"
            style="flex-direction: column; margin-top: -5px"
          >
            <svip-price :productPrice="item" :priceStyle="{ fontSize: '20px' }" class="mb-8px"></svip-price>
            <!--            <div class="text-12px font-color mb-8px font-500">-->
            <!--              <span class="oppoSans-M">￥</span-->
            <!--              ><span class="text-20px lh-20px font-600 dinProSemiBold">{{ item.price }}</span>-->
            <!--            </div>-->
            <div class="line2 text-14px fontColor333 mb-12px h-38px lh-19px acea-row">
              <div
                v-if="item.productTags && item.productTags.locationLeftTitle.length"
                class="inline-block text-12px bg-color text-#fff b-rd-2px py-2px mr-6px px-4px lh-12px"
              >
                {{ item.productTags.locationLeftTitle[0].tagName }}
              </div>
              {{ item.name }}
            </div>
            <div class="flex mb-10px h-16px">
              <div class="text-12px text-#999 mr-10px">
                <text v-if="Math.floor(item.replyNum) > 0">{{ item.replyNum }}条评论</text>
                <text v-if="item.replyNum === 0 || !item.replyNum">暂无评论</text>
                <text v-if="item.positiveRatio && Number(item.positiveRatio) > 0" class="ml-2px"
                  >好评{{ Mul(item.positiveRatio, 100) }}%</text
                >
              </div>
              <div class="text-12px text-#999">已售{{ item.sales }}{{ item.unitName }}</div>
            </div>
            <div v-if="item.productTags" class="h-20px mb-10px">
              <div v-if="item.productTags && item.productTags.locationUnderTitle.length" class="acea-row">
                <div
                  v-for="items in item.productTags.locationUnderTitle.length > 3
                    ? item.productTags.locationUnderTitle.slice(0, 3)
                    : item.productTags.locationUnderTitle"
                  :key="items.id"
                  class="text-12px lh-12px font-color base-border b-color-#E93323 b-rd-2px px3px py2px mr8px"
                >
                  {{ items.tagName }}
                </div>
              </div>
            </div>

            <div class="cursors acea-row items-center" @click.stop="handleGoPage(item.merId)">
              <span class="iconfont icon-guanzhudianpu mr-5px text-12px font-color"></span>
              <span class="text-12px text-#666 line1 w-175px">{{ item.merName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  margin-right: 15px;
  &:nth-child(5n) {
    margin-right: 0;
  }
}
</style>
