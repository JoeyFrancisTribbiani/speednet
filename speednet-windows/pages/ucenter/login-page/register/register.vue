<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit" err-show-type="undertext">
			<uni-forms-item>
				<text class="tip">{{tipText}}</text>
				<uni-easyinput type="number" class="easyinput" :inputBorder="false" v-model="code" maxlength="6"
					:placeholder="$t('common.verifyCodePlaceholder')">
					<template v-slot:right>
						<uni-send-sms-code :phone="phone" ref="sendSmsCode"></uni-send-sms-code>
					</template>
				</uni-easyinput>
			</uni-forms-item>
			<uni-forms-item  v-show="false" name="phone" required>
				<uni-easyinput :inputBorder="false" class="easyinput"
					v-model="formData.phone" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="username" required>
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.usernamePlaceholder')"
					v-model="formData.username" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname">
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.nicknamePlaceholder')"
					v-model="formData.nickname" trim="both" style="width: 660rpx;" />
			</uni-forms-item>
			<uni-forms-item name="password" v-model="formData.password" required>
				<uni-easyinput :inputBorder="false" class="easyinput"
					:placeholder="$t('register.passwordDigitsPlaceholder')" type="password" v-model="formData.password"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="pwd2" v-model="formData.pwd2" required>
				<uni-easyinput :inputBorder="false" class="easyinput" :placeholder="$t('register.passwordAgain')"
					type="password" v-model="formData.pwd2" trim="both" />
			</uni-forms-item>
			<uni-agreements @setAgree="agree = $event"></uni-agreements>
			<button class="send-btn" type="primary" @click="submit">{{$t('register.registerAndLogin')}}</button>
		</uni-forms>
	</view>
</template>

<script>
	import rules from './validator.js';
	import mixin from '../common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				formData: {
					"username": "",
					"nickname": "",
					'password': '',
					'pwd2': '',
					'phone': ''
				},
				rules,
				phone: '',
				code: '',
				agree: false
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
			if (this.phone.length == 11) {
				this.$refs.sendSmsCode.start();
			}
		},
		onLoad({
			phoneNumber,
			phoneArea
		}) {
			this.phone = phoneNumber			
			this.formData.phone=phoneNumber
			uni.setNavigationBarTitle({
				title: this.$t('register.navigationBarTitle')
			})
		},
		computed: {
			tipText() {
				return this.$t('common.verifyCodeSend') + `${this.phone}。`;
			},
			// canSubmit(){
			// 	return this.code.length==6;
			// }
		},
		methods: {
			/**
			 * 触发表单提交
			 */
			submit() {
				if (!this.agree) {
					return uni.showToast({
						title: this.$t('common').noAgree,
						icon: 'none'
					});
				}
				uni.showLoading({
					mask: true
				})
				uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'loginBySms',
						params: {
							"mobile": this.phone,
							"code": this.code
						},
					},
					success: ({
						result
					}) => {
						if (result.code === 0) {
							//this.loginSuccess(result)
							this.$refs.form.validate().then((res) => {
									this.submitForm(res)
								}).catch((errors) => {
									console.log(errors);
								})
								.finally(() => {
									uni.hideLoading()
								})
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
							uni.hideLoading()
						}
					}
				})
				
			},
			submitForm(params) {
				uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'register',
						params,
					},
					success: ({
						result
					}) => {
						console.log(result);
						if (result.code === 0) {
							this.loginSuccess(result)
						} else {
							uni.showModal({
								content: result.msg,
								showCancel: false
							});
						}
					}
				})
			}
		}
	}
</script>

<style>
	@import url("../common/login-page.css");

	.uni-container {
		padding: 15px;
	}

	.send-btn {
		margin-top: 5px;
	}

	.uni-container ::v-deep .uni-forms-item__label {
		width: 15px !important;
	}
</style>
