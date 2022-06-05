// 上次启动时的用户信息
let userInfoHistory = uni.getStorageSync('userInfo') || {};
let speedInfoHistory = uni.getStorageSync('speedInfo') || {
	timer: {},
	hasStarted: false,
	mySpeedList: [],
	runningGameId: '',
	runningGame: {}
};
let globalSpeedStatusHistory = uni.getStorageSync('globalSpeedStatus') || false


let state = {
		//是否已经登录
		hasLogin: Boolean(Object.keys(userInfoHistory).length),
		//用户信息
		info: userInfoHistory,
		// 加速状态
		speedInfo: speedInfoHistory,
		globalSpeedStatus: globalSpeedStatusHistory
	},
	getters = {
		info(state) {
			return state.info;
		},
		hasLogin(state) {
			return state.hasLogin;
		},
		speedInfo(state) {
			return state.speedInfo
		},
		globalSpeedStatus(state) {
			return state.globalSpeedStatus
		}
	},
	mutations = {
		// setStatus(state, status) {
		// 	state.speedInfo.hasStarted = status

		// 	uni.setStorageSync('speedInfo', state.speedInfo);
		// },

		startSpeed(state, info) { //登录成功后的操作
			// console.log('receivedSpeedList', JSON.stringify(info.mySpeedList));
			//原有的结合传来的参数
			let _info = state.speedInfo;
			// console.log('state.speedInfo', JSON.stringify(_info));
			// console.log('state.myHistorySpeedList', JSON.stringify(state.speedInfo.mySpeedList));
			state.speedInfo = info
			// state.speedInfo.mySpeedList = Object.assign([], _info.mySpeedList, info.mySpeedList);
			var temp = {};
			var result = [];
			var totalList = _info.mySpeedList.concat(info.mySpeedList);
			// console.log('totalList', JSON.stringify(totalList));
			totalList.map(function(item, index) {
				if (!temp[item.gameId]) {
					result.push(item);
					temp[item.gameId] = true;
				}
			});
			state.speedInfo.mySpeedList = result
			// console.log('state.mySpeedList', JSON.stringify(state.speedInfo.mySpeedList));
			//存储最新的用户数据到本地持久化存储
			// state.speedInfo.mySpeedList = []
			uni.setStorageSync('speedInfo', state.speedInfo);
		},
		logout(state) {
			state.info = {};
			state.hasLogin = false;
			uni.setStorageSync('userInfo', {});
			uni.removeStorageSync('uni_id_token');
			uni.setStorageSync('uni_id_token_expired', 0)
		},
		login(state, info) {
			//原有的结合传来的参数
			let _info = state.info;
			state.info = Object.assign({}, _info, info);
			//设置为已经登录
			state.hasLogin = true;
			console.log('state.info', state.info);
			//存储最新的用户数据到本地持久化存储
			uni.setStorageSync('userInfo', state.info);
			if (info.token) {
				uni.setStorage({
					key: 'uni_id_token',
					data: state.info.token,
					complete(e) {
						// console.log('setStorage-------',e);
					}
				});
				uni.setStorageSync('uni_id_token_expired', state.info.tokenExpired)
			}
		}
	},
	actions = {
		logout(context) {
			uni.showLoading({
				mask: true
			})
			uniCloud.callFunction({
				name: 'uni-id-cf',
				data: {
					action: 'logout'
				},
				complete: (e) => {
					console.log(e);
					context.commit('logout')
					uni.hideLoading()
				}
			})
		}
	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
