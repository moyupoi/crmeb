<!--商品分类-->
<script setup lang="ts">
import { ref } from 'vue'
import { categoryTreeApi } from '~/server/goodsApi'
import { linkNavigateTo } from '~/utils/util'
const route = useRoute()

// 获取首页路由地址
const homeRoutePath = route.path
/**
 * 平台端商品分类
 */
const categoryCurrent = ref<any[]>([])
const current = ref<number | null>(null)

const { data: productClassify } = await useAsyncData(async () => categoryTreeApi())

/**
 * 鼠标移入
 * @param idx
 */
const seen = ref<boolean>(false)
const handlerEnter = (idx: number) => {
  seen.value = true
  current.value = idx
  categoryCurrent.value = productClassify.value[idx].childList
}

/**
 * 鼠标移出
 */
const emit = defineEmits(['handleSubmitLeave'])
const handlerLeave = () => {
  seen.value = false
  current.value = null
  emit('handleSubmitLeave')
}

const handleEnterKey = (id: number) => {
  linkNavigateTo(`/product/product_list`, { productCid: id })
}
</script>

<template>
  <div>
    <div
      class="acea-row absolute z-11 classifyCard overflow-hidden"
      :class="homeRoutePath !== '/' ? 'boxShadow' : ''"
      @mouseleave="handlerLeave"
    >
      <el-scrollbar height="376px" class="w-200px px-20px py-17px bg-#FFFFFF">
        <div class="classify-left bg-#FFFFFF">
          <div v-for="(item, index) in productClassify" :key="item.id" class="flex classifyClassA cursors">
            <el-image :src="item.icon" class="w-40px h-40px b-rd-50%"></el-image>
            <div class="ml-10px">
              <div
                @mouseenter="handlerEnter(index)"
                class="fonts14 line1 mb-8px w-109px"
                :class="index === current ? 'font-color' : 'fontColor333'"
              >
                {{ item.name }}
              </div>
              <div class="acea-row">
                <div
                  v-for="(items, idx) in item.childList.length === 2 ? item.childList : item.childList.slice(0, 2)"
                  :key="index"
                  class="text-12px text-#999 classifyClassB line1"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div v-if="seen" class="classify-rgiht bg-#FAFAFA w-1000px px-40px py-20px">
        <el-scrollbar height="360px">
          <div v-for="(item, index) in categoryCurrent" :key="index" class="mb18px acea-row">
            <div class="fonts14 fontColor333 mr30px font-500 oppoSans-M">{{ item.name }}</div>
            <div class="acea-row w-85%">
              <span
                @click="handleEnterKey(items.id)"
                v-for="(items, idx) in item.childList"
                :key="idx"
                class="fonts14 fontColor333 mr20px mb-10px cursors oppoSans-R childName"
                >{{ items.name }}</span
              >
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.childName:hover {
  color: #e93323;
}
.classifyCard {
  background: #fafafa;
  border-radius: 0px 0px 16px 16px;
}
.boxShadow {
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
}
.classifyClassA {
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
}
.classifyClassB {
  max-width: 49px;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
