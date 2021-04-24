<template>
	<view>
			
			<view class="flex">
				<uni-file-picker ref="files" :auto-upload="false" limit="5" file-mediatype="all" @select="select"
					@progress="progress" @success="success" @fail="fail">
					<view class="addImg">
						添加文件
					</view>
				</uni-file-picker>
				<view class="addImg">
					图片
				</view>
				<uni-file-picker v-model="imageValue" fileMediatype="image" mode="grid" @select="select"
					@progress="progress" :image-styles="imgStyle" @success="success" @fail="fail">
					<view class="addImg">
						添加图片
					</view>
				</uni-file-picker>
			</view>
		<view class="btn">
			<u-button @click="upload">上传文件</u-button>
		</view>

		<!-- <button @click="download">下载文件</button> -->
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
				imgStyle:{
				    "height": "200rpx",   // 边框高度
				    "width": "200rpx",    // 边框宽度
				    "border":false
				}
			}
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
		},
		methods: {
			upload() {
				this.$refs.files.upload()
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
			select(e) {
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
			success(e) {
				console.log('上传成功', e)
				// console.log('上传成功',e.fileI)
				var time = new Date().getTime()
				const db = uniCloud.database()
				for (let item of e.tempFiles) {
					db.collection('class-file').add({
						uploader_id: this.uid,
						upload_time: time,
						class_id: "607a77c5a23da8000194f7c7",
						file_detail: item
					}).then((res => {
						console.log(res)
					}))
				}
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
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

	.addImg {
		padding: 10rpx 20rpx;
		background: #007AFF;
		font-size: 20px;
	}
</style>
