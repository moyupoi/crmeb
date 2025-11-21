<script setup lang="ts">
import { reactive, ref } from 'vue'
import {proCouponListApi, systemCouponListApi} from '~/server/activityApi'
import { PageQuery } from '~/types/global'
import {stringToBool} from "~/utils/util";
import ProductSeach from "~/components/productSeach.vue";
import {Search} from "@element-plus/icons-vue";

const route = useRoute()
const couponId = ref<number>(Number(<string>route.query.couponId)) //优惠券户id
const jumpType = ref<string>(<string>route.query.jumpType) //跳转1平台优惠券使用，2我的优惠券使用
const isUserReceive = ref<boolean>(stringToBool(<string>route.query.isUserReceive)) //是否已领取优惠券
const money = ref<string>(<string>route.query.money) //优惠券金额
const minPrice = ref<string>(<string>route.query.minPrice) //满足条件
//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176-200 )

/**
 * 列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  couponId: couponId.value,
  keyword: '',
  userCouponId: couponId.value
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => jumpType.value === '1' ? systemCouponListApi(where) : proCouponListApi(where), {
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

//领券优惠券
const useMerchants = useMerchant()
const handleReceiveCoupon = async () => {
  if(isUserReceive.value) return
  await useMerchants.onReceiveCoupon(couponId.value).then(() => {
    isUserReceive.value = !isUserReceive.value
  })
}
</script>

<template>
  <div class="coupon_goods_list pt-20px">
    <div class="wrapper_1200">
      <div class="w-100% h-134px bg-#FFFFFF b-rd-16px px-20px py-20px">
        <div class="flex-between-center mb-20px px-20px">
          <div class="text-#666 text-14px">共搜索到 {{tableData.total}} 件符合条件的商品</div>
          <el-input
              @keyup.enter="refresh"
              v-model="where.keyword"
              style="width: 220px;font-size: 12px;"
              placeholder="搜索商品名称"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="w-100% h-50px bg-#FFF4F4 b-rd-8px px-20px flex-between-center mb-20px">
          <div class="flex-y-center">
            <span class="text-14px text-#282828 mr-10px" style="font-weight: 400">以下商品适用于</span>
            <span class="px-10px py-7px text-14px lh-14px font-color relative borderSolE9 b-rd-4px">
            <span class="text-14px font-color">满{{minPrice}}减{{money}}</span>
            <span class="roll left-roll"></span>
            <span class="roll right-roll"></span>
          </span>
          </div>
          <div @click="handleReceiveCoupon" class="w-86px h-30px handleBtn lh-29px text-12px" :class="isUserReceive?'':'cursors'">{{isUserReceive ? '已领取' : '立即领取'}}</div>
        </div>
      </div>
      <div v-loading="listLoading">
        <div v-if="tableData.total>0">
          <product-seach :list="tableData.list"></product-seach>
          <div class="acea-row row-middle mt-5px pb-10px">
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
          <empty-page title="暂无优惠券哟~">
            <template v-slot:emptyImage>
              <img src="@/assets/images/wuyouhui.png" />
            </template>
          </empty-page>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.coupon_goods_list {
  :deep(.el-input__wrapper) {
    border: none !important;
    box-shadow: none !important;
  }
  :deep(.el-input) {
    --el-fill-color-blank: #f7f7f7 !important;
    --el-border-radius-base: 20px;
  }
}
.roll {
  position: absolute;
  width:8px;
  height: 8px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #FFF4F4;
  border: 1px solid #E93323;

  &.left-roll {
    left: -3px;
    border-left-color: #fff!important;
  }

  &.right-roll {
    right: -3px;
    border-right-color: #fff!important;
  }
}
</style>
