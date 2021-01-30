<template>
  <article class="content">
    <nav class="gift-header" :style="{ 'background-color': themeColor }">
      <div class="item">
        <div @click="navIndex = '0'" :style="{'color': navIndex === '0' ? themeColor : '#ffffff', 'background-color': navIndex === '0' ? '#ffffff' : themeColor }">未领取</div>
      </div>
      <div class="item">
        <div @click="navIndex = '1'" :style="{'color': navIndex === '1' ? themeColor : '#ffffff', 'background-color': navIndex === '1' ? '#ffffff' : themeColor }">已领取</div>
      </div>
      <div class="item">
        <div @click="navIndex = '2'" :style="{'color': navIndex === '2' ? themeColor : '#ffffff', 'background-color': navIndex === '2' ? '#ffffff' : themeColor }">已过期</div>
      </div>
    </nav>

    <div class="gift-list" v-if="giftList.length > 0">
      <div class="item" v-for="(item, index) in giftList" :key="index">
        <div class="item-title">
          <div class="icon" :style="{ 'background-color': themeColor }"></div>
          <div class="resource">来源：{{item.orderSource}}</div>
          <div class="go" v-if="item.giftType === '1'" :style="{ 'color': themeColor }">
            查看优惠券
            <i class="vip-v3-iconfont">&#xe603;</i>
          </div>
        </div>

        <div class="gift-details van-hairline--bottom">
          <div class="name">
            <div class="name-title">{{computedGiftList(item.detail, 'name')}}</div>
            <div class="name-info">
              数量：<span style="padding-right:15px">{{computedGiftList(item.detail, 'number')}}</span>
              单号：<span>{{item.orderNum}}</span>
            </div>
          </div>
          <div class="btn" v-if="navIndex === '0'" @click="goDataPage(item)" :style="{ 'background-color': themeColor }"><div>查看兑换资料</div></div>
        </div>

        <div class="gift-footer">
          <div class="shop-time" :style="{ 'color': themeColor }">
            <span v-if="item.endTime && navIndex === '0'">请于{{item.endTime | datefmt('YYYY.MM.DD')}}前到店领取</span>
            <span v-if="item.confirmDate && navIndex === '1'">{{item.confirmDate | datefmt('YYYY.MM.DD')}}成功领取</span>
          </div>
          <div class="get-time">获得时间：{{item.orderDate | datefmt('YYYY-MM-DD')}}</div>
        </div>

      </div>
    </div>

    <div class="gift-no-list" v-else>
			<img src="../../assets/k-cion.png" alt="no-gift-img">
			<p>暂无礼品</p>
		</div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Gift',
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
	watch: {
		navIndex(val, oldVal) {
			this.getGiftList(val);
		}
	},
  data() {
    return {
      navIndex: '0',
			giftList: []
    }
  },
  activated() {
    this.navIndex = this.$route.query.status || '0';
    this.getGiftList(this.navIndex);
  },
  methods: {
		computedGiftList(list, type) {
      if(type === 'name') {
        return list.map(p => p.giftName).join(',');
      }
			if(type === 'number') {
        return list.map(p => p.exchangeCount).reduce((a, c) => a + c);
      }
    },
		getGiftList(status) {
			const params = {
			  status
			}
			this._http({url: '/jop-marketing-web/gift/query'}, params).then(res => {
			  if(res.data.code === 0) {
			    // console.log(res)
			    this.giftList = res.data.data || [];
			  } else {
			    this.$toast({
			      message: res.data.msg,
			      duration: 1000
			    })
			  }
			})
		},
    goDataPage(gift) {
			if(gift.distributor) {
				this.$router.push({
				  path: '/change-data',
					query: {
						id: gift.orderNum
					}
				})
			} else {
				this.$router.push({
				  path: '/data',
					query: {
						id: gift.orderNum
					}
				})
			}
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: calc(100vh - 75px);
  .gift-header {
    display: flex;
    align-items: center;
    height: 37px;
    .item {
      flex-grow: 1;
      color: #ffffff;
      div {
        width: calc(100% - 2px);
        height: 35px;
        line-height: 35px;
        text-align: center;
        margin: 0 auto;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
      }
    }
  }
  .gift-list {
    width: 100%;
    height: calc(100vh - 106px);
    overflow: auto;
    -webkit-overflow-scrolling: auto;
    .item {
      background-color: white;
      .item-title {
        height: 30px;
        background-color: #f2f2f2;
        display: flex;
        align-items: center;
        .icon {
          width: 3px;
          height: 30px;
        }
        .resource {
          flex-grow: 1;
          font-family: PingFang-SC-Medium;
          font-size: 11px;
          color: #333333;
          padding-left: 8px;
        }
        .go {
          font-family: PingFang-SC-Medium;
          font-size: 11px;
          color: #999999;
          padding-right: 8px;
        }
      }

      .gift-details {
        height: 44px;
        display: flex;
        align-items: center;
        .name {
          flex-grow: 1;
          font-family: PingFang-SC-Heavy;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          padding-left: 8px;
          .name-title {
            width: calc(100vw - 100px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .name-info {
            font-family: PingFang-SC-Medium;
            font-size: 11px;
            font-weight: 300;
            color: #999999;
          }
        }
        .btn {
          width: 84px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          font-family: PingFang-SC-Medium;
          font-size: 11px;
          color: #ffffff;
          border-radius: 25px;
          margin-right: 8px;
          div {
            transform: scale(0.9);
          }
        }
      }

      .gift-footer {
        height: 29px;
        display: flex;
        align-items: center;
        .shop-time {
          flex-grow: 1;
          font-family: PingFang-SC-Heavy;
          font-size: 12px;
          padding-left: 8px;
        }
        .get-time {
          font-family: PingFang-SC-Medium;
          font-size: 11px;
          color: #999999;
          padding-right: 8px;
        }
      }
    }
    .item:not(:first-child) {
      margin-top: 5px;
    }
  }
	.gift-no-list {
		text-align: center;
		img {
			width: 130px;
			height: 130px;
			margin-top: 36px;
		}
		p {
			font-family: PingFang-SC-Medium;
			font-size: 14px;
			color: #999999;
		}
	}
}
</style>
