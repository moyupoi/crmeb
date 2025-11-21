import { PageQuery } from '~/types/global'

/**
 * 商品详情
 */
export interface ProductsInfo {
  name: string
  id: number
  sliderImage: string
  price: string
  otPrice: string
  sales: number
  stock: number
  ficti: number
  unitName: string
  content: string
}

/**
 * 评论详情
 */
export interface ReplyList {
  avatar: string
  nickname: string
  star: number
  sku: string
  createTime: string
}

/**
 * 评论数量
 */
export interface ReplyConfig {
  sumCount: number
  goodCount: number
  inCount: number
  poorCount: number
  replyChance: string
  replyStar: number
}

/**
 * 购物车数量
 */
export interface CartCount {
  numType: boolean
  type: string
}

/**
 * 添加购物车
 */
export interface CartAdd {
  cartNum: number
  productAttrUnique: number
  productId: number
}

/**
 * 添加收藏产品
 */
export interface CollectPro {
  category: number
  productId: number
}

/**
 * 产品ids
 */
export interface ProductIds {
  ids: string | string[] | undefined
}

/**
 * 优惠券分页列表
 */
export interface CouponListQuery extends PageQuery {
  category: number
  merId?: number
  productId?: number
}

/**
 * 商品分页列表
 */
export interface ProductListQuery extends PageQuery {
  brandId: string
  cid: string
  keyword: string
  maxPrice: string | null
  merId: string
  minPrice: string | null
  priceOrder: string
  salesOrder: string
  tagId: number | null
}
