<script setup lang="ts">
import useDialog from '~/composables/useDialog'
import { getCouponTime } from '~/utils/util'
import { toRefs, reactive, watch } from 'vue'
import { couponReceiveApi } from '~/server/merchantApi'
import feedback from '~/utils/feedback'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  //列表数据
  productId: {
    type: Number,
    default: 0,
  },
})
const { productId } = toRefs(props)
const listLoading = ref<boolean>(false)
watch(productId, (newValue, oldValue) => {
  const where = reactive<CouponListQuery>({
    page: 1,
    limit: 50,
    productId: newValue,
    category: 0,
  })
  getCouponList(where)
})

const coupon = reactive({
  list: [],
  total: 0,
})
const getCouponList = async (where: CouponListQuery) => {
  let data = await couponListApi(where)
  Object.assign(coupon, data)
}

const { bool: dialogVisibleCoupon, DialogOpen, DialogClose } = useDialog()
//打开
defineExpose({ DialogOpen, DialogClose })

//关闭
const nuxtApp = useNuxtApp()
const handleCloseCoupon = () => {
  DialogClose()
  nuxtApp.$onHandlerCloseCoupon()
}

/**
 * 我的优惠券列表
 */
import { couponListApi } from '~/server/goodsApi'
import { CouponListQuery } from '~/types/goods'
import {useNuxtApp} from "nuxt/app";
onMounted(() => {})

//领取优惠券
const handleReceiveCoupon = async (item: any) => {
  if (item.isUse) return
  listLoading.value = true
  try {
    await couponReceiveApi(item.id)
    feedback.msgSuccess('领取成功')
    item.isUse = !item.isUse
    listLoading.value = false
  } catch (e) {
    listLoading.value = false
  }
}
</script>

<template>
  <div class="overflow-hidden">
    <div class="bg-#FFFFFF h-100% drawer receiveCouponDrawer w-280px">
      <header class="el-drawer__header flex flex-between-center">
        <h4>优惠券{{ productId }}</h4>
        <el-icon @click="handleCloseCoupon" class="cursor-pointer font18"><Close /></el-icon>
      </header>

      <div class="el-drawer__body">
        <div v-loading="listLoading" class="receiveCoupon mt-15px">
          <div
            v-for="(item, index) in coupon.list"
            @click="handleReceiveCoupon(item)"
            :key="index"
            class="receiveCouponList acea-row cursors mb-20px"
          >
            <div class="w-200px text-#fff pl-20px pt-10px">
              <div class="text-12px mb-10px">
                <span class="oppoSans-M">￥</span
                ><span class="text-30px mr-10px lh-30px dinProSemiBold">{{ item.money }}</span
                ><span class="lh-12px">满 {{ item.minPrice }} 可用</span>
              </div>
              <div class="text-12px mb-9px line2 w-177px">{{ item.name }}</div>
              <div v-if="item.isFixedTime" class="text-12px">
                {{ getCouponTime(item.useStartTimeStr, item.useEndTimeStr) }}
              </div>
              <div v-else class="text-12px">{{ '领取后' + item.day + '天内可用' }}</div>
            </div>
            <div class="w-50px flex-center">
              <div class="w-20px h-80px bg-#fff b-rd-12px text-center font-color text-12px flex-center verticalClass">
                {{ item.isUse ? '已领取' : '立即领取' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-drawer__header {
  margin-bottom: 0 !important;
  padding: 10px !important;
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
  color: #3d3d3d;
}
.el-drawer__body {
  padding: 0 15px 20px 15px !important;
}
.right-278px,
.right-0px {
  transition: all 7s;
  // transform: translateX(0);
}
.drawer {
  //position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  --el-bg-color: #f5f5f5;
}
.receiveCouponDrawer {
  transition: all 0.7s;
}
:deep(.el-divider--horizontal) {
  margin: 20px 0 30px 0 !important;
}
:deep(.el-divider__text) {
  --el-bg-color: #f5f5f5;
}
.receiveCouponList {
  width: 250px;
  height: 116px;
  background-image: url('@/assets/images/yhq.png');
}
</style>
