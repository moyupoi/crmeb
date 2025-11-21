<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { getMerCategoryListApi, getMerSearchApi, getMerTypeListApi } from '~/server/merchantApi'
import { MerchantListQuery } from '~/types/merchant'
import useOrder from '~/composables/useOrder'
const { handleIntoPage, handlerProDetailLink } = useOrder()

const route = useRoute()
const searchValue = ref<string | undefined>(<string | undefined>route.query.searchValue) //搜索框输入词

watch(
  () => route.query.searchValue,
  (newValue) => {
    where.keywords = newValue
    refresh()
  },
)
/*获取初始化选中的数据*/
const getInitchecked = (arr: Array<any>) => {
  // let data = {
  //   id: null,
  //   name: '全部'
  // }
  // arr.unshift(data)
  arr.forEach((item: any) => {
    item.isChoose = false
  })
}

/**
 * 商户分类
 */
const { data: merCategory } = await useAsyncData(async () => getMerCategoryListApi())
getInitchecked(merCategory.value)

/**
 * 店铺类型
 */
const { data: merType } = await useAsyncData(async () => getMerTypeListApi())
getInitchecked(merType.value)

const seachLists = reactive([
  {
    name: '商户分类',
    list: merCategory.value,
    checked: [],
    type: 'merCategory',
    showMore: true, //true显示展开
    isShowBtnMore: false,
  },
  {
    name: '店铺类型',
    list: merType.value,
    checked: [],
    type: 'merType',
    showMore: true, //false显示收起
    isShowBtnMore: false, //是否展示收起展开按钮
  },
])

/**
 * 列表
 */
const where = reactive<MerchantListQuery>({
  page: 1,
  limit: 10,
  categoryIds: null,
  keywords: searchValue.value,
  typeIds: null,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => getMerSearchApi(where), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChange = (e: number) => {
  where.page = e
  refresh()
}

//获取选中结果
const handleSubmitChecked = (list: Array<number>) => {
  where.categoryIds = list.merCategory ? list.merCategory.toString() : ''
  where.typeIds = list.merType ? list.merType.toString() : ''
  refresh()
}

const useMerchants = useMerchant()
//关注
const handleFollow = (item: any) => {
  if (item.isCollect) {
    //取消关注
    useMerchants
      .onUnfollowMerchant(item.id)
      .then(() => {
        item.isCollect = !item.isCollect
      })
      .catch(() => {
        listLoading.value = false
      })
  } else {
    // 关注
    useMerchants
      .onfollowMerchant(item.id)
      .then(() => {
        item.isCollect = !item.isCollect
        listLoading.value = false
      })
      .catch(() => {
        listLoading.value = false
      })
  }
}
</script>

<template>
  <div class="merchant_list h-100%">
    <div class="wrapper_1200 h-100%">
      <page-header title="全部结果"></page-header>
      <seach-list
        :list="seachLists"
        v-if="
          (seachLists[0].list && seachLists[0].list.length > 0) || (seachLists[1].list && seachLists[1].list.length > 0)
        "
        @handleSubmitChecked="handleSubmitChecked"
      ></seach-list>
      <div class="acea-row mt-20px h-70%" v-loading="listLoading">
        <div v-if="tableData.total > 0" class="acea-row">
          <template v-for="item in tableData.list" :key="item.id">
            <div class="w-590px h-296px bg-#FFFFFF b-rd-16px py-25px pl-20px mb-20px merchant-item cursors">
              <div
                class="flex-between-center mb-25px pr-20px"
                @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.id })"
              >
                <div class="acea-row">
                  <el-image :src="item.avatar" class="w-46px h-46px b-rd-50% mr-10px"></el-image>
                  <div>
                    <div class="mb-5px acea-row items-center">
                      <div v-if="item.isSelf">
                        <span
                          class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
                          style="top: -1px"
                          >自营</span
                        >
                      </div>
                      <span class="text-14px text-#333">{{ item.name }}</span>
                    </div>
                    <el-rate
                      v-model="item.starLevel"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                </div>
                <div
                  @click.stop="handleFollow(item)"
                  class="w-80px h-30px lh-29px borderSolE9 text-12px font-color text-center b-rd-15px cursors flex-center"
                >
                  <span v-show="!item.isCollect" class="iconfont icon-guanzhu mr-4px" style="font-size: 12px"></span>
                  <span class="line-heightOne">{{ item.isCollect ? '已关注' : '关注' }}</span>
                </div>
              </div>
              <div class="acea-row">
                <div
                  @click.stop="handlerProDetailLink(items.id, 0)"
                  v-for="items in item.proList"
                  :key="items.id"
                  class="relative h-170px"
                >
                  <el-image :src="items.image" class="w-170px h-170px b-rd-12px mr-20px"></el-image>
                  <div class="w-170px h-36px price lh-36px text-#fff text-12px absolute bottom-0 text-center">
                    <span class="oppoSans-M">￥</span><span class="text-20px dinProRegular">{{ items.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="w-100% h-100%">
          <empty-page title="暂无店铺哟~">
            <template v-slot:emptyImage>
              <img src="@/assets/images/dayang.png" />
            </template>
          </empty-page>
        </div>
      </div>
      <div v-if="tableData.total > 0" class="acea-row row-middle pb-10px">
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
  </div>
</template>

<style scoped lang="scss">
.merchant {
  &-item {
    margin-right: 20px;
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
.price {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 0px 12px 12px;
}
</style>
