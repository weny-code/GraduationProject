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
		<view class="head">
			<view class="title">
				{{noticeInfo.title}}
			</view>
			<view class="class-name">
				{{noticeInfo.class_name}}
			</view>
			<view class="release-time">
				{{releaseTime}}发布
			</view>
		</view>
		<view class="card">
			<u-read-more text-indent="0" close-text="展开详情" :toggle="true" ref="uReadMore">
				<rich-text style="font-size: 20px;" :nodes="noticeInfo.content"></rich-text>
				<view class="flex">
					<view v-for="(item,index) in imgList" :key="index" class="img">
						<u-image @click="imgPreview(item)" width="200rpx" height="200rpx" :src="item.url"></u-image>
					</view>
				</view>
				<view class="file">
					<view @click="openPop(item)" v-for="(item,index_) in fileList" :key="index_" class="file-item flex">
						<u-image width="80rpx" height="80rpx"
							src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/883e1012-c5e0-454c-bd18-73365ceda8d3.png">
						</u-image>
						<view style="color: #000000;">
							{{item.name}}
						</view>
					</view>
				</view>
			</u-read-more>
		</view>
		<view v-show="noticeInfo.type != '通知'" class="card">
			<view class="form-item" v-for="(item,index) in noticeInfo.form_item" :key='item.id'>
				<view class="">
					<u-form-item :label-style="lableStyle" :required="true" label-position="top" :label="item.title"
						label-width="150">
						<u-radio-group v-show="item.type == '单项选择'" :wrap="true" size="40"
							@change="radioGroupChange(noticeInfo.form_item[index].title,noticeInfo.form_item[index].type,index,$event)">
							<u-radio v-model="res.name" shape="circle"
								v-for="res in noticeInfo.form_item[index].options" :key="res.id" :name="res.name">
								{{ res.name }}
							</u-radio>
						</u-radio-group>
						<u-checkbox-group v-show="item.type == '多项选择'" :wrap="true" size="40"
							@change="checkboxGroupChange(noticeInfo.form_item[index].title,noticeInfo.form_item[index].type,index,$event)">
							<!-- <u-checkbox @change="checkboxChange(data,$event)" v-model="data.checked" -->
							<u-checkbox v-model="data.checked" v-for="data in noticeInfo.form_item[index].options"
								:key="data.id" :name="data.name">
								{{data.name}}
							</u-checkbox>
						</u-checkbox-group>
						<view v-show="item.type == '文本填空'" style="background: #fff;">
							<u-input
								@blur="inputChange(noticeInfo.form_item[index].title,noticeInfo.form_item[index].type,index,noticeInfo.form_item[index].value)"
								placeholder="请输入" v-model="noticeInfo.form_item[index].value" type="text"
								:border="true" />
						</view>
						<view v-show="item.type == '地理位置'" class="place">
							<view v-show="!hasLocation"
								@click="getLocation(noticeInfo.form_item[index].title,noticeInfo.form_item[index].type,index)"
								class="place-desc flex">
								<u-icon custom-prefix="custom-icon" color="#0055ff" name="weizhi" :size="32"></u-icon>
								点击获取你的位置
							</view>
							<view v-show="hasLocation" class="add-detail">
								<view class="lo-name">
									{{locationName}}
								</view>
								<view class="lo-detail">
									{{locationDetail}}
								</view>
								<view
									@click="getLocation(noticeInfo.form_item[index].title,noticeInfo.form_item[index].type,index)"
									class="foot">
									<u-icon custom-prefix="custom-icon" color="#0055ff" name="weizhi" :size="28">
									</u-icon>
									重新获取位置
								</view>
							</view>
						</view>
					</u-form-item>
				</view>
			</view>
		</view>
		<view class="card">
			<view style="padding: 10rpx;font-size: 18px;font-weight: bold;">
				已填写：
			</view>
			<view v-show="currentRole.classRole == '老师'" style="width: 50%;margin: 20rpx auto;">
				<u-subsection :list="list" :current="curNow" @change="sectionChange"></u-subsection>
			</view>
			<view v-show="curNow==0 && currentRole.classRole == '老师' && item.stu_class == noticeInfo.class_id"
				v-for="(item,index) in confirmedList.confirmed" :key="index" class="confirm-info">
				<u-line color="#e4e7ed"></u-line>
				<view class="person-info flex">
					<u-avatar size="80" :src="item.stu_avatar"></u-avatar>
					<view class="info">
						<view class="name">
							{{item.stu_name}}
						</view>
						<view class="time">
							{{$u.timeFormat(item.submit_time, 'yyyy年mm月dd日 hh:MM:ss')}}
						</view>
					</view>
				</view>
				<view v-show="noticeInfo.type != '通知'" v-for="(res,index_) in item.stu_choice" :key="index_"
					class="confirm flex">
					<view class="">{{index_+1}}.</view>
					<view style="margin-left: 8rpx;">
						{{res.title}}:
					</view>
					<view style="margin-left: 12rpx;">
						{{res.choice}}
					</view>
				</view>
			</view>
			<view v-show="currentRole.classRole == '学生' && item.stu_class == noticeInfo.class_id"
				v-for="(item,index) in confirmedList.confirmed" :key="index" class="confirm-info">
				<view v-if="item.stu_name == currentRole.username">
					<u-line color="#e4e7ed"></u-line>
					<view class="person-info flex">
						<u-avatar size="80" :src="item.stu_avatar"></u-avatar>
						<view class="info">
							<view class="name">
								{{item.stu_name}}
							</view>
							<view class="time">
								{{$u.timeFormat(item.submit_time, 'yyyy年mm月dd日 hh:MM:ss')}}
							</view>
						</view>
					</view>
					<view v-for="(res,index_) in item.stu_choice" :key="index_" class="confirm flex">
						<view class="">{{index_+1}}.</view>
						<view style="margin-left: 8rpx;">
							{{res.title}}:
						</view>
						<view style="margin-left: 12rpx;">
							{{res.choice}}
						</view>
					</view>
				</view>
			</view>
			<view v-show="curNow==1 && currentRole.classRole == '老师'" class="confirm-info">
				<view v-show="noticeInfo.type != '通知'" style="margin-top: 20rpx;" v-for="(item,index) in tableList"
					:key="index">
					<view class="table-title">
						{{index+1}}:{{item.title}}
					</view>
					<u-table>
						<u-tr v-show="item.type=='单项选择' || item.type=='多项选择'" class="u-tr">
							<u-th class="u-th">
								<view style="width: 300rpx;">
									选项
								</view>
							</u-th>
							<u-th class="u-th">小计</u-th>
							<u-th class="u-th">比例</u-th>
							<u-th class="u-th">详情</u-th>
						</u-tr>
						<u-tr v-for="(res,index_) in tableList[index].options" :key="index_"
							v-show="item.type=='单项选择' || item.type=='多项选择'" class="u-tr">
							<u-td class="u-td">
								<view style="width: 300rpx;">
									{{res.name}}
								</view>
							</u-td>
							<u-td v-if="res.confirmed" class="u-td">{{res.confirmed.length}}</u-td>
							<u-td v-if="!res.confirmed" class="u-td">0</u-td>
							<u-td v-if="res.confirmed" class="u-td">{{getPercent(res.confirmed.length)}}</u-td>
							<u-td v-if="!res.confirmed" class="u-td">{{getPercent(0)}}</u-td>
							<u-td class="u-td">
								<view @click="goConfirmList(res.confirmed)" style="color: #007AFF;">
									详情
								</view>
							</u-td>
						</u-tr>
						<u-tr v-show="item.type=='文本填空'" class="u-tr">
							<u-th class="u-th">姓名</u-th>
							<u-th class="u-th">填写内容</u-th>
						</u-tr>
						<u-tr v-show="item.type=='文本填空'" v-for="(data,index_) in tableList[index].value" :key="index_"
							class="u-tr">
							<u-td class="u-td">{{data.name}}</u-td>
							<u-td class="u-td">{{data.value}}</u-td>
						</u-tr>
					</u-table>
				</view>
			</view>
		</view>
		<view v-show="!hasConfirmed && currentRole.classRole != '老师'" class="btn">
			<u-button v-if="noticeInfo.type == '通知'" @click="confirmNotice" type="primary" shape="circle" :ripple="true"
				ripple-bg-color="#909399">
				确认收到通知
			</u-button>
			<u-button @click="confirmClock" v-if="noticeInfo.type == '打卡'" type="primary" shape="circle" :ripple="true"
				ripple-bg-color="#909399">
				提交打卡
			</u-button>
		</view>
		<view v-show="hasConfirmed && currentRole.classRole != '老师'" class="btn">
			<u-button :custom-style="customStyle" type="info" v-if="noticeInfo.type == '通知'" shape="circle"
				:disabled="false">已确认收到通知
			</u-button>
			<u-button :custom-style="customStyle" type="info" v-if="noticeInfo.type == '打卡'" shape="circle"
				:disabled="false">已完成打卡
			</u-button>
		</view>
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
				list: [{
						name: '详细情况'
					},
					{
						name: '统计结果'
					}
				],
				curNow: 0,
				tableList: [{}],
				noticeInfo: {},
				releaseTime: "",
				locationName: "",
				locationDetail: "",
				hasConfirmed: false,
				hasLocation: false,
				lableStyle: {
					fontSize: '18px',
					fontWeight: 'bold',
					marginLeft: '10rpx',
				},
				customStyle: {
					background: '#a1a1a1',
					color: "#fff"
				},
				thStyle: {
					height: "200rpx"
				},
				choice: [],
				confirmedList: {},
				imgList: [],
				fileList: [],
				show: false,
				fileUrl: ""
			};
		},
		computed: {
			...mapState(['uid', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth']),
			getPercent() {
				return (confirmed) => {
					this.confirmPercent = confirmed / (this.noticeInfo.class_size) * 100
					return `${parseInt(this.confirmPercent)}%`
				}
			},
		},
		onLoad(option) {
			this.noticeInfo = JSON.parse(decodeURIComponent(option.params))
			for (let item of this.noticeInfo.file_list) {
				if (item.extname == 'png' || item.extname == 'jpg') {
					this.imgList.push(item)
				} else {
					this.fileList.push(item)
				}
			}
			console.log("详情页的noticeInfo:", this.noticeInfo)
			this.releaseTime = this.$u.timeFormat(this.noticeInfo.release_time, 'yyyy年mm月dd日 hh:MM')
			this.checkConfirm()
			this.getConfirmList()
		},
		methods: {
			inputChange(title, type, index, e) {
				console.log("离开焦点");
				this.choice.splice(index, 1, {
					title: title,
					type: type,
					choice: e
				})
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(title, type, index, e) {
				console.log("下标：", e);
				this.choice.splice(index, 1, {
					title: title,
					type: type,
					choice: e
				})
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(item, e) {
				console.log("checkbox:", item);
				console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(title, type, index, e) {
				console.log("下标：", index);
				this.choice.splice(index, 1, {
					title: title,
					type: type,
					choice: e
				})
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
			sectionChange(index) {
				this.curNow = index;
			},
			async checkConfirm() {
				const db = uniCloud.database()
				await db.collection('class-notice').where({
						'_id': this.noticeInfo._id,
						'confirmed.stu_id': this.uid,
						'confirmed.stu_class': this.noticeInfo.class_id
					})
					.get()
					.then((res => {
						console.log("checkConfirm", res)
						if (res.result.data.length > 0) {
							this.hasConfirmed = true
						}
					}))
			},
			confirmNotice() {
				var time = new Date().getTime()
				uniCloud.callFunction({
						name: 'confirmed-update-push',
						data: {
							id: this.noticeInfo._id,
							stu_class: this.noticeInfo.class_id,
							stu_id: this.uid,
							stu_name: this.currentRole.username,
							stu_avatar: this.userInfo.avatar,
							submit_time: time,
							stu_choice: this.choice
						}
					})
					.then(res => {
						console.log(res)
						this.hasConfirmed = true
						uni.$emit('updateConfirm')
					});

			},
			confirmClock() {
				console.log("用户选择的结果：", this.choice)
				var time = new Date().getTime()
				uniCloud.callFunction({
						name: 'confirmed-update-push',
						data: {
							id: this.noticeInfo._id,
							stu_class: this.noticeInfo.class_id,
							stu_id: this.uid,
							stu_name: this.currentRole.username,
							stu_avatar: this.userInfo.avatar,
							submit_time: time,
							stu_choice: this.choice
						}
					})
					.then(res => {
						console.log(res)
						this.hasConfirmed = true
						uni.$emit('updateConfirm')
					});
			},
			getLocation(title, type, index) {
				var _this = this
				uni.chooseLocation({
					success: function(res) {
						console.log('位置名称：' + res.name);
						_this.locationName = res.name
						_this.locationDetail = res.address
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						_this.hasLocation = true
					}
				});
			},
			async getConfirmList() {
				const db = uniCloud.database()
				await db.collection('class-notice').where({
						_id: this.noticeInfo._id,
					})
					.field('confirmed,form_item')
					.get()
					.then((res => {
						console.log("confirmList:", res.result.data[0])
						this.confirmedList = res.result.data[0]
						if (this.noticeInfo.type != "通知") {
							this.setTableInfo()
						}
					}))
			},
			setTableInfo() {
				for (let i = 0; i < this.confirmedList.form_item.length; i++) {
					const item = this.confirmedList.form_item[i]
					if (this.confirmedList.form_item[i].type == '文本填空') {
						this.tableList.splice(i, 1, {
							type: item.type,
							title: item.title,
							value: []
						})
					} else {
						this.tableList.splice(i, 1, {
							type: item.type,
							title: item.title,
							options: item.options
						})
					}
				}
				for (let i = 0; i < this.confirmedList.confirmed.length; i++) {
					if (this.confirmedList.confirmed[i].stu_class == this.noticeInfo.class_id) {
						for (let j = 0; j < this.confirmedList.confirmed[i].stu_choice.length; j++) {
							const jj = this.confirmedList.confirmed[i].stu_choice[j]
							for (let k = 0; k < this.tableList.length; k++) {
								// const list = []
								if (this.tableList[k].type == jj.type && this.tableList[k].title == jj.title) {
									if (this.tableList[k].type != '文本填空') {
										// const list = []
										for (let x = 0; x < this.tableList[k].options.length; x++) {
											const list = []
											if (jj.choice.includes(this.tableList[k].options[x].name)) {
												if (this.tableList[k].options[x].confirmed) {
													this.tableList[k].options[x].confirmed.push({
														name: this.confirmedList.confirmed[i].stu_name,
														avatar: this.confirmedList.confirmed[i].stu_avatar,
														classId: this.noticeInfo.class_name,
														classSize: this.noticeInfo.class_size
													})
												} else {
													list.push({
														name: this.confirmedList.confirmed[i].stu_name,
														avatar: this.confirmedList.confirmed[i].stu_avatar,
														classId: this.noticeInfo.class_name,
														classSize: this.noticeInfo.class_size
													})
													this.tableList[k].options[x].confirmed = list
												}
											}
										}
									} else {
										this.tableList[k].value.push({
											name: this.confirmedList.confirmed[i].stu_name,
											avatar: this.confirmedList.confirmed[i].stu_avatar,
											classId: this.noticeInfo.class_name,
											classSize: this.noticeInfo.class_size,
											value: jj.choice
										})
									}
								}
							}
						}
					}
				}
				console.log("tableList:", this.tableList)
			},
			imgPreview(item) {
				uni.previewImage({
					indicator: "number",
					loop: true,
					urls: [item.url]
				})
			},
			goConfirmList(data) {
				var params = encodeURIComponent(JSON.stringify(data))
				uni.navigateTo({
					url: '../../../packageC/pages/confirmedList/confirmedList?params=' + params,
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
		background-color: #f7f8fa;
	}

	/* #endif */
</style>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.card {
		// width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.10);
		box-sizing: border-box;
		overflow: hidden;
		padding: 20rpx;
	}

	.img {
		margin-top: 20rpx;
		margin-left: 20rpx;
	}

	.box {
		padding: 30rpx 30rpx 10rpx 30rpx;
	}

	.add-detail {
		background: #fff;
		margin: 10rpx auto;

		.lo-name {
			font-size: 18px;
			font-weight: bold;
			margin-left: 20rpx;
		}

		.lo-detail {
			font-size: 16px;
			color: #424242;
			margin-left: 20rpx;
		}

		.foot {
			color: #0055ff;
			margin-left: 80rpx;
		}
	}

	.uni-list-cell {
		justify-content: flex-start
	}

	.table-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.form-item {
		margin-top: 20rpx;
		padding: 20rpx 30rpx;
		border-radius: 16rpx;
		background: #f4f4f5;
	}

	.head {
		background: #aaffff;
		padding: 20rpx 30rpx;

		.title {
			font-size: 24px;
			font-weight: bold;
		}

		.class-name {
			font-size: 14px;
			margin-top: 20rpx;
		}

		.release-time {
			font-size: 14px;
			margin-top: 10rpx;
		}
	}

	.file {
		margin-top: 20rpx;
		padding: 10rpx 20rpx;

		.file-item {
			background: #dfdfdf;
			padding: 10rpx;
			margin-top: 20rpx;
		}
	}

	.btn {
		width: 400rpx;
		margin: 40rpx auto;
	}

	.place {
		background: #fff;
		margin: 10rpx auto;
		padding: 10rpx 20rpx;
	}

	.place-desc {
		font-size: 16px;
		margin-left: 80rpx;
		padding: 20rpx;
		color: #0055ff;
	}

	.form-title {
		font-size: 18px;
		font-weight: bold;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
	}

	.confirm-info {
		margin-top: 10rpx;
		padding: 10rpx;
	}

	.person-info {
		margin-top: 20rpx;

		.info {
			margin-left: 20rpx;

			.name {
				font-size: 18px;
			}

			.time {
				font-size: 16px;
				color: #909399;
			}
		}
	}

	.pop-item {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}

	.confirm {
		margin-top: 8rpx;
		font-size: 14px;
	}
</style>
