import { ItemObject, ItemObjectNumber, PageQuery } from '~/types/global'
import { productReplyConfigApi, replyListApi } from '~/server/goodsApi'
import { reactive } from 'vue'

export default function useProductDetail() {
  const seckillStatus = ref<number>(0)
  const seckillTime = ref<number>(0)

  //秒杀时间，状态
  const getSeckillInfo = (data: any, routeQuery: ItemObject) => {
    let startTimeStamp = data.startTimeStamp //秒杀开始结束时间戳
    let endTimeStamp = data.endTimeStamp
    if (!routeQuery.datatime) {
      let newTime = Date.parse(new Date())
      if (Number(newTime) < Number(startTimeStamp)) {
        seckillTime.value = Number(startTimeStamp) / 1000
        seckillStatus.value = 2
      } else if (Number(newTime) < Number(endTimeStamp)) {
        seckillTime.value = Number(endTimeStamp) / 1000
        seckillStatus.value = 1
      } else {
        seckillTime.value = 0
        seckillStatus.value = 0
      }
    } else {
      seckillStatus.value = Number(routeQuery.seckillStatus)
      seckillTime.value = Number(routeQuery.datatime)
    }
  }

  //评论数据
  const replyInfo = reactive({})
  const productReplyConfig = async (id: number) => {
    let data = await productReplyConfigApi(id)
    Object.assign(replyInfo, data)
  }

  //评论列表
  const replyList = ref<any[]>([])
  const getReplyList = async (where: ItemObjectNumber, id: number) => {
    replyList.value = await replyListApi(id, where)
  }
  return {
    getSeckillInfo,
    seckillStatus,
    seckillTime,
    productReplyConfig,
    replyInfo,
    getReplyList,
    replyList,
  }
}
