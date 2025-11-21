<!--商户头像 资质 星级等-->
<script setup lang="ts">
import { toRefs } from 'vue'
const props = defineProps({
  //商户信息
  merchantInfo: {
    type: Object,
    default: null,
  },
  //商户id
  merId: {
    type: Number,
    default: 0,
  },
  //使用的来源,productDetail:商品页面使用
  fromType: {
    type: String,
    default: '',
  },
})
const { merchantInfo,merId,fromType } = toRefs(props)

const useMerchants = useMerchant()
//关注
const emit = defineEmits(['handleSubmitSuccess'])
const handleFollow = () =>{
  if(merchantInfo.value.isCollect){
    //取消关注
    useMerchants.onUnfollowMerchant(merId?.value).then(() => {
     emit('handleSubmitSuccess')
    })
  }else{
    // 关注
    useMerchants.onfollowMerchant(merId?.value).then(() => {
      emit('handleSubmitSuccess')
    })
  }
}

// 跳入页面
import { linkNavigateTo } from '~/utils/util'
import useOrder from "~/composables/useOrder";
const handleGoPage = () => {
  linkNavigateTo(`/merchant/merchant_home`, { merId: merId.value })
}

//营业执照
const { bool: dialogVisible, DialogOpen, DialogClose } = useDialog()


//联系客服
const { chatConfig } = useOrder()
const handleChat = async () => {
  let chatConfigData = {
    serviceLink:merchantInfo?.value.serviceLink,
    servicePhone:merchantInfo?.value.servicePhone,
    serviceType:merchantInfo?.value.serviceType
  }
  await chatConfig(chatConfigData)
}
</script>

<template>
 <div>
   <div class="w-210px b-rd-12px bg-#FFFFFF overflow-hidden flex-col px-20px py-20px merchantNews">
     <el-image @click="handleGoPage" class="w-60px h-60px b-rd-50%" :class="fromType ==='productDetail'?'cursors':''" :src="merchantInfo.avatar" lazy style="margin: 0 auto"></el-image>
     <div @click="handleGoPage" class="flex-center w-170px mt-16px mb-20px" :class="fromType ==='productDetail'?'cursors':''">
       <div v-if="merchantInfo.isSelf" class="text-12px bg-color text-#fff b-rd-2px py-2px mr-6px px-4px lh-12px min-w-33px">自营</div>
       <div class="fontColor333 text-14px">{{ merchantInfo.name }}</div>
     </div>

     <div v-if="fromType !=='productDetail'" @click="DialogOpen()" class="text-12px text-#999 mb-15px cursors">资质证照：<img src="@/assets/images/zhizhao.png"></div>
     <div class="text-12px text-#999 flex-y-center">店铺星级：<el-rate size="small" v-model="merchantInfo.starLevel" disabled /></div>
     <el-divider border-style="dashed" />
     <div class="acea-row">
       <div v-if="fromType ==='productDetail'" class="cursors w-78px h-30px lh-29px borderSol text-12px text-#333 text-center b-rd-15px mr-10px" @click="handleGoPage">进店逛逛</div>
       <div v-else @click="handleChat" class="cursors w-78px h-30px lh-29px borderSol text-12px text-#333 text-center b-rd-15px mr-10px">联系客服</div>
       <div @click="handleFollow" :class="merchantInfo.isCollect?'borderSol text-#333':'borderSolE9 font-color'" class="w-78px h-30px lh-29px text-12px text-center b-rd-15px cursors">{{merchantInfo.isCollect?'已关注':'关注店铺'}}</div>
     </div>
   </div>

   <el-dialog
       class="merchantNewsDialog"
       v-model="dialogVisible"
       :append-to-body="true"
       :show-close="false"
       center
       align-center
       width="532px"
       title="资质证照"
   >
     <span class="closeBtn iconfont icon-danchuangguanbi" @click="DialogClose()"></span>
     <div class="">
       <el-carousel :interval="5000" height="340px" arrow="always" class="w-100% m-auto">
         <el-carousel-item v-for="item in JSON.parse(merchantInfo.qualificationPicture)" :key="item" class="w-340px h-340px el-image">
           <el-image :src="item" class="w-340px h-340px el-image b-rd-12px" fit="fill" />
         </el-carousel-item>
       </el-carousel>
     </div>
   </el-dialog>
 </div>
</template>

<style>
.merchantNews{
  :deep(.el-dialog__header){
    padding: 30px 0 !important;
  }
}
</style>
<style scoped lang="scss">
//星级
:deep(.el-rate){
  height:auto !important;
  --el-rate-icon-margin: 0 !important;
  --el-rate-fill-color:#E93323 !important;
  --el-rate-icon-size: 12px !important;
}
.merchantNewsDialog{
  .el-carousel__item{
    width: 340px !important;
    left: 71px !important;
  }
}

.closeBtn {
  color: #fff;
  position: absolute;
  top: -33px;
  right: -33px;
  text-align: center;
  font-size: 24px;
  cursor: pointer;
}
.merchantNews{
  :deep(.el-divider--horizontal){
    margin: 15px 0 15px 0 !important;
  }
}

</style>