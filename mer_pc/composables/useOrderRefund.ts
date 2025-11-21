import {orderTakeDeliveryApi, refundRevokeApi} from "~/server/orderApi";
import {linkNavigateTo} from "~/utils/util";

export default function useOrderRefund() {
    //撤销售后
    const onRevokeRefund = (refundOrderNo: string) => {
        return new Promise((resolve, reject) => {
            feedback.confirm('确定要撤销本次退款申请吗？').then(async () => {
                await refundRevokeApi(refundOrderNo).then(async () => {
                    await feedback.msgSuccess('撤销成功')
                    return resolve()
                })
            })
        })
    }
    return{
        onRevokeRefund
    }
}