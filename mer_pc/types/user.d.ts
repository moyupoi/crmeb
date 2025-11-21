/**
 * 订单支付
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
}

/**
 * 个人资料表单
 */
export interface UseInfoFrom {
  avatar: string
  birthday: string
  city: string
  province: string
  nickname: string
  sex: number
}

/**
 * 换绑手机号
 */
export interface BindingPhone {
  captcha: string
  phone: string
}

/**
 * 手机号修改密码
 */
export interface RegisterReset {
  captcha: string
  password: string
}

/**
 * 登录
 */
export interface LoginFrom {
  captcha?: string
  phone: string
  password?: string
  spreadPid: number
}

/**
 * 登录
 */
export interface GlobalDatas {
  changeColorConfig: string
  copyrightCompanyImage: string
  frontDomain: string
  imageDomain: string
  paidMemberPriceDisplay: string
  userIsPaidMember: boolean
  siteName: string
}
