<template>
  <view class="form-btn-group">
    <button class="form-btn-group__btn confirm" @click="onConfirm">确定</button>
  </view>
</template>

<script>
export default {
  name: "index",
  methods: {
     onConfirm() {
      this.$emit('handleConfirm')
    }
  }
}
</script>

<style scoped lang="scss">
$btn-height: calc(110rpx + var(--safe-area-inset-bottom));
.form-btn-group {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $btn-height;
  background-color: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: var(--safe-area-inset-bottom);

&__btn {
   height: 88rpx;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 43rpx;
   font-size: 28rpx;
   font-weight: 500;
   background: #F5F5F5;

&.confirm {
   background: #2291F8;
   color: #fff;
 }
}
}
</style>