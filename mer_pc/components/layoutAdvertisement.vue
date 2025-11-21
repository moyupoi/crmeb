<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import {useAppStore} from "~/stores/app";
const useStore = useAppStore()
const props = defineProps({
  //列表数据
  pcHomeCon: {
    type: Object,
    default: null,
  }
})
const { pcHomeCon } = toRefs(props)

//是否展示头部广告
const isShowAdvertisement = ref<boolean>(true)
</script>

<template>
  <div>
    <div class="relative wrapper_1200">
      <span @click="isShowAdvertisement=false" v-if="isShowAdvertisement" class="iconfont icon-weitongguo1 pos-absolute z-10 text-#9EA9AD cursors right-0px top-20px" style="font-size: 22px"></span>
    </div>
    <div class="advertisement" :class="isShowAdvertisement ? 'on' : ''">
      <a v-if="pcHomeCon.advertisement.linkUrl" :href="pcHomeCon.advertisement.linkUrl" class="w-100% h-auto" target="_blank">
        <img :src="pcHomeCon.advertisement.imageUrl" class="w-100% h-auto">
      </a>
      <img v-else :src="pcHomeCon.advertisement.imageUrl" class="w-100% h-auto">
    </div>
  </div>

</template>

<style scoped lang="scss">
.advertisement{
  width: 100%;
  min-width: 1200px;
  position: fixed;
  line-height: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  transform: translate3d(0, -100%, 0);
  top: 0;
  left: 0;
  &.on {
    transform: translate3d(0, 0, 0);
    position: static;
  }
}
</style>