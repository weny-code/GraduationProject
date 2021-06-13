<template>
	<view>
		<view v-if="currentRole.classRole == '老师'" @click="goDetails" class="card">
			<view class="head">
				<view class="flex">
					<u-avatar v-if="noticeList.type == '通知'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/729cd66c-07c0-4781-bbf9-9459c6dd76c8.png"></u-avatar>
					<u-avatar v-if="noticeList.type == '打卡'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/0bc6d23c-03f1-4b3f-9449-37e43dd7e5ef.png"></u-avatar>
					<u-avatar v-if="noticeList.type == '填表'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/1ba22451-43db-45b6-8e2a-cd9df0d8a192.png"></u-avatar>
					<view class="desc ">
						<view class="title">
							{{noticeList.title}}
						</view>
						<view class="publish">
							<view class="publisher">
								{{noticeList.publisher}}
							</view>
							<view class="publish-time">
								发布于{{releaseTime}}
							</view>
						</view>
					</view>
				</view>
				<view v-if="noticeList.type == '通知'" class="type-notice">
					通知
				</view>
				<view v-if="noticeList.type == '打卡'" class="type-clock">
					打卡
				</view>
				<view v-if="noticeList.type == '填表'" class="type-inves">
					填表
				</view>
			</view>
			<view class="content-desc">
				<view class="u-line-1">{{noticeList.content}}</view>
			</view>
			<view class="data">
				<u-grid v-show="currentRole.classRole == '老师'" :border="false" :col="3">
						<u-grid-item :custom-style="customStyle">
							<view id="gridH" class="text">
								{{confirmed}}
							</view>
							<view v-if="noticeList.type == '通知'" class="grid-text">已确认</view>
							<view v-if="noticeList.type == '打卡' || noticeList.type == '填表'" class="grid-text">已完成</view>
						</u-grid-item>
						<u-grid-item :custom-style="customStyle">
							<view class="text">
								{{noconfirmed}}
								<u-icon top="-7" color="#d81e06"
									custom-prefix="custom-icon" name="jinggao" :size="40"></u-icon>
							</view>
							<view v-if="noticeList.type == '通知'" class="grid-text">未确认</view>
							<view v-if="noticeList.type == '打卡' || noticeList.type == '填表'" class="grid-text">未完成</view>
						</u-grid-item>
						<u-grid-item :custom-style="customStyle">
							<cmd-progress type="circle" :percent="getPercent" :width="gridHeight" stroke-shape="square"></cmd-progress>
							<view class="grid-text">确认率</view>
						</u-grid-item>
				</u-grid>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="foot">
				<view class="class-name">
					班级：{{noticeList.class_name}}
				</view>
			</view>
		</view>
		<view v-if="currentRole.classRole == '学生'" @click="goDetails" class="card">
			<view class="head">
				<view class="flex">
					<u-avatar v-if="noticeList.type == '通知'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/729cd66c-07c0-4781-bbf9-9459c6dd76c8.png"></u-avatar>
					<u-avatar v-if="noticeList.type == '打卡'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/0bc6d23c-03f1-4b3f-9449-37e43dd7e5ef.png"></u-avatar>
					<u-avatar v-if="noticeList.type == '填表'" size="80" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/1ba22451-43db-45b6-8e2a-cd9df0d8a192.png"></u-avatar>
					<view class="desc ">
						<view class="title">
							{{noticeList.title}}
						</view>
						<view class="publish flex">
							<view class="publisher">
								{{noticeList.publisher}}
							</view>
							<view class="publish-time">
								发布于{{releaseTime}}
							</view>
						</view>
					</view>
				</view>
				<view v-if="noticeList.type == '通知'" class="type-notice">
					通知
				</view>
				<view v-if="noticeList.type == '打卡'" class="type-clock">
					打卡
				</view>
				<view v-if="noticeList.type == '填表'" class="type-inves">
					填表
				</view>
			</view>
			<view class="foot">
				<view class="class-name">
					班级：{{noticeList.class_name}}
				</view>
			</view>
			<view class="content-desc">
				<view class="u-line-1">{{noticeList.content}}</view>
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view v-show="!hasConfirmed" class="btn" style="color:#007AFF">
				<u-icon name="play-right-fill" color="#007AFF" size="28"></u-icon>
				<text v-if="noticeList.type == '通知'">去确认</text>
				<text v-if="noticeList.type == '打卡'">去打卡</text>
				<text v-if="noticeList.type == '填表'">去填表</text>
			</view>
			<view v-show="hasConfirmed" class="btn" style="color: #606266;">
				<u-icon name="checkmark" color="#606266" size="28"></u-icon>
				<text v-if="noticeList.type == '通知'">已确认</text>
				<text v-if="noticeList.type == '打卡'">已打卡</text>
				<text v-if="noticeList.type == '填表'">已填表</text>
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
		name: "noticeCard",
		props: ['noticeList'],
		data() {
			return {
				customStyle: {
					paddingBottom: '0',
					paddingTop: '0',
					textAlign: "center",
					overflow:"hidden",
					fontSize:"24rpx"
				},
				hasConfirmed:false,
				gridHeight:0,
				confirmed:0,
				noconfirmed:0,
				releaseTime:"",
				noticeContent:'瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半'
			};
		},
		computed:{
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
			getPercent() {
				this.confirmPercent = this.confirmed / (this.noconfirmed + this.confirmed) * 100
				return this.confirmPercent
			},
		},
		methods:{
			goDetails(){
				var params = encodeURIComponent(JSON.stringify(this.noticeList))
				uni.navigateTo({
					url: '../../packageB/pages/noticeDetails/noticeDetails?params='+params,
					success() {
						console.log("跳转成功")
					},
					fail() {
						console.log("跳转失败")
					},
					complete() {
						console.log("跳转完成")
					}
				})
			},
			async checkConfirm(){
				const db = uniCloud.database()
				await db.collection('class-notice').where({
					'_id':this.noticeList._id,
					'confirmed.stu_id':this.uid,
					'confirmed.stu_class':this.noticeList.class_id
				})
				.get()
				.then((res=>{
					console.log("checkConfirm",res)
					if(res.result.data.length != 0){
						this.hasConfirmed = true
					}
				}))
			}
		},
		created() {
			var _this = this
			uni.$on('updateConfirm', function(data){
				console.log('监听到事件来自 updateConfirm')
				_this.checkConfirm()
			})
		},
		destroyed() {
			uni.$off('updateConfirm', this.checkConfirm())
		},
		mounted() {
			console.log("noticelist:",this.noticeList)
			for(let i=0;i<this.noticeList.confirmed.length;i++){
				if(this.noticeList.confirmed[i].stu_class == this.noticeList.class_id){
					this.confirmed++
				}
			}
			this.noconfirmed = this.noticeList.class_size - this.confirmed
			this.releaseTime = this.$u.timeFormat(this.noticeList.release_time, 'mm月dd日 hh:MM')
			if(this.currentRole.classRole == '老师'){
				const query = uni.createSelectorQuery().in(this);
				query.select('#gridH').boundingClientRect(data => {
				  console.log("得到布局位置信息" + JSON.stringify(data));
				  console.log("节点离页面顶部的距离为" + data.height);
				  this.gridHeight = data.height
				}).exec();
			}
			this.checkConfirm()
		}
	}
</script>

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
	
	.head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 30rpx;
		.desc{
			padding: 0 20rpx;
			// margin-left: -40rpx;
			.title{
				font-weight: bold;
				font-size: 18px;
			}
			.publish{
				margin-top: 4rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.publisher{
					color: #333;
				}
				.publish-time{
					margin-left: 20rpx;
					color: #909399;
				}
			}
		}
	}
	
	.content-desc{
		padding: 10rpx 40rpx; 
		text-align: left;
		font-size: 16px;
	}
	
	.data{
		margin-top: 6rpx;
		padding: 0 10rpx;
		margin-bottom: 20rpx;
	}

	.text{
		font-size: 30px;
	}
	
	.grid-text {
		font-size: 14px;
		margin-top: 10rpx;
		color: #303133;
	}
	
	.foot{
		padding: 10rpx 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.class-name{
			margin-top: 10rpx;
			color: #333;
			font-size: 14px;
		}
	}
	
	.type-notice{
		background: #00b000;
		padding: 10rpx 20rpx;
		color: #ffffff;
		border-radius: 30rpx;
	}
	
	.type-clock{
		background: #0055ff;
		padding: 10rpx 20rpx;
		color: #ffffff;
		border-radius: 30rpx;
	}
	.type-inves{
		background: #d38d00;
		padding: 10rpx 20rpx;
		color: #ffffff;
		border-radius: 30rpx;
	}
	
	.btn{
		margin-top: 16rpx;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
</style>
