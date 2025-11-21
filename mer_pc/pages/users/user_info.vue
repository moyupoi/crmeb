<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import {GlobalDatas, UseInfoFrom} from '~/types/user'
import { cityList, userFromDefault } from '~/pages/users/defaultUser'
import feedback from '~/utils/feedback'
import { userEditApi, userInfoApi } from '~/server/userApi'
import zhCn from "element-plus/dist/locale/zh-cn.js";
import { useAppStore } from '~/stores/app'
const rules: FormRules = {
  nickname: [{ required: true, message: '请填写用户昵称', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
}

//获取全局配置数据
const appStore = useAppStore()
const globalData = reactive<GlobalDatas>(<GlobalDatas>appStore.globalData)

//表单数据
const loading = ref<boolean>(false)
const userFormRef = ref<FormInstance>()
const userForm = reactive<UseInfoFrom>(Object.assign(userFromDefault()))
const getUserInfo = async () => {
  try {
    loading.value = true
    let data = await userInfoApi()
    Object.assign(userForm, data)
    loading.value = false
    address.value = userForm.province && userForm.city ? [userForm.province, userForm.city] : []

  } catch (err) {
    loading.value = false
  }
}
getUserInfo()

//城市数据
const optionsCityList = reactive<string[]>(cityList())

const props = {
  expandTrigger: 'hover' as const,
  value: 'city',
  label: 'city',
  children: 'child',
}
const address = ref<string[]>([])

//图片上传成功回调

const showFileList = ref<boolean>(false)
const handleComplete = (res: any) => {
  userForm.avatar = res.url
}

/**
 * 保存
 * @param formEl
 */
import { useUserStore } from '~/stores/user'
const btnloading = ref<boolean>(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!userForm.avatar) return feedback.msgWarning('请上传头像')
      userForm.province = address.value[0]
      userForm.city = address.value[1]
      try {
        btnloading.value = true
        await userEditApi(userForm)
        feedback.msgSuccess('保存成功')
        let data =await userInfoApi()
        await useUserStore().setUserInfo(data)
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
  <div class="user-info">
    <div class="acea-row header">
      <div class="font18 fontColor333 mb-50px">个人资料</div>
    </div>
    <el-form
      ref="userFormRef"
      :model="userForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
      size="large"
      status-icon
      v-loading="loading"
    >
      <el-form-item label="头像：" prop="avatar" required>
        <div class="img-box-wrapper acea-row relative">
          <img v-if="userForm.avatar" :src="userForm.avatar" alt="avatar" class="w-60px h-60px b-rd-50%" />
          <img v-show="globalData.userIsPaidMember" :src="`${globalData.imageDomain}/crmebimage/presets/viptu.png`" class="w-20px h-20px absolute top-40px right-56px"/>
          <div :class="userForm.avatar?'upload-from':''">
            <upload-from @handleComplete="handleComplete" :isShow="showFileList"></upload-from>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="userForm.nickname" maxlength="8"/>
      </el-form-item>
      <el-form-item label="性别：" required>
        <el-radio-group v-model="userForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日：" prop="birthday">
        <el-config-provider :locale="zhCn">
          <el-date-picker v-model="userForm.birthday" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date" placeholder="请选择生日" style="width: 100%" />
        </el-config-provider>
      </el-form-item>
      <el-form-item label="地区：">
        <el-cascader v-model="address" :options="optionsCityList" :props="props" class="w-100%"/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="btnloading" round color="#E93323" @click="submitForm(userFormRef)"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button--large){
  width: 120px !important;
  height: 44px !important;
  border-radius: 25px;
}
.upload-from {
  position: relative;
  left: -50px;
  top: -9px;
  opacity: 0;
}
:deep(.el-upload),
:deep(.el-upload-list__item) {
  width: 60px !important;
  height: 60px !important;
}
</style>
