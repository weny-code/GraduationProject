<template>
	<view>
		<view class="card">
			<view style="font-size: 20px;font-weight: bold;">
				请假申请：
			</view>
			<view v-for="(res,index) in list" :key="res._id" class="item">
				<u-line color="#e4e7ed"></u-line>
				<view class="person-info flex">
					<u-avatar size="80" :src="res.stu_id[0].avatar"></u-avatar>
					<view class="info">
						<view class="name">
							{{currentRole.username}}
						</view>
						<view class="time">
							{{$u.timeFormat(res.submit_time, 'yyyy年mm月dd日 hh:MM')}}
						</view>
					</view>
				</view>
				<view class="detail">
					<view>
						请假类型：{{res.leave_reason}}
					</view>
					<view>
						开始时间：{{res.start_time}}
					</view>
					<view>
						结束时间：{{res.end_time}}
					</view>
					<view>
						所在班级：{{classInfo.class_name}}
					</view>
					<view class="result flex" v-if="res.result==0">
						<view class="">
							审批结果：
						</view>
						<view class="res-0">
							<text>审批中</text>
						</view>
					</view>
					<view class="result flex" v-if="res.result==1">
						<view class="">
							审批结果：
						</view>
						<view class="res-1">
							<text>通过</text>
						</view>
					</view>
					<view class="result flex" v-if="res.result==2">
						<view class="">
							审批结果：
						</view>
						<view class="res-2">
							<text>拒绝</text>
						</view>
					</view>
				</view>
			</view>
		</view>
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
				list:[],
				classInfo:{}
			};
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			this.getLeaveList()
		},
		methods: {
			async getLeaveList() {
				const db = uniCloud.database()
				const dbCmd = db.command
				await db.collection('class-leave,uni-id-users')
					.where({
						'stu_id._id': this.uid,
						class_id:this.classInfo._id
					})
					.field(
						'_id,class_id,result,stu_id{_id,avatar},approver_id{username},leave_reason,leave_explain,submit_time,start_time,end_time'
					)
					.get({
						getCount: true
					}).then((res) => {
						console.log("res：", res)
						this.list = res.result.data
						// console.log(res.result.data[0].class_id == this.classInfo._id)
						// this.list = res.result.data.filter(item => item.class_id == this.classInfo._id)
						console.log("list:",this.list)
					}).catch((err) => {
						console.log(err)
					})
			}
		}
	}
</script>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: flex-start;
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
	
	.item{
		margin-top: 10rpx;
		padding: 10rpx;
	}
	
	.person-info {
		margin-top: 20rpx;
		.info {
			margin-left: 20rpx;
	
			.name {
				font-size: 18px;
			}
	
			.time {
				font-size: 16px;
				color: #909399;
			}
		}
	}
	
	.detail{
		display: flex;
		flex-direction:column;
		justify-content: space-between;
		align-items: left;
		margin-top: 8rpx;
		margin-left: 10rpx;
		font-size: 16px;
	}
	
	.result{
		margin-top: 20rpx;
		font-weight: bold;
		font-size: 18px;
		// color: #000000;
	}
	
	@function setColor($n) {
		@if $n == 0 {
			 @return #0055ff;
		}
		@else if $n == 1 {
			 @return #00aa00;
		}
		@else{
			 @return #ff0000;
		}
	}
	@function setBackground($n) {
		@if $n == 0 {
			 @return #aaffff;
		}
		@else if $n == 1 {
			 @return #aaff7f;
		}
		@else{
			 @return #ff846b;
		}
	}
	
	.res-0{
		background: setBackground(0);
		color: setColor(0);
		font-size: 14px;
		padding: 6rpx 12rpx;
		margin-left: 20rpx;
	}
	.res-1{
		background: setBackground(1);
		color: setColor(1);
		font-size: 14px;
		padding: 6rpx 12rpx;
		margin-left: 20rpx;
	}
	.res-2{
		background: setBackground(2);
		color: setColor(2);
		font-size: 14px;
		padding: 6rpx 12rpx;
		margin-left: 20rpx;
	}
</style>
