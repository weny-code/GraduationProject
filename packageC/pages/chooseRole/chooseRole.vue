<template>
	<view>
		<view class="head">
			<view class="title">
				<text>选择您在{{classInfo.class_name}}中的身份</text>
			</view>
			<view class="desc">
				<text>加入班级管理系统，让教育更方便</text>
			</view>
		</view>
		<view class="content flex" @click="selectStu">
			<view class="item flex">
				<view class="headImg">
					<u-avatar size="70" src="/static/img/student.png"></u-avatar>
				</view>
				<view class="name">
					我是学生
				</view>
			</view>
			<u-icon name="arrow-right"></u-icon>
		</view>
		<view class="content flex" @click="selectTea">
			<view class="item flex">
				<view class="headImg">
					<u-avatar size="70" src="/static/img/teacher.png"></u-avatar>
				</view>
				<view class="name">
					我是老师
				</view>
			</view>
			<u-icon name="arrow-right"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classInfo: "",
				role: ""
			};
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			console.log(this.classInfo)
		},
		methods: {
			goFill() {
				var params1 = encodeURIComponent(JSON.stringify(this.classInfo))
				var params2 = encodeURIComponent(JSON.stringify(this.role))
				uni.navigateTo({
					url:'../fillInfo/fillInfo?params=' + params1 + '&role=' + params2,
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
			selectStu() {
				this.role = '学生'
				this.goFill()
			},
			selectTea() {
				this.role = '老师'
				this.goFill()
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

			.name {
				margin-left: 20rpx;
				font-size: 20px;
				font-weight: bold;
			}
		}
	}
</style>
