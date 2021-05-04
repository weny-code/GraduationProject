<template>
	<view>
		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view @click="openFile" class="pop-item">
				打开文档
			</view>
			<view @click="copyUrl" class="pop-item">
				复制下载链接
			</view>
			<view class="pop-item">
				取消
			</view>
		</u-popup>
		<view class="file-list">
			<view @click="chooseFile(item)" v-for="(item,index) in fileList" :key="index" class="file">
				<view>
					<view v-show="item.file_detail.extname == 'png' || item.file_detail.extname == 'jpg'">
						<u-image width="80rpx" height="80rpx" :src="item.file_detail.url"></u-image>
					</view>
					<view v-show="item.file_detail.extname == 'doc' || item.file_detail.extname == 'docx'">
						<u-image width="80rpx" height="80rpx" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/a7a95687-9f9d-4b04-8732-edfd2777d91e.png"></u-image>
					</view>
					<view v-show="item.file_detail.extname == 'pdf'">
						<u-image width="80rpx" height="80rpx" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/af354588-3630-46db-99f7-f88dd2144eff.png"></u-image>
					</view>
					<view v-show="item.file_detail.extname == 'xlsx'">
						<u-image width="80rpx" height="80rpx" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/5ed457b2-d42f-47fd-b640-49999918587e.png"></u-image>
					</view>
				</view>
				<view class="right">
					<view class="file-name">
						{{item.file_detail.name}}
					</view>
					<view class="file-desc">
						{{item.uploader_id[0].username}}上传于{{$u.timeFormat(item.upload_time, 'yyyy年mm月dd日 hh时MM分ss秒')}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList:[],
				classInfo:{},
				show:false,
				fileUrl: "",
			};
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			console.log("班级信息：", this.classInfo)
			this.getFileList()
		},
		methods:{
			chooseFile(data){
				if(data.extname!='png' && data.extname!='jpg'){
					this.openPop(data)
				}else{
					this.imgPreview(data)
				}
			},
			async getFileList(){
				const db = uniCloud.database()
				await db.collection('class-file,class-list,uni-id-users').where({
					'class_id._id':this.classInfo._id
				}).field('uploader_id{username},class_id{class_name},upload_time,file_detail')
				.get()
				.then((res=>{
					console.log(res.result.data)
					this.fileList = res.result.data
				}))
			},
			openPop(data) {
				this.fileUrl = data.url
				this.show = true
			},
			openFile() {
				console.log("fileUrl:", this.fileUrl)
				uni.downloadFile({
					url: this.fileUrl,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								console.log('打开文档成功');
							}
						});
					}
				});
			},
			copyUrl(e) {
				// const query = uni.createSelectorQuery().in(this);
				// query.select('#copy').boundingClientRect(data => {
				//   console.log(data.innerText);
				// }).exec();
				uni.setClipboardData({
					data: this.fileUrl,
					success: function() {
						console.log(e);
					}
				});
			},
			imgPreview(item) {
				uni.previewImage({
					indicator: "number",
					loop: true,
					urls: [item.url]
				})
			},
		}
	}
</script>

<style lang="scss">
	.file-list{
		margin-top: 10rpx;
		padding: 20rpx 20rpx;
	}
	.file{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 20rpx;
		.right{
			margin-left: 30rpx;
			.file-name{
				font-weight: bold;
			}
			.file-desc{
				font-size: 14px;
				margin-top: 10rpx;
				color: #6d6d6d;
			}
		}
		.pop-item {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-top: 30rpx;
			padding-bottom: 30rpx;
		}
	}
</style>
