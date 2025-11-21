<template>
  <div class="user-wrapper wrapper_1200">
    <div class="content acea-row relative mt-20px">
      <!--左侧菜单-->
      <div class="left-box">
        <div class="user-menu">
          <el-collapse v-model="opened">
            <el-collapse-item
                v-for="item in userMenu"
                :key="item.id"
                :title="item.name"
                :name="item.name"
                class="fonts16 fontColor333 font-500 oppoSans-M user-name"
            >
              <div
                  @click="handleGoPage(items)"
                  v-for="items in item.child"
                  :key="items.id"
                  class="menu-item child fonts14 mbtom24 fontColor6 font-400 oppoSans-R"
                  :class="{ active: menuCur == items.id }"
              >
                {{ items.name }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!--右侧页面-->
      <div class="right-box" :style="{ minHeight: ScrollHeight + 'px' }">
        <!--登录之后显示页面,协议不需要登录-->
        <div v-if="userStore.isLogin || (!userStore.isLogin&&route.path.includes('agreement_rules'))" class="right-centent">
          <NuxtPage></NuxtPage>
        </div>
        <!--没登录显示页面-->
        <div v-else class="w-100% h-100%">
          <not-logged-in></not-logged-in>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch,computed } from 'vue'
import { userMenuDefault } from '~/pages/users/defaultUser'
import { useUserStore } from '@/stores/user'
import NotLoggedIn from "~/components/notLoggedIn.vue";
import {ItemObject} from "~/types/global";
const userStore = useUserStore()

//获取浏览器值
const route = useRoute()

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 215)

//菜单
const userMenu = reactive<any[]>(userMenuDefault())

//左侧菜单选中的值
const menuCur = ref<string>(<string>route.query.type)
watch(
    () => <string>route.query.type,
    (newValue) => {
      menuCur.value = newValue
    },
)
//菜单除协议其余默认全部展开
const opened = computed(()=>{
  return userMenu.map((i:ItemObject)=>{
     if(i.name !=='规则协议') return i.name
  })
})


// 跳入页面
const handleGoPage = async (obj: any) => {
  menuCur.value = obj.id
  await linkNavigateTo(obj.pc_url, { type: obj.id, name: obj.name })
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse),
:deep(.el-collapse-item__wrap) {
  border: none !important;
}
:deep(.el-collapse-item__header) {
  --el-collapse-header-height: auto !important;
  border: none !important;
  --el-collapse-header-font-size: 16px;
  margin-bottom: 24px;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0 !important;
}
.user-wrapper {
  .left-box {
    width: 180px;
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 170px;
      background: #fff;
      color: #282828;
      .name {
        margin-top: 10px;
        padding: 0 15px;
      }
    }
    .user-menu {
      padding: 30px 30px 21px 45px;
      border-radius: 16px 16px 16px 16px;
      background: #fff;
      overflow: scroll;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      .user-name{
        margin-bottom: 24px;
        &:last-of-type {
          margin-bottom: 0px;
        }
      }

      &::-webkit-scrollbar {
        height: 0;
        width: 0;
        display: none; /* Chrome, Safari, and Opera */
      }
      .child:last-of-type {
        margin-bottom: 10px;
      }
      .menu-item {
        display: block;
        cursor: pointer;
        &.active {
          color: #e93323;
        }
      }
    }
  }
  .right-centent {
    background: #ffffff;
    border-radius: 16px 16px 16px 16px;
    width: 1000px;
    margin-left: 20px;
    padding: 30px 20px;
  }
}

.router-tips {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #333;
  a {
    color: #333;
  }
  span {
    color: #999999;
  }
}
</style>
