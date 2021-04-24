<template>
	<view>
		<view class="input">
			<u-input placeholder="请输入班级口令" :clearable="true" v-model="classCode" type="text" :border="false" />
		</view>
		<view class="btn">
			<u-button @click="seachClass" type="primary" shape="circle" :ripple="true" ripple-bg-color="#909399">查找班级
			</u-button>
		</view>
		<view v-show="searchSuccess" class="class-info flex">
			<view class="flex">
				<u-avatar size="70" :src="classInfo.creator_id[0].avatar"></u-avatar>
				<view class="content">
					<view class="top">
						<text>{{classInfo.class_name}}</text>
					</view>
					<view class="bottom">
						<text>管理员：{{classInfo.creator_id[0].nickname}}</text>
						<text style="margin-left: 16rpx;">{{classInfo.class_size}}人</text>
					</view>
				</view>
			</view>
			<u-button @click="goSelect" :custom-style="customStyle" type="primary" shape="circle" :ripple="true"
				ripple-bg-color="#909399">加入
			</u-button>
		</view>
		<u-modal confirm-color="#fa3534" v-model="show" :content="content"></u-modal>
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
				classCode: "",
				classInfo: {},
				customStyle: {
					// padding: '0rpx 30rpx',

				},
				searchSuccess:false,
				show:false,
				content:'找不到该班级！请确认班级口令是否正确！'
			};
		},
		computed: {
			...mapState(['uid'])
		},
		methods: {
			async goSelect(){
				const db = uniCloud.database()
				await db.collection('class-list').where({
					'_id':this.classInfo._id,
					'class_members.members_id':this.uid
				}).get().then((res)=>{
					console.log(res)
					if(res.result.data[0]){
						this.show = true
						this.content='您已加入该班级，请勿重复添加！'
					}else{
						var params = encodeURIComponent(JSON.stringify(this.classInfo))
						uni.navigateTo({
							url: '../../../packageC/pages/chooseRole/chooseRole?params='+params,
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
				}).catch((err) => {
					console.log(err)
				})
			},
			async seachClass() {
				const db = uniCloud.database()
				await db.collection('class-list,uni-id-users').where({
						'_id': this.classCode
					})
					.field('creator_id{nickname,avatar},class_name,class_size')
					.get().then((res) => {
						console.log("joinClass",res)
						if(res.result.data[0]){
							this.classInfo = res.result.data[0]
							this.searchSuccess = true		
						}else{
							console.log("找不到该班级！")
							this.show = true
							this.searchSuccess = false
						}
						console.log(this.searchSuccess)
					}).catch((err) => {
						console.log(err)
					})
			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}

	/* #endif */
</style>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.input {
		background: #fff;
		margin: 20rpx 0;
		padding: 10rpx 20rpx;
	}

	.btn {
		width: 80%;
		margin: 100rpx auto;
	}

	.class-info {
		background: #fff;
		margin: 20rpx;
		padding: 20rpx;

		.content {
			margin-left: 18rpx;

			.top {
				font-weight: bold;
				font-size: 16px;
			}

			.bottom {
				color: #a2a2a2;
				font-size: 14px;
				margin-top: 10rpx;
			}
		}
	}
</style>
