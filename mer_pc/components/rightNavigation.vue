<!--右侧黑条菜单-->
<script setup lang="ts">
import { useAppStore } from '~/stores/app'
const useStore = useAppStore()
import { ref, toRefs } from 'vue'
import useOrder from '~/composables/useOrder'
import ReceiveCouponList from "~/pages/product/receiveCouponList.vue";
const { handleIntoPage, getPlatChatConfig } = useOrder()

const props = defineProps({
  //列表数据
  isShowCoupon: {
    type: Boolean,
    default: false,
  },
  //列表数据
  productId: {
    type: Number,
    default: 0,
  },
})
const { isShowCoupon, productId } = toRefs(props)
/**
 * 监听页面滚动
 */
const isScrolling = ref<boolean>(false)

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})

const isShowTop = ref<boolean>(false)
const handleScroll = () => {
  if (process.client) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    isShowTop.value = scrollTop > 100
  }
}

//向上
const handleTop = () => {
  if (isScrolling.value) return; // 防止多次点击
  isScrolling.value = true;
  
  // 使用更简单的平滑滚动方法
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // 监听滚动结束
  const checkScrollEnd = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop === 0) {
      isScrolling.value = false;
    } else {
      requestAnimationFrame(checkScrollEnd);
    }
  };
  
  // 延迟检查，确保滚动开始
  setTimeout(() => {
    checkScrollEnd();
  }, 50);
};

//客服
const handleChat = async () => {
  getPlatChatConfig()
}
</script>

<template>
  <div :class="isShowCoupon ? 'w-320px' : 'w-40px'" class="fixed rightNavigation z-2010 top-0px flex h-100% right-0px">
    <ClientOnly>
    <div
        class="flex-col-center bg-#222222 h-100%  text-#fff"

    >
      <div
          @click="handleIntoPage('/users/user_info', { type: '11' })"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px"
      >
        <span class="iconfont icon-wode"></span>
        <div class="absolute floatTitle">个人信息</div>
      </div>

      <div
          @click="handleIntoPage('/order/shopping_cart', { type: '0' })"
          class="w-40px h-136px bg-color cursors flex-col-center mb-3px"
      >
        <span class="iconfont icon-gouwuche mb-10px"></span>
        <span class="text-14px text-#fff mb-10px verticalClass">购物车</span>
        <span class="w-16px h-16px b-rd-50% text-center bg-#FFFFFF flex-between-center text-12px font-color block">{{
            useStore.carNumber
          }}</span>
      </div>
      <div
          @click="handleIntoPage('/users/order_list', { type: '1' })"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px relative"
      >
        <span class="iconfont icon-dingdan"></span>
        <div class="absolute floatTitle">我的订单</div>
      </div>
      <div
          @click="handleIntoPage('/users/user_coupon', { type: '6' })"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px"
      >
        <span class="iconfont icon-youhuiquan"></span>
        <div class="absolute floatTitle w-110px text-center">优惠券</div>
      </div>
      <div
          @click="handleIntoPage('/users/collect_products', { type: '3' })"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px"
      >
        <span class="iconfont icon-shoucang"></span>
        <div class="absolute floatTitle">我的收藏</div>
      </div>
      <div
          @click="handleIntoPage('/users/browsing_history', { type: '8' })"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px"
      >
        <span class="iconfont icon-zuji"></span>
        <div class="absolute floatTitle">我的足迹</div>
      </div>
      <div @click="handleChat" class="floatClass absolute flex-col-center w-40px h-40px cursors bottom-75px mb-3px">
        <span class="iconfont icon-lianxikefu"></span>
        <div class="absolute floatTitle">联系客服</div>
      </div>
      <div
          v-show="isShowTop"
          @click="handleTop"
          class="floatClass flex-col-center w-40px h-40px cursors mb-3px absolute bottom-30px isShowTop"
      >
        <span class="iconfont icon-zhiding"></span>
      </div>
    </div>
    </ClientOnly>
    <!-- 优惠券抽屉-->
    <receive-coupon-list ref="receiveCouponRef" :productId="productId"></receive-coupon-list>
  </div>
</template>

<style scoped lang="scss">
.iconfont {
  font-size: 18px;
}
.isShowTop {
  transition: top 10s ease-out;
}
.floatClass:hover .floatTitle {
  display: block !important;
  animation: slideRight 0.5s forwards; /* 调用名为slideRight的动画，持续2秒 */
}

@keyframes slideRight {
  from {
    left: -150px; /* 元素初始位置在左侧屏幕外 */
  }
  to {
    left: -122px; /* 元素最终位置靠左边缘 */
  }
}
.floatClass:hover {
  width: 100%;
  background: #e93323;
}
.floatTitle {
  height: 40px;
  background: #222222;
  padding: 0 27px;
  font-size: 14px;
  color: #fff;
  line-height: 40px;
  left: -122px;
  border-radius: 3px;
  display: none;
}
.floatTitle::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -16px;
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent transparent #222222; /* 右边三角形的颜色 */
  transform: translateY(-50%);
}
.right-278px,
.right-0px {
  transition: all .7s;
 // transform: translateX(0);
}
.main_Box {
  //height: 78vh;
}
.rightNavigation {
  .title {
    display: none;
  }
}
</style>
