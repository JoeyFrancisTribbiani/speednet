<template>
	<view class="warp">
		<!-- #ifdef APP-PLUS -->
		<status-bar />
		<!-- #endif -->

		<!-- 搜索功能 -->
		<view class="uni-search-box">
			<uni-search-bar v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled
				:placeholder="inputPlaceholder" :bgColor="'#3f3f3f'"/>
			<view class="cover-search-bar" @click="searchClick"></view>
		</view>
		<!-- banner -->
		<!-- 		<unicloud-db ref="bannerdb" v-slot:default="{data, loading, error, options}" collection="opendb-banner"
			field="_id,bannerfile,open_url,title" @load="onqueryload">
			<!-- 当无banner数据时显示占位图 -->
		<!-- 			<image v-if="!(loading||data.length)" class="banner-image" src="/static/grid/empty.png" mode="aspectFill"
				:draggable="false" />
			<uni-swiper-dot v-else class="uni-swiper-dot-box" @clickItem="clickItem" :info="data" :current="current"
				field="content">
				<swiper class="swiper-box" @change="changeSwiper" :current="swiperDotIndex">
					<swiper-item v-for="(item, index) in data" :key="item._id">
						<view class="swiper-item" @click="clickBannerItem(item)">
							<image class="banner-image" :src="item.bannerfile.url" mode="aspectFill"
								:draggable="false" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</unicloud-db>

 -->
		<!-- 宫格 -->
		<uni-section :title="'游戏库'" style="margin: 0;background-color: #04498C;" type="line"></uni-section>
		<unicloud-db ref='udb' v-slot:default="{data,pagination,hasMore, loading, error, options}" @error="onqueryerror"
			:collection="'speednet-game'" :page-size="10">
			<!-- 		<unicloud-db ref='udb' v-slot:default="{data,pagination,hasMore, loading, error, options}" @error="onqueryerror"
			:collection="colList" :page-size="10">	 -->
			<view class="example-body">
				<uni-grid :column="4" style="width: 800px;" :highlight="true" :showBorder="false" :square="false" @change="change">
					<template v-for="(item,i) in data" class="fuck">
						<view class="uni-flex uni-column">
							<uni-grid-item :index="i" :key="i" >
								<view class="grid-item-box"  >
									<image :src=item.picture.url style="width: 120px; height: 160px;" class="image" />
									<text class="text">{{item.game_name}}</text>
								</view>
							</uni-grid-item>
						</view>
					</template>
				</uni-grid>
			</view>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		mapGetters,
	} from 'vuex';
	import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";
	const db = uniCloud.database();
	export default {
		components: {
			statusBar
		},
		data() {
			return {
				gridList: [],
				where: '"status" == 1',
				keyword: "",
				showRefresh: false,
				listHight: 0,
				current: 0,
				swiperDotIndex: 0
			}
		},
		computed: {
			...mapGetters({
				hasLogin: 'user/hasLogin'
			}),
			inputPlaceholder(e) {
				if (uni.getStorageSync('CURRENT_LANG') == "en") {
					return 'Please enter the search content'
				} else {
					return '输入要搜索的游戏'
				}
			},
			colList() {
				return db.collection('speednet-game')
				// .where(this.where).getTemp(),
				//db.collection('uni-id-users').field('_id,username').getTemp()

			}
		},
		onLoad() {
			// let gridList = []
			// for (var i = 0; i < 3; i++) {
			// 	gridList.push(this.$t('grid.visibleToAll'))
			// }
			// for (var i = 0; i < 3; i++) {
			// 	gridList.push(this.$t('grid.invisibleToTourists'))
			// }
			// for (var i = 0; i < 3; i++) {
			// 	gridList.push(this.$t('grid.adminVisible'))
			// }
			// this.gridList = gridList
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
		methods: {
			searchClick(e) { //点击搜索框
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/list/search/search',
					animationType: 'fade-in'
				});
			},
			change(e) {
				uni.showToast({
					title: this.$t('grid.clickTip') + " " + `${e.detail.index}` + " " + this.$t(
						'grid.clickTipGrid'),
					icon: 'none'
				})
			},
			/**
			 * banner加载后触发的回调
			 */
			onqueryload(data) {},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			clickItem(e) {
				this.swiperDotIndex = e
			},
			/**
			 * 点击banner的处理
			 */
			clickBannerItem(item) {
				// 有外部链接-跳转url
				if (item.open_url) {
					uni.navigateTo({
						url: '/pages/common/webview/webview?url=' + item.open_url + '&title=' + item.title,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
				// 其余业务处理
			}
		}
	}
</script>

<style>
	image {
		border-radius: 8px;
		-webkit-filter: drop-shadow(0px 0px 20px #000);
		filter: drop-shadow(0px 0px 20px #000);
	}
	. fuck{
		width:550px;
	}

	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #3F3F3F;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
		background-color: #3F3F3F;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		/* padding: 50; */
		font-size: 14px;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.warp {
		background-color: #3F3F3F;
	}

	/* #endif */

	.example-body {
		flex-direction: column;
		padding: 50px;
		background-color: #3F3F3F;
	}

	.text {
		text-align: center;
		font-size: 12rpx;
		margin-top: 5rpx;
		color: #ffffff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px;
		margin: 0;
		background-color: #3F3F3F;
	}

	.banner-image {
		width: 750rpx;
		height: 400rpx;
	}

	.swiper-box {
		height: 400rpx;
	}

	.search-icons {
		padding: 16rpx;
	}

	.search-container-bar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 10;
		background-color: #fff;
	}

	/* #ifndef APP-NVUE || VUE3*/
	/deep/
	/* #endif */
	.uni-searchbar__box {
		border-width: 0;
	}

	/* #ifndef APP-NVUE || VUE3 */
	/deep/
	/* #endif */
	.uni-input-placeholder {
		font-size: 28rpx;
	}
</style>
