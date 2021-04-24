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
		<u-modal v-model="show1" :content="content1"></u-modal>
		<u-modal @confirm="quit" confirm-color="#fa3534" :show-cancel-button="true" v-model="show2" :content="content2"></u-modal>
		<u-modal @confirm="backToIndex" v-model="show3" :content="content3"></u-modal>
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
				quitClassInfo:{},
				show1:false,
				content1:'无法退出班级！',
				show2:false,
				content2:'退出班级成功！',
				show3:false,
				content3:'退出班级成功！'
			};
		},
		computed:{
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
		},
		onLoad(option) {
			this.quitClassInfo = JSON.parse(decodeURIComponent(option.params))
			console.log("班级名称：",this.quitClassInfo.class_name)
		},
		methods:{
			backToIndex(){
				uni.reLaunch({
				    url: '../../../pages/index/index'
				});
			},
			quit(){
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
					this.show3=true
					this.content3='班级通讯录发生改变，请返回首页重新进入！'
				});
			},
			async checkCreator(){
				const db = uniCloud.database()
				await db.collection('class-list').where({
					_id : this.quitClassInfo._id,
				}).get().then((res=>{
					console.log(res.result)
					if(res.result.data[0].creator_id != this.uid){
						this.show2 = true
						this.content2 = '退出班级将导致您在该班级的全部信息彻底删除，是否确认退出？'
					}else{
						this.show1 = true
						this.content1 = '您是该班级的创建者，无法退出班级，可以选择解散该班级！'
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
	.box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx;
		padding: 30rpx;
		background: #fff;
		border-radius: 10rpx;
		.left{
			font-size: 20px;
			font-weight: bold;
		}
		.right{
			font-size: 16px;
			color: #bababa;
		}
	}
</style>
