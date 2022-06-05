<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js';

	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)

			initApp();

			// #ifdef H5
			openApp() //创建在h5端全局悬浮引导用户下载app的功能
			// #endif
			// #ifdef APP-PLUS
			//checkIsAgree(); APP端暂时先用原生默认生成的。目前，自定义方式启动vue界面时，原生层已经请求了部分权限这并不符合国家的法规
			// #endif

			// #ifdef H5
			// checkIsAgree(); // 默认不开启。目前全球，仅欧盟国家有网页端同意隐私权限的需要。如果需要可以自己去掉注视后生效
			// #endif

			// #ifdef APP-PLUS
			//idfa有需要的用户在应用首次启动时自己获取存储到storage中
			//https://ask.dcloud.net.cn/article/36107
			/*if(~plus.storage.getItem('idfa')){
				plus.device.getInfo({//需要勾选IDFA
					success:function(e){  
						console.log('idfa =  '+JSON.stringify(e.idfa));  
					},
					fail:function(e){
						console.log('getDeviceInfo failed: '+JSON.stringify(e));  
					}  
				});
			}*/
			// #endif


			var autoSpeed = uni.getStorageSync("autoSpeed")

			if (autoSpeed == true) {
				try {
					var lastSpeed = uni.getStorageSync('lastSpeed')
					console.log("lastSpeed:-----", lastSpeed, ",type:", typeof(lastSpeed))
					if (typeof(lastSpeed) == 'object') {
						var detailUrl = '/pages/speednet-myspeed/autospeed?autoSpeed=true&id=' + lastSpeed.gameId +
							'&name=' +
							lastSpeed
							.gameName +
							'&peer_id=' + lastSpeed.peerId + '&peer_name=' + lastSpeed.peerName +
							'&processes=' + lastSpeed
							.processes +
							'&picurl=' +
							lastSpeed.picurl
						uni.navigateTo({
							url: detailUrl,
						})
					}
				} catch (e) {
					uni.showToast({
						title: "自动加速失败",
						icon: 'error',
					});
					uni.reLaunch({
						url: "/pages/list/list"
					})
				}
			}
		},
		onShow: function() {
			// 初始化加速状态为否，待进入页面后再获取真正状态
			uni.setStorageSync('globalSpeedStatus', false)

			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 	page {
		background-color: #002;
	} */
</style>
