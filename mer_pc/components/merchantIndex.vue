<script setup lang="ts">
import { indexMerchantListApi, pcHomeBannerApi, pcHomeConfigApi } from '~/server/homeApi'
import { ref, toRefs } from 'vue'
const props = defineProps({
  //列表数据
  goodStoreImage: {
    type: String,
    default: '',
  },
})
const { goodStoreImage } = toRefs(props)

const { data: merchantList, pending: listLoading } = await useAsyncData(async () => indexMerchantListApi(6), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 跳入页面
import { linkNavigateTo } from '~/utils/util'
const handleGoPage = (id: number) => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: id })
}
</script>

<template>
  <div class="wrapper_1200 merchantIndex mb-50px" v-if="merchantList.list?.length">
    <div class="mb-30px text-28px text-#333 ml-20px font-700 alimama">品牌好店</div>
    <div class="acea-row">
      <img :src="goodStoreImage" class="w-288px h-422px b-rd-16px object-cover">
      <div class="acea-row w-912px" v-loading="listLoading" style="margin-bottom: -15px">
        <template v-for="item in merchantList.list" :key="item.id">
          <div
            @click="handleGoPage(item.id)"
            v-if="item.proList.length"
            class="w-288px h-203px bg-#FFFFFF b-rd-16px py-15px pl-15px mb-15px merchant-item ml-16px cursors"
          >
            <div class="flex-between-center mb-15px pr-20px">
              <div class="flex-center">
                <el-image :src="item.pcLogo" class="w-36px h-36px b-rd-50% mr-10px"></el-image>
                <div>
                  <div class="flex-center line1">
                    <div class="text-14px text-#333 mr-6px line1 max-w-170px font-500">{{ item.name }}</div>
                    <div v-if="item.isSelf" class="labelClass bg-color text-#fff">自营</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="acea-row">
              <div
                v-for="items in item.proList.length === 2 ? item.proList : item.proList.slice(0, 2)"
                :key="items.id"
                class="w-122px h-122px relative b-rd-12px overflow-hidden mr-14px"
              >
                <el-image :src="items.image" class="w-122px h-122px"></el-image>
                <div class="px-8px py-4px price text-12px font-600 text-#fff absolute bottom-0 right-0">
                  <span class="oppoSans-M">￥</span><span class="text-16px dinProSemiBold">{{ items.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.merchantIndex {
  .price {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 12px 0px 12px 0px;
  }
}
</style>
