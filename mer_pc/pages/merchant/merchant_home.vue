<script setup lang="ts">
import { ref, reactive, watch,computed } from 'vue'
import { getMerCategoryApi, getMerIndexInfoApi, getMerProListApi } from '~/server/merchantApi'
import MerchantNews from '~/components/merchantNews.vue'
import { merchantProductSeachDefault } from '~/pages/merchant/defaultMerchant'
import { MerchantProductSeach } from '~/types/merchant'
import { Search } from '@element-plus/icons-vue'
import { ItemObject, PageQuery } from '~/types/global'
import { couponListApi } from '~/server/goodsApi'
import Recommending from './merchant/recommending.vue'
const route = useRoute()
const merId = ref<number>(Number(route.query.merId)) //商户id
const searchValue = ref<string>(<string>route.query.searchValue) //搜索框输入词
const menuList = ref<Array<string>>(['店铺首页', '全部商品', '领优惠券'])
const current = ref<number>(route.query.currentVal?Number(route.query.currentVal):0)

watch(
  () => route.query.searchValue,
  (newValue) => {
    searchValue.value = newValue
    searchForm.keyword = newValue
    current.value = Number(route.query.currentVal)
    refresh()
  },
)

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 60)

// 点击菜单
const handleMenu = (idx: number) => {
  current.value = idx
  searchForm.cids = null
  if(idx<2) refresh()
}

//商户信息
const { data: merchantInfo } = await useAsyncData(async () => getMerIndexInfoApi(merId.value))

//商户分类
const { data: categoryList } = await useAsyncData(async () => getMerCategoryApi(merId.value))

//分类默认全部展开
const opened = computed(()=>{
  return categoryList.value.map((i:any)=>{
    return i.id
  })
})

//商品列表
const sizeData = reactive<ItemObject>({
  width: '223px',
  height: '223px',
})
const searchForm = reactive<MerchantProductSeach>(Object.assign(merchantProductSeachDefault()))
searchForm.merId = merId.value
searchForm.keyword = searchValue.value ? searchValue.value : searchForm.keyword
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => getMerProListApi(searchForm), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChange = (e: number) => {
  searchForm.page = e
  refresh()
}

//点击分类
const handleClassify = (e: number) => {
  searchForm.cids = e
  current.value = 1
  refresh()
}

//关注店铺回调
const handleSubmitSuccess = () => {
  merchantInfo.value.isCollect = !merchantInfo.value.isCollect
}

//优惠券列表
const where = reactive<PageQuery>({
  page: 1,
  limit: 12,
  merId: merId.value,
  category: 0,
})
const {
  data: couponLists,
  pending: couponlistLoading,
  refresh: getCouponList,
} = await useAsyncData(async () => couponListApi(where), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChangeCoupon = (e: number) => {
  where.page = e
  getCouponList()
}
//综合排序筛选回调
const handleSubmitSelect = (e: ProductListQuery) => {
  Object.assign(where, e)
  refresh()
}
</script>

<template>
  <div class="merchant_home">
    <div class="w-100% h-40px bg-#333333 mb-20px">
      <div class="w-1200px h-40px m-auto acea-row">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          class="text-#fff lh-39px w-100px text-center cursors text-14px"
          :class="{ 'bg-#E93323': current === index }"
          @click="handleMenu(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="wrapper_1200">
      <div v-show="current === 0" class="mb-20px">
        <!--轮播-->
        <div
          v-if="merchantInfo && merchantInfo.bannerList && merchantInfo.bannerList.length"
          class="w-1200px h-400px mt-20px"
        >
          <el-carousel :interval="5000" height="400px" arrow="always">
            <el-carousel-item v-for="item in merchantInfo.bannerList" :key="item" class="w-1200px h-400px el-image">
              <a v-if="item.linkUrl" :href="item.linkUrl" target="_blank">
                <el-image :src="item.imageUrl" class="w-1200px h-400px el-image b-rd-12px" fit="fill" />
              </a>
              <el-image v-else :src="item.imageUrl" class="w-1200px h-400px el-image b-rd-12px" fit="fill" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="acea-row">
        <!--分类-->
        <div class="classify mr-20px">
          <div class="mb-20px">
            <MerchantNews
              :merchantInfo="merchantInfo"
              :merId="merId"
              @handleSubmitSuccess="handleSubmitSuccess"
            ></MerchantNews>
          </div>
          <div class="b-rd-12px overflow-hidden px-20px py-30px bg-#fff w-210px">
            <el-collapse v-model="opened">
              <el-collapse-item
                @click="handleClassify(item.id)"
                v-for="item in categoryList"
                :key="item.id"
                :title="item.name"
                :name="item.id"
                class="mb-40px text-16px lh-16px"
              >
                <div
                  @click.stop="handleClassify(items.id)"
                  v-for="items in item.childList"
                  :key="items.id"
                  class="mt-24px text-14px lh-14px cursors font-normal"
                  :class="searchForm.cids === items.id ? 'font-color' : 'text-#666666'"
                >
                  {{ items.name }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <!--商品-->
        <div class="product" :style="{ minHeight: ScrollHeight + 'px' }">
          <!--推荐商品-->
          <div v-show="current === 0">
            <recommending :merId="merId"></recommending>
          </div>
          <div v-show="current < 2" class="w-970px b-rd-16px bg-#FFFFFF px-15px py-20px">
            <div class="sort flex flex-justify-between bg-#FFFFFF">
              <sort-seach :where="searchForm" @handleSubmitSelect="handleSubmitSelect"></sort-seach>
              <div class="seachInput">
                <el-input
                  v-model="searchForm.keyword"
                  style="width: 220px"
                  placeholder="搜索商品名称"
                  @keyup.enter="refresh"
                >
                  <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>
            <div v-loading="listLoading">
              <div v-if="tableData.total>0">
                <div class="grid-column-4 gap-15px proList">
                  <div v-for="item in tableData.list" :key="item.id" class="cursors">
                    <product :item="item" :sizeData="sizeData"></product>
                  </div>
                </div>
                <div class="acea-row row-middle mt-20px">
                  <el-pagination
                      background
                      layout="prev, pager, next"
                      :total="tableData.total"
                      class="page-item"
                      :page-size="searchForm.limit"
                      :current-page="searchForm.page"
                      @update:current-page="pageChange"
                  />
                </div>
              </div>
              <div v-else class="w-100%" :style="{ height: ScrollHeight - 100 + 'px' }">
                <empty-page title="暂无商品哟~">
                  <template v-slot:emptyImage>
                    <img src="@/assets/images/wushangpin.png" />
                  </template>
                </empty-page>
              </div>
            </div>

          </div>

          <!--优惠券-->
          <div
            v-show="current === 2"
            class="w-970px b-rd-16px bg-#FFFFFF px-15px py-20px coupon h-100%"
            v-loading="couponlistLoading"
          >
            <div class="" v-if="couponLists.list.length">
              <coupon-list :list="couponLists.list" receivedText="去使用"></coupon-list>
              <div class="acea-row row-middle mt-20px">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :page-size="where.limit"
                  :current-page="where.page"
                  :total="couponLists.total"
                  @update:current-page="pageChangeCoupon"
                  class="page-item"
                />
              </div>
            </div>
            <div v-else class="w-100% h-100%">
              <empty-page title="暂无优惠券哟~">
                <template v-slot:emptyImage>
                  <img src="@/assets/images/wuyouhui.png" />
                </template>
              </empty-page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html {
  background: #f5f5f5;
}
:deep(.merchantNews) {
  :deep(.el-dialog__header) {
    padding: 30px 0 !important;
  }
}
</style>

<style scoped lang="scss">
:deep(.productTags){
  margin-right: 5px !important;
}
:deep(.el-dialog__header) {
  padding: 30px 0 !important;
}
:deep(.sortSeach) {
  height: auto !important;
}
.coupon {
  :deep(.coupon-item) {
    margin-right: 10px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.proList {
  :deep(.item) {
    margin-right: 15px;
    &:nth-child(4n) {
      margin-right: 0 !important;
    }
  }
}

:deep(.el-collapse),
:deep(.el-collapse-item__wrap) {
  border: none !important;
}
:deep(.el-collapse-item__header) {
  --el-collapse-header-height: auto !important;
  border: none !important;
  --el-collapse-header-font-size: 16px;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0 !important;
}
.seachInput {
  :deep(.el-input__wrapper) {
    border: none !important;
    box-shadow: none !important;
  }
  :deep(.el-input) {
    --el-fill-color-blank: #f7f7f7 !important;
    --el-border-radius-base: 20px;
  }
}
:deep(.content) {
  border-left: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  border-radius: 0 0 16px 16px;
}
</style>
