<script setup lang="ts">
import { FromData, PageQuery } from '~/types/global'
import { cartAddApi, collectAddApi, collectCancelApi, productDetailApi } from '~/server/goodsApi'
import { ProductMarketingTypeEnum, ProductTypeEnum } from '@/enums/productEnums'
import { ProductsInfo } from '~/types/goods'
import useOrder from '~/composables/useOrder'
import { shallowRef, watch, ref, reactive, onMounted, computed } from 'vue'
const { handlerProDetailLink } = useOrder()
const { getMerId } = useAppStore()

const route = useRoute()
const loading = ref(false)
const isShowAttrImage = ref(false) //右侧规格图片是否要展示在左侧大图中
/**
 * 商品详情
 */
onMounted(() => {
  nuxtApp.$onGetProductId(Number(route.query.id))
  getProductDetail()
})
const unique = ref('')
const stock = ref(0)
const count = ref(1)
const couponList = ref<Array<string>>([])
const attrSelected = ref<Array<string>>([])
const checkedImage = ref<string>('') //左侧大图
const productAttr = ref<Array<string>>([]) //商品规格
const productValue = ref({}) //规格数据
const attrValueSelected = reactive({}) //选中规格的数据
const productInfo = reactive<ProductsInfo>({}) //商品信息
const merchantInfo = reactive({}) //商户信息
const masterProductId = ref(0) // 秒杀商品中普通商品id
const sliderImage = ref<Array<string>>([])
const slideIndex = ref(0)
const marketingType = ref<number>(<number>Number(<string>route.query.marketingType))
const userCollect = ref(false) //是否收藏
const merId = ref(0) //店铺id
const guaranteeList = ref<FromData[]>([]) //协议
const oneQuota = ref(0) // 活动单次限购
const videoLink = ref<string>('') //视频地址
const queryParams = reactive<any>({
  id: Number(route.query.id),
  marketingType: marketingType.value,
  type: 0,
})
const router = useRouter()
const { getSeckillInfo, seckillStatus, seckillTime, replyInfo, getReplyList, productReplyConfig, replyList } =
  useProductDetail() //秒杀详情
const where = reactive<PageQuery>({ page: 1, limit: 10, type: 0 }) //评论列表
const getProductDetail = async () => {
  loading.value = true
  try {
    const data = await productDetailApi(queryParams)
    if (data) Object.assign(productInfo, data.productInfo)
    masterProductId.value = data.masterProductId
    productValue.value = { ...data.productValue }
    Object.assign(merchantInfo, data.merchantInfo)
    //秒杀
    if (marketingType.value == ProductMarketingTypeEnum.Seckill) await getSeckillInfo(data, route.query)

    //评论数据
    await productReplyConfig(masterProductId.value > 0 ? masterProductId.value : queryParams.id)
    //评论列表
    await getReplyList(where, masterProductId.value > 0 ? masterProductId.value : queryParams.id)
    guaranteeList.value = data.guaranteeList ? data.guaranteeList : []
    productAttr.value = data.productAttr
    userCollect.value = data.userCollect
    oneQuota.value = data.oneQuota
    couponList.value = data.couponList ? data.couponList : []
    merId.value = data.productInfo.merId
    await getMerId(merId.value)
    let arrayImg = productInfo.sliderImage
    sliderImage.value = JSON.parse(arrayImg)
    getVideiLink() //视频
    loading.value = false
  } catch (e) {
    loading.value = false
    await router.back()
  }
}

//不带系统表单数据的普通商品能加入购物车，0=普通商品,1-积分商品,2-虚拟商品,4=视频号,5-云盘商品,6-卡密商品
const isProductType = computed(() => {
  return productInfo.type == ProductTypeEnum.Normal && productInfo.systemFormId == 0
})

//评论切换
const replyTypeChange = (type: number) => {
  where.type = type
  getReplyList(where, masterProductId.value > 0 ? masterProductId.value : queryParams.id)
}
const callPaginate = (num: number) => {
  where.page = num
  getReplyList(where, masterProductId.value > 0 ? masterProductId.value : queryParams.id)
}

//轮播
const swiperData = reactive({
  spaceBetween: 14,
  slidesPerView: 5,
  boxWidth: 'w-486px',
  slideWidth: 'w-86px',
  navigationColor: 'color:#999',
  navigationBgColor: '',
  modules: [Navigation],
})

watch(
  () => <string>route.query.id,
  (newValue) => {
    queryParams.id = route.query.id
    queryParams.marketingType = route.query.marketingType
    marketingType.value = route.query.marketingType
    getProductDetail()
  },
)


watch(productAttr, (newValue, oldValue) => {
  if (newValue) {
    // 先找默认中库存不为0的为默认规格，否则找不是默认中库存不为0的规格
    const productValues = Object.values(productValue.value)
    // 拼团商品中还有groupStock需要判断，拼团与非拼团分判断
    // 获取有效的规格值
    const checked = getValidSku(productValues)
    for (let i = 0; i < checked.length; i++) {
      attrSelected.value[i] = checked[i]
    }
  } else {
    unique.value = productValue.value['']?.unique
  }
})

/**
 * 获取符合条件的规格值
 * @param {Array} values - 规格值数组
 * @returns {Array} - 有效的规格值数组
 */
const getValidSku = (values) => {
  const isGroupbuying = marketingType.value === ProductMarketingTypeEnum.Groupbuying

  // 检查库存条件
  const hasValidStock = (item) => {
    if (isGroupbuying) {
      return item.stock !== 0 && item.groupStock !== 0
    }
    return item.stock !== 0
  }

  // 先找默认规格中库存不为0的
  const defaultSku = values.find((item) => item.isDefault && hasValidStock(item))
  if (defaultSku) {
    return defaultSku.sku.split(',')
  }

  // 再找非默认规格中库存不为0的
  const nonDefaultSku = values.find((item) => hasValidStock(item))
  return nonDefaultSku ? nonDefaultSku.sku.split(',') : []
}

watch(
  attrSelected,
  (newValue, oldValue) => {
    if (newValue) {
      let name = newValue.join()
      let checked = productValue.value[name]
      if (checked) {
        Object.assign(attrValueSelected, checked)
        ;(attrValueSelected.isPaidMember = productInfo.isPaidMember), //是否是付费会员商品
          (stock.value = checked.stock)
        unique.value = checked.id
          checkedImage.value = checked.image
      } else {
        Object.assign(attrValueSelected, null)
        stock.value = 0
        unique.value = ''
      }
    } else {
      unique.value = productValue.value[''].id
      stock.value = productInfo.stock
    }
  },
  { deep: true },
)
watch(
  attrValueSelected,
  (newValue, oldValue) => {
    if (newValue) {
      let sliderImage = productInfo.value ? JSON.parse(productInfo.value.sliderImage) : []
      sliderImage[0] = newValue.image
    }
  },
  { deep: true },
)


// 获取右侧规格图片
const getImage = (val) => {
  isShowAttrImage.value = true
  let name = attrValueSelected.sku //选中的规格值
  let checked = productValue.value[name] // 获取单条数据
  if (checked) {
    checkedImage.value = checked.image
  }
}

const getFileType = (fileName: string) => {
  //后缀获取
  let suffix = ''
  // 获取类型结果
  let result = ''
  try {
    const flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    return false
  }
  suffix = suffix.toLocaleLowerCase()
  // 图片格式
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
  // 进行图片匹配
  result = imglist.find((item) => item === suffix)
  if (result) {
    return 'image'
  }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
  result = videolist.find((item) => item === suffix)
  if (result) {
    return 'video'
  }
  // 其他 文件类型
  return 'other'
}

const swiperMouseover = (index: number) => {
  slideIndex.value = index
  isShowAttrImage.value = false
  getVideiLink()
}

const getVideiLink = async () => {
  if (getFileType(JSON.parse(productInfo.sliderImage)[0]) == 'video') {
    //如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
    videoLink.value = JSON.parse(productInfo.sliderImage)[0]

    //  checkedImage.value =
    //  JSON.parse(productInfo.sliderImage).splice(0, 1);
  } else {
  }
  checkedImage.value = JSON.parse(productInfo.sliderImage)[slideIndex.value]
}

/**
 * 详情、评论切换
 */
const tabIndex = ref<number>(0)
const handleChangeTab = (type: number) => {
  tabIndex.value = type
}

/**
 * 收藏
 */
const handleCollect = Debounce(async () => {
  let id = marketingType.value == ProductMarketingTypeEnum.Seckill ? masterProductId.value : route.query.id
  if (userCollect.value) {
    await collectCancelApi({ ids: id })
    userCollect.value = !userCollect.value
    await feedback.msgSuccess('取消成功')
  } else {
    await collectAddApi({
      productId: id,
      category: 0,
    })
    userCollect.value = !userCollect.value
    await feedback.msgSuccess('收藏成功')
  }
}, 500)

/**
 * 立即购买
 */
import { useUserStore } from '@/stores/user'
const { onGetCartCount } = useOrder()
const userStore = useUserStore()
const btnloading = ref<boolean>(false)
const nuxtApp = useNuxtApp()
const handleBuy = Debounce(async (type: number, event: any) => {
  if (!userStore.isLogin) {
    nuxtApp.$onHandlerLogin()
  } else {
    await onGoCat(type)
  }
}, 500)

/**
 * 加入购物车、立即购买
 * @param type：1加入购物车，0立即购买
 */
const goBuyloading = ref<boolean>(false)
const onGoCat = async (type: number) => {
  if (type === 1) {
    let data = {
      productId: parseFloat(route.query.id),
      cartNum: parseFloat(count.value),
      productAttrUnique: parseFloat(unique.value),
    }
    goBuyloading.value = true
    await cartAddApi(data)
      .then((res) => {
        feedback.msgSuccess('添加购物车成功')
        //购物车数量
        onGetCartCount()
        goBuyloading.value = false
      })
      .catch((res) => {
        goBuyloading.value = false
      })
  } else {
    onPreOrder()
  }
}
//立即购买
import { Mul, Debounce } from '~/utils/util'
import SeckillCard from '~/pages/product/seckillCard.vue'
import MerchantNews from '~/components/merchantNews.vue'
import { useAppStore } from '~/stores/app'
import { useNuxtApp } from 'nuxt/app'
import { ItemObjectNumber } from '#build/types/global'
import SvipPrice from '~/components/svipPrice.vue'
import { Navigation } from 'swiper'
const { getPreOrder } = useOrder()
const onPreOrder = () => {
  let types = ''
  switch (marketingType.value) {
    case ProductMarketingTypeEnum.Normal:
      if (productInfo.type === 4) {
        types = 'video'
      } else {
        types = 'buyNow'
      }
      break
    case ProductMarketingTypeEnum.Seckill:
      types = 'seckill'
      break
  }

  getPreOrder(
    types,
    [
      {
        attrValueId: parseFloat(unique.value),
        productId: parseFloat(route.query.id),
        productNum: parseFloat(count.value),
      },
    ],
    seckillStatus?.value,
    seckillTime?.value,
  )
}

/**
 * 加购数量加减变化
 */
const handleMinus = () => {
  count.value--
}
const handlePlus = () => {
  count.value++
}
const inputNum = () => {
  count.value = parseInt(count.value) >= stock.value ? stock.value : count.value
  count.value = parseInt(count.value) <= 1 ? 1 : count.value
}

/**
 * 优惠券弹窗
 */
const receiveCouponRef = shallowRef() //成功弹窗
// const dialogVisibleCoupon = ref<boolean>(false)
const handleGetCoupon = () => {
  // receiveCouponRef.value.DialogOpen()
  nuxtApp.$onHandlerCoupon()
}
const handleClick = () => {
  event.stopPropagation()
  nuxtApp.$onHandlerCloseCoupon()
}

//关注店铺回调
const handleSubmitSuccess = () => {
  merchantInfo.isCollect = !merchantInfo.isCollect
}
</script>

<template>
  <div class="goods_count relative" @click.stop="handleClick">
    <div class="goods-detail pt-30px" v-loading="loading">
      <div class="wrapper_1200 acea-row">
        <div class="goods-main">
          <!--上边-->
          <div class="acea-row row-top" style="position: relative">
            <!--轮播图-->
            <div class="carousel w-530px">
              <video
                v-if="getFileType(sliderImage[0]) == 'video' && slideIndex === 0 && !isShowAttrImage"
                id="example_video_1"
                class="video-js vjs-default-skin w-530px h-530px borRadius mb-20px"
                controls
                autoplay
                data-setup="{}"
              >
                <source :src="videoLink" type="video/mp4" />
              </video>
              <el-image v-else :src="checkedImage" class="w-530px h-530px borRadius mb-20px" lazy></el-image>
              <div class="w-530px">
                <swiper-index :swiperSlideList="sliderImage" :swiperData="swiperData" ref="swiperRef">
                  <template v-slot:default="slotProps">
                    <video
                      v-if="getFileType(sliderImage[0]) == 'video' && slotProps.value.swiperIndex === 0"
                      :src="slotProps.value.swiperItem"
                      class="w-86px h-86px b-rd-6px cursors"
                      :class="slideIndex === slotProps.value.swiperIndex ? 'activityStyle' : ''"
                      @click="swiperMouseover(slotProps.value.swiperIndex)"
                    ></video>
                    <el-image
                      v-else
                      @click="swiperMouseover(slotProps.value.swiperIndex)"
                      :src="slotProps.value.swiperItem"
                      class="w-86px h-86px b-rd-6px cursors"
                      :class="slideIndex === slotProps.value.swiperIndex ? 'activityStyle' : ''"
                    ></el-image>
                  </template>
                </swiper-index>
              </div>
            </div>
            <!--商品价格-->
            <div class="text-wrapper pt-20px">
              <div class="flex flex-justify-between mbtom20">
                <div class="title text-#333 text-18px w570px lh-28px font-400">{{ productInfo.name }}</div>
              </div>
              <div
                class="w-630px priceCard bg-#F3F3F3 b-rd-12px overflow-hidden mb-20px"
                :class="marketingType == ProductMarketingTypeEnum.Normal && productInfo.activityStyle ? '' : 'pb-20px'"
              >
                <!--秒杀-->
                <seckill-card
                  v-if="marketingType == ProductMarketingTypeEnum.Seckill"
                  :seckillStatus="seckillStatus"
                  :seckillTime="seckillTime"
                  :productInfo="productInfo"
                ></seckill-card>
                <!--普通商品价格 activityStyleCard氛围图样式-->
                <div
                  class="flex-between-center px-20px pt-20px"
                  :style="{ backgroundImage: `url(${productInfo.activityStyle})` }"
                  :class="
                    marketingType == ProductMarketingTypeEnum.Normal && productInfo.activityStyle
                      ? 'activityStyleCard'
                      : ''
                  "
                >
                  <div class="acea-row" style="align-items: end">
                    <div
                      class="price text-14px font-600 mr-14px dinProSemiBold"
                      :class="
                        marketingType == ProductMarketingTypeEnum.Normal && productInfo.activityStyle
                          ? 'text-#fff'
                          : 'font-color'
                      "
                    >
                      <svipPrice
                        :priceStyle="{ fontSize: '30px' }"
                        :topStyle="{ top: '5px' }"
                        :productPrice="attrValueSelected.price ? attrValueSelected : productInfo"
                      ></svipPrice>
                    </div>
                    <div
                      v-show="!productInfo.isPaidMember"
                      class="money-wrap text-14px dinProRegular"
                      :class="
                        marketingType == ProductMarketingTypeEnum.Normal && productInfo.activityStyle
                          ? 'text-#fff'
                          : 'fontColor6'
                      "
                    >
                      <del class="dinProRegular"
                        >￥{{ attrValueSelected.otPrice ? attrValueSelected.otPrice : productInfo.otPrice }}</del
                      >
                    </div>
                    <div v-show="productInfo.activityStyle" class="text-12px text-#fff ml-6px oppoSans-R">
                      ( 销量 {{ Math.floor(productInfo.sales) + Math.floor(productInfo.ficti) || 0 }} )
                    </div>
                  </div>
                  <div v-show="!productInfo.activityStyle" class="text-12px fontColor6 oppoSans-R">
                    销量
                    {{ Math.floor(productInfo.sales) + Math.floor(productInfo.ficti) || 0 }}
                  </div>
                </div>
                <!--优惠券-->
                <div v-if="couponList.length" class="flex flex-justify-between px-20px items-center pb-20px">
                  <div class="acea-row">
                    <span
                      v-for="item in couponList"
                      :key="item.id"
                      class="square text-14px text-#fff lh-25px px-10px mt-20px mr-10px"
                    >
                      {{ item.minPrice === 0 ? '无门槛减' + item.money : '满' + item.minPrice + '减' + item.money }}
                    </span>
                  </div>
                  <div class="text-12px font-color cursors mt-20px" @click.stop="handleGetCoupon">领券</div>
                </div>
              </div>
              <div class="attribute mb-6px">
                <div v-for="(item, index) in productAttr" :key="index" class="size-wrapper mb-6px">
                  <div class="text-14px fontColor6 m-b-15px" :title="item.attributeName">{{ item.attributeName }}</div>
                  <div class="acea-row list">
                    <label v-for="(itm, idx) in item.optionList" :key="idx" class="item cursors" @click="getImage(itm.optionName)">
                      <input
                        v-model="attrSelected[index]"
                        type="radio"
                        :name="index"
                        :value="itm.optionName"
                        :checked="attrSelected[index] === itm.optionName"
                        hidden
                      />
                      <div class="acea-row cont h-36px b-rd-6px mr14px">
                        <div class="acea-row row-middle name text-#333">{{ itm.optionName }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="number-wrapper mb-20px">
                <div class="text-14px fontColor6 m-b-15px">数量</div>
                <div class="counter-wrap acea-row">
                  <div class="counter">
                    <button
                      class="iconfont cursors icon-shangpinshuliang-jian h-36px w-36px b-rd-6px"
                      :disabled="count === 1 || !stock"
                      @click="handleMinus"
                    >
                      —
                    </button>
                    <input v-model="count" @input="inputNum" :disabled="productInfo.type === 5" />
                    <button
                      style="font-size: 20px"
                      class="iconfont cursors icon-shangpinshuliang-jia h-36px w-36px b-rd-6px"
                      :disabled="count === stock || !stock || count === oneQuota || productInfo.type === 5"
                      @click="handlePlus"
                    >
                      +
                    </button>
                  </div>
                  <span>( 库存：{{ stock || 0 }}{{ productInfo.unitName || '' }} )</span>
                </div>
              </div>
              <!--按钮-->
              <div class="acea-row items-center">
                <template v-if="productInfo.type === ProductTypeEnum.Reservation && marketingType == ProductMarketingTypeEnum.Normal">
                  <div class="text-16px oppoSans-R font-color">预约商品请使用移动端下单</div>
                </template>
                <!--普通商品-->
                <template v-if="productInfo.type !== ProductTypeEnum.Reservation &&marketingType == ProductMarketingTypeEnum.Normal">
                  <div class="acea-row" v-if="stock">
                    <div v-show="isProductType" class="button-wrapper mr-20px">
                      <button
                        class="btn cursors"
                        v-loading="goBuyloading"
                        :disabled="!stock"
                        @click="handleBuy(1, $event)"
                      >
                        加入购物车
                      </button>
                    </div>
                    <div class="button-wrapper">
                      <button
                        class="handleBtn cursors h-50px lh-50px w-150px borderSolE9"
                        v-loading="btnloading"
                        :disabled="!stock || productInfo.deliveryMethod == 2"
                        @click="handleBuy(0, $event)"
                      >
                        立即购买
                      </button>
                    </div>
                  </div>
                  <div class="button-wrapper" v-else>
                    <button class="btn btn-out" disabled>已售罄</button>
                  </div>
                  <div v-show="productInfo.deliveryMethod == 2" class="font-color text-14px w-100% mt-20px mb-20px">
                    仅支持到店自提的商品请使用移动端下单
                  </div>
                </template>
                <!--秒杀商品-->
                <template v-if="marketingType == ProductMarketingTypeEnum.Seckill">
                  <div class="button-wrapper" v-if="seckillStatus === 1 && stock">
                    <button
                      class="handleBtn cursors h-50px lh-50px w-150px borderSolE9"
                      v-loading="btnloading"
                      :disabled="!stock"
                      @click="handleBuy(0, $event)"
                    >
                      立即购买
                    </button>
                  </div>
                  <div class="button-wrapper" v-if="seckillStatus === 1 && !stock">
                    <button class="btn btn-out" disabled>已售罄</button>
                  </div>
                  <div class="button-wrapper" v-if="seckillStatus !== 1">
                    <button class="btn btn-out" disabled>
                      {{ seckillStatus === 0 ? '活动已结束' : '活动未开始' }}
                    </button>
                  </div>
                </template>
                <!--收藏-->
                <el-divider direction="vertical" />

                <div
                  class="iconfont cursors mr-6px"
                  :class="!userCollect ? 'text-#333 icon-baobeishoucang' : 'font-color icon-yishoucang'"
                  @click="handleCollect"
                ></div>
                <div
                  :class="!userCollect ? 'text-#333' : 'font-color'"
                  @click="handleCollect"
                  class="text-14px oppoSans-R cursors"
                >
                  {{ !userCollect ? '收藏' : '已收藏' }}
                </div>
              </div>

              <div class="acea-row mt-40px">
                <div v-for="item in guaranteeList" :key="item.id">
                  <el-popover
                    placement="bottom-start"
                    :width="200"
                    trigger="hover"
                    :content="item.content"
                    popper-class="text-19px c-\#999"
                  >
                    <template #reference>
                      <div class="text-14px fontColor333 mr-20px cursors">
                        <span class="iconfont icon-yanzhengma"></span>
                        {{ item.name }}
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <!--下边-->
          <div class="detail-wrapper acea-row">
            <div class="w-210px mr-20px">
              <MerchantNews
                :merchantInfo="merchantInfo"
                :merId="merId"
                fromType="productDetail"
                @handleSubmitSuccess="handleSubmitSuccess"
              ></MerchantNews>
              <div class="borderSol-eee b-rd-12px w-210px px-20px pt-20px mt-20px mb-20px">
                <el-divider><div class="text-16px text-#333 w-64px">好物推荐</div></el-divider>
                <div v-if="merchantInfo.proList && merchantInfo.proList.length" class="cursors">
                  <div v-for="item in merchantInfo.proList" class="mb-25px" @click="handlerProDetailLink(item.id, 0)">
                    <div class="relative">
                      <div v-show="item.stock === 0" class="sellOut">已售罄</div>
                      <el-image :src="item.image" class="w-170px h-170px b-rd-8px"></el-image>
                      <div
                        v-if="item.activityStyle"
                        :style="{ backgroundImage: `url(${item.activityStyle})` }"
                        class="border-picture b-rd-8px"
                      ></div>
                    </div>
                    <div class="line1 w-170px text-14px text-#333 mt-15px lh-14px">{{ item.name }}</div>
                    <div class="flex-between-center mt-15px">
                      <div class="text-12px font-color">
                        <span class="oppoSans-M">￥</span
                        ><span class="text-20px lh-20px dinProRegular">{{ item.price }}</span>
                      </div>
                      <div class="text-12px text-#999">已售{{ item.sales + item.ficti }}{{ item.unitName }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-970px">
              <div class="detail-hd acea-row">
                <div class="acea-row">
                  <div
                    class="item acea-row row-center-wrapper"
                    :class="tabIndex === 0 ? 'on' : 'text-16px'"
                    @click="handleChangeTab(0)"
                  >
                    详情
                  </div>
                  <div
                    class="item acea-row row-center-wrapper"
                    :class="tabIndex === 1 ? 'on' : 'text-16px'"
                    @click="handleChangeTab(1)"
                  >
                    评论({{ replyInfo.sumCount }})
                  </div>
                </div>
              </div>
              <el-divider border-style="double" />
              <div class="w-100%">
                <div v-show="tabIndex === 0">
                  <div v-if="productInfo.content" class="w-100% detail-bd">
                    <div v-html="productInfo.content"></div>
                  </div>
                  <div v-else>
                    <empty-page title="暂无商品详情~" m-top="2%">
                      <template v-slot:emptyImage>
                        <img src="@/assets/images/wudizhi.png" />
                      </template>
                    </empty-page>
                  </div>
                </div>
                <!--评论-->
                <div v-show="tabIndex === 1">
                  <div class="flex-between-center">
                    <div class="flex comment">
                      <div
                        @click="replyTypeChange(0)"
                        :class="where.type === 0 ? 'check-color' : ''"
                        class="item px-15px b-rd-17px h-34px lh-32px text-14px mr-10px cursors"
                      >
                        全部({{ replyInfo.sumCount || 0 }})
                      </div>
                      <div
                        @click="replyTypeChange(1)"
                        :class="where.type === 1 ? 'check-color' : ''"
                        class="item px-15px b-rd-17px h-34px lh-32px text-14px mr-10px cursors"
                      >
                        好评({{ replyInfo.goodCount || 0 }})
                      </div>
                      <div
                        @click="replyTypeChange(2)"
                        :class="where.type === 2 ? 'check-color' : ''"
                        class="item px-15px b-rd-17px h-34px lh-32px text-14px mr-10px cursors"
                      >
                        中评({{ replyInfo.inCount || 0 }})
                      </div>
                      <div
                        @click="replyTypeChange(3)"
                        :class="where.type === 3 ? 'check-color' : ''"
                        class="item px-15px b-rd-17px h-34px lh-32px text-14px cursors"
                      >
                        差评({{ replyInfo.poorCount || 0 }})
                      </div>
                    </div>
                    <div class="flex-y-center text-14px fontColor6">
                      评分
                      <el-rate
                        class="ml-10px"
                        v-model="replyInfo.replyStar"
                        disabled
                        :colors="['#e93323', '#e93323', '#e93323']"
                        score-template="{replyInfo.replyStar}"
                      >
                      </el-rate>
                      <div class="rate ml-20px">
                        <span class="text-14px text-#666">好评率</span
                        ><span class="font-color ml-10px">{{ Mul(replyInfo.replyChance, 100) }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="comment-bd mt-30px">
                    <div v-if="replyList && replyList.total > 0">
                      <div v-for="item in replyList.list" :key="item.id" class="item">
                        <div class="acea-row row-middle item-hd flex-justify-between">
                          <div class="acea-row">
                            <div class="image mr-10px">
                              <img v-if="item.avatar" :src="item.avatar" />
                              <!--                          <img v-else src="~assets/images/f.png" alt="">-->
                            </div>
                            <div class="text">
                              <div class="flex-between-center text-16px text-#333 mb-8px lh-16px">
                                {{ item.nickname }}
                              </div>
                              <div class="text-#999999 text-12px">
                                {{ item.createTime }} <span class="ml-10px">{{ item.sku }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="star">
                            <el-rate
                              v-model="item.star"
                              disabled
                              :colors="['#e93323', '#e93323', '#e93323']"
                              score-template="{item.star}"
                            >
                            </el-rate>
                          </div>
                        </div>
                        <div class="item-bd">
                          <div class="mt-20px mb-20px">{{ item.comment }}</div>
                          <div class="image-wrapper" v-if="item.pics && item.pics.length && item.pics[0]">
                            <div v-for="(itm, idx) in item.pics" :key="idx" class="image" @click="isDialog = true">
                              <el-image
                                style="width: 86px; height: 86px; border-radius: 8px"
                                :src="itm"
                                :preview-src-list="item.pics"
                                lazy
                              ></el-image>
                            </div>
                          </div>
                          <div v-if="item.merchantReplyContent" class="reply mb-30px">
                            <div class="item"><span>回复：</span>{{ item.merchantReplyContent }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <empty-page title="暂无评论~" m-top="2%">
                        <template v-slot:emptyImage>
                          <img src="@/assets/images/wupinlun.png" />
                        </template>
                      </empty-page>
                    </div>
                    <div v-if="replyList && replyList.total > 0" class="acea-row row-middle mt-20px pb-20px">
                      <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="replyList.total"
                        class="page-item"
                        :page-size="where.limit"
                        :current-page="where.page"
                        @update:current-page="callPaginate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activityStyle {
  border: 2px solid #e93323;
}
.activityStyleCard {
  width: 630px;
  height: 84px;
  padding-top: 0 !important;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
:deep(.el-divider--vertical) {
  margin: 0 20px !important;
}
:deep(.merchantNews) {
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #eeeeee;
}
:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
  padding: 10px !important;
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
  color: #3d3d3d;
}
.detail-wrapper {
  :deep(.el-divider--horizontal) {
    margin: 20px 0 20px 0 !important;
  }
  :deep(.el-divider__text) {
    --el-bg-color: #fff !important;
  }
}
.goods_count {
  :deep(.el-drawer__body) {
    padding: 0 15px 20px 15px !important;
  }
}

:deep(.el-drawer),
:deep(.el-overlay) {
  box-shadow: none;
  --el-drawer-bg-color: #f5f5f5;
  --el-transition-duration: 0.7s;
}

.bbbbb {
  z-index: 2011;
  position: fixed;
  inset: 0px;
}
.drawerCoupon {
  right: 0;
  height: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  background-color: var(--el-drawer-bg-color);
  display: flex;
  flex-direction: column;
  box-shadow: var(--el-box-shadow-dark);
  overflow: hidden;
  transition: all var(--el-transition-duration);
  animation: slideOut 1s ease-in-out forwards;
}
@keyframes slideOut {
  from {
    right: 0%;
  }
  to {
    right: 278px;
  }
}
.square {
  height: 26px;
  background-color: #e93323;
  position: relative;
  display: inline-block;
}
.square::before,
.square::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #f3f3f3;
  position: absolute;
  top: 9px;
}
.square::before {
  left: -3px;
}

.square::after {
  right: -3px; /* 右侧 */
}
.priceCard {
  width: 630px;
  background-image: url('@/assets/images/spb.png');
}
.goods_count {
  background: #fff;
}
.comment {
  .item {
    color: #282828;
    background: #f7f7f7;
  }
  .check-color {
    color: #ffffff !important;
    background: #e93323 !important;
  }
}
.detail-bd {
  :deep div {
    width: 100% !important;
  }
  :deep img {
    display: block;
    width: 100% !important;
  }
}
.coupons-get {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
}
.coupon_list {
  padding: 5px 10px 5px 30px;
  .list {
    flex-direction: column;
  }
}
.ml30 {
  margin-left: 30px;
}
.mb22 {
  margin-bottom: 22px;
}
.mb12 {
  margin-bottom: 12px;
}
.activity {
  height: 24px;
  padding: 0 10px;
  background: #e93323;
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  position: relative;
  margin: 0 10px 5px 0;
}
.activity:before {
  content: ' ';
  position: absolute;
  width: 3px;
  height: 5px;
  border-radius: 0 3px 3px 0;
  border: 1px solid #e93323;
  background-color: #fff !important;
  bottom: 50%;
  left: -2px;
  margin-bottom: -3px;
  border-left-color: #fff !important;
}
.activity:after {
  content: ' ';
  position: absolute;
  width: 3px;
  height: 5px;
  border-radius: 3px 0 0 3px;
  border: 1px solid #e93323;
  background-color: #fff;
  right: -2px;
  bottom: 50%;
  margin-bottom: -3px;
  border-right-color: #fff !important;
}
.store-banner {
  width: 100%;
  height: 130px;
  img {
    object-fit: none;
    width: 100%;
    height: 100%;
  }
}
.menu-count {
  width: 100%;
  height: 40px;
  background: #dfdfdf;
}
.store-name {
  display: inline-block;
  width: 117px;
  position: relative;
  top: 11px;
  font-size: 16px;
  margin-bottom: 10px;
}
.user-menu {
  position: relative;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
  .category {
    position: absolute;
    top: 40px;
    left: 0;
    background-color: rgba(254, 248, 248, 0.96);
    width: 100%;
    padding: 40px 20px 20px;
    z-index: 10;

    .name {
      width: 130px;
      position: relative;
      padding-right: 20px;
      margin-right: 30px;
      cursor: pointer;
      .iconfont {
        font-size: 10px;
        position: absolute;
        right: 0;
        top: 3px;
        color: #282828;
      }
    }
    .sortCon {
      width: 1000px;
      .sub-item {
        margin: 0 15px 15px;
        color: #666666;
        cursor: pointer;
      }
    }
    .erSort {
      align-items: center;
    }
    .item {
      margin-bottom: 20px;
      align-items: baseline;
    }
    .moreBtn {
      color: #282828;
      font-size: 12px;
      width: 100px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #666666;
    }
  }
  .menu-main {
    width: 300px;
    height: 40px;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    .menu-item {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      color: #282828;
      padding: 0 10px;
      cursor: pointer;
      &.active {
        color: #fff;
        background: #282828;
        color: #fff;
        border-radius: 15px;
      }
    }
  }
  .menu-search {
    width: 220px;
    height: 24px;
    background-color: #fff;
    border-radius: 17px;
    .text {
      width: 175px;
    }
    input {
      border: none;
      height: 24px;
      line-height: 24px;
      color: #999999;
      padding: 0 15px;
      border-radius: 17px 0 0 17px;
      &:focus {
        border: none;
        outline: none;
      }
    }
    .bnt {
      width: 44px;
      background-color: #282828;
      color: #fff;
      border-radius: 0 17px 17px 0;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
    }
  }
}
.product_content .title {
  text-align: center;
  font-size: 18px;
  margin: 5px 0;
}
.dropdown-box {
  .el-dropdown-menu {
    z-index: 10 !important;
  }
}
.goods-detail {
  .goods-main {
    flex: 1;
    min-width: 0;
  }
  .carousel {
    .btn {
      margin-right: 30px;
      font-size: 12px;
      color: #4b4b4b;
      cursor: pointer;
      position: relative;

      .qrcode1 {
        display: none;
        box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.08);
        background: #fff;
        padding: 6px;
        position: relative;
        width: 100px;
        img {
          width: 100%;
        }

        &.contactService {
          position: absolute;
          left: 50%;
          top: 25px;
          z-index: 10;
          width: 100px;
          height: 100px;
          margin-left: -50px;
        }
      }
    }

    .contactBtn:hover {
      .qrcode1 {
        display: inline;
      }
    }

    .iconfont {
      margin-right: 6px;
      font-size: 14px;
      color: #e93323;
    }
  }

  .text-wrapper {
    flex: 1;
    min-width: 0;
    margin-left: 40px;
    width: 735px;

    .integral_count {
      display: inline-block;
      margin-top: 18px;
      color: #ff6200;
      line-height: 27px;
      background: #fff4e6;
      padding: 0 15px;
      border-radius: 2px;
    }
    .money-wrapper {
      width: 730px;
      margin-top: 6px;
      border-radius: 1px;
      color: #ffffff;
      justify-content: space-between;
      .priceBox {
        padding: 14px 0;
      }
      .prict-title {
        width: 119px;
        font-size: 14px;
        font-family: ArialMT;
        color: #666666;
        padding-left: 13px;
      }

      .vip {
        width: 100px;
        height: 25px;
        border-radius: 2px;
        margin-left: 14px;
        background: linear-gradient(205deg, #fdcaa4 0%, #fce3c3 100%);
        overflow: hidden;
        font-size: 12px;
        color: #0f0f0f;

        .iconfont {
          width: 32px;
          height: 25px;
        }

        .iconfontVip {
          width: 32px;
          height: 25px;
        }

        .money {
          flex: 1;
          min-width: 0;

          span {
            font-size: 14px;
          }
        }
      }
      .saleBox {
        .el-divider--vertical {
          height: 70px;
          background: #e93323;
          border-radius: 1px;
          opacity: 0.2;
        }
      }
      .sales {
        position: relative;
        height: 100%;
        padding-right: 20px;
        padding-left: 12px;
        font-size: 14px;
        color: #e93323;

        &::before {
          content: '';
          position: absolute;
          top: 14px;
          bottom: 12px;
          left: 0;
          width: 1px;
          border-left: 1px solid rgba(255, 255, 255, 0.24);
        }

        .num {
          margin-bottom: 3px;
          font-weight: bold;
          font-size: 20px;
        }
      }

      .timer-wrapper {
        width: 180px;
        margin-right: 15px;
        font-size: 12px;
        color: #ffffff;

        .styleAll {
          font-size: 22px;
        }
        .progress-group {
          margin-top: 10px;
        }

        .progress {
          width: 120px;
          height: 8px;
          border: 1px solid #ffffff;
          border-radius: 4px;
          font-size: 0;

          span {
            display: inline-block;
            width: 50%;
            height: 100%;
            border-radius: 4px;
            background-color: #ffffff;
          }
        }
      }
    }

    .attribute {
      .size-wrapper {
        .label {
          width: 119px;
          font-size: 14px;
          color: #5a5a5a;
          margin-right: 2px;
          word-break: break-all;
          padding-top: 2px;
          padding-left: 13px;
        }

        .list {
          flex: 1;
          min-width: 0;
        }

        .item {
          margin-bottom: 14px;
          .cont {
            border: 1px solid #d3d3d3;
          }

          &:hover {
            .cont {
              border-color: #e93323;
              color: #e93323;
            }
          }

          input:checked {
            + .cont {
              border-color: #e93323;
              color: #e93323;

              .iconfont {
                display: block;
              }
            }
          }
        }

        .image {
          width: 36px;
          height: 36px;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .name {
          padding-right: 20px;
          padding-left: 20px;
          font-size: 12px;
        }

        .iconfont {
          position: absolute;
          right: -3px;
          bottom: -3px;
          display: none;
          font-size: 22px;
        }
      }
    }
    .guaranteeList {
      margin-top: 24px !important;
    }
    .number-wrapper {
      .guaranee_tel {
        position: absolute;
        top: 20px;
        left: 0;
        background: #ffffff;
        z-index: 10;
        padding: 0 24px 24px;
        display: none;
        box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.08);
        .item {
          margin-top: 24px;
          .name {
            font-size: 16px;
            color: #000000;
          }
          .info {
            font-size: 12px;
            color: #969696;
            margin-top: 6px;
          }
        }
      }
      .icon-duoshanghupc-shuomingdanchuang {
        color: #e93323;
        font-size: 12px;
        position: relative;
      }
      .label {
        cursor: pointer;
      }
      .guaranteeAttr {
        display: inline-block;
        width: 445px;
      }
      .atterTxt1 {
        margin-bottom: 9px;
        .icon-gou {
          display: inline-block;
          font-size: 12px;
          color: #e93323;
          margin-right: 2px;
        }
      }

      .label {
        width: 119px;
        font-size: 14px;
        color: #5a5a5a;
        margin-right: 2px;
        word-break: break-all;
        padding-top: 2px;
        padding-left: 13px;
      }

      .counter-wrap {
        flex: 1;
        min-width: 0;

        span {
          vertical-align: bottom;
          font-size: 14px;
          color: #5a5a5a;
          margin-top: 9px;
          margin-left: 15px;
        }
      }

      .counter {
        button {
          border: none;
          outline: none;
          font-weight: inherit;
          font-size: 12px;
          font-family: inherit;
          vertical-align: middle;
          background: #f7f7f7;
          &:disabled {
            color: #d0d0d0;
            cursor: not-allowed;
          }
        }

        input {
          width: 64px;
          height: 36px;
          border: none;
          outline: none;
          font-weight: inherit;
          font-size: 14px;
          font-family: inherit;
          text-align: center;
          color: #5a5a5a;
          vertical-align: middle;
        }
      }
    }

    .button-wrapper {
      .btn {
        width: 150px;
        height: 50px;
        border-radius: 25px 25px 25px 25px;
        opacity: 1;
        border: 1px solid #cccccc;
        font-size: 16px;
        color: #333;
        &.btn-out {
          width: 120px;
          color: #ffffff;
          background: #d0d0d0;
        }
        &.btn-notify {
          width: 120px;
          border-color: #e93323;
          color: #e93323;
        }

        ~ .btn {
          margin-left: 18px;
        }
      }

      button {
        font-size: 16px !important;
        background: none;
        outline: none;
        vertical-align: middle;

        &:disabled {
          border-color: #ebeef5;
          color: #c0c4cc;
          cursor: not-allowed;
        }

        &.cart {
          background-color: #e93323;
          color: #ffffff;

          &:disabled {
            border-color: #fab6b6;
            background-color: #fab6b6;
          }
        }

        ~ button {
          margin-left: 18px;
        }
      }

      a {
        display: inline-block;
        background-color: #e93323;
        vertical-align: middle;
        line-height: 50px;
        text-align: center;

        &.btn {
          color: #ffffff;
        }
      }
    }
  }

  .detail-wrapper {
    margin-top: 70px;
    .detail-hd {
      .item {
        position: relative;
        padding-right: 30px;
        padding-left: 30px;
        cursor: pointer;
        line-height: 16px;

        &.on {
          color: #e93323;
          font-size: 18px;
          font-weight: 500 !important;
          //&::before {
          //  content: '';
          //  position: absolute;
          //  top: 31px;
          //  bottom: 18px;
          //  height: 2px;
          //  width: 22px;
          //  background: #e93323;
          //}
        }

        &:hover {
          color: #e93323;
        }
      }
    }

    .comment-bd {
      > img {
        width: 200px;
        margin: 50px auto;
      }

      .item {
        padding-bottom: 20px;

        .item-hd {
          .image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
          }

          img {
            display: block;
            width: 100%;
            height: 100%;
          }

          .star {
            margin-left: 12px;
            font-size: 0;
          }

          .iconfont {
            font-size: 12px;
            color: #e6e6e6;

            &.on {
              color: #e93323;
            }

            ~ .iconfont {
              margin-left: 5px;
            }
          }
        }

        .item-bd {
          border-bottom: 1px dashed #e3e3e3;
          margin-left: 52px;
          font-size: 14px;
          color: #333333;

          .image-wrapper {
            font-size: 0;
          }

          .image {
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 10px;
          }

          .reply {
            margin-top: 10px !important;
            background: #f7f7f7;
            border-radius: 6px 6px 6px 6px;
            .item {
              padding: 7px 10px;
              font-size: 14px;
              color: #333333;

              span {
                color: #e93323;
              }
            }
          }
        }
      }
    }
  }

  .nothing {
    margin-top: 100px;
    font-size: 16px;
    text-align: center;
    color: #999999;

    img {
      margin: 0 auto;
    }
  }
}
.store-favorites {
  margin-top: 20px;
  .collection {
    width: 180px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #333333;
    border: 1px solid #c8c8c8;
    border-radius: 2px;
    background: #fff;
    &.care {
      color: #e93323;
      border-color: #e93323;
    }
  }
}
</style>
