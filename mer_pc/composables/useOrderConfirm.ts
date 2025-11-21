import {ref, reactive} from "vue";
import {addressDefault} from "~/pages/users/defaultUser";
import {AddressInfo} from "~/types/order";
import {defaultAddressInfo} from "~/pages/order/defaultOrder";

export default function useOrderConfirm() {
    const selAddressData = ref<any[]>([]) //选中的地址数组
    const dialogVisibleAddress = ref<boolean>(false)
    const addressInfo = reactive<AddressInfo>(defaultAddressInfo())
    const userAddAddressRef = shallowRef()
    const handleAddAddress =async () =>{
        Object.assign(addressInfo, addressDefault())
        selAddressData.value = []
        dialogVisibleAddress.value = true
    }
    return {
        handleAddAddress
    }
}