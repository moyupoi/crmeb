<template>
	<view :data-theme="theme">
    <!-- #ifdef MP-->
    <view class='cart_nav'>
      <nav-bar iconColor='#fff' ref="navBarRef" navTitle='提现' :isShowMenu="false" :isBackgroundColor="false" :backgroundColor="backgroundColor">
      </nav-bar>
    </view>
    <!-- #endif -->
		<view class='cash-withdrawal'>
      <view class="header">
        <view class="headerCon">
          <view class="money semiBold">{{settlementConfig.brokerage?settlementConfig.brokerage:0}}</view>
          <view>可提现金额</view>
        </view>
      </view>
			<view class='wrapper'>
        <view class="nav acea-row">
          <view class="item" :class="[currentIndex==0?'on6':currentIndex==1?'on7':currentIndex==2?'on8':'on9',currentIndex==index?'items':'']"
                v-for="(item,index) in navList" :key="index" @click="swichNav(item,index)">
            {{item.name}}
          </view>
          <view class="navBg" :class="currentIndex==0?'on6':currentIndex==1?'on7':currentIndex==2?'on8':'on9'"></view>
        </view>
        <!--银行卡、微信、支付宝-->
        <form :hidden='currentTab !== 0' @submit="subCash" report-submit='true'>
          <view class='list'>
            <view class="itemCon">
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>姓名</view>
                <view class='input'>
                  <input placeholder='请输入持卡人姓名' placeholder-class='placeholder' name="cardholder"
                         maxlength="20"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>卡号</view>
                <view class='input'>
                  <input type='number' placeholder='请输入卡号' placeholder-class='placeholder'
                         name="bankCardNo" maxlength="19"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>银行</view>
                <view class='input'>
                  <picker @change="bindPickerChange" :value="index" :range="bankList">
                    <view class="acea-row row-between-wrapper">
                      <text class='Bank'>{{bankList[index]}}</text>
                      <text class='iconfont icon-ic_rightarrow'></text>
                    </view>
                  </picker>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>提现</view>
                <view class='input'><input
                    :placeholder='settlementConfig.minPrice? "最低提现金额：￥"+ settlementConfig.minPrice:"最低提现金额：￥"+ 0'
                    placeholder-class='placeholder' name="closingPrice" type='digit'></input></view>
              </view>
            </view>
            <view class='tip'>
              当前可提现金额: <text
                class="price font-color">￥{{settlementConfig.brokerage?settlementConfig.brokerage:0}},</text>
              冻结佣金：<text class="font-color">￥{{settlementConfig.freezeBrokerage?settlementConfig.freezeBrokerage:0}}</text>
            </view>
            <view class='tip'>
              说明: 每笔佣金的冻结期为{{settlementConfig.freezeDay?settlementConfig.freezeDay:0}}天，到期后可提现
            </view>
          </view>
          <button  formType="submit" class='bnt'
                   :class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">立即提现</button>
        </form>
        <form :hidden='currentTab !== 2' @submit="subCash" report-submit='true'>
          <view class='list'>
            <view class="itemCon">
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>姓名</view>
                <view class='input'>
                  <input placeholder='请输入您的真实姓名' placeholder-class='placeholder' name="realName"
                         maxlength="20"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>账号</view>
                <view class='input'>
                  <input placeholder='请输入您的微信账号' placeholder-class='placeholder' name="wechatNo"
                         maxlength="20"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>提现</view>
                <view class='input'>
                  <input :placeholder='"最低提现金额：￥"+ settlementConfig.minPrice|| 0'
                         placeholder-class='placeholder' name="closingPrice" type='digit'
                         maxlength="5"></input>
                </view>
              </view>
              <view class='item acea-row row-top row-between'>
                <view class='name'>收款码</view>
                <view class="input acea-row">
                  <view class="picEwm" v-if="qrcodeUrlW">
                    <image :src="qrcodeUrlW"></image>
                    <text class='iconfont icon-ic_close' @click='DelPicW'></text>
                  </view>
                  <view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic("W")'
                        v-else>
                    <text class='iconfont icon-icon25201'></text>
                    <view>上传图片</view>
                  </view>
                </view>
              </view>
            </view>
            <view class='tip'>
              当前可提现金额: <text
                class="price font-color">￥{{settlementConfig.brokerage?settlementConfig.brokerage:0}},</text>
              冻结佣金：<text class="font-color">￥{{settlementConfig.freezeBrokerage?settlementConfig.freezeBrokerage:0}}</text>
            </view>
            <view class='tip'>
              说明: 每笔佣金的冻结期为{{settlementConfig.freezeDay?settlementConfig.freezeDay:0}}天，到期后可提现
            </view>
          </view>

          <button  formType="submit" class='bnt'
                   :class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">立即提现</button>
        </form>
        <form :hidden='currentTab !== 3' @submit="subCash" report-submit='true'>
          <view class='list'>
            <view class="itemCon">
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>姓名</view>
                <view class='input'>
                  <input placeholder='请输入您的真实姓名' placeholder-class='placeholder' name="realName"
                         maxlength="20"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>账号</view>
                <view class='input'>
                  <input placeholder='请输入您的支付宝账号' placeholder-class='placeholder' name="alipayAccount"
                         maxlength="20"></input>
                </view>
              </view>
              <view class='item acea-row row-between-wrapper'>
                <view class='name'>提现</view>
                <view class='input'>
                  <input :placeholder='"最低提现金额：￥"+settlementConfig.minPrice' placeholder-class='placeholder'
                         name="closingPrice" type='digit' maxlength="5"></input>
                </view>
              </view>
              <view class='item acea-row row-top row-between'>
                <view class='name'>收款码</view>
                <view class="input acea-row">
                  <view class="picEwm" v-if="qrcodeUrlZ">
                    <image :src="qrcodeUrlZ"></image>
                    <text class='iconfont icon-ic_close' @click='DelPicZ'></text>
                  </view>
                  <view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic("Z")'
                        v-else>
                    <text class='iconfont icon-icon25201'></text>
                    <view>上传图片</view>
                  </view>
                </view>
              </view>
            </view>
            <view class='tip'>
              当前可提现金额: <text
                class="price font-color">￥{{settlementConfig.brokerage?settlementConfig.brokerage:0}},</text>
              冻结佣金：<text class="font-color">￥{{settlementConfig.freezeBrokerage?settlementConfig.freezeBrokerage:0}}</text>
            </view>
            <view class='tip'>
              说明: 每笔佣金的冻结期为{{settlementConfig.freezeDay?settlementConfig.freezeDay:0}}天，到期后可提现
            </view>
          </view>

          <button  formType="submit" class='bnt'
                   :class="parseFloat(settlementConfig.brokerage)>parseFloat(settlementConfig.minPrice) ?'bg-color': 'bg-color-hui'">立即提现</button>
        </form>
        <!--余额-->
        <view :hidden="currentTab != 1">
          <form @submit="submitSub" report-submit='true'>
            <view class='list'>
              <view class="itemCon">
                <view class='item acea-row row-between-wrapper'>
                  <view class='name'>提现</view>
                  <view class='input acea-row row-between-wrapper'>
                    <input placeholder="请输入金额" type='number' v-model="toPrice" placeholder-class='placeholder'/>
<!--                    <input v-model="toPrice" placeholder-class='placeholder' placeholder='请输入金额' name="money" type='digit' />-->
                    <text class="font-color" @click="getAll">全部转入</text>
                  </view>
                </view>
              </view>
              <view class="tip">
                当前可提现金额： <text class=' mr10 font-color'>￥{{settlementConfig.brokerage?settlementConfig.brokerage:0}} </text>
              </view>
              <view class="tip">
                <view class="tips mb-16">注意事项：</view>
                <view class="tips-samll" v-for="item in noticeList" :key="item">
                  {{ item }}
                </view>
              </view>
            </view>
            <button formType="submit" class='bnt bg-color'>立即提现</button>
          </form>
        </view>
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
	import {
		extractCash,
		closingConfigApi
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
  import navBar from '@/components/navBar';
  import {getRechargeApi, transferIn} from "../../../api/user";
  import {setLinearThemeColor} from "../../../utils/setTheme";
	let app = getApp();
	export default {
    components: {
      navBar
    },
		data() {
			return {
        toPrice: '',
        noticeList: [],
				navList: [{
						'name': '银行卡',
						'icon': 'icon-yinhangqia',
						'type': 'bank'
					},
          {
            'name': '余额',
            'icon': 'icon-yinhangqia',
            'type': 'balance'
          },
					{
						'name': '微信',
						'icon': 'icon-weixin2',
						'type': 'wechat'
					},
					{
						'name': '支付宝',
						'icon': 'icon-icon34',
						'type': 'alipay'
					}
				],
				type: 'bank',
				currentTab: 0,
				index: 0,
        currentIndex:0, //索引值；
				bankList: [], //提现银行
				userInfo: [],
				isClone: false,
				settlementConfig: {}, //提现配置
				qrcodeUrlW: "",
				qrcodeUrlZ: "",
				isCommitted: false, //防止多次提交
				theme: app.globalData.theme,
        backgroundColor: '' //主题渐变色
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getClosingConfig();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
      this.backgroundColor = setLinearThemeColor();
			if (this.isLogin) {
        this.getRecharge();
				this.getClosingConfig();
			} else {
				toLogin();
			}
		},
		methods: {
      //余额立即转入
      submitSub: Debounce(function(e) {
        let that = this
        if(parseFloat(that.settlementConfig.brokerage)<=0) {
          return
        }
        // 转入余额
        if (parseFloat(that.toPrice) < 0 || parseFloat(that.toPrice) == NaN || that.toPrice == undefined || that.toPrice == "") {
          return that.$util.Tips({
            title: '请输入金额'
          });
        }
        uni.showModal({
          title: '提现',
          content: '提现余额后无法再次转出，确认是否提现余额',
          cancelColor: '#f55850',
          success(res) {
            if (res.confirm) {
              transferIn({
                price: parseFloat(that.toPrice)
              }).then(res => {
                return that.$util.Tips({
                  title: '申请成功',
                  icon: 'success'
                }, {
                  tab: 5,
                  url: '/pages/users/user_spread_user/index'
                });
              }).catch(err=>{
                return that.$util.Tips({
                  title: err
                });
              })
            } else if (res.cancel) {
              return that.$util.Tips({
                title: '已取消'
              });
            }
          },
        })
      }),
      //余额全部转入
      getAll(){
        if(parseFloat(this.settlementConfig.brokerage)<=0) {
          return this.$util.Tips({
            title: '您暂无佣金'
          });
        }
        this.toPrice = this.settlementConfig.brokerage
      },
      /**
       * 充值额度选择
       */
      getRecharge() {
        getRechargeApi()
            .then(res => {
              this.noticeList = res.data.noticeList || [];
            })
            .catch(err => {
              this.$util.Tips({
                title: err
              });
            });
      },
			uploadpic: function(type) {
				let that = this;
				that.$util.uploadImageOne({
					url: 'upload/image',
					name: 'multipart',
					model: "user",
					pid: 1
				}, function(res) {
					if (type === 'W') {
						that.qrcodeUrlW = res;
					} else {
						that.qrcodeUrlZ = res;
					}
				});
			},
			/**
			 * 删除图片
			 *
			 */
			DelPicW: function() {
				this.qrcodeUrlW = "";
			},
			DelPicZ: function() {
				this.qrcodeUrlZ = "";
			},
			/**
			 * 获取用户提现配置
			 *
			 */
			getClosingConfig() {
				closingConfigApi().then(res => {
					let data = res.data;
					this.$set(this, 'bankList', data.bankList);
					this.settlementConfig = res.data;
				})
			},
			swichNav: function(item, index) {
				this.currentTab = index;
			  this.type = item.type;
        this.currentIndex = index;
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value;
			},
			moneyInput(e) {
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.money = e.target.value
				})

			},
			subCash: Debounce(function(e) {
				let that = this,
					value = e.detail.value;
				if(parseFloat(that.settlementConfig.brokerage) <=0) return;
				switch (that.currentTab) {
					case 0:
						if (value.cardholder.length == 0) return this.$util.Tips({
							title: '请输入持卡人姓名'
						});
						if (value.bankCardNo.length == 0) return this.$util.Tips({
							title: '请输入卡号'
						});
						value.bankName = that.bankList[that.index];
						break;
					case 2:
						if (value.wechatNo.length == 0) return this.$util.Tips({
							title: '请输入微信号'
						});
						if (value.realName.length == 0) return this.$util.Tips({
							title: '请输入真实姓名'
						});
						if (!that.qrcodeUrlW) return this.$util.Tips({
							title: '请输入微信收款码'
						});
						value.paymentCode = that.qrcodeUrlW;
						break;
					default:
						if (value.alipayAccount.length == 0) return this.$util.Tips({
							title: '请输入支付宝账号'
						});
						if (value.realName.length == 0) return this.$util.Tips({
							title: '请输入真实姓名'
						});
						if (!that.qrcodeUrlZ) return this.$util.Tips({
							title: '请输入支付宝收款码'
						});
						value.paymentCode = that.qrcodeUrlZ;
						break;
				}
				value.type = this.type;
				if (value.closingPrice.length == 0) return this.$util.Tips({
					title: '请输入提现金额'
				});
				if (!(/^(\d?)+(\.\d{0,2})?$/.test(value.closingPrice))) return this.$util.Tips({
					title: '提现金额保留2位小数'
				});
				if (parseFloat(value.closingPrice) < parseFloat(that.settlementConfig.minPrice)) return this.$util
					.Tips({
						title: '提现金额不能低于' + that.settlementConfig.minPrice
					});
				if (this.isCommitted == false) {
					this.isCommitted = true;
					extractCash(value).then(res => {
						return this.$util.Tips({
							title: "申请成功",
							icon: 'success'
						}, {
							tab: 2,
							url: '/pages/users/user_transferOut/status'
						});
						this.isCommitted = false;
					}).catch(err => {
						this.isCommitted = false;
						return this.$util.Tips({
							title: err
						});
					});
				}
			})
		}
	}
</script>

<style>
	body {
		height: 100% !important;
	}
</style>
<style scoped lang="scss">
.cash-withdrawal{
  .accountTitle{
    @include linear-gradient(theme);
    position: fixed;
    left:0;
    top:0;
    width: 100%;
    z-index: 99;
    .sysTitle{
      width: 100%;
      position: relative;
      font-weight: 500;
      color: #fff;
      font-size: 34rpx;
      .iconfont{
        position: absolute;
        font-size: 36rpx;
        left:11rpx;
        width: 60rpx;
      }
    }
  }
  .header{
    width: 100%;
    height: 380rpx;
    @include linear-gradient(theme);
    font-size: 30rpx;
    font-weight: 400;
    color: #F5F5F5;
    text-align: center;
    padding-top: 88rpx;
    position: relative;

    &::after{
      position: absolute;
      content: ' ';
      width: 50%;
      height: 160rpx;
      @include linear-gradient(theme);
      left: 0;
    }

    &:before{
      position: absolute;
      content: ' ';
      width: 50%;
      height: 160rpx;
      @include linear-gradient(theme);
      right: 0;
      bottom: -146rpx;
    }

    .headerCon{
      background-image: url('../static/images/cashBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 278rpx;
    }

    .money{
      font-size: 76rpx;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 16rpx;
    }
  }
}

.cash-withdrawal .wrapper{
  width: 710rpx;
  margin: -100rpx auto 0 auto;
  position: relative;
  z-index: 9;

  .nav{
    width: 100%;
    height: 110rpx;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 24rpx 24rpx 0 0;
    position: relative;
    z-index: 9;

    &.on{
      height: unset;
      padding: 18rpx 0 8rpx 0;
      background-color: #fff;

      .item{
        padding-top: 0;
        padding-left: 30rpx;
        font-weight: 500;
        color: #333;
      }
    }

    .item{
      width: 33.33%;
      height: 84rpx;
      line-height: 84rpx;
      color: #666666;
      font-size: 26rpx;
      position: relative;
      z-index: 9;

      &.items{
        font-size: 28rpx;
        @include main_color(theme);
        font-weight: 500 !important;
      }

      &.on{
        width: 50%;
        padding-left: 0;
        text-align: center;
      }

      &.ons{
        color: var(--view-theme);
        font-weight: 500;
        font-size: 28rpx;
      }

      &.on1,&.on2,&.on3{
        font-weight: 400;
        padding-left: 0;
        text-align: center;
      }
      &.on6,&.on7,&.on8,&.on9{
        width: 25%;
        font-weight: 400;
        padding-left: 0;
        text-align: center;
      }
    }
    .navBg{
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 710rpx;
      height: 122rpx;
      left:0;
      bottom: 0;
      box-sizing: border-box;

      &.on6{
        background-image: url('../static/images/tixian06.png');
      }

      &.on7{
        background-image: url('../static/images/tixian07.png');
      }

      &.on8{
        background-image: url('../static/images/tixian08.png');
      }

      &.on9{
        background-image: url('../static/images/tixian09.png');
      }
    }
  }

  .bnt {
    font-size: 28rpx;
    color: #fff;
    width: 710rpx;
    height: 88rpx;
    text-align: center;
    border-radius: 50rpx;
    line-height: 88rpx;
    margin: 48rpx auto;
  }
}

.cash-withdrawal .wrapper .list {
  padding: 0 30rpx 48rpx 30rpx;
  background-color: #fff;
  border-radius: 0 0 24rpx 24rpx;

  .itemCon{
    border-bottom: 1px solid #EEEEEE;
    padding-bottom: 15rpx;
    margin-bottom: 42rpx;
  }
}

.cash-withdrawal .wrapper .list .item {
  font-size: 28rpx;
  color: #333;
  padding: 28rpx 0;
}

.cash-withdrawal .wrapper .list .item .name {
  width: 130rpx;
}

.cash-withdrawal .wrapper .list .item .input {
  width: 505rpx;

  input{
    font-size: 28rpx;
  }

  .iconfont{
    color: #ccc;
  }

  .icon-ic_camera{
    font-size: 38rpx;
    margin-bottom: 6rpx;
  }

  .all{
    font-size: 26rpx;
    color: var(--view-theme);
  }
}

.cash-withdrawal .wrapper .list .item .input .placeholder {
  color: #ccc;
}

.cash-withdrawal .wrapper .list .item .picEwm,
.cash-withdrawal .wrapper .list .item .pictrue {
  width: 128rpx;
  height: 128rpx;
  border-radius: 16rpx;
  position: relative;
  margin-right: 23rpx;
  background: #F5F5F5;
}

.cash-withdrawal .wrapper .list .item .picEwm image {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.cash-withdrawal .wrapper .list .item .picEwm .icon-ic_close {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 24rpx;
  width: 32rpx;
  height: 32rpx;
  background: #999999;
  border-radius: 0 16rpx 0 16rpx;
  color: #fff;
  text-align: center;
  line-height: 32rpx;
}

.cash-withdrawal .wrapper .list .item .pictrue {
  font-size: 22rpx;
  color: #BBBBBB;
}

.cash-withdrawal .wrapper .list .item .pictrue .icon-icon25201 {
  font-size: 47rpx;
  color: #DDDDDD;
  margin-bottom: 3px;
}

.cash-withdrawal .wrapper .list .tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;

  .price{
    color: var(--view-theme);
    margin: 0 16rpx;
  }

  .num{
    margin-left: 16rpx;
  }
}

.cash-withdrawal .wrapper .list .tip2 {
  font-size: 26rpx;
  color: #999;
  text-align: center;
  margin: 44rpx 0 20rpx 0;
}

.cash-withdrawal .wrapper .list .value {
  height: 135rpx;
  line-height: 135rpx;
  border-bottom: 1rpx solid #eee;
  width: 690rpx;
  margin: 0 auto;
}

.cash-withdrawal .wrapper .list .value input {
  font-size: 80rpx;
  color: #282828;
  height: 135rpx;
  text-align: center;
}

.cash-withdrawal .wrapper .list .value .placeholder2 {
  color: #bbb;
}
.bg-gray{
  background-color: var(--view-theme);
  opacity: 0.4;
}
</style>