<template>
  <div class="Rule">
    <div class="top" v-if="(ActiveData.activeTheme&&ActiveData.activeTheme!='')" >
      <i class="iconfont icon-back" @click="back">&#xe6a4;</i>
      <p>{{ActiveData.activeTheme}}</p>
      <i
        v-show="ActiveData.isShare=='1'"
        class="iconfont icon-share"
        @click="share"
      >&#xe603;</i>
    </div>
    <div class="banner">
      <img :src="ActiveData.imgName" alt />
    </div>
    <div class="rule-content">
      <div class="rule-time">
        活动时间：
        <span>{{ActiveData.beginTime}}</span>至
        <span>{{ActiveData.endTime}}</span>
      </div>
      <ul class="concat-text" v-if="!(ActiveData.isNewGame&&ActiveData.isNewGame==1)">
        <li>
          <span>活动联系</span>
        </li>
        <li>
          <p>
            联系地址:
            <span>{{ActiveData.serviceAddr}}</span>
          </p>
        </li>
        <li>
          <p>
            联系电话：
            <span>{{ActiveData.servicePhone}}</span>
          </p>
        </li>
      </ul>
      <div class="ProductView" v-if="ActiveData.isShowPhoto == '0' ? false : true">
        <div class="wrapperView">
          <p class="title">活动奖品</p>
          <div>
            <ul>
              <li
                v-for="(item, index) of productGift" :key="index" @click="toPage(item)"
              >
                <img :src="item.gifUrl" alt />
                <p>{{item.text}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="rule-box">
        <div class="rule-text">
          <h2 class="title">活动规则</h2>
          <div class="wrapper-context" v-html="ActiveData.rule"></div>
        </div>
      </div>
      <div class="btn">
        <button @click="goWinning">去抽奖</button>
      </div>
    </div>
    <div class="sharelayer" v-show="sharebox" @click="hide">
      <img src="../../assets/images/fenxiang.png" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import { share } from '@/axios/api.js'
import { getLocalStorage } from '@/utils/local-storage'
// import wxShareInit from '@/utils/share'
// import { gameDetails, activeInProducts, loginGift } from '@/axios/api.js'
import { gameDetails, activeInProducts } from '@/axios/api.js'
export default {
  components: {},
  data() {
    return {
      sharebox: false
    }
  },

  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData,
      activeInProducts: state => state.game.activeInProducts,
      productGift: state => state.game.productGift
    })
  },

  watch: {},
  methods: {
    ...mapMutations(['setGameActiveData', 'setproductGift']),
    goWinning() {
      this.$router.go(-1)
    },
    back() {
      this.$router.go(-1)
    },
    toPage(item) {
      const activeName = encodeURIComponent(this.ActiveData.activityName)
      const Pramas = { activeName, giftCode: item.jmpGiftCode }
      this.$router.push({ path: '/giftdetail', query: Pramas })
    },
    share() {
      this.sharebox = true
    },
    hide() {
      this.sharebox = false
    }
  },
  created() {
    //
  },

  mounted() {
    if (this.productGift.length == 0) {
      let localStorageData = getLocalStorage()
      let { wxUserInfo, ticket, memberCard } = localStorageData
      this.ticket = ticket
      memberCard = memberCard
        ? memberCard
        : wxUserInfo && wxUserInfo.memberCard
        ? wxUserInfo.memberCard
        : ''
      // const companyKey = wxUserInfo.companyKey
      this.run = 0 //计数值
      let activeId =
        this.ActiveData.id || this.ActiveData.activityId || this.$route.query.id
      let body = { activeId: activeId },
        gamePramas = { id: activeId, memberCard: memberCard }
      gameDetails(gamePramas)
        .then(res => {
          let { data, code } = res
          if (code == 0) {
            if (data) {
              this.setGameActiveData(data)
            } else {
              this.$toast('非常抱歉，系统繁忙中...')
            }
          } else {
            this.$toast('非常抱歉，系统繁忙中...')
          }
        })
        .catch(err => {
          this.$toast(err)
        })
      activeInProducts(body)
        .then(res => {
          let { data, code } = res
          let activeData = []
          if (code == 0) {
            activeData = data.map(val => {
              return {
                gifUrl: val.imgName,
                text: val.productName,
                jmpGiftCode: val.jmpGiftCode,
                sequence: val.sequence
              }
            })
            this.setproductGift(activeData)
          }
        })
        .catch(err => {
          this.$toast(err)
        })
    }
  }
}
</script>
<style lang='stylus' scoped>
.ProductView {
  background: #ebc01e;
  position: relative;
  padding: 1vw;
  border-radius: 2vw;
  margin: 3vw 0;

  .wrapperView {
    background: #fff;
    border-radius: 2vw;

    & > div {
      padding: 0 3vw;
      padding-bottom: 2vw;
      width: 100%;
      overflow: scroll;

      & > ul {
        display: flex;
        flex-wrap: nowrap;
        width: auto;
        padding-top: 10px;

        & > li {
          min-width: 28vw;
          text-align: center;
          margin: 5px;
          font-size: 3vw;
        }

        & > li:last-child {
          padding-right: 5vw;
        }

        img {
          width: 28vw;
          height: 30vw;
          margin-bottom: 5px;
          border-radius: 3vw;
        }
      }
    }

    .title {
      color: #333333;
      font-size: 5vw;
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid #eeeeee;
      height: 11vw;
      line-height: 11vw;
    }
  }
}

.Rule {
  width: 100vw;
  background: #f7ca20;
  box-sizing: border-box;
  background: #F7CA20;
  min-height: 100vh;

  .sharelayer {
    width: 100vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    &>img {
      float: right;
      width: 13rem;
      height: 10rem;
      margin-top: 1rem;
      margin-right: 1rem;
    }
  }

  .top {
    width: 100vw;
    height: 12vw;
    line-height: 12vw;
    text-align: center;
    background: #fff;
    font-size: 4vw;
    padding-right: 8vw;

    .icon-back {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: left;
      vertical-align: middle;
    }

    .icon-share {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: right;
      vertical-align: middle;
    }
  }

  .banner {
    width: 100vw;
    height: 47vw;
    background: url('../../assets/images/nine-grid/banner.png') no-repeat;
    background-size: 100%;
    position: relative;
    & >img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .rule-content {
    padding: 0 5vw;
    margin-top: 10px;

    .rule-time {
      font-size: 3vw;
      color: #333333;
      text-align: center;
      padding-bottom: 2vw;
    }

    .concat-text {
      & > li {
        padding-bottom: 2vw;
        font-size: 3vw;
      }

      & > li:nth-child(1) span {
        color: #333333;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
      }
    }

    .rule-box {
      background: #EBC01E;
      position: relative;
      padding: 1vw;
      border-radius: 2vw;

      .rule-text {
        background: #fff;
        padding: 0 3vw;
        padding-bottom: 2vw;
        border-radius: 2vw;

        .wrapper-context {
          width: 100%;
          overflow: scroll;
          line-height: 20px;
          max-height: 450px;
          font-size: 3.5vw;
        }
        .title {
          font-size: 5vw;
          text-align: center;
          padding: 2vw 0;
          border-bottom: 1px solid #f5f5f5;
          margin-bottom: 2vw;
          font-weight: bold;
        }
      }
    }
  }

  .btn {
    text-align: center;
    padding: 4vw 0;

    &>button {
      width: 48vw;
      height: 11vw;
      line-height: 11vw;
      border-radius: 5vw;
      border: none;
      background: #FC7523;
      color: #fff;
      font-size: 5vw;
    }
  }
}
</style>
<style lang='stylus'>
 .wrapper-context {
  ol li{
    list-style-type: decimal;
    list-style-position: inside;
  }
}
</style>