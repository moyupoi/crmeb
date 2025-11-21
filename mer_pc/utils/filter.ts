// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/**
 * 过滤函数
 */

// 公共过滤器
import { ItemObject } from '~/types/global'

export function filterEmpty(val) {
  let _result = '-'
  if (!val) {
    return _result
  }
  _result = val
  return _result
}

/**
 * 商铺类型
 */
export function merchantTypeFilter(status) {
  if (!status) {
    return ''
  }
  let arrayList = store.getters.merchantType
  let array = arrayList.filter((item) => status === item.id)
  if (array.length) {
    return array[0].name
  } else {
    return ''
  }
}

/**
 * 商户创建类型
 */
export function merCreateTypeFilter(status) {
  const statusMap = {
    admin: '管理员创建',
    apply: '商户入驻申请',
  }
  return statusMap[status]
}

/**
 * 商户类别
 */
export function selfTypeFilter(status) {
  const statusMap = {
    true: '自营',
    false: '非自营',
  }
  return statusMap[status]
}

/**
 * 日期去掉时间
 */
export function dateFormat(value: string) {
  if (!value) {
    return ''
  }
  return value.split(' ')[0]
}

/**
 * 退款状态
 */
export function refundStatusFilter(status) {
  const statusMap = {
    0: '待审核',
    1: '审核未通过',
    2: '退款中',
    3: '退款成功',
  }
  return statusMap[status]
}

/**
 * 订单状态
 */
export function orderStatusFilter(status: string) {
  const statusMap: ItemObject = {
    0: '待付款',
    1: '待发货',
    2: '部分发货',
    3: '待使用',
    4: '待收货',
    5: '已收货',
    6: '已完成',
    9: '已取消',
  }
  return statusMap[status]
}

/**
 * 订单退款状态 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销
 * 订单详情中使用
 */
export function orderRefundFilter(status: string) {
  const statusMap: ItemObject = {
    0: '申请正在审核中',
    1: '商家拒绝了您的申请',
    2: '商家已同意，退款中',
    3: '退款成功',
    4: '商家已同意',
    5: '等待商家收货并退款',
    6: '用户撤销申请',
  }
  return statusMap[status]
}

/**
 * 订单退款状态描述 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销
 */
export function orderRefundTipsStatusFilter(status: string) {
  const statusMap: ItemObject = {
    0: '退款前请与商家协商一致,有助于更好的处理售后问题。',
    1: '若有异议，请联系平台处理。',
    2: '商家已同意您的退款,若您已收到商品请您尽快退回，7天内未发出,系统自动撤销售后单，感谢您对我们的支持!',
    3: '商家已为您退款，若商家已寄出商品请您尽快寄回，感谢您对我们的支持!',
    4: '商家已同意您的退款,若您已收到商品请您尽快退回，7天内未发出,系统自动撤销售后单，感谢您对我们的支持!',
    5: '商家确认收货后进行退款,请您耐心等待，若有异议请联系平台客服处理!',
    6: '此退款单已撤销，若对此订单存在疑问，请联系商家协商处理。',
  }
  return statusMap[status]
}

/**
 * 支付方式
 */
export function payTypeFilter(status: string) {
  const statusMap: ItemObject = {
    weixin: '微信',
    alipay: '支付宝',
    yue: '余额',
  }
  return statusMap[status]
}

/**
 * 秒杀时间段状态
 */
export function timeStatusFilter(status: number) {
  const statusMap: ItemObject = {
    0: '已结束',
    1: '抢购中',
    2: '即将开始',
    3: '明日预告',
  }
  return statusMap[status]
}

/**
 * 订单状态
 */
export function productTypeFilter(status: number) {
  const statusMap: ItemObject = {
    0: 'normal',
    5: 'normal',
    6: 'normal',
    1: 'video',
    2: 'seckill',
  }
  return statusMap[status]
}

/**
 * 订单中商品状态(申请售后列表中点击商品详情使用)
 */
export function orderProductTypeFilter(status: number) {
  const statusMap: ItemObject = {
    0: 'normal',
    1: 'seckill',
    4: 'video',
  }
  return statusMap[status]
}

/**
 * 订单中商品状态名称
 */
export function productTypeNameFilter(status: number) {
  const statusMap: ItemObject = {
    0: '',
    1: '秒杀',
    2: '拼团',
  }
  return statusMap[status]
}

/**
 * 订单商品类型
 */
export function orderTypeFilter(status) {
  const statusMap = {
    1: '视频号',
    2: '秒杀',
  }
  return statusMap[status]
}

/**
 * 订单商品类型
 */
export function orderTypeValFilter(status) {
  const statusMap = {
    0: 'normal',
    1: 'seckill',
    4: 'video',
  }
  return statusMap[status]
}

/**
 * 入驻申请记录审核状态
 */
export function applicationRecordAuditStatus(val: number) {
  let type: ItemObject = {
    1: '待审核',
    2: '审核通过',
    3: '审核拒绝',
  }
  return type[val]
}

/**
 * 入驻申请记录审核状态
 */
export function applicationRecordAuditStatusIcon(val: number) {
  let type: ItemObject = {
    1: 'icon-shenhezhong',
    2: 'icon-yitongguo',
    3: 'icon-weitongguo1',
  }
  return type[val]
}

/**
 * 平台优惠券类型
 */
export function couponTypeFilter(status: number) {
  const statusMap: ItemObject = {
    1: '店铺券',
    2: '商品券',
    3: '通用券',
    4: '品类券',
    5: '品牌券',
    6: '跨店券',
  }
  return statusMap[status]
}

//订单状态流程图
export function activeStatuFilter(status: number) {
  const statusMap: any = {
    0: 1,
    1: 2,
    2: 2,
    4: 3,
    5: 4,
    6: 5,
  }
  return statusMap[status]
}

// 订单退款状态 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销
export function orderRefundStatusFilter(val: number) {
  let type: ItemObject = {
    0: '待审核',
    1: '商家拒绝',
    2: '退款中',
    3: '已退款',
    4: '用户退货',
    5: '商家待收货',
    6: '已撤销',
  }
  return type[val]
}
