<template>
	<view>
		<view style="content: ''; overflow: hidden;"></view>
		<view class="main">
			<view class="title">
				<u-input v-model="noticeTitle" type="text" :border-bottom="true" placeholder="请输入打卡标题" />
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="content">
				<u-input v-model="noticeContent" placeholder="关于打卡的描述和更多说明" maxlength='-1' type="textarea"
					:border-top="false" height="30" :auto-height="false" />
			</view>
			<view class="upLoad">
				<view class="upload-desc">
					选择图片
				</view>
				<uni-file-picker ref="Imgfiles" v-model="imageValue" fileMediatype="image" mode="grid" @select="selectImg"
					@progress="progress" :auto-upload="true" :image-styles="imgStyle" @success="successImg" @fail="fail">
					<view class="up-img">
						<u-icon custom-prefix="custom-icon" name="tianjiatupian" :size="100"></u-icon>
					</view>
				</uni-file-picker>
			</view>
			<view class="upLoad">
				<view class="upload-desc">
					选择附件
				</view>
				<uni-file-picker ref="Filefiles" :auto-upload="true" limit="5" file-mediatype="all" @select="selectFile"
					@progress="progress" :list-styles="listStyle" @success="successFile" @fail="fail">
					<view class="up-file">
						<u-icon custom-prefix="custom-icon" name="shangchuanwenjian" :size="60"></u-icon>
					</view>
				</uni-file-picker>
			</view>
		</view>
		<view class="main">
			<view class="desc">
				设置打卡项
			</view>
			<u-line color="#e4e7ed"></u-line>
			<view class="form">
				<clock-card :formInfo="item" :formIdx="index" :cardId="item.id" v-for="(item,index) in formList[0]" :key="item.id" />
			</view>
			<view @click="popshow = true" class="addForm">
				添加填表项
			</view>
		</view>
		<view class="main">
			<view class="desc">
				发送范围
			</view>
			<view class="send-class">
				<view class="class" v-for="(item, index) in classList" :key="index">
					<!-- <u-line :hair-line="false" margin="0 0 20rpx 0" color="#b2b4b8"></u-line> -->
					<u-gap height="8" bg-color="#f7f8fa"></u-gap>
					<view class="box">
						<u-checkbox size="50" label-size="22px" shape="circle" @change="checkboxChange"
							v-model="item.checked" :name="item.className">
							<view class="class-name">
								{{item.className}}
							</view>
						</u-checkbox>
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<u-button @click="publishClock" type="primary" shape="circle" :ripple="true" ripple-bg-color="#909399">确认发布
			</u-button>
		</view>
		<u-popup v-model="popshow" mode="bottom" border-radius="20">
			<view class="head">
				添加填表打卡项
			</view>
			<view class="grid">
				<u-grid @click="addForm" :border="false" :col="3">
					<u-grid-item :index="0">
						<view class="item">
							<u-icon custom-prefix="custom-icon" color="#909399" name="danxuan" :size="50"></u-icon>
							<view class="grid-text">单项选择</view>
						</view>
					</u-grid-item>
					<u-grid-item :index="1">
						<view class="item">
							<u-icon custom-prefix="custom-icon" color="#909399" name="duoxuan" :size="50"></u-icon>
							<view class="grid-text">多项选择</view>
						</view>
					</u-grid-item>
					<u-grid-item :index="2">
						<view class="item">
							<u-icon custom-prefix="custom-icon" color="#909399" name="wenben" :size="50"></u-icon>
							<view class="grid-text">文本填空</view>
						</view>
					</u-grid-item>
					<u-grid-item :index="3">
						<view class="item">
							<u-icon custom-prefix="custom-icon" color="#909399" name="weizhi" :size="50"></u-icon>
							<view class="grid-text">地理位置</view>
						</view>
					</u-grid-item>
					<u-grid-item :index="4">
						<view class="item">
							<u-icon custom-prefix="custom-icon" color="#909399" name="tupian" :size="50"></u-icon>
							<view class="grid-text">上传图片</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</u-popup>
		<u-modal @confirm="backToIndex" v-model="show" :content="content"></u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import clockCard from "../../components/clockCard/clockCard.vue"
	export default {
		components: {
			// selectSwitch
			clockCard
		},
		data() {
			return {
				noticeTitle: '',
				noticeContent: '',
				tempList: [],
				classList: [],
				chooseClass: [],
				show: false,
				popshow: false,
				content: "",
				noticeId: "",
				formList: [
					[],
					[]
				],
				typeList:['单项选择','多项选择','文本填空','地理位置','上传图片'],
				fileList:[]
			};
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth'])
		},
		onLoad() {
			this.tempList = this.currentRoleClassList
			if (this.currentRole.classRole == '学生') {
				this.classList = this.tempList.filter((item) => {
					for (let j of item.class_members) {
						if (j.members_id == this.uid) {
							return j.isCadres
						}
					}
				})
			} else {
				for (let item of this.tempList) {
					this.classList.push({
						className: item.class_name,
						classId: item._id,
						checked: false,
						disabled: false
					})
				}
			}
			var _this = this
			uni.$on('deleteForm', ((data) => {
				console.log('监听到事件来自 deleteForm', data.index)
				_this.formList[0].splice(data.index, 1)
			}))
		},
		onUnload() {
			uni.$off('deleteForm')
		},
		methods: {
			backToIndex() {
				uni.reLaunch({
					url: '../../../pages/index/index'
				});
			},
			async publishClock() {
				var _this = this
				var time = new Date().getTime()
				console.log(this.$u.timeFormat(time, 'yyyy年mm月dd日 hh时MM分ss秒'))
				const db = uniCloud.database() //代码块为cdb
				await db.collection("class-notice")
					.add({
						type: '打卡',
						title: this.noticeTitle,
						content: this.noticeContent,
						publisher_id: this.uid,
						class_id: this.chooseClass,
						release_time: time,
						file_list:this.fileList,
						confirmed: [],
						form_item:[]
					})
					.then((res) => {
						uni.showToast({
							title: '发布成功！'
						})
						console.log(res)
						this.noticeId = res.result.id
						for(let i of this.formList[0]){
							uni.$emit('setForm',{
								cardId: i.id,
								noticeId:_this.noticeId
							})
						}
						this.show = true
						this.content = "班级资料发生改变，请返回首页重新进入！"
					})
					.catch((err) => {
						uni.showModal({
							content: err.message || '发布失败',
							showCancel: false
						})
					})
					.finally(() => {

					})
				for (let item of this.chooseClass) {
					uniCloud.callFunction({
							name: 'notice-update-push',
							data: {
								id: item,
								notice_id: this.noticeId,
							}
						})
						.then(res => {
							console.log(res)
						});
				}
			},
			checkboxChange(e) {
				console.log(e);
				if (e.value) {
					for (let i of this.classList) {
						if (i.className == e.name) {
							this.chooseClass.push(i.classId)
						}
					}
				} else {
					for (let i of this.classList) {
						if (i.className == e.name) {
							this.chooseClass.splice(this.chooseClass.findIndex(res => res === i.classId), 1)
						}
					}
				}
				console.log(this.chooseClass)
			},
			addForm(index) {
				console.log("添加填表项",index)
				this.formList[0].push({
					id: this.formList[0].length,
					type:this.typeList[index]
				})
				this.popshow = false
				console.log("填表项列表：", this.formList[0])
			},
			upload() {
				this.$refs.Filefiles.upload()
				this.$refs.Imgfiles.upload()
			},
			download() {
				uniCloud.getTempFileURL({
						fileList: [
							'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/3c8aa450-a56d-451e-beb9-a93521fd28d8.xls'
						]
					})
					.then(res => {
						console.log(res)
					});
			},
			selectImg(e) {
				console.log('选择文件：', e)
				for (let item of e.tempFiles) {
					item.name = item.cloudPath
					console.log('选择文件：', item.cloudPath)
				}
			},
			selectFile(e) {
				console.log('选择文件：', e)
				for (let item of e.tempFiles) {
					item.cloudPath = item.name
					console.log('选择文件：', item.cloudPath)
				}
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},
			
			// 上传成功
			successImg(e) {
				// this.upLoadImgsuccess = true
				console.log('上传成功', e)
				for(let item of e.tempFiles){
					this.fileList.push(item)
				}
				console.log('fileList:', this.fileList)
				// if(this.upLoadFilesuccess == true && this.upLoadImgsuccess==true){
				// 	this.publishNotice()
				// }
			},
			successFile(e) {
				// this.upLoadFilesuccess = true
				console.log('上传成功', e)
				for(let item of e.tempFiles){
					this.fileList.push(item)
				}
				console.log('fileList:', this.fileList)
				// if(this.upLoadFilesuccess == true && this.upLoadImgsuccess==true){
				// 	this.publishNotice()
				// }
			},
			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
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

<style lang="scss">
	.main {
		background-color: #ffffff;
		margin: 20rpx;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		overflow: hidden;
		padding: 10rpx 0;
	}
	
	.grid-text {
			font-size: 28rpx;
			margin-top: 10rpx;
			color: #000000;
		}

	.title,
	.content {
		margin: 10rpx 0;
		padding: 0 20rpx;
	}

	.desc {
		font-size: 18px;
		padding: 10rpx 30rpx;
	}

	.send-class {
		padding: 10rpx 0rpx;
	}

	.box {
		padding: 30rpx 30rpx 10rpx 30rpx;
	}

	.class {
		padding: 10rpx 0;

		.class-name {
			font-size: 16px;
		}
	}

	.btn {
		width: 400rpx;
		margin: 40rpx auto;
	}

	.addForm {
		width: 90%;
		background: #f4f4f5;
		margin: 20rpx auto;
		font-size: 20px;
		color: #007AFF;
		border-radius: 16rpx;
		padding: 30rpx 10rpx;
		text-align: center;
	}
		
	.head{
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		padding: 40rpx 10rpx 10rpx 10rpx;
	}
	
	.grid{
		margin-top: 20rpx;
		padding: 20rpx;
		margin-bottom: 300rpx;
	}
	
	.item{
		padding: 20rpx 30rpx;
		background: #f4f4f5;
		text-align: center;
		border-radius: 16rpx;
	}
	.upLoad{
		margin-left: 10rpx;
		padding: 10rpx;
		.upload-desc{
			font-size: 18px;
			font-weight: bold;
			color: #007AFF;
			padding: 10rpx;
			margin-bottom: 10rpx;
		}
		.up-img{
			width: 200rpx;
			height: 200rpx;
			background-color:#dfdfdf;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.up-file{
			width: 100rpx;
			height: 100rpx;
			background-color:#dfdfdf;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
