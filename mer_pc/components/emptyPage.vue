<!--数据空状态页面-->
<script setup lang="ts">
import {toRefs, reactive} from "vue";
//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176-200)

const props = defineProps({
  //列表数据 resolve
  title: {
    type: String,
    default: '',
  },
  mTop: {
    type: String,
    default: '0',
  }
})
const { title, mTop } = toRefs(props)
</script>

<template>
  <ClientOnly>
  <div class="empty-box h-100% m-auto" :style="{ height: ScrollHeight + 'px' }">
    <slot name="emptyImage"></slot>
    <div class="txt">{{title}}</div>
  </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.empty-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image{
    width: 274px;
    height: 147px;
  }
  .txt{
    font-size: 13px;
    color: #999;
  }
}
</style>