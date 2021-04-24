'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	exports.main = async function(event,context) {
	    const payload = await uniID.checkToken(event.uniIdToken)
	  const {
	    code,
	    token,
	    tokenExpired
	  } = payload
	  if(code) { // code不为0代表token校验未通过
	    return payload
	  }
	  console.log('payload : ', payload)
	  // 其他业务代码
	  return {
	    token,
	    tokenExpired
	  }
	}
	
};
