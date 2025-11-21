import { MerchantInfoList$3, OrderInfoVo } from '~/types/order'

export const defaultOrderInfo = () => {
  return {
    proTotalFee: '',
    orderProNum: 0,
    freightFee: '',
    couponFee: '',
    merCouponFee: '',
    platCouponFee: '',
    payFee: '',
    platUserCouponId: 0,
    addressId: 0,
    userIntegral: 0,
    userBalance: '',
    merchantInfoList: [],
    cartIdList: null,
    integralDeductionSwitch: false,
    isUseIntegral: false,
    type: 0,
    platCouponUserList: [],
    deductionPrice: '',
    surplusIntegral: 0,
    systemFormValue: '',
  }
}

//地址信息
export const defaultAddressInfo = () => {
  return {
    id: 0,
    realName: '',
    phone: '',
    province: '',
    provinceId: 0,
    city: '',
    cityId: 0,
    district: '',
    districtId: 0,
    street: '',
    detail: '',
    postCode: 0,
    isDefault: false,
    isDel: null,
  }
}

// 评价订单商品
export const defaultReplyProduct = () => {
  return {
    comment: '',
    orderDetailId: 0,
    orderNo: '',
    pics: [],
    star: 0,
  }
}

// 订单退款申请
export const defaultRefundApply = () => {
  return {
    afterSalesType: 1,
    num: 0,
    orderDetailId: 0,
    orderNo: '',
    returnGoodsType: 0,
    text: '',
    explain: '',
    reasonImage: '',
  }
}
