<script setup lang="ts">
import { useCopy } from '~/composables/useCopy'
import { invoiceListApi, orderLogisticsApi } from '~/server/orderApi'
import { merCustomerApi } from '~/server/merchantApi'
import useOrder from '~/composables/useOrder'
import { ProductTypeEnum } from '@/enums/productEnums'
import { ItemObject } from '~/types/global'

//订单号
const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo)
const secondType = ref<string>(<string>route.query.secondType) //二级订单类型

//物流列表
const { data: invoiceList } = await useAsyncData(async () => invoiceListApi(orderNo.value))

//包裹切换
const logisticsIdx = ref<number>(0)
const handleChangeTab = async (index: number) => {
  logisticsIdx.value = index
  refresh()
}

// 物流信息详情
const {
  data: logisticsInfo,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => orderLogisticsApi(invoiceList.value.invoiceList[logisticsIdx.value].id))

//复制
const { handleCopy } = useCopy()
const handleCopyNum = () => {
  handleCopy(invoiceList.value.invoiceList[logisticsIdx.value].trackingNumber)
}

//获取客服配置
const { chatConfig, getPlatChatConfig } = useOrder()
const chatConfigData = reactive<ItemObject>({})
const getChatConfig = async () => {
  let data = await merCustomerApi(invoiceList.value.invoiceList[logisticsIdx.value].merId)
  Object.assign(chatConfigData, data)
}
if (secondType.value != ProductTypeEnum.Integral) getChatConfig()

//联系客服
const handleChat = async () => {
  if (secondType.value == ProductTypeEnum.Integral) {
    getPlatChatConfig()
  } else {
    await chatConfig(chatConfigData)
  }
}
</script>

<template>
  <div class="wrapper_1200">
    <div class="w-100% borRadius bg-#FFF py-30px mbtom20 mt-20px">
      <!-- 包裹选择-->
      <div class="flex flex-justify-between mb-35px px-30px">
        <div class="acea-row">
          <div
            v-for="(item, index) in invoiceList.invoiceList"
            :key="index"
            class="text-16px cursors mr-50px"
            :class="logisticsIdx === index ? 'font-color' : 'text-#666666'"
            @click="handleChangeTab(index)"
          >
            {{ '包裹' + (index + 1) }}
          </div>
        </div>
        <div
          @click="handleChat"
          class="w-86px h-30px text-center lh-29px borderSolE9 b-rd-22px text-12px font-color cursors"
        >
          联系商家
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="acea-row items-center" style="margin-right: -30px">
        <div
          v-for="item in invoiceList.invoiceList[logisticsIdx].detailList"
          :key="item.id"
          class="acea-row mb-20px goods"
        >
          <el-image :src="item.image" class="w-108px h-108px b-rd-8px mr-20px"></el-image>
          <div class="text-14px text-#333333 acea-row flex-col flex-justify-around">
            <div class="fontsweight w-415px line1">{{ item.productName }}</div>
            <div class="">规格：{{ item.sku }}</div>
            <div class="">发货数量：{{ item.num }}</div>
          </div>
          <!--          <div v-if="invoiceList.invoiceList[logisticsIdx].detailList.length > 1" class="w-1px h-82px bg-#EEEEEE ml-20px mr-20px"></div>-->
        </div>
      </div>
    </div>
    <!--快递配送-->
    <div
      v-if="invoiceList.invoiceList[logisticsIdx].deliveryType === 'express'"
      v-loading="listLoading"
      class="w-100% borRadius bg-#FFF py-20px px-30px mbtom20"
    >
      <!-- 物流公司信息-->
      <div class="flex flex-justify-between mb-20px">
        <div class="flex-between-center">
          <div class="w-50px h-50px bg-#F7F7F7 b-rd-50% flex-center">
            <span class="iconfont icon-kuaidi" style="font-size: 24px"></span>
          </div>
          <div class="text-14px text-#333 ml-20px">{{ invoiceList.invoiceList[logisticsIdx].expressName }}</div>
          <div class="text-14px text-#333 ml-20px">{{ invoiceList.invoiceList[logisticsIdx].trackingNumber }}</div>
        </div>
        <div
          @click="handleCopyNum"
          class="w-56px h-30px text-center lh-29px borderSol b-rd-22px text-12px text-#666666 cursors"
        >
          复制
        </div>
      </div>
      <el-divider border-style="dashed" />
      <!-- 物流详情信息-->
      <div v-if="logisticsInfo" class="relative" style="top: 30px">
        <div class="logisticsCon" v-for="(item, index) in logisticsInfo.list" :key="index">
          <div class="acea-row">
            <div
              class="data text-12px mr-20px text-right mb-40px relative"
              :class="index === 0 ? 'text333 text-#333' : 'text-status'"
            >
              <div class="mb-5px">{{ item.time.split(' ')[0] }}</div>
              <div>{{ item.time.split(' ')[1] }}</div>
            </div>
            <div class="w-90% mb-10px relative" :class="index !== logisticsInfo.list.length - 1 ? 'text' : ''">
              <div class="circular flex-center" :class="index === 0 ? 'on' : ''">
                <div v-if="index === 0" class="checked"></div>
              </div>
              <div class="text-14px pl-20px absolute" :class="index === 0 ? 'font-color' : 'text-status'">
                {{ item.status }}
              </div>
              <div
                v-if="index === logisticsInfo.list.length - 1"
                class="circular flex-center"
                style="margin: -9px 0 0px -3px"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="invoiceList.invoiceList[logisticsIdx].deliveryType === 'noNeed'"
      v-loading="listLoading"
      class="w-100% borRadius bg-#FFF py-20px px-30px mbtom20"
    >
      <div class="text-14px text-#333">{{ secondType == ProductTypeEnum.Fictitious ? '虚拟发货' : '无需发货' }}</div>
      <el-divider border-style="dashed" />
      <div class="relative">
        <div class="text-14px text-#333" :title="invoiceList.invoiceList[logisticsIdx].deliveryMark">
          备注信息：{{ invoiceList.invoiceList[logisticsIdx].deliveryMark || '无' }}
        </div>
      </div>
    </div>
    <div v-else v-loading="listLoading" class="w-100% borRadius bg-#FFF py-20px px-30px mbtom20">
      <div class="text-14px text-#333">商家送货</div>
      <el-divider border-style="dashed" />
      <div class="relative">
        <div class="text-14px text-#333">
          {{ invoiceList.invoiceList[logisticsIdx].deliveryCarrier }}：{{
            invoiceList.invoiceList[logisticsIdx].carrierPhone
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.goods {
  border-right: 1px solid #eeeeee;
  padding-right: 30px;
  padding-left: 30px;
  &:nth-last-child(2n) {
    border-right: none;
  }
}
.font-color,
.text333 {
  top: -16px;
}
.text-status {
  top: -10px;
  color: #666666;
}
.logisticsCon {
  .circular {
    width: 8px;
    height: 8px;
    background: #d0d0d0;
    border-radius: 50%;
    opacity: 1;
    border: 2px solid #ffffff;
    color: #666666;
    margin: -9px 0 0px -5px;
    position: absolute;
  }
  .checked {
    width: 7px;
    height: 7px;
    background: #e93323;
    border-radius: 50%;
  }
  .on {
    width: 13px;
    height: 13px;
    opacity: 1;
    top: -6px;
    left: -2px;
    border: 1px solid #ff877c;
    position: absolute;
    background: #fff !important;
  }
  .text {
    border-left: 2px solid #d0d0d0;
  }
}
</style>
