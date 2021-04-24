'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const dbCmd = db.command
	let res = await db.collection('class-notice').doc(event.id).update({
		confirmed: dbCmd.push([{
			stu_class:event.stu_class,
			stu_id:event.stu_id,
			stu_name:event.stu_name,
			stu_avatar:event.stu_avatar,
			submit_time:event.submit_time,
			stu_choice:event.stu_choice
		}])
	})
	//返回数据给客户端
	return event
};
