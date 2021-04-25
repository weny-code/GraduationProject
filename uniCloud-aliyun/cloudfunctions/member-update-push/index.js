'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const dbCmd = db.command
	let res = await db.collection('class-list').doc(event.class_id).update({
		class_members: dbCmd.push([{
			members_id: event.id,
			mobile:event.mobile,
			username:event.username,
			class_role: event.role
		}])
	})
	//返回数据给客户端
	return event
};
