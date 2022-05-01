// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
module.exports = {
	subscribe: async function(userId = '', userName = '', money = 0, planHours = 0) {
		var result = false
		const db = uniCloud.database()
		var current = await db.collection("speednet-membership").where({
			user_id: userId
		}).limit(1).get()
		if (current.data[0]) {
			var myship = current.data[0]
			var docId = myship._id

			var current_remaining = myship.remaining_minites
			if (!myship.is_pause) {
				var now = new Date().getTime()
				var reverse = Date.parse(myship.reverse_date)
				var sub = now - reverse
				var my_time = Math.floor(sub / (60 * 1000))
				current_remaining = myship.remaining_minites - my_time
			}

			var oldReverseDate = myship.reverse_date

			if (current_remaining < 0) {
				current_remaining = 0
				oldReverseDate = Date()
			}
			var addres = await db.collection("speednet-membership").doc(docId).update({
				remaining_minites: planHours * 60 + current_remaining,
				is_pause: false,
				reverse_date: oldReverseDate
			})
			if (addres) {
				var record = await db.collection("speednet-money-record").add({
					user_id: userId,
					user_name: userName,
					money: money,
					membership_hours: planHours
				})
				result = true
			} else {
				result = false
			}
		} else {
			var addres = await db.collection("speednet-membership").add({
				user_id: userId,
				remaining_minites: planHours * 60,
				is_pause: false,
				start_time: Date(),
				reverse_date: Date()
			})

			console.log(addres);
			if (addres) {
				var record = await db.collection("speednet-money-record").add({
					user_id: userId,
					user_name: userName,
					money: money,
					membership_hours: planHours
				})
				result = true
			} else {
				result = false
			}
		}
		return result
	},
	getMembership: async function(userId = '') {
		const db = uniCloud.database()
		var membership = await db.collection("speednet-membership").where({
			user_id: userId
		}).get()

		if (membership.data.length == 0) {
			return ""
		}

		var myship = membership.data[0]


		if (!myship.is_pause) {
			var now = new Date().getTime()
			var reverse = Date.parse(myship.reverse_date)
			var sub = now - reverse
			var my_time = Math.floor(sub / (60 * 1000))
			var remaining = myship.remaining_minites - my_time

			myship.remaining_minites = remaining < 0 ? 0 : remaining
		}
		return myship
	},
	pause: async function(userId = '') {
		const db = uniCloud.database()
		var current = await db.collection("speednet-membership").where({
			user_id: userId
		}).limit(1).get()
		if (current.data[0]) {
			var docId = current.data[0]._id
			var current_remaining = current.data[0].remaining_minites
			if (current.data[0].is_pause) {
				// 如果处在暂停状态，设置为生效，剩余时间不变，下次暂停时更新
				var addres = await db.collection("speednet-membership").doc(docId).update({
					reverse_date: Date(),
					is_pause: false,
				})
				return '恢复成功!'
			} else {
				// 如果正在生效中，设置为暂停，并更新剩余时间= 当前剩余时间 - (当前时间 - 上次恢复时间)
				var now = new Date().getTime()
				var reverse = Date.parse(current.data[0].reverse_date)
				var sub = now - reverse
				var my_time = Math.floor(sub / (60 * 1000))
				var remaining = current.data[0].remaining_minites - my_time
				var addres = await db.collection("speednet-membership").doc(docId).update({
					remaining_minites: remaining,
					is_pause: true,
				})
				return '暂停成功!'
			}
		} else {
			return '请先订阅!'
		}
	},
	checkremaining: async function(userId = '') {
		const db = uniCloud.database()
		var membership = await db.collection("speednet-membership").where({
			user_id: userId
		}).get()
		if (membership.data[0] == null) {
			return 0
		} else {
			var remaining = membership.data[0].remaining_minites
		}
		return membership.remaining_minites
	}
}
