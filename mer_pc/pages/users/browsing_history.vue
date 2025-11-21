<script setup lang="ts">
import { browseRecordApi, collectMerchantApi } from '~/server/userApi'
import UserProductList from '~/components/userProductList.vue'
const { data: tableData, pending: listLoading } = await useAsyncData(async () => {
  const list = await browseRecordApi()
  let total = 0
  list.map((item) => {
    total += item.list.length
    item.date = item.date.slice(5, 7) + '月' + item.date.slice(8, 10) + '日'
  })
  return Promise.resolve({ list, total })
})
</script>

<template>
  <div class="browse h-100%">
    <div class="acea-row header mb-27px">
      <div class="text-18px text-#333 font-500 lh-18px ml-10px">我的足迹({{ tableData?.total }})</div>
    </div>
    <div class="bg-#FFF4F4 font-color text-12px h-32px lh-32px pl-10px mb-20px b-rd-6px">共{{ tableData?.total }}条记录，系统最多为您保存100条记录</div>
    <div v-loading="listLoading" class="h-82%">
      <div v-if="tableData?.total>0">
        <UserProductList
            :list="tableData?.list"
            type="browsing_history"
        ></UserProductList>
      </div>
      <div v-else class="w-100% h-100%">
        <empty-page title="暂无足迹呦~">
          <template v-slot:emptyImage>
            <img src="@/assets/images/wushoucang.png">
          </template>
        </empty-page>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
