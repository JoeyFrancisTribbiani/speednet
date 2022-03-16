<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options"
			collection="speednet-game,speednet-game-region"
			field="game_name,picture,regions{region_name as text,_id as value},platform" :where="queryWhere"
			:getone="true" :manual="true">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">
				<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view v-else-if="data">
				<view>
					<uni-file-picker v-if="data.picture && data.picture.fileType == 'image'" :value="data.picture"
						:file-mediatype="data.picture && data.picture.fileType" return-type="object" readonly>
					</uni-file-picker>
					<uni-link v-else-if="data.picture" :href="data.picture.url" :text="data.picture.url"></uni-link>
					<text v-else></text>
				</view>
				<view style="display: none;">
					<uni-section>区服列表</uni-section>
					<uni-collapse accordion>
						<uni-collapse-item v-for="(region,index) in data.regions" title-border="none" :border="false">
							<template v-slot:title>
								<uni-list>
									<uni-list-item :title="region.text" :show-extra-icon="true"
										:extra-icon="regionIcon">
									</uni-list-item>
								</uni-list>
							</template>
							<view class="content">
								<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="data"
									collection="speednet-peer" field="_id,peer_name"
									:where="`region_id=='${region.value}'`">
									<uni-list>
										<uni-list-item :title="peer.peer_name" :show-extra-icon="true"
											:extra-icon="peerIcon" v-for="(peer,ii) in data">{{peer.peer_name}}
										</uni-list-item>
									</uni-list>
								</unicloud-db>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</unicloud-db>
		<button type="primary" @click="startSpeed">启动加速</button>
	</view>
</template>

<script>
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '../../js_sdk/validator/speednet-game.js';
	import {
		mapGetters
	} from 'vuex';
	const db = uniCloud.database();

	export default {
		data() {
			return {
				regionIcon: {
					color: 'red',
					size: '22',
					type: 'fire-filled'
				},
				peerIcon: {
					color: '#4cd964',
					size: '22',
					type: 'map-pin-ellipse'
				},
				queryWhere: '',
				peerList: [],
				mypeerList: [],
				peerWhere: '',
				chooseRegion: '',
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				options: {
					// 将scheme enum 属性静态数据中的value转成text
					...enumConverter
				},
			}
		},
		onLoad(e) {
			this.userId = this.userInfo()._id
			console.log('userid getted:'+JSON.stringify(this.userId))
			console.log('userid getted:'+this.userId)
			this.gameName = e.name
		},
		onReady() {
			if (this._id) {
				this.queryWhere = '_id=="' + this._id + '"'
			}
			//改变导航标题navigationBarTitle的标题
			uni.setNavigationBarTitle({
				title: this.gameName
			});
		},
		methods: {
			...mapGetters({
				userInfo: 'user/info'
			}),
			async startSpeed() {
				let res = await db.collection('speednet-membership').where('user_id=="' + this.userId + '"').get()
				// .field("_id,peer_name,server").get()
				console.log(res)
				if ( res.result.data.length == 0){
					uni.navigateTo({
						url: '/pages/speednet-member-plan/list',
						animationType: 'fade-in'
					});
				}
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
						// peer.peer_name=j;
						this.mypeerList.push(mypeer)
					}
				}
				// for (var i = 0; i < 20; i++) {
				// 	this.mypeerList.push(res.result.data[1])
				// }
				this.chooseRegion = regionId
				// this.$refs.popup.open()
				this.$refs.pop.show();
			}

		}
	}
</script>

<style>
	.region-tag {
		margin: 20px;
	}

	.container {
		padding: 10px;
	}

	.btns {
		margin-top: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.btns button {
		flex: 1;
	}

	.btn-delete {
		margin-left: 10px;
	}
</style>
