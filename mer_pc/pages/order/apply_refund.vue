<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAppStore } from '~/stores/app'
import { ProductInfo, RefundApplyFrom } from '~/types/order'
import { Mul, Div } from '~/utils/util'
const { handleIntoPage } = useOrder()

//退款表单
const refundPrice = ref<number>(0) //退款金额
const applyForm = reactive<RefundApplyFrom>(Object.assign(defaultRefundApply()))
//订单退款理由
const refundReason = ref<string[]>([])
const getRefundReason = async () => {
  refundReason.value = await refundReasonApi()
  applyForm.text = refundReason.value[0]
}
getRefundReason()

watch(
  () => <number>applyForm.num,
  (newValue) => {
    let price = Div(applyRefundProInfo.payPrice, applyRefundProInfo.payNum)
    if (applyForm.num) {
      refundPrice.value = Mul(price, newValue).toFixed(2)
    } else {
      refundPrice.value = ''
    }
  },
)

//售后类型选择
const onChangeAfterSalesType = () => {
  if (applyForm.afterSalesType === 1) {
    applyForm.returnGoodsType = 0
  } else {
    applyForm.returnGoodsType = 1
  }
}

// 商品信息
const useStore = useAppStore()
const applyRefundProInfo = reactive<ProductInfo>(<ProductInfo>useStore.evaluationInfo)
applyForm.num = applyRefundProInfo.payNum - (applyRefundProInfo.applyRefundNum + applyRefundProInfo.refundNum)

//上传图片回调
const pics = ref<string[]>([])
const handleComplete = (res: UploadImageData) => {
  pics.value.push(res.url)
}

//删除图片成功回调
const handleRemoveComplete = (idx: number) => {
  pics.value.splice(idx, 1)
}

/**
 * 表单提交
 */
import type { FormInstance, FormRules } from 'element-plus'
import { UploadImageData } from '~/types/global'
import { defaultRefundApply } from '~/pages/order/defaultOrder'
import { refundApplyApi, refundReasonApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
const replyFormRef = ref<FormInstance>()
const isLoading = ref<boolean>(false)
const rules: FormRules = {
  text: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
  num: [{ required: true, message: '请填写退款件数', trigger: 'change' }],
}
const successInfo = reactive({
  title: '申请成功',
  tips: '',
  url: '/users/refund_list',
  type: 9,
})
const successDialogRef = shallowRef() //成功弹窗
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      isLoading.value = true
      applyForm.orderNo = applyRefundProInfo.orderNo
      applyForm.orderDetailId = applyRefundProInfo.id
      applyForm.reasonImage = pics.value.join(',')
      try {
        await refundApplyApi(applyForm)
        isLoading.value = false
        successDialogRef.value.open()
      } catch (err) {
        isLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

//返回列表页回调
const handleSubmitSuccess = async () => {
  await Object.assign(applyForm, defaultRefundApply())
}
</script>

<template>
  <div class="wrapper_1200">
    <page-header title="申请退款"></page-header>
    <div class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px mbtom20">
      <div
        @click.stop="handleIntoPage('/merchant/merchant_home', { merId: applyRefundProInfo.merId })"
        class="acea-row mb-30px cursors"
      >
        <div v-if="applyRefundProInfo.merIsSelf">
          <span
            class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
            style="top: -2px"
            >自营</span
          >
        </div>
        <div class="text-#333 text-14px font-400 oppoSans-R">{{ applyRefundProInfo.merName }}</div>
      </div>
      <confirm-product :list="applyRefundProInfo"></confirm-product>
      <div class="borderBotDas"></div>
      <el-form ref="replyFormRef" :model="applyForm" label-width="130px" :rules="rules">
        <div class="cont mt-20px">
          <el-form-item label="售后类型：" required>
            <el-radio-group v-model="applyForm.afterSalesType" @change="onChangeAfterSalesType">
              <el-radio :label="1">仅退款</el-radio>
              <el-radio :label="2">退货退款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="applyForm.afterSalesType === 2" label="退货方式：" required>
            <el-select
              v-if="applyForm.afterSalesType === 1"
              v-model="applyForm.returnGoodsType"
              placeholder="请选择退货方式"
              class="w-540px"
            >
              <el-option label="不退货" :value="0" />
            </el-select>
            <el-select v-else v-model="applyForm.returnGoodsType" placeholder="请选择退货方式" class="w-540px">
              <el-option label="快递退回" :value="1" />
              <el-option label="到店退货" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="退款件数：" class="fontSize" prop="num">
            <el-input-number
              v-model="applyForm.num"
              :min="1"
              :step="1"
              step-strictly
              :max="applyRefundProInfo.payNum - (applyRefundProInfo.applyRefundNum + applyRefundProInfo.refundNum)"
              placeholder="请填写退款件数"
              style="width: 540px"
              :disabled="applyRefundProInfo.groupBuyActivityId > 0"
            /><span class="ml-10px text-14px text-#999 font-400 oppoSans-R"
              >最多可申请{{
                applyRefundProInfo.payNum - (applyRefundProInfo.applyRefundNum + applyRefundProInfo.refundNum)
              }}件</span
            >
          </el-form-item>
          <el-form-item label="预计退款金额：" class="fontSize" required>
            <el-input disabled v-model="refundPrice" style="width: 540px" class="text-center">
              <template #prefix> ￥ </template>
            </el-input>
          </el-form-item>
          <el-form-item label="退款原因：" prop="text">
            <el-select v-model="applyForm.text" placeholder="请选择退款原因" class="w-540px">
              <el-option :label="item" :value="item" v-for="item in refundReason" :key="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注说明：">
            <el-input
              type="textarea"
              v-model="applyForm.explain"
              style="width: 540px"
              class="text-center"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传凭证：" class="fontSize">
            <div class="img-box-wrapper">
              <upload-from
                @handleComplete="handleComplete"
                @handleRemoveComplete="handleRemoveComplete"
                :pictureList="[]"
                :limitNum="6"
              ></upload-from>
              <div class="text-14px text-#999">图片最多可上传6张</div>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button color="#E93323" round type="primary" @click="submitForm(replyFormRef)" :loading="isLoading"
            >立即申请</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <success-dialog
      ref="successDialogRef"
      @handleSubmitSuccess="handleSubmitSuccess"
      :successInfo="successInfo"
    ></success-dialog>
  </div>
</template>

<style scoped lang="scss">
//星级
:deep(.el-rate) {
  height: auto !important;
  --el-rate-icon-margin: 0 !important;
  --el-rate-fill-color: #e93323 !important;
  --el-rate-icon-size: 20px !important;
}
:deep(.el-rate__item) {
  margin-right: 4px;
}
:deep(.el-dialog__body) {
  img {
    width: 100%;
  }
}
:deep(.el-upload),
:deep(.el-upload-list__item) {
  width: 100px !important;
  height: 100px !important;
}
</style>
