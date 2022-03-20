// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
module.exports = {
	subscribe:(userId='',plan='')=>{
		const db =uniCloud.database()
		db.collection("speednet-membership").add({
			user_id:"6231f551e809d900010e6a48",
			remaining_minites:10,
			is_pause: false，,
			start_time: 12321321
		})
		return true
	}
}
