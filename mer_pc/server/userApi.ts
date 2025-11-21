// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { ItemObject, PageQuery, UploadImageData } from '~/types/global'
import { AddressInfo, BindingPhone, LoginCaptcha, LoginFrom, RegisterReset, UseInfoFrom } from '~/types/user'
import { PayPayment } from '~/types/order'

/**
 * h5用户登录
 * @param params object 用户账号密码
 */
export const loginPassword = (params: LoginFrom) => {
  return $request.post({ url: 'front/login/mobile/password', params })
}

/**
 * h5用户手机号 验证码登录
 * @param data object
 */
export const loginMobile = (params: LoginFrom) => {
  return $request.post({ url: 'front/login/mobile/captcha', params })
}

/**
 * 退出
 * @param data object
 */
export const loginLogout = () => {
  return $request.get({ url: 'front/login/logout' })
}

/**
 * 验证码key
 */
export const getCodeApi = () => {
  return $request.get({ url: 'front/verify_code' })
}

/**
 * h5用户发送验证码
 * @phone string
 */
export const registerVerify = (params: ItemObject) => {
  return $request.post({ url: 'front/login/send/code', params })
}

/**
 * 获取收藏列表
 * @param params
 */
export const getCollectProApi = (params: PageQuery) => {
  return $request.get({ url: 'front/collect/product/list', params })
}

/**
 * 取消收藏
 * @param params
 */
export const getCollectCancelProApi = (params) => {
  return $request.post({ url: 'front/collect/cancel/product', params })
}

/**
 * 获取城市区域分级列表
 * @param params
 */
export const getCityListApi = (params) => {
  return $request.get({ url: 'front/city/list', params })
}

/**
 * 用户地址添加
 * @param params
 */
export const addressAddApi = (params) => {
  return $request.post({ url: 'front/address/add', params })
}

/**
 * 商户收藏列表
 * @param  params
 */
export const collectMerchantApi = (params: PageQuery) => {
  return $request.get({ url: 'front/collect/merchant/list', params })
}

/**
 * 取消收藏店铺
 * @id number
 */
export const collectCancelMerchantApi = (id: number) => {
  return $request.post({ url: `front/collect/cancel/merchant/${id}` })
}

/**
 * 足迹记录
 */
export const browseRecordApi = () => {
  return $request.get({ url: `front/user/center/browse/record` })
}

/**
 * 上传图片
 */
export const uploadImageApi = (model: string, pid: string, params: any) => {
  return $request.post<UploadImageData>({ url: `front/upload/image?model=${model}&pid=${pid}`, params })
}

/**
 * 余额记录
 */
export const balanceRecordApi = (params: PageQuery) => {
  return $request.get({ url: `front/user/center/balance/record`, params })
}

/**
 * 我的账户
 */
export const myAccountApi = () => {
  return $request.get({ url: `front/user/center/my/account` })
}

/**
 * 积分记录
 */
export const integralListApi = (params: PageQuery) => {
  return $request.get({ url: `front/user/center/integral/list`, params })
}

/**
 * 我的积分
 */
export const myIntegralApi = () => {
  return $request.get({ url: `front/user/center/my/integral` })
}

/**
 * 我的优惠券
 */
export const couponUserListApi = (params: PageQuery) => {
  return $request.get({ url: `front/coupon/user/list`, params })
}

/**
 * 滑块验证
 * @param {Object} params
 */
export const knowUserSmsCaptchaApi = (params: any) => {
  return $request.post({ url: `front/safety/check`, params })
}

/**
 * 滑块信息
 * @param {Object} params
 */
export const knowUserCaptchaApi = (params: any) => {
  return $request.post({ url: `front/safety/get`, params })
}

/**
 * 协议详情
 */
export const agreementInfoApi = (info: string) => {
  return $request.get({ url: `front/agreement/${info}` })
}

/**
 * 地址列表
 */
export const addressListApi = () => {
  return $request.get({ url: `front/address/list` })
}

/**
 * 设置默认地址
 */
export const setAddressDefaultApi = (id: number) => {
  return $request.post({ url: `front/address/set/default/${id}` })
}

/**
 * 编辑地址
 */
export const addressEditApi = (params: AddressInfo) => {
  return $request.post({ url: `front/address/edit`, params })
}

/**
 * 用户地址删除
 */
export const addressDelApi = (id: number) => {
  return $request.post({ url: `front/address/delete/${id}` })
}

/**
 * 用户地址详情
 */
export const addressDetailApi = (id: number) => {
  return $request.get({ url: `front/address/detail/${id}` })
}

/**
 * 用户信息
 */
export const userInfoApi = () => {
  return $request.get({ url: `front/user/info` })
}

/**
 * 编辑用户信息
 */
export const userEditApi = (params: UseInfoFrom) => {
  return $request.post({ url: `front/user/user/edit`, params })
}

/**
 * 获取用户手机号验证码
 */
export const userPhoneCodeApi = () => {
  return $request.post({ url: `front/user/phone/code` })
}

/**
 * 换绑手机号获取验证码
 */
export const bindingPhoneCodeApi = (params: BindingPhone) => {
  return $request.post({ url: `front/user/update/binding/phone/code`, params })
}

/**
 * 换绑手机号
 */
export const updateBindingApi = (params: BindingPhone) => {
  return $request.post({ url: `front/user/update/binding`, params })
}

/**
 * 手机号修改密码获取验证码
 */
export const updatePasswordCodeApi = () => {
  return $request.post({ url: `front/user/update/password/phone/code` })
}

/**
 * 手机号修改密码
 */
export const registerResetApi = (params: RegisterReset) => {
  return $request.post({ url: `front/user/register/reset`, params })
}

/**
 * 订单商品评论列表
 *
 */
export const orderReplyListApi = (params) => {
  return $request.get({ url: `front/order/reply/list`, params })
}

/**
 * 校验token是否有效
 *
 */
export const tokenIsExistApi = () => {
  return $request.post({ url: `front/login/token/is/exist` })
}

/**
 * 全局配置信息
 */
export const globalConfigApi = () => {
  return $request.get({ url: `front/index/global/config/info` })
}

/**
 * 获取PC商城登录配置
 */
export const pcConfigApi = () => {
  return $request.get({ url: `front/login/pc/config` })
}

/**
 * 获取PC商城微信公众号用户同意登录信息
 */
export const pcWechatAgreeInfoApi = (ticket: string) => {
  return $request.get({ url: `front/login/pc/wechat/public/agree/info?ticket=${ticket}` })
}

/**
 * 微信PC授权登录（网页应用）
 */
export const wechatPcApi = (params: any) => {
  return $request.post({ url: `front/login/wechat/pc`, params })
}

/**
 * 微微信注册绑定手机号
 */
export const registeBindingPhoneApi = (params: any) => {
  return $request.post({ url: `front/login/wechat/register/binding/phone`, params })
}
