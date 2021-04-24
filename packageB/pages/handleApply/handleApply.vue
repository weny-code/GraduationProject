<!-- 滑动切换选项卡演示 -->
<!--  此demo使用了uView的tabsSwiper全屏选项卡 https://uviewui.com/components/tabsSwiper.html -->
<template>
	<view v-if="classInfo._id" class="content" @touchmove.stop.prevent>
		<!-- 此处代码复制了uView中tabsSwiper全屏选项卡的代码 -->
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<leave-item :classInfo="classInfo" :tabIndex="index" :currentIndex="swiperCurrent" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	// import classCard from "@/components/classCard/classCard.vue";
	import leaveItem from "../../components/leave-item/leave-item.vue"
	export default {
		components:{
			leaveItem
		},
		data() {
			return {
				list: [{
					name: '待审批'
				}, {
					name: '已审批'
				}],
				classInfo:{},
				flag:false,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		onLoad(option) {
			this.classInfo = JSON.parse(decodeURIComponent(option.params))
			if(this.classInfo._id){
				this.flag = true
			}
			console.log("处理请假页面的classInfo:", this.classInfo)
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
	
	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}
	
	.swiper{
		flex: 1;
	}
</style>
