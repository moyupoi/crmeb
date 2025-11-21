<script setup lang="ts">
import { agreementInfoApi } from '~/server/userApi'
import { ref, watch } from 'vue'
const route = useRoute()
const title = ref<string>(<string>route.query.name)

const loading = ref<boolean>(false)
watch(
    () => route.query,
    (newValue) => {
      if (newValue) {
        title.value = <string>newValue.name
        loading.value = false
        getAgreement()
      }
    }
)

const agreementData = ref<any>('')
const getAgreement = async () => {
  try {
    loading.value = true
    const res =  await agreementInfoApi(route.query.type)
    loading.value = false
    agreementData.value = JSON.parse(res).agreement
  } catch (err: any) {
    loading.value = false
  }
}
getAgreement()
</script>

<template>
  <div>
    <div class="text-18px text-#333 font-500 mb-30px">{{title}}</div>
    <div v-loading="loading" class="detail-content px-10px htmlClass" v-html="agreementData ? agreementData.replace(/<br\/>/gi, '') : ''"></div>
  </div>

</template>

<style scoped lang="scss">
.detail-content {
  :deep(div)  {
    width: 100% !important;
  }
  :deep(img)  {
    display: block;
    width: 100% !important;
  }
}
</style>
