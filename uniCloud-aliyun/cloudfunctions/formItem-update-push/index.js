'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const dbCmd = db.command
	let res = await db.collection('class-notice').doc(event.id).update({
		form_item: dbCmd.push([
			event.option
		])
	})
	//返回数据给客户端
	return event
};
