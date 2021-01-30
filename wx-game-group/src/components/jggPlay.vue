<template>
  <div class="play-box">
    <ul class="play">
      <li
        v-for="(item, index) of activeInProducts"
        :key="index"
        :class="[activeMax==index?'prize select':'prize']"
      >
        <img :src="item.gifUrl" @load="loadImage" alt="奖品" :class="imgCount>=8?Class[index]:''" />
        <p>{{( item.text && item.text.length > 5 ) ? item.text.slice(0, 6) + '...' : item.text}}</p>
      </li>
      <li :class="gameStatus?'gameStart':'start'" @click="GoLottery"></li>
    </ul>
    <Tip ref="Tip" :tiptext="tiptext"></Tip>
    <Error :show.sync="errorShow" :no-member="errorIsMember" :msg="errorMessage" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { startDraw } from '@/axios/api.js'
import Tip from '@/components/Tip.vue'
import moment from 'moment'
import { getLocalStorage } from '@/utils/local-storage'
import { getGiftStorage } from '@/utils'
import Error from 'dialog/Error'
export default {
  components: { Tip, Error },
  props: {},
  data() {
    return {
      imglodingnum: 0,
      productType: '', // 中奖类型 1 赠品 2 优惠券
      tiptext: '', //提示文本值
      timer: ' ', //控制快速旋转的定时器
      timer2: null, //控制慢速旋转的定时器
      prizeIndex: 0, //转动到的位置
      stopIndex: '', //停止的位置
      clickFlage: true, //是否能点击进行抽奖
      prize: '', //奖品
      activeMin: true, //一闪一闪的灯
      activeMax: 0, //默认奖品第一个奖品开始
      gameStatus: false, //此值防止多次点击
      source: null,
      errorMessage: '', //错误信息显示
      errorShow: false, // 错误提示是否展示
      errorIsMember: false, // 展示
      Class: [
        'Animation1',
        'Animation2',
        'Animation3',
        'Animation4',
        'Animation5',
        'Animation6',
        'Animation7',
        'Animation8'
      ]
    }
  },

  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData,
      activeInProducts: state => state.game.activeInProducts,
      invalidImg: state => state.game.invalidImg,
      winningIndex: state => state.game.winningIndex,
      getgroupCode: state => state.game.groupCode,
      imgCount: state => state.game.imgCount
    }),
    ...mapGetters(['getJggOnlyMember'])
  },
  watch: {
    imgCount(newVal) {
      if (newVal >= 8) {
        this.$loading.close()
      }
    },
    //监听步数位置 与抽奖返回对应编号映射
    activeMax(newVal) {
      let str = String(this.winningIndex) == null ? '' : this.winningIndex
      if (str.indexOf(newVal) >= 0) {
        clearInterval(this.timer2)
        let Timeout = setTimeout(() => {
          this.setmarkStatus(true)
          this.gameStatus = false
          this.$emit('sendStatus', false)
          clearTimeout(Timeout)
        }, 500)
      }
    }
  },
  methods: {
    loadImage() {
      let imglodingnum = this.imgCount
      imglodingnum++
      this.setimgCount(imglodingnum)
    },
    ...mapMutations([
      'setmarkStatus',
      'setWinning',
      'setPumping',
      'setwinningIndex',
      'setGameActiveData',
      'setMarktext',
      'setconfirmStatus',
      'setMarkBtnstatus',
      'setMarkLinkstatus',
      'setimgCount',
      'setJggProductType',
      'setJggRegister',
      'setJggCoupon',
      'setJggGiftInfo'
    ]),
    //初始动画
    initMove() {
      clearInterval(this.timer2)
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.move()
      }, 1000)
    },
    //执行动画；
    move() {
      var count = this.count++
      this.activeMin = count % 2 === 0 ? true : false
      this.activeMax = count % 8
    },
    ComputedTime() {
      let computedTime = new Promise(resolve => {
        let timeout = setTimeout(function() {
          resolve('0')
          clearInterval(this.timer2)
          clearTimeout(timeout)
          this.gameStatus = false
        }, 4000)
      })
      return computedTime
    },
    //去抽奖
    toLottery() {
      let { wxUserInfo, ticket, memberCard } = getLocalStorage()
      let userMember
      if (this.ActiveData) {
        userMember = this.ActiveData.userMember
        let isMember = this.ActiveData.isMember || this.$route.query.isMember
        if (isMember == '0') {
          memberCard = memberCard
            ? memberCard
            : wxUserInfo && wxUserInfo.memberCard
            ? wxUserInfo.memberCard
            : ''
        } else {
          memberCard = ''
        }
      }
      if (this.gameStatus) {
        this.$toast('抽奖正在进行中，请稍等')
        return false
      } else {
        clearInterval(this.timer2)
        clearInterval(this.timer)
        let afterBeginTime = moment(this.ActiveData.beginTime).valueOf(), // 抽奖开始时间(当天的 00:00:00 开始)
          beforeEndTime =
            moment(this.ActiveData.endTime)
              .add(1, 'd')
              .valueOf() - 1, // 抽奖的结束时间（+1天的 00:59:59 结束）
          TimestampNowDate = moment(
            new Date(),
            'YYYY-MM-DD HH:mm:ss'
          ).valueOf(), //当前时间
          creditUsable = parseInt(this.ActiveData.creditUsable),
          consumeIntegral = parseInt(this.ActiveData.consumeIntegral),
          remainNum = parseInt(this.ActiveData.remainNum),
          isMember = this.ActiveData.isMember

        if (isMember == 0 && userMember == 0) {
          this.setconfirmStatus(true)
        } else if (TimestampNowDate < afterBeginTime) {
          this.$toast('非常抱歉！活动尚未开始，暂不能抽奖。')
          return false
        } else if (TimestampNowDate > beforeEndTime) {
          this.$toast('非常抱歉！活动已结束，敬请期待下次活动')
          return false
        } else {
          this.gameStatus = true
          this.$emit('sendStatus', true) //派发游戏是否开启状态
          clearInterval(this.timer2)
          this.timer2 = setInterval(() => {
            this.move()
          }, 100)

          let body = {
            id: this.ActiveData.activityId || this.ActiveData.id,
            memberCard: memberCard
          }
          let ActiveAry = this.activeInProducts

          console.log('开始抽奖了。。。')

          startDraw(body)
            .then(res => {
              let { data, code, msg } = res
              console.log(res, '这是开始抽奖的', data.productType)
              // 设置中奖类型
              const type = String(data.productType)
              getGiftStorage.save(data)
              // 登录猜可以设置优惠券位置
              if (ticket) {
                this.setJggProductType(type)
              }
              //这里执行3s后减速
              clearInterval(this.timer)
              let Timeout = setTimeout(() => {
                clearInterval(this.timer2)
                this.timer2 = null
                this.timer2 = setInterval(() => {
                  this.move()
                }, 500)
                clearTimeout(Timeout)
              }, 3000)

              //5s后清除所有定时器
              this.ComputedTime().then(() => {
                if (code == '-1') {
                  this.tiptext = msg
                  // this.$refs.Tip.show()
                  console.log('这里来显示', msg)
                } else if (code == 0) {
                  //数据返回；
                  console.log('抽奖成功')
                  remainNum = data.remainNum // 剩余抽奖次数
                  creditUsable = data.creditUsable // 总积分
                  consumeIntegral = data.consumeIntegral // 每次抽奖消耗积分
                  let productType = data.productType // 中奖类型

                  let giftid = data.giftCode,
                    indexAry = [],
                    WinningData
                  // 保存游戏数据
                  const saveGameData = () => {
                    let GameActiveData = {
                      creditUsable: creditUsable,
                      consumeIntegral: consumeIntegral,
                      remainNum: remainNum
                    }

                    this.setGameActiveData(
                      Object.assign(this.ActiveData, GameActiveData)
                    )
                  }

                  // 保存礼品数据
                  const saveGiftData = () => {
                    if (giftid) {
                      ActiveAry.forEach((val, i) => {
                        if (giftid == val.jmpGiftCode) {
                          indexAry.push(i)
                          indexAry.join(',')
                          console.log('设置中奖1111111', indexAry)
                          this.setwinningIndex(indexAry)
                          WinningData = Object.assign(data, ActiveAry[i], {
                            body: body
                          })
                          this.setPumping(WinningData)
                          this.setJggGiftInfo(WinningData)
                        }
                      })
                    } else {
                      this.getgroupCode.forEach((val, i) => {
                        let value = String(val)
                        if (value.indexOf('-1') == 0) {
                          indexAry.push(i)
                        }
                      })
                      indexAry.join(',')
                      console.log('设置中奖22222222222', indexAry)
                      this.setwinningIndex(indexAry)
                      WinningData = Object.assign(data, {
                        gifUrl: this.invalidImg,
                        text: ''
                      })
                      this.setPumping(WinningData)
                      this.setJggGiftInfo(WinningData)
                    }
                  }
                  // 提示未登录
                  const noLogin = () => {
                    this.setMarkBtnstatus(true)
                    this.setMarkLinkstatus(1)
                    this.setMarktext('您还未登录，请登录后领取')
                    this.setJggRegister('还不是会员， 点此注册')
                  }
                  // 安慰奖
                  const confortWin = () => {
                    console.log('安慰奖')
                    if (parseInt(remainNum) > 0) {
                      this.setMarktext('再来一次')
                      this.setMarkLinkstatus(0)
                      this.setMarkBtnstatus(true)
                    } else {
                      this.setMarktext('今日抽奖次数已用完,请明天再来')
                      this.setMarkLinkstatus(0)
                      this.setMarkBtnstatus(false)
                    }
                  }
                  // 获得礼品
                  const winPrize = () => {
                    this.setMarkBtnstatus(true)
                    this.setMarkLinkstatus(2)
                    this.setMarktext('请选择领取门店')
                    this.setJggRegister('')
                  }

                  // 1. 登录(未登录， 已登录)
                  // 2. 中奖(未中奖， 已中奖)
                  // 2.1. 中奖类型(1.礼品，2.优惠券，3.积分)
                  // 3. 剩余抽奖次数(用完， 还有机会)
                  const { ticket, memberCard } = getLocalStorage() // 登录情况， 会员情况
                  if (!ticket || !memberCard) {
                    console.log('没有大概')
                    saveGameData()
                    saveGiftData()
                    if (giftid) {
                      noLogin()
                      return
                    } else {
                      confortWin()
                      return
                    }
                  } else {
                    saveGameData()
                    saveGiftData()
                    if (giftid) {
                      if (productType === '1') {
                        winPrize()
                        return
                      } else {
                        confortWin()
                        return
                      }
                    } else {
                      confortWin()
                      return
                    }
                  }
                } else {
                  this.$toast(msg)
                }
                this.$emit('sendStatus', false)
              })
            })
            .catch(err => {
              console.log('抽奖中间处问题', err)
              const { ticket, memberCard } = getLocalStorage() // 登录情况， 会员情况
              if (ticket && memberCard) {
                console.log('仅限会员，已登录')
              } else {
                console.log('仅限会员, 未登录')
                this.errorIsMember = true
              }
              // this.$toast(err)
              this.errorShow = true
              if (memberCard) {
                this.memberCard = true
              } else {
                this.memberCard = false
              }
              this.errorMessage = err
              console.log('错误的显示', err)
              clearInterval(this.timer2)
              this.gameStatus = false
              this.$emit('sendStatus', false)
              this.initMove()
            })
        }
      }
    },
    goDraw() {
      // startDraw(data).then(res => {})
      startDraw().then()
    },

    GoLottery() {
      this.toLottery()
    }
  },

  created() {
    this.count = 0 //
  },

  mounted() {
    this.$loading.open()
    this.initMove()
  },
  beforeDestroy() {
    clearInterval(this.timer2)
    clearInterval(this.timer)
  }
}
//this.$toast(msg)
</script>
<style lang='stylus' scoped>
.play-box {
  & > .play {
    height: 74.4vw;
    position: relative;
    padding: 0.7vw;

    & > li {
      position: absolute;
      height: 23.1vw;
      width: 25.7vw;
      box-sizing: border-box;
      text-align: center;
      color: #c14600;
      font-size: 3.2vw;
      background-image: url('../assets/images/nine-grid/normal.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      background-clip: border-box;
      padding-top: 4vw;

      &.select {
        background-image: url('../assets/images/nine-grid/select.png');
      }

      & > img {
        margin-bottom: 1vw;
        width: 60%;
        height: 60%;
        transform: scale(0);
      }
    }

    & > li:nth-child(1) {
      left: 2%;
    }

    & > li:nth-child(2) {
      left: 34.8%;
    }

    & > li:nth-child(3) {
      left: 67.5%;
    }

    & > li:nth-child(4) {
      left: 67.5%;
      top: 24.6vw;
    }

    & > li:nth-child(5) {
      left: 67.5%;
      top: 48.4vw;
    }

    & > li:nth-child(6) {
      left: 34.8%;
      top: 48.4vw;
    }

    & > li:nth-child(7) {
      left: 2%;
      top: 48.4vw;
    }

    & > li:nth-child(8) {
      left: 2%;
      top: 24.6vw;
    }

    & > li:nth-child(9) {
      left: 34.8%;
      top: 24.6vw;
      background-image: url('../assets/images/nine-grid/start.png');
      background-repeat: no-repeat;
      background-size: cover;
    }

    &> li.gameStart {
      background: url('../assets/images/start-hover.png') no-repeat;
      background-size: cover;
    }
  }
}

.Animation1 {
  animation: tran 0.3s ease 0.3s forwards;
}

.Animation2 {
  animation: tran 0.3s ease 0.5s forwards;
}

.Animation3 {
  animation: tran 0.3s ease 0.6s forwards;
}

.Animation4 {
  animation: tran 0.3s ease 0.7s forwards;
}

.Animation5 {
  animation: tran 0.3s ease 0.8s forwards;
}

.Animation6 {
  animation: tran 0.3s ease 0.9s forwards;
}

.Animation7 {
  animation: tran 0.3s ease 1s forwards;
}

.Animation8 {
  animation: tran 0.3s ease 1.1s forwards;
}

@keyframes tran {
  0% {
    transform: rotate(30deg);
    transform: scale(0.5);
  }

  30% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(165deg);
  }

  70% {
    transform: rotate(280deg);
  }

  80% {
    transform: rotate(380deg);
  }

  100% {
    transform: scale(1);
    transform: rotate(360deg);
  }
}
</style>