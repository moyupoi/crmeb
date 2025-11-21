import { defineConfig } from '@unocss/vite'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'

const directions = ['m', 'ml', 'mr', 'mt', 'mb', 'p', 'pl', 'pr', 'pt', 'pb']
const properties = [
  'margin',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-bottom',
  'padding',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-bottom',
]
const pmRules = directions.map((direction, index) => {
  const regex = new RegExp(`^${direction}-(\\d+)$`)
  return [regex, ([, d]) => ({ [properties[index]]: `${parseInt(d)}rpx` })]
})

export default defineConfig({
  presets: [presetUno({ dark: 'class' })],
  transformers: [transformerDirectives()],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-between-center': 'flex flex-justify-between items-center',
    'flex-between-baseline': 'flex flex-justify-between items-baseline',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'i-flex-center': 'inline-flex justify-center items-center',
    'i-flex-x-center': 'inline-flex justify-center',
    'i-flex-y-center': 'inline-flex items-center',
    'flex-col': 'flex flex-col',
    'flex-col-stretch': 'flex-col items-stretch',
    'i-flex-col': 'inline-flex flex-col',
    'i-flex-col-stretch': 'i-flex-col items-stretch',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'absolute-tl': 'absolute-lt',
    'absolute-tr': 'absolute-rt',
    'absolute-bl': 'absolute-lb',
    'absolute-br': 'absolute-rb',
    'absolute-center': 'absolute-lt flex-center wh-full',
    'fixed-lt': 'fixed left-0 top-0',
    'fixed-lb': 'fixed left-0 bottom-0',
    'fixed-rt': 'fixed right-0 top-0',
    'fixed-rb': 'fixed right-0 bottom-0',
    'fixed-tl': 'fixed-lt',
    'fixed-tr': 'fixed-rt',
    'fixed-bl': 'fixed-lb',
    'fixed-br': 'fixed-rb',
    'fixed-center': 'fixed-lt flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden text-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out',
    'border-d': 'b b-solid b-#ddd',
    pointer: 'cursor-pointer',
  },
  rules: [
    ...pmRules,
    [/^mx-(\d+)$/, ([, d]) => ({ margin: `0 ${parseInt(d)}px` })],
    [/^my-(\d+)$/, ([, d]) => ({ margin: `${parseInt(d)}px 0` })],
    [/^px-(\d+)$/, ([, d]) => ({ padding: `0 ${parseInt(d)}px` })],
    [/^py-(\d+)$/, ([, d]) => ({ padding: `${parseInt(d)}px 0` })],
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${parseInt(d)}px` })],
  ],
  shortcuts: [
    {
      /*** flex布局 ****/
      'flex-center': 'flex items-center justify-center',
      'flex-between-center': 'flex items-center justify-between',
      'flex-around-center': 'flex items-center justify-around',
      'flex-col': 'flex flex-col',
      'flex-col-center': 'flex-center flex-col',
      'flex-x-center': 'flex justify-center',
      'flex-y-center': 'flex items-center',
      /***** grid布局 *****/
      'grid-column-2': 'grid grid-cols-2 grid-rows-none',
      'grid-column-3': 'grid grid-cols-3 grid-rows-none',
      'grid-column-4': 'grid grid-cols-4 grid-rows-none',
      'grid-column-5': 'grid grid-cols-5 grid-rows-none',
      /**** 固定定位 ****/
      'abs-lt': 'absolute left-0 top-0',
      'abs-lb': 'absolute left-0 bottom-0',
      'abs-rt': 'absolute right-0 top-0',
      'abs-rb': 'absolute right-0 bottom-0',
      'abs-center': 'absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2', //水平垂直都居中的定位
      'abs-x-center': 'absolute left-1/2 transform -translate-x-1/2', //水平居中定位
      'abs-y-center': 'absolute top-1/2 transform -translate-y-1/2', //垂直居中定位
      /*** 固定定位 ****/
      'fixed-lt': 'fixed left-0 top-0',
      'fixed-lb': 'fixed left-0 bottom-0',
      'fixed-rt': 'fixed right-0 top-0',
      'fixed-rb': 'fixed right-0 bottom-0',
      'transition-base': 'transition-all duration-300 ease-in-out',
      /**** 边框 ****/
      'base-border': 'b b-solid b-light',
      'base-border-b': 'b-b b-b-solid b-b-light',
      /****** 渐变色 ******/
      'primary-gradient': 'bg-gradient-to-br from-gradient-start to-gradient-end',
      /**** 基础背景图 *****/
      'base-bg-img': 'bg-cover bg-no-repeat',
    },
  ],
  theme: {
    colors: {
      primary: '#1890FF',
      light: '#ffffff',
      dark: '#18181c',
    },
  },
})
