<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length"
					@click="delTable">批量删除</button>
				<download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData"
					:type="exportExcel.type" :name="exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">导出 Excel</button>
				</download-excel>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" :collection="collectionList"
				field="game_name,processes,ips,picture,regions,platform,status" :where="where" page-data="replace"
				:orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
				v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual"
				@load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe
					type="selection" @selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'game_name')"
							sortable @sort-change="sortChange($event, 'game_name')">游戏名称</uni-th>
						<!-- <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'processes')" sortable @sort-change="sortChange($event, 'processes')">进程名（多个逗号隔开）</uni-th> -->
						<!-- <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'ips')" sortable @sort-change="sortChange($event, 'ips')">服务器IP（多个逗号隔开）</uni-th> -->
						<uni-th align="center" sortable @sort-change="sortChange($event, 'picture')">游戏封面</uni-th>
						<uni-th align="center">区服列表</uni-th>
						<uni-th align="center" filter-type="select" :filter-data="options.filterData.platform_localdata"
							@filter-change="filterChange($event, 'platform')">游戏平台</uni-th>
						<uni-th align="center" filter-type="select" :filter-data="options.filterData.status_localdata"
							@filter-change="filterChange($event, 'status')">上架状态</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.game_name}}</uni-td>
						<!-- <uni-td align="center">{{item.processes}}</uni-td> -->
						<!-- <uni-td align="center">{{item.ips}}</uni-td> -->
						<uni-td align="center">
							<uni-file-picker v-if="item.picture && item.picture.fileType == 'image'"
								:value="item.picture" :file-mediatype="item.picture && item.picture.fileType"
								return-type="object" :imageStyles="imageStyles" readonly></uni-file-picker>
							<uni-link v-else :href="item.picture && item.picture.url"
								:text="item.picture && item.picture.url"></uni-link>
						</uni-td>
						<!-- <uni-td align="center">{{item.regions && item.regions[0] && item.regions[0].text}}</uni-td> -->
						<uni-td align="center"><span
								v-for="(value,index) in item.regions">[{{value.region_name}}]</span> </uni-td>
						<uni-td align="center">{{options.platform_valuetotext[item.platform]}}</uni-td>
						<uni-td align="center">{{options.status_valuetotext[item.status]}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item._id)" class="uni-button" size="mini"
									type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import {
		enumConverter,
		filterToWhere
	} from '../../js_sdk/validator/speednet-game.js';

	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = ['game_name'] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	const orderByMapping = {
		"ascending": "asc",
		"descending": "desc"
	}

	export default {
		data() {
			return {
				collectionList: [db.collection('speednet-game').orderBy('create_date', "desc").getTemp(), db.collection(
					'speednet-game-region').getTemp()],
				query: '',
				where: '',
				orderby: dbOrderBy,
				orderByFieldName: "",
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					filterData: {
						"platform_localdata": [{
								"value": 1,
								"text": "PC"
							},
							{
								"value": 2,
								"text": "Android"
							}
						],
						"status_localdata": [{
								"value": 1,
								"text": "上架"
							},
							{
								"value": 2,
								"text": "下架"
							}
						]
					},
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				},
				exportExcel: {
					"filename": "speednet-game.xls",
					"type": "xls",
					"fields": {
						"游戏名称": "game_name",
						"进程名（多个逗号隔开）": "processes",
						"服务器IP（多个逗号隔开）": "ips",
						"游戏封面": "picture",
						"区服列表": "regions",
						"游戏平台": "platform",
						"上架状态": "status"
					}
				},
				exportExcelData: []
			}
		},
		onLoad() {
			this._filter = {}
		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			onqueryload(data) {
				this.exportExcelData = data
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				this.where = newWhere
				this.$nextTick(() => {
					this.loadData()
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.selectedIndexs.length = 0
				this.$refs.table.clearSelection()
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},
			// 批量删除
			delTable() {
				this.$refs.udb.remove(this.selectedItems(), {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(id) {
				this.$refs.udb.remove(id, {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			sortChange(e, name) {
				this.orderByFieldName = name;
				if (e.order) {
					this.orderby = name + ' ' + orderByMapping[e.order]
				} else {
					this.orderby = ''
				}
				this.$refs.table.clearSelection()
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			},
			filterChange(e, name) {
				this._filter[name] = {
					type: e.filterType,
					value: e.filter
				}
				let newWhere = filterToWhere(this._filter, db.command)
				if (Object.keys(newWhere).length) {
					this.where = newWhere
				} else {
					this.where = ''
				}
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			}
		}
	}
</script>

<style>
</style>
