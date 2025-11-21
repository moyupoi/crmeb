<template>
	<view :data-theme="theme" class="location-permission-page">
		<view class="content">
			<!-- 标题 -->
			<view class="title">开启权限</view>
			<view class="subtitle">获取附近商圈</view>
			
			<!-- 主内容圈层 -->
			<view class="main-content">
				<!-- 当前位置显示圈层 -->
				<view class="current-location-display" v-if="isLocationEnabled && currentAddress">
					<view class="location-icon-small">
						<text class="iconfont icon-ic_location1"></text>
					</view>
					<view class="current-address-info">
						<text class="address-label">当前位置：</text>
						<text class="address-text">{{ currentAddress }}</text>
					</view>
				</view>
				
				<!-- 中心图标圈层 -->
				<view class="icon-container">
					<view class="icon-border">
						<image class="location-icon" :src="`${urlDomain}crmebimage/presets/areas-location.png`" mode="aspectFit"></image>
					</view>
				</view>
				
				<!-- 说明文字 -->
				<view class="description">
					<view class="desc-line" v-if="!isLocationEnabled">请确认手机定位是否开启，以获取商圈</view>
					<view class="desc-line" v-if="isLocationEnabled">
						<text>重新选择，</text>
						<text class="refresh-text" @click="handleRefresh">点击重选</text>
					</view>
					<view class="desc-line" v-if="!isLocationEnabled">
						<text>已开启，</text>
						<text class="refresh-text" @click="handleRefresh">点击刷新</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<button class="btn plain" @click="goHome">回首页</button>
			<button class="btn primary" @click="openLocation">开启</button>
		</view>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import {
		mapGetters
	} from "vuex";
	import locationManager from '@/utils/locationManager.js';
	
	let app = getApp();

	export default {
		computed: {
			...mapGetters(["isLogin"])
		},
		data() {
			return {
				theme: app.globalData.theme,
				urlDomain: this.$Cache.get("imgHost"),
				currentLocation: null, // 当前定位信息
				currentAddress: '', // 当前地址信息
				isLocationEnabled: false // 定位是否已启用
			}
		},
		async onLoad() {
			// 初始化定位管理器
			locationManager.init();
			
			// 检查缓存状态
			const fullLocationInfo = locationManager.getFullLocationInfo();
			
			const locationData = locationManager.getLocationData();
			if (locationData && !locationManager.isLocationDataExpired()) {
				// 已有有效的位置数据，直接跳转到选择页面
				uni.redirectTo({
					url: '/pages/circle/select'
				});
				return;
			}
			
			// 无有效位置数据，显示选择位置页面
			this.checkLocationPermission();
		},
		onShow() {
			// 页面显示时检查位置数据状态
			this.checkLocationPermission();
		},
		methods: {
			// 返回首页
			goHome() {
        this.$util.navigateTo('/pages/index/index');
			},
			
			// 检查位置数据状态
			checkLocationPermission() {
				const locationData = locationManager.getLocationData();
				
				// 只要有位置数据就认为可用，不依赖定位权限
				this.isLocationEnabled = !!locationData;
				if (locationData) {
					this.currentLocation = locationData;
					this.currentAddress = locationData.address || locationData.name || '已选择位置';
				} else {
					console.log('无位置数据');
				}
			},
			
			// 选择位置
			async chooseLocation() {
				try {
					// 首先检查是否有定位权限
					const hasPermission = await locationManager.requestLocationPermission();
					if (!hasPermission) {
						return;
					}
					
					const locationData = locationManager.getLocationData();
					if (locationData) {
						// 使用系统的位置选择器
						uni.chooseLocation({
							latitude: locationData.latitude,
							longitude: locationData.longitude,
							success: async (res) => {
								// 保存用户选择的位置（跳过权限检查）
								await locationManager.saveLocationData({
									latitude: res.latitude,
									longitude: res.longitude,
									updateTime: Date.now()
								}, res.name, res.address, true);
								
								this.currentLocation = locationManager.getLocationData();
								this.currentAddress = res.name || res.address;
								this.isLocationEnabled = true;
								
								uni.showToast({
									title: '位置已更新',
									icon: 'success'
								});
								
								// 延迟跳转到选择页面
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/circle/select'
									});
								}, 1500);
							},
							fail: (err) => {
								uni.showToast({
									title: '选择位置失败',
									icon: 'none'
								});
							}
						});
					}
				} catch (error) {
					console.error('选择位置错误:', error);
				}
			},
			
			// 开启位置选择或进入商圈
			async openLocation() {
				try {
					// 如果已有位置数据，直接跳转到商圈选择
					if (this.isLocationEnabled && this.currentAddress) {
						uni.navigateTo({
							url: '/pages/circle/select'
						});
						return;
					}
					uni.showLoading({ title: '检查权限中...' });
					
					// 先请求位置权限
					const hasPermission = await locationManager.requestLocationPermission(true);
					
					if (!hasPermission) {
						uni.hideLoading();
						console.log('位置权限获取失败');
						// 权限获取失败时，locationManager.requestLocationPermission 已经显示了相应的弹窗
						return;
					}
					
					uni.hideLoading();
					uni.showLoading({ title: '打开位置选择...' });
					
					// 有权限后，打开系统地图选择位置
					uni.chooseLocation({
						success: async (res) => {
							uni.hideLoading();
							
							// 保存用户选择的位置（跳过权限检查）
							await locationManager.saveLocationData({
								latitude: res.latitude,
								longitude: res.longitude,
								updateTime: Date.now()
							}, res.name, res.address, true);
							
							this.currentLocation = locationManager.getLocationData();
							this.currentAddress = res.name || res.address || '选择成功';
							this.isLocationEnabled = true;
							
							// 调试：打印缓存信息
							locationManager.debugCacheInfo();
							
							uni.showToast({
								title: '位置选择成功',
								icon: 'success'
							});
							
							// 延迟跳转到选择页面
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/circle/select'
								});
							}, 1500);
						},
						fail: (error) => {
							uni.hideLoading();
							
							// 如果是用户取消，不显示错误提示
							if (error.errMsg && !error.errMsg.includes('cancel')) {
								uni.showToast({
									title: '位置选择失败',
									icon: 'none'
								});
							}
						}
					});
				} catch (error) {
					uni.hideLoading();
					console.error('位置操作失败:', error);
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			},
			
			// 获取当前位置（保持兼容性）
			async getCurrentLocation() {
				try {
					const hasPermission = await locationManager.requestLocationPermission(false);
					if (hasPermission) {
						const locationData = locationManager.getLocationData();
						this.currentLocation = locationData;
						this.currentAddress = locationData.address || locationData.name || '定位成功';
						this.isLocationEnabled = true;
					}
				} catch (error) {
					console.log('获取位置失败', error);
					this.isLocationEnabled = false;
				}
			},
			
			// 根据经纬度获取地址信息
			getAddressByLocation(location) {
				// 这里可以调用地理编码API获取详细地址
				// 暂时使用位置信息作为地址显示
				this.currentAddress = `纬度: ${location.latitude.toFixed(6)}, 经度: ${location.longitude.toFixed(6)}`;
			},
			
			// 刷新定位 - 改为打开地图选择
			async handleRefresh() {
				try {
					// 先检查位置权限
					uni.showLoading({ title: '检查权限中...' });
					const hasPermission = await locationManager.hasPermission();
					
					if (!hasPermission) {
						// 尝试请求权限
						const granted = await locationManager.requestLocationPermission(true);
						if (!granted) {
							uni.hideLoading();
							console.log('位置权限获取失败');
							return;
						}
					}
					
					uni.hideLoading();
					uni.showLoading({ title: '打开位置选择...' });
					
					// 有权限后，打开系统地图选择位置
					uni.chooseLocation({
						success: async (res) => {
							// 保存用户选择的位置（跳过权限检查）
							await locationManager.saveLocationData({
								latitude: res.latitude,
								longitude: res.longitude,
								updateTime: Date.now()
							}, res.name, res.address, true);
							
							this.currentLocation = locationManager.getLocationData();
							this.currentAddress = res.name || res.address || '重新选择成功';
							this.isLocationEnabled = true;
							uni.showToast({
								title: '位置已更新',
								icon: 'success'
							});
							
							// 如果成功且有位置数据，可以跳转到选择页面
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/circle/select'
								});
							}, 1500);
						},
						fail: (error) => {
							console.log('用户取消重新选择位置:', error);
							
							// 如果是用户取消，不显示错误提示
							if (error.errMsg && !error.errMsg.includes('cancel')) {
								uni.showToast({
									title: '位置选择失败',
									icon: 'none'
								});
							}
						}
					});
				} catch (error) {
					console.error('刷新位置选择失败:', error);
					uni.showToast({
						title: '位置选择失败',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.location-permission-page {
		height: 100vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		
		.content {
			// flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 92rpx 0 56rpx 72rpx; /* 底部留出28px空间，56rpx = 28px */
			
			.title {
				width: 176rpx;
				height: 62rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 44rpx;
				color: #333333;
				line-height: 62rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				white-space: nowrap;
				overflow: hidden;
				margin-bottom: 20rpx;
			}
			
			.subtitle {
				// width: 176rpx;
				height: 62rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 44rpx;
				color: #333333;
				line-height: 62rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				white-space: nowrap;
				overflow: hidden;
				margin-bottom: 102rpx;
			}
			
			.main-content {
				// flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				// 当前位置显示圈层
				.current-location-display {
					width: 100%;
					max-width: 600rpx;
					background: rgba(85, 119, 255, 0.05);
					border: 1rpx solid rgba(85, 119, 255, 0.2);
					border-radius: 12rpx;
					padding: 24rpx;
					margin-bottom: 40rpx;
					display: flex;
					align-items: flex-start;
					
					.location-icon-small {
						margin-right: 16rpx;
						margin-top: 4rpx;
						
						.iconfont {
							font-size: 32rpx;
							color: #5577ff;
						}
					}
					
					.current-address-info {
						flex: 1;
						
						.address-label {
							font-size: 26rpx;
							color: #666666;
							margin-right: 8rpx;
						}
						
						.address-text {
							font-size: 28rpx;
							color: #333333;
							line-height: 40rpx;
							word-wrap: break-word;
							word-break: break-all;
							white-space: normal;
						}
					}
				}
				
				.icon-container {
					width: 600rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 20rpx;
					
					.icon-border {
						width: 500rpx;
						border-radius: 12rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.location-icon {
							width: 440rpx;
							height: 360rpx;
						}
					}
				}
				
				.description {
					text-align: center;
					
					.desc-line {
						margin-bottom: 10rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 26rpx;
						color: #999999;
						line-height: 36rpx;
						font-style: normal;
						text-transform: none;
						
						&:first-child {
							width: 442rpx;
							height: 36rpx;
							text-align: left;
						}
						
						&:last-child {
							text-align: center;
						}
						
						.refresh-text {
							color: #ff0000;
							text-decoration: underline;
							cursor: pointer;
						}
					}
				}
			}
		}
		
		.bottom-buttons {
			// position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 0 68rpx;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
			background-color: #fff;
			display: flex;
			gap: 18rpx;
			
			.btn {
				flex: 1;
				height: 64rpx;
				border-radius: 50rpx;
				font-size: 24rpx;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.plain {
					background: none;
					border: 1px solid #E93323;
					color: #E93323;
				}
				
				&.primary {
					color: #fff;
					background: #E93323;
				}
			}
		}
	}
</style>