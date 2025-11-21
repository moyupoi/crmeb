<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UseInfoFrom } from '~/types/user'
import { userFromDefault } from '~/pages/users/defaultUser'
import { loginLogout, userInfoApi } from '~/server/userApi'
import { useCopy } from '~/composables/useCopy'
import { FormInstance } from 'element-plus'
import EditUserPhoneFrom from './components/editUserPhoneFrom.vue'
import EditUserPasswordFrom from './components/editUserPasswordFrom.vue'
import useDialog from '~/composables/useDialog'
import { useUserStore } from '~/stores/user'
import { useAppStore } from '~/stores/app'
import feedback from '~/utils/feedback'

//表单数据
const userFormRef = ref<FormInstance>()
const loading = ref<boolean>(false)
const password = ref('******')
const userForm = reactive<UseInfoFrom>(Object.assign(userFromDefault()))

//个人信息
const getUserInfo = async () => {
  try {
    loading.value = true
    let data = await userInfoApi()
    loading.value = false
    Object.assign(userForm, data)
  } catch (err) {
    loading.value = false
  }
}
getUserInfo()
loading.value = false

//复制
const { handleCopy } = useCopy()
const copyText = () => {
  handleCopy(userForm.id)
}

//提交成功后回调
const stepsActive = ref<number>(1) //步骤条选中的值，3是完成

//更换手机号
const title = ref<string>('')
const { bool: userVisible, DialogOpen, DialogClose } = useDialog()
const handleChangePhone = () => {
  title.value = '修改手机号'
  stepsActive.value = 1
  DialogOpen()
}

//修改密码
const handleChangePassword = () => {
  title.value = '修改密码'
  stepsActive.value = 1
  DialogOpen()
}

//关闭弹窗
const handleClose = () => {
  DialogClose()
  if (stepsActive.value === 3) getUserInfo()
}

//关闭弹窗
const handleSubmitClose = (active: number) => {
  stepsActive.value = active
}

//退出登录
const userStore = useUserStore()
//购物车没登录状态下显示0
const { getCarNumber } = useAppStore()
const handleLogout = async () => {
  await feedback.confirm('确定退出吗？')
  await loginLogout()
  await getCarNumber(0)
  await userStore.logout()
}
</script>

<template>
  <div class="user-account">
    <div class="acea-row header">
      <div class="font18 fontColor333 mb-50px">账号密码</div>
    </div>
    <el-form
      ref="userFormRef"
      :model="userForm"
      label-width="82px"
      class="demo-ruleForm"
      size="large"
      status-icon
      v-loading="loading"
    >
      <el-form-item label="ID号：">
        <el-input v-model="userForm.id" disabled />
        <el-button class="ml-10px" link color="#E93323" @click="copyText">复制</el-button>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="userForm.phone" disabled class="w-500px" />
        <span class="ml-10px font-color cursors" @click="handleChangePhone">更换手机号</span>
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input v-model="password" disabled class="w-500px" />
        <span class="ml-10px font-color cursors" @click="handleChangePassword">修改密码</span>
      </el-form-item>
      <el-form-item class="mt-60px">
        <div @click="handleLogout" class="w-120px h-44px text-16px handleBtn cursors lh-44px">退出登录</div>
      </el-form-item>
    </el-form>

    <el-dialog
      v-model="userVisible"
      :title="title"
      width="690px"
      center
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <edit-user-phone-from
        v-if="userVisible && title === '修改手机号'"
        :phone="userForm.phone"
        @handleSubmitClose="handleSubmitClose"
      ></edit-user-phone-from>
      <edit-user-password-from
        v-if="userVisible && title === '修改密码'"
        :phone="userForm.phone"
        @handleSubmitClose="handleSubmitClose"
      ></edit-user-password-from>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.user-account {
  .el-input {
    --el-input-width: 500px;
  }
  .el-button.is-link {
    --el-button-text-color: #e93323 !important;
  }
}
</style>
