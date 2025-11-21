<template>
  <div class="login-count">
    <!-- 登录弹窗 -->
    <div class="wrapper-count flex">
      <span class="closeBtn iconfont icon-danchuangguanbi" @click="closeLogin"></span>
      <div class="wrapper w-454px">
        <div style="border-left: 1px solid #eeeeee">
          <div class="font18 mb-40px">绑定手机号</div>
          <!--手机号-->
          <div class="item phone acea-row row-middle">
            <div class="number mr-14px"><span class="iconfont icon-shoujihao"></span></div>
            <input type="text" placeholder="请输入手机号" v-model="formData.phone" class="w-90% text-14px text-#333" />
          </div>
          <!--验证码-->
          <div class="item phone verificat acea-row row-between-wrapper">
            <div class="acea-row row-middle">
              <div class="number mr-14px"><span class="iconfont icon-yanzhengma"></span></div>
              <input
                type="text"
                autocomplete="new-password"
                placeholder="请输入验证码"
                v-model="formData.captcha"
                class="text-14px text-#333"
              />
            </div>
            <button
              class="code font-color cursors"
              :disabled="disabled"
              :class="disabled === true ? 'on' : ''"
              @click="handleSendcode('login')"
            >
              {{ text }}
            </button>
          </div>
          <!--底部按钮-->
          <div class="signIn bg-color" @click="handleLogin">绑定</div>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <VerifitionVerify ref="verifyRef" :phone="formData.phone" @success="handlerOnVerSuccess"></VerifitionVerify>
  </ClientOnly>
</template>

<script setup lang="ts">
// 绑定提交数据
import {reactive, ref, toRefs} from "vue";
import feedback from '~/utils/feedback'
import {registeBindingPhoneApi, registerVerify} from "~/server/userApi";
import {ItemObject} from "~/types/global";
import {useAppStore} from "~/stores/app";
import { useUserStore } from '~/stores/user'
import { Debounce } from '~/utils/util'

const props = defineProps({
  //注册key
  authKey: {
    type: String,
    default: '',
  },
  wxScanSwitch: {
    type: Number,
    default: 0,
  }
})
const { authKey, wxScanSwitch } = toRefs(props)

const formData = reactive({
  captcha: '',
  phone: '',
})

//关闭登录弹窗
const emit = defineEmits(['onCloseBindPhone','onLoginSucceeded'])
const closeLogin = () => {
  emit('onCloseBindPhone')
}

//验证码
const { disabled, text, handleCodeSend, stopCountdown } = useSmsCode()
const isSendCode = ref(false)

// 获取验证码
const verifyRef = shallowRef()
const handleSendcode = () => {
  if (!formData.phone) return feedback.msgWarning('请填写手机号')
  verifyRef.value.show()
}

// 发送成功后的回调
const handlerOnVerSuccess = async (e: any) => {
  await registerVerify({ phone: formData.phone })
  feedback.msgSuccess('发送成功')
  handleCodeSend()
}

const handleLogin = Debounce(async () => {
  if (!formData.phone) return feedback.msgError('请填写手机号码')
  if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(formData.phone)) return feedback.msgError('请输入正确的手机号码')
  const params = {
    phone: formData.phone,
    captcha: formData.captcha,
    key: authKey?.value,
    type: wxScanSwitch?.value===2 ?'wechat':'pcWx'
  }
  const data = await registeBindingPhoneApi(params)
  await loginSuccess(data)
},500)

//登录成功之后
const userStore = useUserStore()
const appStore = useAppStore()
const loginSuccess = async (data:ItemObject)=>{
  userStore.login(data.token)
  userStore.setUserInfo(data)
  await appStore.getGlobalConfig()
  await emit('onLoginSucceededBindPhone',data) //登录成功后操作
}
</script>

<style scoped lang="scss">
.wrapper-count {
  width: 454px !important;
}
.verificat{
  margin-bottom: 50px;
}
.login-count {
  background: none !important;
}
@import '@/assets/scss/checkbox.scss';
@import '@/assets/scss/login.scss';
input::-webkit-input-placeholder {
  /* 修改placeholder颜色  */
  color: #cccccc;
}
</style>
