<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { expressAllApi, refundApplyApi, refundReturningGoodsApi } from '~/server/orderApi'
import { Debounce } from '~/utils/util'
import { useAppStore } from '~/stores/app'
import { merchantAddressApi } from '~/server/merchantApi'
import { ItemObject } from '~/types/global'

const ruleFormRef = ref<FormInstance>()

const props = defineProps({
  //模态框状态
  isShowDialog: {
    type: Boolean,
    default: false,
  },
  //退回状态 退货类型：0-不退货 1-快递退回，2-到店退货
  returnGoodsType: {
    type: Number,
    default: 0,
  },
  //退款单号
  refundOrderNo: {
    type: String,
    default: '',
  },
  //商户id
  merId: {
    type: Number,
    default: 0,
  },
  //商户信息，退款单详情页传来使用
  merchantAddressDetail: {
    type: Object,
    default: null,
  },
})
const { isShowDialog, refundOrderNo, returnGoodsType, merId, merchantAddressDetail } = toRefs(props)

const dialogVisible = computed({
  get: () => isShowDialog?.value,
  set: (value) => {},
})

//商户信息
const merchantAddress = reactive<ItemObject>({})
if (returnGoodsType?.value === 2 && !merchantAddressDetail?.value) {
  let data = await merchantAddressApi(merId.value)
  Object.assign(merchantAddress, data)
} else {
  Object.assign(merchantAddress, merchantAddressDetail?.value)
}

//获取全部物流公司
const useApp = useAppStore()
const expressList = ref([])
const { getExpressList } = useAppStore()
const getExpressAll = async () => {
  expressList.value = await expressAllApi()
  await getExpressList(expressList.value)
}
if (!useApp.stateExpressAll.length) {
  getExpressAll()
} else {
  expressList.value = useApp.stateExpressAll
}

const returningGoodsForm = reactive({
  refundOrderNo: refundOrderNo.value,
  telephone: '',
  expressName: '',
  trackingNumber: '',
})
const emit = defineEmits(['handleSubmitClose', 'handleSubmitSuccess'])
// 手机号码验证
import { useSmsCode } from '~/composables/verifyCode'
const { checkPhone } = useSmsCode()
const rules: FormRules = {
  expressName: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  trackingNumber: [{ required: true, message: '请填写物流单号', trigger: 'blur' }],
  telephone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
}
const isLoading = ref<boolean>(false)
const submitForm = Debounce((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      isLoading.value = true
      try {
        await refundReturningGoodsApi(returningGoodsForm)
        isLoading.value = false
        dialogVisible.value = false
        emit('handleSubmitSuccess')
      } catch (err) {
        isLoading.value = false
        dialogVisible.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}, 500)

//取消

const handleCancellation = () => {
  emit('handleSubmitClose')
}
</script>

<template>
  <el-dialog
    class="user-login-dialog"
    v-model="dialogVisible"
    :align-center="true"
    width="690px"
    :append-to-body="true"
    :show-close="false"
    title="退回商品"
    center
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="returningGoodsForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
      status-icon
      size="large"
    >
      <el-form-item label="退货方式" required>
        <el-input :value="returnGoodsType === 1 ? '快递退回' : '到店退货'" disabled style="width: 530px" />
      </el-form-item>
      <el-form-item v-if="returnGoodsType === 1" label="物流公司" prop="expressName">
        <el-select
          filterable
          v-model="returningGoodsForm.expressName"
          placeholder="请选择物流公司"
          style="width: 530px"
        >
          <el-option v-for="item in expressList" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="returnGoodsType === 1" label="物流单号" prop="trackingNumber">
        <el-input v-model="returningGoodsForm.trackingNumber" style="width: 530px" />
      </el-form-item>
      <el-form-item v-else label="店铺信息">
        <div class="w-530px h-78px bg-#f5f7fa b-rd-6px px-20px py-20px" style="border: 1px solid #dcdfe6">
          <div class="text-14px line-heightOne text-#333333 font-500 oppoSans-M mb-10px">
            {{ merchantAddress.name }} <span class="ml-9px">{{ merchantAddress.phone }}</span>
          </div>
          <div class="text-14px line-heightOne text-#333333 font-400 oppoSans-R">
            {{ merchantAddress.addressDetail }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="returningGoodsForm.telephone" style="width: 530px" />
      </el-form-item>
      <el-form-item class="submit">
        <div class="m-auto">
          <el-button class="w-120px" round @click="handleCancellation">取消</el-button>
          <el-button
            class="w-120px"
            color="#E93323"
            round
            type="primary"
            @click="submitForm(ruleFormRef)"
            :loading="isLoading"
            >提交</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.submit {
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
  :deep(.el-button + .el-button) {
    margin-left: 20px !important;
  }
}
</style>
