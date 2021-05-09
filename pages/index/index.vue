<template>
	<view>
		<!-- <u-mask :show="show" :mask-click-able="false"> -->
			<view v-if="show" class="loading">
				<Loading text="加载中.." :mask="true" click="true" ref="loading"></Loading>
			</view>
		<!-- </u-mask> -->
		<u-navbar :border-bottom="false" :is-back="false">
			<view class="slot-wrap">
				<view hover-class="hover" style="border-radius: 50%">
					<u-icon @click="backToIndex" color="#ff9900" custom-prefix="custom-icon" name="shouye" :size="70">
					</u-icon>
				</view>
				<view class="name">
					邑班之助
				</view>
			</view>
		</u-navbar>
		<view v-if="!hasRole" class="content">
			<view class="swiperContainer">
				<u-swiper :border-radius="8" :height="300" :list="imgList"></u-swiper>
			</view>
			<view class="choose">
				<view class="btn" @click="getUserProfile(0)">
					<view class="test1">
						<view class="option-box">创建我的班级</view>
						<view class="option-box2">班导师/辅导员</view>
					</view>
				</view>
				<view class="btn" @click="getUserProfile(1)">
					<view class="test2">
						<view class="option-box">加入我的班级</view>
						<view class="option-box2">学生</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="hasRole" class="list-box">
			<idenfity-list></idenfity-list>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import idenfityList from "@/components/identityList/identityList.vue";
	import Loading from "@/components/loading.vue";
	export default {
		components: {
			idenfityList,
			Loading
		},
		data() {
			return {
				imgList: [{
						image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/6e0dffdf-9011-47eb-8f14-74378866dec9.jpg'
					},
					{
						image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/6e0dffdf-9011-47eb-8f14-74378866dec9.jpg'
					}
				],
				hasRole: false,
				show: true
			}
		},
		onLoad() {
			console.log("index onLoad...")
			var _this = this
			uni.$once('login', function(data) {
				console.log('监听到事件来自 login ，携带参数 msg 为：' + data.msg);
				_this.getInfo()
			})
			// this.show=false
			this.getInfo()
		},
		computed: {
			...mapState(['uid', 'hasLogin', 'userInfo', 'hasAuth'])
		},
		methods: {
			...mapMutations(["setID", "login", "logout", "getAuth"]),
			backToIndex() {
				uni.reLaunch({
					url: '../index/index'
				});
			},
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					weixinAuthService.authorize(function(res) {
						console.log("47行成功")
						resolve(res.code)
					}, function(err) {
						console.log(err)
						console.log("51行失败")
						reject(new Error('微信登录失败!!!'))
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							console.log("59行成功")
							console.log(res.code)
							resolve(res.code)
						},
						fail(err) {
							console.log("63行失败")
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			loginByWeixin() {
				this.getWeixinCode().then((code) => {
					console.log(code)
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code,
							}
						}
					})
				}).then((res) => {
					console.log("登录成功")
					if (res.result.code === 0) {
						console.log("首次登录")
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					}
					this.login();
				}).catch((e) => {
					console.error(e)
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试2'
					})
				})
			},
			async userInfoHandler(res, e) {
				console.log(res.userInfo)
				this.getAuth(res.userInfo)
				const db = uniCloud.database() //代码块为cdb
				let result = await db.collection('uni-id-users')
					.where('_id == $cloudEnv_uid')
					// .where('nickname == "hwy"')
					// .field('_id')
					.update({
						username:res.userInfo.nickName,
						nickname: res.userInfo.nickName,
						avatar: res.userInfo.avatarUrl,
						gender: res.userInfo.gender
					})
					.then((res => {
						this.getInfo()
					}))
					.catch((err) => {
						console.log(err.code); // 打印错误码
						console.log(err.message); // 打印错误内容
					})
				console.log("用户名为：" + res.userInfo.nickName)
				console.log(this.userInfo)
				if (e == 0) {
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
				} else {
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
				}
			},
			getUserProfile(e) {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.userInfoHandler(res, e)
					}
				})
			},
			async getInfo() {
				console.log("正在执行getUserInfo")
				const db = uniCloud.database()
				await db.collection('uni-id-users').where('_id == $cloudEnv_uid').field(
					'avatar,gender,nickname,username,joined_class'
				).get().then((res) => {
					// res 为数据库查询结果
					console.log(res.result.data)
					if (res.result.data[0].nickname) {
						console.log("已授权")
						this.setID(res.result.data[0]._id)
						console.log(this.uid)
						uni.setStorageSync('uni_id', this.uid)
						this.getAuth(res.result.data[0])
						this.checkRole()
					} else {
						console.log("未授权")
						this.show = false
					}
				}).catch((err) => {
					console.log(err)
					// this.getUserInfo()
				})
			},
			async checkRole() {
				const db = uniCloud.database()
				await db.collection('uni-id-users').where('_id == $cloudEnv_uid').field('joined_class').get({
					getOne: true
				}).then((res) => {
					console.log(res.result.data)
					if ((typeof res.result.data.joined_class == "object") && (res.result.data.joined_class
							.constructor.name == 'Array')) {
						if (res.result.data.joined_class.length > 0) {
							this.hasRole = true
							this.show = false
						} else {
							this.hasRole = false
							this.show = false
						}
					}else{
						this.show=false
					}
				})
			},
			goIndex() {
				uni.switchTab({
					url: '../home/home',
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

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f7f8fa;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
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

	.content {
		margin: 0;
		padding: 0;
	}

	.warp {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.btn {
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 12rpx;
		color: #FFFFFF;
		border: none;
		text-align: center;
		padding: 70rpx 20rpx;
	}

	.box {
		position: relative;
		display: flex;
		height: 350upx;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10upx;
		margin-top: 30upx;
		flex: 0 0 350upx;
		background: #040038;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.list-box {
		margin-top: 30rpx;
	}

	.swiperContainer {
		padding: 30rpx;
	}

	.test1 {
		position: relative;
		border-radius: 12rpx;
		background: linear-gradient(90deg, #ffc700 0%, #e91e1e 33%, #6f27b0 66%, #00ff88 100%);
		background-position: 100% 0;
		animation: bgSize 5s infinite ease-in-out alternate;
	}

	.test2 {
		position: relative;
		border-radius: 12rpx;
		background: linear-gradient(90deg, #e50000 0%, #b83d00 33%, #ff5500 66%, #ffaa00 100%);
		background-position: 100% 0;
		animation: bgSize 5s infinite ease-in-out alternate;
	}

	@keyframes bgSize {
		0% {
			background-size: 300% 100%;
		}

		100% {
			background-size: 100% 100%;
		}
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.list {
		width: 100%;
		margin-top: 20rpx;
	}

	.choose {
		display: flex;
		justify-content: space-between;
		padding: 40rpx;
		margin-top: 20rpx;
	}


	.option-box {
		margin: 20rpx;
		padding: 30rpx;
		font-size: 40rpx;
		padding: 8rpx;
		line-height: 20px;
	}

	.option-box2 {
		font-size: 26rpx;
		padding: 20rpx;
		line-height: 20px;
		padding-top: 10rpx;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		/* flex: 1; */
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
	}

	.name {
		margin-left: 15rpx;
		font-size: 18px;
		// font-weight: bold;
		// line-height: 1;
	}
</style>
