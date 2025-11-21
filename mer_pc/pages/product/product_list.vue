<script setup lang="ts">
import { productListApi, productListBeforeApi } from '~/server/goodsApi'
import { reactive, ref, watch } from 'vue'
import { ProductListQuery } from '~/types/goods'
import { seckillTimeApi } from '~/server/activityApi'
const route = useRoute()
const searchValue = ref<string>(<string>route.query.searchValue) //搜索框输入词
const productCid = ref<string>(<string>route.query.productCid) //商品分类id，三级分类id

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 140)

watch(
  () => route.query.searchValue,
  (newValue) => {
    searchValue.value = newValue
    where.keyword = newValue
    where.cid = null
    where.brandId = null
    where.tagId = null
    seachLists[0].list = []
    seachLists[1].list = []
    seachLists[2].list = []
    getSeachList()
    getList()
  },
)
watch(
  () => route.query.productCid,
  (newValue) => {
    if (newValue) {
      where.cid = newValue
      getList()
    }
  },
)
/**
 * 列表
 */
const where = reactive<ProductListQuery>({
  page: 1,
  limit: 10,
  brandId: '',
  cid: productCid.value,
  keyword: searchValue.value,
  maxPrice: null,
  merId: '',
  minPrice: null,
  priceOrder: '',
  salesOrder: '',
  tagId: null,
})
const {
  data: tableData,
  refresh: getList,
  pending: listLoading,
} = await useAsyncData(async () => productListApi(where), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChange = (e: number) => {
  where.page = e
  getList()
}

const seachLists = reactive([
  {
    name: '商品品牌',
    list: [],
    checked: [],
    type: 'productBrand',
    multiple: true, //是否是多选
    showMore: true, //true显示展开
    isShowBtnMore: false,
  },
  {
    name: '商品分类',
    list: [],
    checked: [],
    type: 'productCategory',
    multiple: true,
    showMore: true, //true显示展开
    isShowBtnMore: false,
  },
  {
    name: '商品标签',
    list: [],
    checked: [],
    type: 'productTagList',
    multiple: false,
    showMore: true, //true显示展开
    isShowBtnMore: false,
  },
])

//搜索品牌、分类 筛选数据/
const { refresh: getSeachList } = await useAsyncData(async () => {
  let data = await productListBeforeApi({ keyword: searchValue.value })
  seachLists[0].list = data?.brandList
  seachLists[1].list = data?.categoryList
  seachLists[2].list = data?.productTagList
})

// const getProductListBefore = async () => {
//   let data = await productListBeforeApi({ keyword: searchValue.value })
//   seachLists[0].list = data?.brandList
//   seachLists[1].list = data?.categoryList
//   seachLists[2].list = data?.productTagList
// }
// getProductListBefore()

//获取搜索选中结果
const handleSubmitChecked = (list: number[] | number) => {
  where.cid = list.productCategory ? list.productCategory.toString() : ''
  where.brandId = list.productBrand ? list.productBrand.toString() : ''
  where.tagId = list.productTagList
  getList()
}

//综合排序筛选回调
const handleSubmitSelect = (e: ProductListQuery) => {
  Object.assign(where, e)
  getList()
}
</script>

<template>
  <div class="product_list h-100%">
    <div class="wrapper_1200 h-100%">
      <page-header title="全部结果"></page-header>
      <div class="b-rd-16px bg-#FFFFFF mb-20px">
        <seach-list
          :list="seachLists"
          v-if="
            (seachLists[0].list && seachLists[0].list.length > 0) ||
            (seachLists[1].list && seachLists[1].list.length > 0) ||
            (seachLists[2].list && seachLists[2].list.length > 0)
          "
          @handleSubmitChecked="handleSubmitChecked"
        ></seach-list>
      </div>
      <div class="acea-row sort items-center w-100% h-50px bg-#FFFFFF b-rd-12px pl-20px">
        <sort-seach :where="where" @handleSubmitSelect="handleSubmitSelect"></sort-seach>
      </div>
      <div v-loading="listLoading" class="h-70%">
        <div v-if="tableData.total > 0">
          <ProductSeach :list="tableData.list"></ProductSeach>
          <div class="acea-row row-middle mt-20px pb-10px">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="tableData.total"
              class="page-item"
              :page-size="where.limit"
              :current-page="where.page"
              @update:current-page="pageChange"
            />
          </div>
        </div>
        <div v-else class="w-100%" :style="{ height: ScrollHeight + 'px' }">
          <empty-page title="暂无商品哟~">
            <template v-slot:emptyImage>
              <img src="@/assets/images/wushangpin.png" />
            </template>
          </empty-page>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
