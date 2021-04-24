<template>
	<view>
		<view v-if="formInfo.type=='单项选择'" class="container">
			<view class="single-title">
				<u-field v-model="formTitle" :clearable="false" label-width="50" :label="formIdx" placeholder="请输入单选项标题"
					required>
				</u-field>
			</view>
			<view v-for="(res,index) in singleOpt" :key="index" class="single-option">
				<u-icon @click="deleteOpt(index)" name="minus-circle" color="#606266" size="28"></u-icon>
				<u-field v-model="res.name" :clearable="false" label-width="0" placeholder="请输入单选项名称">
				</u-field>
			</view>
			<view class="operation flex">
				<view @click="addOpt" class="left flex">
					<u-icon name="plus-circle" color="#007AFF" size="28"></u-icon>
					添加选项
				</view>
				<view class="right flex">
					<view class="must">
						<u-icon name="checkmark-circle-fill" color="#606266" size="28"></u-icon>
						必填
					</view>
					<view @click="deleteForm" class="delete">
						<u-icon name="trash" color="#606266" size="28"></u-icon>
						删除
					</view>
				</view>
			</view>
		</view>
		<view v-if="formInfo.type=='多项选择'" class="container">
			<view class="single-title">
				<u-field v-model="formTitle" :clearable="false" label-width="50" :label="formIdx" placeholder="请输入多选项标题"
					required>
				</u-field>
			</view>
			<view v-for="(res,index) in singleOpt" :key="index" class="single-option">
				<u-icon @click="deleteOpt(index)" name="minus-circle" color="#606266" size="28"></u-icon>
				<u-field v-model="res.name" :clearable="false" label-width="0" placeholder="请输入多选项名称">
				</u-field>
			</view>
			<view class="operation flex">
				<view @click="addOpt" class="left flex">
					<u-icon name="plus-circle" color="#007AFF" size="28"></u-icon>
					添加选项
				</view>
				<view class="right flex">
					<view class="must">
						<u-icon name="checkmark-circle-fill" color="#606266" size="28"></u-icon>
						必填
					</view>
					<view @click="deleteForm" class="delete">
						删除
					</view>
				</view>
			</view>
		</view>
		<view v-if="formInfo.type=='文本填空'" class="container">
			<view class="single-title">
				<u-field v-model="formTitle" :clearable="false" label-width="50" :label="formIdx" placeholder="请输入标题"
					required>
				</u-field>
			</view>
			<view style="background: #fff;">
				<u-input :disabled="true" placeholder="填写者可以输入任意文本" v-model="value" type="text" :border="true" />
			</view>
			<view class="operation flex">
				<view class="right flex">
					<view class="must">
						<u-icon name="checkmark-circle-fill" color="#606266" size="28"></u-icon>
						必填
					</view>
					<view @click="deleteForm" class="delete">
						<u-icon name="trash" color="#606266" size="28"></u-icon>
						删除
					</view>
				</view>
			</view>
		</view>
		<view v-if="formInfo.type=='地理位置'" class="container">
			<view class="single-title">
				<u-field v-model="formTitle" :clearable="false" label-width="50" :label="formIdx" placeholder="请输入定位标题"
					required>
				</u-field>
			</view>
			<view class="address">
				<u-icon custom-prefix="custom-icon" color="#909399" name="weizhi" :size="32"></u-icon>
				<text>获取当前定位信息</text>
			</view>
			<view class="operation flex">
				<view class="right flex">
					<view class="must">
						<u-icon name="checkmark-circle-fill" color="#606266" size="28"></u-icon>
						必填
					</view>
					<view @click="deleteForm" class="delete">
						<u-icon name="trash" color="#606266" size="28"></u-icon>
						删除
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "clockCard",
		props: ['formInfo', 'formIdx','cardId'],
		data() {
			return {
				formTitle: "",
				singleOpt: [{
						id:0,
						name: "",
						checked:false
					},
					{
						id:1,
						name: "",
						checked:false
					},
				],
				value:"",
				formDetail: {}
			};
		},
		mounted() {
			var _this = this
			uni.$on('setForm', ((data) => {
				console.log('监听到事件来自 setForm', data)
				_this.setFormDetail(data.noticeId,data.cardId)
			}))
			console.log("formInfo:", this.formInfo)
			console.log("formIdx:", this.formIdx)
		},
		destroyed() {
			uni.$off('setForm')
		},
		methods: {
			addOpt() {
				this.singleOpt.push({
					id:this.singleOpt.length,
					name: "",
					checked:false
				})
			},
			saveForm(id) {
				uniCloud.callFunction({
						name: 'formItem-update-push',
						data: {
							id: id,
							option: this.formDetail,
						}
					})
					.then(res => {
						console.log(res)
					});
			},
			setFormDetail(noticeId,cardId) {
				console.log("cardId:",cardId)
				if(this.cardId == cardId){
					if(this.formInfo.type == '文本填空' || this.formInfo.type == '地理位置'){
						this.formDetail.title = this.formTitle
						this.formDetail.type = this.formInfo.type
						this.formDetail.value = this.value
						console.log(this.formDetail)
						this.saveForm(noticeId)
					}else{
						this.formDetail.title = this.formTitle
						this.formDetail.type = this.formInfo.type
						this.formDetail.options = this.singleOpt
						console.log(this.formDetail)
						this.saveForm(noticeId)
					}
				}
			},
			deleteOpt(index) {
				if (this.singleOpt.length > 2) {
					this.singleOpt.splice(index, 1)
				} else {
					uni.showToast({
						title: '不能少于两个！'
					})
				}

			},
			deleteForm() {
				uni.$emit('deleteForm', {
					index: this.formIdx
				})
			}
		}
	}
</script>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.container {
		width: 90%;
		margin: 20rpx auto;
		background: #f4f4f5;
		border-radius: 16rpx;
		padding: 20rpx 10rpx;
	}

	.single-option {
		margin-left: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	
	.single-title{
		font-weight: bold;
	}

	.operation {
		margin-top: 20rpx;
		padding: 10rpx 30rpx;

		.left {
			width: 150rpx;
			color: #007AFF;
		}

		.right {
			width: 180rpx;
			color: #606266;
		}
	}
	
	.address{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
