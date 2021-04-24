<template>
	<view>
		<u-tabbar :list="tabbars" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				tabbars: ''
			}
		},
		onLoad() {
			/**
			 * 示例中为每个tabbar页面都写了一遍tabbar变量，您可以将tabbar数组写入到vuex中，这样可以全局引用
			 */
			this.tabbars = this.tabbar
		},
		computed: {
			...mapState(['tabbar'])
		},
		methods: {

		}
	}
</script>

<style>

</style>
