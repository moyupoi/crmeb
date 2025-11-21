export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data   上传资源（图片，视频）
  FORM_DATA = 'multipart/form-data',
}

/**
 * 请求方式
 */
export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

/**
 * 请求结果
 */
export enum RequestCodeEnum {
  SUCCESS = 200,
  FAIL = 500,
  LOGIN_FAILURE_ONE = 401,
  LOGIN_FAILURE_TWO = 402,
  PARAMS_FAIL = 400,
  ROUTINE_CREATE_QRCODE_EXCEPTION = 13211,
}

/**
 * 请求配置
 */
export enum RequestConfig {
  TOKENNAME = 'Authori-zation',
}
