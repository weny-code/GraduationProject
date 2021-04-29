import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		uid:"",
		hasLogin: false,
		userInfo: {},
		currentRole:{},
		hasAuth: false,
		currentRoleClassList:[],
		tabbar: [{
				iconPath: "/static/icon/home.png",
				selectedIconPath: "/static/icon/home_select.png",
				text: '首页',
				pagePath: "/pages/home/home"
			},
			{
				pagePath: "/pages/release/release",
				iconPath: "/static/icon/min_button_select.png",
				selectedIconPath: "/static/icon/min_button_select.png",
				text: '',
				midButton: true,
			},
			{
				pagePath: "/pages/myCenter/myCenter",
				iconPath: "/static/icon/myCenter.png",
				selectedIconPath: "/static/icon/myCenter_select.png",
				text: '我的',
			},
		]
	},
	mutations: {
		setClassList(state,classList){
			state.currentRoleClassList = classList
			uni.setStorageSync('currentRoleClassList', classList)
		},
		setRole(state,currentRole){
			state.currentRole = currentRole
			uni.setStorageSync('currentRole', currentRole)
		},
		login(state, UserInfo) {
			state.hasLogin = true
			state.userInfo = UserInfo
			uni.setStorageSync('userInfo', UserInfo)
		},
		logout(state) {
			state.hasLogin = false
		},
		getAuth(state, UserInfo) {
			state.hasAuth = true
			state.userInfo = UserInfo
			uni.setStorageSync('userInfo', UserInfo)
		},
		setID(state,id){
			state.uid = id
		}
	},
	actions: {},
	modules: {}
})
