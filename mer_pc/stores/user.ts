import { ACCOUNT_KEY, USERINFO_KEY, TOKEN_KEY } from '@/enums/cacheEnums'
import {createPinia, defineStore} from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
interface UserSate {
  userInfos: any
  token: string | null
  account: string | null
  temToken: string | null
}
export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserSate => {
    const TOKEN = useCookie(TOKEN_KEY)
    const ACCOUNT = useCookie(ACCOUNT_KEY)
    const USERINFO = useCookie(USERINFO_KEY)
    return {
      userInfos: USERINFO.value || null,
      token: TOKEN.value || null,
      account: ACCOUNT.value || null,
      temToken: null,
    }
  },
  getters: {
    isLogin: (state) => !!state.token,
    userInfo: (state) => state.userInfos,
  },
  actions: {
    setUserInfo(userInfos:any) {
     const USERINFO = useCookie(USERINFO_KEY)
     this.userInfos = userInfos
     Object.assign(this.userInfos, userInfos)
      USERINFO.value = userInfos
    },
    setAccount(account: string) {
      const ACCOUNT = useCookie(ACCOUNT_KEY)
      this.account = account
      ACCOUNT.value = account
    },
    login(token: string) {
      const TOKEN = useCookie(TOKEN_KEY)
      this.token = token
      TOKEN.value = token
    },
    logout() {
      const TOKEN = useCookie(TOKEN_KEY)
      const USERINFO = useCookie(USERINFO_KEY)
      this.token = null
      this.userInfos = null
      USERINFO.value = null
      TOKEN.value = null
        navigateTo({path: '/'})
        if(process.client) window.localStorage.clear();
    },
  },
    persist: process.client && { // 仅在客户端使用
        storage: localStorage, // localStorage 本地存储，可替换sessionStorage
    },
})

const clearAllCookies = async()=> {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
// 添加持久化插件到Pinia中
pinia.use(createPersistedState())

export default pinia