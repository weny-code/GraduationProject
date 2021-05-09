<template>
	<view>
		<view style="content: ''; overflow: hidden;"></view>
		<view class="head">
			<text>常用功能</text>
			<u-icon name="arrow-down" color="#2979ff" size="28"></u-icon>
		</view>
		<view class="operation">
			<u-grid :border="false" :col="3">
				<u-grid-item v-if="currentRole.classRole == '老师' || isCadres" @click="goPubNotice" hover-class="hover" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/729cd66c-07c0-4781-bbf9-9459c6dd76c8.png"></u-image>
					<view class="grid-text">发布通知</view>
				</u-grid-item>
				<u-grid-item v-if="currentRole.classRole == '老师' || isCadres" @click="goPubClock" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/0bc6d23c-03f1-4b3f-9449-37e43dd7e5ef.png"></u-image>
					<view class="grid-text">发布打卡</view>
				</u-grid-item>
				<u-grid-item v-if="currentRole.classRole == '老师' || isCadres" @click="goPubInves" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/1ba22451-43db-45b6-8e2a-cd9df0d8a192.png"></u-image>
					<view class="grid-text">调查问卷</view>
				</u-grid-item>
				<!-- <u-grid-item v-show="currentRole.classRole == '老师'" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/794c8773-1390-4cf6-a552-8bc00967f0a6.png"></u-image>
					<view class="grid-text">班费管理</view>
				</u-grid-item>
				<u-grid-item @click="approvalLeave" v-show="currentRole.classRole == '老师'" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/81d754e2-83fd-48a0-a971-25f6c1a0fac8.png"></u-image>
					<view  class="grid-text">请假审批</view>
				</u-grid-item> -->
				<u-grid-item @click="goChooseClass" v-show="currentRole.classRole == '学生'" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/81d754e2-83fd-48a0-a971-25f6c1a0fac8.png"></u-image>
					<view  class="grid-text">请假申请</view>
				</u-grid-item>
				<!-- <u-grid-item v-show="currentRole.classRole == '老师'" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/9bbd6b72-cd93-41bb-995a-c7562f51d667.png"></u-image>
					<view class="grid-text">发布成绩</view>
				</u-grid-item>
				<u-grid-item bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/1ba22451-43db-45b6-8e2a-cd9df0d8a192.png"></u-image>
					<view class="grid-text">班费查看</view>
				</u-grid-item> -->
				<u-grid-item v-if="currentRole.classRole == '老师' || isCadres=='true'" @click="goToUpLoadFile" bg-color="#f9f9f9" :custom-style="customStyle">
					<u-image width="100" height="100" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/f76d216e-793c-49f9-bb6d-624b8c53c760.png"></u-image>
					<view class="grid-text">上传文件</view>
				</u-grid-item>
			</u-grid>
		</view>
		<u-tabbar :list="tabbars" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				tabbars: '',
				customStyle: {
					paddingBottom: '10',
					paddingTop: '10',
					textAlign: "center",
				},
				isCadres:false
			}
		},
		onLoad() {
			/**
			 * 示例中为每个tabbar页面都写了一遍tabbar变量，您可以将tabbar数组写入到vuex中，这样可以全局引用
			 */
			this.tabbars = this.tabbar
			for(let i of this.currentRoleClassList){
				for(let j of i.class_members){
					if(j.members_id==this.uid){
						if(j.isCadres){
							this.isCadres = true
						}
					}
				}
			}
			console.log("班委：",this.isCadres)
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		methods: {
			goChooseClass(){
				uni.navigateTo({
					url: '../../packageC/pages/chooseClass/chooseClass',
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
			goPubNotice(){
				uni.navigateTo({
					url: '../../packageB/pages/publishNotice/publishNotice',
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
			goPubClock(){
				uni.navigateTo({
					url: '../../packageB/pages/publishClock/publishClock',
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
			goPubInves(){
				uni.navigateTo({
					url: '../../packageB/publicInvestigation/publicInvestigation',
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
			goToUpLoadFile(){
				uni.navigateTo({
					url: '../../packageB/pages/upLoadFile/upLoadFile',
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
		background-color: #f9f9f9;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	.head{
		display: flex;
		justify-content: space-between;
		font-size: 40rpx;
		align-items: center;
		width: 200rpx;
		margin: 20rpx auto;
		margin-top: 30%;
	}
	
	.grid-text {
		font-size: 16px;
		font-weight: bold;
		margin-top: 20rpx;
		color: #3f3f3f;
	}
	
	.operation{
		margin: 40rpx 20rpx;
	}
	
</style>
