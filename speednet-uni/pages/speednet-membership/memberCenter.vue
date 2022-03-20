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
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="speednet-membership"
				:where="`user_id=='${userInfo._id}'`" getone="true">
				<view class="info-asset">
					<view class="info-asset-item">
						<text class="iai-title">状态</text>
						<text class="iai-value" v-if="data.is_pause">暂停</text>
						<text class="iai-value" v-else>生效</text>
					</view>
					<view class="info-asset-item">
						<text class="iai-title">剩余时长</text>
						<text class="iai-value">{{data.remaining_minites / 60 | timeFilter}}小时</text>
					</view>
					<view class="info-asset-item">
						<text class="iai-title">订阅时间</text>
						<text class="iai-value">{{data.start_time||'2022/3/24'}}</text>
					</view>
				</view>
			</unicloud-db>
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

		<view class="privilege">
			<view class="privilege-item" v-for="(item, index) in privilegeList" :key="index" hover-class="hover"
				@click="privilegeClick(index)">
				<image class="privilege-item-pic" :src="item.pic" mode=""></image>
				<text class="privilege-item-text">{{ item.text }}</text>
			</view>
		</view>

		<view class="level"v style="display: none;">
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
		filters: {
			timeFilter(value) {
				return parseFloat(value).toFixed(2)
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin'
			})
			// #ifdef APP-PLUS
			,
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

		},
		onReady() {
			db.collection("speednet-member-plan").get()
				.then((res) => {
					this.$data.rechargeOptions = res.result.data
				})
			console.log("this.rechargeOptions:" + userInfo)
		},
		data() {
			return {
				statusBarHeight,
				current: 0,
				rechargeOptions: [],
				// [
				// 	{
				// 		duration: '12个月',
				// 		price: 88,
				// 		des: [
				// 			'到期自动续费',
				// 			'可随时关闭'
				// 		],
				// 		showTag: true
				// 	},

				// 	{
				// 		duration: '连续包年',
				// 		price: 70,
				// 		des: [
				// 			'到期自动续费',
				// 			'可随时关闭'
				// 		],
				// 		showTag: true
				// 	}
				// ],
				privilegeList: [{
						pic: '/static/coin.png',
						text: '积分签到',
						url: 'button'
					},
					{
						pic: '/static/coin.png',
						text: '个人资料',
						url: '/pages/ucenter/userinfo/userinfo'
					},
					{
							pic: '/static/coin.png',
							text: '我的积分',
							url: 'button'
						},
					{
						pic: '/static/quan.png',
						text: '意见反馈',
						url: '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback'
					},

					{
						pic: '/static/goods.png',
						text: '注销账号',
						url: '/pages/ucenter/settings/deactivate/deactivate'
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

			toUserInfo() {
				uni.navigateTo({
					url: '/pages/ucenter/userinfo/userinfo'
				})
			},
			rechargeChange(index) {
				this.current = index
			},
			updateNow() {
				let subscribe = membership.subscribe("1", "33")
				if (subscribe) {
					uni.showToast({
						icon: "none",
						title: `选择了「${this.rechargeOptions[this.current].hours}小时」`
					})
				}
			},
			privilegeClick(index) {
				uni.navigateTo({
					url: this.privilegeList[index].url
				})
				uni.showToast({
					icon: "none",
					title: `点击了「${this.privilegeList[index].text}」`
				})
			},
			back() {
				uni.navigateBack()
				uni.showToast({
					icon: "none",
					title: "返回"
				})
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
			font-size: 35rpx;
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
