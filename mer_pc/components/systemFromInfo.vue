<script setup lang="ts">
const props = defineProps({
  //模态框状态
  orderExtend: {
    type: Array,
    default: () => {
      return []
    },
  },
})
</script>

<template>
  <!--系统表单详情-->

  <div v-if="orderExtend.length" class="w-100% borRadius bg-#FFF py-30px px-30px mbtom20">
    <div v-for="(itm, idx) in orderExtend" :key="idx" class="mb20px">
      <div v-for="(item, index) in itm" :key="index" class="acea-row justify-between mb20px">
        <div class="text-14px fontColor6">{{ item.title }}{{ item.title.includes(':') ? '' : '：' }}</div>
        <div v-if="!Array.isArray(item.value)" class="text-14px fontColor333">{{ item.value || '--' }}</div>
        <div v-else class="text-14px fontColor333 flex">
          <div v-for="(pic, i) in item.value" :key="i" class="">
            <el-image v-if="pic.includes('http')" :src="pic" :preview-src-list="[pic]" class="w-80px h-80px b-rd-6px ml-10px"></el-image>
            <div v-else class="text-14px fontColor333 ml-5px flex-center">
              {{ pic }}
              <div class="ml-6px" v-show="i < item.value.length - 1"> -- </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
