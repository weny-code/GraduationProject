<template>
	<view>
		<u-index-list :scrollTop="scrollTop" :index-list="indexList">
			<view v-if="item.data" v-for="(item, index) in list" :key="index">
				<u-index-anchor :index="item.letter" />
				<view @click="makePhone(item1.mobile)" class="list-cell u-border-bottom" v-for="(item1, index_) in list[index].data" :key="index_">
					{{item1.name}}
				</view>
			</view>
		</u-index-list>
		<u-tabbar :list="tabbar" :mid-button="true" active-color="#00aaff"></u-tabbar>
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
				data:"",
				scrollTop: 0,
				indexList:[],
				list:[
					{
					"letter":"A",
					data:[]
				},
				{
					"letter":"B",
					data:[]
				},
				{
					"letter":"C",
					data:[]
				},
				{
					"letter":"D",
					data:[]
				},
				{
					"letter":"E",
					data:[]
				},
				{
					"letter":"F",
					data:[]
				},
				{
					"letter":"G",
					data:[]
				},
				{
					"letter":"H",
					data:[]
				},
				{
					"letter":"I",
					data:[]
				},
				{
					"letter":"J",
					data:[]
				},
				{
					"letter":"K",
					data:[]
				},
				{
					"letter":"L",
					data:[]
				},
				{
					"letter":"M",
					data:[]
				},
				{
					"letter":"N",
					data:[]
				},
				{
					"letter":"O",
					data:[]
				},
				{
					"letter":"P",
					data:[]
				},
				{
					"letter":"Q",
					data:[]
				},
				{
					"letter":"R",
					data:[]
				},
				{
					"letter":"S",
					data:[]
				},
				{
					"letter":"T",
					data:[]
				},
				{
					"letter":"U",
					data:[]
				},
				{
					"letter":"V",
					data:[]
				},
				{
					"letter":"W",
					data:[]
				},
				{
					"letter":"X",
					data:[]
				},
				{
					"letter":"Y",
					data:[]
				},
				{
					"letter":"Z",
					data:[]
				}]
			}	
		},
		computed: {
			...mapState(['uid', 'currentRoleClassList', 'currentRole', 'hasLogin', 'userInfo', 'hasAuth', 'tabbar'])
		},
		onLoad() {
			this.indexList = this.list.map(val => {
		return val.letter;
	})
			this.getMembersList()
			console.log(this.data)
		},
		methods:{
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			makePhone(number){
				console.log((number))
				uni.makePhoneCall({
				    phoneNumber: number //仅为示例
				});
			},
			async getMembersList(){
				const db = uniCloud.database() //代码块为cdb
				await db.collection("class-list").where({
					_id:'607a77c5a23da8000194f7c7'
				}).field('class_members')
				.get()
				.then((res=>{
					console.log("班级成员信息：",res.result.data[0].class_members)
					var pattern = new RegExp("[\u4E00-\u9FA5]+");
					var pattern2 = new RegExp("[A-Za-z]+");
					for(let item of res.result.data[0].class_members){
						if(pattern.test(item.name)){
							console.log("中文：",item.name)
							this.data = this.$pinyin(item.name, { pattern: 'initial' }).toUpperCase().replace(/\s*/g, '')
							console.log(this.data)
							this.list[(this.list.findIndex(item => item.letter == this.data[0]))].data.push(item)
							console.log(this.list)
						} 
						if(pattern2.test(item.name)){
							console.log("英文：",item.name)
							this.data = item.name
							this.list[(this.list.findIndex(item => item.letter == this.data[0]))].data.push(item)
							console.log(this.list)
						}
					}
				}))
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
.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: $u-content-color;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
</style>
