<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAppStore } from '~/stores/app'
import { NavigateToTitle, ProductInfo, ReplyProductFrom } from '~/types/order'
const { handleIntoPage } = useOrder()

//获取浏览器值
const route = useRoute()
const orderNo = ref<string>(<string>route.query.orderNo) //订单号
const page = ref<string>(<string>route.query.page)

// 商品信息
const useStore = useAppStore()
const evaluationInfo = reactive<ProductInfo>(<ProductInfo>useStore.evaluationInfo)

//上传图片回调
const handleComplete = (res: UploadImageData) => {
  replyForm.pics.push(res.url)
}

//删除图片成功回调
const handleRemoveComplete = (idx: number) => {
  replyForm.pics.splice(idx, 1)
}

/**
 * 表单提交
 */
import type { FormInstance, FormRules } from 'element-plus'
import { UploadImageData } from '~/types/global'
import { defaultReplyProduct } from '~/pages/order/defaultOrder'
import feedback from '~/utils/feedback'
import { orderReplyApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
const replyFormRef = ref<FormInstance>()
const replyForm = reactive<ReplyProductFrom>(Object.assign(defaultReplyProduct()))
const isLoading = ref<boolean>(false)
const rules: FormRules = {
  star: [{ required: true, message: '请选择星级', trigger: 'change' }],
  comment: [{ required: true, message: '请填写评论内容', trigger: 'blue' }],
}
const successInfo = reactive({
  title: '评价成功',
  tips: '感谢您的用心反馈，我们会继续改进~',
  url: '/users/evaluation_list',
  type: 2,
})
const successDialogRef = shallowRef() //成功弹窗
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      isLoading.value = true
      replyForm.orderNo = orderNo.value
      replyForm.orderDetailId = evaluationInfo.id
      try {
        await orderReplyApi(replyForm)
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
  await Object.assign(replyForm, defaultReplyProduct())
}

const navigateToTitle = reactive<NavigateToTitle>({
  title: '评价晒单',
  linkUrl: '/users/evaluation_list',
  params: { type: 2, page: page.value, name: '评价晒单' },
})
</script>

<template>
  <div class="wrapper_1200">
    <page-header title="商品评价" :navigateToTitle="navigateToTitle"></page-header>
    <div class="w-100% borRadius bg-#FFF pt-30px pb-20px px-30px mbtom20">
      <div
        @click.stop="handleIntoPage('/merchant/merchant_home', { merId: evaluationInfo.merId })"
        class="acea-row mb-30px cursors"
      >
        <div v-if="evaluationInfo.merIsSelf">
          <span
            class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
            style="top: -2px"
            >自营</span
          >
        </div>
        <div class="fontColor333 text-14px">{{ evaluationInfo.merName }}</div>
      </div>
      <confirm-product :list="evaluationInfo"></confirm-product>
      <div class="borderBotDas"></div>
      <el-form ref="replyFormRef" :model="replyForm" label-width="100px" :rules="rules">
        <div class="cont mt-20px">
          <el-form-item label="商品评分：" class="fontSize" prop="star">
            <el-rate v-model="replyForm.star"></el-rate>
          </el-form-item>
          <el-form-item label="评论内容：" class="fontSize" prop="comment">
            <el-input
              type="textarea"
              placeholder="请填写评论内容"
              :autosize="{ minRows: 4 }"
              maxlength="100"
              v-model="replyForm.comment"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传照片：" class="fontSize">
            <div class="img-box-wrapper">
              <upload-from
                @handleComplete="handleComplete"
                @handleRemoveComplete="handleRemoveComplete"
                :pictureList="[]"
                :limitNum="9"
              ></upload-from>
              <div class="text-14px text-#999">图片最多可上传9张</div>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button color="#E93323" round type="primary" @click="submitForm(replyFormRef)" :loading="isLoading"
            >立即评价</el-button
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
