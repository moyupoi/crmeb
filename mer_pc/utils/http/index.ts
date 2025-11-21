import { FetchOptions } from 'ohmyfetch'
import { RequestCodeEnum, RequestMethodsEnum, RequestConfig } from '@/enums/requestEnums'
import feedback from '@/utils/feedback'
import { merge } from 'lodash-es'
import { Request } from './request'
import { useUserStore } from '@/stores/user'
import { getApiUrl } from '@/utils/env'
import { useNuxtApp } from 'nuxt/app'
export function createRequest(opt?: Partial<FetchOptions>) {
  const userStore = useUserStore()
  const nuxtApp = useNuxtApp()
  const defaultOptions: FetchOptions = {
    // 基础接口地址
    baseURL: getApiUrl(),
    //请求头
    headers: {
      // version: getVersion(),
    },
    retry: 2,
    async onRequest({ options }) {
      const headers = options.headers || {}
      // 添加token
      const token = userStore.token
      const account = userStore.account
      if (token) {
        // @ts-ignore
        headers[RequestConfig.TOKENNAME] = token
      }
      options.headers = headers
    },
    requestOptions: {
      // apiPrefix: getApiPrefix(),
      apiPrefix: '/api/',
      isTransformResponse: true,
      isReturnDefaultResponse: false,
      withToken: true,
      isParamsToData: true,
      requestInterceptorsHook(options) {
        const { apiPrefix, isParamsToData } = options.requestOptions
        // 拼接请求前缀
        if (apiPrefix) {
          options.url = `${apiPrefix}${options.url}`
        }
        const params = options.params || {}
        // POST请求下如果无data，则将params视为data
        if (
          isParamsToData &&
          !Reflect.has(options, 'body') &&
          options.method?.toUpperCase() === RequestMethodsEnum.POST
        ) {
          options.body = params
          options.params = {}
        }
        return options
      },
      async responseInterceptorsHook(response, options) {
        const { isTransformResponse, isReturnDefaultResponse } = options.requestOptions
        const headers = Object.fromEntries(response.headers.entries())

        //返回默认响应，当需要获取响应头及其他数据时可使用
        if (isReturnDefaultResponse) {
          return response
        }
        // 是否需要对数据进行处理
        if (!isTransformResponse) {
          return response._data
        }

        const { code, data, message } = response._data

        // code返回码处理
        switch (code) {
          case RequestCodeEnum.SUCCESS:
            return Promise.resolve(data)
          case RequestCodeEnum.FAIL:
            message && feedback.msgError(message)
            return Promise.reject(message)
          case RequestCodeEnum.PARAMS_FAIL:
            message && feedback.msgError(message)
            return Promise.reject(message)
          case RequestCodeEnum.LOGIN_FAILURE_ONE:
          case RequestCodeEnum.LOGIN_FAILURE_TWO:
            nuxtApp.$onHandlerLogin()
            userStore.logout()
            return Promise.reject(message)
          case RequestCodeEnum.ROUTINE_CREATE_QRCODE_EXCEPTION:
            return Promise.reject(data)
          default:
            message && feedback.msgError(message)
            return data
        }
      },
      responseInterceptorsCatchHook(err) {
        return err
      },
    },
  }
  return new Request(
    // 深度合并
    merge(defaultOptions, opt || {}),
  )
}
