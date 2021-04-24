<template>
	<view>
		<view class="head">
			<view class="title">
				<text>选择您的班级</text>
			</view>
		</view>
		<view v-for="(item,index) in currentRoleClassList" :key="index" class="content flex" @click="selectClass(item)">
			<view class="item flex">
				<view class="headImg">
					<u-avatar size="70" src="/static/img/student.png"></u-avatar>
				</view>
				<view class="class-name">
					{{item.class_name}}
				</view>
			</view>
			<u-icon name="arrow-right"></u-icon>
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
				classInfo: {},
			};
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		onLoad() {
		},
		methods: {
			goApply() {
				var params = encodeURIComponent(JSON.stringify(this.classInfo))
				uni.navigateTo({
					url: '../../../packageB/pages/applyLeave/applyLeave?params='+params,
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
			selectClass(data) {
				this.classInfo = data
				this.goApply()
			},
		}
	}
</script>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.head {
		margin-top: 50rpx;
		padding: 10rpx 30rpx;

		.title {
			font-size: 26px;
			font-weight: bold;
		}

		.desc {
			margin-top: 10rpx;
			font-size: 16px;
			color: #b9b9b9;
		}
	}

	.content {
		padding: 20rpx 30rpx;
		background: #f7f8fa;
		margin: 50rpx 30rpx;
		border-radius: 30rpx;

		.item {
			width: 50%;
			padding: 10rpx;

			.headImg {
				padding: 10rpx 20rpx;
				border-radius: 40%;
				background: #aaffff;
			}

			.class-name {
				margin-left: 20rpx;
				font-size: 20px;
				font-weight: bold;
			}
		}
	}
</style>
