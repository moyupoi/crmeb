<!--商品列表，推荐商品，首页商品展示-->
<script setup lang="ts">
import useOrder from '~/composables/useOrder'
const { handlerProDetailLink } = useOrder()
import { toRefs } from 'vue'
const props = defineProps({
  //列表数据
  item: {
    type: Object,
    default: null,
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
const { item, sizeData } = toRefs(props)

/**
 * 地址跳转
 */
const handlerNuxtLink = async (id: number) => {
  await handlerProDetailLink(id, 0)
}
</script>

<template>
  <div class="productItem cursors">
    <div data-aos-anchor-placement="top-bottom" @click="handlerNuxtLink(item.id)">
      <div class="borRadius bg-#FFFFFF" :style="{ width: sizeData.width }">
        <div class="relative">
          <div v-show="item.stock===0" class="sellOut">已售罄</div>
          <el-image
            class="backImg"
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
          class="bg-white px12px py-14px content h-177px flex flex-justify-between"
          style="margin-top: -5px; flex-direction: column"
        >
          <div class="line2 text-14px fontColor333 products-name h-36px lh-19px acea-row">
            <div
              v-if="item.productTags && item.productTags.locationLeftTitle.length"
              class="inline-block text-12px bg-color text-#fff b-rd-2px py-2px mr-6px px-4px line-heightOne"
            >
              {{ item.productTags.locationLeftTitle[0].tagName }}
            </div>
            {{ item.name }}
          </div>
          <div v-if="item.productTags && item.productTags.locationUnderTitle.length" class="acea-row">
            <div
              v-for="items in item.productTags.locationUnderTitle.length > 3
                ? item.productTags.locationUnderTitle.slice(0, 3)
                : item.productTags.locationUnderTitle"
              :key="items.id"
              class="text-12px line-heightOne font-color base-border b-color-#E93323 b-rd-2px px4px py2px mr8px productTags"
            >
              {{ items.tagName }}
            </div>
          </div>
          <svip-price :productPrice="item" :priceStyle="{ fontSize: '20px' }"></svip-price>
          <div class="text-12px text-#999 line-heightOne">已售{{ item.sales }}{{ item.unitName }}</div>
          <div v-if="item.merName" class="mt-15px">
            <span class="iconfont icon-guanzhudianpu mr-5px font-color"></span>
            <span class="text-12px text-#666">{{ item.merName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.backImg {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.content {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
</style>
