import { PhoneReg } from '~/utils/validate'
export function useSmsCode() {
  // 数据
  const disabled: globalThis.Ref<boolean> = ref<boolean>(false)
  const text: globalThis.Ref<string> = ref<string>('获取验证码')
  let timeoutId: any
  const handleCodeSend = (timer: number = 60) => {
    if (disabled.value) return
    disabled.value = true
    let n: number = timer

    text.value = '剩余 ' + n + ' s'
    timeoutId = setInterval(() => {
      n = n - 1
      if (n < 0) {
        clearInterval(timeoutId)
      }
      text.value = '剩余 ' + n + ' s'
      if (n <= 0) {
        disabled.value = false
        text.value = '重新获取'
      }
    }, 1000)
  }

  //清除倒计时
  const stopCountdown = () => {
    disabled.value = false
    if (timeoutId !== undefined) {
      clearInterval(timeoutId) // 清除定时器
    }
  }

  // 手机号码验证
  const checkPhone = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('请输入手机号码'))
    }
    setTimeout(() => {
      if (PhoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入有效的电话号码'))
      }
    }, 150)
  }
  return {
    disabled,
    text,
    handleCodeSend,
    stopCountdown,
    checkPhone,
  }
}
