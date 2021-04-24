<template>
	<view>
		<view class="title">
			{{confirmInfo.length}}人选择了此项
		</view>
		<view v-for="(item,index) in confirmInfo" :key="index" class="confirm-list">
			<u-avatar size="80" :src="item.avatar"></u-avatar>
			<view class="name">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				confirmInfo:[]
			};
		},
		onLoad(option) {
			this.confirmInfo = JSON.parse(decodeURIComponent(option.params))
			console.log("详情页的confirmInfo:", this.confirmInfo)
			// this.releaseTime = this.$u.timeFormat(this.confirmInfo.release_time, 'yyyy年mm月dd日 hh:MM')
			// this.checkConfirm()
			// this.getConfirmList()
		},
	}
</script>

<style lang="scss">
	.title{
		padding: 10rpx 20rpx;
		font-size: 20px;
		font-weight: bold;
	}
	.confirm-list{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20rpx;
		padding: 0 30rpx;
		.name{
			margin-top: 8rpx;
			font-size: 14px;
			font-weight: bold;
		}
	}
</style>
