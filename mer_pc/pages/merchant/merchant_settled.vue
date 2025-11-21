<script setup lang="ts">
import {
  getMerCategoryListApi,
  getMerSettledApplyApi,
  getMerTypeListApi,
  sendSettledCodeApi,
} from '~/server/merchantApi'
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 申请信息
const useStore = useAppStore()
const applicationDatas = reactive<ApplicationDataQuery>(<ApplicationDataQuery>useStore.applicationData)

//获取浏览器值
const route = useRoute()
const type = ref<string>(<string>route.query.type) //type为0是新增，

//表单数据
const merchantForm = reactive<FormMerSettledApply>(
  type.value === '0' ? Object.assign(merchantFormDefault()) : applicationDatas,
)

//回显图片数据
const pictureList = ref<ItemObject[]>([])
//营业执照图片
const picList = ref<string[]>(merchantForm?.qualificationPicture ? JSON.parse(merchantForm?.qualificationPicture) : [])

//获取回显图片列表
const getPicList = () => {
  if (picList.value.length) {
    picList.value.map((item) => {
      pictureList.value.push({
        name: '',
        url: item,
      })
    })
  } else {
    pictureList.value = []
  }
}
getPicList()

watch(
  () => route.query.type,
  (newValue) => {
    Object.assign(merchantForm, newValue === '0' ? Object.assign(merchantFormDefault()) : applicationDatas)
    picList.value = merchantForm?.qualificationPicture ? JSON.parse(merchantForm?.qualificationPicture) : []
    getPicList()
  },
)

const loading = ref<boolean>(false)

//商户分类
const { data: classOptions } = useAsyncData(async () => getMerCategoryListApi())

//商户类型
const { data: typeOptions } = useAsyncData(async () => getMerTypeListApi())

//店铺类型选择
const merchantTypeInfo = ref<string>('') // 店铺类型说明
const onSelectedType = (id: number) => {
  let obj = {}
  obj = typeOptions.value.find((item: any) => {
    return item.id === id
  })
  merchantTypeInfo.value = obj.info // 店铺类型说明
}

//商户分类选择
const onSelectedCategory = (id: number) => {
  let obj = {}
  obj = classOptions.value.find((item: any) => {
    return item.id === id
  })
  merchantForm.handlingFee = obj.handlingFee
}

/**
 * 获取验证码
 */
const verifyRef = shallowRef()
const handleCode = () => {
  if (!merchantForm.phone) return feedback.msgWarning('请填写手机号')
  verifyRef.value.show()
}

/**
 * 图形验证成功后的回调
 */
const handlerOnVerSuccess = async (e: CaptchaVerification) => {
  const res = await sendSettledCodeApi({ phone: merchantForm.phone })
  if (res) {
    feedback.msgSuccess('发送成功')
    handleCodeSend()
  }
}

/**
 * 图片上传成功获取数据
 */
import { UploadImageData, CaptchaVerification, ItemObject } from '~/types/global'
const handleComplete = (res: UploadImageData) => {
  picList.value.push(res.url)
}

//删除图片成功回调
const handleRemoveComplete = (idx: number) => {
  picList.value.splice(idx, 1)
}

/**
 * 表单提交
 */
import { PhoneReg } from '~/utils/validate'
import feedback from '~/utils/feedback'
import { ApplicationDataQuery, FormMerSettledApply } from '~/types/merchant'
import { merchantFormDefault } from '~/pages/merchant/defaultMerchant'
import { useAppStore } from '~/stores/app'
const isAgreement = ref<boolean>(false)
const merchantFormRef = ref<FormInstance>()
const successInfo = reactive({
  title: '恭喜您！已成功提交申请',
  tips: '我们会尽快确认您的入驻申请，请留意审核状态',
  url: '/merchant/application_record',
})

// 手机号码验证
import { useSmsCode } from '~/composables/verifyCode'
const { disabled, text, handleCodeSend, stopCountdown, checkPhone } = useSmsCode()
const rules: FormRules = {
  realName: [{ required: true, message: '请填写商户姓名', trigger: 'blur' }],
  name: [{ required: true, message: '请填写商户名称', trigger: 'blur' }],
  captcha: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商户分类', trigger: 'change' }],
  typeId: [{ required: true, message: '请选择商户类型', trigger: 'change' }],
  phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
}
const successDialogRef = shallowRef() //成功弹窗
const btnloading = ref<boolean>(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (picList.value.length === 0) return feedback.msgWarning('请上传营业执照')
      if (!isAgreement.value) return feedback.msgWarning('请先阅读并勾选同意协议')
      merchantForm.qualificationPicture = JSON.stringify(picList.value)
      try {
        btnloading.value = true
        await getMerSettledApplyApi(merchantForm)
        btnloading.value = false
        successDialogRef.value.open()
      } catch (e) {
        btnloading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="wrapper_1200" v-loading="loading">
    <page-header title="商户入驻申请"></page-header>
    <div class="w-100% borRadius bg-#FFF pt-50px pb-20px pl-170px pr-180px relative">
      <nuxt-link :to="{ path: '/merchant/application_record' }">
        <div class="absolute text-14px font-color right-20px top-30px">
          <span class="iconfont icon-shenqingjilu"></span> 申请记录
        </div>
      </nuxt-link>
      <div class="fontColor333 text-24px mb50px text-center">入驻申请</div>
      <el-form
        ref="merchantFormRef"
        :model="merchantForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
      >
        <el-form-item label="商户名称" prop="name">
          <el-input placeholder="填写商户名称" v-model="merchantForm.name" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="商户分类" prop="categoryId">
          <el-select
            style="width: 100%"
            v-model="merchantForm.categoryId"
            placeholder="选择商户分类"
            @change="onSelectedCategory($event)"
          >
            <el-option v-for="item in classOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型" prop="typeId">
          <el-select
            style="width: 100%"
            v-model="merchantForm.typeId"
            @change="onSelectedType($event)"
            placeholder="选择商户类型"
          >
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input placeholder="填写关键字" type="textarea" v-model="merchantForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="营业执照" required>
          <div>
            <div>
              <span class="text-12px text-#666">请上传营业执照及行业相关资质证明图片</span>
              <span class="text-12px font-color" v-show="merchantTypeInfo">{{ '（ ' + merchantTypeInfo + ' ）' }}</span>
            </div>
            <div class="text-12px text-#999 mb-20px lh-12px">(图片最多可上传5张，格式支持JPG、PNG、JPEG)</div>
            <upload-from
              @handleComplete="handleComplete"
              :pictureList="pictureList"
              @handleRemoveComplete="handleRemoveComplete"
            ></upload-from>
          </div>
        </el-form-item>
        <el-form-item label="商户姓名" prop="realName">
          <el-input placeholder="填写商户姓名" v-model="merchantForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input placeholder="填写联系电话" v-model="merchantForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="w-100% acea-row row-between-wrapper">
            <el-input type="text" auto-complete="on" placeholder="请输入验证码" v-model="merchantForm.captcha">
              <template #suffix>
                <el-button
                  text
                  class="code font-color"
                  :disabled="disabled"
                  :class="disabled === true ? 'on' : ''"
                  @click="handleCode"
                >
                  {{ text }}
                </el-button>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="checkbox-wrapper item_protocol acea-row row-middle">
            <label class="well-check acea-row row-middle">
              <input type="checkbox" name="" value="" :checked="isAgreement" @click="isAgreement = !isAgreement" />
              <i class="icon cursors mr-7px"></i>
              <span>我已阅读并同意</span>
            </label>
            <nuxt-link
              :to="{ path: `/users/agreement_rules`, query: { type: 'merincomminginfo' } }"
              target="_blank"
              class="show_protocol font-color"
              >《商户入驻协议》
            </nuxt-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="btnloading" round color="#E93323" @click="submitForm(merchantFormRef)"
            >提交申请</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <success-dialog ref="successDialogRef" :successInfo="successInfo"></success-dialog>
    <VerifitionVerify ref="verifyRef" :phone="merchantForm.phone" @success="handlerOnVerSuccess"></VerifitionVerify>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/checkbox.scss';
:deep(.el-dialog__body) {
  img {
    width: 100%;
  }
}
:deep(.el-upload),
:deep(.el-upload-list__item) {
  width: 138px !important;
  height: 138px !important;
}
:deep(.--el-color-primary) {
  color: #e93323 !important;
}
.code {
  height: 96%;
  border: 0;
  background-color: #fff;
  color: #e93323 !important;

  img {
    width: 100%;
    height: 100%;
  }

  &.on {
    color: #ccc !important;
  }
}
</style>
