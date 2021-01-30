<template>
  <div class="mouse-game">
    <div class="banner-content banner">
      <div v-if="isTryGame" class="back-icon" @click="goBack"><i class="iconfont icon-back">&#xe6a4;</i></div>
      <div class="run-distance">
        <div class="time-distance">
          <div class="item">成绩<div class="num">{{roadFlgList[0].distance - 16}}m</div></div>
          <div class="item">时间<div class="num">{{countdownNumberA}}.{{countdownNumberB}}{{countdownNumberC}}s</div></div>
        </div>
      </div>
      <div class="radio-content">
        <MusicBtn></MusicBtn>
      </div>
      <div class="game-time">活动时间：{{gameDetail.beginTime | timeKeep}}至{{gameDetail.endTime | timeKeep}}</div>
    </div>
    <div class="road-content">
      <div class="road-item" :style="{'background-color': item.imgName ? '#ffebee' : ''}" v-for="(item, index) in roadFlgList" :key="index">
        <div class="road-left" v-if="isRoadLine(item.distance)">
          <img class="img" src="~@/views/cat-and-mouse/assets/img/gold.png" alt="gold">
        </div>
        <div class="road-center" v-if="isRoadLine(item.distance)">
          <div class="road-line"></div>
          <div class="gift-img" v-if="item.imgName">
            <img :src="item.imgName" alt="gift">
          </div>
          <div class="gift-name" v-if="item.imgName">{{item.productName}}</div>
        </div>
        <div class="road-right" v-if="isRoadLine(item.distance)">
          <img class="img" src="~@/views/cat-and-mouse/assets/img/gold.png" alt="gold">
        </div>
      </div>
    </div>
    <div class="gift-img-1">
      <img src="~@/views/cat-and-mouse/assets/img/gift_img.png" alt="gift">
    </div>
    <div class="gift-img-2">
      <img src="~@/views/cat-and-mouse/assets/img/gift_img.png" alt="gift">
    </div>
    <div class="gift-img-3">
      <img src="~@/views/cat-and-mouse/assets/img/gift_img_1.png" alt="gift">
    </div>
    <div class="gift-img-4">
      <img src="~@/views/cat-and-mouse/assets/img/gift_img_1.png" alt="gift">
    </div>
    <div class="mouse-and-cat">
      <!-- <CatMousePic ref="catMousePic" v-if="catAndMouseFrame.length" :frame="catAndMouseFrame"></CatMousePic> -->
      <CatMousePic ref="catMousePic"></CatMousePic>
    </div>
    <div class="mouse-hands">
      <div class="left-hand" :class="{'touch-hand': isTouchLeft, 'un-touch-hand': !isTouchLeft}">
        <div class="hand-boder-aside hand-item"></div>
        <div class="hand-boder-body hand-item"></div>
        <img class="hand-pic hand-item" src="~@/views/cat-and-mouse/assets/img/left-hand.png" alt="hand">
        <!-- <div 
          class="click-btn hand-item"
          @touchstart.stop.prevent="touchstart('0', $event)" 
          @touchend.stop.prevent="touchend('0', $event)" ></div>   -->
        <div 
          class="click-btn hand-item"
          @click.stop.prevent="leftClick($event)"></div>
      </div>
      <div class="right-hand" :class="{'touch-hand': isTouchRight, 'un-touch-hand': !isTouchRight}">
        <div class="hand-boder-aside hand-item"></div>
        <div class="hand-boder-body hand-item"></div>
        <img class="hand-pic hand-item" src="~@/views/cat-and-mouse/assets/img/right-hand.png" alt="hand">
        <!-- <div 
          class="click-btn hand-item"
          @touchstart.stop.prevent="touchstart('1', $event)" 
          @touchend.stop.prevent="touchend('1', $event)"></div>     -->
        <div 
          class="click-btn hand-item"
          @click.stop.prevent="rightClick($event)"></div>  
      </div>
    </div>
    <div class="start-game-poup" v-if="countdown.show"><div>{{countdown.name}}</div></div>
    <div class="game-over-loading" v-if="isGameOver">
      <img class="game-over" src="~@/views/cat-and-mouse/assets/img/game_over.png" alt="game-over">
      <img class="alarm" src="~@/views/cat-and-mouse/assets/img/alarm.png" alt="alarm">
    </div>
    <div class="loading" v-if="isLoading">
      <div class="donut"></div>
      <div class="loading-font">加载中...</div>
    </div>
  </div>
</template>

<script>
import MusicBtn from '@/components/MusicBtn.vue';
import CatMousePic from '@/components/CatMousePic.vue';
import Dialog from './components/dialog/index.js';
import {getGameResult} from '@/axios/cat-and-mouse.js'
export default {
  props: ['frame', 'staticFrame', 'giftList', 'gameDetail', 'gameInfo', 'isTryGame'],
  components: { 
    MusicBtn,
    CatMousePic
  },
  data() {
    return {
      roadFlgList: [
        {
          distance: 16
        },
        {
          distance: 15
        },
        {
          distance: 14
        },
        {
          distance: 13
        },
        {
          distance: 12
        },
        {
          distance: 11
        },
        {
          distance: 10
        },
        {
          distance: 9
        },
        {
          distance: 8
        },
        {
          distance: 7
        },
        {
          distance: 6
        },
        {
          distance: 5
        },
        {
          distance: 4
        },
        {
          distance: 3
        },
        {
          distance: 2
        },
        {
          distance: 1
        },
      ],
      isTouchLeft: false,
      isTouchRight: false,
      catAndMouseFrame: [],
      countdown: {
        show: false,
        timer: null,
        time: 3,
        name: '3'
      },
      isGameOver: false,
      roadGiftList: [],
      getGiftDetails: null,
      gameTimeCountDownData: {
        time: 0,
        timer: null
      },
      mouseAndCatTime: {
        timer: null,
        timeFragment: 0
      },
      startTimePoint: Date.now(),
      isLoading: true
    }
  },
  filters: {
    timeKeep(value) {
      return `${value}`.split(' ')[0];
    }
  },
  computed: {
    countdownNumberA() {
      return `${parseInt((this.gameTimeCountDownData.time % 10000) / 1000)}${parseInt((this.gameTimeCountDownData.time % 1000) / 100)}`;
    },
    countdownNumberB() {
      return parseInt((this.gameTimeCountDownData.time % 100) / 10);
    },
    countdownNumberC() {
      return parseInt(this.gameTimeCountDownData.time % 10);
    },
  },
  created() {
    this.getBackgroundImg(['banner', 'road-content']);
    this.roadGiftList = this.giftList.map((item) => {
      return {
        ...item,
        distance: item.prizeDistance + 5
      }
    });
  },
  // mounted() {
  //   this.gameTimeCountDownData.time = this.gameDetail.gameTime * 100;
  //   this.countdown.show = this.gameDetail.isCountdown === '1';
  //   if (this.countdown.show) {
  //     this.catAndMouseFrame = this.staticFrame;
  //     this.countdown.timer = window.setInterval(() => {
  //       this.countdown.time--;
  //       this.countdown.name = `${this.countdown.time}`;
  //       if (this.countdown.time === 0) {
  //         this.countdown.name = 'GO';
  //       }
  //       if (this.countdown.time < 0) {
  //         window.clearInterval(this.countdown.timer);
  //         this.countdown.timer = null;
  //         this.countdown.time = 3;
  //         this.countdown.name = '3';
  //         this.countdown.show = false;
  //         this.catAndMouseFrame = this.frame;
  //         this.gameTimeCountDown();
  //       }
  //     }, 1000);
  //   } else {
  //     this.catAndMouseFrame = this.frame;
  //     this.gameTimeCountDown();
  //   }
  // },
  mounted() {
    this.gameTimeCountDownData.time = this.gameDetail.gameTime * 100;
  },
  methods: {
    init() {
      this.countdown.show = this.gameDetail.isCountdown === '1';
      this.setTimeMethodAll();
    },
    getBackgroundImg(list) {
      const _this = this;
      Promise.all([_this.loadImg(list[0]), _this.loadImg(list[1])]).then(function(values) {
        _this.isLoading = false;
        _this.init();
      }).catch(() => {
        this.$toast('加载失败，请退出重试！')
      })
    },
    loadImg(imgItem) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const divDom = document.querySelector(`.${imgItem}`);
          divDom.style.backgroundImage = `url(${img.src})`;
          divDom.style.backgroundRepeat = 'no-repeat';
          divDom.style.backgroundSize = '100% 100%';
          resolve();
        }
        img.onerror = () => {
          reject();
        }
        img.src = require(`./assets/img/${imgItem}.png`);
      })
    },
    goBack() {
      if (this.isTryGame) {
        window.clearInterval(this.mouseAndCatTime.timer);
        this.$emit('gameOver', {
          step: this.roadFlgList[0].distance - 16,
          gift: null
        })
      }
    },
    setTimeMethodAll() {
      const _this = this;
      _this.startTimePoint = Date.now();
      _this.mouseAndCatTime.timer = window.setInterval(() => {
        _this.timeMethod(_this, _this.startTimePoint);
        // _this.mouseAndCatTime.timeFragment += 10;
      }, 16);
    },
    timeMethod(_this, startTimePoint) {
      const now = Date.now();
      const timeBetween = now - startTimePoint;
      if (_this.countdown.show) {
        // 每个200秒触发猫鼠招手的事件  3秒内
        if (timeBetween < 4000 && timeBetween % 200 < 20) {
          // 倒计时
          if (timeBetween % 1000 < 50) {
            _this.countDownMethod(parseInt(timeBetween / 1000));
          }
          if (_this.$refs.catMousePic) {
            _this.$refs.catMousePic.drawImg(_this.staticFrame);
          }
        }
        // 每个20秒触发猫鼠跑的事件
        if (timeBetween >= 4000 && timeBetween % 20 < 8) {
          _this.countdown.show = false;
          if (_this.$refs.catMousePic) {
            _this.$refs.catMousePic.drawImg(_this.frame);
          }
        }
      } else {
        // 每个20秒触发猫鼠跑的事件
        if (timeBetween % 20 < 8) {
          if (_this.$refs.catMousePic) {
            _this.$refs.catMousePic.drawImg(_this.frame);
          }
        }
        _this.gameTimeCountDownData.time = (_this.gameDetail.gameTime * 1000 - timeBetween + 4000) / 10;
        // if (timeBetween - 4000 > _this.gameDetail.gameTime * 1000 && timeBetween - 4000 - _this.gameDetail.gameTime * 1000 < 31) {
        //   _this.overGameMethod();
        // }
        if (_this.gameTimeCountDownData.time < 0) {
          if (!_this.isGameOver) {
            _this.overGameMethod();
          }
          _this.gameTimeCountDownData.time = 0;
        }
      }
    },
    countDownMethod(countdownNumber) {
      if (countdownNumber === 3) {
        this.countdown.name = 'GO';
      }
      if (countdownNumber === 2) {
        this.countdown.name = '1';
      }
      if (countdownNumber === 1) {
        this.countdown.name = '2';
      }
    },
    gameOverMinTime() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {resolve()}, 2000);
      })
    },
    getGameResult(params) {
      return new Promise((resolve, reject) => {
        getGameResult(params).then(res => {
          resolve(res);
        })
      })
    },
    // gameTimeCountDown() {
    //   const _this = this;
    //   this.gameTimeCountDownData.timer = window.setInterval(() => {
    //     this.gameTimeCountDownData.time--;
    //     if (this.gameTimeCountDownData.time < 0) {
    //       this.cleargameTimeCountDown();
    //       this.overGameMethod();
    //     }
    //   }, 10);
    // },
    // cleargameTimeCountDown() {
    //   if (this.gameTimeCountDownData.timer) {
    //     window.clearInterval(this.gameTimeCountDownData.timer);
    //   }
    //   this.gameTimeCountDownData.timer = null;
    //   this.gameTimeCountDownData.time = 0;
    // },
    overGameMethod() {
      const _this = this;
      _this.isGameOver = true;
      if (_this.isTryGame) {
        _this.gameOverMinTime().then(res => {
          window.clearInterval(_this.mouseAndCatTime.timer);
          _this.$emit('gameOver', {
            step: _this.roadFlgList[0].distance - 16,
            gift: null
          })
        })
      } else {
        const gameDistance = _this.roadFlgList[0].distance - 16;
        let jmpGiftCode = null;
        _this.giftList.forEach(item => {
          if (item.prizeDistance <= gameDistance) {
            jmpGiftCode = item.jmpGiftCode;
          }
        })
        const params = {
          id: _this.gameInfo.id,
          memberCard: _this.gameInfo.memberCard,
          gameDistance,
          jmpGiftCode
        };
        Promise.all([_this.gameOverMinTime(), _this.getGameResult(params)]).then(function(values) {
          window.clearInterval(_this.mouseAndCatTime.timer);
          _this.$emit('gameOver', {
            step: _this.roadFlgList[0].distance - 16,
            gift: values[1].data || '未中奖'
          })
        });
      }
    },
    isRoadLine(distance) {
      return distance % 2 > 0;
    },
    catJump() {
      let item = {};
      if (this.roadGiftList.length > 0 && this.roadFlgList[0].distance === this.roadGiftList[0].distance) {
        this.getGiftDetails = this.roadGiftList[0];
        item = this.roadGiftList[0];
        this.roadGiftList.shift();
      } else {
        item = {
          type: '',
          distance: this.roadFlgList[0].distance + 1
        }
      }
      if (this.getGiftDetails && this.getGiftDetails.distance === item.distance - 11) {
        Dialog({
          message: `${this.getGiftDetails.prizeDistance}米`
        })
      }
      this.roadFlgList.unshift(item);
      this.roadFlgList.pop();
    },
    leftClick(event) {
      event.preventDefault();
      this.isTouchRight = false;
      this.isTouchLeft = true;
      this.catJump();
    },
    rightClick(event) {
      event.preventDefault();
      this.isTouchLeft = false;
      this.isTouchRight = true;
      this.catJump();
    },
    // touchstart(type, event) {
    //   event.preventDefault();
    //   if (type === '0') {
    //     this.isTouchLeft = true;
    //   } else {
    //     this.isTouchRight = true;
    //   }
    //   this.catJump();
    // },
    // touchend(type, event) {
    //   event.preventDefault();
    //   if (type === '0') {
    //     this.isTouchLeft = false;
    //   } else {
    //     this.isTouchRight = false;
    //   }
    // }
  },
  destroyed() {
    this.goBack();
  }
}
</script>

<style lang="scss" scoped>
  .mouse-game {
    -webkit-user-select: none;/*禁用手机浏览器的用户选择功能 */
    -moz-user-select: none;
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .banner-content {
      position: absolute;
      top: 0;
      width: 100%;
      height: 213px;
      // background: url('~@/views/cat-and-mouse/assets/img/banner.png') no-repeat;
      // background-size: 100% 100%;
      z-index: 3001;
      .back-icon {
        position: absolute;
        left: 10px;
        top: 10px;
        color: #ffffff;
        height: 30px;
        > i {
          font-size: 24px;
        }
      }
      .run-distance {
        height: 51px;
        text-align: center;
        color: #ffffff;
        font-size: 24px;
        background-color: rgba(0, 0, 0, .4);
        .time-distance {
          width: 150px;
          height: 51px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: bold;
          font-family: SourceHanSansCN-Bold;
          .item {
            width: 50px;
            text-align: center;
            .num {
              font-size: 20px;
              font-weight: normal;
            }
          }
        }
      }
      .radio-content {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .game-time {
        color: #ffffff;
        font-size: 11px;
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 40px;
      }
    }
    .road-content {
      position: absolute;
      z-index: 3000;
      top: -22px;
      left: calc(50% - 360px);
      width: 720px;
      height: 800px;
      // background: url('~@/views/cat-and-mouse/assets/img/paodao1.png') no-repeat;
      // background-size: 100% 100%;
      transform: perspective(200px) rotateX(25deg);
      .road-item {
        height: 37px;
        width: 280px;
        text-align: center;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .road-left, .road-right {
          width: 40px;
          text-align: center;
          > .img {
            width: 30px;
            transform: rotateX(335deg);
          }
        }
        .road-center {
          flex-grow: 1;
          height: 100%;
          position: relative;
          .road-line {
            position: absolute;
            width: 18px;
            height: 37px;
            background-color: #ffebee;
            top: 0;
            left: calc(50% - 9px);
            opacity: 0.7;
          }
          .gift-img {
            position: absolute;
            bottom: 3px;
            left: 50px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 0;
            overflow: hidden;
            > img {
              width: 100%;
              height: 100%;
              border-radius: 50%；
            }
          }
          .gift-name {
            position: absolute;
            left: 100px;
            height: 37px;
            line-height: 37px;
            font-weight: bold;
          }
        }
      }
    }
    .gift-img-1, .gift-img-2, .gift-img-3, .gift-img-4 {
      position: absolute;
      width: 100px;
      z-index: 4002;
      font-size: 0;
      img {
        width: 100%;
      }
    }
    .gift-img-1 {
      left: -18px;
      top: 180px;
    }
    .gift-img-2 {
      right: -18px;
      top: 180px;
    }
    .gift-img-3 {
      left: -40px;
      top: 280px;
    }
    .gift-img-4 {
      right: -40px;
      top: 280px;
    }
    .mouse-and-cat {
      width: 140px;
      height: 200px;
      position: absolute;
      bottom: 220px;
      left: calc(50vw - 70px);
      z-index: 5000;
    }
    .mouse-hands {
      position: absolute;
      bottom: 90px;
      left: 5vw;
      z-index: 4000;
      display: flex;
      width: 90vw;
      justify-content: space-between;
      .left-hand, .right-hand {
        width: 108px;
        height: 108px;
        position: relative;
        .hand-item {
          position: absolute;
          background-color: #ffffff;
          border-radius: 50%;
        }
        .hand-boder-aside {
          width: 108px;
          height: 108px;
          opacity: .15;
          bottom: 0;
          left: 0;
        }
        .hand-boder-body {
          width: 92px;
          height: 92px;
          opacity: .25;
          bottom: 8px;
          left: 8px;
        }
        .hand-pic {
          width: 76px;
          height: 76px;
          bottom: 16px;
          left: 16px;
        }
        .click-btn {
          z-index: 5001;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
      .un-touch-hand > .hand-boder-aside {
        animation: hand_run_aside .8s linear .3s infinite alternate both;
        // animation: name duration timing-function delay iteration-count direction fill-mode;
      }
      .un-touch-hand > .hand-boder-body {
        animation: hand_run_body .8s linear .1s infinite alternate both;
      }
      .touch-hand > .hand-boder-aside {
        animation: hand_run_aside .3s linear .2s infinite alternate both;
      }
      .touch-hand > .hand-boder-body {
        animation: hand_run_body .3s linear .1s infinite alternate both;
      }
    }
    .start-game-poup {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, .5);
      z-index: 6000;
      font-size: 80px;
      color: #ffffff;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: countdown 1s linear 0s 4 normal backwards;
    }
    .game-over-loading {
      display: fixed;
      position: relative;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      line-height: 100vh;
      text-align: center;
      background-color: rgba(0, 0, 0, .5);
      z-index: 6002;
      color: #ffffff;
      .game-over {
        position: absolute;
        width: 240px;
        top: 35vh;
        left: calc(50vw - 120px);
      }
      .alarm {
        width: 100px;
        position: absolute;
        top: 48vh;
        left: calc(50vw - 50px);
        transform-origin: center bottom;
        animation: game_over .2s linear 0s infinite alternate both;
      }
      // > img {
      //   width: 50%;
      //   animation: game_over .3s linear 0s infinite alternate both;
      // }
    }
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8000;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .7);
    .donut {
      margin: calc(50vh - 25px) auto 0 auto;
      border: 4px solid rgba(0, 0, 0, .8);
      border-left-color: #ffffff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: donut-spin 1.2s linear infinite;
    }
    .loading-font {
      font-size: 14px;
      color: #ffffff;;
      text-align: center;
      padding-top: 15px;
    }
  }
  @keyframes donut-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes game_over {
    0% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(10deg);
    }
  }
  @keyframes hand_run_aside {
    0% {
      opacity: 0;
      width: 108px;
      height: 108px;
      left: 0;
      bottom: 0;
    }
    100% {
      opacity: .15;
      width: 120px;
      height: 120px;
      left: -6px;
      bottom: -6px;
    }
  }
  @keyframes hand_run_body {
    0% {
      opacity: 0;
      width: 92px;
      height: 92px;
      bottom: 8px;
      left: 8px;
    }
    100% {
      opacity: .25;
      width: 100px;
      height: 100px;
      bottom: 4px;
      left: 4px;
    }
  }
  @keyframes countdown {
    0% {
      font-size: 80px;
      opacity: 1;
    }
    10% {
      font-size: 80px;
      opacity: 1;
    }
    100% {
      font-size: 700px;
      opacity: 0;
    }
  }
</style>