import { cloneDeep } from 'lodash-es'
/**
 * 截取富文本中的url地址返回url地址
 * @param text 富文本内容
 * @returns
 */
export const getImageComponent = (text: string): string[] => {
  const pattern = /<img.*?src="(.*?)".*?>/gi
  const matches = text.match(pattern)

  if (matches) {
    const paths: string[] = []
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]
      const image_path = match.match(/src="(.*?)"/)![1]
      paths.push(image_path)
    }
    return paths
  } else {
    return []
  }
}

/**
 * 截取字符串的内容
 * @param rich_text
 * @returns
 */
export const getPlainText = (rich_text: string): string => {
  var pattern = /<[^>]+>/g
  var content = rich_text.replace(pattern, '')
  return content.trim()
}

/**
 * @description 数组转树形
 * @param {Array} data  数据
 * @param {Object} props `{ parent: 'pid', children: 'children' }`
 */

export const arrayToTree = (data: any[], props = { id: 'id', parentId: 'pid', children: 'children' }) => {
  data = cloneDeep(data)
  const { id, parentId, children } = props
  const result: any[] = []
  const map = new Map()
  data.forEach((item) => {
    map.set(item[id], item)
    const parent = map.get(item[parentId])
    if (parent) {
      parent[children] = parent[children] ?? []
      parent[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}




