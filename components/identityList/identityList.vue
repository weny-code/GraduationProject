<template>
	<view class="">
		<u-mask :show="show" :mask-click-able="false">
			<view v-if="show" class="loading">
				<Loading text="加载中.." :mask="true" click="true" ref="loading"></Loading>
			</view>
		</u-mask>
		<view class="card">
			<view class="title">
				<text>请选择您要使用的身份</text>
			</view>
			<view class="list">
				<view @click="goHome(teacherName,'老师')" v-if="isTeacher" class="item">
					<view hover-class="hover" class="content flex" style="margin-top: 0;">
						<u-avatar size="70" src="/static/img/teacher.png"></u-avatar>
						<view class="name">
							{{teacherName}}老师
						</view>
						<view class="tea-iden">
							<text>老师</text>
						</view>
					</view>
				</view>	
				<view class="item" v-for="(res,index) in stuList" :key="index" @click="goHome(res,'学生')">
					<u-line color="#ff9900" />
					<view hover-class="hover" class="content flex">
						<u-avatar size="70" src="/static/img/student.png"></u-avatar>
						<view class="name">
							{{res}}同学
						</view>
						<view class="stu-iden">
							<text>学生</text>
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import Loading from "@/components/loading.vue";
	export default {
		name: "identityList",
		components: {
			Loading
		},
		data() {
			return {
				currentName: "",
				teacherName: "",
				isTeacher: false,
				stuList: [],
				show:true
			};
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth'])
		},
		mounted() {
			this.checkTeacher()
			this.getStuNameList()
		},
		methods: {
			...mapMutations(["setID", "setRole", "login", "logout", "getAuth"]),
			checkTeacher() {
				if(this.userInfo.joined_class){
					for (let i = 0; i < this.userInfo.joined_class.length; i++) {
						console.log(this.isTeacher)
						if (this.userInfo.joined_class[i].class_role == '老师') {
							console.log("老师")
							this.isTeacher = true
							this.teacherName = this.userInfo.username
							break
						}else{
							this.isTeacher = false
						}
					}
				}
			},
			async getStuNameList() {
				var _this = this;
				const db = uniCloud.database()
				await db.collection('class-list').where({
						'class_members.members_id': this.uid,
						'class_members.class_role': "学生"
					}).field('class_members') // 注意distinct方法没有参数
					.get().then((res => {
						console.log("???", res)
						for (let i = 0; i < res.result.data.length; i++) {
							console.log(res.result.data[i])
							for (let j = 1; j < res.result.data[i].class_members.length; j++) {
								console.log(res.result.data[i].class_members[j])
								if (res.result.data[i].class_members[j].class_role == '学生' && res.result.data[
										i]
									.class_members[j].members_id == _this.uid) {
									this.stuList.push(res.result.data[i].class_members[j].username)
								}
							}
						}
						this.stuList = Array.from(new Set(this.stuList))
						this.show = false
						console.log(this.stuList)
					})).catch((err) => {
						console.log(err)
					})
			},
			goHome(res, role) {
				console.log(res)
				this.setRole({
					username: res,
					classRole: role,
				})
				console.log("currenrRole",this.currentRole)
				uni.switchTab({
					url: '../home/home',
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

<style lang="scss" scoped>
	.flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
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

	.card {
		// width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		overflow: hidden;
		padding: 20rpx;

		.title {
			padding: 10rpx;
			font-size: 20px;
			font-weight: bold;
			margin-bottom: 20rpx;
		}

		.list {
			padding: 10rpx;

			.item {
				padding: 10rpx;
				.content {
					margin-top: 20rpx;
					padding: 20rpx 10rpx;
					.name {
						margin-left: 20rpx;
						font-size: 16px;
					}

					.tea-iden {
						background: #ffaa7f;
						color: #ff5500;
						font-size: 10px;
						padding: 6rpx 12rpx;
						margin-left: 20rpx;
						// padding: 10rpx;
					}

					.stu-iden {
						background: #aaffff;
						color: #0055ff;
						font-size: 10px;
						padding: 6rpx 12rpx;
						margin-left: 20rpx;
						// padding: 10rpx;
					}
				}
			}
		}
	}
</style>
