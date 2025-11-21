<template>
	<view class="header">
		<view class="title">{{title}} <text v-show="num">{{num?num:0}}</text></view>
    <view class="bottom_close" @click="close"><view class="iconfont icon-ic_close f-s-24"></view></view>
	</view>
</template>

<script>
	export default {
		props: {
			//是否展示小字样式
			title: {
				type: String,
				default: '',
			},
			num: {
				type: Number,
				default: 0,
			}
		},
		methods: {
			close() {
				this.$emit('close');
			},
		}
	}
</script>

<style scoped lang="scss">
	.header {
		position: relative;
		text-align: center;
		margin-bottom: 50rpx;
	
		.title {
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
		}
	}
</style>