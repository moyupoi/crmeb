import { CartAdd, CartCount, CollectPro, CouponListQuery, ProductIds, ReplyConfig, ReplyList } from '~/types/goods'
import { ItemObject, PageQuery } from '~/types/global'

/**
 * 购物车列表
 *
 */
export const productDetailApi = (params: any) => {
  return $request.get({ url: `front/product/detail`, params })
}

/**
 * 商品评论数量
 *
 */
export const productReplyConfigApi = (id: number) => {
  return $request.get<ReplyConfig>({ url: `front/product/reply/config/${id}` })
}

/**
 * 商品分类缓存树
 *
 */
export const categoryTreeApi = () => {
  return $request.get({ url: `front/product/category/get/tree` })
}

/**
 * 热门搜索
 *
 */
export const searcKeywordApi = () => {
  return $request.get({ url: `front/index/search/keyword` })
}

/**
 * 首页商品列表
 *
 */
export const indexProductListApi = (params: PageQuery) => {
  return $request.get({ url: `front/index/product/list`, params })
}

/**
 * 获取购物车数量
 *
 */
export const cartCountApi = (params: CartCount) => {
  return $request.get({ url: `front/cart/count`, params })
}

/**
 * 添加购物车
 *
 */
export const cartAddApi = (params: CartAdd) => {
  return $request.post({ url: `front/cart/add`, params })
}

/**
 * 商品评论列表
 *
 */
export const replyListApi = (id: number, params: PageQuery) => {
  return $request.get<ReplyList>({ url: `front/product/reply/list/${id}`, params })
}

/**
 * 添加收藏产品
 *
 */
export const collectAddApi = (params: CollectPro) => {
  return $request.post({ url: `front/collect/add/product`, params })
}

/**
 * 取消收藏产品
 *
 */
export const collectCancelApi = (params: ProductIds) => {
  return $request.post({ url: `front/collect/cancel/product`, params })
}

/**
 * 优惠券分页列表
 *
 */
export const couponListApi = (params: CouponListQuery) => {
  return $request.get({ url: `front/coupon/page/list`, params })
}

/**
 * 商品列表
 *
 */
export const productListApi = (params: PageQuery) => {
  return $request.get({ url: `front/product/list`, params })
}

/**
 * 推荐商品分页列表
 *
 */
export const productRecommendListApi = (params: PageQuery) => {
  return $request.get({ url: `front/product/recommend/list`, params })
}

/**
 * 商品分页列表前置信息
 *
 */
export const productListBeforeApi = (params: ItemObject) => {
  return $request.get({ url: `front/product/list/before`, params })
}
