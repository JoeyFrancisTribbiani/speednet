<template>
	<view class="container">
		<!-- 		<view class="circle-wrapper">
			<vue-awesome-progress :circle-radius="63" :circle-width="4" :line-width="4" :font-size="24"
				:point-radius="6" :percentage="progress" :duration="duration" :format="formatPeople" />
		</view> -->

		<view class="circle-wrapper">
			<div class="sm-sm-loading-css" ref="sm_sm_loading" :style="smSmStyleObject">
				<text ref="loading_text" :style="smTextStyleObject">{{this.progress}}</text>
			</div>
			<div ref="md_loading" class="md-loading-css"></div>
			<div ref="sm_loading" :class="smLoadingCssObject"></div>
			<div ref="loading" :class="loadingCssObject"></div>
		</view>
		<!-- 		<view class="btns">
			<button type="primary" @click="startSpeed">启动加速</button>
		</view> -->
		<view class="btns" hover-class="hover" @click="startSpeed">
			<text class="button-text">{{speedBtn}}</text>
		</view>


		<!-- <text>{{remaining}}</text> -->

		<uni-row class="b-title-row">
			<uni-col :span="8" class="data-col">
				<view class=" b-col">
					<uni-icons type="map-pin-ellipse"></uni-icons>
					<text class="b-title">网络延迟</text>
				</view>
			</uni-col>
			<uni-col :span="8" class="data-col">
				<view class=" b-col">
					<uni-icons type="map-pin-ellipse"></uni-icons>
					<text class="b-title">综合提速</text>
				</view>
			</uni-col>
			<uni-col :span="8" class="data-col">
				<view class=" b-col">
					<uni-icons type="map-pin-ellipse"></uni-icons>
					<text class="b-title">丢包率</text>
				</view>
			</uni-col>
		</uni-row>
		<uni-row class="b-data-row">
			<uni-col class="data-col" :span="7" :push="1">
				<view class=" b-col">
					<p class="number">{{net_delay}}</p>
					<p class="b-title">ms</p>
				</view>
			</uni-col>
			<uni-col class="data-col" :span="1" :push="1">
				<view class=" b-col">
					<p class="number">|</p>
					<p class="b-title">|</p>
				</view>
			</uni-col>
			<uni-col class="data-col" :span="7" :push="1">
				<view class=" b-col">
					<p class="number">{{faster}}</p>
					<p class="b-title">%</p>
				</view>
			</uni-col>
			<uni-col class="data-col" :span="1" :push="1">
				<view class=" b-col">
					<p class="number">|</p>
					<p class="b-title">|</p>
				</view>
			</uni-col>
			<uni-col class="data-col" :span="7" :push="1">
				<view class=" b-col">
					<p class="number">{{loss}}</p>
					<p class="b-title">%</p>
				</view>
			</uni-col>
		</uni-row>

	</view>
</template>


<script>
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '../../js_sdk/validator/speednet-game.js';
	import store from '@/store'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import VueAwesomeProgress from '@/static/vue-awesome-progress.js'
	const db = uniCloud.database();

	export default {
		data() {
			return {
				speedBtn: '启动加速',
				sm_anim: '',
				net_delay: 22,
				faster: 83,
				loss: 2,
				progress: '',
				duration: 3,
				queryWhere: '',
				clock: {},
				remaining: 0,
				processes: '',

				loadingCssObject: {
					'loading-css': true,
					'loading-css-run': false
				},
				smLoadingCssObject: {
					'sm-loading-css': true,
					'sm-loading-css-run': false
				},
				smSmStyleObject: {},
				smTextStyleObject: {},
				startStatus: false
			}
		},
		computed: {
			...mapGetters({
				speedInfo: 'user/speedInfo',
				globalSpeedStatus: 'user/globalSpeedStatus'
			}),
		},

		onLoad(e) {
			this.userId = this.userInfo()._id
			console.log('userid getted:' + JSON.stringify(this.userId))

			this.gameName = e.name
			this.gameId = e.id
			this.processes = e.processes
			this.peerId = e.peer_id
			this.peerName = e.peer_name
			this.picurl = e.picurl
			this.smSmStyleObject = {
				'backgroundImage': 'url(' + this.picurl + ')',
			}

		},
		onBackPress() {
			// 返回键默认返回列表页面
			uni.switchTab({
				url: '/pages/list/list'
			})
			return true
		},
		onReady() {
			if (this._id) {
				this.queryWhere = '_id=="' + this._id + '"'
			}
			//改变导航标题navigationBarTitle的标题
			uni.setNavigationBarTitle({
				title: this.gameName
			});
			// 进入页面后先判断真实VPN状态
			// 如果VPN开启，那么设置为正在加速的状态
			// 如果没有开启，为停止状态
			var curStatus = this.getRativeStatus()
			console.log("---------------------curStatus:" + curStatus)
			if (curStatus == "running") {
				this.setViewStartedStatus()
			}
		},
		methods: {
			getRativeStatus() { // 获取真实VPN状态
				uni.sendNativeEvent("status", "event", function(e) {
					// uni.showModal({
					// 	title: "e",
					// 	content: e,
					// 	showCancel: false,
					// 	confirmText: "知道了",
					// });
					if (e == 'running') {
						uni.setStorageSync('globalSpeedStatus', "running")
					} else {
						uni.setStorageSync('globalSpeedStatus', "stoped")
					}
					// var toastTitle = "sync:" + uni.getStorageSync('globalSpeedStatus')
					// uni.showToast({
					// 	title: toastTitle,
					// 	icon: 'error',
					// });
				})
				return uni.getStorageSync('globalSpeedStatus')
			},
			//生成从minNum到maxNum的随机数
			randomNum(minNum, maxNum) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * minNum + 1, 10);
						break;
					case 2:
						return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
						break;
					default:
						return 0;
						break;
				}
			},
			...mapGetters({
				userInfo: 'user/info',
				// speedInfo: 'user/speedInfo',
				// globalSpeedStatus: 'this.globalSpeedStatus'
			}),
			// // 格式化文字
			// formatPeople(percentage) {
			// 	return Math.round(percentage) + '%'
			// },
			stepNumber(start, step, target, duration) {
				// 设置定时器，用来反复横跳的，哈哈哈
				let t = setInterval(() => {
					// 每次增加一点步进值
					start += step
					this.progress = start + '%'
					// 开始值大于传过来的的值，说明 到点了，不用 继续横跳了
					if (start > target) {
						clearInterval(t)
						// 把穿过的值赋给start，结束
						this.progress = target + '%'
						// 清掉计时器
						t = null
					}
				}, duration * 1000 / (target - start))
			},
			async startSpeed() {
				if (this.speedBtn == '启动加速') {
					this.setViewStartingStatus()
					const membershipObj = uniCloud.importObject('membership')
					var membership = await membershipObj.getMembership(this.userId)
					console.log('membership:', JSON.stringify(membership))
					if (membership == "") {
						uni.showModal({
							title: "提示",
							content: '会员时长不足，请先购买订阅',
							showCancel: false,
							confirmText: "知道了",
							complete: () => {
								uni.reLaunch({
									url: '/pages/speednet-membership/memberCenter'
								})
							}
						});
					} else {
						if (membership.is_pause) {
							uni.showModal({
								title: "提示",
								content: '您的加速已暂停，请先恢复加速',
								showCancel: false,
								confirmText: "知道了",
								complete: () => {
									uni.reLaunch({
										url: '/pages/speednet-membership/memberCenter'
									})
								}
							});
						} else if (membership.remaining_minites == 0) {
							uni.showModal({
								title: "提示",
								content: '会员时长不足，请先购买订阅',
								showCancel: false,
								confirmText: "知道了",
								complete: () => {
									uni.reLaunch({
										url: '/pages/speednet-membership/memberCenter'
									})
								}
							});
							this.progress = 0;
						} else {
							this.remaining = membership.remaining_minites
							console.log("----------------------------this.remaining:" + this.remaining)
							let res = await db.collection("speednet-peer").where('_id=="' + this.peerId + '"').get()
							var event = res.result.data
							event[0].processes = this.processes
							event[0].remaining = membership.remaining_minites

							uni.sendNativeEvent("startSpeed", event, function(e) {});
							this.setSpeedInfoStorage()
							uni.setStorageSync('globalSpeedStatus', "running")
							this.setViewStartedStatus()
							uni.showToast({
								title: "启动成功",
								icon: 'error',
							});
						}
					}
				} else {
					this.stopAll()
				}
			},
			stopAll() {
				uni.sendNativeEvent("pause", "event", function(e) {
					var toastTitle = '停止成功'
					if (!e) {
						toastTitle = '停止失败'
					}
					uni.showToast({
						title: toastTitle,
						icon: 'error',
					});
				});
				this.setViewStopStatus()
				this.setSpeedInfoStorage()
			},
			setSpeedInfoStorage() {
				var newList = [{
					gameId: this.gameId,
					gameName: this.gameName,
					processes: this.processes,
					peerId: this.peerId,
					peerName: this.peerName,
					picurl: this.picurl,
					start_date: Date(),
				}, ]
				var mySpeed = {
					gameId: this.gameId,
					gameName: this.gameName,
					peerId: this.peerId,
					peerName: this.peerName,
					picurl: this.picurl,
					start_date: Date(),
				}
				var speedInfo = {
					hasStarted: false,
					mySpeedList: newList,
					runningGameId: this.gameId,
					runningGame: mySpeed
				}
				store.commit('user/startSpeed', speedInfo)
			},

			setViewStartingStatus() {
				this.speedBtn = '正在启动加速'
				this.loadingCssObject = {
					'loading-css-run': true,
					'loading-css': false
				}
				this.smLoadingCssObject = {
					'sm-loading-css': false,
					'sm-loading-css-run': true
				}
				this.smSmStyleObject = {
					'backgroundImage': '',
				}
				this.smTextStyleObject = {
					'display': 'block'
				}
				this.stepNumber(0, 2, 100, 5)
			},
			async setViewStartedStatus() {
				const membershipObj = uniCloud.importObject('membership')
				var membership = await membershipObj.getMembership(this.userId)
				console.log('membership:', JSON.stringify(membership))
				if (membership == "") {
					uni.showModal({
						title: "提示",
						content: '会员时长不足，请先购买订阅',
						showCancel: false,
						confirmText: "知道了",
						complete: () => {
							uni.reLaunch({
								url: '/pages/speednet-membership/memberCenter'
							})
						}
					});
				} else {
					if (membership.is_pause) {
						uni.showModal({
							title: "提示",
							content: '您的加速已暂停，请先恢复加速',
							showCancel: false,
							confirmText: "知道了",
							complete: () => {
								uni.reLaunch({
									url: '/pages/speednet-membership/memberCenter'
								})
							}
						});
					} else if (membership.remaining_minites <= 0) {
						uni.showModal({
							title: "提示",
							content: '会员时长不足，请先购买订阅',
							showCancel: false,
							confirmText: "知道了",
							complete: () => {
								uni.reLaunch({
									url: '/pages/speednet-membership/memberCenter'
								})
							}
						});
					} else {
						this.remaining = membership.remaining_minites
						// 设置启动状态
						this.loadingCssObject = {
							'loading-css-run': true,
							'loading-css': false
						}
						this.smLoadingCssObject = {
							'sm-loading-css': false,
							'sm-loading-css-run': true
						}
						this.smSmStyleObject = {
							'backgroundImage': '',
						}
						this.smTextStyleObject = {
							'display': 'block'
						}
						this.progress = '100%';

						this.speedBtn = '停止加速'
						this.net_delay = this.randomNum(4, 48)
						this.loss = this.randomNum(2, 9)
						this.faster = this.randomNum(80, 99)

						console.log("start interval:" + this.remaining)

						this.clock = setInterval(() => {
							console.log("this.remaining in interval:" + this.remaining)
							this.remaining--

							if (this.remaining <= 0) {
								this.stopAll()
								uni.showModal({
									title: "提示",
									content: '会员时长不足，请先购买订阅',
									showCancel: false,
									confirmText: "知道了",
									complete: () => {
										// uni.reLaunch({
										// 	url: '/pages/speednet-membership/memberCenter'
										// })
									}
								});
								clearInterval(this.clock)
							}
						}, 60000)
					}
				}
			},
			setViewStopStatus() {
				this.speedBtn = '启动加速'
				this.loadingCssObject = {
					'loading-css-run': false,
					'loading-css': true
				}
				this.smLoadingCssObject = {
					'sm-loading-css': true,
					'sm-loading-css-run': false
				}
				this.smSmStyleObject = {
					'backgroundImage': 'url(' + this.picurl + ')',
				}
				this.smTextStyleObject = {
					'display': 'none'
				}
				this.stepNumber(0, 2, 100, 5)
			},
			async showPeers(regionId) {
				this.mypeerList = []
				let res = await db.collection('speednet-peer').where('region_id=="' + regionId + '"')
					.field("_id,peer_name,server").get()
				for (var i = 0; i < res.result.data.length; i++) {
					for (var j = 0; j < 25; j++) {
						let peer = res.result.data[i]
						console.log(peer)
						let mypeer = {
							"peer_name": j,
							"_id": "ddd"
						}
						this.mypeerList.push(mypeer)
					}
				}
				this.chooseRegion = regionId
				this.$refs.pop.show();
			},

		}
	}
</script>

<style scoped="">
	@keyframes loading-360 {
		0% {
			transform: rotate(0deg);
			/*动画起始的时候旋转了0度*/
		}

		100% {
			transform: rotate(360deg);
			/*动画结束的时候旋转了360度*/
		}
	}

	@keyframes r-loading-360 {
		0% {
			transform: rotate(360deg);
			/*动画起始的时候旋转了0度*/
		}

		100% {
			transform: rotate(0deg);
			/*动画结束的时候旋转了360度*/
		}
	}

	.loading-css {
		animation: loading-360 3s infinite linear;
		animation-play-state: paused;
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 200px;
		/*先将loading区域变成正方形*/
		height: 200px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 3px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		border-top: 3px solid red;
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -100px;
	}

	.loading-css-run {
		animation: loading-360 3s infinite linear;
		animation-play-state: running;
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 200px;
		/*先将loading区域变成正方形*/
		height: 200px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 3px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		border-top: 3px solid red;
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -100px;
	}

	.sm-loading-css {
		animation: r-loading-360 2s infinite linear;
		animation-play-state: paused;
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 180px;
		/*先将loading区域变成正方形*/
		height: 180px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 2px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		border-top: 2px solid red;
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -90px;
		margin-left: -90px;
	}

	.sm-loading-css-run {
		animation: r-loading-360 2s infinite linear;
		animation-play-state: running;
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 180px;
		/*先将loading区域变成正方形*/
		height: 180px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 2px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		border-top: 2px solid red;
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -90px;
		margin-left: -90px;
	}

	.circle-wrapper {
		/* background-color: chocolate; */
		width: 100%;
		height: 230px;
		position: relative;
		text-align: center;
		margin-top: 20px;
	}

	.sm-sm-loading-css {
		/* animation: r-loading-360 0.8s infinite linear; */
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 100px;
		/*先将loading区域变成正方形*/
		height: 100px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 2px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		/* border-top: 3px solid red; */
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -50px;
		margin-left: -50px;
		background-size: 100%;
		font-size: 30px;
		text-align: center;
		line-height: 100px;
		color: dodgerblue;
	}

	.md-loading-css {
		/* animation: r-loading-360 0.8s infinite linear; */
		/*给圆环添加旋转360度的动画，并且是无限次*/
		width: 120px;
		/*先将loading区域变成正方形*/
		height: 120px;
		/* display: inline-block; */
		/*将loading区域变成行内元素，防止旋转的时候，100%宽度都在旋转*/
		border: 2px solid #f3f3f3;
		/*设置四周边框大小，并将颜色设置为浅白色*/
		/* border-top: 3px solid red; */
		/*将上边框颜色设置为红色高亮，以便旋转的时候能够看到旋转的效果*/
		border-radius: 50%;
		/*将边框和内容区域都变成圆形*/
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -60px;
		margin-left: -60px;
		background-size: 100%;
		font-size: 30px;
		text-align: center;
		line-height: 100px;
		color: dodgerblue;
	}

	.region-tag {
		margin: 20px;
	}

	.data-col {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.b-title-row,
	.b-data-row {
		width: 100%;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.container {
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
		/* 		height: 3000px;
		background-image: url('/static//mybg.jpg'); */
	}

	.btns {
		margin: 60px 100px 100px 100px;
		background-color: mediumseagreen;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 45px;
		width: 250px;
		border-radius: 50px;

		&-text {
			font-size: 30px;
			// color: #1C1C1C;
		}
	}

	/* 	.btns {
		background-color: mediumseagreen;
		color: mediumseagreen;
		margin-top: 50px;
		margin-bottom: 100px;
		width: 200px;
	}

	.btns button {
		flex: 100;
	} */

	.btn-delete {
		margin-left: 10px;
	}
</style>
