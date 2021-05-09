<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		onLaunch: function() {
			console.log("app onLaunch")
			let _this = this
			uni.checkSession({
				success() {
					console.log("未过期，登录成功")
					// uni.$emit('login',{msg:'登录成功'})
					//session_key 未过期，并且在本生命周期一直有效
					// uniCloud.callFunction({
					//   name: 'refresh-token',
					//   data : {}
					// }).then(res => {
					// 	console.log(res)
					//   const {
					//     token,
					//     tokenExpired
					//   } = res.result
					//   if(token) {
					//     uni.setStorageSync('uni_id_token', token)
					//     uni.setStorageSync('uni_id_token_expired', tokenExpired)
					//   }
					//   // 其他逻辑...
					// })
				},
				fail() {
					// session_key 已经失效，需要重新执行登录流程
					// wx.login() //重新登录
					console.log("已过期")
					console.log(_this)
					_this.loginByWeixin()
				}
			})
		},
		computed: {
			...mapState(['uid','hasLogin', 'userInfo', 'hasAuth'])
		},
		methods: {
			...mapMutations(["setID","login", "logout","getAuth"]),
			loginSuccess() {
				uni.navigateTo({
					url: '../index/index',
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
					console.log(res)
					console.log("登录成功")
					if (res.result.code === 0) {
						console.log("首次登录")
						uni.setStorageSync('uni_id_token', res.result.token)
						uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
					}
					this.login();
					uni.$emit('login',{msg:'登录成功'})
					console.log(this.$store.state.hasLogin)
				}).catch((e) => {
					console.error(e)
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试2'
					})
				})
			},
		},
		destroyed() {
			uni.$off('getInfo')
		},
		mounted() {
			var _this = this
			uni.$once('getInfo',function(data){
			        console.log('监听到事件来自 getInfo ，携带参数 msg 为：' + data.msg);
					_this.getUserProfile()
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				weixinAuthService = services.find((service) => {
					return service.id === 'weixin'
				})
				if (weixinAuthService) {
					this.hasWeixinAuth = true
					console.log("22222" + weixinAuthService)
				}
			});
			// #endif	
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./static/iconfont.css";
	@import "uview-ui/index.scss";
	page {
		height: 100%;
		background-color: #f7f8fa;
	}
</style>
