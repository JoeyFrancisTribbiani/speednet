<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validateTrigger="bind">
			<uni-forms-item name="game_name" label="游戏名称" required>
				<uni-easyinput placeholder="游戏名称" v-model="formData.game_name"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="processes" label="进程名（多个逗号隔开）" required>
				<uni-easyinput placeholder="进程名（可以是多个，逗号隔开）" v-model="formData.processes"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="ips" label="服务器IP（多个逗号隔开）">
				<uni-easyinput placeholder="服务器IP（可以是多个，逗号隔开）" v-model="formData.ips"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="picture" label="游戏封面">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png" return-type="object"
					v-model="formData.picture"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="regions" label="区服列表">
				<uni-data-checkbox :multiple="true" v-model="formData.regions" collection="speednet-game-region"
					field="region_name as text, _id as value"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="platform" label="游戏平台">
				<uni-data-checkbox v-model="formData.platform" :localdata="formOptions.platform_localdata">
				</uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="status" label="上架状态">
				<uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata">
				</uni-data-checkbox>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/speednet-game.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'speednet-game';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		data() {
			let formData = {
				"game_name": "",
				"processes": "",
				"ips": "",
				"picture": null,
				"regions": [],
				"platform": null,
				"status": null
			}
			return {
				formData,
				formOptions: {
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
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			/**
			 * 验证表单并提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				console.log("----------model:--------" +
					JSON.stringify(value))
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: '网络拥堵，请求服务失败，请稍后重试',
						showCancel: false
					})
				})
			}
		}
	}
</script>
