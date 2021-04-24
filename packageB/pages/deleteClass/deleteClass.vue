<template>
	<view>
		<view class="box">
			<view class="left">
				<text>班级名称</text>
			</view>
			<view class="right">
				<text>{{quitClassInfo.class_name}}</text>
			</view>
		</view>
		<view @click="checkCreator" class="box">
			<view class="left">
				<text>退出班级</text>
			</view>
			<view class="right">
				<u-icon size="30" name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="btn">
			<u-button @click="isCreator" shape="circle" type="error" :plain="true">解散班级</u-button>
		</view>
		<u-modal v-model="show1" :content="content1"></u-modal>
		<u-modal @confirm="quit" confirm-color="#fa3534" :show-cancel-button="true" v-model="show2" :content="content2"></u-modal>
		<u-modal @confirm="deleteclass" confirm-color="#fa3534" :show-cancel-button="true" v-model="show3" :content="content3"></u-modal>
		<u-modal @confirm="backToIndex" v-model="show4" :content="content4"></u-modal>
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
				quitClassInfo: "",
				show1: false,
				content1: '无法退出班级！',
				show2: false,
				content2: '是否退出班级？',
				show3: false,
				content3: '解散班级将导致该班级全部信息被销毁，是否确认解散该班级？',
				show4: false,
				content4: '返回首页！',
			};
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
		},
		onLoad(option) {
			this.quitClassInfo = JSON.parse(decodeURIComponent(option.params))
			console.log(this.quitClassInfo)
		},
		methods: {
			backToIndex(){
				uni.reLaunch({
				    url: '../../../pages/index/index'
				});
			},
			async deleteclass() {
				const db = uniCloud.database();
				await db.collection("class-list").doc(this.quitClassInfo._id).remove().then((res) => {
					uni.showToast({
						title: '删除成功'
					})
					console.log("删除信息: ", res);
					console.log("删除条数: ", res.result.deleted);
					
				}).catch((err) => {
					uni.showModal({
						content: err.message || '删除失败',
						showCancel: false
					})
				})
				uniCloud.callFunction({
						name: 'joined-update-pull',
						data: {
							id: this.uid,
							class_id: this.quitClassInfo._id,
						}
					})
					.then(res => {
						console.log(res)
						this.show4=true
						this.content4='班级通讯录发生改变，请返回首页重新进入！'
					});
			},
			quit() {
				uniCloud.callFunction({
						name: 'joined-update-pull',
						data: {
							id: this.uid,
							class_id: this.quitClassInfo._id,
						}
					})
					.then(res => {
						console.log(res)
					});
				uniCloud.callFunction({
						name: 'member-update-pull',
						data: {
							id: this.quitClassInfo._id,
							member_id: this.uid,
						}
					})
					.then(res => {
						console.log(res)
						this.show4=true
						this.content4='班级通讯录发生改变，请返回首页重新进入！'
					});
			},
			async checkCreator() {
				const db = uniCloud.database()
				await db.collection('class-list').where({
					_id: this.quitClassInfo._id,
				}).get().then((res => {
					console.log(res.result)
					if (res.result.data[0].creator_id != this.uid) {
						this.show2 = true
						this.content2 = '退出班级将导致您在该班级的全部信息彻底删除，是否确认退出？'
					} else {
						this.show1 = true
						this.content1 = '您是该班级的创建者，无法退出班级，可以选择解散该班级！'
					}
				}))
			},
			async isCreator() {
				const db = uniCloud.database()
				await db.collection('class-list').where({
					_id: this.quitClassInfo._id,
				}).get().then((res => {
					console.log(res.result)
					if (res.result.data[0].creator_id != this.uid) {
						this.show1 = true
						this.content1 = '您不是该班级的创建者，无法解散班级！'
					} else {
						this.show3 = true
						this.content3 = '解散班级将导致该班级全部信息被销毁，是否确认解散该班级？'
					}
				}))
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
	.box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx;
		padding: 30rpx;
		background: #fff;
		border-radius: 10rpx;

		.left {
			font-size: 20px;
			font-weight: bold;
		}

		.right {
			font-size: 16px;
			color: #bababa;
		}
	}

	.btn {
		width: 300rpx;
		margin: 70rpx auto;
	}
</style>
