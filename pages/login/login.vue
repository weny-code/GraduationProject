<template>
	<view class="content">
		<!-- <image class="bg-set" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0864766-02e5-4b10-8e08-72e0af293546/eb7739ff-2441-44aa-85e3-e61d09c55169.jpg"></image>
		<u-loading size="50" color="blue" v-if="loadingShow" mode="circle">正在登录...</u-loading>
		<u-button v-if="btnShow" @click="loginByWeixin" :custom-style="customStyle" type="primary">立即进入</u-button> -->
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
				btnShow:true,
				loadingShow:false,
				customStyle: {
					borderRadius: '40rpx',
					fontSize:"40rpx",
					color: '#FFFFFF',
					textAlign: 'center',
					padding: '20rpx 150rpx'
				}
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo','hasAuth'])
		},
		methods: {
			...mapMutations(["login","logout"]),
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rem;
	}

	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
