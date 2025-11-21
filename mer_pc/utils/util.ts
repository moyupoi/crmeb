/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = 'px') => {
  return !Object.is(Number(value), NaN) ? `${value}${unit}` : value
}

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */

export const treeToArray = (data: any[], props = { children: 'children' }) => {
  data = JSON.parse(JSON.stringify(data))
  const { children } = props
  const newData = []
  const queue: any[] = []
  data.forEach((child: any) => queue.push(child))
  while (queue.length) {
    const item: any = queue.shift()
    if (item[children]) {
      item[children].forEach((child: any) => queue.push(child))
      delete item[children]
    }
    newData.push(item)
  }
  return newData
}

/**
 * @description 获取正确的路经
 * @param {String} path  数据
 */
export function getNormalPath(path: string) {
  if (path.length === 0 || !path || path == 'undefined') {
    return path
  }
  const newPath = path.replace('//', '/')
  const length = newPath.length
  if (newPath[length - 1] === '/') {
    return newPath.slice(0, length - 1)
  }
  return newPath
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//返回值：arg1加上arg2的精确结果
export function Add(arg1: number, arg2: number) {
  arg2 = parseFloat(arg2)
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(100, Math.max(r1, r2))
  return (Mul(arg1, m) + Mul(arg2, m)) / m
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//返回值：arg1乘以arg2的精确结果
export function Mul(arg1: number | string, arg2: number | string) {
  arg1 = parseFloat(arg1)
  arg2 = parseFloat(arg2)
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：$h.Div(arg1,arg2)
//返回值：arg1除以arg2的精确结果
export function Div(arg1: number | string, arg2: number | string) {
  arg1 = parseFloat(arg1);
  arg2 = parseFloat(arg2);
  var t1 = 0,
      t2 = 0,
      r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return Mul(r1 / r2, Math.pow(10, t2 - t1));
}


/**
 * 将字符串转换为布尔值
 * @param s
 */
export function stringToBool(s: string): boolean {
  if (s.toLowerCase() === 'true' || s === '1') {
    return true
  } else if (s.toLowerCase() === 'false' || s === '0') {
    return false
  } else {
    return false
  }
}

/**
 * Base64 转换为 Blob 对象的辅助函数
 * @param s
 */
export function b64toBlob(base64: string) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: 'image/png' });
}


/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn:any, t:any) => {
  const delay = t || 500
  let timer
  return function () {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}

/**优惠券展示的使用有效期均根据今天进行判断，
 * 没到使用期的展示「开始日期-结束日期 有效」，
 * 已经可以使用的展示「有效期至 结束日期」
 * @param startTime
 * @param endTime
 */
export const getCouponTime = (startTime: string, endTime: string) => {
  let start:number = new Date(startTime).getTime()
  let newTime:number = Date.now()
  let reg:RegExp = new RegExp('-', 'g') //g代表全部
  if (newTime < start) {
    return startTime.slice(0, 16).replace(reg, '.') + ' ~ ' + endTime.slice(0, 16).replace(reg, '.') + ' 可用'
  } else {
    return '有效期至 ' + endTime.slice(0, 16).replace(reg, '.')
  }
}

/**
 * 页面路由跳转
 * @param url 跳转地址
 * @param query 携带参数
 * @param replace 是否刷新页面
 */
export const linkNavigateTo = (url: string, params = {}, replace: boolean = false): void => {
  navigateTo(
      {
        path: url,
        query: params,
      },
      {
        replace: replace,
      },
  )
}

/**
 * 链接跳转
 */
export const linkJump=(url:string)=>{
  if (url.indexOf("http") !== -1) {
   window.open(url)
  }else{
    linkNavigateTo(url)
  }
}