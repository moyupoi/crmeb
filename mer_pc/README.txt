mer-pc
├── assets
│   ├── fonts   字体包
│   │   ├── D-DIN-PRO-400-Regular.ttf
│   │   ├── D-DIN-PRO-600-SemiBold.ttf
│   │   ├── OPPOSans-M.ttf
│   │   ├── OPPOSans-R.ttf
│   │   ├── alimamashuheiti.ttf
│   │   └── font.css
│   ├── iconfont   图标字体样式
│   │   └── iconfont.css
│   ├── images   图片
│   └── scss   公共样式
│       ├── element
│       │   ├── dark.scss
│       │   └── index.scss
│       ├── checkbox.scss
│       └── index.scss
├── components   公共组件
│   ├── verifition   验证码点字验证组件
│   │   ├── Verify
│   │   │   ├── SilderVerify.vue
│   │   │   ├── verifyPoints.vue
│   │   │   └── verifySlider.vue
│   │   ├── utils
│   │   │   ├── ase.js
│   │   │   ├── fomat.ts
│   │   │   ├── tips.ts
│   │   │   └── util.js
│   │   ├── Verify.vue
│   │   └── moveVerify.vue
│   ├── UserLogin.vue            登录组件
│   ├── addAddress.vue           地址组件
│   ├── bannerIndex.vue          首页组件
│   ├── classifyCard.vue         首页分类组件
│   ├── confirmProduct.vue       提交订单中商品信息组件
│   ├── countDown.vue            倒计时展示
│   ├── couponList.vue           商户主页优惠券列表、我的优惠券
│   ├── defaultComponents.ts     头部导航菜单
│   ├── emptyPage.vue            数据空状态页面
│   ├── headerSeach.vue          首页头部搜索
│   ├── layoutAdvertisement.vue  首页头部广告
│   ├── layoutFooter.vue         页面底部
│   ├── layoutHeader.vue         页面头部
│   ├── merchantIndex.vue        首页品牌好店
│   ├── merchantList.vue         商户列表，关注商品、店铺街
│   ├── merchantNews.vue         商户头像 资质 星级等
│   ├── newcomerGift.vue         新人礼弹窗
│   ├── notLoggedIn.vue          未登录页面展示
│   ├── orderProduct.vue         商品信息，订单列表、评论列表中展示
│   ├── pageHeader.vue           页面中头部展示标题使用
│   ├── product.vue              商品列表，推荐商品，首页商品展示
│   ├── productSeach.vue         商品列表，可用优惠券商品列表、商品搜索列表使用
│   ├── recommend.vue            推荐商品列表组件
│   ├── recommendedIndex.vue     首页推荐版本
│   ├── rightNavigation.vue      右侧黑条菜单
│   ├── seachList.vue            搜索条件筛选，可多选，商品搜索列表、商户搜索列表中使用
│   ├── seckillIndex.vue         首页秒杀组件
│   ├── sortSeach.vue            销量、价格、搜索搜索条件，商品列表、商户主页，搜索展示
│   ├── successDialog.vue        成功提示弹窗
│   ├── svipPrice.vue            商品价格，包括普通价、会员价
│   ├── swiperIndex.vue          swiper轮播
│   ├── uploadFrom.vue           上传组件
│   └── userProductList.vue      商品列表，收藏商品、我的足迹使用
├── composables                  可复用的组合式
│   ├── useCopy.ts               复制
│   ├── useDialog.ts             模态框弹出、关闭
│   ├── useMerchant.ts           店铺关注、取消关注、领取优惠券
│   ├── useOrder.ts              订单相关操作
│   ├── useOrderConfirm.ts       地址弹出框
│   ├── useOrderRefund.ts        撤销售后
│   ├── useProductDetail.ts      商品详情相关
│   ├── useRouterItem.ts         获取浏览器传值
│   ├── useScrollHeight.ts       浏览器视口相关
│   └── verifyCode.ts            发送验证码
├── enums                        枚举类型
│   ├── cacheEnums.ts            本地缓存key
│   └── requestEnums.ts          接口请求相关
├── layouts                      布局系统
│   └── default.vue              页面布局系统
├── middleware                   中间件
│   └── auth.global.ts           路由跳转中间件
├── nuxt
│   └── env.ts
├── pages                              页面
│   ├── activity                       营销活动
│   │   ├── coupon_goods_list.vue      优惠券可用商品
│   │   ├── coupon_list.vue            领券中心
│   │   ├── information_info.vue
│   │   ├── information_list.vue       资讯信息
│   │   └── seckill_list.vue           限时秒杀
│   ├── merchant                       商户相关
│   │   ├── merchant
│   │   │   ├── home.vue               店铺首页商品分类
│   │   │   └── recommending.vue       店铺首页swiper轮播
│   │   ├── application_record.vue     商户入驻申请记录
│   │   ├── defaultMerchant.ts         商户相关默认数据
│   │   ├── merchant_home.vue          店铺首页
│   │   ├── merchant_list.vue          店铺商品列表
│   │   ├── merchant_settled.vue       商户入驻申请
│   │   └── merchant_street.vue        品牌好店
│   ├── order                          订单相关
│   │   ├── components
│   │   │   └── returningGoods.vue     退回商品弹窗
│   │   ├── apply_refund.vue           申请退款
│   │   ├── defaultOrder.ts            订单相关默认值
│   │   ├── orderRefund_details.vue    退款单详情
│   │   ├── order_confirm.vue          订单提交页
│   │   ├── order_details.vue          订单详情
│   │   ├── order_logistics.vue        订单物流信息
│   │   ├── order_pay_status.vue       订单之后结果页
│   │   ├── order_payment.vue          收银台
│   │   ├── product_evaluate.vue       商品评价
│   │   ├── shopping_cart.vue          购物车
│   │   └── virtual_order_details.vue  虚拟商品订单详情
│   ├── product                        商品相关
│   │   ├── detail                     商品详情
│   │   │   └── [id].vue
│   │   ├── activityStyleCard.vue      活动商品卡片
│   │   ├── product_list.vue           商品搜索列表
│   │   ├── product_recommended.vue    首页推荐商品更多
│   │   ├── receiveCouponList.vue      商品详情领取优惠券抽屉
│   │   └── seckillCard.vue            秒杀商品卡片
│   ├── users                              个人中心相关
│   │   ├── components                     弹窗组件
│   │   │   ├── editUserPasswordFrom.vue   修改密码
│   │   │   └── editUserPhoneFrom.vue      修改手机号
│   │   ├── address_list.vue               地址管理
│   │   ├── agreement_rules.vue            协议管理
│   │   ├── browsing_history.vue           我的足迹
│   │   ├── collect_merchant.vue           收藏店铺
│   │   ├── collect_products.vue           收藏宝贝
│   │   ├── defaultUser.ts                 个人中心默认数据
│   │   ├── evaluation_list.vue            评价晒单
│   │   ├── index.vue
│   │   ├── order_list.vue                 订单列表
│   │   ├── refund_list.vue                退款单列表
│   │   ├── user_account.vue               账号密码
│   │   ├── user_balance.vue               我的余额
│   │   ├── user_coupon.vue                我的优惠券
│   │   ├── user_info.vue                  个人资料
│   │   └── user_integral.vue              我的积分
│   ├── index.vue                          首页
│   └── users.vue                          个人中心主页面
├── plugins                                插件
│   ├── aos.ts                             动画
│   ├── element-plus.ts                    element框架
│   ├── fetch.ts                           数据请求
│   ├── icons.ts                           图标库
│   ├── pinia.ts                           pinia数据状态管理
│   └── vue-swiper.ts                      轮播图
├── public                                 公共页面
│   ├── CNAME
│   └── favicon.ico                        浏览器图标
├── scripts
│   └── build.mjs
├── server                     接口管理
│   ├── activityApi.ts         营销活动
│   ├── goodsApi.ts            商品相关
│   ├── homeApi.ts             首页相关
│   ├── merchantApi.ts         商户相关
│   ├── orderApi.ts            订单相关
│   └── userApi.ts             个人中心相关
├── stores                     数据管理
│   ├── app.ts
│   └── user.ts
├── types                      定义数据类型
│   ├── activity.d.ts
│   ├── global.d.ts
│   ├── goods.d.ts
│   ├── merchant.ts
│   ├── order.d.ts
│   └── user.d.ts
├── utils                      公共方法
│   ├── http
│   │   ├── index.ts
│   │   └── request.ts
│   ├── env.ts
│   ├── feedback.ts
│   ├── filter.ts
│   ├── helper.ts
│   ├── util.ts
│   └── validate.ts
├── .env.development         请求配置
├── .env.production          请求配置
├── app.vue                  面共享的布局、样式和其他组件
├── nuxt.config.ts           配置文件
└── unocss.config.ts         unocss样式插件配置
