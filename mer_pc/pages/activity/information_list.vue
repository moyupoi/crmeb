<script setup lang="ts">
import { reactive } from 'vue'
import { PageQuery } from '~/types/global'
import { linkNavigateTo } from '~/utils/util'
import { articleCategoryApi, articleHotListApi, articleListApi } from '~/server/activityApi'

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 200)

const showMore = ref<boolean>(true)
const isShowBtnMore = ref<boolean>(true)

//判断是否展示 展开收起 按钮
onMounted(() => {
  if (document.getElementById('information')) {
    let myElement = document.getElementById('information')
    if (myElement.offsetHeight > 37) {
      isShowBtnMore.value = true
    } else {
      isShowBtnMore.value = false
    }
  }
})

//文章分类
const { data: categoryList } = await useAsyncData(async () => articleCategoryApi(), {
  default: () => [],
})

//热门列表
const { data: articleHotList } = await useAsyncData(async () => articleHotListApi(), {
  default: () => [],
})

/**
 * 列表
 */
const where = reactive<PageQuery>({
  page: 1,
  limit: 10,
  cid: 0,
})
const {
  data: tableData,
  refresh,
  pending: listLoading,
} = await useAsyncData(async () => articleListApi(where.cid, where), {
  default: () => ({
    list: [],
    total: 0,
  }),
})
// 分页数据
const pageChange = (e: number) => {
  where.page = e
  refresh()
}

//点击分类
const handleCategoryChange = (id: number) => {
  where.cid = id
  refresh()
}

// 跳入页面
const handleGoPage = (id: number) => {
  linkNavigateTo(`/activity/information_info`, { informationId: id })
}
</script>

<template>
  <div class="information_list">
    <div class="flex wrapper_1200 pt-20px">
      <ClientOnly>
        <div class="w-860px borRadius bg-#FFFFFF pb-20px" v-loading="listLoading">
          <div class="pl-20px pr-10px pt-20px borderBotSol">
            <div :class="showMore ? 'on' : ''" class="acea-row flex-justify-between h-auto">
              <div class="w-90% acea-row cursors h-auto" id="information">
                <div
                  class="mr-40px text-14px w-44px classification"
                  :class="where.cid === 0 ? 'font-color' : 'text-#666'"
                  @click="handleCategoryChange(0)"
                >
                  全部
                </div>
                <div
                  v-for="item in categoryList"
                  :key="item.id"
                  :class="where.cid === item.id ? 'font-color' : 'text-#666'"
                  class="classification_Information classification mb-20px text-14px"
                  @click="handleCategoryChange(item.id)"
                >
                  {{ item.name }}
                </div>
              </div>
              <div
                v-if="!showMore && isShowBtnMore"
                class="cursors fontColor6 text-14px text-center"
                @click="showMore = !showMore"
              >
                收起 <span class="iconfont icon-gao"></span>
              </div>
              <div
                v-if="showMore && isShowBtnMore"
                class="fontColor6 text-14px text-center cursors"
                @click="showMore = !showMore"
              >
                更多 <span class="iconfont icon-di"></span>
              </div>
            </div>
          </div>
          <div v-if="tableData.total > 0" style="margin-top: -10px">
            <div v-for="item in tableData.list" :key="item.id" class="pl-20px pt-30px cursors">
              <div class="acea-row mt-10px" @click="handleGoPage(item.id)">
                <el-image :src="item.cover" class="w-200px h-132px b-rd-12px"></el-image>
                <div class="ml-20px">
                  <div class="text-#333 text-16px font-500 line1 mb-20px w-582px oppoSans-M">{{ item.title }}</div>
                  <div class="text-#666 text-14px line2 h-44px w-582px lh-22px">{{ item.synopsis }}</div>
                  <div class="mt-28px flex-y-center text-#999 text-14px">
                    <span class="iconfont icon-zuji mr-5px oppoSans-R"></span>
                    <span class="oppoSans-R">{{ item.createTime }}</span>
                    <span class="iconfont icon-liulan ml-20px mr-5px oppoSans-R"></span>
                    <span class="oppoSans-R">{{ item.visit }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="acea-row row-middle mt-20px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="tableData.total"
                class="page-item"
                :page-size="where.limit"
                :current-page="where.page"
                @update:current-page="pageChange"
              />
            </div>
          </div>
          <div v-else class="w-100%" :style="{ height: ScrollHeight + 'px' }">
            <empty-page title="暂无资讯信息哟~">
              <template v-slot:emptyImage>
                <img src="@/assets/images/dayang.png" />
              </template>
            </empty-page>
          </div>
        </div>
      </ClientOnly>
      <div class="w-320px ml-20px">
        <div class="bg-#FFFFFF px-20px py-20px borRadius">
          <div class="text-#333 text-18px mb-30px fontsweight">热门资讯</div>
          <div
            v-for="(item, index) in articleHotList?.length > 5 ? articleHotList.slice(0, 5) : articleHotList"
            :key="item.id"
            class="borderBotDas pb-20px cursors mt-20px"
            @click="handleGoPage(item.id)"
          >
            <div class="acea-row mb-20px">
              <span class="text-16px font-color mr-5px">{{ index + 1 }}.</span>
              <span class="text-#333 text-16px line2 w-240px">{{ item.title }}</span>
            </div>
            <div class="text-12px text-#999 flex-y-center">
              <span class="iconfont icon-zuji mr-5px"></span>
              <span>{{ item.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html {
  background: #f5f5f5;
}

:deep(.el-dropdown_popper),
:deep(.el-popper) {
  background: #fff !important;
  --el-dropdown-menuItem-hover-color: #fff !important;
  --el-dropdown-menuItem-hover-fill: #fff !important;
}
:deep(.el-dropdown-menu) :deep(.el-dropdown-menu__item) {
  padding: 0 !important;
}
.information_list {
  .on {
    height: 37px;
    overflow: hidden;
  }
}
.classification_Information {
  margin-right: 40px;
  &:last-child {
    margin-right: 0;
  }
}
.classification:hover {
  color: #e93323;
}
.classificationB_Information {
  margin-right: 30px;
  margin-bottom: 20px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
