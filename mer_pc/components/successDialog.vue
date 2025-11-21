<!--成功提示弹窗-->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
//弹窗状态
const dialogVisible = ref(false)

const props = defineProps({
  //数据
  successInfo: {
    type: Object,
    default: null,
  },
})
const { successInfo } = toRefs(props)

const open = () => {
  dialogVisible.value = true
}
defineExpose({ open })

//返回列表
const emit = defineEmits(['handleSubmitSuccess'])
const handleGoBack =()=>{
  emit('handleSubmitSuccess')
}
</script>

<template>
  <el-dialog
    class="success-dialog borRadius"
    v-model="dialogVisible"
    center
    width="600px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="mb-30px flex justify-center">
      <img src="~/assets/images/tijiaocheng.png" alt="" class="w-140px h-140px" />
    </div>
    <div class="text-24px fontColor333 mb-20px text-center">{{ successInfo.title }}</div>
    <div class="text-16px text-#666 mb-50px text-center">{{ successInfo.tips }}</div>
    <div class="flex justify-center">
      <nuxt-link :to="{ path: successInfo.url, query: { type: successInfo.type } }">
        <div @click="handleGoBack" class="w-150px h-50px text-center borderSol b-rd-25px text-16px text-#333 lh-48px mr-20px">返回列表</div>
      </nuxt-link>
      <nuxt-link :to="{ path: '/' }">
        <div class="w-150px h-50px text-center b-rd-25px text-16px text-#fff bg-color lh-48px">去首页</div>
      </nuxt-link>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.success-dialog {
  :deep(.el-dialog__body) {
    padding: 25px 0 55px 0 !important;
  }
}
</style>
