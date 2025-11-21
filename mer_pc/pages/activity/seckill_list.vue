<script setup lang="ts">
import { seckillListApi, seckillTimeApi } from '~/server/activityApi'
import { SeckillListQuery } from '~/types/activity'
import { reactive, ref } from 'vue'
import useOrder from '~/composables/useOrder'
import { timeStatusFilter } from '~/utils/filter'
import { ItemObject } from '~/types/global'
import { Navigation } from 'swiper'
const useOrders = useOrder()
//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 280)

const bgColor = reactive<any>({
  bgColor: '',
  Color: '',
  width: '36rpx',
  timeTxtwidth: '16rpx',
  isDay: true,
  fontSize: '14px',
})

const swiperData = reactive({
  spaceBetween: 0,
  slidesPerView: 4, //一屏几个
  boxWidth: 'w-1200px', //外盒子宽
  slideWidth: 'w-276px', //内容宽
  boxPadding: 'padding: 0 48px', //外盒子左右padding
  modules: [Navigation],
  navigationColor: 'color:#999', //左右箭头的颜色
  navigationBgColor: '', //左右箭头的背景颜色
})

//秒杀时间段
const swiperRef = shallowRef()
const desc = ref<string>('')
const datatime = ref<number>(0)
const timeLine = ref<Array<number | string>>([])
const active = ref<number>(0) //第一个进行中的下标
const seckillStatus = ref<number>(0) //秒杀状态
const activeTime = reactive<ItemObject>({}) //选中时间
const getSeckillConfig = async () => {
  let data = await seckillTimeApi()
  if (!data.length) return
  timeLine.value = data
  active.value = timeLine.value.length ? data.findIndex((item: any) => item.status === 1 || item.status === 2) : 0
  if (active.value < 0) return
  if (data[active.value].status == 1) {
    desc.value = '距本场结束'
    datatime.value = data[active.value].endTimeStamp / 1000
    seckillStatus.value = 1
  } else if (data[active.value].status == 2) {
    desc.value = '距本场开始'
    seckillStatus.value = 2
    datatime.value = data[active.value].startTimeStamp / 1000
  } else if (data[active.value].status == 0) {
    desc.value = '已结束'
    seckillStatus.value = 0
  }
  Object.assign(activeTime, timeLine.value[active.value])
  getSeckillList()
  if (swiperRef.value) swiperRef.value.slideTo(active.value)
}
getSeckillConfig()

//点击时间
const handleChangeTime = (index: number, item: any) => {
  active.value = index
  seckillStatus.value = item.status
  datatime.value = item.startTimeStamp / 1000
  Object.assign(activeTime, item)
  where.page = 1
  getSeckillList()
}

//列表
const listLoading = ref<boolean>(false)
const where = reactive<SeckillListQuery>({
  page: 1,
  limit: 12,
  date: '',
  startTime: '',
  endTime: '',
})
const tableData = reactive({
  list: [],
  total: 0,
})
const getSeckillList = async () => {
  listLoading.value = true
  try {
    where.date = activeTime.date
    where.startTime = activeTime.startTime
    where.endTime = activeTime.endTime
    let data = await seckillListApi(where)
    tableData.list = data.list
    tableData.total = data.total
    listLoading.value = false
  } catch (err) {
    listLoading.value = false
  }
}

// 分页数据
const pageChange = (e: number) => {
  where.page = e
  getSeckillList()
}
</script>

<template>
  <div class="seckill_list pt-60px">
    <div class="wrapper_1200">
      <div class="fontColor333 text-50px text-center mb-50px font-700 alimama">限时秒杀</div>
      <div v-if="timeLine.length" class="h-60px w-1200px bg-#FFFFFF cursors mb-20px b-rd-12px overflow-hidden">
        <swiper-index :swiperSlideList="timeLine" :swiperData="swiperData" ref="swiperRef">
          <!-- 这里是插槽传递的值 -->
          <template v-slot:default="slotProps">
            <div
              @click="handleChangeTime(slotProps.value.swiperIndex, slotProps.value.swiperItem)"
              class="flex-center h-60px lh-60px w-276px"
              :class="active == slotProps.value.swiperIndex ? 'bg-color' : ''"
            >
              <div
                class="text-22px mr-9px font-600"
                :class="active == slotProps.value.swiperIndex ? 'text-#fff' : 'text-#282828'"
              >
                {{ slotProps.value.swiperItem.startTime }}
              </div>
              <div
                v-if="slotProps.value.swiperItem.status === 1"
                class="text-14px font-400 acea-row"
                :class="active == slotProps.value.swiperIndex ? 'text-#fff' : 'text-#666666'"
              >
                <span class="mr-5px">距结束</span>
                <countDown
                  :is-day="true"
                  :tip-text="' '"
                  :day-text="' '"
                  :hour-text="' : '"
                  :minute-text="' : '"
                  :second-text="' '"
                  :datatime="slotProps.value.swiperItem.endTimeStamp / 1000"
                  :isCol="false"
                  :bgColor="bgColor"
                >
                </countDown>
              </div>
              <div
                v-else
                class="text-14px font-400"
                :class="active == slotProps.value.swiperIndex ? 'text-#fff' : 'text-#666666'"
              >
                {{ timeStatusFilter(slotProps.value.swiperItem.status) }}
              </div>
            </div>
          </template>
        </swiper-index>
      </div>
      <div v-loading="listLoading">
        <div v-if="tableData.total > 0">
          <div class="acea-row">
            <template v-for="item in tableData.list" :key="item.id">
              <div
                class="borderSol-eee w-288px h440px borRadius overflow-hidden seckill_item cursors mb-20px"
                @click="useOrders.handlerProDetailLink(item.id, 1, seckillStatus, datatime)"
              >
                <el-image :src="item.image" class="w-289px h-289px"></el-image>
                <div class="px-20px py-20px bg-#FFFFFF">
                  <div class="acea-row mb-20px">
                    <div class="fontColor333 text-16px lh-16px line1 w-100%">{{ item.name }}</div>
                  </div>
                  <div class="mb-16px">
                    <span class="text-12px font-color oppoSans-M">￥</span
                    ><span class="text-20px lh-20px font-color dinProSemiBold">{{ item.seckillPrice }}</span
                    ><span class="line-through text-14px text-#999 ml-10px dinProRegular font-400"
                      >￥{{ item.price }}</span
                    >
                  </div>
                  <div
                    class="w-249px h-36px seckill_btn flex-y-center"
                    :class="
                      seckillStatus === 0
                        ? 'ended'
                        : seckillStatus === 1 && item.quota === 0
                        ? 'ranOut'
                        : seckillStatus === 1
                        ? 'qiang'
                        : 'noStart'
                    "
                  >
                    <div
                      class="w-100px h-8px ml-10px b-rd-18px"
                      :class="seckillStatus === 1 ? 'bg-#F0D2CF' : 'bg-#D6D6D6'"
                    >
                      <div
                        class="h-8px b-rd-18px"
                        :class="seckillStatus === 1 ? 'bg-color' : 'bg-#999'"
                        :style="'width:' + item.payRange"
                      ></div>
                    </div>
                    <div class="text-12px ml-10px" :class="seckillStatus === 1 ? 'font-color' : 'text-#999'">
                      已抢{{ item.payRange }}
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
        <div v-else>
          <ClientOnly>
            <div class="w-100%" :style="{ height: ScrollHeight + 'px' }">
              <empty-page title="暂无秒杀商品哟~">
                <template v-slot:emptyImage>
                  <img src="@/assets/images/wushangpin.png" />
                </template>
              </empty-page>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html {
  background-color: #fff;
}
.seckill_list {
  background-image: url('~/assets/images/miaoshabj.png');
  background-size: 100% 330px;
  background-repeat: no-repeat;
  .w-276px {
    width: 276px !important;
  }
}
.seckill_item {
  margin-right: 15px;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
.seckill_btn {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
<style lang="scss" scoped>
:deep(.swiper-button-prev) {
  margin-left: 0 !important;
}
:deep(.swiper-button-next) {
  margin-right: 0 !important;
}
.qiang {
  background-image: url('~/assets/images/anniub.png');
}
.noStart {
  background-image: url('~/assets/images/weikaishi.png');
}
.ranOut {
  background-image: url('~/assets/images/yiqiangwan.png');
}
.ended {
  background-image: url('~/assets/images/yijieshu.png');
}
:deep(.swiper-wrapper) {
  //padding: 0 48px !important;
}
:deep(.empty-box) {
  height: 100% !important;
}
</style>
