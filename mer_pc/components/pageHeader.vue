<!--页面中头部展示标题使用-->
<script setup lang="ts">
import { toRefs } from 'vue'
import { linkNavigateTo } from '~/utils/util'
const props = defineProps({
  //副标题
  title: {
    type: String,
    default: '',
  },
  //主标题
  menuTitle:{
    type: String,
    default: '',
  },
  navigateToTitle: {
    type: Object,
    default: null,
  },
  page:{
    type: String,
    default: '',
  },
})
const { title } = toRefs(props)

const router = useRouter();

const goBack =()=>{
  router.go(-1);
}
</script>

<template>
  <div class="mt-20px mb-20px">
    <span class="fontColor333 fonts14 cursors" @click="linkNavigateTo('/')">首页{{page}} </span>
    <span v-if="navigateToTitle" class="fontColor333 fonts14 cursors"  @click="linkNavigateTo(navigateToTitle.linkUrl, navigateToTitle.params)"> > {{navigateToTitle.title}}</span>
    <span v-if="menuTitle" class="fontColor333 fonts14 cursors" @click="goBack"> > {{menuTitle}}</span>
    <span class="text-#666 fonts14"> > {{title}}</span>
  </div>
</template>

<style scoped lang="scss"></style>
