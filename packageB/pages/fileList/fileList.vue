<template>
	<view>
		<view class="file-list">
			<view v-for="(item,index) in fileList" :key="index" class="file">
				<view>
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
						{{item.uploader_id[0].username}}上传于
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
				fileList:[]
			};
		},
		onLoad() {
			this.getFileList()
		},
		methods:{
			async getFileList(){
				const db = uniCloud.database()
				await db.collection('class-file,class-list,uni-id-users').where({
					'class_id._id':'607a77c5a23da8000194f7c7'
				}).field('uploader_id{username},class_id{class_name},upload_time,file_detail')
				.get()
				.then((res=>{
					console.log(res.result.data)
					this.fileList = res.result.data
				}))
			}
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
		
	}
</style>
