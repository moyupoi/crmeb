export { isArray, isBoolean, isDate, isObject, isFunction, isString, isNumber, isNull } from 'lodash-es'
import { isObject } from 'lodash-es'
/**
 * @description 是否是http，邮件，电话号码
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description 是否是http
 */
export const isLinkHttp = (link: string): boolean => /^(https?:)?\/\//.test(link)

/**
 * @description 是否是电话号码
 */
export const isLinkTel = (link: string): boolean => /^tel:/.test(link)

/**
 * @description 是否是手机号码
 */
export const isPhone = (link: string): boolean => /^1[3|5|6|7|8|9][0-9]{9}$/.test(link)

/**
 * @description 是否是邮件
 */
export const isLinkMailto = (link: string): boolean => /^mailto:/.test(link)

/**
 * @description 是否为空
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value: unknown) => {
  return value !== null && value !== '' && typeof value !== 'undefined'
}

/**
 * @description 是否为空对象
 * @param {Object} value
 * @return {Boolean}
 */
export const isEmptyObject = (target: object) => {
  return isObject(target) && !Object.keys(target).length
}

/**
 * 手机号码验证
 */
export const PhoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/

export const validateIdCard = (rule, value, callback) => {
  const reg = /^[1-9]\d{5}(18|19|20|21|22)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/
  if (reg.test(value) === false) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}
