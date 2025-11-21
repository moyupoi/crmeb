<script setup lang="ts">
import { PageQuery } from '~/types/global'
import { reactive, ref } from 'vue'
import { couponCollectionApi } from '~/server/activityApi'
import { couponTypeFilter } from '~/utils/filter'

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 200)

/**
 * 列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 12,
  category: 0,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => couponCollectionApi(where), {
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

const parsePrice = (price) => {
  if (price >= 100) {
    return parseFloat(price)
  } else {
    return price
  }
}

//领券优惠券
const useMerchants = useMerchant()
const handleReceiveCoupon = async (item: any) => {
  if (item.isUserReceive) return
  await useMerchants.onReceiveCoupon(item.id).then(() => {
    item.isUserReceive = !item.isUserReceive
  })
}

//去使用
import { linkNavigateTo } from '~/utils/util'
const handleToUse = async (item: any) => {
  await linkNavigateTo('/activity/coupon_goods_list', {
    jumpType: 1,
    couponId: item.id,
    isUserReceive: item.isUserReceive,
    money: item.money,
    minPrice: item.minPrice,
  })
}

const getTime = (time: string) => {
  let reg = new RegExp('-', 'g') //g代表全部
  return time ? time.split(' ')[0].substring(2, 10) : ''
}
</script>

<template>
  <div class="coupon_box">
    <div class="coupon_list w-100% h-330px"></div>
    <div class="wrapper_1200 pt-60px relative z-10">
      <div class="fontColor333 text-50px text-center mb-50px alimama font-700">领券中心</div>
      <div v-loading="listLoading">
        <div v-if="tableData.total > 0">
          <div class="coupon_listBox acea-row">
            <template v-for="item in tableData.list" :key="item.id">
              <div
                class="list acea-row row-around cursors"
                :class="item.lastTotal === 0 ? 'notSelectable' : item.isUserReceive ? 'received' : 'selectable'"
              >
                <!--左侧-->
                <div class="w-340px pl-15px py-25px h-160px" @click="handleToUse(item)">
                  <div class="acea-row">
                    <div v-if="item.productVoList.length">
                      <el-image
                        :src="item.productVoList[0].image"
                        mode=""
                        class="w-110px h-110px b-rd-12px mr-20px"
                      ></el-image>
                    </div>
                    <div v-else>
                      <img src="@/assets/images/yhqwushangp.png" mode="" class="w-110px h-110px b-rd-12px mr-10px" />
                    </div>
                    <div class="">
                      <div class="text-18px mb-11px font-color">
                        <span class="oppoSans-M">￥</span
                        ><span class="text-28px mr-5px lh-30px dinProSemiBold">{{ item.money }}</span>
                        <span class="text-14px oppoSans-R" v-if="item.minPrice == 0">无使用门槛</span>
                        <span v-else class="line1 text-14px oppoSans-R">满{{ parsePrice(item.minPrice) }}元可用</span>
                      </div>
                      <div class="text-14px text-#333 font-500 mb-18px line2 w-177px h-36px lh-18px oppoSans-M">
                        <span
                          class="bg-#FDEAE9 px-6px pt-1px font-color text-12px b-rd-10px inline-block mr-4px oppoSans-R"
                          >{{ couponTypeFilter(item.category) }}</span
                        >{{ item.name }}
                      </div>
                      <div class="text-12px text-#999 lh-12px oppoSans-R" v-if="item.isFixedTime">
                        {{ getTime(item.useStartTime) + ' ~ ' + getTime(item.useEndTime) + '可用' }}
                      </div>
                      <div class="text-12px text-#999 lh-12px oppoSans-R" v-else>
                        {{ '领取后' + item.day + '天内可用' }}
                      </div>
                      <!--                    <div>{{ getTime(item.receiveStartTime) }} - {{ getTime(item.receiveEndTime) }}</div>-->
                    </div>
                  </div>
                </div>
                <!--右侧-->
                <div class="w-48px">
                  <div class="title">
                    <div v-if="item.lastTotal === 0">
                      <div class="verticalClass w-48px h-160px b-rd-12px text-center text-#fff text-16px flex-center">
                        已领完
                      </div>
                      <span class="iconfont icon-yilingwan1"></span>
                    </div>
                    <div v-else>
                      <div
                        class="w-48px h-160px b-rd-12px text-center text-#fff text-16px flex-center verticalClass"
                        v-if="!item.isUserReceive"
                        @click="handleReceiveCoupon(item)"
                      >
                        立即领取
                      </div>
                      <div v-if="item.lastTotal > 0 && item.isUserReceive">
                        <div
                          class="w-48px h-160px b-rd-12px text-center text-#fff text-16px flex-center cursors verticalClass"
                          @click="handleToUse(item)"
                        >
                          去使用
                        </div>
                        <span class="iconfont icon-yilingqu"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="acea-row row-middle pb-10px">
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
<style lang="scss">
html {
  background-color: #f9f9f9 !important;
}
.coupon_list {
  background-image: url('~/assets/images/lqbj.png');
  background-size: 100% 330px;
  background-repeat: no-repeat;
  position: absolute;
}
.coupon_listBox {
  .selectable {
    background-image: url('@/assets/images/lqyhqbj.png');
  }
  .notSelectable {
    background-image: url('@/assets/images/lqbjhui.png');
  }
  .received {
    background-image: url('@/assets/images/yilingquyou.png');
  }
  .list {
    width: 390px;
    height: 160px;
    overflow: hidden;
    background-size: cover;
    margin-bottom: 20px;
    background-repeat: no-repeat;
    margin-right: 15px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  .list:nth-child(1) {
    .right {
      &::after {
        background-color: #e93323;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
:deep(.empty-box) {
  height: 100% !important;
}
</style>
