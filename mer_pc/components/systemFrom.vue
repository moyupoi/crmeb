<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.js'
import { toRefs, ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import useOrder from '~/composables/useOrder'
import { getCityListApi } from '~/server/userApi'
import { useSmsCode } from '~/composables/verifyCode'
const { checkPhone } = useSmsCode()
import { validateIdCard } from '~/utils/validate'

const props = defineProps({
  //模态框状态
  orderForm: {
    type: String,
    default: '',
  },
})
const { orderForm } = toRefs(props)

watch(
  () => props.orderForm,
  (newValue: string) => {
    getFormData()
  },
)

// 表单数据初始化
const { objToArr, formatDate } = useOrder()
const systemformData = reactive({
  orderNewForm: [],
})
const getFormData = () => {
  let formDatas = objToArr(JSON.parse(<string>orderForm?.value))
  formDatas.forEach((item, index, arr) => {
    item.value = ''
    if (item.name == 'texts') {
      if (item.defaultValConfig.val) {
        item.values = item.defaultValConfig.val
      } else {
        item.values = ''
      }
    } else if (item.name == 'radios') {
      item.values = item.wordsConfig.list[0]
    } else if (item.name == 'uploadPicture' || item.name == 'checkboxs') {
      item.values = []
    } else if (['timeranges', 'dateranges'].indexOf(item.name) != -1) {
      if (item.valConfig.tabVal == 0) {
        if (item.valConfig.tabData == 0) {
          let current = ''
          if (item.name == 'timeranges') {
            current = formatDate(new Date(Number(new Date().getTime())), 'hh:mm')
            item.values = [current, current]
          } else {
            const today = new Date()
            const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
              today.getDate(),
            ).padStart(2, '0')}`
            item.values = [date, date]
          }
        } else {
          item.values = item.valConfig.specifyDate
        }
      } else {
        item.values = []
      }
    } else {
      if (['times', 'dates'].indexOf(item.name) != -1) {
        if (item.valConfig.tabVal == 0) {
          if (item.valConfig.tabData == 0) {
            if (item.name == 'times') {
              item.values = formatDate(new Date(Number(new Date().getTime())), 'hh:mm')
              //this.$set(item, 'values' , this.comsys.formatDate(new Date(Number(new Date().getTime())), 'hh:mm'));
            } else {
              const today = new Date()
              const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
                today.getDate(),
              ).padStart(2, '0')}`
              item.values = date
            }
          } else {
            item.values = item.valConfig.specifyDate
          }
        } else {
          item.values = ''
        }
      } else {
        item.values = ''
      }
    }
  })
  systemformData.orderNewForm = formDatas
}
getFormData()

interface RuleForm {
  name: string
  value: string
}
const rules = reactive<FormRules<RuleForm>>({})
const systemFormRef = ref<FormInstance>()

//省市区街道
const cascaderPropsPCDS = {
  lazy: true,
  async lazyLoad(node, resolve) {
    getCascaderProps(node, 4, resolve)
  },
}

//省市区
const cascaderPropsPCD = {
  lazy: true,
  async lazyLoad(node, resolve) {
    getCascaderProps(node, 3, resolve)
  },
}
//省市
const cascaderPropsPC = {
  lazy: true,
  async lazyLoad(node, resolve) {
    getCascaderProps(node, 2, resolve)
  },
}

// 获取省市区街道
const getCascaderProps = async (node, num, resolve) => {
  const level = node.level
  let regionType
  let parentId
  let options
  if (level === 0) {
    regionType = 1
    parentId = 1
  } else {
    regionType = level + 1
    parentId = node.data.regionId
  }
  let data = await getCityListApi({ parentId: parentId, regionType: regionType })
  options = data.map((item) => ({
    value: item.regionName,
    label: item.regionName,
    leaf: regionType >= num,
    regionId: item.regionId,
  }))
  resolve(options)
}

//上传图片回调
import { UploadImageData } from '~/types/global'
const picList = ref([])
const handleComplete = (res: UploadImageData) => {
  picList.value.push(res?.url)
}

//删除图片成功回调
const handleRemoveComplete = (idx: number) => {
  picList.value.splice(idx, 1)
}

defineExpose({
  systemformData,
  systemFormRef,
  picList,
})
</script>

<template>
  <!--虚拟商品-->
  <div v-if="systemformData.orderNewForm.length > 0" class="wrapper virtual_form">
    <el-form report-submit="true" ref="systemFormRef" :model="systemformData" :rules="rules">
      <template class="virtual-item" v-for="(item, index) in systemformData.orderNewForm" :key="index">
        <!-- checkboxs -->
        <el-form-item
          v-if="item.name == 'checkboxs'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-checkbox-group v-model="item.values">
            <el-checkbox :label="j" v-for="(j, jindex) in item.wordsConfig.list" :key="jindex">{{ j.val }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- radios -->
        <el-form-item
          v-if="item.name == 'radios'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-radio-group v-model="item.values">
            <el-radio :label="j" v-for="(j, jindex) in item.wordsConfig.list" :key="jindex">{{ j.val }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- texts -->
        <el-form-item
          v-if="item.name == 'texts' && item.valConfig.tabVal == 0"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-input v-model="item.values" :placeholder="item.tipConfig.val" class="confirm"></el-input>
        </el-form-item>
        <!-- number -->
        <el-form-item
          v-if="item.name == 'texts' && item.valConfig.tabVal == 4"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-input type="number" v-model="item.values" :placeholder="item.tipConfig.val" class="confirm"></el-input>
        </el-form-item>
        <!-- email -->
        <el-form-item
          v-if="item.name == 'texts' && item.valConfig.tabVal == 3"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val
              ? [
                  { required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' },
                  {
                    type: 'email',
                    message: '请填写正确的邮箱地址',
                    trigger: ['blur', 'change'],
                  },
                ]
              : ''
          "
        >
          <el-input type="email" v-model="item.values" :placeholder="item.tipConfig.val" class="confirm"></el-input>
        </el-form-item>
        <!-- phone -->
        <el-form-item
          v-if="item.name == 'texts' && item.valConfig.tabVal == 1"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="item.titleShow.val ? [{ required: true, validator: checkPhone, trigger: 'blur' }] : ''"
        >
          <el-input maxlength="11" v-model="item.values" :placeholder="item.tipConfig.val" class="confirm"></el-input>
        </el-form-item>
        <!-- id -->
        <el-form-item
          v-if="item.name == 'texts' && item.valConfig.tabVal == 2"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val
              ? [
                  { required: true, message: '身份证号不能为空', trigger: 'blur' },
                  { validator: validateIdCard, trigger: 'blur' },
                ]
              : ''
          "
        >
          <el-input type="idcard" v-model="item.values" :placeholder="item.tipConfig.val" class="confirm"></el-input>
        </el-form-item>
        <!-- selects -->
        <el-form-item
          v-if="item.name == 'selects'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <div class="text-#333">{{item.values}}</div>
          <el-select v-model="item.values" placeholder="请选择" class="confirm">
            <el-option v-for="(j, jindex) in item.wordsConfig.list" :key="jindex" :label="j.val" :value="j.val">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- data -->
        <el-form-item
          v-if="item.name == 'dates'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-config-provider :locale="zhCn">
            <el-date-picker
              class="confirm"
              v-model="item.values"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="item.tipConfig.val"
            >
            </el-date-picker>
          </el-config-provider>
        </el-form-item>
        <!-- dateranges -->
        <el-form-item
          class="w-600px"
          v-if="item.name == 'dateranges'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-config-provider :locale="zhCn">
            <el-date-picker
              :locale="zhCn"
              style="width: 350px"
              v-model="item.values"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-config-provider>
        </el-form-item>
        <!-- time -->
        <el-form-item
          v-if="item.name == 'times'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-config-provider :locale="zhCn">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              class="confirm"
              v-model="item.values"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :placeholder="item.tipConfig.val"
            >
            </el-time-picker>
          </el-config-provider>
        </el-form-item>
        <!-- timeranges -->
        <el-form-item
          class="w-600px"
          v-if="item.name == 'timeranges'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'blur' }] : ''
          "
        >
          <el-config-provider :locale="zhCn">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              class="confirm"
              is-range
              v-model="item.values"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-config-provider>
        </el-form-item>
        <!-- city -->
        <el-form-item
          v-if="item.name == 'citys'"
          :label="item.titleConfig.val"
          :prop="`orderNewForm.${index}.values`"
          :rules="
            item.titleShow.val
              ? [{ required: true, message: `${item.titleConfig.val}不能为空`, trigger: 'change' }]
              : ''
          "
        >
          <el-cascader
            ref="cascader"
            :placeholder="item.tipConfig.val"
            :props="
              item.valConfig.tabVal == 2
                ? cascaderPropsPCDS
                : item.valConfig.tabVal == 1
                ? cascaderPropsPCD
                : cascaderPropsPC
            "
            v-model="item.values"
            style="width: 350px"
          ></el-cascader>
        </el-form-item>
        <!-- img -->
        <el-form-item v-if="item.name == 'uploadPicture'">
          <div slot="label">
            <span v-show="item.titleShow.val" class="error">*</span>
            <span class="el-form-item__label">{{ item.titleConfig.val }}</span>
          </div>
          <upload-from
            @handleComplete="handleComplete"
            @handleRemoveComplete="handleRemoveComplete"
            :pictureList="[]"
            :limitNum="item.numConfig.val"
          ></upload-from>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.error {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
:deep(.el-form-item__label) {
  max-width: 150px;
}
.confirm {
  width: 350px;
}
</style>
