<!--登录弹窗组件-->
<template>
  <el-dialog
    class="user-login-dialog"
    v-model="dialogVisible"
    :align-center="true"
    :width="420"
    :append-to-body="true"
    :show-close="false"
  >
    <div class="login-count">
      <!-- 登录弹窗 -->
      <div class="wrapper-count flex af90db" :class="pcConfig.wxScanSwitch===2?'w-908px':'w-454px'">
        <span class="closeBtn iconfont icon-danchuangguanbi" @click="closeLogin"></span>
        <div v-if="pcConfig.wxScanSwitch===2" class="wrapper w-454px">
          <div class="font18 mb-40px">手机扫码登录</div>
          <div>打开<span class="font-color">微信</span>点击右上角扫一扫</div>
          <div class="w-210px h-210px b-rd-8px borderSol-eee flex-center mQ">
            <el-image :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${pcConfig.ticket}`" class="w-192px h-192px" @click="handleQrCodeClick"></el-image>
          </div>
        </div>
        <div class="wrapper w-454px 8bfb4">
          <div style="border-left: 1px solid #EEEEEE;">
            <div class="title">
              <span class="item_title" @click="current = 1" :class="current === 1 ? 'font18' : ''">登录/注册</span>
              <span class="item_title" @click="current = 2" :class="current === 2 ? 'font18' : ''">密码登录</span>
            </div>
<!--            <div class="iconfont icon-erweima" @click="current = 3"></div>-->
            <!--手机号-->
            <div class="item phone acea-row row-middle">
              <div class="number mr-14px"><span class="iconfont icon-shoujihao"></span></div>
              <input type="text" placeholder="请输入手机号" v-model="formData.phone" class="w-90% text-14px text-#333" />
            </div>
            <!--验证码-->
            <div
                v-show="current === 1 || current === 4 || current === 5"
                class="item phone verificat acea-row row-between-wrapper"
            >
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

            <!--密码登录-->
            <div v-show="current === 2">
              <div class="item phone verificat acea-row 70ba6a">
                <div class="number mr-14px"><span class="iconfont icon-mima"></span></div>
                <input
                    type="password"
                    class="text-14px text-#333 w-90%"
                    placeholder="请输入密码"
                    v-model="formData.password"
                />
              </div>
            </div>

            <!--底部按钮-->
            <div class="checkbox-wrapper item_protocol acea-row row-middle 48bfb4a">
              <label class="well-check" style="line-height: 2">
                <input type="checkbox" name="" value="" :checked="isAgreement" @click="isAgreement = !isAgreement" />
                <i class="iconfont mr-7px icon" style="top: 11px"></i>
                <span>我已阅读并同意</span>
              </label>
              <nuxt-link
                  :to="{ path: `/users/agreement_rules`, query: { type: 'userinfo', name: '用户协议' } }"
                  target="_blank"
                  class="show_protocol"
              >《用户协议》
              </nuxt-link>
              与
              <nuxt-link
                  :to="{ path: `/users/agreement_rules`, query: { type: 'userprivacyinfo', name: '隐私协议' } }"
                  target="_blank"
                  class="show_protocol"
              >《隐私协议》
              </nuxt-link>
            </div>
            <div class="signIn bg-color" @click="handleLogin">登录</div>
            <div v-if="pcConfig.wxScanSwitch===1" @click="wechatLoginPC" class="flex-center mt-18px cursor-pointer">
              <img src="@/assets/images/wechat.png" class="w-22px h-22px" />
              <div class="ml-8px">微信登录</div>
            </div>
          </div>
        </div>
<!--        <div class="wxLogin wrapper" v-if="current === 3">-->
<!--          <div class="inner">扫码登录</div>-->
<!--          <div class="iconfont icon-zhanghaodenglu1" @click="current = 1"></div>-->
<!--          <div class="wxCode">-->
<!--            <span class="iconfont icon-erweimabianjiao"></span>-->
<!--            <span class="iconfont icon-erweimabianjiao"></span>-->
<!--            <span class="iconfont icon-erweimabianjiao"></span>-->
<!--            <span class="iconfont icon-erweimabianjiao"></span>-->
<!--            <img v-if="qrCode" :src="qrCode" />-->
<!--          </div>-->
<!--          <div class="tip">请使用微信扫一扫登录</div>-->
<!--        </div>-->
      </div>
    </div>
    <ClientOnly>
      <VerifitionVerify ref="verifyRef" :phone="formData.phone" @success="handlerOnVerSuccess"></VerifitionVerify>
    </ClientOnly>
  </el-dialog>
</template>
<script setup lang="ts">
import { PhoneReg } from '~/utils/validate'
import { Debounce } from '~/utils/util'
import { loginMobile, loginPassword, registerVerify, userPhoneCodeApi, pcConfigApi, pcWechatAgreeInfoApi } from '~/server/userApi'
import feedback from '~/utils/feedback'
import useOrder from '~/composables/useOrder'
import {ref, reactive, onUnmounted, onMounted} from 'vue'
import {ItemObject} from "~/types/global";
import {useAppStore} from "~/stores/app";
import { useUserStore } from '~/stores/user'
import { usePolling } from '~/composables/usePolling';
import {linkNavigateTo} from "~/utils/util";

const appStore = useAppStore()
const userStore = useUserStore()

//pc登录配置
const pcConfig = reactive({
  openAppid: '',
  ticket: '',
  wxScanSwitch: 0
})

const isInitializing = ref(false)
const getPcConfig = async () => {
  if (isInitializing.value) return // 防止重复调用
  
  isInitializing.value = true
  try {
    const data = await pcConfigApi()
    Object.assign(pcConfig, data)
    
    // 只在首次获取时发送事件
    await emit('getwxScanSwitch', pcConfig.wxScanSwitch)
    
    if(pcConfig.wxScanSwitch === 2){
      getWechatAgreeInfo()
      startPolling(getWechatAgreeInfo, 3000)
    }
  } finally {
    isInitializing.value = false
  }
}
// // 轮询相关状态
const pollingTimer = ref<number | null>(null)
const pollingCount = ref(0)
const isPolling = ref(false)

//PC商城微信公众号用户同意登录信息
const { startPolling, stopPolling } = usePolling()
const getWechatAgreeInfo = async () => {
  try {
    const data = await pcWechatAgreeInfoApi(pcConfig.ticket)
    console.log('data?.wechatPublicUserAgreeStatus',data?.wechatPublicUserAgreeStatus)
    if (data?.wechatPublicUserAgreeStatus) {
      feedback.loading('加载中..')
      // Handle successful agreement
      await wechatLoginSuccess(data)
      pcConfig.ticket = ''
      DialogClose() // Close the dialog after successful login
      stopPolling()
    }
 } catch (error) {
   stopPolling()
 }
}

// 网站登录微信
const hosts = ref(location.origin + location.pathname)
const route = useRoute()

const wechatLoginPC =async () =>{
  console.log(route,'route')
  if (!isAgreement.value) return feedback.msgWarning('请勾选协议')
  appStore.getWechatRoutePath(route.fullPath)
  //const encodedQuery = encodeURIComponent(location.origin+route.path);
  const encodedQuery = encodeURIComponent(location.origin+'/authorizedLogin');
  console.log(location.origin+route.path,'encodedQueryencodedQuery')
  window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${pcConfig.openAppid}&redirect_uri=${encodedQuery}&response_type=code&scope=snsapi_login&state=3d6be0a4035d839573b04816624a415e#wechat_redirec`;
}

const emit = defineEmits(['onLoginSucceeded','openBindPhone','getwxScanSwitch'])
// 微信扫码登录成功
const wechatLoginSuccess = async (data) =>{
  //未注册的时候调起绑定手机号去绑定手机号
  if (data.type === 'register') {
    await emit('openBindPhone',data)
  }
  if (data.type === 'login') {
    await loginSuccess(data)
  }
  feedback.closeLoading()
}
//
// 打开登录弹窗
const { bool: dialogVisible, DialogOpen, DialogClose } = useDialog()
const open = () => {
  formData.phone = ''
  formData.captcha= ''
  getPcConfig()
  DialogOpen()
  console.log('pcConfig.wxScanSwitchpcConfig.wxScanSwitch',pcConfig.wxScanSwitch)
}
defineExpose({ open })
//
//关闭登录弹窗
const closeLogin = () => {
  DialogClose()
  stopPolling()
  stopCountdown()
}
//
// Stop polling when component is unmounted
onUnmounted(() => {
  stopPolling()
})

//是否勾选协议
const isAgreement = ref(false)

// 登录提交数据
const formData = reactive({
  captcha: '',
  phone: '',
  spreadPid: 0,
  password: '',
})

//扫码登录二维码
const qrCode = ref('')

//验证码
const { disabled, text, handleCodeSend, stopCountdown } = useSmsCode()
const isSendCode = ref(false)

// 手机号码验证
const inputPhone = (e: any) => {
  isSendCode.value = PhoneReg.test(e)
}

// 获取验证码
const verifyRef = shallowRef()
const handleSendcode = () => {
  if (!formData.phone) return feedback.msgWarning('请填写手机号')
  if (!isAgreement.value) return feedback.msgWarning('请勾选协议')
  verifyRef.value.show()
}

// 发送成功后的回调
const handlerOnVerSuccess = async (e: any) => {
  await registerVerify({ phone: formData.phone })
  feedback.msgSuccess('发送成功')
  handleCodeSend()
}
const agreementConfirm = async () => {
  if (isAgreement.value) {
    return
  }
  await feedback.confirm('确认已阅读并同意《服务协议》和《隐私政策》')
  isAgreement.value = true
}

// 登录按钮提交
//显示标识 1快速登录 2密码登录
const current = ref<number>(1)
const { onGetCartCount } = useOrder()
const handleLogin = Debounce(async () => {
  if (!formData.phone) return feedback.msgError('请填写手机号码')
  if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(formData.phone)) return feedback.msgError('请输入正确的手机号码')
  if (!isAgreement.value) return feedback.msgError('请勾选用户隐私协议')
  //快速登录
  if (current.value === 1) {
    await getLoginMobile()
  } else {
    //账号密码登录
    if (!formData.password) return feedback.msgError('请填写密码')
    await getloginPassword()
  }
  await closeLogin()
  await onGetCartCount()
},500)

//密码登录
const getloginPassword = async () => {
  const params = {
    phone: formData.phone,
    password: formData.password,
    spreadPid: formData.spreadPid,
  }
  const data = await loginPassword(params)
  await loginSuccess(data)
}

//快速/验证码登录
const getLoginMobile = async () => {
  const params = {
    phone: formData.phone,
    captcha: formData.captcha,
    spreadPid: formData.spreadPid,
  }
  const data = await loginMobile(params)
  await loginSuccess(data)
}
//登录成功之后
const loginSuccess = async (data:ItemObject)=>{
  userStore.login(data.token)
  userStore.setUserInfo(data)
  text.value = '获取验证码'
  stopCountdown()
  await appStore.getGlobalConfig()
  await emit('onLoginSucceeded',data) //登录成功后操作
}


</script>
<style scoped lang="scss">
@import '@/assets/scss/checkbox.scss';
@import '@/assets/scss/login.scss';
input::-webkit-input-placeholder {
  /* 修改placeholder颜色  */
  color: #cccccc;
}
.mQ{
  margin: 34px auto;
}
</style>
