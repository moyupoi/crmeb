<script setup lang="ts">

import MerchantNews from "~/components/merchantNews.vue";
import {getMerIndexInfoApi} from "~/server/merchantApi";
import {ref} from "vue";
const route = useRoute()
const merId = ref<string>(<string>route.query.merId) //商户id
//商户信息
const { data: merchantInfo, pending: listLoading } = await useAsyncData(async () =>
    getMerIndexInfoApi(Number(merId.value)),
)
//商户分类
const { data: categoryList } = await useAsyncData(async () => getMerCategoryApi(Number(merId.value)))
</script>

<template>
<div>
  <div class="classify">
    <div class="mb-20px"><MerchantNews :merchantInfo="merchantInfo"></MerchantNews></div>
    <div class="b-rd-12px overflow-hidden px-30px py-30px bg-#fff">
      <el-collapse>
        <el-collapse-item
            v-for="item in categoryList"
            :key="item.id"
            :title="item.name"
            :name="item.id"
            class="mb-40px"
        >
          <div v-for="items in item.childList" :key="items.id" class="mt-24px">{{ items.name }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  <div class="product">
    <div class="w-970px b-rd-16px bg-#FFFFFF"></div>
  </div>
</div>
</template>

<style scoped lang="scss">

</style>