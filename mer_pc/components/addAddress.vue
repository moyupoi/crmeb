<!--地址弹窗页面-->
<script lang="ts" setup>
import { getCityListApi, addressAddApi, addressEditApi } from '~/server/userApi'
import feedback from '~/utils/feedback'
import { ref, reactive, watch, toRefs } from 'vue'
import { AddressInfo } from '~/types/user'
import { addressDefault } from '~/pages/users/defaultUser'

const props = defineProps({
  //编辑数据
  addressInfo: {
    type: Object,
    default: null,
  },
  //选中的地址数组
  selAddressData: {
    type: Array,
    default: [],
  },
  //模态框状态
  isShowDialog: {
    type: Boolean,
    default: false,
  },
})
const { addressInfo, selAddressData, isShowDialog } = toRefs(props)

const dialogVisibleAddress = computed({
  get: () => isShowDialog?.value,
  set: (value) => {},
})

//地址选择框显示状态
const isShowSelect = ref(false)
//按钮加载状态
const loading = ref(false)
//地址加载状态
const loadingAddress = ref(false)
//选择的省市区
const selectedAddress = ref<any[]>([])
//地址选择索引
const selectedIndex = ref<number>(0)
// 城市数据
const cityData = reactive({
  parentId: 0,
  step: 1,
  list: [],
})

//表单提交默认数据

watch(
  () => selAddressData,
  (value) => {
    selectedAddress.value = value?.value
  },
  {
    immediate: true,
  },
)

//表单提交数据
const formData = reactive<AddressInfo>(addressInfo ? Object.assign(addressInfo.value) : addressDefault())

const { DialogOpen, DialogClose } = useDialog()
// 打开
defineExpose({ DialogOpen })

//选择开启地址弹窗
const handleChangeAddress = async () => {
  isShowSelect.value = !isShowSelect.value
  await getCityList(1, 1)
}

//点击选择已经选择的省市区 进行重选
const handleChangeProvince = async (item: any, index: number) => {
  cityData.list = []
  isShowSelect.value = !isShowSelect.value
  if (index == selectedIndex.value) {
    return
  }
  await getCityList(item.parentId, item.regionType)
  selectedIndex.value = index
}

// 城市列表数据
const CACHE_ADDRESS = reactive<any>({})
const getCityList = async (parentId: number, regionType: any) => {
  if (CACHE_ADDRESS[parentId]) {
    cityData.list = CACHE_ADDRESS[parentId]
    return
  }
  isShowSelect.value = true
  loadingAddress.value = true
  await getCityListApi({ parentId: parentId, regionType: regionType })
    .then(async (result: any) => {
      CACHE_ADDRESS[parentId] = result
      cityData.list = result
      loadingAddress.value = false
    })
    .catch(async (err: any) => {
      loadingAddress.value = false
    })
}

//点击选择加载出的城市数据，选择省市区
const handleChangeCity = async (item: object) => {
  if (selectedIndex.value > -1) {
    selectedAddress.value.splice(selectedIndex.value + 1, 999)
    selectedAddress.value[selectedIndex.value] = item
    selectedIndex.value = -1
  } else if (item.regionType === 1) {
    selectedAddress.value = [item]
  } else {
    selectedAddress.value.push(item)
  }
  if (item.isChild) {
    await getCityList(item.regionId, item.regionType + 1)
  } else {
    isShowSelect.value = false
  }
}

//获取省市区的提交数据
const getData = () => {
  formData.province = getAddressVal(0)?.regionName
  formData.provinceId = getAddressVal(0)?.regionId
  formData.city = getAddressVal(1)?.regionName
  formData.cityId = getAddressVal(1)?.regionId
  formData.district = getAddressVal(2)?.regionName
  formData.districtId = getAddressVal(2)?.regionId
  formData.street = getAddressVal(3)?.regionName
}
const getAddressVal = (num: number) => {
  return selectedAddress.value[num]
}

const validate = () => {
  if (!formData.realName) {
    return feedback.msgWarning('请填写姓名')
  }
  if (!formData.phone || !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(formData.phone)) {
    return feedback.msgWarning('请填写正确的手机号码')
  }
  if (!selectedAddress.value.length) {
    return feedback.msgWarning('请选择省市区')
  }
  if (!formData.detail) {
    return feedback.msgWarning('请填写详细地址')
  }
}
//保存提交
const handleSubmit = async () => {
  if (!formData.realName) {
    return feedback.msgWarning('请填写姓名')
  }
  if (!formData.phone || !/^1(3|4|5|7|8|9|6)\d{9}$/i.test(formData.phone)) {
    return feedback.msgWarning('请填写正确的手机号码')
  }
  if (!selectedAddress.value.length) {
    return feedback.msgWarning('请选择省市区')
  }
  if (!formData.detail) {
    return feedback.msgWarning('请填写详细地址')
  }
  await getData()
  loading.value = true
  await handlerSave()
}
const handlerSave=async ()=>{
  let addressId = 0
  try {
    loading.value = true
    if (formData.id > 0) {
      addressId = await addressEditApi(formData)
    } else {
      addressId = await addressAddApi(formData)
    }
    feedback.msgSuccess('提交成功')
    loading.value = true
    dialogVisibleAddress.value = false
    await handleEmit(addressId)
  } catch (err) {
    loading.value = false
  }
}

const handleEmit = (addressId: number) => {
  emit('handleSubmitAddress', addressId)
}
const emit = defineEmits(['handleSubmitAddress', 'handleSubmitClose'])
//取消
const handleClose = async () => {
  emit('handleSubmitClose')
  isShowSelect.value = false
  loading.value = false
}
</script>

<template>
  <el-dialog
    class="user-login-dialog"
    v-model="dialogVisibleAddress"
    :align-center="true"
    width="690px"
    :append-to-body="true"
    :show-close="false"
    :title="formData.id > 0 ? '编辑收货地址' : '添加收货地址'"
    center
    :close-on-click-modal="false"
  >
    <div class="form-box">
      <div class="input-item mbtom20" style="width: 48%; display: inline-block">
        <el-input class="iptHeight" v-model="formData.realName" maxlength="25" placeholder="姓名"></el-input>
      </div>
      <div class="input-item mbtom20" style="width: 48%; display: inline-block; margin-left: 3%">
        <el-input class="iptHeight" v-model="formData.phone" placeholder="手机号"></el-input>
      </div>
      <div class="input-item text-wrapper mbtom20">
        <div @click="handleChangeAddress" v-if="!selectedAddress.length">请选择省/市/区/街道</div>
        <div v-if="selectedAddress.length" style="color: #333">
          <span v-for="(item, index) in selectedAddress" class="mr-7px" @click="handleChangeAddress" :key="index">
            {{ item.regionName }}
          </span>
        </div>
        <div class="select-wrapper" v-if="isShowSelect">
          <div class="borderBotSol" v-loading="loadingAddress">
            <div class="acea-row borderBotSol">
              <div
                class="title-box acea-row"
                @click="handleChangeProvince(item, index)"
                v-for="(item, index) in selectedAddress"
                :key="index"
              >
                {{ item.regionName ? item.regionName : '请选择' }}
                <span v-if="index !== selectedAddress.length - 1" class="ml-2px mr-2px">/</span>
              </div>
            </div>
            <div class="label-txt">
              <span
                v-for="(item, index) in cityData.list"
                :key="index"
                @click.stop="handleChangeCity(item)"
                :class="{ on: cityData.parentId == item.regionId }"
                >{{ item.regionName }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="input-item mbtom20">
        <el-input type="textarea" rows="3" v-model="formData.detail" placeholder="详细地址"></el-input>
      </div>
      <div class="input-item">
        <el-checkbox v-model="formData.isDefault">设为默认</el-checkbox>
      </div>
    </div>
    <template #footer class="dialog-footer">
      <span class="dialog-footer">
        <el-button size="large" @click="handleClose" round>取 消</el-button>
        <el-button size="large" color="#E93323" @click="handleSubmit" round :loading="loading">保 存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.iptHeight {
  height: 50px;
}
.text-wrapper {
  position: relative;
  height: 40px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 4px;
  color: #cfcfcf;
  .select-wrapper {
    z-index: 10;
    position: absolute;
    left: 0;
    top: 45px;
    width: 100%;
    padding: 0 15px;
    background: #fff;
    border: 1px solid #e93323;
    border-radius: 4px;
    line-height: 2;
    .title-box {
      height: 40px;
      line-height: 40px;
      color: #e93323;
      font-size: 14px;
    }
    .label-txt {
      margin: 8px 0 8px;
      color: #666666;
      font-size: 14px;
      span {
        margin-right: 10px;
        cursor: pointer;
        &.on {
          color: #e93323;
        }
      }
    }
  }
}
</style>
