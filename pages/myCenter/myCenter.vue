<template>
	<view>
		<view class="center flex">
			<view class="logo flex">
				<image class="logo-img" :src="userInfo.avatar"></image>
				<view class="logo-title flex">
					<text class="uer-name">Hi，{{currentRole.username}}</text>
					<text class="go-login navigat-arrow">&#xe65e;</text>
				</view>
			</view>
			<view class="btn flex center">
				<u-button @click="goJoin" type="primary" :plain="true">加入班级</u-button>
				<view style="margin-top: 20rpx;">
					<u-button @click="goCreate" type="primary" :plain="true">创建班级</u-button>
				</view>
				<view style="margin-top: 20rpx;">
					<u-button @click="backToIndex" type="warning" :plain="true">切换身份</u-button>
				</view>
			</view>
		</view>
		<u-tabbar :list="tabbar" :mid-button="true" active-color="#00aaff"></u-tabbar>
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
				
			}
		},
		computed:{
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		methods: {
			backToIndex(){
				uni.reLaunch({
				    url: '../index/index'
				});
			},
			goJoin(){
				uni.navigateTo({
					url: '../../packageB/pages/joinClass/joinClass',
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
			goCreate(){
				uni.navigateTo({
					url: '../../packageB/pages/createClass/createClass',
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
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}
	.flex{
		display: flex;
	}
	.center {
		flex-direction: column;
	}
	.btn{
		width: 60%;
		height: 300rpx;
		margin: 20rpx auto;
	}
	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: #a9c6b6;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #4cd964;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>