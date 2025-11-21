<template>
  <div class="address h-100%">
    <div class="flex-between-center mb-37px">
      <div>
        <span class="font18 fontColor333 mr-10px">收货地址({{ addressList.length }})</span>
        <span class="text-12px text-#666">最多可添加10条</span>
      </div>
      <div v-if="addressList.length<10" class="handleBtn w-86px h-30px lh-29px cursors" style="font-size: 14px" @click="handleAddAddress">添加地址</div>
    </div>
    <div v-loading="listLoading" class="h-82%">
      <div v-if="addressList.length">

          <div
              v-for="item in addressList"
              :key="item.id"
              class="mb-20px flex-between-center b-rd-16px w-960px h-106px bg-#FAFAFA px-20px py-20px"
          >
            <div class="text-14px text-#666">
              <div class="mb-10px">
                <span class="w-70px inline-block mr-6px">收货人：</span>{{ item.realName }}
              </div>
              <div class="mb-10px">
                <span class="w-70px inline-block mr-6px">联系电话：</span>{{ item.phone }}
              </div>
              <div class="w-815px line1">
              <span class="w-70px inline-block mr-6px"
              >收货地址：</span
              >{{ item.province }}{{ item.city }}{{ item.district }}{{item.street}}{{ item.detail }}
              </div>
            </div>
            <div>
              <div class="mb-34px text-right">
              <span class="iconfont icon-bianji mr-14px cursors" @click="handleEditAddress(item.id)"></span
              ><span class="iconfont icon-shanchu cursors" @click="handleDelAddress(item.id)"></span>
              </div>
              <el-radio-group v-model="defaultId" @change="handleChecked">
                <el-radio :label="item.id" size="large">
                  <div class="text-14px text-#666">{{item.isDefault?'默认地址':'设为默认地址'}}</div>
                </el-radio>
              </el-radio-group>
            </div>
          </div>

      </div>
      <div v-else class="w-100% h-100%">
        <empty-page title="暂无地址信息呦~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wudizhi.png">
          </template>
        </empty-page>
      </div>
    </div>
    <!--地址弹窗-->
    <add-address
      ref="userAddAddressRef"
      :addressInfo="addressInfo"
      :isShowDialog="dialogVisible"
      @handleSubmitAddress="handleSubmitAddress"
      v-if="dialogVisible"
      @handleSubmitClose="handleSubmitClose"
      :selAddressData="selAddressData"
    ></add-address>
  </div>
</template>

<script lang="ts" setup>
import {addressListApi, setAddressDefaultApi, addressDelApi, addressDetailApi} from '~/server/userApi'
import feedback from '~/utils/feedback'
import { ref, reactive } from 'vue'
import { AddressInfo } from '~/types/user'
import { addressDefault } from '~/pages/users/defaultUser'

//地址列表
const { data: addressList, pending: listLoading, refresh } = await useAsyncData(async () => addressListApi())
//默认地址选中的值
const defaultId = ref<number>(0)
const getIsDefault = () => {
  let data = addressList.value.find((item: any) => item.isDefault)
  defaultId.value = data?.id
}
getIsDefault()

/**
 * 设置默认地址
 */
const handleChecked = async () => {
  await setAddressDefaultApi(defaultId.value)
  await feedback.msgSuccess('设置默认地址成功')
  await refresh()
}

//地址弹窗
const { bool: dialogVisible, DialogOpen, DialogClose } = useDialog()

//添加地址
const handleAddAddress = async () => {
  Object.assign(addressInfo, addressDefault())
  selAddressData.value = []
  DialogOpen()
}

//关闭弹窗
const handleSubmitClose = () => {
  DialogClose()
}

//删除
const handleDelAddress = async (id:number) => {
  await feedback.confirm('确认删除该地址吗？')
  await addressDelApi(id)
  await refresh()
}

//提交地址
const handleSubmitAddress = async () => {
  await refresh()
  await DialogClose()
  await getIsDefault()
}

//编辑地址
const addressInfo = reactive<AddressInfo>(addressDefault())
const selAddressData = ref<any[]>([]) //选中的地址数组
const handleEditAddress = async (id: number) => {
  let info =await addressDetailApi(id)
  Object.assign(addressInfo, info)
  selAddressData.value = [
    {
      regionName: info.province,
      parentId: 1,
      isChild: true,
      regionId: info.provinceId,
      regionType: 1,
    },
    {
      regionName: info.city,
      parentId: info.provinceId,
      regionId: info.cityId,
      isChild: true,
      regionType: 2,
    },
    {
      regionName: info.district,
      parentId: info.cityId,
      regionId: info.districtId,
      isChild: true,
      regionType: 3,
    },
    {
      isChild: false,
      parentId: info.districtId,
      regionName: info.street,
      regionType: 4,
    },
  ]
  DialogOpen()
}


</script>

<style lang="scss" scoped>
@import '@/assets/scss/checkbox.scss';
:deep(.el-radio.el-radio--large .el-radio__inner){
  width: 18px !important;
  height: 18px !important;
}
:deep(.el-radio) {
  height: 0 !important;
}
</style>
