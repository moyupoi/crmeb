import { CartBatchAdd, ComputedPrice, PayPayment, RefundApply, ReplyProductFrom } from '~/types/order'
import { ItemObject, PageQuery } from '~/types/global'

/**
 * 购物车列表
 *
 */
export const cartListApi = (isValid: string) => {
  return $request.get({ url: `front/cart/list?isValid=${isValid}` })
}

/**
 * 删除购物车数量
 *
 */
export const cartDeleteApi = (params: { ids: number[] }) => {
  return $request.post({ url: `front/cart/delete`, params })
}

/**
 * 购物车移入收藏
 *
 */
export const cartToCollectApi = (params: { ids: number[] }) => {
  return $request.post({ url: `front/cart/to/collect`, params })
}

/**
 * 修改购物车商品数量
 *
 */
export const cartNumApi = (params: { id: number; number: number }) => {
  return $request.post({ url: `front/cart/num`, params })
}

/**
 * 预下单
 *
 */
export const preOrderApi = (params) => {
  return $request.post({ url: `front/order/pre/order`, params })
}

/**
 * 加载预下单
 *
 */
export const orderLoadPreApi = (preOrderNo: string) => {
  return $request.get({ url: `front/order/load/pre/${preOrderNo}` })
}

/**
 * 订单详情
 *
 */
export const orderDetailApi = (orderNo: string) => {
  return $request.get({ url: `front/order/detail/${orderNo}` })
}

/**
 * 计算价格
 *
 */
export const computedPriceApi = (params: ComputedPrice) => {
  return $request.post({ url: `front/order/computed/price`, params })
}

/**
 * 地址详情
 *
 */
export const addressDetailApi = (id: number) => {
  return $request.get({ url: `front/address/detail/${id}` })
}

/**
 * 地址列表
 *
 */
export const addressListApi = () => {
  return $request.get({ url: `front/address/list` })
}

/**
 * 创建订单
 *
 */
export const orderCreateApi = (params: ComputedPrice) => {
  return $request.post({ url: `front/order/create`, params })
}

/**
 * 获取支付配置
 *
 */
export const payConfigApi = () => {
  return $request.get({ url: `front/pay/get/config` })
}

/**
 * 订单支付
 *
 */
export const payPaymentApi = (params: PayPayment) => {
  return $request.post({ url: `front/pay/payment`, params })
}

/**
 * 订单支付
 *
 */
export const orderReplyApi = (params: ReplyProductFrom) => {
  return $request.post({ url: `front/order/reply/product`, params })
}

/**
 * 订单列表
 *
 */
export const orderListApi = (params) => {
  return $request.get({ url: `front/order/list`, params })
}

/**
 * 订单收货
 *
 */
export const orderTakeDeliveryApi = (orderNo: string) => {
  return $request.post({ url: `front/order/take/delivery/${orderNo}` })
}

/**
 * 订单取消
 *
 */
export const orderCancelApi = (orderNo: string) => {
  return $request.post({ url: `front/order/cancel/${orderNo}` })
}

/**
 * 删除订单
 *
 */
export const orderDeleteApi = (orderNo: string) => {
  return $request.post({ url: `front/order/delete/${orderNo}` })
}

/**
 * 批量添加购物车
 *
 */
export const cartBatchAddApi = (params: Array<CartBatchAdd>) => {
  return $request.post({ url: `front/cart/batch/add`, params })
}

/**
 * 获取订单发货单列表
 *
 */
export const invoiceListApi = (orderNo: string) => {
  return $request.get({ url: `front/order/${orderNo}/invoice/list` })
}

/**
 * 物流信息查询
 *
 */
export const orderLogisticsApi = (invoiceId: number) => {
  return $request.get({ url: `front/order/logistics/${invoiceId}` })
}

/**
 * 获取收银台信息
 *
 */
export const payGetCashierApi = (orderNo: string) => {
  return $request.get({ url: `front/pay/get/cashier/${orderNo}` })
}

/**
 * 查询订单支付宝支付结果
 *
 */
export const aliPayResultApi = (orderNo: string) => {
  return $request.get({ url: `front/pay/query/ali/pay/result/${orderNo}` })
}

/**
 * 查询订单微信支付结果
 *
 */
export const wechatPayResultApi = (orderNo: string) => {
  return $request.get({ url: `front/pay/query/wechat/pay/result/${orderNo}` })
}

/**
 * 售后申请列表(可申请售后列表)
 *
 */
export const refundApplyListApi = (params: PageQuery) => {
  return $request.get({ url: `front/refund/after/sale/apply/list`, params })
}

/**
 * 订单退款申请
 *
 */
export const refundApplyApi = (params: RefundApply) => {
  return $request.post({ url: `front/refund/apply`, params })
}

/**
 * 退款订单详情
 *
 */
export const refundDetailApi = (refundOrderNo: string) => {
  return $request.get({ url: `front/refund/detail/${refundOrderNo}` })
}

/**
 * 退款订单列表
 *
 */
export const refundListApi = (params: PageQuery) => {
  return $request.get({ url: `front/refund/list`, params })
}

/**
 * 订单退款理由（平台提供）
 *
 */
export const refundReasonApi = () => {
  return $request.get({ url: `front/refund/reason` })
}

/**
 * 退款单退回商品
 *
 */
export const refundReturningGoodsApi = (params: ItemObject) => {
  return $request.post({ url: `front/refund/returning/goods`, params })
}

/**
 * 撤销退款单
 *
 */
export const refundRevokeApi = (refundOrderNo: string) => {
  return $request.post({ url: `front/refund/revoke/${refundOrderNo}` })
}

/**
 * 物流公司
 *
 */
export const expressAllApi = () => {
  return $request.get({ url: `front/express/all` })
}

/**
 * 获取城市区域tree结构的列表
 *
 */
export const cityListTreeApi = () => {
  return $request.get({ url: `front/city/list/tree` })
}
