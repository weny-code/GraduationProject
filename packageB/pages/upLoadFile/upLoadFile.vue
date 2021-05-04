<template>
	<view>
		<view class="upLoad">
			<view class="upload-desc">
				选择图片
			</view>
			<uni-file-picker ref="Imgfiles" v-model="imageValue" fileMediatype="image" mode="grid" @select="selectImg"
				@progress="progress" :auto-upload="false" :image-styles="imgStyle" @success="successImg" @fail="fail">
				<view class="up-img">
					<u-icon custom-prefix="custom-icon" name="tianjiatupian" :size="100"></u-icon>
				</view>
			</uni-file-picker>
		</view>
		<view class="upLoad">
			<view class="upload-desc">
				选择附件
			</view>
			<uni-file-picker ref="Filefiles" :auto-upload="false" limit="5" file-mediatype="all" @select="selectFile"
				@progress="progress" :list-styles="listStyle" @success="successFile" @fail="fail">
				<view class="up-file">
					<u-icon custom-prefix="custom-icon" name="shangchuanwenjian" :size="60"></u-icon>
				</view>
			</uni-file-picker>
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
			<u-button @click="upload">上传文件</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				imageValue: [],
				fileList:[],
				tempList: [],
				classList: [],
				chooseClass:[],
				upLoadImgsuccess:false,
				upLoadFilesuccess:false,
				show:false,
				content:"",
				noticeId:"",
				imgStyle:{
				    "height": "200rpx",   // 边框高度
				    "width": "200rpx",    // 边框宽度
				    "border":false,
				},
				listStyle:{
				    "borderStyle":{
				        "color":"#eee",     // 边框颜色
				        "width":"1px",      // 边框宽度
				        "style":"solid",    // 边框样式
				        "radius":"5px"      // 边框圆角，不支持百分比
				    },
					"padding":"10rpx 20rpx",
				    "border":true, // 是否显示边框
				    "dividline":true // 是否显示分隔线
				}
			}
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
		},
		onLoad() {
			this.tempList = uni.getStorageSync('currentRoleClassList')
			for (let item of this.tempList) {
				this.classList.push({
					className: item.class_name,
					classId: item._id,
					checked: false,
					disabled: false
				})
			}
		},
		methods: {
			upload() {
				if(this.chooseClass.length>0){
					this.$refs.Imgfiles.upload()
				}else{
					uni.showToast({
						title:"未选择班级！"
					})
				}
			},
			async saveFile(){
				var time = new Date().getTime()
				const db = uniCloud.database()
				for(let item of this.fileList){
					await db.collection('class-file').add({
						uploader_id:this.uid,
						upload_time:time,
						class_id:this.chooseClass,
						file_detail:item
					}).then((res=>{
						console.log(res)
					}))
				}
 			},
			checkboxChange(e) {
				console.log(e);
				if(e.value){
					for(let i of this.classList){
						if(i.className == e.name){
							this.chooseClass.push(i.classId)
						}
					}
				}else{
					for(let i of this.classList){
						if(i.className == e.name){
							this.chooseClass.splice(this.chooseClass.findIndex(res => res === i.classId), 1)
						}
					}
				}
				console.log(this.chooseClass)
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
				console.log('上传成功', e)
				for(let item of e.tempFiles){
					this.fileList.push(item)
				}
				this.$refs.Filefiles.upload()
				console.log('fileList:', this.fileList)
			},
			successFile(e) {
				console.log('上传成功', e)
				for(let item of e.tempFiles){
					this.fileList.push(item)
				}
				this.saveFile()
				console.log('fileList:', this.fileList)
			},
			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	
	.box{
		padding: 30rpx 30rpx 10rpx 30rpx;
	}
	
	.class {
		padding: 10rpx 0;
	
		.class-name {
			font-size: 16px;
		}
	}
</style>
