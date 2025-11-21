<!--商户列表，关注商品、店铺街-->
<script setup lang="ts">
import { toRefs } from 'vue'
const props = defineProps({
  //列表数据
  list: {
    type: Array,
    default: [],
  },
  //是否展示关注
  isShowFollow: {
    type: Boolean,
    default: false,
  },
})
const { list, isShowFollow } = toRefs(props)
const { onUnfollowMerchant } = useMerchant()
const emit = defineEmits(['handleSubmitSuccess'])
const handleCancel = (merId: number) => {
  onUnfollowMerchant(merId).then(() => {
    emit('handleSubmitSuccess')
  })
}

const colors = ['#E93323', '#E93323', '#EEEEEE']

// 跳入页面
import { linkNavigateTo } from '~/utils/util'
const handleGoPage = (id) => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: id })
}

const isNthChild = (index: number) => {
  return index % 5 === 0
}
</script>

<template>
  <div v-for="(item, index) in list" :key="index" class="mb-15px mer-item cursors">
    <div
        class="w-228px acea-row flex-col b-rd-16px items-center overflow-hidden pb-20px borderSol-eee bg-#FFFFFF"
        @click="handleGoPage(item.id || item.merId)"
    >
      <el-image class="w-228px h-228px" :src="item.pcGoodStoreCoverImage" lazy></el-image>
      <el-image class="w-80px h-80px b-rd-50% mb-18px borderSol-eee" :src="item.pcLogo" style="margin-top: -36px;"></el-image>
      <div class="flex-center mb-8px w-212px line1">
        <div v-if="item.isSelf" class="text-12px bg-color text-#fff b-rd-2px py-2px px-4px mr-6px lh-12px">自营</div>
        <div v-else class="h-16px"></div>
        <div class="fontColor333 text-16px line1">{{ item.merName || item.name }}</div>
      </div>
      <div v-if="item.starLevel"><el-rate v-model="item.starLevel" disabled/></div>
      <div
          v-if="isShowFollow"
          @click.stop="handleCancel(item.merId)"
          class="mt-10px w-86px h-30px lh-29px text-12px font-color text-center b-rd-16px cursors borderSolE9"
      >
        取消关注
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
