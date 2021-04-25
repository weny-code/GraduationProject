<template>
	<view class="card">
		<view class="head flex">
			<view class="left flex">
				<u-avatar size="60" :src="headImg"></u-avatar>
				<view class="name">
					{{classList.class_name}}
				</view>
			</view>
			<view class="right flex">
				<u-icon hover-class="hover" color="#1296db" custom-prefix="custom-icon" name="jia" :size="60"></u-icon>
				<view hover-class="hover" @click="goAdminClassHome" v-show="currentRole.classRole == '老师'" class="desc">
					<text>班级管理</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view hover-class="hover" @click="goClassHome" v-show="currentRole.classRole == '学生'" class="desc">
					<text>进入班级</text>
					<u-icon size="30" name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		<view class="code flex">
			<text id="copy">口令：{{classList._id}}</text>
			<u-icon @click="copyCode" name="fuzhi" custom-prefix="custom-icon" size="30" color="#2c2c2c"></u-icon>
		</view>
		<view class="operation">
			<u-grid v-show="currentRole.classRole == '老师'" :border="false" :col="4">
				<u-grid-item :custom-style="customStyle">
					<view id="gridH" class="text">
						{{classList.class_size}}
					</view>
					<view class="grid-text">预设人数</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<view class="text">
						{{classList.joined}}
					</view>
					<view class="grid-text">已加入</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<view class="text">
						{{classList.noJoin}}
						<u-icon top="-7" v-if="classList.class_size != classList.joined" color="#d81e06"
							custom-prefix="custom-icon" name="jinggao" :size="40"></u-icon>
					</view>
					<view class="grid-text">未加入</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<cmd-progress type="circle" :percent="getPercent" :width="gridHeight" stroke-shape="square">
					</cmd-progress>
					<!-- <u-circle-progress border-width="6" width="94" active-color="#2979ff" :percent="getPercent">
						<view class="u-progress-content">
							<text class='u-progress-info'>{{joinedPercent}}%</text>
						</view>
					</u-circle-progress> -->
					<!-- <u-icon custom-prefix="custom-icon" name="mask" :size="70"></u-icon> -->
					<view class="grid-text">加入率</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<u-icon custom-prefix="custom-icon" name="mask" :size="60"></u-icon>
					<view class="grid-text">学生成绩</view>
				</u-grid-item>
				<u-grid-item @click="goHandle" :custom-style="customStyle">
					<u-badge :offset='[20,36]' type="error" :count="leaveCount"></u-badge>
					<u-icon custom-prefix="custom-icon" name="qingjiashenhe" :size="60"></u-icon>
					<view class="grid-text">请假审批</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<u-icon custom-prefix="custom-icon" name="feiyongguanli" :size="60"></u-icon>
					<view class="grid-text">班费查看</view>
				</u-grid-item>
				<u-grid-item @click="goClassFile" :custom-style="customStyle">
					<u-icon custom-prefix="custom-icon" name="wenjian" :size="60"></u-icon>
					<view class="grid-text">班级文件</view>
				</u-grid-item>
			</u-grid>
			<u-grid v-show="currentRole.classRole == '学生'" :border="false" :col="2">
				<u-grid-item @click="showLeave" :custom-style="customStyle">
					<u-icon custom-prefix="custom-icon" name="qingjiashenhe" :size="60"></u-icon>
					<view class="grid-text">请假申请</view>
				</u-grid-item>
				<u-grid-item :custom-style="customStyle">
					<u-icon custom-prefix="custom-icon" name="wenjian" :size="60"></u-icon>
					<view class="grid-text">班级文件</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"
	export default {
		name: "classCard",
		components: {
			cmdProgress
		},
		props: ['classList'],
		data() {
			return {
				customStyle: {
					paddingBottom: '0',
					paddingTop: '10',
					textAlign: "center",
					overflow: "hidden",
					fontSize: "24rpx"
				},
				joinedPercent: 0,
				gridHeight: 0,
				leaveCount: 0,
				headImg: ""
			};
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
			getPercent() {
				this.joinedPercent = this.classList.joined / this.classList.class_size * 100
				return this.joinedPercent
			},
		},
		methods: {
			copyCode(e) {
				// const query = uni.createSelectorQuery().in(this);
				// query.select('#copy').boundingClientRect(data => {
				//   console.log(data.innerText);
				// }).exec();
				uni.setClipboardData({
					data: this.classList._id,
					success: function() {
						console.log(e);
					}
				});
			},
			showLeave() {
				var params = encodeURIComponent(JSON.stringify(this.classList))
				uni.navigateTo({
					url: '../../packageC/pages/leaveList/leaveList?params=' + params,
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
			goClassFile() {
				uni.navigateTo({
					url: '../../packageB/pages/fileList/fileList',
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
			goClassHome() {
				var params = encodeURIComponent(JSON.stringify(this.classList))
				uni.navigateTo({
					url:'../../packageB/classHome/classHome?params='+params,
					// url: '../../packageB/pages/quitClass/quitClass?params=' + params,
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
			goHandle() {
				var params = encodeURIComponent(JSON.stringify(this.classList))
				console.log("params:", this.classList)
				uni.navigateTo({
					url: '../../packageB/pages/handleApply/handleApply?params=' + params,
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
			goAdminClassHome() {
				var params = encodeURIComponent(JSON.stringify(this.classList))
				uni.navigateTo({
					// url: '../../packageB/pages/deleteClass/deleteClass?params=' + params,
					url:'../../packageB/classHome/classHome?params='+params,
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
			async getNoLeave() {
				const db = uniCloud.database()
				await db.collection('class-leave').where({
					class_id: this.classList._id,
					result: 0
				}).get({
					getCount: true
				}).then((res => {
					console.log("leave:", res.result.data)
					this.leaveCount = res.result.count
				}))
			},
			async getStuCount(classID) {
				const db = uniCloud.database()
				var count = Number
				await db.collection('class-list').where({
					'_id': classID,
					'class_members.class_role': '学生'
				}).get({
					getCount: true
				}).then((res => {
					console.log("!!!!!", res)
					count = res.result.count

				}))
				return count
			},
			async loadClass() {
				// this.classList.id = this.classList._id
				// this.classList.className = this.classList.class_name
				// this.classList.classSize = this.classList.class_size
				// this.classList.code = this.classList._id
				// this.classList.headImg = this.headImg
				this.classList.joined = await this.getStuCount(this.classList._id)
				this.classList.noJoin = this.classList.class_size - this.classList.joined
				// this.classIdList.push(item._id)
			}
		},
		mounted() {
			this.headImg = uni.getStorageSync('userInfo').avatar
			// this.loadClass()
			console.log("classList:", this.classList)
			const query = uni.createSelectorQuery().in(this);
			query.select('#gridH').boundingClientRect(data => {
				console.log("得到布局位置信息" + JSON.stringify(data));
				console.log("节点离页面顶部的距离为" + data.height);
				this.gridHeight = data.height
			}).exec();
			this.getNoLeave()
		}
	}
</script>

<style lang="scss" scoped>
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
		border-radius: 10rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		overflow: hidden;
		padding: 10rpx;
	}

	.head {
		.left {
			width: 50%;
			margin: 10rpx 30rpx;
			justify-content: flex-start;
		}

		.right {
			width: 30%;
			margin: 10rpx 30rpx;
		}

		.name {
			margin-left: 15rpx;
			font-size: 16px;
			font-weight: bold;
		}
	}

	.code {
		width: 500rpx;
		color: #a8a8a8;
		margin: 15rpx 20rpx 0 30rpx;
	}

	.grid-text {
		font-size: 14px;
		margin-top: 6rpx;
		color: $u-type-info;
	}

	.operation {
		margin-top: 0rpx;
		margin-bottom: 30rpx;
	}

	.text {
		font-size: 30px;
		// line-height:1
		// margin-bottom: 10rpx;
	}

	.u-progress-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.u-progress-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #fb9126;
	}

	.u-progress-info {
		font-size: 12px;
	}
</style>
