<!--销量、价格、搜索搜索条件，商品列表、商户主页，搜索展示-->
<script setup lang="ts">
import { toRefs, ref } from 'vue'
import {Search} from "@element-plus/icons-vue";
const props = defineProps({
  //列表数据
  where: {
    type: Object,
    default: null,
  },
})
const { where } = toRefs(props)

const stock = ref<number>(0) //销量
const price = ref<number>(0) //价格

//点击筛选
const emit = defineEmits(['handleSubmitSelect'])
const iSdefaults = ref<number>(1);
const handleSeachList = async (e: number) => {
  where.value.page = 1;
  iSdefaults.value = e;
  switch (e) {
    case 1:
      price.value = 0
      stock.value = 0
      break
    case 2:
      if (price.value == 0) price.value = 1
      else if (price.value == 1) price.value = 2
      else if (price.value == 2) price.value = 0
      stock.value = 0
      break
    case 3:
      if (stock.value == 0) stock.value = 1
      else if (stock.value == 1) stock.value = 2
      else if (stock.value == 2) stock.value = 0
      price.value = 0
      break
    case 4:
      price.value = 0
      stock.value = 0
      break
  }
  await setWhere()
  emit('handleSubmitSelect', where.value)
}

//设置where条件
const setWhere = () => {
  if (price.value == 0) where.value.priceOrder = ''
  else if (price.value == 1) where.value.priceOrder = 'asc'
  else if (price.value == 2) where.value.priceOrder = 'desc'
  if (stock.value == 0) where.value.salesOrder = ''
  else if (stock.value == 1) where.value.salesOrder = 'asc'
  else if (stock.value == 2) where.value.salesOrder = 'desc'
}

</script>

<template>
  <div class="acea-row sortSeach items-center mb-20px w-100% h-50px bg-#FFFFFF b-rd-12px pl-10px">
    <div class="items" :class="iSdefaults === 1 ? 'font-color' : ''" @click="handleSeachList(1)">综合排序</div>
    <div class="items flex-center" :class="stock !== 0 ? 'font-color' : ''" @click="handleSeachList(3)">
      销量
      <div>
        <span class="iconfont icon-gao text-12px lh-7px" :class="stock==1?'font-color':'text-#999'"></span>
        <span class="iconfont icon-di text-12px lh-7px" :class="stock==2?'font-color':'text-#999'"></span>
      </div>
    </div>
    <div class="items flex-center" :class="price !== 0 ? 'font-color' : ''" @click="handleSeachList(2)">
      <span>价格</span>
      <div>
        <span class="iconfont icon-gao text-12px lh-7px" :class="price==1?'font-color':'text-#999'"></span>
        <span class="iconfont icon-di text-12px lh-7px" :class="price==2?'font-color':'text-#999'"></span>
      </div>
    </div>
    <div class="item price-range flex-center">
      <div class="price-count mr-10px">
        <el-input style="width: 120px" min="0" type="number" v-model.number="where.minPrice"> <template #prefix>￥</template></el-input>
        -
        <el-input style="width: 120px" min="0" type="number" v-model.number="where.maxPrice">
          <template #prefix>￥</template>
        </el-input>
      </div>
      <el-button plain @click="handleSeachList">确定</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sort {
  background: #fff;
  .items {
    margin-right: 30px;
    cursor: pointer;
    font-size: 14px;
    color: #333333;
    &:hover {
      color: #e93323;
    }
    .icon {
      font-size: 15px;
      margin-left: 5px;
      color: #e2e2e2;
    }
    .iconfont {
      font-size: 12px;
      margin-left: 5px;
      display: block;
    }
  }
  .name {
    color: #969696;
    margin-right: 20px;
  }
}
</style>
