import { ElMessage } from 'element-plus'

type UrlType = string | Request | Ref<string | Request> | (() => string | Request)

export interface RequestOptions {
  method?: any
  params?: any
}

const request = async (url: UrlType, params: any, options: RequestOptions) => {
  const headers = useRequestHeaders(['cookie'])
  const { apiBase: baseURL } = useRuntimeConfig().public
  const { method = ((options?.method || 'GET') as string).toUpperCase() } = options
  return await useFetch(url as string, {
    default: () => [],
    baseURL,
    method,
    params: { ...params }, //temp hook
    headers,
    // lazy: true,
    credentials: 'include',
    body: method === 'POST' ? JSON.stringify(params) : undefined,
    onRequest({ request, options }) {
      // Set the request headers
      //   options.headers = options.headers || {};
    },
    onRequestError({ request, options, error }) {
      ElMessage.closeAll()
      error && ElMessage.error('Sorry, The Data Request Failed')
      // Handle the request errors
    },
    onResponse({ request, response, options }) {
      // Process the response data
      return response._data
    },
    onResponseError({ request, response, options }) {
      console.log('🚀 ~ file: MyRequest.ts:42 ~ onResponseError ~ request:', request)
      // Handle the response errors
    },
  })
}

export const useDefaultRequest = {
  get: (url: UrlType, params?: any, option?: RequestOptions) => {
    return request(url, params, { method: 'GET', ...option })
  },
  post: (url: UrlType, params?: any, option?: RequestOptions) => {
    return request(url, params, { method: 'POST', ...option })
  },
}
