<template>
	<view>
		<view style="content: ''; overflow: hidden;"></view>
		<view class="card">
			<view class="item">
				<text>请假人</text>
				<text>{{currentRole.username}}</text>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="item">
				<text>请假原因</text>
				<view @click="reasonShow = true">
					{{reason}}
					<u-icon name="arrow-right" color="#909399" size="36"></u-icon>
				</view>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view style="padding: 30rpx;">
				<u-input  type="textarea" v-model="leaveExplain" placeholder="填写请假具体说明(非必填)"
					:border="false" height="250" />				
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="item">
				开始时间
				<view @click="startShow = true" :style="{ color: startColor, fontSize: '14px' }">
					{{startTime}}
					<u-icon name="arrow-right" color="#909399" size="36"></u-icon>
				</view>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="item">
				结束时间
				<view @click="endShow = true" :style="{ color: endColor, fontSize: '14px' }">
					{{endTime}}
					<u-icon name="arrow-right" color="#909399" size="36"></u-icon>
				</view>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="item">
				<text>审批老师</text>
				<view @click="teacherShow = true">
					{{approver}}
					<u-icon name="arrow-right" color="#909399" size="36"></u-icon>
				</view>
			</view>
			<u-line color="#e4e7ed"></u-line>
		</view>
		<view class="btn">
			<u-button @click="submitApply" type="primary" shape="circle" :ripple="true" ripple-bg-color="#909399">提交申请
			</u-button>
		</view>
		<u-modal @confirm="backToIndex" v-model="show" :content="content"></u-modal>
		<u-select v-model="reasonShow" mode="single-column" :list="list" @confirm="setReason"></u-select>
		<u-picker @confirm="setStartTime" mode="time" v-model="startShow" :params="params"></u-picker>
		<u-picker @confirm="setEndTime" mode="time" v-model="endShow" :params="params"></u-picker>
		<u-select v-model="teacherShow" mode="single-column" :list="teacherList" @confirm="setApprover"></u-select>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				startTime:"请选择",
				endTime:"请选择",
				list:[{
						value: '1',
						label: '病假'
					},
					{
						value: '2',
						label: '事假'
					}],
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: false,
					second: false,
					timestamp: true,
				},
				show:false,
				content:"",
				startShow: false,
				endShow: false,
				reasonShow: false,
				teacherShow: false,
				reason:"事假",
				leaveExplain:"",
				approver:"",
				startColor:'#909399',
				endColor: '#909399',
				classInfo:{},
				teacherList:[]
			};
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			console.log(this.classInfo)
			this.getTeacherList()
		},
		methods:{
			backToIndex(){
				uni.reLaunch({
				    url: '../../../pages/index/index'
				});
			},
			async getTeacherList(){
				for(let item of this.classInfo.class_members){
					if(item.class_role == "老师"){
						this.teacherList.push(item.members_id)
					}
				}
				const db = uniCloud.database()
				const dbCmd = db.command
				await db.collection('uni-id-users')
					.where({
						'_id': dbCmd.in(this.teacherList)
					})
					.field(
						'_id,nickname'
					)
					.get({
						getCount: true
					}).then((res) => {
						console.log("res：",res.result.data)
						this.teacherList = []
						for(let item of res.result.data){
							console.log("item：",item)
							this.teacherList.push({
								value:item._id,
								label:item.nickname
							})
						}
						// this.teacherList = res.result.data
					}).catch((err) => {
						console.log(err)
					})
				console.log("teacherList：",  this.teacherList)
				this.approver = this.teacherList[0].label
				this.appId = this.teacherList[0].value
			},
			setStartTime(e){
				console.log(e)
				this.startTime = this.$u.timeFormat(e.timestamp, 'yyyy年mm月dd日 hh时')
				this.startColor = '#333'
				console.log("start:",this.startTime)
			},
			setEndTime(e){
				console.log(e)
				this.endTime =this.$u.timeFormat(e.timestamp, 'yyyy年mm月dd日 hh时')
				this.endColor = '#333'
				console.log("end:",this.endTime)
			},
			setReason(e){
				console.log(e)
				this.reason = e[0].label
			},
			setApprover(e){
				console.log("approver:",e)
				this.appId = e[0].value
				this.approver = e[0].label
			},
			async submitApply(){
				var time = new Date().getTime()
				const db = uniCloud.database() //代码块为cdb
				await db.collection("class-leave")
					.add({
						class_id:this.classInfo._id,
						stu_id: this.uid,
						stu_name:this.currentRole.username,
						approver_id:this.appId,
						leave_reason: this.reason,
						leave_explain: this.leaveExplain,
						submit_time:time,
						start_time: this.startTime,
						end_time:this.endTime,
					})
					.then((res) => {
						uni.showToast({
							title: '发布成功！'
						})
						console.log(res)
						this.show = true
						this.content = "班级资料发生改变，请返回首页重新进入！"
					})
					.catch((err) => {
						uni.showModal({
							content: err.message || '发布失败',
							showCancel: false
						})
					})
					.finally(() => {
				
					})
			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f7f8fa;
	}

	/* #endif */
</style>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card {
		// width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		overflow: hidden;
		padding: 20rpx 0;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 30rpx;
		font-size: 16px;
	}
	
	.btn {
		width: 400rpx;
		margin: 40rpx auto;
	}
</style>
