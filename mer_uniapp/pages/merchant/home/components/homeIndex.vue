<template>
	<view id="home" :data-theme="theme" :style="[pageStyle]">
		<tui-skeleton v-if="showSkeleton"></tui-skeleton>
		<!-- 有网内容 -->
		<view class="page-index tui-skeleton page_count" :class="{'bgf':navIndex >0}"
			:style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<!-- 组合组件 -->
			<merHomeComb :bgInfo="bgInfo" v-if="showHomeComb" :dataConfig="homeCombData" :isScrolled="isScrolled" :navIndex="navIndex"
				:merId="merId">
			</merHomeComb>
			<!-- 顶部搜索框 -->
			<headerSearch :isScrolled="isScrolled" v-if="showHeaderSerch" :dataConfig="headerSerchCombData" :merId="merId"></headerSearch>
			<view class="page_content skeleton">
				<view v-if="navIndex === 0">
					<view v-for="(item, index) in styleConfig" :key="index">
						<!-- 头部店铺信息 -->
						<merHome v-if="item.name == 'homeStore'&&!item.isHide" :dataConfig="item" class="tui-skeleton-rect"
							:merchantInfo="merchantAPPInfo" :merId="merId" :isHome="true"></merHome>
						<!-- 导航组 -->
						<menus v-if="item.name == 'menus'&&!item.isHide" :dataConfig="item"></menus>
						<!-- 秒杀 -->
						<seckill-data v-if="item.name == 'seckill'&&!item.isHide" :dataConfig="item" :merId="merId"></seckill-data>
						<!-- 小程序直播 -->
						<!-- #ifdef MP -->
						<liveBroadcast v-if="item.name == 'liveBroadcast'&&!item.isHide" :dataConfig="item"></liveBroadcast>
						<!-- #endif -->
						<!-- 优惠券 -->
						<coupon v-if="item.name == 'homeCoupon'&&!item.isHide" :dataConfig="item" :merId="merId"></coupon>
						<!-- 图片魔方 -->
						<pictureCube v-if="item.name == 'pictureCube'&&!item.isHide" :dataConfig="item"></pictureCube>
						<!-- 热区 -->
						<hotSpot v-if="item.name == 'homeHotspot'&&!item.isHide" :dataConfig="item"></hotSpot>
						<!-- 轮播图 -->
						<swiperBg v-if="item.name == 'swiperBg'&&!item.isHide" :dataConfig="item"></swiperBg>
						<!-- 视频 -->
						<shortVideo v-if="item.name == 'video'&&!item.isHide" :dataConfig="item"></shortVideo>
						<!-- 拼团 -->
						<group v-if="item.name == 'group'&&!item.isHide" :dataConfig="item" :merId="merId"></group>
						<!-- 辅助线 -->
						<guide v-if="item.name == 'guide'&&!item.isHide" :dataConfig="item"></guide>
						<!-- 富文本-->
						<rich-text-editor v-if="item.name == 'richTextEditor'&&!item.isHide" :dataConfig="item" :richTextVal="item.richText.val"></rich-text-editor>
						<!-- 辅助空白-->
						<blank-page v-if="item.name == 'blankPage'&&!item.isHide" :dataConfig="item"></blank-page>
						<!-- 标题 -->
						<home-title v-if="item.name == 'titles'&&!item.isHide" :dataConfig="item"></home-title>
						<!-- 商品列表 -->
						<goodList v-if="item.name == 'goodList'&&!item.isHide" :dataConfig="item" @detail="goDetail" :merId="merId">
						</goodList>
						<!-- 选项卡商品列表-->
						<homeTab v-if="item.name == 'homeTab'&&!item.isHide" :dataConfig="item" @detail="goDetail" :merId="merId">
						</homeTab>
					</view>
				</view>

				<!-- 底部导航距离，做兼容处理的-->
				<view class="footerBottom"></view>
			</view>
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
	// import Cache from '../../utils/cache';
	import tuiSkeleton from '@/components/base/tui-skeleton.vue';
	import liveBroadcast from '@/components/homeIndex/liveBroadcast';
	import merHomeComb from '@/components/homeIndex/merHomeComb.vue';
	import recommend from "@/components/base/recommend.vue";
	import seckillData from "@/components/homeIndex/seckill.vue";
	import coupon from "@/components/homeIndex/coupon.vue";
	import menus from "@/components/homeIndex/menus.vue";
	import pictureCube from '@/components/homeIndex/pictureCube'
	import goodList from '@/components/homeIndex/goodList'
	import guide from '@/components/homeIndex/guide';
	import swiperBg from '@/components/homeIndex/swiperBg'
	import headerSearch from '@/components/homeIndex/headerSearch';
	import richTextEditor from '@/components/homeIndex/richTextEditor';
	import shortVideo from '@/components/homeIndex/video';
	import homeTab from '@/components/homeIndex/homeTab';
	import blankPage from '@/components/homeIndex/blankPage';
	import homeTitle from '@/components/homeIndex/title';
	import hotSpot from '@/components/homeIndex/hotSpot.vue';
	import group from "@/components/homeIndex/group.vue";
	import pageFooter from "@/components/pageFooter/index.vue";
  import merHome from '@/components/merHome/index.vue'
	import {
		getMerDiyInfoApi,
	} from '@/api/merchant.js';
	import {
		mapGetters
	} from "vuex";
	import {
		goProductDetail
	} from "@/libs/order";
	let app = getApp();
	export default {
		computed: mapGetters(['isLogin', 'uid', 'globalData', 'bottomNavigationIsCustom', 'merchantAPPInfo']),
		components: {
			merHomeComb,
			recommend,
			tuiSkeleton,
			seckillData,
			pageFooter,
			liveBroadcast,
			coupon,
			menus,
			pictureCube,
			goodList,
			swiperBg,
			headerSearch,
			guide,
			richTextEditor,
			shortVideo,
			homeTab,
			blankPage,
			homeTitle,
			hotSpot,
			group,
      merHome
		},
		props: {
			merId: { // 商户id
				type: Number,
				default: 0
			},
			isScrolled: { //是否开始滚动
				type: Boolean,
				default: false
			},
			diyId: { //模板 Id
				type: Number,
				default: 0
			}
		},
		watch: {
			merId: {
				handler(newValue, oldValue) {
					this.diyData();
				},
				immediate: true
			}
		},
		data() {
			return {
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				navIndex: 0, //判断首页显示内容，1显示分类页和商品，0首页
				theme: app.globalData.theme,
				styleConfig: [], //DIY数据
				homeCombData: {}, //组合组件数据
				showHomeComb: false, //是否显示组合
				showHeaderSerch: false, //是否显示搜索框
				headerSerchCombData: {}, //搜索框对象
				bgPic: '', //背景图片
				bgTabVal: '', //背景图片样式
				windowHeight: 0,
				pageStyle: {},
				where: {
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					page: 1,
					limit: 10,
					cid: 0,
					merId: 0,
					maxPrice: 0,
					minPrice: 0
				},
				loading: false,
				loadend: false,
				bgInfo:{
					colorPicker:'#f5f5f5',
					isBgColor:1,
				},
			}
		},
		onLoad(options) {
			//diy数据加载
			this.diyData();

			let that = this;
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					}
				});
			})
		},
		methods: {
			/**
			 * 获取DIY
			 * @param {number} id
			 * @param {boolean} type 区分是否是微页面
			 */
			diyData() {
				let that = this;
				that.styleConfig = []
				uni.showLoading({
					title: '加载中...'
				});
				getMerDiyInfoApi(this.merId, this.diyId).then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title
					});
					let data = res.data;
					this.reloadData();
					that.styleConfig = that.$util.objToArr(res.data.value);
					this.bgInfo.isBgColor=data.isBgColor
					this.bgInfo.colorPicker=data.colorPicker
					that.pageStyle = {
						'background-color': data.isBgColor === 1 ? res.data.colorPicker : '',
						'background-image': data.isBgPic === 1 ? `url(${res.data.bgPic})` : '',
						'background-repeat': res.data.bgTabVal === 1 ? 'repeat-y' : 'no-repeat',
						'background-size': res.data.bgTabVal === 2 ? 'cover' : 'contain'
					};
					uni.hideLoading();
					that.styleConfig.forEach((item) => {
						if (item.name === 'tabNav'&&!item.isHide) {
							that.showCateNav = true;
							that.cateNavData = item;
						}
						if (item.name === 'homeComb'&&!item.isHide) {
							that.showHomeComb = true
							that.homeCombData = item;

						}
						if (item.name === 'headerSerch'&&!item.isHide) {
							that.showHeaderSerch = true
							that.headerSerchCombData = item;
						}
					});

					setTimeout(() => {
						that.isNodes++;
					}, 100);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
					uni.hideLoading();
				});
			},
			//清除骨架屏
			reloadData() {
				this.showSkeleton = false;
			},
			clear() {
				this.loading = false;
				this.loadend = false;
				this.where = {
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					page: 1,
					limit: 20,
					cid: 0
				};
				this.productList = [];
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
			stopTouchMove() {
				return true //禁止新闻swiper手动滑动
			},
			goDetail(item) {
				goProductDetail(item.id, 0, '')
			},
		},
	}
</script>
<style>
	page {
		height: auto;
		display: flex;
		flex-direction: column;
		height: 100%;

	}
</style>
<style lang="scss" scoped>
	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}

</style>