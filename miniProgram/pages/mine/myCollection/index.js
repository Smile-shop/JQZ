// pages/mine/myCollection/index.js
import {
  Server
} from '../../../models/server.js'
const server = new Server();
const app = getApp();
var gs = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: 1,
    listArr: [], // 店数据
    isReachBottom: true, // 是否上拉刷新
    pageNum: 1, // 页数
    pageSize: 10, // 每页显示的数据
    total: 0 ,
    showAction: false,
    result: [],
    checked: false,
    imgSrc: 'http://img4.imgtn.bdimg.com/it/u=3767034719,3131887467&fm=11&gp=0.jpg',
    value: 1,
    priceStatus: true, // 价格默认由高到低
    showIcon: false, // 是否显示已选购标签
    showNum: null, // target标识
    sortPri: 2, //价格排序：1升序，2降序
    productCodeList: [], // 多品商品数据列表
    productMoreId: '', //多品id
    productCodeId: '', // 多品商品id
    checkedData: [], // 选中的数据
    goodsName: '', // 商品名称
    checkAllParams: {}, //全选数据
    productCodePageNum: 1, // 多品分页
    productCodeTotal: 0, // 多品总条数
    isSort: 0, // 1是排序 0 为其他
    globalStyle: getApp().globalData.globalStyle
  },
  onSwipeOpen(event) {
    if (this.data.instance) {
      this.data.instance.close()
    }
    const instance = this.selectComponent('#item-' + event.currentTarget.id)
    console.log(instance)
    this.setData({
      instance
    })
  },
  onSwipeClose() {
    if (this.data.instance) {
      this.data.instance.close()
    }
  },
  onCloseSwipe(event) {
    const instance = this.selectComponent('#item-' + event.target.id);
    const self = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          self.data.instance.close();
          self.removeMyCollection(event.currentTarget.dataset.index);
        } else if (res.cancel) {
          self.data.instance.close();
        }
      }
    });
  },
  // 跳转详情
  goDetail(e) {
    const storageType = e.currentTarget.dataset.storagetype;
    const proId = e.currentTarget.dataset.proid;
    const param = {
      storageType,
      proId
    }
    const params = encodeURIComponent(JSON.stringify(param));
    wx.navigateTo({
      url: `../../goodsDetail/index?detail=${params}`
    });
  },
  // 当选当前
  onChangeAll(e) {
    const keyValue = e.target.dataset.key;
    const list = this.data.productCodeList;
    const i = list.findIndex(p => p.productCodeId == keyValue);
    list[i].add = list[i].add ? list[i].add : this.data.value

    // test start
    const obj = {
      productCodeId: list[i].productCodeId,
      count: list[i].add
    }
    var length = e.detail.length
    let cData = this.data.checkedData;
    // 选中时获取数据 start
    if (e.detail.length >= 0) {
      let idx = e.detail.findIndex(p => p == keyValue.toString());
      if (idx != -1) {
        cData.push(obj);
        this.setData({
          checkedData: cData
        });
      } else {  // 取消选中时
        let result = this.data.checkedData.filter((v, i) => {
          return v.productCodeId != keyValue
        })
        this.setData({
          checkedData: result
        });
      }
    }
    // end

    this.setData({
      result: e.detail,
      productCodeList: list
    })
    this.findCheck();
  },

  // 全选函数
  findCheck() {
    const lenth = this.data.result.length;
    const list = this.data.productCodeList.length;
    if (lenth == list) {
      this.setData({
        checked: true
      })
    }
    else {
      this.setData({
        checked: false
      })
    }
  },
  // 关闭多品弹窗
  onActionClose() {
    this.setData({
      showAction: false,
      result: [],
      checked: false
    });
  },
  // 打开多品弹窗
  onActionOpen(e) {
    // this.setData({
    //   showAction: true,
    //   productMoreId: e.target.dataset.productid,
    //   goodsName: e.target.dataset.goodsname,
    //   productCodeList: [], // 设置为空
    //   productCodePageNum: 1 //设置为1
    // });
    // this.productMore(e);
    wx.navigateTo({
      url: `/pages/scrollList/index?id=${e.target.dataset.productid}&name=${e.target.dataset.goodsname}`,
    })
  },
  // 多品商品数据请求
  productMore(e, index) {
    // index仅仅是排序的标识 1代表的是排序
    const params = {
      data: {
        productId: e.currentTarget.dataset.productid ? e.currentTarget.dataset.productid : this.data.productMoreId,
        sort: this.data.sortPri
      },
      page: {
        pageNum: this.data.productCodePageNum,
        pageSize: 10
      }
    }
    server.productCodeList(params).then((res) => {
      if (res.code === 0) {
        let listData = null;
        if (this.data.sortPri == 1 && index === 1 || this.data.sortPri == 2 && index === 1) {
          listData = res.replyData.list ? res.replyData.list : [];
        } else {
          listData = res.replyData.list ? this.data.productCodeList.concat(res.replyData.list) : [];
        }
        this.setData({
          productCodeList: listData,
          productCodeTotal: res.replyData.total ? res.replyData.total : 0
        })
      }
    })
  },
  // 收藏列表
  getMyCollection(index) {
    const self = this;
    const params = {
      pageNum: self.data.pageNum,
      pageSize: self.data.pageSize
    }
    server.getMyCollection(params).then((res) => {
      if (res.code === 0) {
        let dataArr = [];
        // index 为1就是删除刷新 2为下拉刷新
        if (index === 1) {
          dataArr = res.replyData.list;
        } else if (index === 2) {
          this.setData({
            pageNum: 1,
            listArr: []
          });
          dataArr = res.replyData.list;
        } else {
          dataArr = self.data.listArr.concat(res.replyData.list);
        }
        self.setData({
          listArr: dataArr,
          total: res.replyData.total
        });
        setTimeout(() => {
          if (index === 2) {}
          wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
        },1000)
      }
    });
  },
  // 取消收藏
  removeMyCollection(id) {
    const params = {
      productIdList: [id]
    }
    server.getRemove(params).then((res) => {
      if (res.code === 0) {
        this.getMyCollection(1); // 刷新列表
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
    });
  },
  // 加入购物车全选
  onChange(event) {
    // 全选功能
    let result = this.data.productCodeList.map((item) => {
      return (item.productCodeId).toString()
    });
    // 如果列表列表没有add属性 就自动加
    this.data.productCodeList.filter((v) => {
      if (v.add == undefined) {
        return v.add = 1;
      }
    })
    let para = this.data.productCodeList.map((item) => {
      return {
        count: item.add,
        productCodeId: item.productCodeId
      }
    });
    let params = {
      productId: this.data.productCodeList[0].productId,
      list: para
    }

    this.setData({
      checked: event.detail,
      result: result,
      checkAllParams: params
    });
    // 反选
    if (!this.data.checked) {
      this.setData({
        result: []
      })
    }
  },
  // 加入购物车
  goBuy(e) {
    const shelvesRule = e.target.dataset.shelvesrule;
    const prolist = this.data.productCodeList;
    const keyValue = e.target.dataset.productid;
    const i = prolist.findIndex(p => p.productCodeId == keyValue);
    let listArray = []
    // 获取选中的数据
    prolist.forEach((item) => {
      if (this.data.result.indexOf((item.productCodeId).toString()) > -1){
        listArray.push({
          count: item.add,
          productCodeId: item.productCodeId
        })
      }
    });
    let params = {};

    if (shelvesRule === 1) {
      params = {
        productId: e.target.dataset.productid
      }
    } else {
      params = {
        productId: e.target.dataset.productid,
        // list: this.data.checkedData
        list: listArray
      }
    }
    if (shelvesRule === 1) {
      server.addShoppingCart(params).then((res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '已加入购物车',
            icon: 'none'
          })
        }
      })
    } else {
      if (listArray.length > 0) {
        server.addShoppingCart(params).then((res) => {
          if (res.code === 0) {
            wx.showToast({
              title: '已加入购物车',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: '请选择要加入购物车的商品',
          icon: 'none'
        })
      }
    }
  },
  // 购物车加减触发事件
  goStepper(e) {
    const keyValue = e.target.dataset.key;
    const list = this.data.productCodeList;
    const i = list.findIndex(p => p.productCodeId == keyValue);
    list[i].add = e.detail
    this.setData({
      productCodeList: list
    })

    let keyArr = this.data.result.concat(keyValue.toString());
    // 数组去重的方法
    let newArr = [...new Set(keyArr)];
    this.setData({
      result: newArr,
    });
    this.findCheck();
  },
  // 价格排序
  sortPrice(e) {
    this.setData({
      isSort: e.currentTarget.dataset.sort
    })
    if (this.data.isSort == 1) {
      this.setData({
        productCodePageNum: 1
      })
    }
    if (this.data.priceStatus) {
      this.setData({
        priceStatus: false,
        sortPri: 1
      })
      this.productMore(e, 1)
    } else {
      this.setData({
        priceStatus: true,
        sortPri: 2
      })
      this.productMore(e, 1)
    }
  },
  // 下拉加载
  bindDownLoad(e) {
    if (this.data.productCodeTotal > this.data.productCodeList.length) {
      this.setData({
        productCodePageNum: this.data.productCodePageNum + 1
      })
      this.productMore(e);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMyCollection();
    this.setData({
      globalStyle: getApp().globalData.globalStyle
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyCollection(1);
    // 设置头部导航栏背景色
    gs.globalStyleFun(app.globalData.globalStyle, this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // wx.stopPullDownRefresh();
    // this.setData({
    //   pageNum: 1,
    //   listArr: []
    // });
    this.getMyCollection(2);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.listArr.length) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getMyCollection();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})