<template>
	<view id="home" :style="[pageStyle]" class="smallBox" :data-theme="theme">
    <diy-component ref="diyComponentRef" :merId="merId" :isSmallPage="isSmallPage" :regionIds="regionIds" :isScrolled="isScrolled" :componentData="componentData" v-if="componentData && componentData.value" @getDiyData="getDiyData"></diy-component>
		<!-- <view v-if="bottomNavigationIsCustom" class="footerBottom"></view> -->
	</view>
</template>
<script>
	import {
		getDiy
	} from '@/api/api.js';
	import {
		mapGetters
	} from "vuex";
  import diyComponent from "@/components/homeIndex/diyComponent";
	let app = getApp();
	export default {
		data() {
			return {
				theme: app.globalData.theme,
				isSmallPage: true, //是否是微页面，true是，false不是
				styleConfig: [],
				bgPic: '',
				bgTabVal: '',
				isFixed: true,
				storeHeight: 0,
				smallPage: false,
				sortList: [],
				sortMarTop: 0,
				showCateNav: false, //是否显示分类导航组件
				cateNavData: {}, //分类导航组件数据
				navIndex: 0,
				pageStyle: null,
				cateNavActive: 0,
				categoryId: 0, //分类id
				diyId: 0, //diyid
				isNoCommodity: false,
				showHomeComb: false,
				showHeaderSerch: false,
				domOffsetTop: 50,
				isScrolled: false,
				merId: 0,
				bgInfo: {
					colorPicker: '#f5f5f5',
					isBgColor: 1,
				},
        isLoading: false,
        regionIds: '', // 圈层ID集合，逗号分隔，传递给goodList组件
        componentData: {}
			}
		},
		components: {
      diyComponent,
		},
		computed: mapGetters(['bottomNavigationIsCustom', 'merchantAPPInfo']),
    watch: {
      regionIds: {
        handler(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            this.getDiyData(this.diyId);
          }
        },
        immediate: true
      }
    },
    onShow() {
      // 更新圈层ID（从圈层选择页面返回时）
      this.initRegionIds();

      // 通知组件位置可能已变化
      this.$nextTick(() => {
        uni.$emit('locationChanged');
      });
    },
		onLoad(options) {
			if (options.scene) {
				let value = this.$util.getUrlParams(decodeURIComponent(options.scene));
				if (value.id) this.diyId = Number(value.id);
				if (value.merId) this.merId = Number(value.merId);
			}
			if (options.id) {
				this.diyId = Number(options.id);
			}
			if (options.merId) {
				this.merId = Number(options.merId);
			}
      this.getDiyData(this.diyId)
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
			if (e.scrollTop > this.domOffsetTop) {
				this.isScrolled = true;
			}
			if (e.scrollTop < this.domOffsetTop) {
				this.$nextTick(() => {
					this.isScrolled = false;
				});
			}
		},
		methods: {
      // 初始化圈层ID参数
      initRegionIds() {
        try {
          const areasInfo = uni.getStorageSync('areas_info') || [];
          if (Array.isArray(areasInfo) && areasInfo.length > 0) {
            // 提取所有圈层ID，用逗号分隔
            this.regionIds = areasInfo
                .filter(area => area.id) // 过滤掉没有id的项
                .map(area => area.id)
                .join(',');
          } else {
            this.regionIds = '';
          }
        } catch (error) {
          this.regionIds = '';
        }
      },
			async getDiyData(id) {
        this.componentData = null
				this.styleConfig = [];
				uni.showLoading({
					title: '加载中...'
				});
				try {
					const {
						data
					} = await getDiy({
            id: id,
            circleIds: this.regionIds
          });
          this.componentData = data
					uni.setNavigationBarTitle({
						title: data.title
					});
					uni.setNavigationBarColor({
						//必须要16进制小写
						frontColor: data.titleColor,
						backgroundColor: data.titleBgColor.toString().toLowerCase(),
					})
					uni.hideLoading();
					this.pageStyle = {
						'background-color': data.isBgColor === 1 ? data.colorPicker : '',
						'background-image': data.isBgPic === 1 ? `url(${data.bgPic})` : '',
						'background-repeat': data.bgTabVal === 1 ? 'repeat-y' : 'no-repeat',
						'background-size': data.bgTabVal === 2 ? 'cover' : 'contain'
					};
					setTimeout(() => {
						this.isNodes++;
					}, 100);
				} catch (err) {
					uni.hideLoading();
					return this.$util.Tips({
						title: err
					});
				}
			},
		},
    onReachBottom() {
      this.$refs.diyComponentRef.getRecommend();
    }
	}
</script>

<style lang="scss" scoped>
	.smallBox {
		padding-bottom: calc(130rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(130rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
</style>