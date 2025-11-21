<!--搜索条件筛选，可多选，商品搜索列表、商户搜索列表中使用-->
<script setup lang="ts">
import { toRefs, ref, onMounted, shallowRef } from 'vue'
const props = defineProps({
  //列表数据
  list: {
    type: Array,
    default: [],
  },
})
const { list } = toRefs(props)
const emit = defineEmits(['handleSubmitChecked'])
const selectedList = ref({})

//判断是否展示 展开收起 按钮
onMounted(() => {
  list.value.forEach((item:any,index:number)=>{
    if(document.getElementById(`myElement${index}`)){
      let myElement = document.getElementById(`myElement${index}`);
      if(item.type!=='productBrand'){
        if(myElement.offsetHeight>38){
          item.isShowBtnMore=true
        }else{
          item.isShowBtnMore=false
        }
      }else{
        if(myElement.offsetHeight>78){
          item.isShowBtnMore=true
        }else{
          item.isShowBtnMore=false
        }
      }
    }
  })
});

/**
 * 点击菜单
 * @param list 当前选中的大类
 * @param item 当前选中菜单的对象
 */
const handleMenu = (list: any, item: any) => {
  list.list.forEach((val, i) => {
    if (val.id == item.id) {
      val.isChoose = !val.isChoose
    }else{
      if(!list.multiple) val.isChoose =false
    }
  })
  //多选
  if(list.multiple){
    if (item.isChoose) {
      list.checked.push(item.id)
    } else {
      let index = list.checked.findIndex((itemn) => itemn === item.id)
      list.checked.splice(index,1)
    }
    selectedList.value[list.type] = list.checked
  }else{
    //单选
    if (item.isChoose) {
      selectedList.value[list.type] = item.id
    }else{
      selectedList.value[list.type] = ''
    }
  }
  emit('handleSubmitChecked', selectedList.value)
}
</script>

<template>
  <div class="b-rd-16px bg-#FFFFFF px-30px" v-if="list.length>0">
    <template v-for="(item, index) in list" :key="index">
      <div v-if="item.list && item.list.length"  class="sort acea-row">
        <div class="name mr-20px" :class="item.type==='productBrand'?'h-56px lh-56px':''">{{ item.name }}：</div>
        <div class="listCon acea-row row-between text-#333 text-14px cursors w-1050px" :class="item.showMore&&item.type!=='productBrand'?'on':item.showMore&&item.type==='productBrand'&&item.isShowBtnMore? 'band-on':''">
          <div :ref="'myElement'+index" :id="'myElement'+index" class="list acea-row w-960px h-auto">
            <div v-if="item.type==='productBrand'" class="mb-20px">
              <div class="acea-row pt-3px ml-1px">
                <div v-for="(items, idx) in item.list" :key="idx" class="w-116px h-56px flex-center brank-box relative" style="margin: -1px -1px 0 0;"  @click="handleMenu(item, items)" :title="items.name" :class="(items.isChoose &&item.multiple) || (selectedList[item.type]===items.id && !item.multiple) ? 'font-color borderSolE9' : 'borderSol-eee'">
                  <img v-show="(items.isChoose &&item.multiple) || (selectedList[item.type]===items.id && !item.multiple)" src="@/assets/images/xuanzhong1.png" class="checked">
                  <el-image v-if="items.icon" :src="items.icon" class="max-w-90px max-h-36px"></el-image>
                  <div class="overflow-hidden h-56px lh-56px text-center" v-else>{{items.name}}</div>
                  <div v-if="!items.isChoose" class="imgText w-116px h-56px overflow-hidden">{{items.name}}</div>
                </div>
              </div>
            </div>
            <template v-else>
              <div
                  class="item"
                  :class="(items.isChoose &&item.multiple) || (selectedList[item.type]===items.id && !item.multiple) ? 'font-color' : ''"
                  v-for="(items, idx) in item.list"
                  :key="idx"
                  @click="handleMenu(item, items)"
              >
                {{ items.name || items.tagName }}
              </div>
            </template>
          </div>
          <div v-if="!item.showMore && item.isShowBtnMore" class="cursors fontColor6 text-14px text-center" :class="item.type==='productBrand'?'h-56px lh-56px':''" @click="item.showMore = !item.showMore">
            收起 <span class="iconfont icon-gao"></span>
          </div>
          <div v-if="item.showMore && item.isShowBtnMore" class="fontColor6 text-14px text-center cursors" :class="item.type==='productBrand'?'h-56px lh-56px':''" @click="item.showMore = !item.showMore">
            展开 <span class="iconfont icon-di"></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.checked {
 position: absolute;
  right: 0;
  bottom: 0;
}
.borderSolE9{
  margin: -1px 0px 1px -1px !important;
}
.imgText{
  position: absolute;
  background-color: #fff;
  border: 2px solid #E93323;
  margin: 1px 4px 3px 2px;
  cursor: pointer;
  display: none;
  color: #E93323;
  line-height: 53px;
  text-align: center;
}
.brank-box:hover .imgText {
  display: block;
}
.on {
  height: 37px;
  overflow: hidden;
}
.band-on{
  height: 58px;
  overflow: hidden;
  margin-bottom: 20px;
}
.sort {
  border-bottom: 1px dashed #eeeeee;
  padding-bottom: 1px;
  padding-top: 20px;
  &:last-child {
    border: none;
  }
  .name {
    width: 70px;
    font-size: 14px;
    color: #666666;
  }

  .item {
    margin-right: 30px;
    margin-bottom: 19px;
    .icon {
      font-size: 15px;
      margin-left: 5px;
    }
    .iconfont {
      font-size: 15px;
      color: #e2e2e2;
      margin-left: 5px;
    }
  }
}
</style>
