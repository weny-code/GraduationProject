<template>
	<view>
		<view class="head">
			<view class="title">
				<text>输入您的信息</text>
			</view>
			<view v-if="role == '老师'" class="desc">
				<text>作为老师加入，提高班级管理水平</text>
			</view>
			<view v-if="role == '学生'" class="desc">
				<text>作为学生加入，提高班级沟通效率</text>
			</view>
		</view>
		<view class="content">
			<view class="item flex">
				<view class="teacher">
					<text>{{role}}姓名</text>
				</view>
				<view class="">
					<u-input placeholder="请填写姓名" :clearable="false" v-model="name" type="text" :border="false" />
				</view>
			</view>
			<u-line color="info"></u-line>
			<view class="item flex">
				<view class="teacher">
					<text>手机号码</text>
				</view>
				<view class="">
					<u-input placeholder="请填写手机号码" :clearable="false" v-model="mobile" type="number" :border="false" />
				</view>
			</view>
		</view>
		<view class="btn">
			<u-button @click="submit" type="primary" shape="circle" :ripple="true" ripple-bg-color="#909399">保存身份信息
			</u-button>
		</view>
		<u-toast ref="uToast" />
		<u-modal @confirm="backToIndex" confirm-color="#fa3534" v-model="show" :content="content"></u-modal>
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
				name: "",
				mobile: "",
				classInfo: "",
				role: "",
				show: false,
				content: "加入失败！"
			};
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			this.role = JSON.parse(decodeURIComponent(option.role))
			console.log(this.classInfo)
			this.name = this.userInfo.nickname
		},
		computed: {
			...mapState(['uid', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		methods: {
			...mapMutations(["setID", "login", "logout", "getAuth"]),
			backToIndex() {
				uni.reLaunch({
					url: '../../../pages/index/index'
				});
			},
			submit() {
				if (this.$u.test.isEmpty(this.name)) {
					this.showToast("班级名称不能为空");
				} else if (!this.$u.test.mobile(this.mobile)) {
					this.showToast("手机号码格式错误");
				} else {
					this.getStuCount();
				}
			},
			showToast(title) {
				this.$refs.uToast.show({
					title: title,
				})
			},
			async getStuCount() {
				const db = uniCloud.database()
				await db.collection('class-list').where({
					'class_members._id': this.classInfo._id,
					'class_members.class_role': this.role
				}).get({
					getCount: true
				}).then((res => {
					console.log(res)
					if (res.result.count < this.classInfo.class_size) {
						this.saveInfo()
					} else {
						this.show = true
						this.content = '该班级人数已满！'
					}
				}))
			},
			async saveInfo() {
				await uniCloud.callFunction({
						name: 'member-update-push',
						data: {
							id: this.uid,
							class_id: this.classInfo._id,
							username: this.name,
							mobile: this.mobile,
							role: this.role
						}
					})
					.then(res => {
						console.log(res)
					});
				await db.collection('uni-id-users').where({
					_id: this.uid
				}).update({
					username: this.name
				})
				await uniCloud.callFunction({
						name: 'joined-update-push',
						data: {
							id: this.uid,
							class_id: this.classInfo._id,
							role: this.role
						}
					})
					.then(res => {
						console.log(res)
						this.show = true
						this.content = '班级通讯录发生改变，请返回首页重新进入！'
					});
			}
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
		padding: 10rpx 30rpx;
		background: #f7f8fa;
		margin: 50rpx 30rpx;

		.item {
			width: 80%;
			padding: 10rpx;

			.teacher {
				font-weight: bold;
			}
		}
	}

	.btn {
		width: 80%;
		margin: 100rpx auto;
	}
</style>
