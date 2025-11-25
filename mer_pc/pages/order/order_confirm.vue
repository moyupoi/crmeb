<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { addressDetailApi, addressListApi, computedPriceApi, orderCreateApi, orderLoadPreApi } from '~/server/orderApi'
import { AddressInfo, OrderInfoVo } from '~/types/order'
import { defaultAddressInfo, defaultOrderInfo } from '~/pages/order/defaultOrder'
import { getCouponTime, linkNavigateTo } from '~/utils/util'
import { ref, reactive, computed } from 'vue'
import SystemFrom from '~/components/systemFrom.vue'
import { addressDefault } from '~/pages/users/defaultUser'
import { couponTypeFilter } from '~/utils/filter'
import feedback from '~/utils/feedback'
import { ProductTypeEnum } from '~/enums/productEnums'
const { objToArr } = useOrder()

//获取浏览器值
const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo)
const loading = ref<boolean>(false)
const userStore = useUserStore()

/**
 * 预下单详情
 */
const orderInfoVo = reactive<OrderInfoVo>(defaultOrderInfo())
const platCouponFee = ref<string>('') //平台优惠券金额
const platUserCouponId = ref<number>(0) //平台优惠券id
const merCouponFee = ref<string>('') //商户优惠券id
const orderMerchantRequestList = ref<Array<T>>([]) //提交订单数据
const orderProNum = ref<number>(0)
const addressId = ref<number>(0) //地址id
const merchantOrderVoList = ref<Array<T>>([])
const orderType = ref<number>(0) // 0-基础订单,1-秒杀订单,2-拼团订单
const systemFormValue = ref<string>('') //系统表单数据
const getloadPreOrder = async () => {
  loading.value = true
  await orderLoadPreApi(orderNo.value)
    .then((res: any) => {
      Object.assign(orderInfoVo, res)
      systemFormValue.value = orderInfoVo.systemFormValue
      if (res.addressId) addressId.value = res.addressId
      //地址详情
      getaddressInfo()
      merchantOrderVoList.value = res.merchantInfoList //商户端数据
      platCouponFee.value = res.platCouponFee //平台优惠券总金额
      platUserCouponId.value = res.platUserCouponId //平台优惠券id
      merCouponFee.value = res.merCouponFee //店铺优惠券总金额
      orderType.value = res.type //订单类型
      res.merchantInfoList.map((item: any) => {
        orderMerchantRequestList.value.push({
          shippingType: item.shippingType,
          merId: item.merId,
          remark: item.remark,
          userCouponId: item.userCouponId,
        })
      })
      orderProNum.value = res.orderProNum
      loading.value = false
    })
    .catch((res: any) => {
      linkNavigateTo(`/users/order_list`, { type: 1 })
      loading.value = false
    })
}
getloadPreOrder()

//是否是云盘5,卡密6 虚拟2商品, 可以使用优惠券、积分抵扣
const isProductType = computed(() => {
  return (
    orderInfoVo.secondType === ProductTypeEnum.Fictitious ||
    orderInfoVo.secondType === ProductTypeEnum.CloudDrive ||
    orderInfoVo.secondType === ProductTypeEnum.CardPassword
  )
})

/**
 * 获取默认收货地址或者获取某条地址信息
 */
const addressInfo = reactive<AddressInfo>(defaultAddressInfo())
const getaddressInfo = async () => {
  let data = await addressDetailApi(addressId.value)
  Object.assign(addressInfo, data)
}

/**
 * 地址列表
 */
const showAddress = ref<boolean>(true) //是否展示更多地址
const { data: addressList, refresh } = await useAsyncData(async () => addressListApi())

/**
 * 选择使用优惠券，优惠券弹窗
 * @param {Object} item优惠券对象
 * @param {Number} merId商户id
 * @param {Number} index索引
 * @param {Object} itm 商户对象
 */
const loadingCoupon = ref<boolean>(true)
const dialogVisible = ref<boolean>(false)
const coupon = reactive({
  list: [],
})
const merId = ref<number>(0)
const activeIndexCoupon = ref<number>(0)
const couponObj = reactive({}) //选中这条优惠券的对象
const couponTap = (item: any, merIds: number, index: number, itm: any) => {
  loadingCoupon.value = true
  coupon.list = JSON.parse(JSON.stringify(item))
  merId.value = merIds

  if (merIds !== 0) {
    activeIndexCoupon.value = index
    orderMerchantRequestList.value[activeIndexCoupon.value].userCouponId = itm.userCouponId
  }
  if (coupon.list.length === 0) return
  dialogVisible.value = true
  loadingCoupon.value = false
}
//选择优惠券
const getCouponUser = (index: number, item: any) => {
  if (!item.isChecked && !item.isChoose) return
  coupon.list.map((i) => {
    if (!item.isChecked) i.isChecked = false
  })

  item.isChecked = !item.isChecked
  Object.assign(couponObj, item)
}

//确认选中优惠券
const handleConfirm = async () => {
  let item = couponObj
  if (Object.keys(item).length > 0) {
    if (item.merId === 0) {
      platUserCouponId.value = item.isChecked ? item.id : 0
    } else {
      orderMerchantRequestList.value[activeIndexCoupon.value].userCouponId = item.isChecked ? item.id : 0
    }
  }
  coupon.list = []
  dialogVisible.value = false
  await computedPrice()
}

//买家留言
const handleMessage = (remark: string, index: number) => {
  orderMerchantRequestList.value[index].remark = remark
}

/**
 * 计算订单价格
 */
const isUseIntegral = ref<boolean>(false) //是否使用积分
const merUserCouponId = ref<number>(0) //店铺使用优惠券的id
const computedPrice = () => {
  loading.value = true
  let fromData = {
    addressId: addressId.value,
    isUseIntegral: isUseIntegral.value,
    orderMerchantRequestList: orderMerchantRequestList.value,
    preOrderNo: orderNo.value,
    platUserCouponId: platUserCouponId.value,
  }
  computedPriceApi(fromData)
    .then((res: any) => {
      let data = res
      //usedIntegral 使用的积分，surplusIntegral 剩余积分
      if (data.merOrderResponseList && data.merOrderResponseList.length) {
        data.merOrderResponseList.map((item, i) => {
          merchantOrderVoList.value[i].freightFee = item.freightFee
          merchantOrderVoList.value[i].couponFee = item.couponFee
        })
      } else {
        merchantOrderVoList.value[0].freightFee = data.freightFee
        merchantOrderVoList.value[0].couponFee = data.couponFee
      }
      Object.assign(orderInfoVo, data)
      merCouponFee.value = data.merCouponFee //店铺优惠券总金额
      orderInfoVo.userIntegral = data.surplusIntegral //使用的积分`
      orderInfoVo.surplusIntegral = data.usedIntegral //剩余积分
      platCouponFee.value = data.platCouponFee //平台优惠金额
      //选中商户优惠券的值
      merchantOrderVoList.value[activeIndexCoupon.value].merCouponUserList =
        data.merOrderResponseList[activeIndexCoupon.value].merCouponUserList //商户数据
      merUserCouponId.value = data.merOrderResponseList[activeIndexCoupon.value].userCouponId //店铺使用优惠券的id
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
    })
}

//表单数据整合
const systemFormData = ref([])
const getFromDataInfn = () => {
  let systemFormValue = systemFromRef.value.systemformData.orderNewForm
   console.log('systemFormValue',systemFormValue)
  for (let i = 0; i < systemFormValue.length; i++) {
    const curdata = systemFormValue[i]
    if (curdata.name === 'uploadPicture') {
      curdata.values = systemFromRef.value.picList
      curdata.value = systemFromRef.value.picList
      // if (!curdata.values.length) {
      //   return  feedback.msgWarning('请选择下单地址抵挡的')
      //   break;
      // }
    }
    if (curdata.name === 'radios') {
      curdata.value = curdata.values.val
    } else if (curdata.name === 'timeranges') {
      curdata.value = curdata.values ? curdata.values.join('-') : ''
    } else if (curdata.name === 'dateranges') {
      curdata.value = curdata.values[0] + ' -- ' + curdata.values[1]
    } else if (curdata.name === 'checkboxs') {
      let obj = ''
      curdata.values.forEach((j) => {
        obj = obj + (obj ? ',' : '') + j.val
      })
      curdata.value = obj
    } else if (curdata.name === 'citys') {
      curdata.value = curdata?.values ? curdata?.values?.join(',') : ''
    }  else {
      curdata.value = curdata.values
    }
    systemFormData.value.push({
      title: curdata.titleConfig.val,
      value: curdata.value,
    })
  }
}

/**
 * 创建订单 立即下单
 */
const systemFromRef = ref('')
const handleCreatOrder = async () => {
  if (!addressId.value && !isProductType.value) return feedback.msgWarning('请选择下单地址')
  if (orderInfoVo.systemFormValue) {
    systemFromRef.value?.systemFormRef?.validate(async (valid) => {
      if (valid) {
        let systemFormValue = systemFromRef.value.systemformData.orderNewForm
        await getFromDataInfn()
        for (let i = 0; i < systemFormValue.length; i++) {
          const curdata = systemFormValue[i]
          if (curdata.titleShow.val && !curdata.values.length && curdata.name === 'uploadPicture') {
            return feedback.msgWarning(`请上传${curdata.titleConfig.val}`)
          }
        }
        loading.value = true
        await handlePostData()
      } else {
        feedback.msgWarning('请填写表单内容')
      }
    })
  } else {
    await handlePostData()
  }
}

const handlePostData = async () => {
  let fromData = {
    addressId: addressId.value,
    isUseIntegral: isUseIntegral.value,
    orderMerchantRequestList: orderMerchantRequestList.value,
    preOrderNo: orderNo.value,
    platUserCouponId: platUserCouponId.value,
    orderExtend: orderInfoVo.systemFormValue ? JSON.stringify([systemFormData.value]) : '',
    systemFormId: orderInfoVo.systemFormId
  }
  try {
    const res = await orderCreateApi(fromData)
    linkNavigateTo(`/order/order_payment`, { orderNo: res.orderNo })
    loading.value = false
  }catch (e) {
    loading.value = false
  }
}

//取消选择
const handleCancel = () => {
  dialogVisible.value = false
}

/**
 * 使用积分
 */
const handleIntegral = async () => {
  await computedPrice()
}

/**
 * 添加收货地址
 */
const selAddressData = ref<any[]>([]) //选中的地址数组
const { bool: dialogVisibleAddress, DialogOpen, DialogClose } = useDialog()
const userAddAddressRef = shallowRef()
const handleAddAddress = async () => {
  Object.assign(addressInfo, addressDefault())
  selAddressData.value = []
  DialogOpen()
}
//关闭弹窗
const handleSubmitClose = () => {
  DialogClose()
}
//添加成功回调
const handleSubmitAddress = (addressIds: number) => {
  addressId.value = addressIds
  refresh()
  computedPrice()
  DialogClose()
}

/**
 * 选择地址
 */
const currentAddress = ref<number | null>(null)
const handleChangeAddress = async (index: number, item) => {
  currentAddress.value = index
  Object.assign(addressInfo, item)
  addressId.value = item.id
  await computedPrice()
}

// 跳入页面
const handleGoPage = (id: number) => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: id })
}
</script>

<template>
  <div>
    <div v-if="userStore.isLogin" class="wrapper_1200" v-loading="loading">
      <page-header title="提交订单"></page-header>
      <!--收货地址-->
      <div v-if="!isProductType" class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px mbtom20">
        <div class="fontColor333 text-16px mb20px">收货地址</div>
        <div class="acea-row justify-between address-list" :class="showAddress ? 'on' : ''">
          <div
            v-if="addressList?.length < 10"
            @click="handleAddAddress"
            class="cursors w-560px h-90px lh-90px fontColor333 text-14px b-rd-8px address-item text-center"
          >
            <span class="fontColor6 text-14px">+</span> 添加收货地址
          </div>
          <div
            @click="handleChangeAddress(index, item)"
            v-for="(item, index) in addressList"
            :key="item.id"
            :class="addressId === item.id ? ' address-check' : 'address-item'"
            class="w-560px mb-20px b-rd-8px py-20px px-20px cursors"
          >
            <div class="fontColor333 text-14px mb10px font-500 oppoSans-M">
              {{ item.realName }} {{ item.phone }}
              <span
                v-show="item.isDefault"
                class="text-12px bg-color text-#fff b-rd-2px px-4px py-1px mr-6px oppoSans-R font-400"
                >默认</span
              >
            </div>
            <div class="fontColor6 text-14px line1 oppoSans-R font-400">
              {{ item.province }}{{ item.city }}{{ item.district }}{{ item.street }}{{ item.detail }}
            </div>
          </div>
        </div>
        <div
          v-if="!showAddress"
          class="cursors fontColor6 text-14px text-center p-t-10px"
          @click="showAddress = !showAddress"
        >
          收起 <span class="iconfont icon-gao"></span>
        </div>
        <div
          v-if="showAddress"
          class="fontColor6 text-14px text-center cursors p-t-10px"
          @click="showAddress = !showAddress"
        >
          查看全部地址 <span class="iconfont icon-di"></span>
        </div>
      </div>
      <!-- 商品信息-->
      <div
        v-for="(item, index) in merchantOrderVoList"
        :key="item.id"
        class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px mbtom20"
      >
        <div @click="handleGoPage(item.merId)" class="acea-row mb-30px cursors items-center">
          <div v-if="item.isSelf">
            <span
              class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
              style="top: -1px"
              >自营</span
            >
          </div>
          <div class="fontColor333 text-14px">{{ item.merName }}</div>
        </div>
        <div v-for="(itm, indexs) in item.orderInfoList" :key="indexs">
          <confirm-product :list="itm" :productType="orderInfoVo.type" :merchantInfo="item"></confirm-product>
        </div>
        <el-divider border-style="dashed" />
        <div v-show="item.svipDiscountPrice > 0" class="acea-row justify-between mbtom30">
          <div class="text-16px fontColor6">会员优惠</div>
          <div class="fonts16 fontColor333">￥{{ item.svipDiscountPrice }}</div>
        </div>
        <div v-if="orderType === 0" class="acea-row justify-between mbtom30">
          <div class="text-16px fontColor6">店铺优惠</div>
          <div @click="couponTap(item.merCouponUserList, item.merId, index, item)" class="fonts16 fontColor333 cursors">
            {{
              item.merCouponUserList?.length === 0
                ? '暂无优惠券'
                : item.couponFee == 0
                ? `有${item.merCouponUserList?.length}张优惠券可选`
                : `-￥${item.couponFee}`
            }}<span
              v-show="Number(item.merCouponUserList?.length > 0)"
              class="iconfont icon-xiala"
              style="font-size: 12px"
            ></span>
          </div>
        </div>
        <div v-show="!isProductType" class="acea-row justify-between mbtom30">
          <div class="text-16px fontColor6">快递费用</div>
          <div class="fonts16 fontColor333">{{ item.freightFee == 0 ? '免运费' : '￥' + item.freightFee }}</div>
        </div>
        <div class="acea-row justify-between">
          <div class="text-16px fontColor6 mr30px">买家留言</div>
          <textarea
            class="textarea w-1041px"
            @blur="handleMessage(item.remark, index)"
            v-model="item.remark"
            maxlength="150"
            rows="5"
            placeholder="建议提前与商家协商"
          ></textarea>
        </div>
        <!--      <div class="flex justify-end text-14px fontColor333" style="align-items: baseline">-->
        <!--        店铺合计（含运费）：<span class="text-14px font-color fw-600">￥</span-->
        <!--        ><span class="text-22px font-color fw-600">{{ item.proTotalFee }}</span>-->
        <!--      </div>-->
      </div>
      <!-- 系统表单信息 -->
      <div v-if="orderInfoVo.systemFormValue" class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px mb-20px">
        <SystemFrom ref="systemFromRef" :order-form="systemFormValue"></SystemFrom>
      </div>
      <!--结算信息-->
      <div class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px">
        <!-- <div v-if="orderType === 0" class="acea-row justify-between mbtom30">
          <div class="text-16px fontColor6">平台优惠</div>
          <div @click="couponTap(orderInfoVo.platCouponUserList, 0, 0, null)" class="fonts16 fontColor333 cursors">
            {{
              orderInfoVo.platCouponUserList?.length === 0
                ? '暂无优惠券'
                : platCouponFee == 0
                ? `有${orderInfoVo.platCouponUserList?.length}张优惠券可选`
                : `-￥${platCouponFee}`
            }}<span
              v-show="Number(orderInfoVo.platCouponUserList?.length > 0)"
              class="iconfont icon-xiala"
              style="font-size: 12px"
            ></span>
          </div>
        </div> -->
        <!-- <div
          v-if="orderInfoVo.integralDeductionSwitch && orderType === 0"
          class="acea-row justify-between mbtom30"
        >
          <div class="text-16px fontColor6">积分抵扣</div>
          <div class="fonts16 fontColor333 isUseIntegral">
            <el-radio-group v-model="isUseIntegral" @change="handleIntegral">
              <el-radio :label="false" class="fonts16" size="large">不使用</el-radio>
              <el-radio :label="true" size="large">
                <div>
                  {{ isUseIntegral ? '使用积分' : '当前积分' }}
                  <span class="num font_color">{{
                    isUseIntegral ? orderInfoVo.surplusIntegral : orderInfoVo.userIntegral
                  }}</span>
                  <span v-if="orderInfoVo.deductionPrice != 0"> 可抵￥{{ orderInfoVo.deductionPrice }}</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div> -->
        <!--费用详情-->
        <div class="w-1140px borRadius bg-#F7F7F7 px-20px py-20px">
          <div class="acea-row justify-between mb15px">
            <div class="text-14px fontColor6">运费</div>
            <div class="text-14px fontColor333">
              {{ orderInfoVo.freightFee == '0' ? '免运费' : '￥' + orderInfoVo.freightFee }}
            </div>
          </div>
          <div v-show="orderInfoVo.svipDiscountPrice > 0" class="acea-row justify-between mb15px">
            <div class="text-14px fontColor6">会员优惠</div>
            <div class="text-14px fontColor333">
              -￥<span class="">{{ orderInfoVo.svipDiscountPrice }}</span>
            </div>
          </div>
          <!-- <div v-show="orderType === 0" class="acea-row justify-between mb15px">
            <div class="text-14px fontColor6">商家优惠</div>
            <div class="text-14px fontColor333">
              -￥<span class="">{{ orderInfoVo.merCouponFee }}</span>
            </div>
          </div>
          <div v-show="orderType === 0" class="acea-row justify-between mb15px">
            <div class="text-14px fontColor6">平台优惠</div>
            <div class="text-14px fontColor333">
              -￥<span class="">{{ orderInfoVo.platCouponFee }}</span>
            </div>
          </div>
          <div
            v-show="orderInfoVo.integralDeductionSwitch && orderType === 0"
            class="acea-row justify-between mb15px"
          >
            <div class="text-14px fontColor6">积分抵扣</div>
            <div class="text-14px fontColor333">
              -￥<span class="">{{ orderInfoVo.deductionPrice || 0 }}</span>
            </div>
          </div> -->
          <div class="acea-row justify-between">
            <div class="text-14px fontColor6">实付款</div>
            <div class="text-14px font-color fw-600">
              <span class="oppoSans-M">￥</span
              ><span class="text-22px"
                ><span class="dinProRegular">{{ orderInfoVo.payFee }}</span></span
              >
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-30px">
          <div class="w-120px handleBtn h-44px lh-44px cursors" @click="handleCreatOrder" style="font-size: 16px">
            立即下单
          </div>
        </div>
      </div>
      <!--优惠券-->
      <el-dialog
        modal-class="createDialog"
        v-model="dialogVisible"
        :align-center="true"
        :width="780"
        :append-to-body="true"
        :show-close="false"
        center
        title="选择优惠券"
      >
        <div class="acea-row justify-between" v-loading="loadingCoupon">
          <div
            @click="getCouponUser(index, item)"
            v-for="item in coupon.list"
            :key="item.id"
            class="coupon-list flex-y-center check nocheck w-350px h-110px"
          >
            <div class="pos-relative w-100px h-110px coupon-item items-center">
              <div class="text-12px font-color pos-absolute top-2px left-10px">
                {{ couponTypeFilter(item.category) }}
              </div>
              <div class="font-color text-14px">
                <span class="oppoSans-M">￥</span><span class="text-30px dinProRegular">{{ item.money }}</span>
              </div>
              <div class="font-color text-12px">满{{ item.minPrice }}元可用</div>
            </div>
            <div class="ml-15px h-110px pos-relative coupon-item w-250px">
              <div class="pos-absolute top-10px right-10px">
                <div
                  v-if="!item.isChecked && item.isChoose"
                  class="iconfont icon-weixuanzhong cursors"
                  style="font-size: 18px"
                ></div>
                <div
                  v-if="item.isChecked && item.isChoose"
                  class="cursors iconfont icon-xuanzhong font-color"
                  style="font-size: 18px"
                ></div>
                <div
                  v-if="!item.isChoose && !item.isChecked"
                  class="noCheck w-15px h-15px b-rd-50% borderSol bg-#F5F5F5"
                ></div>
              </div>
              <div class="text-14px fontColor333 fw-500 mb-15px line2 h-36px lh-19px w-196px">{{ item.name }}</div>
              <div class="text-14px text-#999">{{ getCouponTime(item.startTime, item.endTime) }}</div>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
      <!--地址弹窗-->
      <add-address
        ref="userAddAddressRef"
        :addressInfo="addressInfo"
        :isShowDialog="dialogVisibleAddress"
        @handleSubmitAddress="handleSubmitAddress"
        v-if="dialogVisibleAddress"
        @handleSubmitClose="handleSubmitClose"
        :selAddressData="selAddressData"
      ></add-address>
    </div>
    <div v-else class="wrapper_1200">
      <not-logged-in></not-logged-in>
    </div>
  </div>
</template>
<style lang="scss">
.createDialog {
  .el-button {
    width: 120px !important;
    height: 44px !important;
    border-radius: 25px 25px 25px 25px;
  }
  .el-dialog {
    background-color: #f5f5f5 !important;
  }
  :deep(.el-dialog) {
    background-color: #f5f5f5 !important;
    --el-dialog-bg-color: #f5f5f5 !important;
    --el-bg-color: #f5f5f5 !important;
    border-radius: 16px 16px 16px 16px;
  }
  .el-dialog__body {
    max-height: 70vh !important;
    overflow-y: auto;
    padding: 0 30px 0 30px;
  }
}
</style>
<style lang="scss" scoped>
:deep(.el-radio__label) {
  font-size: 16px !important;
}
.fonts16 {
  font-size: 16px !important;
}
:deep(.el-dialog) {
  background-color: #f5f5f5 !important;
  --el-dialog-bg-color: #f5f5f5 !important;
  --el-bg-color: #f5f5f5 !important;
  border-radius: 16px 16px 16px 16px;
}

.coupon {
  &-list {
    background-image: url('@/assets/images/coupon.png');
    margin-bottom: 20px;
  }
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.address {
  &-list {
    &.on {
      height: 106px;
      overflow: hidden;
    }
  }
  &-check {
    border: 1px solid #e93323;
  }
  &-item {
    border: 1px solid #cccccc;
  }
}
.btn {
  height: 50px;
  line-height: 50px;
  border-radius: 33px 33px 33px 33px;
}
</style>
