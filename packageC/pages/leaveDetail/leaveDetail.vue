<template>
	<view>
		<view v-if="show" class="loading">
			<Loading text="加载中.." :mask="true" click="true" ref="loading"></Loading>
		</view>
		<view class="head">
			<u-avatar size="80" :src="leaveInfo.stu_id[0].avatar"></u-avatar>
			<view class="content">
				<view class="name">
					{{leaveInfo.stu_name}}
				</view>
				<view v-if="leaveInfo.result == 0" class="status" style="color: #007AFF;">
					待审批
				</view>
				<view v-if="leaveInfo.result == 1" class="status" style="color: #00ff00;">
					审批通过
				</view>
				<view v-if="leaveInfo.result == 2" class="status" style="color: #ff3b35;">
					审批不通过
				</view>
			</view>
		</view>
		<view class="main">
			<view style="padding: 20rpx 0;">
				请假类型：
				<text style="color: #333;">{{leaveInfo.leave_reason}}</text>
			</view>
			<view style="padding: 20rpx 0;">
				开始时间：
				<text style="color: #333;">{{leaveInfo.start_time}}</text>
			</view>
			<view style="padding: 20rpx 0;">
				结束时间：
				<text style="color: #333;">{{leaveInfo.end_time}}</text>
			</view>
			<view style="padding: 20rpx 0;">
				请假说明：
				<text style="color: #333;">{{leaveInfo.leave_explain}}</text>
			</view>
			<view style="padding: 20rpx 0;">
				所在班级：
				<text style="color: #333;">{{leaveInfo.className}}</text>
			</view>
		</view>
		<view v-if="leaveInfo.result == 0" class="btn">
			<u-button @click="handle(2)" :plain="true" shape="circle" :custom-style="customStyle">不批准</u-button>
			<u-button @click="handle(1)" shape="circle" :custom-style="customStyle">批准</u-button>
		</view>
	</view>
</template>

<script>
	import Loading from "@/components/loading.vue";
	export default {
		components: {
			Loading
		},
		data() {
			return {
				leaveInfo:{},
				show:false,
				customStyle:{
					background:'#45cfcf',
					color:"#fff",
					padding:'10rpx 60rpx'
				}
			};
		},
		onLoad(option) {
			this.leaveInfo = JSON.parse(decodeURIComponent(option.params))
			console.log("学生请假详情页:", this.leaveInfo)
		},
		methods:{
			async handle(id){
				this.show=true
				const db = uniCloud.database()
				await db.collection('class-leave').where({
					_id : this.leaveInfo._id
				})
				.update({
					result:id
				})
				.then((res=>{
					this.show=false
					console.log(res)
				}))
			}
		}
	}
</script>

<style lang="scss">
	.head{
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.content{
			margin-left: 20rpx;
			.name{
				font-size: 20px;
			}
			.status{
				margin-top: 6rpx;
			}
		}
	}
	
	.main{
		font-size: 18px;
		padding: 10rpx 20rpx;
		color: #a8a8a8;
	}
	
	.btn{
		background: #f7f8fa;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		margin-top: 40rpx;
		padding: 30rpx 0;
	}
	
	.loading {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 150rpx;
		width: 150rpx;
		left: 50%;
		top: 50%;
		margin-top: -75rpx;
		margin-left: -75rpx;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10upx;
		background: #040038;
		z-index: 999;
	}
</style>
