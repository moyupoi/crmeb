<!--上传组件-->
<script setup lang="ts">
import { ref, reactive, toRefs,watch } from 'vue'
import { uploadImageApi } from '~/server/userApi'
import { Plus } from '@element-plus/icons-vue'
const props = defineProps({
  //是否显示已上传文件列表
  isShow: {
    type: Boolean,
    default: true,
  },
  // 最多可上传的张数
  maxlength: {
    type: Number,
    default: 5,
  },
  // 最多可上传的张数
  limitNum: {
    type: Number,
    default: 5,
  },
  pictureList: {
    type: Array,
    default: [],
  },
})
const { isShow, limitNum, maxlength, pictureList } = toRefs(props)

//图片列表
const picList = ref<ItemObject[]>(pictureList?.value as ItemObject[])

watch(
    () => pictureList.value,
    (newValue) => {
      picList.value = newValue
    },
)


const hideUploadEdit = ref<boolean>(false)
const myHeaders = reactive<any>({
  'Content-Type': 'multipart/form-data',
})

/**
 * 上传前
 * @param file
 */
const beforeUpload = (file: { name: string; size: number }) => {
  const fileTypeName = file.name.substr(file.name.lastIndexOf('.') + 1)
  const isImage = ['jpeg', 'gif', 'bmp', 'png', 'jpg'].includes(fileTypeName)
  const isLtSize = file.size / 1024 / 1024 < 10
  if (!isImage) {
    feedback.msgError('仅支持 ' + ['jpeg', 'gif', 'bmp', 'png', 'jpg'].join(',') + ' 格式')
    return false
  }
  if (!isLtSize) {
    //feedback.msgError('图片大小不能超过 ' + data.uploadSize + ' MB!')
    return false
  }
  return true
}

/**
 * 自定义图片上传
 * @param options
 */
const emit = defineEmits(['handleComplete','handleRemoveComplete'])
const pictureData = ref<ItemObject[]>(pictureList?.value as ItemObject[]) //图片上传后的集合
const handleUploadForm = async (options: { file: string | Blob }) => {
  let formData = new FormData()
  formData.append('multipart', options.file)
  const res = await uploadImageApi('merchant', '7', formData)
  pictureData.value.push({
    name: res.fileName,
    url: res.url,
  })
  emit('handleComplete', res)
  // emit('handleComplete', res)
}

const beforeRemove =(file, fileList)=> {
  let index = fileList.indexOf(file)
  emit('handleRemoveComplete', index)
}

/**
 * 删除图片
 * @param file
 * @param fileList
 */
const handleRemove = async (file, fileList) => {
  let index = fileList.indexOf(file)

}

const handleExceed = async () => {
  feedback.msgWarning(`最多可上传${limitNum.value}张`)
}

const handleEditChange = async (file, fileList) => {
 // picList.value = JSON.parse((JSON.stringify(fileList)))
  //hideUploadEdit.value = fileList.length >= limitNum.value
}

//查看图片
import type { UploadProps } from 'element-plus'
import {ItemObject} from "~/types/global";
import {merchantFormDefault} from "~/pages/merchant/defaultMerchant";
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<template>
  <div class="el-form">
    <div class="img-box-wrapper">
      <el-upload
        v-model:file-list="picList"
        list-type="picture-card"
        :limit="limitNum"
        :action="'#'"
        :headers="myHeaders"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :http-request="handleUploadForm"
        :on-exceed="handleExceed"
        :show-file-list="isShow"
        :before-upload="beforeUpload"
        :on-change="handleEditChange"
        :class="{ hide: hideUploadEdit }"
        :disabled="hideUploadEdit"
        :on-preview="handlePictureCardPreview"
      >
<!--        <div v-if="picList" class="w-100px h-100px">-->
<!--          <img v-for="(item, index) in picList" :src="item" alt="" class="w-100px h-100px" />-->
<!--        </div>-->
        <el-icon><Plus /></el-icon>
      </el-upload>
    </div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" class="w-100%"/>
    </el-dialog>
  </div>
</template>
