import { linkNavigateTo } from '~/utils/util'
import { cartBatchAddApi, orderCancelApi, orderDeleteApi, orderTakeDeliveryApi, preOrderApi } from '~/server/orderApi'
import { CartBatchAdd } from '~/types/order'
import { ItemObject } from '~/types/global'
import { cartCountApi } from '~/server/goodsApi'
import { useAppStore } from '~/stores/app'
import { ProductMarketingTypeEnum, ProductTypeEnum } from '@/enums/productEnums'
import { indexCustomerServiceApi } from '~/server/homeApi'
import feedback from '~/utils/feedback'

export default function useOrder() {
  //预下单
  const getPreOrder = (preOrderType: string, orderDetails: any, seckillStatus?: number, datatime?: number) => {
    return preOrderApi({
      preOrderType: preOrderType,
      orderDetails: orderDetails,
    }).then((result: any) => {
      linkNavigateTo(`/order/order_confirm`, {
        orderNo: result.orderNo,
        seckillStatus: seckillStatus,
        datatime: datatime,
      })
    })
  }

  //确认收货
  const onConfirmOrder = (orderNo: string) => {
    return new Promise((resolve, reject) => {
      feedback.confirm('为保障权益，请收到货确认无误后，再确认收货').then(async () => {
        await orderTakeDeliveryApi(orderNo).then(async () => {
          await linkNavigateTo(`/users/order_list`, { type: 1 })
          await feedback.msgSuccess('收货成功')
          return resolve()
        })
      })
    })
  }

  //再次购买
  const onByAgain = (cartListRequest: Array<CartBatchAdd>) => {
    return cartBatchAddApi(cartListRequest).then(() => {
      linkNavigateTo(`/order/shopping_cart`, { type: 0 })
    })
  }

  //删除订单
  const onDeleteOrder = (orderNo: string) => {
    return new Promise((resolve, reject) => {
      feedback.confirm('确认删除订单吗？').then(async () => {
        await orderDeleteApi(orderNo).then(async () => {
          await linkNavigateTo(`/users/order_list`, { type: 1 })
          await feedback.msgSuccess('删除成功')
          return resolve()
        })
      })
    })
  }

  //取消订单
  const onCancelOrder = (orderNo: string) => {
    return new Promise((resolve, reject) => {
      feedback.confirm('确认取消订单吗？').then(async () => {
        await orderCancelApi(orderNo).then(async () => {
          await linkNavigateTo(`/users/order_list`, { type: 1 })
          await feedback.msgSuccess('取消成功')
          return resolve()
        })
      })
    })
  }

  //跳转商品详情
  const handlerProDetailLink = async (id: number, marketingType: number, seckillStatus?: number, datatime?: number) => {
    await linkNavigateTo(`/product/detail`, {
      id: id,
      marketingType: marketingType,
      seckillStatus: seckillStatus,
      datatime: datatime,
    })
  }

  //客服配置
  const chatConfig = async (chatConfig: ItemObject) => {
    switch (chatConfig.serviceType) {
      case 'H5':
      case 'h5':
        window.open(chatConfig.serviceLink)
        break
      case 'phone':
      case 'hotline':
        feedback.confirm(`联系电话${chatConfig.servicePhone}`)
        break
    }
  }

  //购物车数量
  const cartCount = ref<number>(0)
  const useStore = useAppStore()
  const onGetCartCount = async () => {
    try {
      let data = await cartCountApi({ numType: true, type: 'total' })
      useStore.getCarNumber(data.count)
    } catch (e) {
      useStore.getCarNumber(0)
    }
  }

  // 跳入页面
  const handleIntoPage = async (url: string, params: ItemObject) => {
    await linkNavigateTo(url, params)
  }

  //是否可以再次购买
  const isBuyAgain = (orderInfo) => {
    return orderInfo.type === ProductMarketingTypeEnum.Normal && orderInfo.secondType === ProductTypeEnum.Normal
  }

  // 普通商品、秒杀、拼团、虚拟（开启可申请退款开关）、视频号可申请退款,
  const isRefund = (orderInfo, item) => {
    return (
      orderInfo.status > 0 &&
      orderInfo.status < 6 &&
      (orderInfo.secondType === ProductTypeEnum.Normal ||
        (orderInfo.secondType === ProductTypeEnum.Fictitious && item.proRefundSwitch) ||
        orderInfo.secondType === ProductTypeEnum.Video)
    )
  }

  // 退款状态3为已退款的判断
  const isRefunded = (item: any) => {
    return item.refundStatus === 3
  }

  /**
   * 对象转数组
   * @param data 对象
   * @returns {*[]}
   */
  const objToArr = (data) => {
    let obj = Object.keys(data).sort()
    let m = obj.map((key) => data[key])
    return m
  }

  /**
   * 时间转换
   * @param date
   * @param fmt
   */
  const formatDate = (date, fmt) => {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
      }
    }
    return fmt
  }
  const padLeftZero = (str) => {
    return ('00' + str).substr(str.length)
  }

  //平台客服
  // const { data: indexCustomerService } = useAsyncData(() => indexCustomerServiceApi())
  //const { chatConfig } = useOrder()
  const getPlatChatConfig = async () => {
    try {
      let indexCustomerService = await indexCustomerServiceApi()
      let chatConfigData = {
        serviceLink: indexCustomerService?.consumerH5Url,
        servicePhone: indexCustomerService?.consumerHotline,
        serviceType: indexCustomerService?.consumerType,
      }
      await chatConfig(chatConfigData)
    } catch (e) {}
  }
  return {
    getPreOrder,
    onConfirmOrder,
    onByAgain,
    onDeleteOrder,
    onCancelOrder,
    handlerProDetailLink,
    onGetCartCount,
    cartCount,
    chatConfig,
    handleIntoPage,
    isBuyAgain,
    isRefund,
    objToArr,
    formatDate,
    getPlatChatConfig,
    isRefunded,
  }
}
