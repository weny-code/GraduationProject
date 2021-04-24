<template>
	<view>
		<!-- <u-mask :show="show" :mask-click-able="false">
			<view v-if="show" class="loading">
				<Loading text="加载中.." :mask="true" click="true" ref="loading"></Loading>
			</view>
		</u-mask> -->
		<u-navbar :border-bottom="false" :is-back="false">
			<view class="slot-wrap">
				<u-avatar size="70" :src="userHead"></u-avatar>
				<view v-if="currentRole.classRole=='老师'" class="name">
					{{currentRole.username}}老师
				</view>
				<view v-else-if="currentRole.classRole=='学生'" class="name">
					{{currentRole.username}}同学
				</view>
				<u-icon @click="backToIndex" color="#1296db" custom-prefix="custom-icon" name="qiehuanyonghu"
					:size="40"></u-icon>
			</view>
		</u-navbar>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper :bar-style="barStyle" inactive-color="#9f9f9f" activeColor="#333333" ref="tabs"
					:list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750" font-size="36"
					bar-width="80">
				</u-tabs-swiper>
				<u-badge :is-dot="true" type="error" :offset="[16,100]"></u-badge>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
					<home-item :tabIndex="index" :currentIndex="swiperCurrent" />
				</swiper-item>
			</swiper>
		</view>
		<u-tabbar :list="tabbars" :mid-button="true" active-color="#00aaff"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import Loading from "@/components/loading.vue";
	import homeItem from "@/components/home-item/home-item.vue";
	export default {
		components: {
			Loading,
			homeItem
		},
		data() {
			return {
				tabbars: '',
				userName: "",
				userHead: "",
				show: true,
				barStyle: {
					background: "#00aaff",
				},
				isWidth: 0, //每个导航栏占位
				list: [{
						name: '我的班级'
					},
					{
						name: '班级广播',
						count: 0,
					}
				],
				current: 0,
				classID: [],
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
			};
		},
		onLoad() {
			this.tabbars = this.tabbar
			this.userHead = uni.getStorageSync('userInfo').avatar
			this.getClassList()
			console.log("id为" + this.uid)
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		methods: {
			...mapMutations(['setClassList']),
			backToIndex() {
				uni.reLaunch({
					url: '../index/index'
				});
			},
			async getClassList(){
				const db = uniCloud.database()
				const dbCmd = db.command
					await db.collection('class-list').where({
							class_members: dbCmd.all([
								dbCmd.elemMatch({
									members_id: this.uid,
									class_role: this.currentRole.classRole,
									username: this.currentRole.username
								})
							]),
						})
						.get().then((res) => {
							this.setClassList(res.result.data)
						}).catch((err) => {
							console.log(err)
						})
					console.log("classIdList:", this.currentRoleClassList)
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.getOrderList(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
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

	.class-operation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 10rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		padding: 10rpx;

		.card {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			width: 50%;

			.operation {

				// margin-right: 30rpx;
				.name {
					margin-left: 0;
					font-size: 36rpx;
					padding: 10rpx 10rpx 0 0rpx;
					font-weight: bold;
				}

				;

				.desc {
					color: #9f9f9f;
					font-size: 24rpx;
					margin-top: 20rpx;
					padding: 0 10rpx 10rpx 0rpx;
				}
			}
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - 78px);
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 380rpx;
		margin: 20rpx auto;
	}

	.sub {
		width: 300rpx;
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
		font-weight: bold;
		line-height: 1;
	}
</style>
