<template>
  <div class="Home">
    <div class="top" v-if="showTitle">
      <i class="iconfont icon-back" @click="$router.go(-1)">&#xe6a4;</i>开心小游戏
    </div>
    <div class="banner">
      <img src="../assets/images/qiqiu-1.png" class="lefImg" />
      <img src="../assets/images/qiqiu-2.png" class="rgImg" />
      <img src="../assets/images/index-bg.png" @load="loadImage" />
    </div>
    <div class="container">
      <ul class="gameList" v-if="ActiveList.length > 0">
        <li
          v-for="(item, index) in ActiveList"
          :key="index"
          @click="toPage($event, index)"
          :class="styles[item.parentActive]"
        >
          <div class="bgImage">
            <div class="membericon">
              <span v-show="item.isMember == '0' ? true : false">仅限会员</span>
            </div>
            <div class="text-box">
              <ul>
                <li class="titleName">{{ item.activityName }}</li>
                <li class="text">
                  <p>{{ item.activeTheme }}</p>
                </li>
                <li class="time">{{ item.beginTime }}—{{ item.endTime }}</li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-yx-bg" v-else>
        <img src="../assets/images/no-yx-bg.png" />
        <p class="text">暂时没有可参加的游戏，敬请期待！</p>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li>
          <a :href="memberHomeLink">会员首页</a>
        </li>
        <li @click="toMycenter">我的</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Home } from '@/axios/api.js'
import URL from '@/config/url.js'
// import moment from 'moment'
import { mapMutations, mapState } from 'vuex'
import { getLocalStorage, setStorage, getInfoStorage } from '@/utils'
// import wxShareInit from '@/utils/share'
import baseUrl from '@/config/config.js'
import { eraseUserInfo } from '@/utils/set-url-data.js'
export default {
  name: 'home',

  components: {},

  data() {
    return {
      styles: {
        九宫格: '',
        翻牌: 'flop',
        老虎机: 'tiger',
        鼠年大翻身: 'mouse'
      },
      showTitle: false,
      mp3Url: '',
      flopUrl: '',
      ActiveList: [],
      imageCount: 0,
      dataStatus: 0,
      memberHomeLink: ''
    }
  },
  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData
    })
  },
  watch: {
    imageCount(newVal) {
      if (newVal >= 1) {
        this.$loading.close()
      }
    },
    ActiveData: {
      handler() {},
      deep: true
    }
  },
  created() {
    this.changetitle()
  },
  methods: {
    ...mapMutations(['setGameActiveData', 'setimgCount']),
    changetitle() {
      document.title = '开心小游戏'
    },
    loadImage() {
      this.imageCount++
    },
    toMycenter() {
      let { wxUserInfo } = getLocalStorage()
      setStorage.save(JSON.stringify(wxUserInfo))

      window.location.href = `${baseUrl}/wx_member/gift/index.html#/gift`
    },
    toPage($event, index) {
      let RouterName = this.ActiveList[index].parentActive
      let companyKey = null,
        isMember = null,
        activityId = null
      let id = this.ActiveList[index].id
      this.ActiveList.forEach(val => {
        if (val.id == id) {
          companyKey = val.companyKey
          activityId = val.id || val.activityId
          isMember = val.isMember
          this.setGameActiveData(val)
        }
      })
      if (RouterName == '九宫格') {
        this.$router.push({
          path: '/jggIndex',
          query: { id: activityId, companyKey: companyKey, isMember: isMember }
        })
        this.setimgCount(0)
      } else if (RouterName == '翻牌') {
        this.$router.push({
          path: '/flop',
          query: { id: activityId, companyKey: companyKey, isMember: isMember }
        })
      } else if (RouterName == '老虎机') {
        this.$router.push({
          path: '/tigger',
          query: { id: activityId, companyKey: companyKey, isMember: isMember }
        })
      } else if (RouterName == '新春翻红包') {
        this.$router.push({
          path: '/redenvelope',
          query: { id: activityId, companyKey: companyKey, isMember: isMember }
        })
      } else if (RouterName == '鼠年大翻身') {
        this.$router.push({
          path: '/cat-and-mouse',
          query: { id: activityId, companyKey: companyKey, isMember: isMember }
        })
      }
    },

    // 获取查询字符串参数
    getUrlQueryData() {
      if ('c' in this.$route.query) {
        const query = this.$route.query
        // const { childPage, shareId, p1, o, c, i, p, m, s, openid, page } = query
        const { childPage, shareId, p1, o, c, i, m, s, openid } = query

        const urlData = {
          page: childPage,
          id: shareId,
          openid: o,
          companyKey: c,
          headerImg: i,
          memberCard: m ? m : null,
          phone: s ? s : null,
          // page: page || null,
          register_openid: openid,
          localUrl: window.location.origin.concat(`/${URL}/#/`),
          isRegister: '1'
        }

        const ticket = window.localStorage.getItem(
          `ticket_${urlData.companyKey}`
        )
        if (ticket) {
          const localUrlData = getInfoStorage.get()
          urlData.memberCard = localUrlData.memberCard
          urlData.phone = localUrlData.phone
        }

        const oldStorage = getLocalStorage() // 已持久化数据
        const result = Object.assign(oldStorage, urlData)

        setStorage.save(JSON.stringify(result))
        this._eraseUserInfo()

        let Page = `/${childPage}`
        let isMember = p1
        if (!childPage != true) {
          this.$router.replace({
            path: Page,
            query: {
              id: shareId,
              companyKey: urlData.companyKey,
              isMember: isMember
            }
          })
        }
      }
    },
    // 处理 URL
    _eraseUserInfo() {
      eraseUserInfo()
    }
  },
  mounted() {
    this.getUrlQueryData()
    let { wxUserInfo } = getLocalStorage()
    this.memberHomeLink =
      baseUrl + `/wx-interface-web/wx/auth?companyKey=${wxUserInfo.companyKey}`
    let body = {
      activeType: '1'
    }
    this.$loading.open()
    Home(body)
      .then(res => {
        let { code, data } = res
        if (code == 0) {
          if (data && data.length > 0) {
            this.ActiveList = data.map(val => {
              let obj = Object.assign(val, { id: val.id, activeId: val.id })
              this.imageCount++
              return obj
            })
          } else if (window.location.hash === '#/home') {
            this.$toast('暂无活动，敬请期待')
          } else {
            this.$toast('游戏尚未正式发布，仅试玩体验')
          }
        }
      })
      .catch(err => {
        this.$loading.close()
        this.$toast(err, '首页')
      })
  }
}
</script>

<style lang="stylus" scoped>
.no-yx-bg {
  width: 100vw;
  text-align: center;

  &>img {
    margin: 0 auto;
  }

  .text {
    color: #DDD;
    margin-top: 20px;
    font-size: 4vw;
  }
}

.Home {
  width: 100vw;
  min-height: 100vh;
  background-color: #E23118;

  .top {
    width: 100%;
    height: 12vw;
    line-height: 12vw;
    text-align: center;
    background: #fff;
    font-size: 4vw;
    padding-right: 8vw;
    box-sizing: border-box;

    .icon-back {
      color: #fe5362;
      font-weight: bold;
      width: 5vw;
      height: 12vw;
      font-size: 6vw;
      float: left;
      vertical-align: middle;
    }
  }

  .footer {
    position: fixed;
    width: 100vw;
    bottom: 0;
    z-index: 10;

    & >ul {
      width: 100%;
      display: flex;
      background-color: #fa7d4f;

      & > li {
        flex: 1;
        height: 12vw;
        line-height: 12vw;
        font-size: 4vw;
        color: #fff1ca;
        text-align: center;
      }

      & > li:nth-child(1) {
        border-right: 0.2vw solid #e23118;

        &>a {
          display: inline-block;
          width: 100%;
          height: 100%;
          color: #fff;
          text-decoration: none;
        }
      }
    }
  }

  .banner {
    width: 100%;
    height: 63vw;
    position: relative;

    & > img {
      width: 100%;
    }

    .lefImg {
      width: 6vw;
      height: 12vw;
      position: absolute;
      left: 10vw;
      top: 12vw;
      animation: jump 5s linear infinite alternate;
    }

    .rgImg {
      width: 6vw;
      height: 12vw;
      position: absolute;
      right: 10vw;
      top: 13vw;
      animation: jump1 4.8s linear infinite alternate;
    }
  }

  .container {
    width: 100%;
    position: relative;
    z-index: 10;
    padding-bottom: 20vw;

    .gameList {
      width: 100%;
      padding: 4vw;
      box-sizing: border-box;
      margin-top: -5vw;

      & > li.flop {
        background-image: linear-gradient(to right, #7C3EEB 30%, #9C72FD 80%);

        .bgImage {
          background: url('../assets/images/fp-bg.png') right no-repeat;
          background-size: 32% 75%;
          background-position: 55vw 8vw;
        }
      }

      & > li.tiger {
        background-image: linear-gradient(to right, #f06809 30%, #f7c700 80%);

        .bgImage {
          background: url('../assets/images/index-bg-icon.png') right no-repeat;
          background-size: 32% 75%;
          background-position: 55vw 8vw;
        }
      }

      & > li.mouse {
        background-image: linear-gradient(to right, #f06809 30%, #f7c700 80%);

        .bgImage {
          background: url('../assets/images/index-bg-icon-mouse.png') 70px bottom no-repeat;
          background-size: 75% 78%;
        }
      }

      & > li {
        margin-top: 4vw;
        width: 92vw;
        min-height: 28vw;
        border: solid 0.3vw #fde7be;
        border-radius: 2vw;
        overflow: hidden;
        background-image: linear-gradient(to right, #d23b25 30%, #fc7f50 80%);

        .bgImage {
          width: 100%;
          height: 100%;
          background: url('../assets/images/jgg-bg.png') no-repeat;
          background-size: 32% 75%;
          background-position: 55vw 8vw;
          padding-bottom: 10px;

          .membericon {
            text-align: right;
            position: relative;
            padding-top: 5vw;

            & > span {
              position: absolute;
              right: 0;
              top: 0;
              width: 17vw;
              height: 6vw;
              line-height: 6vw;
              font-size: 3vw;
              color: #bb1c19;
              text-align: center;
              background-image: linear-gradient(to right, #FECE84 0%, #FDE0AF 100%);
              border-bottom-left-radius: 2vw;
            }
          }

          .text-box {
            font-size: 5vw;

            &>ul {
              padding-left: 4vw;
            }

            &>ul>li {
              margin-top: 1vw;
              color: #fff;

              &.titleName {
                font-size: 5vw;
              }

              &.text {
                font-size: 3vw;

                &>P {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
              }

              &.time {
                font-size: 3vw;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}

@keyframes jump {
  100% {
    top: 5vw;
  }
}

@keyframes jump1 {
  100% {
    top: 3vw;
  }
}
</style>
