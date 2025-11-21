import {PageQuery} from "~/types/global";

/**
 * 商户入驻表单提交
 */
export interface FormMerSettledApply {
  captcha: string
  categoryId: any
  handlingFee: number
  keywords: string
  name: string
  phone: string
  qualificationPicture: string
  realName: string
  typeId: any
}

/**
 * 商户商品搜索条件
 */
export interface MerchantProductSeach {
  keyword: string
  priceOrder: string
  salesOrder: string
  page: number
  limit: number
  cid: number | null
  merId: number | null
  minPrice: number | null
  maxPrice: number | null
}

/**
 * 商品分页列表
 */
export interface MerchantListQuery extends PageQuery {
  categoryIds: string | null
  typeIds: string | null
}


/**
 * 商户入驻申请对象
 */
export interface ApplicationDataQuery {
  id: number;
  name: string;
  categoryId: number;
  typeId: number;
  realName: string;
  phone: string;
  keywords: string;
  auditStatus: number;
  denialReason: string;
  qualificationPicture: string;
  createTime: string;
}