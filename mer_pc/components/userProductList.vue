<!--商品列表，收藏商品、我的足迹使用-->
<template>
  <div class="productList">
    <div v-if="type === 'collect_products'" class="acea-row row-middle mbtom20">
      <el-button size="large" round plain @click="isBatch = !isBatch">{{ isBatch ? '批量操作' : '取消' }}</el-button>
      <div v-show="!isBatch" class="allSelect">
        <div class="checkbox-wrapper">
          <label class="well-check acea-row row-middle">
            <input type="checkbox" name="" value="" v-model="isAllSelect" />
            <i class="icon cursors allIcon" style="top: 11px"></i>
            <span class="checkAll fontColor333 fonts14 cursors">全选</span>
          </label>
        </div>
      </div>
      <div v-show="!isBatch" class="fontColor333 fonts14 cursors" @click.stop="handleAllCancel">取消收藏</div>
    </div>
    <div v-loading="loading">
      <div v-if="type === 'collect_products'" class="products">
        <div v-for="(item, index) in list" :key="index">
          <div class="item">
            <div v-show="!isBatch" class="smegma b-rd-16px">
              <div class="checkbox-wrapper one-checkbox">
                <label class="well-check">
                  <input type="checkbox" name="" value="" v-model="item.checked" />
                  <span class="icon top-20px cursors oneIcon"></span>
                </label>
              </div>
            </div>
            <div v-show="isBatch" class="btn font12 cursors" @click.stop="handleCancel(item.productId)">取消收藏</div>
            <div class="relative">
              <div v-show="item.stock===0" class="sellOut">已售罄</div>
              <el-image class="backImg img" :src="item.image" lazy @click="handlerNuxtLink(item)"></el-image>
              <div v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }" class="border-picture backImg"></div>
            </div>
            <div class="cent" @click="handlerNuxtLink(item)">
              <div class="name text-14px text-#333 line2">{{ item.name }}</div>
              <div class="price font12 fontColor333">
                <span class="oppoSans-M">￥</span><span class="font20 dinProSemiBold">{{ item.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-for="(item, index) in list" :key="item.id" class="mb-30px">
          <div class="text-14px fontColor333 mb-18px text font-500 ml-10px">{{ item.date }}</div>
          <div class="products">
            <div v-for="(itm, i) in item.list" :key="i" class="item" @click="handlerNuxtLink(itm)">
              <div class="relative">
                <div v-show="itm.stock===0" class="sellOut">已售罄</div>
                <el-image class="backImg img" :src="itm.image" lazy :style="{opacity:itm.isShow?'1':'.5'}"></el-image>
                <div v-if="item.activityStyle" :style="{ backgroundImage: `url(${item.activityStyle})` }" class="border-picture backImg"></div>
              </div>
              <div class="cent">
                <div class="name text-14px line2" :class="itm.isShow?'fontColor333':'text-#CCCCCC'">{{ itm.name }}</div>
                <div v-if="itm.isShow" class="price font12 fontColor333">
                  <span class="oppoSans-M">￥</span><span class="font20 dinProSemiBold">{{ itm.price }}</span>
                </div>
                <div v-else class="fontColor333 text-14px oppoSans-R">商品已下架</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCollectCancelProApi} from '~/server/userApi'
import { ElButton, Image } from 'element-plus'
import feedback from '@/utils/feedback'
import useOrder from '~/composables/useOrder'
const { handlerProDetailLink } = useOrder()
import { ref, toRefs, computed } from 'vue'
const props = defineProps({
  //列表数据
  list: {
    type: Array,
    default: [],
  },
  //用于区分是足迹还是商品收藏,browsing_history足迹，collect_products商品收藏
  type: {
    type: String,
    default: '',
  },
})
const { list } = toRefs(props)
const loading = ref(false)

/**
 * 地址跳转
 */
const handlerNuxtLink = async (item: any) => {
  if(!item.isShow) return
  handlerProDetailLink(item.productId, 0)
  //linkNavigateTo(`/product/detail`, { id: item.productId, marketingType: 0 })
}

//选中的值，将isAllSelect定义成计算属性
const isAllSelect = computed({
  get() {
    let flag = list.value.map((item: any) => {
      if (!item.checked) {
        return false
      } else {
        return true
      }
    })
    return !flag.includes(false)
  },
  set(newVal) {
    if (newVal) {
      list.value.map((value: any, _index, _array) => {
        value.checked = true
      })
    } else {
      list.value.map((value: any, _index, _array) => {
        value.checked = false
      })
    }
  },
})

//批量操作控制显示隐藏
const isBatch = ref(true)

//全部取消收藏
const handleAllCancel = async () => {
  let idArr = [] as any
  Object.keys(list.value).forEach((item: any) => {
    if (list.value[item].checked) idArr.push(list.value[item].productId)
  })
  if (idArr.length === 0) return feedback.msgWarning('请至少选择一个商品')
  let ids = idArr.join(',')
  await onCancel(ids)
}

//单独取消收藏
const handleCancel = async (id: string) => {
  await onCancel(id)
}
//取消请求
const onCancel = async (id: string) => {
  await feedback.confirm('确认取消收藏吗？')
  try {
    await getCollectCancelProApi({ ids: id })
    feedback.msgSuccess('取消成功')
    loading.value = false
    emit('handleComplete')
  }catch (e) {
    loading.value = false
  }
}
const emit = defineEmits(['handleComplete'])
</script>

<style scoped lang="scss">
@import '@/assets/scss/checkbox.scss';
:deep(.el-button){
  width: 90px !important;
  height: 32px !important;
  --el-button-text-color: #333333 !important;
  font-size: 14px !important;
}
.allIcon{
  width: 18px !important;
  height: 18px !important;
}
.oneIcon{
  width: 20px !important;
  height: 20px !important;
}
.one-checkbox input:checked + .icon{
  background-size: 18px 13px !important;
}
.top-20px {
  top: 28px !important;
  left: 10px !important;
  background-color: #fff;
}
.smegma {
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.5s ease-in-out;
  width: 228px;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.allSelect {
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  .checkAll {
    margin-left: 10px;
  }
}
.products {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 16px;
  grid-column-gap: 16px;
  grid-template-rows: auto;
  .item {
    width: 228px;
    border-radius: 16px;
    border: 1px solid #eeeeee;
    position: relative;
    cursor: pointer;

    // opacity: 0;
    .btn {
      cursor: pointer;
      width: 70px;
      height: 26px;
      background: #000000;
      border-radius: 4px 4px 4px 4px;
      opacity: 0.5;
      position: absolute;
      z-index: 1;
      text-align: center;
      line-height: 26px;
      color: #fff;
      display: none;
      left: 10px;
      top: 10px;
    }
  }
  .item:hover .btn {
    display: block;
  }
  .backImg {
    width: 227px;
    height: 227px;
    display: inline-block !important;
    border-radius: 16px 16px 0 0;
  }
  .cent {
    margin-top: -4px;
    height: 112px;
    padding: 15px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price {
    span {
      font-weight: 600;
    }
  }
}
</style>
