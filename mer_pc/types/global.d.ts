/**
 * 对象中全是字符串的类型
 */
export interface ItemObject {
  [key: string]: string
}

/**
 * 对象中全是数字的类型
 */
export interface ItemObjectNumber {
  [key: number]: number
}

/**
 * 分页结果数据
 */
export interface PageResult<T> {
  /**
   * 数据列表
   */
  list: T
  /**
   * 数据总数
   */
  total: number
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  page?: number
  limit?: number
  type?: string | number | null
  cid?: string
  id?: string | number
  merId?: string | number
  category?: string | number
  keywords?: string | null
  keyword?: string | undefined
  couponId?: string | number
  userCouponId?: string | number
  productId?: string | number | null | undefined
  status?: string | number | null
}

/**
 * 公共的获取对象
 */
export interface FromData {
  id: number
  name?: string
  type?: string
  isShow?: boolean
  content?: string
}

/**
 * 图片上传获取数据
 */
export interface UploadImageData {
  extName: string
  fileName: string
  fileSize: number
  type: string
  url: string
}

/**
 * 滑块验证成功后的返回值
 */
export interface CaptchaVerification {
  captchaVerification: string
}
