//获取应用实例
const app = getApp();
import { getSwipersData, queryIndexCateNavigationList, queryIsDistanByFirst, queryAllIndexSpuRecommandList, queryWithImgDistanByFirst, queryWithImgDistancePage, queryWithImgDistanById, queryIndexSpuRecommandList } from '../../api/index'
import { queryMemberInfo } from '../../api/register'
import { getUserInfoLocal } from '../../utils/userInfo'
Page({
	mixins: [require('../../mixins/setColor.js')],
  data: {
		isOpen: false,
		loading: true,
		pullRefresh: false,
		count: 0,
		noMore: false,
		swiperList: [],
		categoryList: [],
		rcd1Data: {},
		rcd2Data: {},
		curPage: 1
	},
	// 获取轮播图
	async getSwiperList(){
		const data = {
			appId: app.globalData.appid
		}
		const res = await getSwipersData(data)
		const swiperList = res.data
		this.setData({ swiperList })
	},
	// 获取分类导航列表
	async queryIndexCateNavigationList(){
		const data = {
			appId: app.globalData.appid
		}
		const res = await queryIndexCateNavigationList(data)
		const categoryList = res.data
		this.setData({ categoryList })
	},
	// 获取推荐位列表1
	async	queryRecommandList1(){
		const data = {
			curPage: 1,
      pageSize: 20,
			storeId: app.globalData.storeId,
			rcdKind: 'RCD1',
		}
		const res = await queryIndexSpuRecommandList(data)
		if(!res.code && res.data){
			const rcd1Data = res.data || {}
			this.setData({ rcd1Data })
		} else {
			this.setData({ rcd1Data: {} })
		}
	},
	// 获取推荐位列表2
	async	queryRecommandList2(){
		const data = {
			curPage: this.data.curPage,
      pageSize: 8,
			storeId: app.globalData.storeId,
			rcdKind: 'RCD2',
		}
		const res = await queryIndexSpuRecommandList(data)
		if(!res.code && res.data){
			const list = res.data || {}
			let rcd2Data = this.data.rcd2Data
			if(this.data.curPage === 1){
				this.setData({ rcd2Data: list, noMore: list.spuList.records.length < 8 })
			}else{
				rcd2Data.spuList.records = rcd2Data.spuList.records.concat(list.spuList.records)
				this.setData({ rcd2Data, noMore: list.spuList.records.length < 8 })
			}
		} else {
			this.setData({ noMore: true, rcd2Data: {} })
		}
	},
	// 保存门店信息
	saveUserInfoAndStore(store){
		const userInfoAndStore = Object.assign({}, app.globalData.userInfoAndStore, { store })
		app.globalData.userInfoAndStore = userInfoAndStore
		// try { wx.setStorageSync('userInfoAndStore', userInfoAndStore) } catch (e) { }
		this.setNavTitle()
	},
	// 查询是否是距离优先
	getStoreType(){
		return new Promise((resolve, reject) => {
		queryIsDistanByFirst({appId: app.globalData.appid}).then(res => {
			if(res.data){
				// 距离优先
				resolve(res.data)
			}else{
				// 系统优先
				reject('setting')
			}
			})
		})
	},
	// 获取系统设置优先或者拒绝授权地址之后的默认门店
	getSysStore(options){
		return new Promise((resolve, reject) => {
			const res = queryWithImgDistanByFirst(options || '').then(res => {
				if(res.data && res.data.id){
					this.saveUserInfoAndStore(res.data)
					resolve(res.data.id)
				}else{
					reject(null)
				}
			})
		})
	},
	// 根据坐标获取门店
	getDisStore(options){
		return new Promise((resolve, reject) => {
			const res = queryWithImgDistancePage({coordCur: options}).then(res => {
				if(res.data.records && res.data.records.length){
					this.saveUserInfoAndStore(res.data.records[0])
					resolve(res.data.records[0].id)
				}else{
					reject(null)
				}
			})
		})
	},
	// 获取用户授权坐标
 	getLocation(){
		return new Promise((resolve, reject) => {
			wx.getLocation({
				type: 'gcj02',
				success(res) {
					const { latitude, longitude} = res
					const options = longitude + ',' + latitude
					resolve(options)
				},
				fail(err) {
					reject(err)
				}
			})
		})
	},
	// 查询门店营业状态
	getStroeStatus(id){
		return new Promise((resolve, reject) => {
			queryWithImgDistanById({id: id}).then(res => resolve(res.data.status === 'OPEN')).catch(err => reject(err))
		})
	},
	//下拉刷新
	async refresh(){
		try{
			const status = await this.getStroeStatus(app.globalData.storeId)
			if(status){
					this.getIndexData()
			}else{
				this.setData({isOpen: false, loading: false, pullRefresh: false})
			}
		}catch(err){
			this.setData({isOpen: true, loading: false, pullRefresh: false})
		}
	},
	// 获取已注册的个人门店信息
	async getUserInfo(){
		const res =	await	queryMemberInfo({})
		 this.saveUserInfoAndStore(res.data.store)
		 app.globalData.storeId = res.data.store.id
		if(res.data.store.status === 'OPEN'){
			await	this.getIndexData()
			this.setData({isOpen: true, loading: false, pullRefresh: false})
		}else{
			this.setData({isOpen: false, loading: false, pullRefresh: false})
		}
	},
	// 获取首页数据
	async getIndexData(){
		await Promise.all([this.getSwiperList(), this.queryIndexCateNavigationList(), this.queryRecommandList1(), this.queryRecommandList2()])
		this.setData({isOpen: true, loading: false, pullRefresh: false})
	},
	setNavTitle(){
		const title = app.globalData.userInfoAndStore && app.globalData.userInfoAndStore.store.name 
		wx.setNavigationBarTitle({
			title: title || '微商城',
		})
	},
	handleMore(){
		if(this.data.noMore) return
    let curPage = this.data.curPage
    curPage++
		this.setData({curPage})
		this.queryRecommandList2()
	},
  async	onLoad(options) {
		if(options.from != 'shop' && app.globalData.toLoginUrl != '/pages/goodsDetail/index'){
			if(getUserInfoLocal()){
				this.getUserInfo()
			}else{
			if(app.globalData.storeId){
				const isOpen = await this.getStroeStatus(app.globalData.storeId)
				if(isOpen){
					this.getIndexData()
				} else{
					this.setData({isOpen: false, loading: false, pullRefresh: false})
				}
			}else{
				try{
					// 后台设置了距离优先
					await this.getStoreType()
					try{
						// 用户同意授权，获取到相应坐标
						const options =	await this.getLocation()
						app.globalData.storeId = await this.getDisStore(options)
						this.getIndexData()
					}	catch (err){
						// 用户拒绝授权，获取默认门店
						app.globalData.storeId = await this.getSysStore('')
						this.getIndexData()
					}
				}	catch (err){
					// 后台设置系统优先，获取系统设置门店
					app.globalData.storeId = await this.getSysStore('')
					this.getIndexData()
				}
			}
			}
		}else{
			this.getIndexData()
		}
  },
  onShow() {
		this.setTabBarStyleAndsetNavigationBarColor(false, 0)
		this.setNavTitle()
	},
})
