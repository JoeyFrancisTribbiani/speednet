<template>
	<view class="pages">
		<!-- #ifndef H5 -->
		<statusBar></statusBar>
		<!-- #endif -->
		<!-- 搜索功能 -->
		<view class="uni-search-box">
			<uni-search-bar v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled
				:placeholder="inputPlaceholder" />
			<view class="cover-search-bar" @click="searchClick"></view>
		</view>
		<uni-list class="uni-list" :border="false" :style="{height:listHight}">
			<uni-list-item class="game-item" :to="'/pages/speednet-game/detail?id='+item.gameId"
				v-for="(item,index) in this.mySpeedList" :key="index">
				<!-- 通过header插槽定义列表左侧图片 -->
				<template v-slot:header>
					<view class="avatar">
						<image class="myimage" :src="item.picurl" mode="widthFix"></image>
					</view>
				</template>
				<!-- 通过body插槽定义布局 -->
				<template v-slot:body class="slot-box">
					<view class="main">
						<text class="title">{{item.game}}</text>
						<view class="info">
							<!-- <text class="author">{{item.user_id[0]?item.user_id[0].username:''}}</text> -->
							<uni-dateformat class="last_modify_date" :date="item.start_date" format="yyyy-MM-dd"
								:threshold="[60000, 2592000000]" />
						</view>
					</view>
				</template>
				<template v-slot:footer>
					<view class="speedBtnWrapper">
						<button class="rightBtn">加速</button>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	var cdbRef, currentWebview;
	import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";

	const db = uniCloud.database();

	export default {
		computed: {
			...mapGetters({
				speedInfo: 'user/speedInfo',
			}),
			hasStarted() {
				if (this.speedInfo && this.speedInfo.hasStarted) {
					return this.speedInfo.hasStarted
				} else {
					return false
				}
			},
			appVersion() {
				return getApp().appVersion
			},
			appConfig() {
				return getApp().globalData.config
			},
			avatar_file() {
				if (this.userInfo.avatar_file && this.userInfo.avatar_file.url) {
					return this.userInfo.avatar_file
				} else {
					return "/static/avatar.png"
				}
			},
			inputPlaceholder(e) {
				if (uni.getStorageSync('CURRENT_LANG') == "en") {
					return 'Please enter the search content'
				} else {
					return '请输入搜索内容'
				}
			},
			colList() {
				return db.collection('speednet-game').where('"status" == 1').get();
			},
			mySpeedList: {
				get() {
					console.log('this.speedInfo', this.speedInfo);
					console.log('tthis.speedInfo.mySpeedList', this.speedInfo.mySpeedList);
					if (this.speedInfo && this.speedInfo.mySpeedList) {
						return this.speedInfo.mySpeedList
					} else {
						return []
					}
				},
				set(newVal) {}
			},
		},
		components: {
			statusBar
		},
		onTabItemTap(e) {
			console.log('-------------------------onTabItemTap')
			if (this.speedInfo.hasStarted) {
				var running = this.speedInfo.runningGame
				console.log(JSON.stringify(running))
				uni.navigateTo({
					url: '/pages/speednet-myspeed/detail?id=' + running.gameId + '&name=' + running
						.gameName +
						'&peer_id=' + running.peerId + '&peer_name=' + running.peerName +
						'&processes=' +
						running.processes + '&picurl=' + running.picurl
				})
			}
		},
		data() {
			return {
				where: '"article_status" == 1',
				keyword: "",
				showRefresh: false,
				listHight: 0,
				tabClick: false // true 表示是两次点击中的第一次点了 tabBar
			}
		},
		watch: {
			keyword(keyword, oldValue) {
				let where = '"article_status" == 1 '
				if (keyword) {
					this.where = where + `&& /${keyword}/.test(title)`;
				} else {
					this.where = where;
				}
			}
		},
		onLoad(e) {
			let currentRoute = this.$mp.page.route; // 获取当前页面路由
			if (this.speedInfo.hasStarted) {
				var running = this.speedInfo.runningGame
				console.log(JSON.stringify(running))
				uni.navigateTo({
					url: '/pages/speednet-myspeed/detail?id=' + running.gameId + '&name=' + running
						.gameName +
						'&peer_id=' + running.peerId + '&peer_name=' + running.peerName +
						'&processes=' +
						running.processes + '&picurl=' + running.picurl
				})
			}
		},
		onShow() {
			console.log('onshow.speedInfo', this.speedInfo.hasStarted);
			if (this.speedInfo.hasStarted) {
				var running = this.speedInfo.runningGame
				console.log(JSON.stringify(running))
				uni.navigateTo({
					url: '/pages/speednet-myspeed/detail?id=' + running.gameId + '&name=' + running
						.gameName +
						'&peer_id=' + running.peerId + '&peer_name=' + running.peerName + '&processes=' +
						running.processes + '&picurl=' + running.picurl
				})
			} else {

			}
		},
		onBackPress() {
			console.log('onBackPress.speedInfo', this.speedInfo.hasStarted);
			if (this.speedInfo.hasStarted) {
				var running = this.speedInfo.runningGame
				console.log(JSON.stringify(running))
				uni.navigateTo({
					url: '/pages/speednet-myspeed/detail?id=' + running.gameId + '&name=' + running
						.gameName +
						'&peer_id=' + running.peerId + '&peer_name=' + running.peerName + '&processes=' +
						running.processes + '&picurl=' + running.picurl
				})
			} else {

			}
		},
		async onReady() {
			// #ifdef APP-NVUE
			/* 可用窗口高度 - 搜索框高 - 状态栏高 */
			this.listHight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight -
				50 +
				'px';
			// #endif
			// #ifndef APP-NVUE
			this.listHight = 'auto'
			// #endif
			cdbRef = this.$refs.udb
		},
		async onShow() {
			this.keyword = getApp().globalData.searchText
			getApp().globalData.searchText = ''
		},
		methods: {
			mySpeedList() {
				console.log('this.speedInfo', this.speedInfo);
				console.log('tthis.speedInfo.mySpeedList', this.speedInfo.mySpeedList);
				if (this.speedInfo && this.speedInfo.mySpeedList) {
					return this.speedInfo.mySpeedList
				} else {
					return []
				}
			},
			searchClick(e) { //点击搜索框
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/list/search/search',
					animationType: 'fade-in'
				});
			},
			retry() {
				this.refresh()
			},
			refresh() {
				cdbRef.loadData({
					clear: true
				}, () => {
					uni.stopPullDownRefresh()
					// #ifdef APP-NVUE
					this.showRefresh = false
					// #endif
					console.log('end');
				})
				console.log('refresh');
			},
			loadMore() {
				cdbRef.loadMore()
			},
			onqueryerror(e) {
				console.error(e);
			},
			onpullingdown(e) {
				console.log(e);
				this.showRefresh = true
				if (e.pullingDistance > 100) {
					this.refresh()
				}
			}
		},
		// #ifndef APP-NVUE
		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		}
		// #endif
	}
</script>

<style scoped>
	.speedBtnWrapper {
		width: 80px;
		height: 60px;
		text-align: center;
		padding-right: 8px;
		margin-left: -20px;
	}

	.rightBtn {
		font-size: 14px;
		width: 60px;
		margin: 0 auto;
		margin-top: 15px;
		display: inline-block;
	}

	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}


	.game-item {
		border-bottom: 1px solid #4169E1;
	}

	.pages {
		background-color: #FFF;
	}

	.avatar {
		width: 60px;
		height: 60px;
		margin-right: 10px;

	}

	.myimage {
		width: 60px;
		height: 60px;
		border-radius: 8px;
	}

	.main {
		justify-content: space-between;
	}

	.title {
		width: 480rpx;
		font-size: 32rpx;
	}

	.info {
		flex-direction: row;
		justify-content: space-between;
	}

	.author,
	.last_modify_date {
		font-size: 28rpx;
		color: #999999;
	}

	.uni-search-box {
		background-color: #FFFFFF;
		position: sticky;
		height: 50px;
		top: 0;
		left: 0;
		/* #ifndef APP-PLUS */
		z-index: 9;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 580rpx;
		/* #endif */
	}

	.cover-search-bar {
		height: 50px;
		position: relative;
		top: -50px;
		margin-bottom: -50px;
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
	}
</style>
