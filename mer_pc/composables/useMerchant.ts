import {couponReceiveApi, getMerCollectAddApi, getMerCollectCancelApi} from '~/server/merchantApi'
import {ref} from "vue";

export default function useMerchant() {
  //店铺关注
  const onfollowMerchant = (merId: number) => {
    return new Promise((resolve, reject) => {
      getMerCollectAddApi(merId).then(() => {
        feedback.msgSuccess('关注店铺成功')
        //linkNavigateTo(`/users/order_list`, { type: 1 })
        return resolve()
      })
    })
  }

  //店铺取消关注
  const onUnfollowMerchant = (merId: number) => {
    return new Promise((resolve, reject) => {
      feedback.confirm('确认取消关注吗？').then(async () => {
        await getMerCollectCancelApi(merId).then(() => {
          //linkNavigateTo(`/users/order_list`, { type: 1 })
          return resolve()
        })
      })
    })
  }

  //领取优惠券
  const loading = ref<boolean>(false)
  const onReceiveCoupon = (couponId: number) => {
    loading.value = true
    return new Promise(async(resolve, reject) => {
      try {
        await couponReceiveApi(couponId)
        feedback.msgSuccess('领取成功')
        return resolve()
        loading.value = false
      } catch (e) {
        loading.value = false
      }
    })
  }
  return {
    onfollowMerchant,
    onUnfollowMerchant,
    onReceiveCoupon
  }
}
