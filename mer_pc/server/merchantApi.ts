// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { FormMerSettledApply, MerchantListQuery, MerchantProductSeach } from '~/types/merchant'
import { PageQuery } from '~/types/global'
/**
 * 首页店铺列表-根据id集合加载
 */
export const getMerListbyidsApi = (ids: string) => {
  return $request.get({ url: `index/merchant/listbyids/${ids}` })
}

/**
 * 首页店铺列表
 * @param
 */
export const indexMerListApi = () => {
  return $request.get({ url: `index/merchant/list` })
}

/**
 * 店铺推荐商品
 * @param
 */
export const merchantRecommendApi = (id: number) => {
  return $request.get({ url: `front/merchant/pc/${id}/recommend/product` })
}

/**
 * 店铺详细信息
 * @param number id
 */
export const getMerDetailApi = (id: number) => {
  return $request.get({ url: `merchant/detail/${id}` })
}

/**
 * 店铺首页信息
 * @param id
 */
export const getMerIndexInfoApi = (id: number) => {
  return $request.get({ url: `front/merchant/pc/index/${id}` })
}

/**
 * 商户搜索列表
 * @param data
 */
export const getMerSearchApi = (params: MerchantListQuery) => {
  return $request.get({ url: `front/merchant/search/list`, params })
}

/**
 * 商户入驻申请
 * @param params
 */
export const getMerSettledApplyApi = (params: FormMerSettledApply) => {
  return $request.post({ url: `front/merchant/settled/apply`, params })
}

/**
 * 商户入入驻记录
 * @param params data
 */
export const getMerSettledRecordApi = (params: PageQuery) => {
  return $request.get({ url: `front/merchant/settled/record`, params })
}

/**
 * 店铺街
 * @param params
 */
export const getMerStreetApi = (params: PageQuery) => {
  return $request.get({ url: `front/merchant/street`, params })
}

/**
 * 商户商品列表
 * @param params
 */
export const getMerProListApi = (params: MerchantProductSeach) => {
  return $request.get({ url: `front/product/merchant/pro/list`, params })
}

/**
 * 商户商品分类列表
 * @param id
 */
export const getMerCategoryApi = (id: number) => {
  return $request.get({ url: `front/merchant/product/category/cache/tree/${id}` })
}

/**
 * 收藏店铺
 * @param id number
 */
export const getMerCollectAddApi = (id: number) => {
  return $request.post({ url: `front/collect/add/merchant/${id}` })
}

/**
 * 取消收藏店铺
 * @param id
 */
export const getMerCollectCancelApi = (id: number) => {
  return $request.post({ url: `front/collect/cancel/merchant/${id}` })
}

/**
 * 商户收藏列表
 * @param Obj data
 */
export const getMerCollectListApi = (data: any) => {
  return $request.get({ url: `front/collect/merchant/list`, data })
}

/**
 * 获取全部商户分类列表
 */
export const getMerCategoryListApi = () => {
  return $request.get({ url: `front/merchant/all/category/list` })
}

/**
 * 获取全部商户类型列表
 */
export const getMerTypeListApi = () => {
  return $request.get({ url: `front/merchant/all/type/list` })
}

/**
 * 获取入驻协议
 */
export const settledAgreementApi = () => {
  return $request.get({ url: `merchant/settled/agreement` })
}

/**
 * 获取商户自提信息
 */
export const takeTheirApi = (id: number) => {
  return $request.get({ url: `merchant/get/take/their/${id}` })
}

/**
 * 发送入驻申请短信验证码
 */
export const sendSettledCodeApi = (params: { phone: string }) => {
  return $request.post({ url: `front/merchant/send/settled/code`, params })
}

/**
 * 商户客服信息
 */
export const merCustomerApi = (id: number) => {
  return $request.get({ url: `front/merchant/customer/service/info/${id}` })
}

/**
 * 首页店铺列表
 */
export const getDiyMerListApi = (num: number) => {
  return $request.get({ url: `index/merchant/list/${num}` })
}

/**
 * 领券
 */
export const couponReceiveApi = (id: number) => {
  return $request.post({ url: `front/coupon/receive/${id}` })
}

/**
 * 获取商户地址信息
 */
export const merchantAddressApi = (id: number) => {
  return $request.get({ url: `front/merchant/get/address/${id}` })
}
