import { queryFriendsHelp, queryPopularValueByActiveId, } from '../../api/index';
//获取应用实例
const app = getApp();
Page({
  data: {
    tabType: 0,
    popularitys_0_2: [],
    popularitys_3: [],
    friends: [],
    isLoading: false,
    isLoadingErr: false,
    globalData: app.globalData,
  },
  switchTabType(event) {
    const type = event.target.dataset.type;
    if (type != null) {
      this.setData({
        tabType: type,
      });
    }
  },
  // 获取手机号
  async getPhonenumber(e) {
    const app = getApp();
    const phoneNumber = await app.getPhonenumber(e);
    await app.updateUserPhoneNumber(phoneNumber);
    wx.showToast({
      title: '登录成功',
      success() {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 2000)
      }
    })
  },
  // 获取人气排名列表
  async getPopularitys(lastRanking = 0) {
    const body = {
      lastRanking
    };

    if (this.data.isLoading == false) {
      this.setData({
        isLoading: true,
      })
    }

    try {
      const res = await queryPopularValueByActiveId(body);

      if (res instanceof Array) {
        if (body.lastRanking == 0) {
          const popularitys_0_2 = [
            {
              wicon: '/assets/img/avatar.png',
              wname: '--',
              popularValue: '--'
            },
            {
              wicon: '/assets/img/avatar.png',
              wname: '--',
              popularValue: '--'
            },
            {
              wicon: '/assets/img/avatar.png',
              wname: '--',
              popularValue: '--'
            },
          ];
          
          res.slice(0, 3).forEach((value, index) => {
            if (value) {
              if (index == 0) {
                popularitys_0_2[1] = value;
              } else if (index == 1) {
                popularitys_0_2[0] = value;
              } else {
                popularitys_0_2[index] = value;
              }
            }
          })
    
          this.setData({
            popularitys_0_2,
            popularitys_3: res.slice(3)
          });
        } else {
          this.setData({
            popularitys_3: this.data.popularitys_3.concat(res)
          });
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      this.setData({
        isLoading: false,
      })
    }
  },
  popularitysScrollToLower(event) {
    const lastRanking = this.data.popularitys_3[this.data.popularitys_3.length - 1].ranking;
    this.getPopularitys(lastRanking);
  },
  friendsScrollToLower(event) {
    const lastRanking = this.data.friends[this.data.friends.length - 1].ranking;
    this.getFriends(lastRanking);
  },
  // 获取助力好友列表
  async getFriends(lastRanking = 0) {
    const body = {
      lastRanking,
    };

    if (this.data.isLoading == false) {
      this.setData({
        isLoading: true,
      })
    }

    try {
      const res = await queryFriendsHelp(body);
      if (res instanceof Array) {
        this.setData({
          friends: this.data.friends.concat(res),
        });
      }
    } catch (err) {
      console.warn(err);
    } finally {
      this.setData({
        isLoading: false,
      })
    }
  },
  onLoad() {
    this.setData({
      globalData: app.globalData
    })
    this.getFriends();
    this.getPopularitys();
  }
})