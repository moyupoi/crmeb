<script setup lang="ts">
import { reactive, ref, shallowRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import feedback from '~/utils/feedback'
import { bindingPhoneCodeApi, updateBindingApi, userEditApi, userPhoneCodeApi } from '~/server/userApi'
import { CaptchaVerification, ItemObject } from '~/types/global'

const props = defineProps({
  //列表数据
  phone: {
    type: String,
    default: '',
  },
})
const { phone } = toRefs(props)

//表单相关定义
const userEditFormRef = ref<FormInstance>()
const loading = ref<boolean>(false)
const userEditForm = reactive<ItemObject>({
  oldPhone: '',
  phone: '',
  captcha: '',
  checkCaptcha: '',
})

//步骤条选中的值
const active = ref<number>(1)

//手机号赋值
const userStore = useUserStore()
userEditForm.oldPhone = ref<string>(phone?.value)

// 手机号码验证
import { useSmsCode } from '~/composables/verifyCode'
const { disabled, text, handleCodeSend, stopCountdown, checkPhone } = useSmsCode()
const rules: FormRules = {
  captcha: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  checkCaptcha: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
}

// 获取验证码
const verifyRef = shallowRef()
const handleSendCheckcode = () => {
  if (!userEditForm.phone && active.value ===2) return feedback.msgWarning('请填写手机号')
  verifyRef.value.show()
}

/**
 * 图形验证成功后的回调
 */
const handlerOnVerSuccess = async (e: CaptchaVerification) => {
  if (active.value === 1) {
    await userPhoneCodeApi()
    feedback.msgSuccess('发送成功')
    handleCodeSend()
  } else {
    await bindingPhoneCodeApi({ phone: userEditForm.phone, captcha: userEditForm.checkCaptcha })
    feedback.msgSuccess('发送成功')
    handleCodeSend()
  }

}
/**
 * 确定
 * @param formEl
 */
const btnloading = ref<boolean>(false)
//首次校验
const submitFormCheck = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      active.value = 2
      text.value = '获取验证码'
      stopCountdown()
    } else {
      console.log('error submit!', fields)
    }
  })
}
//提交
const emit = defineEmits(['handleSubmitClose'])
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        btnloading.value = true
        await updateBindingApi({ phone: userEditForm.phone, captcha: userEditForm.captcha })
        feedback.msgSuccess('修改成功')
        active.value = 3
        emit('handleSubmitClose', active.value)
        btnloading.value = false
      } catch (err) {
        btnloading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="editUserInfoFrom" v-loading="btnloading">
    <el-steps :active="active" align-center class="mb-50px">
      <el-step title="验证身份"/>
      <el-step title="修改手机号"/>
      <el-step title="完成修改"/>
    </el-steps>
    <div v-if="active <3">
      <div class="text-16px text-#666 text-center mb-30px lh-22px">
        账号 <span class="font-color">{{ userStore.userInfo.nickName }}</span> 为确认是你本人操作，请完成以下验证
      </div>
      <el-form
          ref="userEditFormRef"
          :model="userEditForm"
          label-width="100px"
          class="demo-ruleForm"
          size="large"
          status-icon
          :rules="rules"
          v-loading="loading"
      >
        <div v-if="active === 1">
          <el-form-item label="手机号">
            <el-input v-model="userEditForm.oldPhone" placeholder="请输入手机号" disabled class="w-500px" />
          </el-form-item>
          <el-form-item label="验证码" prop="checkCaptcha">
            <div class="w-100% acea-row row-between-wrapper">
              <el-input type="text" auto-complete="on" placeholder="请输入验证码" v-model="userEditForm.checkCaptcha">
                <template #suffix>
                  <el-button
                      text
                      class="code font-color"
                      :disabled="disabled"
                      :class="disabled === true ? 'on' : ''"
                      @click="handleSendCheckcode"
                  >
                    {{ text }}
                  </el-button>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item class="submit">
            <div class="handleBtn w-120px lh-44px m-auto cursors" style="font-size: 16px" @click="submitFormCheck(userEditFormRef)">确定</div>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userEditForm.phone" placeholder="请输入手机号" class="w-500px" />
          </el-form-item>
          <el-form-item label="验证码" prop="checkCaptcha">
            <div class="w-100% acea-row row-between-wrapper">
              <el-input type="text" auto-complete="on" placeholder="请输入验证码" v-model="userEditForm.captcha">
                <template #suffix>
                  <el-button
                      text
                      class="code font-color"
                      :disabled="disabled"
                      :class="disabled === true ? 'on' : ''"
                      @click="handleSendCheckcode"
                  >
                    {{ text }}
                  </el-button>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item class="submit">
            <div class="handleBtn w-120px lh-44px m-auto cursors" style="font-size: 16px" @click="submitForm(userEditFormRef)">确定</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="active ===3" class="flex-x-center mb-30px">
      <img src="~/assets/images/xiucheng.png" alt="" class="w-140px h-140px" />
    </div>
    <div v-if="active ===3" class="text-16px text-#666 text-center">手机号修改成功，下次登录请使用新手机号!</div>
    <VerifitionVerify ref="verifyRef" :phone="userEditForm.phone" @success="handlerOnVerSuccess"></VerifitionVerify>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-step__head.is-finish){
  --el-color-primary: #E93323;
}
:deep(.el-step__title.is-finish){
  --el-color-primary: #E93323;
}
.submit {
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
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
