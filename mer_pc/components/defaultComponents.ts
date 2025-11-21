/**
 * 头部导航菜单
 */
export const headerMenuListDefault = () => {
  return [
    {
      name: '商品分类',
      id: 'classify',
    },
    {
      name: '限时秒杀',
      id: 'seckill',
      pc_url: '/activity/seckill_list',
    },
    {
      name: '品牌好店',
      id: 'merchant',
      pc_url: '/merchant/merchant_street',
    },
    {
      name: '领券中心',
      id: 'coupon',
      pc_url: '/activity/coupon_list',
    },
    {
      name: '订单中心',
      id: '1',
      pc_url: '/users/order_list',
    },
    {
      name: '资讯信息',
      id: 'information',
      pc_url: '/activity/information_list',
    },
  ]
}
