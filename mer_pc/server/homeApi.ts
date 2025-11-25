import { ItemObject, PageQuery } from '~/types/global'
//import useDefaultRequest from "~/server/index";
/**
 * 首页 获取底部导航信息
 *
 */
export const getBottomNavigationApi = () => {
   // return httpRequest.get('front/index/get/bottom/navigation');
  return $request.get({ url: 'front/index/get/bottom/navigation' })
}

/**
 * 获取主页数据 无需授权
 *
 */
export const getIndexData = () => {
    //return httpRequest.get('front/index/info');
  return $request.get({ url: 'front/index/info' })
}

/**
 * 首页店铺列表-根据数量加载
 *
 */
export const indexMerchantListApi = (recomdnum: number) => {
    //return useDefaultRequest.get(`front/index/merchant/list/${recomdnum}`);
  return $request.get({ url: `front/index/merchant/list/${recomdnum}` })
}

/**
 * 获取首页配置信息
 *
 */
export const pcHomeConfigApi = async () => {
    //return httpRequest.get('front/pc/home/get/config');
  const res = await $request.get({ url: `front/pc/home/get/config` })
  const { quickEntryList, philosophyList, ...rest } = res
  console.log('pcHomeConfigApi', res);
  
  return {
    ...rest,
    quickEntryList: quickEntryList.filter((item: any) => !['CRMEB', '商户入驻', '活动中心'].includes(item.name)),
    homeNavigationList: rest.homeNavigationList.filter((item: any) => !['限时秒杀', '品牌好店', '领券中心','资讯信息', '我的优惠券'].includes(item.name)),
    philosophyList: [],
  }
}

/**
 * 获取首页推荐板块
 *
 */
export const pcHomeRecommendedApi = () => {
  return $request.get({ url: `front/pc/home/get/recommended` })
}

/**
 * 首页秒杀
 *
 */
export const pcHomeSeckillApi = () => {
  return $request.get({ url: `front/index/seckill/info` })
}

/**
 * 获取首页banner
 *
 */
export const pcHomeBannerApi = () => {
  return $request.get({ url: `front/pc/home/get/banner` })
}

/**
 * 资讯热门列表
 *
 */
export const articleHotListApi = () => {
  return $request.get({ url: `front/article/hot/list` })
}

/**
 * 获取移动端域名
 *
 */
export const indexDomainApi = () => {
  return $request.get({ url: `front/index/get/domain` })
}

/**
 * 获取微信二维码
 *
 */
export const wechatQrcodeApi = (params: ItemObject) => {
  return $request.post({ url: `front/qrcode/get/wechat`, params })
}

/**
 * 获取平台客服
 *
 */
export const indexCustomerServiceApi = () => {
  return $request.get({ url: `front/index/get/customer/service` })
}

/**
 * 推荐板块商品分页列表
 *
 */
export const indexRecommendedProductApi = (params: PageQuery) => {
  return $request.get({ url: `front/pc/home/recommended/${params.id}/product/page`, params })
}
