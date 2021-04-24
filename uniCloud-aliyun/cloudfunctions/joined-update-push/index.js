'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const dbCmd = db.command
	let res = await db.collection('uni-id-users').doc(event.id).update({
		joined_class: dbCmd.push([{
			class_id: event.class_id,
			class_role: event.role
		}])
	})
	//返回数据给客户端
	return event
};
