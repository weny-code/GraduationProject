<template>
	<view class="content">
		<view v-if="show" class="loading">
			<Loading slot="loading" text="加载中.." :mask="true" click="true" ref="loading"></Loading>
		</view>
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载），同时允许touchmove事件冒泡，否则无法横向滚动切换tab -->
		<z-paging :default-page-no="0" :default-page-size="5" ref="paging" @query="queryList" :list.sync="dataList"
			:mounted-auto-call-reload="false" :refresher-angle-enable-change-continued="false"
			:touchmove-propagation-enabled="true" :refresher-status.sync="refresherStatus" style="height: 100%;">
			<!-- <view class="loading">
				<Loading slot="loading" text="加载中.." :mask="true" click="true" ref="loading"></Loading>
			</view> -->
			<custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher>
			<!-- 自定义没有更多数据view -->
			<custom-nomore slot="loadingMoreNoMore"></custom-nomore>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view>
				<view class="item" v-for="(res,index) in dataList" :key="index" @click="itemClick(res)">
					<u-line color="#e4e7ed"></u-line>
					<view class="person-info flex">
						<u-avatar size="80" :src="res.stu_id[0].avatar"></u-avatar>
						<view class="info">
							<view class="name">
								{{res.stu_name}}
							</view>
							<view class="time">
								{{$u.timeFormat(res.submit_time, 'yyyy年mm月dd日 hh:MM')}}
							</view>
						</view>
					</view>
					<view class="main">
						<view class="detail">
							<view>
								请假类型：{{res.leave_reason}}
							</view>
							<view>
								开始时间：{{res.start_time}}
							</view>
							<view>
								结束时间：{{res.end_time}}
							</view>
							<view>
								所在班级：{{classInfo.class_name}}
							</view>
						</view>
						<view class="btn">
							<u-button v-if="res.result == 0" type="primary" :custom-style="customStyle" :plain="true">
								待审批</u-button>
							<u-button :disabled="true" :hair-line="false" v-if="res.result == 1" type="success"
								:custom-style="customStyle" :plain="true">已批准</u-button>
							<u-button :disabled="true" v-if="res.result == 2" type="error" :custom-style="customStyle"
								:plain="true">不批准</u-button>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import customNomore from "../../../components/custom-nomore/custom-nomore.vue"
	import Loading from "../../../components/loading.vue";
	import customRefresher from "../../../components/custom-refresher/custom-refresher.vue"
	export default {
		name: "leave-item",
		components: {
			customNomore,
			customRefresher,
			Loading
		},
		data() {
			return {
				dataList: [],
				firstLoaded: false,
				customStyle: {
					padding: '10rpx 16rpx',
					fontSize: '14px'
				},
				refresherStatus: 0,
				show: true,
			}
		},
		props: {
			classInfo: {
				type: Object,
				default: () => {}
			},
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			currentIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							console.log("this.$refs:", this.$refs)
							this.$nextTick(() => {
								this.$refs.paging.reload();
							})
						}
					}
				},
				immediate: true
			},
		},
		mounted() {},
		methods: {
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				const db = uniCloud.database()
				const dbCmd = db.command
				var tempList = []
				console.log("tabIndex：", this.tabIndex)
				if (this.tabIndex == 0) {
					tempList = [0]
				} else {
					tempList = [1, 2]
				}
				db.collection('class-leave,uni-id-users').where({
						'class_id': this.classInfo._id,
						result: dbCmd.in(tempList)
					})
					.field(
						'_id,class_id,stu_name,result,stu_id{_id,avatar},approver_id{nickname},leave_reason,leave_explain,submit_time,start_time,end_time'
					)
					.skip(pageNo * pageSize) // 跳过前20条
					.limit(pageSize) // 获取20条
					.get({
						getCount: true
					}).then((res => {
						this.show= false
						console.log("leave:", res.result.data)
						this.$refs.paging.complete(res.result.data);
					}))
				this.firstLoaded = true;
			},
			itemClick(item) {
				item.className = this.classInfo.class_name
				var params = encodeURIComponent(JSON.stringify(item))
				uni.navigateTo({
					url: '../../../packageC/pages/leaveDetail/leaveDetail?params='+params,
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
	.flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */
	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}

	/* 	.item {
		position: relative;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	} */

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}
	
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

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}

	.main {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.item {
		margin-top: 10rpx;
		padding: 10rpx 30rpx;
	}

	.person-info {
		margin-top: 20rpx;

		.info {
			margin-left: 20rpx;

			.name {
				font-size: 18px;
			}

			.time {
				font-size: 16px;
				color: #909399;
			}
		}
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: left;
		margin-top: 8rpx;
		margin-left: 10rpx;
		font-size: 16px;
	}
</style>
