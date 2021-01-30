// components/sharePost/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showSharePost: {
      type: Boolean,
      value: false
    },
    postList: {
      type: String,
      value: ''
    },
    globalStyle: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据 
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 隐藏遮罩层
    hiddenBg() {
      this.setData({
        showSharePost: false
      })
    },
    
    // 保存图片
    saveImages () {
      let imgSrc =  this.data.postList.slice(22) // base64编码
      let save = wx.getFileSystemManager();
      let number = Math.random();
      save.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        data: imgSrc,
        encoding: 'base64',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            success: function (res) {
              wx.showToast({
                title: '保存成功',
              })
            },
            fail: function (err) {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }, fail: err => {
          console.log(err)
        }
      })
    },
    // 保存图片
    saveImg () {
      let _this = this;
      wx.getSetting({
        success(res) {
            if (res.authSetting['scope.writePhotosAlbum']) {
                _this.saveImages();
                console.log('授权成功')
            } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                        _this.saveImages();
                    },
                    fail(){
                        wx.showToast({
                            title: '您没有授权，无法保存到相册',
                            icon: 'none'
                        })
                    }
                })
            } else {
                // 重新授权弹窗
                wx.showModal({
                  title: '温馨提示',
                  content: '您好，请先授权，再保存此图片',
                  showCancel: false,
                  success(res) {
                    // 重新授权用户点击了确定
                    if (res.confirm) {
                      // 进入小程序授权设置页面
                      wx.openSetting({
                        success(settingdata) {
                          console.log(settingdata)
                          // 用户打开了授权开关
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                            _this.setData({
                              showSharePost: false
                            })
                            _this.saveImages();
                          } else { // 用户未打开保存图片到相册的授权开关
                            wx.showModal({
                              title: '温馨提示',
                              content: '授权失败，请重新授权',
                              showCancel: false
                            })
                          }
                        }
                      })
                    }
                  },
                })
            }
        }
    })
    },
  }
})
