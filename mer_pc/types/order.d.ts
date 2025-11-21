import { payPaymentApi } from '~/server/orderApi'

/**
 * 计算订单价格
 */
export interface ComputedPrice {
  isUseIntegral: boolean
  preOrderNo: string
  addressId: number
  platUserCouponId: number
  orderMerchantRequestList: Array
}

/**
 * 预下单详情
 */
//商户优惠券列表
export interface MerchantInfoList$3 {
  id: number
  couponId: number
  merId: number
  uid: number
  name: string
  publisher: number
  category: number
  receiveType: number
  couponType: number
  money: number
  discount: number
  minPrice: number
  startTime: string
  endTime: string
  useTime: null
  status: number
  createTime: string
  updateTime: string
  isChoose: boolean
  isChecked: boolean
}
//平台优惠券列表
export interface PlatCouponUserList$2 {}
// 订单详情
export interface OrderInfoVo {
  proTotalFee: string
  orderProNum: number
  freightFee: string
  couponFee: string
  merCouponFee: string
  platCouponFee: string
  payFee: string
  platUserCouponId: number
  addressId: number
  userIntegral: number
  userBalance: string
  merchantInfoList: Array<MerchantInfoList$3>
  cartIdList: null
  integralDeductionSwitch: boolean
  isUseIntegral: boolean
  type: number
  platCouponUserList: Array<MerchantInfoList$3>
  deductionPrice?: string
  surplusIntegral?: number
  systemFormValue?: string
}

/**
 * 地址列表
 */
export interface AddressInfo {
  id: number
  realName: string
  phone: string
  province: string
  provinceId: number
  city: string
  cityId: number
  district: string
  districtId: number
  street: string
  detail: string
  postCode: number
  isDefault: boolean
  isDel: null
}

/**
 * 订单支付
 */
export interface PayPayment {
  orderNo: string
  payChannel: string
  payType: string
}

/**
 * 评价订单商品详情
 */
export interface ProductInfo {
  id: number
  orderNo: string
  merId: number
  productId: number
  productName: string
  image: string
  sku: string
  price: string
  payNum: number
  merName: string
  productType: number
}

/**
 * 评价订单商品表单提交
 */
export interface ReplyProductFrom {
  comment: string
  orderDetailId: number
  orderNo: string
  pics: Array<unknow>
  star: number
}

/**
 * 申请退款表单
 */
export interface RefundApplyFrom {
  afterSalesType: number
  num: number
  orderDetailId: number
  orderNo: string
  returnGoodsType: number
  text: string
  explain: string
  reasonImage: string
}

/**
 * 再次购买加入购物车数据
 */
export interface CartBatchAdd {
  productId: number
  productAttrUnique: string
  cartNum: number
}

/**
 * 订单退款申请
 */
export interface RefundApply {
  afterSalesType: number
  num: number
  orderDetailId: number
  orderNo: string
  returnGoodsType: number
  text: string
  explain: string
  reasonImage: string
}

/**
 * 详情页头部传值
 */
export interface NavigateToTitle {
  title: string
  linkUrl: string
  params: object
}
