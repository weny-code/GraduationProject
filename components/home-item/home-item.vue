<template>
	<view class="content">
		<u-popup v-model="popShow" mode="top">
			<view class="pop">
				<view style="font-size: 18px;font-weight: bold;margin: 20rpx;">
					类型
				</view>
				<view style="margin-bottom: 40rpx;">
					<helang-checkbox ref="checkbox"></helang-checkbox>
				</view>
				<view class="btn">
					<view @click="popShow=false" class="pop-btn">
						取消
					</view>
					<view @click="popSelect" class="pop-btn" style="background: #007AFF;color: #fff;">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		<u-mask :show="show" :mask-click-able="false">
			<view v-if="show" class="loading">
				<Loading text="加载中.." :mask="true" click="true" ref="loading"></Loading>
			</view>
		</u-mask>
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载），同时允许touchmove事件冒泡，否则无法横向滚动切换tab -->
		<z-paging :default-page-no="0" :default-page-size="3" ref="paging" @query="queryList" :list.sync="dataList"
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
			<view v-if="tabIndex===1" class="select">
				<view class="sub">
					<u-subsection :current="curNow" @change="sectionChange" button-color="#e1e1e1" bg-color="#fff" :list="chooseList">
					</u-subsection>
				</view>
				<u-icon @click="popShow=true" name="choose" custom-prefix="custom-icon" size="50"></u-icon>
			</view>
			<view v-if="tabIndex===0" class="class-operation">
				<view hover-class="hover" class="card" @click="goCreateClass">
					<view class="operation">
						<view class="name">
							创建班级
						</view>
						<view class="desc">
							管理员可转让
						</view>
					</view>
					<u-avatar mode="square" src="/static/img/establish.png"></u-avatar>
				</view>
				<u-line :hair-line="false" color="#d1d1d1" direction="col" length="80rpx"></u-line>
				<view hover-class="hover" class="card" @click="goJoinClass">
					<view class="operation">
						<view class="name">
							加入班级
						</view>
						<view class="desc">
							已存在的班级
						</view>
					</view>
					<u-avatar mode="square" src="/static/img/join.png"></u-avatar>
				</view>
			</view>
			<view>
				<view v-for="(res,index) in dataList" :key="index">
					<view v-if="tabIndex==1">
						<notice-card :noticeList="res" />
					</view>
					<view v-if="tabIndex==0">
						<classCard :classList="res" />
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
	import customNomore from "@/components/custom-nomore/custom-nomore.vue"
	import Loading from "@/components/loading.vue";
	import classCard from "@/components/classCard/classCard.vue";
	import noticeCard from "@/components/noticeCard/noticeCard.vue"
	import customRefresher from "@/components/custom-refresher/custom-refresher.vue"
	import helangCheckbox from "@/components/helang-checkbox/helang-checkbox.vue"
	export default {
		name: "home-item",
		components: {
			customNomore,
			customRefresher,
			Loading,
			classCard,
			noticeCard,
			helangCheckbox
		},
		data() {
			return {
				dataList: [],
				tempList: [],
				curType:'全部',
				curNow: 0,
				firstLoaded: false,
				customStyle: {
					padding: '10rpx 16rpx',
					fontSize: '14px'
				},
				popShow:false,
				refresherStatus: 0,
				show: true,
				chooseList: [{
						name: '全部'
					},
					{
						name: '我的'
					},
				],
				headImg: ""
			}
		},
		props: {
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
		mounted() {
			this.headImg = uni.getStorageSync('userInfo').avatar
			this.$nextTick(()=>{
			        this.$refs.checkbox.set({
			            //这里填写插件所需参数
						 type:'radio',   // 类型：单选框
						    index:0,        // 默认选中的项
						    column:3,       // 分列
						    list:[          // 列表数据
						        {text:'全部'},
						        {text:'通知'},
						        {text:'打卡'},
						        {text:'填表'}
						    ]   
			        })
			    })
		},
		methods: {
			...mapMutations(['setClassList']),
			sectionChange(index) {
				if(this.curNow!=index){
					this.curNow = index;
					this.$refs.paging.reload();
				}
			},
			popSelect(){
				let data = this.$refs.checkbox.get();
				console.log(data);
				this.curType=data.text
				this.$refs.paging.reload();
				this.popShow=false
			},
			async queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				const db = uniCloud.database()
				const dbCmd = db.command
				console.log("tabIndex：", this.tabIndex)
				if (this.tabIndex == 0) {
					await db.collection('class-list').where({
							class_members: dbCmd.all([
								dbCmd.elemMatch({
									members_id: this.uid,
									class_role: this.currentRole.classRole,
									username: this.currentRole.username
								})
							]),
						})
						.skip(pageNo * pageSize) // 跳过前20条
						.limit(pageSize) // 获取20条
						.get().then((res) => {
							this.tempList = res.result.data
							// this.setClassList(res.result.data)
							console.log("161-dataList:", res.result.data)
						}).catch((err) => {
							console.log(err)
						})
					for (let item of this.tempList) {
						item.joined = await this.getStuCount(item._id)
						item.noJoin = item.class_size - item.joined
					}
					this.$refs.paging.complete(this.tempList);
					console.log("175-????", this.dataList)
					console.log("classIdList:", this.currentRoleClassList)
					this.show = false
				} else {
					var classIdList = []
					var tempNotice = []
					for (let item of this.currentRoleClassList) {
						classIdList.push(item._id)
					}
					console.log("classIdList:", classIdList)
					if(this.curNow==0){
						if(this.curType=='全部'){
							console.log("全部：",this.curType)
							await db.collection('class-notice,class-list,uni-id-users')
								.where({
									'class_id._id': dbCmd.in(classIdList)
								})
								.field(
									'class_id{class_name,class_size,_id},file_list,title,content,type,confirmed,form_item,release_time,publisher_id{_id,username}'
								)
								.orderBy('_id desc')
								.skip(pageNo * pageSize) // 跳过前20条
								.limit(pageSize) // 获取20条
								.get({
									getCount: true
								}).then((res) => {
									console.log("noticeList：", res.result.data)
									this.tempList = res.result.data
								}).catch((err) => {
									console.log(err)
								})
						}else{
							console.log( "非全部：",this.curType)
							await db.collection('class-notice,class-list,uni-id-users')
								.where({
									'class_id._id': dbCmd.in(classIdList),
									type:this.curType
								})
								.field(
									'class_id{class_name,class_size,_id},file_list,title,content,type,confirmed,form_item,release_time,publisher_id{_id,username}'
								)
								.orderBy('_id desc')
								.skip(pageNo * pageSize) // 跳过前20条
								.limit(pageSize) // 获取20条
								.get({
									getCount: true
								}).then((res) => {
									console.log("noticeList：", res.result.data)
									this.tempList = res.result.data
								}).catch((err) => {
									console.log(err)
								})
						}
					}else{
						if(this.curType=='全部'){
							console.log("全部：",this.curType)
							await db.collection('class-notice,class-list,uni-id-users')
								.where({
									'class_id._id': dbCmd.in(classIdList),
									'publisher_id._id':this.uid
								})
								.field(
									'class_id{class_name,class_size,_id},file_list,confirmed,title,content,type,form_item,release_time,publisher_id{_id,username}'
								)
								.orderBy('_id desc')
								.skip(pageNo * pageSize) // 跳过前20条
								.limit(pageSize) // 获取20条
								.get({
									getCount: true
								}).then((res) => {
									console.log("noticeList：", res.result.data)
									this.tempList = res.result.data
								}).catch((err) => {
									console.log(err)
								})
						}else{
							console.log( "非全部：",this.curType)
							await db.collection('class-notice,class-list,uni-id-users')
								.where({
									'class_id._id': dbCmd.in(classIdList),
									type:this.curType,
									'publisher_id._id':this.uid
								})
								.field(
									'class_id{class_name,class_size,_id},file_list,confirmed,title,content,type,form_item,release_time,publisher_id{_id,username}'
								)
								.orderBy('_id desc')
								.skip(pageNo * pageSize) // 跳过前20条
								.limit(pageSize) // 获取20条
								.get({
									getCount: true
								}).then((res) => {
									console.log("noticeList：", res.result.data)
									this.tempList = res.result.data
								}).catch((err) => {
									console.log(err)
								})
						}
					}
					for (let i = 0; i < this.tempList.length; i++) {
						for (let j = 0; j < this.tempList[i].class_id.length; j++) {
							if(classIdList.indexOf(this.tempList[i].class_id[j]._id) > -1){
								tempNotice.push({
									_id: this.tempList[i]._id,
									type: this.tempList[i].type,
									title: this.tempList[i].title,
									content: this.tempList[i].content,
									publisher: this.tempList[i].publisher_id[0].username,
									publisherId: this.tempList[i].publisher_id[0]._id,
									release_time: this.tempList[i].release_time,
									confirmed: this.tempList[i].confirmed,
									file_list: this.tempList[i].file_list,
									class_id: this.tempList[i].class_id[j]._id,
									class_name: this.tempList[i].class_id[j].class_name,
									class_size: this.tempList[i].class_id[j].class_size,
									form_item: this.tempList[i].form_item
								})
							}
						}
					}
					console.log("noticeList等于", tempNotice)
					this.$refs.paging.complete(tempNotice);
					this.show = false
				}
				this.firstLoaded = true;
			},
			async getStuCount(classID) {
				const db = uniCloud.database()
				var count = 0
				await db.collection('class-list').where({
					'_id': classID,
				}).get().then((res => {
					for(let item of res.result.data[0].class_members){
						if(item.class_role == '学生'){
							count++
						}
						console.log('count:',count)
					}
				}))
				return count
			},
			goJoinClass() {
				uni.navigateTo({
					url: '../../packageB/pages/joinClass/joinClass',
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
			goCreateClass() {
				uni.navigateTo({
					url: '../../packageB/pages/createClass/createClass',
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
		}
	}
</script>

<style lang="scss" scoped>
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
	.pop{
		padding: 10rpx 20rpx;
		height: 600rpx;
	}
	.btn{
		color: #333;
		font-size: 18px;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pop-btn{
			width: 50%;
			padding: 20rpx 40rpx;
		}
	}
</style>
