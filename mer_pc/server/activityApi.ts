import { PageQuery } from '~/types/global'
import { SeckillListQuery } from '~/types/activity'

/**
 * 优惠券领券中心
 *
 */
export const couponCollectionApi = (params: PageQuery) => {
  return $request.get({ url: `front/coupon/voucher/collection/center`, params })
}

/**
 * 系统优惠券商品列表
 *
 */
export const systemCouponListApi = (params: PageQuery) => {
  return $request.get({ url: `front/product/system/coupon/pro/list`, params })
}

/**
 * 我的优惠券商品列表
 *
 */
export const proCouponListApi = (params: PageQuery) => {
  return $request.get({ url: `front/product/coupon/pro/list`, params })
}

/**
 * 文章分类列表
 *
 */
export const articleCategoryApi = async () => {
  const response = await $request.get({ url: `front/article/category/list` })
  const data = await response
  return data
  // return $request.get({ url: `front/article/category/list` })
}

/**
 * 文章分页列表
 *
 */
export const articleListApi = (cid: number, params: PageQuery) => {
  return $request.get({ url: `front/article/list/${cid}`, params })
}

/**
 * 热门列表
 *
 */
export const articleHotListApi = () => {
  return $request.get({ url: `front/article/hot/list` })
}

/**
 * 文章详情
 *
 */
export const articleInfoApi = (id: number) => {
  return $request.get({ url: `front/article/info/${id}` })
}

/**
 * 秒杀商品列表
 *
 */
export const seckillListApi = (params: SeckillListQuery) => {
  return $request.get({ url: `front/seckill/product/list`, params })
}

/**
 * 秒杀时段信息
 *
 */
export const seckillTimeApi = () => {
  return $request.get({ url: `front/seckill/activity/time/info` })
}
