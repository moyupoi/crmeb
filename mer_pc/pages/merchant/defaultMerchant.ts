/**
 * 商户入驻表单提交
 */
export const merchantFormDefault = () => {
  return {
    captcha: '',
    categoryId: null,
    handlingFee: 0,
    name: '',
    phone: '',
    qualificationPicture: '',
    realName: '',
    typeId: null,
    keywords: '',
  }
}

/**
 * 商户商品搜索条件
 */
export const merchantProductSeachDefault = () => {
  return {
    keyword: '',
    priceOrder: '',
    salesOrder: '',
    page: 1,
    limit: 20,
    cid: null,
    merId: null,
    minPrice: null,
    maxPrice: null,
  }
}
