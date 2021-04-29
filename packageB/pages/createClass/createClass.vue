<template>
	<view class="wrap">
		<view style="content: ''; overflow: hidden;"></view>
		<view class="class-operation">
			<view class="class-name">
				<view class="name-desc">
					班级名称：{{className}}
				</view>
			</view>
			<u-line length="auto" margin="0 auto" color="#bfbfbf" />
			<view class="input">
				<view class="desc">
					班级名称
				</view>
				<view>
					<u-input placeholder="请输入班级名称" :clearable="false" v-model="className" type="text" :border="false" />
				</view>
				<u-icon name="editor" custom-prefix="custom-icon" size="30" color="#888888"></u-icon>
			</view>
			<u-line length="auto" margin="0 auto 0rpx 160rpx" color="#bfbfbf" />
			<view class="input">
				<view class="desc">
					班级人数
				</view>
				<u-input type='number' placeholder="请输入班级人数" :clearable="false" v-model='classSize' :border="false" />
			</view>
			<u-line length="auto" margin="0 auto 0rpx 160rpx" color="#bfbfbf" />
			<view class="input">
				<view class="desc">
					手机号码
				</view>
				<u-input type='text' placeholder="请输入联系电话" :clearable="false" v-model='creatorMobile'
					:border="false" />
			</view>
		</view>
		<view class="btn">
			<u-button @click="submit" type="primary" shape="circle" :ripple="true" ripple-bg-color="#909399">创建班级
			</u-button>
		</view>
		<u-toast ref="uToast" />
		<u-modal @confirm="backToIndex" v-model="show" :content="content"></u-modal>
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
				className: "",
				classSize: '',
				classID: '',
				creatorMobile: "",
				show:false,
				content:""
			};
		},
		computed: {
			...mapState(['uid','currentRole','userInfo'])
		},
		methods: {
			backToIndex(){
				uni.reLaunch({
				    url: '../../../pages/index/index'
				});
			},
			async create() {
				this.classSize = parseInt(this.classSize)
				const db = uniCloud.database() //代码块为cdb
				await db.collection("class-list")
					.add({
						class_name: this.className,
						class_size: this.classSize,
						creator_id: this.uid,
						class_members: [{
							members_id: this.uid,
							mobile: this.creatorMobile,
							username:this.userInfo.username,
							class_role: "老师"
						}]
					})
					.then((res) => {
						console.log(res)
						this.classID = res.result.id
					})
					.catch((err) => {
						uni.showModal({
							content: err.message || '新增失败',
							showCancel: false
						})
					})
					.finally(() => {

					})
				await db.collection('class-expense')
				.add({
					class_id:this.classID,
					total_price:"0",
					revenue_record:[],
					expend_record:[]
				}).then((res=>{
					uni.showToast({
						title: '创建成功！'
					})
					console.log(res)
					this.show = true
					this.content = "班级通讯录发生改变，请返回首页重新进入！"
				}))
				const dbCmd = db.command
				uniCloud.callFunction({
						name: 'joined-update-push',
						data: {
							id: this.uid,
							class_id: this.classID,
							role:"老师"
						}
					})
					.then(res => {
						console.log(res)
					});
			},
			submit() {
				if (this.$u.test.isEmpty(this.className)) {
					this.showToast("班级名称不能为空");
				} else if (this.classSize < 1 || this.$u.test.isEmpty(this.classSize)) {
					this.showToast("班级人数不能为空或少于1人");
				} else if (!this.$u.test.mobile(this.creatorMobile)) {
					this.showToast("手机号码格式错误");
				} else {
					this.create();
					console.log(this.$u.test.mobile(this.creatorMobile)) 
				}
			},
			showToast(title) {
				this.$refs.uToast.show({
					title: title,
				})
			}
		},
		
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: calc(100vh - var(--window-top));
		background-color: #f2f2f2;
	}

	/* #endif */
</style>

<style lang="scss">
	.wrap {
		height: calc(100vh - var(--window-top));
		width: 100%;
		position: relative;
	}

	.class-operation {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 10rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		padding: 10rpx;
	}

	.class-name {
		height: 100rpx;

		.name-desc {
			padding: 20rpx;
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.input {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.desc {
			padding: 30rpx 20rpx;
			font-size: 32rpx;
		}
	}

	.btn {
		width: 80%;
		margin: 100rpx auto;
	}
</style>
