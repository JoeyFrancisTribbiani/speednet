<template>
	<view style="overflow-x: hidden;">
		<view class="bg">
			<image class="bg-img" src="/static/bg.png" mode=""></image>
		</view>

		<view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<image class="nav-back" src="/static/back1.png" mode="" @click="back"></image>
			<text class="nav-title">会员中心</text>
			<view class="nav-space"></view>
		</view>

		<view class="info" :style="{marginTop: statusBarHeight + 44 + 'px'}">
			<image class="info-bg" src="/static/info-bg.png" mode=""></image>
			<view class="info-content">
				<view class="info-avatar">

					<!-- <image class="info-avatar-pic" v-if=userInfo.avatar_file && userInfo.avatar_file.url :src="userInfo.avatar_file.url" mode=""></image> -->
					<image class="info-avatar-pic" :src="avatar_file.url" style="border-radius: 50%" mode=""></image>
				</view>
				<view class="info-name" @click.capture="toUserInfo">
					<text class="info-name"
						v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
					<text class="info-name" v-else>{{$t('mine.notLogged')}}</text>
					<!-- <text class="info-name">刘翠花</text> -->
					<text class="info-level">升级至尊会员享额外特权</text>
				</view>
			</view>
			<view class="info-asset">
				<view class="info-asset-item">
					<text class="iai-title">状态</text>
					<text class="iai-value">{{my_is_pause}}</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">剩余时长</text>
					<text class="iai-value">{{my_remaining_minites}}</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">订阅时间</text>
					<text class="iai-value">{{my_start_time}}</text>
				</view>
			</view>
		</view>
		<view class=" pause" hover-class="hover" @click="pause">
			<text class="button-text">{{pauseBtn}}</text>
		</view>


		<view class="main-title">
			<text>会员订阅</text>
		</view>

		<scroll-view scroll-x>
			<view class="recharge">
				<view class="recharge-item" :class="current == index ? 'recharge-item-active': ''"
					v-for="(item, index) in rechargeOptions" :key="index" :style="{marginLeft: !index ? '30rpx': ''}"
					@click="rechargeChange(index)">
					<view class="recharge-tag" v-if="item.show_tag">
						<text class="recharge-tag-text">{{item.tag}}</text>
					</view>
					<text class="recharge-item-duration">{{ item.hours }} 小时</text>
					<view class="recharge-item-price">
						<text class="rmb">￥</text>
						<text class="recharge-item-price-text">{{ item.price }}</text>
					</view>
					<text class="recharge-item-des">{{ item.comment }}</text>
					<!-- 					<text class="recharge-item-des" v-for="(desItem, desIndex) in item.comment"
						:key="desIndex">{{ desItem }}</text> -->
				</view>
			</view>
		</scroll-view>

		<view class="button update" hover-class="hover" @click="updateNow">
			<text class="button-text">立即订阅</text>
		</view>

		<text class="tip">升级得800金币</text>

		<view class="main-title">
			<text>会员特权</text>
		</view>
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="privilege">
			<view class="privilege-item" v-for="(item, index) in privilegeList" :key="index" hover-class="hover"
				@click="privilegeClick(index)">
				<image class="privilege-item-pic" :src="item.pic" mode=""></image>
				<text class="privilege-item-text">{{ item.text }}</text>
			</view>
		</view>

		<view class="level" v style="display: none;">
			<view class="level-rate">
				<text class="level-rate-text1">当前返利比例</text>
				<text class="level-rate-text2">25%</text>
			</view>

			<view class="level-info">
				<image class="level-info-icon" src="~@/static/vip.png" mode=""></image>
				<text class="level-info-text">V1至尊会员</text>
				<text class="level-info-integral">0</text>
			</view>

			<view class="level-distance">
				<text class="level-distance-text">距V1会员还有1250点</text>
				<view class="button level-distance-button" hover-class="hover">
					<text class="button-text">查看详情</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();

	const membership = uniCloud.importObject("membership")

	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight

	export default {
		onTabItemTap(e) {
			console.log('-------------------------onTabItemTap')
			uni.reLaunch({
				url: '/pages/speednet-membership/memberCenter'
			})
		},
		filters: {
			timeFilter(value) {
				return parseFloat(value).toFixed(2)
			},
			shijianfilter: function(value) {
				var dt = new Date(value)

				var y = dt.getFullYear()
				//这里month得加1
				var m = dt.getMonth() + 1
				var d = dt.getDate()

				var hh = dt.getHours()
				var mm = dt.getMinutes()
				// var ss = dt.getSeconds();
				// return `${y}-${m}-${d}:${hh}:${mm}`
				return `${y}-${m}-${d}`
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
			// #ifdef APP-PLUS
			,
			remainTimes() {

			},
			appVersion() {
				return getApp().appVersion
			}
			// #endif
			,
			appConfig() {
				return getApp().globalData.config
			},
			avatar_file() {
				if (this.userInfo.avatar_file && this.userInfo.avatar_file.url) {
					return this.userInfo.avatar_file
				} else {
					return "/static/avatar.png"
				}
			}
		},
		onLoad() {
			console.log("onLoad:" + JSON.stringify(this.userInfo));
		},
		onReady() {

			db.collection("speednet-member-plan").get()
				.then((res) => {
					this.$data.rechargeOptions = res.result.data
				})
			this.getMembership()
		},
		onShow() {
			if (!this.userInfo.username) {
				console.log("if (this.userInfo):" + this.userInfo);
				return
			}
			if (!this.userInfo.mobile) {
				console.log("!this.userInfo.mobile:" + JSON.stringify(this.userInfo));
				uni.showModal({
					content: '请绑定手机！',
					showCancel: false,
					complete: () => {
						uni.reLaunch({
							url: '/pages/ucenter/userinfo/bind-mobile/bind-mobile'
						})
					}
				});
			}
		},
		data() {
			return {
				my_is_pause: '',
				tabClick: false, // true 表示是两次点击中的第一次点了 tabBar
				my_remaining_minites: '',
				my_start_time: '',
				pauseBtn: '',
				statusBarHeight,
				current: 0,
				rechargeOptions: [],
				privilegeList: [{
						pic: '/static/coin.png',
						text: '积分签到',
						url: 'button'
					},
					{
						pic: '/static/birthday.png',
						text: '个人资料',
						url: '/pages/ucenter/userinfo/userinfo'
					},
					{
						pic: '/static/active.png',
						text: '我的积分',
						url: 'button'
					},
					{
						pic: '/static/notic.png',
						text: '意见反馈',
						url: '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback'
					},

					{
						pic: '/static/goods.png',
						text: '应用设置',
						url: '/pages/ucenter/settings/settings'
					},
					// {
					// 	pic: '/static/red-bag.png',
					// 	text: '关于我们',
					// 	url: '/pages/ucenter/userinfo/userinfo'
					// },
					// {
					// 	pic: '/static/speed.png',
					// 	text: '极速到账'
					// },
					// {
					// 	pic: '/static/share.png',
					// 	text: '分享领券'
					// },
					// {
					// 	pic: '/static/active.png',
					// 	text: '专享活动'
					// },
					// {
					// 	pic: '/static/birthday.png',
					// 	text: '生日折扣'
					// },
					// {
					// 	pic: '/static/notic.png',
					// 	text: '上架提醒'
					// },
					// {
					// 	pic: '/static/kefu.png',
					// 	text: '专属客服'
					// }
				]
			}
		},
		methods: {
			onTabItemTap(e) {
				// tab 点击时执行，此处直接接收单击事件
				console.log(e)
				if (this.tabClick) { // 200ms 内再次点击
					// 这里就是模拟的双击事件，可以写类似数据刷新相关处理
					uni.reLaunch({
						url: '/pages/speednet-membership/memberCenter'
					})
				}
				this.tabClick = true
				setTimeout(() => {
					this.tabClick = false // 200ms 内没有第二次点击，就当作单击
				}, 200)

			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			async reload() {
				// location.reload()
				// uni.redirectTo("/pages/speednet-member-plan/detail")
				uni.reLaunch({
					url: '/pages/speednet-membership/memberCenter'
				})

			},
			async pause() {
				if (this.my_is_pause == '生效') {
					uni.sendNativeEvent("pause", '', function(e) {
						this.configyaml = JSON.stringify(e)
						uni.showToast({
							title: JSON.stringify(e),
							icon: 'error',
						});
						console.log("sendNativeEvent-----------回调" + JSON.stringify(e));
					});
				}


				uni.showLoading({
					mask: true
				})
				const membership = uniCloud.importObject('membership')
				var result = await membership.pause(this.userInfo._id)
				uni.hideLoading()
				uni.showModal({
					title: "提示",
					content: result,
					showCancel: false,
					confirmText: "知道了",
					complete: () => {
						uni.reLaunch({
							url: '/pages/speednet-membership/memberCenter'
						})
						// uni.redirectTo("pages/speednet-member-plan/detail")
						// uni.navigateBack({
						// 	delta: 0
						// })
					}
				});
			},
			getHourMinite(minites) {
				if (minites < 0) {
					minites = 0
				}
				return Math.floor(minites / 60) + '小时' + (minites % 60) + '分'
			},
			async getMembership() {
				const membership = uniCloud.importObject('membership')
				var myship = await membership.getMembership(this.userInfo._id)
				console.log("membership" + JSON.stringify(myship))
				if (myship == "") {
					this.my_remaining_minites = '0分钟'
					this.my_is_pause = '暂停'
					this.pauseBtn = '恢复计时'
					this.my_start_time = '-'
				} else {
					this.my_is_pause = myship.is_pause ? '暂停' : '生效'
					this.pauseBtn = myship.is_pause ? '恢复计时' : '暂停计时'
					if (myship.is_pause) {
						this.my_remaining_minites = this.getHourMinite(myship.remaining_minites)
						this.my_start_time = this.shijianfilter(myship.start_time)
					} else {
						// var now = new Date().getTime()
						// var reverse = Date.parse(myship.reverse_date)
						// var sub = now - reverse
						// var my_time = Math.floor(sub / (60 * 1000))
						// var remaining = myship.remaining_minites - my_time
						var remaining = myship.remaining_minites
						this.my_start_time = this.shijianfilter(myship.start_time)
						if (remaining <= 0) {
							this.my_remaining_minites = '0分钟'
						} else {
							this.my_remaining_minites = this.getHourMinite(remaining)
							let clock = setInterval(() => {
								remaining--
								this.my_remaining_minites = this.getHourMinite(remaining)
								if (remaining == 0) {
									clock.clear()
								}
							}, 60000)
						}
					}
				}
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				console.log("fuck" + this.userInfo._id)
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore') + data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(() => {
						uni.hideLoading()
					})
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/pages/ucenter/userinfo/userinfo'
				})
			},
			rechargeChange(index) {
				this.current = index
			},
			async updateNow() {
				if (!this.userInfo) return uni.showToast({
					title: '请先登录',
					icon: 'none'
				});

				uni.showLoading({
					mask: true
				})
				const membership = uniCloud.importObject('membership')
				let subscribe = await membership.subscribe(this.userInfo._id, this.userInfo.nickname || this.userInfo
					.username, this.rechargeOptions[this.current].price, this.rechargeOptions[this.current].hours)
				uni.hideLoading()
				let msg = '';
				msg = subscribe ? `成功订阅「${this.rechargeOptions[this.current].hours}小时」` : `订阅失败`;
				uni.showModal({
					title: "提示",
					content: msg,
					showCancel: false,
					confirmText: "知道了",
					complete: () => {
						uni.reLaunch({
							url: '/pages/speednet-membership/memberCenter'
						})
						// uni.redirectTo("pages/speednet-member-plan/detail")
						// uni.navigateBack({
						// 	delta: 0
						// })
					}
				});
				// }).finally(() => {

				// })
				// uni.navigateBack({
				// 	delta: 0
				// })
			},
			privilegeClick(index) {
				uni.navigateTo({
					url: this.privilegeList[index].url
				})
				// uni.showToast({
				// 	icon: "none",
				// 	title: `点击了「${this.privilegeList[index].text}」`
				// })
				switch (index) {
					case 0:
						this.signIn();
						break;
					case 2:
						this.getScore();
						break;
				}
			},
			back() {
				uni.navigateBack()
				uni.showToast({
					icon: "none",
					title: "返回"
				})
			},
			shijianfilter: function(value) {
				var dt = new Date(value)

				var y = dt.getFullYear()
				//这里month得加1
				var m = dt.getMonth() + 1
				var d = dt.getDate()

				var hh = dt.getHours()
				var mm = dt.getMinutes()
				// var ss = dt.getSeconds();
				// return `${y}-${m}-${d}:${hh}:${mm}`
				return `${y}-${m}-${d}`
			}
		}
	}
</script>

<style lang="scss">
	.main-title {
		padding: 30rpx 30rpx;
		font-size: 34rpx;
		color: #1C1C1C;
	}

	.tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #A5A3A2;
	}

	.rmb {
		font-size: 26rpx;
		color: #E3BE83;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 400rpx;
		z-index: -2;

		&-img {
			width: 100%;
			height: 100%;
		}
	}

	.hover {
		opacity: 0.7;
	}

	.nav {
		position: fixed;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		height: 44px;
		padding: 0 30rpx;
		background-image: url('~@/static/nav-bg.png');
		background-size: 100%;
		z-index: 99;

		&-back {
			width: 20rpx;
			height: 40rpx;
		}

		&-title {
			color: #FFFFFF;
			font-size: 42rpx;
		}

		&-space {
			width: 70rpx;
			height: 40rpx;
		}
	}

	.info {
		position: relative;
		padding: 0 15rpx;
		width: 730rpx;
		height: 360rpx;

		&-bg {
			position: absolute;
			width: 730rpx;
			height: 360rpx;
			z-index: -1;
		}

		&-content {
			padding: 70rpx 50rpx 0 50rpx;
			margin-bottom: 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		&-avatar {
			margin-right: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 85rpx;
			height: 85rpx;
			background-color: #fff;
			padding: 1rpx;
			border-radius: 50%;

			&-pic {
				width: 83rpx;
				height: 83rpx;
			}
		}

		&-name {
			display: flex;
			flex-direction: column;
			color: #FFFFFF;
			font-size: 35rpx;
		}

		&-level {
			margin-top: 15rpx;
			font-size: 24rpx;
		}

		&-asset {
			padding: 0 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-item {
				display: flex;
				flex-direction: column;
			}
		}
	}

	.iai {
		&-title {
			margin-bottom: 20rpx;
			margin-right: 100rpx;
			font-size: 24rpx;
			color: #CFB386;
		}

		&-value {
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}

	.recharge {
		position: relative;
		margin-bottom: 35rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&-tag {
			position: absolute;
			top: -2rpx;
			left: -2rpx;
			width: 170rpx;
			height: 36rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			background-image: url('~@/static/tag.png');
			background-size: 100%;

			&-text {
				font-size: 20rpx;
				color: #FFFFFF;
				text-align: center;
			}
		}

		&-item {
			position: relative;
			padding: 40rpx 0;
			margin-left: 15rpx;
			width: 200rpx;
			height: 230rpx;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: solid 2rpx #F2F2F3;
			border-radius: 12rpx;

			&-active {
				border-color: #EDD2A9;
				background-color: #FBF1E5;
			}

			&-duration {
				margin-bottom: 30rpx;
				font-size: 26rpx;
				color: #1C1C1C;
			}

			&-price {
				margin-bottom: 20rpx;
				display: flex;
				flex-direction: row;
				align-items: baseline;

				&-text {
					font-size: 48rpx;
					color: #E3BE83;
				}
			}

			&-des {
				font-size: 22rpx;
				color: #A5A3A2;
			}
		}
	}

	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		border-radius: 50rpx;
		background-image: linear-gradient(#EFCF9E, #E4BF85);

		&-text {
			font-size: 30rpx;
			color: #1C1C1C;
		}
	}

	.pause {
		margin: 35rpx 30rpx 20rpx 30rpx;
		background-color: mediumseagreen;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		border-radius: 50rpx;

		&-text {
			font-size: 30rpx;
			// color: #1C1C1C;
		}
	}

	.update {
		margin: 35rpx 30rpx 20rpx 30rpx;
	}

	.privilege {
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;

		&-item {
			margin: 0 23rpx;
			margin-bottom: 25rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-pic {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 20rpx;
			}

			&-text {
				font-size: 24rpx;
				color: #383738;
			}
		}
	}

	.level {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		height: 466rpx;
		background-image: url('~@/static/vip-bg.png');
		background-size: 100%;

		&-rate {
			position: absolute;
			top: 43rpx;
			left: 33rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-text1 {
				margin-right: 20rpx;
				color: #1C1C1C;
				font-size: 34rpx;
			}

			&-text2 {
				font-size: 34rpx;
				color: #C07C07;
			}
		}

		&-info {
			// position: absolute;
			// top: 188rpx;
			// left: 350rpx;
			margin-top: 70rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-icon {
				margin-bottom: 20rpx;
				width: 48rpx;
				height: 38rpx;
			}

			&-text {
				margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #292929;
			}

			&-integral {
				font-size: 40rpx;
				color: #C07C07;
			}
		}

		&-distance {
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			bottom: 35rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			&-text {
				font-size: 26rpx;
				color: #292929;
			}

			&-button {
				padding: 0 30rpx;
				height: 60rpx;
			}
		}
	}
</style>
